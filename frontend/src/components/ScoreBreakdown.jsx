import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, Target, Zap, TrendingDown, BarChart3 } from 'lucide-react';
import useAgentStore from '../store/useAgentStore';
import { ScoreSkeleton } from './Skeletons';

export default function ScoreBreakdown() {
    const result = useAgentStore((s) => s.result);
    const isRunning = useAgentStore((s) => s.isRunning);
    if (isRunning && !result?.score) return <ScoreSkeleton />;
    if (!result?.score) return null;

    const { base, speed_bonus, efficiency_penalty, total } = result.score;
    const isError = result.final_status === 'ERROR';

    // Only show the empty state if the agent truly crashed (ERROR status with 0 score)
    // and no fixes were applied at all.
    if (isError && total === 0 && base === 0) {
        return (
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-5xl mx-auto px-4 sm:px-6 pb-8"
            >
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.05] rounded-3xl p-6 sm:p-8 shadow-2xl">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        Score Breakdown
                    </h3>
                    <div className="text-center py-8">
                        <BarChart3 className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                        <p className="text-slate-400 text-sm">
                            No score available — the agent encountered an error before completing the pipeline.
                        </p>
                        <p className="text-slate-500 text-xs mt-2">Score: 0 / 120</p>
                    </div>
                </div>
            </motion.section>
        );
    }

    const chartData = [
        { name: 'Base Score', value: base, color: '#38bdf8' },
        { name: 'Speed Bonus', value: speed_bonus, color: '#10B981' },
        { name: 'Penalty', value: efficiency_penalty, color: '#EF4444' },
        { name: 'Total', value: total, color: total >= 80 ? '#10B981' : total >= 50 ? '#F59E0B' : '#EF4444' },
    ];

    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto px-4 sm:px-6 pb-8"
        >
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.05] rounded-3xl p-6 sm:p-8 shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Score Breakdown
                </h3>

                {/* Ring + Cards */}
                <div className="flex flex-col items-center gap-8">
                    {/* Animated Ring */}
                    <AnimatedScoreRing score={total} />

                    {/* Score Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                        <ScoreCard
                            icon={<Target className="w-6 h-6 text-cyan-400" />}
                            label="Base Score"
                            value={`${base} pts`}
                            desc="Full test resolution"
                            colorClass="from-cyan-500/20 to-cyan-500/5 border-cyan-500/30"
                        />
                        <ScoreCard
                            icon={<Zap className="w-6 h-6 text-emerald-400" />}
                            label="Speed Bonus"
                            value={speed_bonus > 0 ? `+${speed_bonus}` : '0'}
                            desc="Completed in < 5 min"
                            colorClass="from-emerald-500/20 to-emerald-500/5 border-emerald-500/30"
                        />
                        <ScoreCard
                            icon={<TrendingDown className="w-6 h-6 text-red-400" />}
                            label="Efficiency Penalty"
                            value={efficiency_penalty > 0 ? `-${efficiency_penalty}` : '0'}
                            desc="-2 per commit > 20"
                            colorClass="from-red-500/20 to-red-500/5 border-red-500/30"
                        />
                    </div>
                </div>

                {/* Bar Chart */}
                <ChartSection chartData={chartData} />
            </div>
        </motion.section>
    );
}

function ChartSection({ chartData }) {
    const tickFill = '#94a3b8'; // slate-400
    const axisStroke = 'rgba(255,255,255,0.05)';
    const gridStroke = 'rgba(255,255,255,0.05)';
    const tooltipBg = 'rgba(15,23,42,0.95)'; // slate-900
    const tooltipBorder = 'rgba(255,255,255,0.1)';
    const tooltipColor = '#f8fafc'; // slate-50

    return (
        <div className="mt-8 h-56 sm:h-64 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={40} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                    <XAxis dataKey="name" tick={{ fill: tickFill, fontSize: 12 }} axisLine={{ stroke: axisStroke }} />
                    <YAxis tick={{ fill: tickFill, fontSize: 12 }} axisLine={{ stroke: axisStroke }} />
                    <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{
                            backgroundColor: tooltipBg,
                            border: `1px solid ${tooltipBorder}`,
                            borderRadius: '12px',
                            color: tooltipColor,
                            fontSize: '13px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                        }}
                        labelStyle={{ color: tooltipColor, fontWeight: 600 }}
                        itemStyle={{ color: tooltipColor }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {chartData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

function AnimatedScoreRing({ score }) {
    const [displayScore, setDisplayScore] = useState(0);
    const animFrameRef = useRef(null);

    const color = score >= 80 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444';
    const maxScore = 120;
    const pct = Math.min(score / maxScore, 1);
    const r = 80;
    const circ = 2 * Math.PI * r;
    const offset = circ * (1 - pct);

    useEffect(() => {
        let start = null;
        const duration = 2000;
        const animate = (ts) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayScore(Math.round(eased * score));
            if (progress < 1) {
                animFrameRef.current = requestAnimationFrame(animate);
            }
        };
        animFrameRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animFrameRef.current);
    }, [score]);

    return (
        <div className="relative w-48 h-48 sm:w-56 sm:h-56">
            <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                <circle cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                <motion.circle
                    cx="100" cy="100" r={r}
                    fill="none"
                    stroke={color}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    initial={{ strokeDashoffset: circ }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 2, ease: [0.33, 1, 0.68, 1] }}
                    style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl sm:text-5xl font-bold" style={{ color }}>{displayScore}</span>
                <span className="text-slate-500 text-xs uppercase tracking-wider mt-1">points</span>
            </div>
        </div>
    );
}

function ScoreCard({ icon, label, value, desc, colorClass }) {
    return (
        <motion.div
            whileHover={{ y: -2, scale: 1.01 }}
            className={`bg-gradient-to-br ${colorClass} border rounded-xl p-4 text-center transition-all duration-300`}
        >
            <div className="flex justify-center">{icon}</div>
            <p className="text-slate-400 text-xs mt-2 uppercase tracking-wider">{label}</p>
            <p className="text-white text-2xl font-bold mt-1">{value}</p>
            <p className="text-slate-500 text-xs mt-1">{desc}</p>
        </motion.div>
    );
}
