import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import useAgentStore from './store/useAgentStore';
import Navbar from './components/Navbar';
import HeroInput from './components/HeroInput';
import RunSummary from './components/RunSummary';
import ScoreBreakdown from './components/ScoreBreakdown';
import FixesTable from './components/FixesTable';
import CICDTimeline from './components/CICDTimeline';
import ActivityLog from './components/ActivityLog';
// New v0 Views
import LandingPage from './pages/LandingPage';
import { AuthPage } from './components/v0_ui/auth-page';
import { SettingsDashboard } from './components/v0_ui/settings-dashboard';
import { Footer } from './components/v0_ui/footer';

function ErrorBanner() {
  const error = useAgentStore((s) => s.error);
  if (!error) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-5xl mx-auto px-4 sm:px-6 pt-6"
      >
        <div className="bg-accent-red/10 border border-accent-red/30 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div>
            <p className="text-accent-red font-semibold text-sm">Pipeline Error</p>
            <p className="text-text-secondary text-xs mt-0.5 break-all">{error}</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function ProtectedRoute({ children }) {
  const isAuthenticated = useAgentStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/auth" />;
  return children;
}

function CoreAppView() {
  const result = useAgentStore((s) => s.result);
  const liveLog = useAgentStore((s) => s.liveLog);
  const isRunning = useAgentStore((s) => s.isRunning);

  const iterations = result?.iterations || result?.cicd_runs || [];

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1">
        <HeroInput />
        <ErrorBanner />
        <RunSummary />
        <ScoreBreakdown />
        <FixesTable />
        <CICDTimeline iterations={iterations} />

        {/* Activity Log — uniform wrapper */}
        {(isRunning || liveLog.length > 0) && (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-8">
            <ActivityLog logs={liveLog} />
          </section>
        )}
      </main>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    useAgentStore.getState().checkBackend();
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col relative z-0">
        <Navbar />
        <div className="flex-1 flex flex-col pt-24">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/app" element={<ProtectedRoute><CoreAppView /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsDashboard /></ProtectedRoute>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
