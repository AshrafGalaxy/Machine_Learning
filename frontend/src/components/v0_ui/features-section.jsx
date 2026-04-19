"use client";
import { Brain, Search, Wrench, ArrowRight } from "lucide-react";
const features = [
  {
    step: "01",
    icon: Brain,
    title: "Predictive Risk Model",
    description: "Uses a Random Forest Classifier trained on 1,520,967 real Python builds from the TravisTorrent 2017 dataset — achieving 86.82% accuracy with 93% precision on passing builds.",
    gradient: "from-emerald-500 to-emerald-600",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400"
  },
  {
    step: "02",
    icon: Search,
    title: "Agentic Diagnosis",
    description: "CrewAI agents analyze error traces and identify syntax, logic, or import errors with intelligent root cause analysis.",
    gradient: "from-cyan-500 to-cyan-600",
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-400"
  },
  {
    step: "03",
    icon: Wrench,
    title: "Autonomous Healing",
    description: "The agent generates a patch and verifies it in a secure Docker sandbox before applying fixes automatically.",
    gradient: "from-violet-500 to-violet-600",
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400"
  }
];
export function FeaturesSection() {
  return <section className="relative px-4 py-24 bg-slate-950">
      {
    /* Section header */
  }
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          How It Works
        </h2>
        <p className="text-slate-400 text-lg">
          Three intelligent steps to autonomous pipeline healing
        </p>
      </div>

      {
    /* Features grid */
  }
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        {features.map((feature, index) => <div
    key={feature.title}
    className="group relative"
  >
            {
    /* Glassmorphism card */
  }
            <div className="relative h-full p-8 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.05] hover:border-white/[0.1] transition-all duration-300 hover:bg-white/[0.05]">
              {
    /* Step number */
  }
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                <span className="text-xs font-mono text-slate-400">{feature.step}</span>
              </div>

              {
    /* Icon */
  }
              <div className={`w-14 h-14 rounded-xl ${feature.iconBg} flex items-center justify-center mb-6`}>
                <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
              </div>

              {
    /* Content */
  }
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>

              {
    /* Arrow connector (hidden on last item) */
  }
              {index < features.length - 1 && <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-6 h-6 text-slate-600" />
                </div>}
            </div>
          </div>)}
      </div>
    </section>;
}
