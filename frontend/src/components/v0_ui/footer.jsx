import { Github, FileText, Database } from "lucide-react";
import useAgentStore from "@/store/useAgentStore";

const links = [
  {
    label: "GitHub",
    href: "https://github.com",
    icon: Github
  },
  {
    label: "Documentation",
    href: "/",
    icon: FileText
  },
  {
    label: "Dataset",
    href: "https://travistorrent.testroots.org/",
    icon: Database
  }
];
export function Footer() {
  const backendOnline = useAgentStore((s) => s.backendOnline);
  const statusColor = backendOnline ? 'bg-emerald-400' : 'bg-red-400';
  const statusText  = backendOnline ? 'System Online'   : 'Backend Offline';
  const statusTextColor = backendOnline ? 'text-emerald-400' : 'text-red-400';

  return <footer className="relative px-4 py-8 bg-slate-950 border-t border-white/[0.05]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {
    /* Left side */
  }
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <div>
              <p className="text-white font-semibold">Aegis</p>
              <p className="text-sm text-slate-500">Autonomous CI/CD Agent Platform</p>
            </div>
          </div>

          {/* System Status Display Center/Left */}
          <div className="flex items-center gap-2 border border-white/[0.05] bg-white/[0.02] px-3 py-1.5 rounded-full">
              <span className="relative flex h-2 w-2">
                  {backendOnline && (
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${statusColor} opacity-75`}></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${statusColor}`}></span>
              </span>
              <span className={`text-xs ${statusTextColor} font-medium`}>{statusText}</span>
          </div>

          {
    /* Right side: Links */
  }
          <nav className="flex items-center gap-6">
            {links.map((link) => <a
    key={link.label}
    href={link.href}
    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
  >
                <link.icon className="w-4 h-4" />
                <span className="text-sm">{link.label}</span>
              </a>)}
          </nav>
        </div>

        {
    /* Bottom bar */
  }
        <div className="mt-8 pt-8 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-600">
            Built with React, Vite, TailwindCSS &amp; CrewAI &middot; Powered by Random Forest Classifier
          </p>
          <p className="text-xs text-slate-500 font-medium">
            &copy; 2026 Aegis
          </p>
        </div>
      </div>
    </footer>;
}
