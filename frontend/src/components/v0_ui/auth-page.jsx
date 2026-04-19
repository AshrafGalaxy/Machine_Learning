"use client";
import { useState } from "react";
import { Github, Mail, Lock, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/v0_ui/ui/button";
import { Input } from "@/components/v0_ui/ui/input";
import { signInWithPopup, GithubAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, githubProvider } from "@/lib/firebase";
import useAgentStore from "@/store/useAgentStore";
import { useNavigate } from "react-router-dom";

export function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorObj, setErrorObj] = useState("");
  const navigate = useNavigate();
  const login = useAgentStore((s) => s.login);

  const handleGithubLogin = async () => {
    try {
      setErrorObj("");
      const result = await signInWithPopup(auth, githubProvider);
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      login(user, token);
      navigate('/app');
    } catch (error) {
      console.error("Login failed:", error);
      setErrorObj(error.message);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) return setErrorObj("Please enter email and password");
    try {
      setErrorObj("");
      if (isSignUp) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        login(result.user, null);
        navigate('/app');
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        login(result.user, null);
        navigate('/app');
      }
    } catch (error) {
      console.error("Auth failed:", error);
      setErrorObj(error.message);
    }
  };
  return <div className="relative flex-1 flex items-center justify-center px-4 py-10 overflow-hidden bg-slate-950">
      {
    /* Background gradient effects */
  }
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900" />
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-500/5 rounded-full blur-3xl" />
      
      {
    /* Grid pattern overlay */
  }
      <div
    className="absolute inset-0 opacity-[0.03]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }}
  />

      {
    /* Glassmorphism auth card */
  }
      <div className="relative z-10 w-full max-w-md">
        <div className="p-8 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-2xl shadow-black/20">
          {
    /* Logo and welcome */
  }
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 mb-6">
              <Sparkles className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome to Aegis</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Connect your GitHub workspace to enable autonomous healing.
            </p>
          </div>

          {
    /* Primary GitHub CTA */
  }
          <Button
    size="lg"
    onClick={handleGithubLogin}
    className="w-full bg-white text-slate-900 hover:bg-slate-100 font-semibold py-6 text-base rounded-xl shadow-lg shadow-white/10 transition-all hover:scale-[1.02] mb-6"
  >
            <Github className="w-5 h-5 mr-3" />
            Continue with GitHub
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Button>

          {
    /* Divider */
  }
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
            <span className="text-sm text-slate-500 font-medium">or</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          </div>

          {
    /* Email/Password form */
  }
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
    type="email"
    placeholder="Email address"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full pl-12 pr-4 py-6 rounded-xl bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:ring-emerald-500/20"
  />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full pl-12 pr-4 py-6 rounded-xl bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:ring-emerald-500/20"
  />
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={handleEmailAuth}
              className="w-full py-6 rounded-xl border-white/[0.08] bg-white/[0.02] text-white hover:bg-white/[0.05] hover:border-white/[0.15] transition-all"
            >
              {isSignUp ? "Create Account" : "Sign In"}
            </Button>
            {errorObj && (
              <p className="text-red-400 text-sm mt-2 text-center">{errorObj}</p>
            )}
          </div>

          {
    /* GitHub requirement note */
  }
          <div className="mt-6 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
            <p className="text-xs text-cyan-400/80 text-center leading-relaxed">
              A linked GitHub account is required for repository access.
            </p>
          </div>

          {
    /* Footer links */
  }
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                {isSignUp ? "Sign In" : "Sign up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>;
}
