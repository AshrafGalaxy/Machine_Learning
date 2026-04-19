"use client";
import { Github, Cpu, Sparkles, Rocket } from "lucide-react";
import { Button } from "@/components/v0_ui/ui/button";
import { useNavigate } from "react-router-dom";
import useAgentStore from "@/store/useAgentStore";

export function HeroSection() {
  const navigate = useNavigate();
  const isAuthenticated = useAgentStore((s) => s.isAuthenticated);
  return <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {
    /* Background gradient effects */
  }
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      
      {
    /* Grid pattern overlay */
  }
      <div
    className="absolute inset-0 opacity-[0.03]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }}
  />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {
    /* Badge */
  }
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-emerald-400 font-medium">Autonomous CI/CD Platform</span>
        </div>

        {
    /* Main title */
  }
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight text-balance">
          Aegis: Autonomous
          <span className="block bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            CI/CD Agent
          </span>
        </h1>

        {
    /* Subtitle */
  }
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed text-pretty">
          Predicting build failures using <span className="text-emerald-400 font-medium">Machine Learning</span> and 
          self-healing with <span className="text-cyan-400 font-medium">Agentic AI</span>
        </p>

        {/* CTA Button */}
        <Button
          size="lg"
          onClick={() => isAuthenticated ? navigate("/app") : navigate("/auth")}
          className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-8 py-6 text-lg rounded-xl shadow-lg shadow-white/10 transition-all hover:scale-105"
        >
          {isAuthenticated ? <Rocket className="w-5 h-5 mr-2" /> : <Github className="w-5 h-5 mr-2" />}
          {isAuthenticated ? "Go to Dashboard" : "Sign in with GitHub"}
        </Button>

        {
    /* Tech stack indicator */
  }
        <div className="mt-12 flex items-center justify-center gap-8 text-slate-500">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            <span className="text-sm">Random Forest</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-600" />
          <div className="flex items-center gap-2">
            <span className="text-sm">CrewAI</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-600" />
          <div className="flex items-center gap-2">
            <span className="text-sm">Docker</span>
          </div>
        </div>
      </div>
    </section>;
}
