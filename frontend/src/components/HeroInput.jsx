import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiUsers, FiUser } from 'react-icons/fi';
import { Rocket, Zap, RefreshCw, FolderOpen, Search, FlaskConical, Bot, Upload, RotateCw, CheckCircle, Loader2, BarChart2 } from 'lucide-react';
import useAgentStore from '../store/useAgentStore';

const FEATURE_LABELS = {
    git_diff_src_churn: "Source Code Churn",
    git_diff_test_churn: "Test Coverage Delta",
    gh_sloc: "Codebase Size (SLOC)",
    gh_team_size: "Team Size",
    gh_diff_files_modified: "Files Modified",
    gh_diff_files_added: "Files Added",
    gh_is_pr: "Pull Request",
    gh_by_core_team_member: "Core Team Commit",
};

const STEPS = [
    { label: 'Cloning repository', Icon: FolderOpen },
    { label: 'Discovering tests', Icon: Search },
    { label: 'Running tests', Icon: FlaskConical },
    { label: 'Generating fixes', Icon: Bot },
    { label: 'Pushing to branch', Icon: Upload },
    { label: 'Monitoring CI/CD', Icon: RotateCw },
];

export default function HeroInput() {
    const repoUrl = useAgentStore((s) => s.repoUrl);
    const teamName = useAgentStore((s) => s.teamName);
    const leaderName = useAgentStore((s) => s.leaderName);
    const isRunning = useAgentStore((s) => s.isRunning);
    const currentStep = useAgentStore((s) => s.currentStep);
    const result = useAgentStore((s) => s.result);
    const error = useAgentStore((s) => s.error);

    const setRepoUrl = useAgentStore((s) => s.setRepoUrl);
    const setTeamName = useAgentStore((s) => s.setTeamName);
    const setLeaderName = useAgentStore((s) => s.setLeaderName);
    const maxIterations = useAgentStore((s) => s.maxIterations);
    const setMaxIterations = useAgentStore((s) => s.setMaxIterations);
    const startRun = useAgentStore((s) => s.startRun);
    const loadDemo = useAgentStore((s) => s.loadDemo);
    const reset = useAgentStore((s) => s.reset);

    const githubToken = useAgentStore((s) => s.githubToken);
    const isAuthenticated = useAgentStore((s) => s.isAuthenticated);

    const canSubmit = !!(repoUrl || '').trim() && teamName && leaderName && !isRunning;

    // Local state for retry input so user can freely type
    const [retryInput, setRetryInput] = useState(String(maxIterations));

    const handleRetryChange = (e) => {
        setRetryInput(e.target.value);
    };

    const handleRetryBlur = () => {
        let val = parseInt(retryInput, 10);
        if (isNaN(val) || val < 1) val = 1;
        if (val > 20) val = 20;
        setRetryInput(String(val));
        setMaxIterations(val);
    };

    const [riskResult, setRiskResult] = useState(null);
    const [isPredicting, setIsPredicting] = useState(false);
    const [predictError, setPredictError] = useState(null);

    const canPredict = !!(repoUrl || '').trim() && isAuthenticated && !!githubToken && !isPredicting && !isRunning;

    const assessBuildRisk = async () => {
        setIsPredicting(true);
        setPredictError(null);
        setRiskResult(null);

        if (!githubToken) {
            setPredictError('Sign in with GitHub to enable live risk assessment.');
            setIsPredicting(false);
            return;
        }
        if (!repoUrl) {
            setPredictError('Enter a repository URL first.');
            setIsPredicting(false);
            return;
        }

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

        try {
            const res = await fetch(`${apiUrl}/api/predict-risk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    repo_url: repoUrl,
                    github_token: githubToken,
                })
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.detail || 'Failed to fetch risk prediction');
            }
            const data = await res.json();
            setRiskResult(data);
        } catch (err) {
            setPredictError(err.message);
        } finally {
            setIsPredicting(false);
        }
    };

    return (
        <section className="relative px-4 py-12">
            <div className="relative z-10 max-w-4xl mx-auto py-12 sm:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-center mb-10"
                >
                    <h2 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-3 leading-tight">
                        Heal Your CI/CD Pipeline
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
                        Enter your repository details and let our AI agent autonomously detect failures,
                        generate fixes, and heal your pipeline.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.05] rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl"
                >
                    {/* Inputs */}
                    <div className="space-y-3">
                        <InputField
                            icon={<FiGithub />}
                            placeholder="GitHub Repository URL"
                            value={repoUrl}
                            onChange={setRepoUrl}
                            disabled={isRunning}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <InputField
                                icon={<FiUsers />}
                                placeholder="Team Name"
                                value={teamName}
                                onChange={setTeamName}
                                disabled={isRunning}
                            />
                            <InputField
                                icon={<FiUser />}
                                placeholder="Team Leader Name"
                                value={leaderName}
                                onChange={setLeaderName}
                                disabled={isRunning}
                            />
                        </div>
                        {/* Retry limit */}
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                            <RefreshCw className="w-4 h-4 text-slate-500 shrink-0" />
                            <span className="text-slate-400 text-sm whitespace-nowrap">Retry Limit</span>
                            <input
                                type="number"
                                min={1}
                                max={20}
                                value={retryInput}
                                onChange={handleRetryChange}
                                onBlur={handleRetryBlur}
                                onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
                                disabled={isRunning}
                                className="w-14 bg-transparent border-none outline-none text-white text-sm font-semibold text-center
                                           [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>
                    </div>

                    {/* Risk Prediction Banner */}
                    <AnimatePresence>
                        {riskResult && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`p-4 rounded-xl border flex items-center gap-3 ${
                                    riskResult.risk_level === 'High'
                                        ? 'bg-red-500/10 border-red-500/50 text-red-400'
                                        : riskResult.risk_level === 'Medium'
                                            ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400'
                                            : 'bg-green-500/10 border-green-500/50 text-green-400'
                                }`}
                            >
                                <span className="text-lg">
                                    {riskResult.risk_level === 'High' ? '🔴' : riskResult.risk_level === 'Medium' ? '🟡' : '🟢'}
                                </span>
                                <div className="flex-1">
                                    <p className="font-semibold text-sm">
                                        {riskResult.risk_level === 'High'
                                            ? `High Risk of Pipeline Failure (${riskResult.prediction_probability}%)`
                                            : riskResult.risk_level === 'Medium'
                                                ? `Medium Risk (${riskResult.prediction_probability}%)`
                                                : `Low Risk — Safe to Build (${riskResult.prediction_probability}%)`
                                        }
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Explainable AI — Prediction Logs */}
                        {riskResult?.top_factors && riskResult.top_factors.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                            >
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
                                        <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-400 transition-colors select-none outline-none">
                                            View raw extracted metrics ↓
                                        </summary>
                                        <div className="mt-3 grid grid-cols-2 gap-2">
                                            {Object.entries(riskResult.raw_features).map(([k, v]) => (
                                                <div key={k} className="flex justify-between p-2 rounded-lg bg-white/[0.02] text-xs">
                                                    <span className="text-slate-500 truncate mr-2">{FEATURE_LABELS[k] || k}</span>
                                                    <span className="text-slate-300 font-mono shrink-0">{v}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </details>
                                )}
                            </motion.div>
                        )}
                        {predictError && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="p-4 rounded-xl border bg-red-500/10 border-red-500/50 text-red-500 flex items-center gap-3"
                            >
                                <span className="text-2xl">⚠️</span>
                                <span className="font-semibold text-sm">Error: {predictError}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <motion.button
                            whileHover={canSubmit ? { scale: 1.02 } : {}}
                            whileTap={canSubmit ? { scale: 0.98 } : {}}
                            onClick={startRun}
                            disabled={!canSubmit}
                            className={`flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold py-4 px-6 rounded-xl text-base
              transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20
              ${!canSubmit ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            {isRunning ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Agent Running...
                                </>
                            ) : (
                                <>
                                    <Rocket className="w-5 h-5" />
                                    Analyze Repository
                                </>
                            )}
                        </motion.button>

                        <motion.button
                            whileHover={canPredict ? { scale: 1.02 } : {}}
                            whileTap={canPredict ? { scale: 0.98 } : {}}
                            onClick={assessBuildRisk}
                            disabled={!canPredict}
                            title={
                                !isAuthenticated
                                    ? 'Sign in with GitHub to enable ML predictions'
                                    : !repoUrl.trim()
                                        ? 'Enter a repository URL first'
                                        : 'Assess build failure risk using ML'
                            }
                            className={`flex-1 border font-semibold py-4 px-6 rounded-xl text-base
              transition-all duration-300 flex items-center justify-center gap-2
              ${
                canPredict
                    ? 'border-emerald-500/30 bg-emerald-500/5 text-slate-300 cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/10'
                    : 'border-white/[0.03] bg-white/[0.01] text-slate-600 cursor-not-allowed opacity-50'
              }`}
                        >
                            {isPredicting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                                    Analyzing Risk...
                                </>
                            ) : (
                                <>
                                    <Bot className={`w-5 h-5 ${canPredict ? 'text-emerald-400' : 'text-slate-600'}`} />
                                    Assess ML Build Risk
                                </>
                            )}
                        </motion.button>

                        {!isRunning && !result && !error && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={loadDemo}
                                className="px-6 py-4 rounded-xl border border-white/[0.05] bg-white/[0.02] text-slate-400
                hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all duration-300
                text-sm font-medium cursor-pointer flex items-center gap-2"
                            >
                                <Zap className="w-4 h-4" />
                                Load Demo
                            </motion.button>
                        )}

                        {!isRunning && (result || error) && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={reset}
                                className="px-6 py-3.5 rounded-xl border border-accent-green/30 text-accent-green
                hover:bg-accent-green/10 transition-all duration-300
                text-sm font-medium cursor-pointer flex items-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                New Run
                            </motion.button>
                        )}
                    </div>
                </motion.div>

                {/* Progress Steps */}
                <AnimatePresence>
                    {isRunning && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -10, height: 0 }}
                            className="mt-6"
                        >
                            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.05] rounded-3xl p-6 sm:p-8">
                                <div className="space-y-3">
                                    {STEPS.map((step, i) => (
                                        <StepRow key={i} index={i} label={step.label} currentStep={currentStep} Icon={step.Icon} />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}

function InputField({ icon, placeholder, value, onChange, disabled }) {
    return (
        <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                {icon}
            </span>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-4 pl-12 pr-4
          text-white placeholder:text-slate-500 text-sm
          focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20
          disabled:opacity-50 transition-all duration-300"
            />
        </div>
    );
}

function StepRow({ index, label, currentStep, Icon }) {
    const isDone = currentStep > index;
    const isActive = currentStep === index;
    const isPending = currentStep < index;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300
        ${isActive ? 'bg-emerald-500/10 border border-emerald-500/20' : ''}
        ${isDone ? 'opacity-80' : ''}
        ${isPending ? 'opacity-40' : ''}`}
        >
            <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
                {isDone ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : isActive ? (
                    <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                ) : (
                    <Icon className="w-5 h-5 text-slate-500" />
                )}
            </div>
            <span className={`text-sm font-medium ${isActive ? 'text-white' : isDone ? 'text-emerald-400' : 'text-slate-500'}`}>
                Step {index + 1}: {label}
            </span>
            {isDone && <span className="ml-auto text-xs text-accent-green">Complete</span>}
            {isActive && <span className="ml-auto text-xs text-primary animate-pulse">Running...</span>}
        </motion.div>
    );
}
