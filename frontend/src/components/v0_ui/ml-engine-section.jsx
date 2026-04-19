"use client";
import {
  FileCode,
  TestTube2,
  Users,
  FileEdit,
  FilePlus,
  Code,
  GitPullRequest,
  UserCheck,
  Sparkles
} from "lucide-react";
const metrics = [
  {
    icon: FileCode,
    label: "Source Churn",
    description: "Lines modified in source files"
  },
  {
    icon: TestTube2,
    label: "Test Churn",
    description: "Changes to test files"
  },
  {
    icon: Users,
    label: "Team Size",
    description: "Number of contributors"
  },
  {
    icon: FileEdit,
    label: "Files Modified",
    description: "Total files changed"
  },
  {
    icon: FilePlus,
    label: "Files Added",
    description: "New files in commit"
  },
  {
    icon: Code,
    label: "Total SLOC",
    description: "Source lines of code"
  },
  {
    icon: GitPullRequest,
    label: "PR Status",
    description: "Pull request state"
  },
  {
    icon: UserCheck,
    label: "Core Member",
    description: "Contributor experience"
  }
];
export function MLEngineSection() {
  return <section className="relative px-4 py-32 bg-slate-950 overflow-hidden">
      {
    /* Background glow effects */
  }
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
      
      {
    /* Section header */
  }
      <div className="relative max-w-4xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-emerald-400 font-medium">Machine Learning</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 text-balance">
          Powered by Predictive Analytics
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Our model was trained on all <span className="text-emerald-400 font-semibold">1,520,967 Python builds</span> from TravisTorrent 2017, analyzing 8 key pre-build metrics to predict failure probability before your CI/CD pipeline even starts
        </p>
      </div>

      {
    /* Metrics grid */
  }
      <div className="relative max-w-5xl mx-auto mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, index) => <div
    key={metric.label}
    className="group relative p-6 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] hover:border-emerald-500/30 transition-all duration-300 hover:bg-white/[0.04]"
  >
              {
    /* Metric number */
  }
              <div className="absolute top-3 right-3">
                <span className="text-xs font-mono text-slate-600">{String(index + 1).padStart(2, "0")}</span>
              </div>
              
              {
    /* Icon */
  }
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                <metric.icon className="w-6 h-6 text-emerald-400" />
              </div>
              
              {
    /* Content */
  }
              <h3 className="text-white font-semibold mb-1">{metric.label}</h3>
              <p className="text-sm text-slate-500">{metric.description}</p>
            </div>)}
        </div>
      </div>

      {
    /* Glowing callout box */
  }
      <div className="relative max-w-3xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-emerald-500/20 rounded-2xl blur-xl" />
        <div className="relative p-8 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-emerald-500/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-lg">Random Forest Classifier</h4>
                <p className="text-slate-400">Trained on 1.52M real Travis CI Python builds</p>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-400">86.82%</p>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Accuracy</p>
              </div>
              <div className="w-px h-12 bg-slate-700" />
              <div className="text-center">
                <p className="text-3xl font-bold text-cyan-400">1.52M</p>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Python Builds</p>
              </div>
              <div className="w-px h-12 bg-slate-700" />
              <div className="text-center">
                <p className="text-3xl font-bold text-violet-400">93%</p>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Pass Precision</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <p className="text-sm text-slate-400 text-center">
              Dataset: <span className="text-white">TravisTorrent 2017</span> &middot; Trained on all <span className="text-emerald-400">1,424,218 valid Python builds</span> &middot; Test set: <span className="text-cyan-400">284,844 rows</span>
            </p>
          </div>
        </div>
      </div>
    </section>;
}
