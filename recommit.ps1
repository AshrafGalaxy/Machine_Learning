cd C:\Users\Ashraf\Desktop\ML_CP

# Remove the .git directory
Remove-Item -Recurse -Force .git

# Re-initialize
git init
git config user.email "ashrafsuhail1414@gmail.com"
git config user.name "Ashraf"
git remote add origin https://github.com/AshrafGalaxy/Machine_Learning.git

# 1. Configs & Ignore
git add .gitignore
git add frontend/.gitignore
git add backend/.dockerignore
git add .dockerignore
git add .vercelignore
git commit -m "chore: configure strict file ignore policies"

# 2. Documentation
git add README.md
git add frontend/README.md
git commit -m "docs: add comprehensive Master README and architecture details"

# 3. Environment & Deps
git add backend/requirements.txt
git add backend/.env.example
git add frontend/package.json
git add frontend/package-lock.json
git commit -m "chore: add backend dependencies and frontend package locks"

# 4. Backend Core
git add backend/main.py
git add backend/config.py
git add backend/models.py
git commit -m "feat(backend): scaffold FastAPI core and Pydantic schemas"

# 5. ML & AI Engine
git add backend/agents/
git add backend/crew_orchestrator.py
git add backend/orchestrator.py
git add backend/crewai_tools.py
git commit -m "feat(ai): integrate CrewAI autonomous agents and orchestrator"

# 6. Backend Services
git add backend/services/
git commit -m "feat(backend): implement GitHub extraction and Git native services"

# 7. Backend Utilities
git add backend/utils.py
git add backend/sse_manager.py
git add backend/retrain.py
git add backend/test_*.py
git add backend/__init__.py
git commit -m "feat(backend): add streaming managers and utility functions"

# 8. Frontend Core
git add frontend/index.html
git add frontend/vite.config.js
git add frontend/eslint.config.js
git add frontend/src/main.jsx
git add frontend/src/App.jsx
git add frontend/src/index.css
git commit -m "feat(frontend): initialize Vite React environment and entry points"

# 9. Frontend State
git add frontend/src/store/
git add frontend/src/lib/
git commit -m "feat(frontend): implement Zustand state management and utilities"

# 10. Frontend Components
git add frontend/src/pages/
git add frontend/src/components/*.jsx
git commit -m "feat(frontend): build interactive prediction dashboards and log views"

# 11. Frontend v0 UI Library
git add frontend/src/components/v0_ui/
git commit -m "feat(frontend): assemble v0 UI component library and hooks"

# 12. Deployment Configs
git add Dockerfile.sandbox
git add docker-compose.yml
git add render.yaml
git add frontend/Dockerfile
git commit -m "chore: configure Docker sandboxes and Render/Vercel deployment files"

# 13. Data/Pipelines
git add ML_Predictor.ipynb
git add ML_Predictor_extracted.txt
git commit -m "docs(ml): add ML predictor notebooks and data references"

# 14. Remaining Scripts/Files
git add .
git commit -m "chore: initial commit of remaining project configurations"

# Force push to rewrite the ugly single commit
git branch -m main
git push -u origin main --force
