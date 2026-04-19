import { motion } from 'framer-motion';
import { GitCommit, CheckCircle, XCircle, AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import useAgentStore from '../store/useAgentStore';
import { TimelineSkeleton } from './Skeletons';

export default function CICDTimeline({ iterations = [] }) {
    const result = useAgentStore((s) => s.result);
    const isRunning = useAgentStore((s) => s.isRunning);

    // Only healing iterations (number >= 1)
    const healingRuns = iterations.filter((iter) => iter.number >= 1);

    const lastRun = healingRuns.length > 0 ? healingRuns[healingRuns.length - 1] : null;
    const overallPassed = lastRun?.status === 'PASSED' || (lastRun?.failed === 0 && lastRun?.total > 0);

    if (isRunning && healingRuns.length === 0) return <TimelineSkeleton />;
    if (!result && !isRunning) return null;

    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto px-4 sm:px-6 pb-8"
        >
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.05] rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-6 sm:p-8">
                    {/* Header */}
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <GitCommit className="w-5 h-5 text-emerald-400" />
                        CI/CD Pipeline Timeline
                        <span className="text-xs text-slate-500 font-normal ml-auto">
                            {healingRuns.length} {healingRuns.length === 1 ? 'iteration' : 'iterations'}
                        </span>
                    </h3>

                    {/* Empty state */}
                    {healingRuns.length === 0 ? (
                        <div className="text-center py-8">
                            <Clock className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                            <p className="text-slate-500 text-sm">
                                No healing iterations recorded.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Horizontal scrolling cards */}
                            <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-thin">
                                {healingRuns.map((iter, idx) => {
                                    const isPassed = iter.status === 'PASSED' || (iter.failed === 0 && iter.total > 0);

                                    return (
                                        <div key={iter.number} className="flex items-center gap-2 shrink-0">
                                            {/* Card */}
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className={`
                          relative rounded-xl border px-4 py-3 min-w-[140px]
                          ${isPassed
                                                        ? 'bg-emerald-500/10 border-emerald-500/30'
                                                        : 'bg-red-500/10 border-red-500/30'
                                                    }
                        `}
                                            >
                                                {/* Top row: iteration + icon */}
                                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                                    <span className="text-sm font-bold text-white">
                                                        #{iter.number}
                                                    </span>
                                                    {isPassed ? (
                                                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                                                    ) : (
                                                        <XCircle className="w-4 h-4 text-red-500" />
                                                    )}
                                                </div>

                                                {/* Test counts */}
                                                <div className="text-xs space-y-0.5">
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-500">Passed</span>
                                                        <span className="text-emerald-400 font-semibold">{iter.passed}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-500">Failed</span>
                                                        <span className="text-red-500 font-semibold">{iter.failed}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-500">Total</span>
                                                        <span className="text-white font-semibold">{iter.total}</span>
                                                    </div>
                                                </div>

                                                {/* Fixes info */}
                                                {iter.fixes_applied > 0 && (
                                                    <div className="mt-1.5 pt-1.5 border-t border-white/[0.05] text-[10px] text-slate-500">
                                                        {iter.fixes_applied} fix(es) applied
                                                    </div>
                                                )}

                                                {/* Timestamp */}
                                                {iter.timestamp && (
                                                    <div className="mt-1 text-[10px] text-slate-500 tabular-nums">
                                                        {new Date(iter.timestamp).toLocaleTimeString()}
                                                    </div>
                                                )}
                                            </motion.div>

                                            {/* Arrow between cards */}
                                            {idx < healingRuns.length - 1 && (
                                                <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Summary footer */}
                            <div
                                className={`mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium ${overallPassed
                                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                                    : 'bg-red-500/10 border border-red-500/20 text-red-500'
                                    }`}
                            >
                                {overallPassed ? (
                                    <CheckCircle className="w-4 h-4 shrink-0" />
                                ) : (
                                    <AlertTriangle className="w-4 h-4 shrink-0" />
                                )}
                                {overallPassed
                                    ? `All tests passed on iteration ${lastRun.number}`
                                    : `${lastRun.failed} test(s) still failing after ${healingRuns.length} iteration(s)`}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </motion.section>
    );
}
