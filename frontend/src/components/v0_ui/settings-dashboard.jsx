import { useState, useEffect } from "react";
import { User, Settings, CreditCard, Github, Sparkles, Ghost, GitPullRequest, Info, Check } from "lucide-react";
import { Switch } from "@/components/v0_ui/ui/switch";
import useAgentStore from "@/store/useAgentStore";

export function SettingsDashboard() {
  const user = useAgentStore((s) => s.user);
  const [activeNav, setActiveNav] = useState("agent");
  const agentMode = useAgentStore((s) => s.agentMode);
  const setAgentMode = useAgentStore((s) => s.setAgentMode);
  const repositories = useAgentStore((s) => s.repositories);
  const githubToken = useAgentStore((s) => s.githubToken);
  const fetchUserRepos = useAgentStore((s) => s.fetchUserRepos);
  const usageMetrics = useAgentStore((s) => s.usageMetrics);

  useEffect(() => {
    if (activeNav === 'profile' && githubToken && repositories.length === 0) {
      fetchUserRepos(githubToken);
    }
  }, [activeNav, githubToken, repositories.length, fetchUserRepos]);

  const ghostMode = agentMode === 'ghost';
  const reviewMode = agentMode === 'review';

  const handleGhostToggle = (checked) => {
    if (checked) setAgentMode('ghost');
  };
  const handleReviewToggle = (checked) => {
    if (checked) setAgentMode('review');
  };
  const navItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "agent", label: "Agent Settings", icon: Settings },
    { id: "billing", label: "Billing / Usage", icon: CreditCard }
  ];
  return <div className="flex-1 h-full bg-slate-950 flex">
      {
    /* Sidebar */
  }
      <aside className="w-72 border-r border-white/[0.05] bg-slate-950/50 backdrop-blur-xl flex flex-col">
        <div className="p-6">
          {
    /* Logo */
  }
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-xl font-bold text-white">Aegis</span>
          </div>

          {
    /* Navigation */
  }
          <nav className="space-y-2">
            {navItems.map((item) => <button
    key={item.id}
    onClick={() => setActiveNav(item.id)}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeNav === item.id ? "bg-white/[0.08] text-white" : "text-slate-400 hover:text-white hover:bg-white/[0.03]"}`}
  >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>)}
          </nav>
        </div>

        {
    /* User info at bottom */
  }
        <div className="mt-auto p-6 border-t border-white/[0.05]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
              {user?.photoURL ? <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" /> : (user?.displayName?.charAt(0) || "U")}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.displayName || "User"}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email || "No email linked"}</p>
            </div>
          </div>
        </div>
      </aside>

      {
    /* Main content */
  }
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-3xl mx-auto">
          {
    /* Page header */
  }
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              {activeNav === "profile" && "Profile"}
              {activeNav === "agent" && "Agent Settings"}
              {activeNav === "billing" && "Billing & Usage"}
            </h1>
            <p className="text-slate-400">
              {activeNav === "profile" && "Manage your account and connected services"}
              {activeNav === "agent" && "Configure how the AI agent interacts with your repositories"}
              {activeNav === "billing" && "View your usage and manage subscription"}
            </p>
          </div>

          {
    /* Profile Section */
  }
          {activeNav === "profile" && <div className="space-y-6">
              {
    /* Profile Card */
  }
              <div className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.05]">
                <div className="flex items-center gap-6">
                  {
    /* Avatar */
  }
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
                      {user?.photoURL ? <img src={user.photoURL} alt="Profile Avatar" className="w-full h-full object-cover" /> : (user?.displayName?.charAt(0) || "U")}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-slate-800 border-4 border-slate-950 flex items-center justify-center">
                      <Github className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {
    /* User info */
  }
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-white">{user?.displayName || "User"}</h2>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-xs font-medium text-emerald-400">GitHub Connected</span>
                      </span>
                    </div>
                    <p className="text-slate-400">{user?.email || "GitHub User"}</p>
                    <p className="text-sm text-slate-500 mt-1">Status: Active</p>
                  </div>
                </div>
              </div>

              {
    /* Connected repositories */
  }
              <div className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.05]">
                <h3 className="text-lg font-semibold text-white mb-4">Connected Repositories</h3>
                <div className="space-y-3">
                  {repositories.length > 0 ? (
                    repositories.map((repo) => (
                      <div key={repo.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                        <div className="flex items-center gap-3">
                          <Github className="w-5 h-5 text-slate-400" />
                          <span className="text-sm font-medium text-white">{repo.full_name}</span>
                        </div>
                        <span className={`text-xs ${repo.private ? 'text-violet-400' : 'text-emerald-400'}`}>
                          {repo.private ? 'Private' : 'Public'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-center text-slate-400 text-sm">
                      No repositories found or fetching...
                    </div>
                  )}
                </div>
              </div>
            </div>}

          {
    /* Agent Settings Section */
  }
          {activeNav === "agent" && <div className="space-y-6">
              {
    /* Agent Permissions Card */
  }
              <div className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.05]">
                <h3 className="text-lg font-semibold text-white mb-2">Agent Permissions</h3>
                <p className="text-sm text-slate-400 mb-6">
                  Choose how the AI agent handles fixes for repositories you own.
                </p>

                <div className="space-y-4">
                  {
    /* Ghost Mode Toggle */
  }
                  <div 
                    onClick={() => handleGhostToggle(true)}
                    className={`p-5 rounded-xl border transition-all cursor-pointer ${ghostMode ? "bg-emerald-500/5 border-emerald-500/20" : "bg-white/[0.02] border-white/[0.05] hover:border-white/[0.1]"}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${ghostMode ? "bg-emerald-500/20" : "bg-white/[0.05]"}`}>
                          <Ghost className={`w-6 h-6 ${ghostMode ? "text-emerald-400" : "text-slate-400"}`} />
                        </div>
                        <div>
                          <h4 className="text-base font-semibold text-white mb-1">Ghost Mode (Direct Push)</h4>
                          <p className="text-sm text-slate-400 leading-relaxed">
                            Agent automatically pushes verified fixes directly to the main branch.
                          </p>
                        </div>
                      </div>
                      <Switch
    checked={ghostMode}
    onCheckedChange={handleGhostToggle}
    className="data-[state=checked]:bg-emerald-500"
  />
                    </div>
                  </div>

                  {
    /* Review Mode Toggle */
  }
                  <div 
                    onClick={() => handleReviewToggle(true)}
                    className={`p-5 rounded-xl border transition-all cursor-pointer ${reviewMode ? "bg-cyan-500/5 border-cyan-500/20" : "bg-white/[0.02] border-white/[0.05] hover:border-white/[0.1]"}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${reviewMode ? "bg-cyan-500/20" : "bg-white/[0.05]"}`}>
                          <GitPullRequest className={`w-6 h-6 ${reviewMode ? "text-cyan-400" : "text-slate-400"}`} />
                        </div>
                        <div>
                          <h4 className="text-base font-semibold text-white mb-1">Review Mode (Pull Requests)</h4>
                          <p className="text-sm text-slate-400 leading-relaxed">
                            Agent creates a new branch and submits a PR for your manual review.
                          </p>
                        </div>
                      </div>
                      <Switch
    checked={reviewMode}
    onCheckedChange={handleReviewToggle}
    className="data-[state=checked]:bg-cyan-500"
  />
                    </div>
                  </div>
                </div>
              </div>

              {
    /* Contributor Mode Info Box */
  }
              <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-violet-500/20">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                    <Info className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-white mb-2">Contributor Mode</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      For repositories you do not own, the agent will automatically default to 
                      <span className="font-medium text-violet-300"> Contributor Mode (Fork & Pull Request)</span>. 
                      This ensures proper permissions and code review workflows are respected.
                    </p>
                  </div>
                </div>
              </div>
            </div>}

          {
    /* Billing Section */
  }
          {activeNav === "billing" && <div className="space-y-6">
              {
    /* Usage Card */
  }
              <div className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.05]">
                <h3 className="text-lg font-semibold text-white mb-6">Current Usage</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-center">
                    <p className="text-3xl font-bold text-emerald-400 mb-1">{usageMetrics?.buildsAnalyzed || 0}</p>
                    <p className="text-sm text-slate-400">Builds Analyzed</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-center">
                    <p className="text-3xl font-bold text-cyan-400 mb-1">{usageMetrics?.autoFixesApplied || 0}</p>
                    <p className="text-sm text-slate-400">Auto-Fixes Applied</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-center">
                    <p className="text-3xl font-bold text-violet-400 mb-1">
                      {usageMetrics?.buildsAnalyzed > 0 
                        ? Math.round((usageMetrics.successfulBuilds / usageMetrics.buildsAnalyzed) * 100) 
                        : 0}%
                    </p>
                    <p className="text-sm text-slate-400">Success Rate</p>
                  </div>
                </div>
              </div>

              {
    /* Plan Card */
  }
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Current Plan</span>
                    <h3 className="text-2xl font-bold text-white mt-1">Free Tier</h3>
                    <p className="text-sm text-slate-400 mt-1">50 builds/month included</p>
                  </div>
                  <button className="px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-all">
                    Upgrade
                  </button>
                </div>
              </div>
            </div>}
        </div>
      </main>
    </div>;
}
