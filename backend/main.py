"""
RIFT 2026 — FastAPI Application

Endpoints:
  POST /api/run         — Start the self-healing pipeline (blocking, returns JSON)
  POST /api/run-stream  — Start with SSE streaming for real-time progress
  GET  /api/results     — Get the latest results.json
  GET  /api/health      — Health check
"""
import asyncio
import json
import logging
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import joblib
from huggingface_hub import hf_hub_download

from models import RunRequest, RunResult
from crew_orchestrator import run_pipeline
from services.results_service import results_service
from sse_manager import SSEManager
from services.github_service import GitHubStatsProcessor

# ---------- Logging ----------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
    ],
)
logger = logging.getLogger("rift")

# Thread pool for running sync pipeline code without blocking the event loop
_executor = ThreadPoolExecutor(max_workers=2)

# ---------- ML Model Loading ----------

model_path = Path(__file__).parent / "travis_python_risk_predictor.pkl"
ml_model = None
try:
    if not model_path.exists():
        logger.info(f"ML model file not found at {model_path}. Downloading from Hugging Face Hub...")
        # Hugging Face fallback dynamic load
        hf_hub_download(
            repo_id="Ashraf01k/Aegis_Model",  # TODO: Replace with your actual HF repo ID
            filename="travis_python_risk_predictor.pkl",
            local_dir=str(Path(__file__).parent)
        )
    ml_model = joblib.load(str(model_path))
    logger.info(f"Loaded ML model from {model_path}")
except Exception as e:
    logger.error(f"Failed to load ML model: {e}", exc_info=True)

# ---------- Pydantic Schemas ----------

class RiskPredictionRequest(BaseModel):
    repo_url: str
    github_token: str
# ---------- FastAPI App ----------

app = FastAPI(
    title="Autonomous Self-Healing CI/CD Pipeline",
    description="Autonomous self-healing CI/CD agent backend",
    version="1.0.0",
)

# ---------- CORS ----------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Routes ----------

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Aegis CI/CD Agent",
        "version": "1.0.0",
    }


@app.post("/api/predict-risk")
async def predict_risk(request: RiskPredictionRequest):
    if ml_model is None:
        raise HTTPException(status_code=503, detail="ML model is not loaded or unavailable.")
    
    try:
        processor = GitHubStatsProcessor(request.github_token)
        feats = processor.extract_features(request.repo_url)
    except Exception as e:
        logger.error(f"Failed to fetch GitHub stats: {e}")
        raise HTTPException(status_code=400, detail="Failed to fetch GitHub stats. Provide a valid Git URL.")

    expected_order = [
        "gh_team_size",
        "git_diff_src_churn",
        "git_diff_test_churn",
        "gh_diff_files_modified",
        "gh_diff_files_added",
        "gh_sloc",
        "gh_is_pr",
        "gh_by_core_team_member"
    ]
    data_2d = [[feats[k] for k in expected_order]]
    
    try:
        prediction = ml_model.predict(data_2d)
        probabilities = ml_model.predict_proba(data_2d)
        
        prob_fail = float(probabilities[0][1]) if len(probabilities[0]) > 1 else float(probabilities[0][0])
        failure_prob_pct = round(prob_fail * 100, 2)
        
        will_fail = bool(prediction[0])
        
        if failure_prob_pct > 65:
            risk_level = "High"
        elif failure_prob_pct > 35:
            risk_level = "Medium"
        else:
            risk_level = "Low"
            
        top_factors = []
        if hasattr(ml_model, "feature_importances_"):
            importances = ml_model.feature_importances_
            combined = sorted(zip(expected_order, importances), key=lambda x: x[1], reverse=True)
            for f_name, f_val in combined[:3]:
                top_factors.append({"feature": f_name, "impact": round(f_val * 100, 1)})
            
        return {
            "prediction": 1 if will_fail else 0,
            "prediction_probability": failure_prob_pct,
            "risk_level": risk_level,
            "top_factors": top_factors,
            "raw_features": feats
        }
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/run", response_model=RunResult)
async def start_run(request: RunRequest):
    """Start the pipeline (blocking — no streaming)."""
    logger.info(f"NEW RUN (blocking): {request.repo_url}")
    try:
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            _executor,
            lambda: asyncio.run(run_pipeline(request))
        )
        return result
    except Exception as e:
        logger.error(f"Run failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/run-stream")
async def start_run_stream(request: RunRequest):
    """
    Start pipeline with SSE streaming.
    Pipeline runs in a THREAD so the event loop stays free to yield events.
    """
    logger.info(f"NEW RUN (SSE): {request.repo_url}")

    loop = asyncio.get_event_loop()
    sse = SSEManager()
    queue = sse.create_queue(loop)

    def run_sync():
        """Run the async pipeline from within a thread."""
        try:
            asyncio.run(run_pipeline(request, sse=sse))
        except Exception as e:
            logger.error(f"Pipeline error: {e}", exc_info=True)
            sse.error(str(e))
            sse.done()

    # Run pipeline in thread executor → event loop stays free to yield SSE
    loop.run_in_executor(_executor, run_sync)

    async def event_generator():
        while True:
            try:
                event = await asyncio.wait_for(queue.get(), timeout=300)
                event_type = event.get("event", "log")
                data = event.get("data", "")
                yield f"event: {event_type}\ndata: {data}\n\n"
                if event_type == "done":
                    break
            except asyncio.TimeoutError:
                yield f": keepalive\n\n"
            except Exception as e:
                logger.error(f"SSE error: {e}")
                yield f"event: error\ndata: {json.dumps({'message': str(e)})}\n\n"
                break

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@app.get("/api/results")
async def get_results():
    data = results_service.load()
    if data is None:
        raise HTTPException(status_code=404, detail="No results found.")
    return data


@app.on_event("startup")
async def on_startup():
    logger.info("Aegis CI/CD Agent backend started")
    logger.info("   Docs: http://localhost:8000/docs")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app", host="0.0.0.0", port=8000,
        reload=False
    )
