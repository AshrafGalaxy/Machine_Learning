"use client";
import { Clock, Cpu, Brain, TrendingDown, Zap, Target } from "lucide-react";
const stats = [
  {
    icon: Clock,
    metric: "Model Accuracy",
    value: "86.82%",
    description: "Trained on 1.52M real Python CI/CD builds from the TravisTorrent 2017 dataset. Validated against 284,844 unseen builds.",
    accentIcon: TrendingDown,
    gradient: "from-emerald-500 to-emerald-600"
  },
  {
    icon: Cpu,
    metric: "Pass Precision",
    value: "93%",
    description: "When Aegis predicts a build will pass, it is correct 93% of the time — giving your team high confidence to ship without waiting.",
    accentIcon: Zap,
    gradient: "from-cyan-500 to-cyan-600"
  },
  {
    icon: Brain,
    metric: "Builds Analyzed",
    value: "1.52M",
    description: "The Random Forest classifier was trained on all 1,520,967 Python build records in the dataset — zero synthetic data, zero shortcuts.",
    accentIcon: Target,
    gradient: "from-violet-500 to-violet-600"
  }
];
export function ImpactSection() {
  return <section className="relative px-4 py-32 bg-slate-950 overflow-hidden">
      {
    /* Background glow */
  }
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      
      {
    /* Section header */
  }
      <div className="relative max-w-4xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
          <TrendingDown className="w-4 h-4 text-violet-400" />
          <span className="text-sm text-violet-400 font-medium">Impact</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 text-balance">
          Why Proactive DevOps Matters
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Transform your pipeline from reactive firefighting to proactive intelligence
        </p>
      </div>

      {
    /* Stats cards */
  }
      <div className="relative max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((stat) => <div
    key={stat.metric}
    className="group relative"
  >
              {
    /* Glow effect on hover */
  }
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-10 rounded-2xl blur-xl transition-opacity duration-500`} />
              
              {
    /* Card */
  }
              <div className="relative h-full p-8 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] hover:border-white/[0.1] transition-all duration-300">
                {
    /* Top row: Icons */
  }
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <stat.accentIcon className="w-6 h-6 text-slate-600 group-hover:text-slate-400 transition-colors" />
                </div>
                
                {
    /* Metric label */
  }
                <p className="text-slate-400 text-sm uppercase tracking-wide mb-2">{stat.metric}</p>
                
                {
    /* Value */
  }
                <p className="text-5xl md:text-6xl font-bold text-white mb-4">{stat.value}</p>
                
                {
    /* Description */
  }
                <p className="text-slate-400 leading-relaxed">{stat.description}</p>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
}
