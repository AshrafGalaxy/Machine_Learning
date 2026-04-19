import { motion } from 'framer-motion';
import { FiGitBranch, FiCopy, FiExternalLink } from 'react-icons/fi';
import { ClipboardList, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import useAgentStore from '../store/useAgentStore';
import { SummarySkeleton } from './Skeletons';
import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

function fireConfetti() {
    const colors = ['#7C3AED', '#A78BFA', '#EC4899', '#10B981', '#F59E0B'];
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 }, colors });
    setTimeout(() => confetti({ particleCount: 50, angle: 60, spread: 60, origin: { x: 0, y: 0.65 }, colors }), 200);
    setTimeout(() => confetti({ particleCount: 50, angle: 120, spread: 60, origin: { x: 1, y: 0.65 }, colors }), 400);
}

export default function RunSummary() {
    const result = useAgentStore((s) => s.result);
    const isRunning = useAgentStore((s) => s.isRunning);
    const [copied, setCopied] = useState(false);
    const hasFiredConfetti = useRef(false);

    useEffect(() => {
        if (result?.final_status === 'PASSED' && !hasFiredConfetti.current) {
            hasFiredConfetti.current = true;
            fireConfetti();
        }
    }, [result]);

    if (isRunning && !result) return <SummarySkeleton />;
    if (!result) return null;

    const minutes = Math.floor(result.time_taken / 60);
    const seconds = Math.round(result.time_taken % 60);
    const timeStr = `${minutes}m ${seconds}s`;
    const status = result.final_status;
    const isPassed = status === 'PASSED';
    const isError = status === 'ERROR';

    const copyBranch = () => {
        navigator.clipboard.writeText(result.branch_name);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Status badge styling
    const badgeClass = isPassed
        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
        : isError
            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
            : 'bg-red-500/10 text-red-400 border border-red-500/30';

    const StatusIcon = isPassed ? CheckCircle : isError ? AlertTriangle : XCircle;
    const badgeLabel = isError ? 'Agent Execution Failure' : `CI/CD: ${status}`;

    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto px-4 sm:px-6 pb-8"
        >
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.05] rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-6 sm:p-8">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-slate-400" />
                        Run Summary
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {/* Repo URL */}
                        <InfoCard label="Repository">
                            <a
                                href={result.repo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center gap-1.5 truncate transition-colors"
                            >
                                <FiExternalLink className="flex-shrink-0" />
                                <span className="truncate">{result.repo_url.replace('https://github.com/', '')}</span>
                            </a>
                        </InfoCard>

                        {/* Team Info */}
                        <InfoCard label="Team">
                            <p className="text-white text-sm font-medium">{result.team_name}</p>
                            <p className="text-slate-500 text-xs">Leader: {result.leader_name}</p>
                        </InfoCard>

                        {/* Branch */}
                        <InfoCard label="Branch">
                            <div className="flex items-center gap-2">
                                <FiGitBranch className="text-emerald-400 flex-shrink-0" />
                                <code className="text-xs text-emerald-400 font-mono truncate">{result.branch_name}</code>
                                <button
                                    onClick={copyBranch}
                                    className="flex-shrink-0 text-slate-500 hover:text-emerald-400 transition-colors cursor-pointer"
                                    title="Copy branch name"
                                >
                                    <FiCopy size={14} />
                                </button>
                                {copied && <span className="text-xs text-emerald-400">Copied!</span>}
                            </div>
                        </InfoCard>

                        {/* Failures */}
                        <InfoCard label="Failures Detected">
                            <span className="text-2xl font-bold text-red-500">{result.total_failures}</span>
                        </InfoCard>

                        {/* Fixes */}
                        <InfoCard label="Fixes Applied">
                            <span className="text-2xl font-bold text-emerald-400">{result.total_fixes}</span>
                        </InfoCard>

                        {/* Time */}
                        <InfoCard label="Total Time">
                            <span className="text-2xl font-bold text-white">{timeStr}</span>
                        </InfoCard>
                    </div>

                    {/* Error message from backend */}
                    {isError && result.error_message && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <p className="text-red-400 text-xs font-semibold mb-1">Error Details</p>
                            <p className="text-slate-400 text-xs font-mono break-all whitespace-pre-wrap">
                                {result.error_message}
                            </p>
                        </div>
                    )}

                    {/* Status Badge */}
                    <div className="flex justify-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                            className={`px-8 py-3 rounded-full font-bold text-lg tracking-wider flex items-center gap-2 ${badgeClass}`}
                        >
                            <StatusIcon className="w-5 h-5" />
                            {badgeLabel}
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}

function InfoCard({ label, children }) {
    return (
        <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1.5">{label}</p>
            {children}
        </div>
    );
}
