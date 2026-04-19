"use client";
import { useState } from "react";
import {
  Activity,
  GitBranch,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Gauge,
  Clock,
  TrendingUp,
  BarChart2,
  Zap,
  XCircle
} from "lucide-react";
import { Button } from "@/components/v0_ui/ui/button";
import { Input } from "@/components/v0_ui/ui/input";
import useAgentStore from "@/store/useAgentStore";

const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const FEATURE_LABELS = {
  git_diff_src_churn:       "Source Code Churn",
  git_diff_test_churn:      "Test Coverage Delta",
  gh_sloc:                  "Codebase Size (SLOC)",
  gh_team_size:             "Team Size",
  gh_diff_files_modified:   "Files Modified",
  gh_diff_files_added:      "Files Added",
  gh_is_pr:                 "Pull Request",
  gh_by_core_team_member:   "Core Team Commit",
};

export function DashboardSection() {
  const [repoUrl, setRepoUrl]             = useState("");
  const [isAnalyzing, setIsAnalyzing]     = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [riskResult, setRiskResult]       = useState(null);
  const [error, setError]                 = useState("");

  const githubToken = useAgentStore((s) => s.githubToken);
  const isAuthenticated = useAgentStore((s) => s.isAuthenticated);

  const handleAnalyze = async () => {
    if (!repoUrl) return;
    if (!isAuthenticated || !githubToken) {
      setError("You must sign in with GitHub first to use live risk assessment.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setRiskResult(null);
    setError("");

    try {
      const res = await fetch(`${VITE_API_URL}/api/predict-risk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo_url: repoUrl,
          github_token: githubToken,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Risk prediction failed.");
      }

      const data = await res.json();
      setRiskResult(data);
      setAnalysisComplete(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "An unknown error occurred.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const riskColor = {
    High:   "text-red-400",
    Medium: "text-amber-400",
    Low:    "text-emerald-400",
  };

  const riskBorder = {
    High:   "border-red-500/30 bg-red-500/5",
    Medium: "border-amber-500/30 bg-amber-500/5",
    Low:    "border-emerald-500/30 bg-emerald-500/5",
  };

  return (
    <section className="relative px-4 py-24 bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Section header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-cyan-400 font-medium">Live ML Risk Assessment</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Real-Time Build Risk Prediction
        </h2>
        <p className="text-slate-400 text-lg">
          Paste any public GitHub repository URL. Aegis fetches live metrics and predicts pipeline failure probability using our trained Random Forest model.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Glassmorphism container */}
        <div className="relative rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] overflow-hidden">
          {/* Header bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.05] bg-white/[0.02]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <div className="flex-1 flex justify-center">
              <span className="text-xs text-slate-500 font-mono">aegis.risk-predictor</span>
            </div>
          </div>

          {/* Dashboard content */}
          <div className="p-6 md:p-8">
            {/* Input area */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <GitBranch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <Input
                  type="text"
                  placeholder="https://github.com/owner/repository"
                  value={repoUrl}
                  onChange={(e) => { setRepoUrl(e.target.value); setError(""); }}
                  className="pl-12 h-14 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-xl focus:border-emerald-500/50 focus:ring-emerald-500/20"
                />
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !repoUrl}
                className="h-14 px-8 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Gauge className="w-5 h-5 mr-2" />
                    Assess ML Build Risk
                  </>
                )}
              </Button>
            </div>

            {/* Auth warning */}
            {!isAuthenticated && (
              <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <p className="text-sm text-amber-400">Sign in with GitHub to enable live repository risk analysis.</p>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Results area */}
            {analysisComplete && riskResult && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">

                {/* Stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard
                    icon={Shield}
                    label="Risk Level"
                    value={riskResult.risk_level || "Unknown"}
                    status={riskResult.risk_level === "High" ? "warning" : riskResult.risk_level === "Medium" ? "neutral" : "success"}
                  />
                  <StatCard
                    icon={CheckCircle2}
                    label="Prediction"
                    value={riskResult.prediction === 1 ? "Will Fail" : "Will Pass"}
                    status={riskResult.prediction === 1 ? "warning" : "success"}
                  />
                  <StatCard
                    icon={TrendingUp}
                    label="Fail Probability"
                    value={`${(riskResult.prediction_probability || 0).toFixed(1)}%`}
                    status={riskResult.risk_level === "High" ? "warning" : riskResult.risk_level === "Medium" ? "neutral" : "success"}
                  />
                  <StatCard
                    icon={Clock}
                    label="Team Size"
                    value={riskResult.raw_features?.gh_team_size ?? "—"}
                    status="neutral"
                  />
                </div>

                {/* Analysis summary */}
                <div className={`p-4 rounded-xl border ${riskBorder[riskResult.risk_level] || "border-white/[0.05] bg-white/[0.02]"}`}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">Analysis Complete</h4>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        Aegis fetched live metrics from{" "}
                        <span className="text-cyan-400 font-mono text-xs">{repoUrl}</span>{" "}
                        and ran them through the Random Forest model. The pipeline has a{" "}
                        <span className={`font-semibold ${riskColor[riskResult.risk_level] || "text-slate-300"}`}>
                          {(riskResult.prediction_probability || 0).toFixed(1)}% failure probability
                        </span>{" "}
                        — classified as{" "}
                        <span className={`font-semibold ${riskColor[riskResult.risk_level] || "text-slate-300"}`}>
                          {riskResult.risk_level} Risk
                        </span>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Explainable AI — Prediction Logs */}
                {riskResult.top_factors && riskResult.top_factors.length > 0 && (
                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart2 className="w-4 h-4 text-violet-400" />
                      <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                        Prediction Logs — Top Risk Drivers
                      </h4>
                    </div>
                    <div className="space-y-3">
                      {riskResult.top_factors.map((factor, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Zap className="w-3.5 h-3.5 text-violet-400" />
                              <span className="text-slate-300 font-medium">
                                {FEATURE_LABELS[factor.feature] || factor.feature}
                              </span>
                            </div>
                            <span className="text-violet-400 font-mono text-xs font-semibold">
                              {factor.impact}% weight
                            </span>
                          </div>
                          {/* Impact bar */}
                          <div className="w-full h-1.5 rounded-full bg-white/[0.05]">
                            <div
                              className="h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-700"
                              style={{ width: `${Math.min(factor.impact, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Raw metrics */}
                    {riskResult.raw_features && (
                      <details className="mt-4 group">
                        <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-400 transition-colors select-none">
                          View raw extracted metrics ↓
                        </summary>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          {Object.entries(riskResult.raw_features).map(([k, v]) => (
                            <div key={k} className="flex justify-between p-2 rounded-lg bg-white/[0.02] text-xs">
                              <span className="text-slate-500 truncate">{FEATURE_LABELS[k] || k}</span>
                              <span className="text-slate-300 font-mono ml-2">{v}</span>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Empty state */}
            {!analysisComplete && !isAnalyzing && !error && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-lg font-medium text-slate-300 mb-2">No Repository Analyzed</h3>
                <p className="text-sm text-slate-500 max-w-sm">
                  Paste a public GitHub repository URL above and click "Assess ML Build Risk" to get a live dynamic prediction.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon: Icon, label, value, status }) {
  const statusColors = {
    success: "text-emerald-400",
    warning: "text-amber-400",
    neutral: "text-slate-300",
  };
  return (
    <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-slate-500" />
        <span className="text-xs text-slate-500 uppercase tracking-wide">{label}</span>
      </div>
      <p className={`text-2xl font-bold ${statusColors[status]}`}>{value}</p>
    </div>
  );
}
