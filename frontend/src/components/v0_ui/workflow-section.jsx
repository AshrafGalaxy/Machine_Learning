"use client";
import { GitBranch, GitPullRequest, Github, ArrowRight, Shield, Zap } from "lucide-react";
export function WorkflowSection() {
  return <section className="relative px-4 py-32 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {
    /* Background pattern */
  }
      <div
    className="absolute inset-0 opacity-[0.02]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }}
  />

      {
    /* Section header */
  }
      <div className="relative max-w-4xl mx-auto text-center mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
          <Github className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-cyan-400 font-medium">Integration</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 text-balance">
          Seamless GitHub Integration
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Intelligent access control that adapts to your repository permissions
        </p>
      </div>

      {
    /* Zig-zag layout */
  }
      <div className="relative max-w-6xl mx-auto space-y-24">
        {
    /* Block 1: Owner Mode - Left text, Right visual */
  }
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 lg:pr-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">Full Access</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Owner Mode
              <span className="block text-emerald-400">Direct Push</span>
            </h3>
            <p className="text-slate-400 text-lg leading-relaxed mb-6">
              When you own the repository, our AI agents have the authority to patch the code and push directly to the main branch. This enables <span className="text-white font-medium">zero-touch healing</span> with minimal latency.
            </p>
            <ul className="space-y-3">
              {["Automatic code patching", "Direct main branch commits", "Instant pipeline recovery"].map((item) => <li key={item} className="flex items-center gap-3 text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-3 h-3 text-emerald-400" />
                  </div>
                  {item}
                </li>)}
            </ul>
          </div>
          
          {
    /* Visual representation */
  }
          <div className="flex-1 w-full">
            <div className="relative p-8 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.05]">
              <div className="flex items-center justify-center gap-6">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <Github className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-xs text-slate-500 font-mono">your-repo</span>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <ArrowRight className="w-8 h-8 text-emerald-400" />
                  <span className="text-xs text-emerald-400 font-mono">direct push</span>
                </div>
                
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                    <GitBranch className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-xs text-slate-500 font-mono">main</span>
                </div>
              </div>
              
              {
    /* Code snippet mock */
  }
              <div className="mt-8 p-4 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-sm">
                <div className="text-slate-500">$ git push origin main</div>
                <div className="text-emerald-400">Enumerating objects: 5, done.</div>
                <div className="text-emerald-400">Writing objects: 100% (3/3)</div>
                <div className="text-white">To github.com:you/your-repo.git</div>
                <div className="text-cyan-400">   a1b2c3d..e4f5g6h  main -{">"} main</div>
              </div>
            </div>
          </div>
        </div>

        {
    /* Divider */
  }
        <div className="flex items-center justify-center">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        </div>

        {
    /* Block 2: Contributor Mode - Right text, Left visual */
  }
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16">
          <div className="flex-1 lg:pl-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <GitPullRequest className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-400 font-medium">Collaborative</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Contributor Mode
              <span className="block text-cyan-400">Fork &amp; PR</span>
            </h3>
            <p className="text-slate-400 text-lg leading-relaxed mb-6">
              For public repositories you don&apos;t own, the AI automatically forks the project, creates a new feature branch, and submits a <span className="text-white font-medium">Pull Request</span> for your review before merging.
            </p>
            <ul className="space-y-3">
              {["Automatic repository forking", "Feature branch creation", "PR submission for review"].map((item) => <li key={item} className="flex items-center gap-3 text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-3 h-3 text-cyan-400" />
                  </div>
                  {item}
                </li>)}
            </ul>
          </div>
          
          {
    /* Visual representation */
  }
          <div className="flex-1 w-full">
            <div className="relative p-8 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.05]">
              <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <Github className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-xs text-slate-500 font-mono">original</span>
                </div>
                
                <ArrowRight className="w-5 h-5 text-slate-600" />
                
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-cyan-500/30 flex items-center justify-center">
                    <GitBranch className="w-7 h-7 text-cyan-400" />
                  </div>
                  <span className="text-xs text-slate-500 font-mono">fork</span>
                </div>
                
                <ArrowRight className="w-5 h-5 text-slate-600" />
                
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
                    <GitPullRequest className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-xs text-slate-500 font-mono">PR</span>
                </div>
              </div>
              
              {
    /* PR mock */
  }
              <div className="mt-8 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-3 mb-3">
                  <GitPullRequest className="w-5 h-5 text-cyan-400" />
                  <span className="text-white font-medium">fix: resolve build failure</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs">Open</span>
                  <span className="text-slate-500">ci-agent wants to merge 1 commit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
}
