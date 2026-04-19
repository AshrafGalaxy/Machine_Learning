import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Sparkles, Navigation } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAgentStore from '../store/useAgentStore';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;
    const isAuthenticated = useAgentStore((s) => s.isAuthenticated);
    const logout = useAgentStore((s) => s.logout);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <motion.nav
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed top-4 left-4 right-4 z-50 max-w-7xl mx-auto flex items-center justify-between px-3 md:px-5 py-2 md:py-3 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/[0.08] shadow-2xl"
        >
            {/* Logo Section */}
            <div className="flex items-center gap-3">
                <Link to="/" className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Sparkles className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300" />
                    </div>
                    <div className="hidden sm:block">
                        <h1 className="text-sm sm:text-base font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent leading-none">
                            Aegis
                        </h1>
                    </div>
                </Link>
            </div>

            {/* Navigation Pill Section */}
            <div className="flex items-center gap-1.5 sm:gap-2">
                {!isAuthenticated ? (
                    <Link
                        to="/auth"
                        className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                            currentPath === '/auth'
                                ? 'bg-white text-slate-900'
                                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                        }`}
                    >
                        Sign In
                    </Link>
                ) : (
                    <>
                        <Link
                            to="/app"
                            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all hidden sm:block ${
                                currentPath === '/app'
                                    ? 'bg-white text-slate-900'
                                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                            }`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/settings"
                            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all hidden sm:block ${
                                currentPath === '/settings'
                                    ? 'bg-white text-slate-900'
                                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                            }`}
                        >
                            Settings
                        </Link>
                        <div className="w-[1px] h-5 bg-white/[0.1] hidden sm:block mx-1"></div>
                        <button
                            onClick={handleLogout}
                            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                        >
                            Sign Out
                        </button>
                    </>
                )}
            </div>
        </motion.nav>
    );
}
