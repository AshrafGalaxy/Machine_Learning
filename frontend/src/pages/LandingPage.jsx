import { HeroSection } from '@/components/v0_ui/hero-section';
import { FeaturesSection } from '@/components/v0_ui/features-section';
import { DashboardSection } from '@/components/v0_ui/dashboard-section';
import { MLEngineSection } from '@/components/v0_ui/ml-engine-section';
import { WorkflowSection } from '@/components/v0_ui/workflow-section';
import { ImpactSection } from '@/components/v0_ui/impact-section';

export default function LandingPage() {
  return (
    <div className="bg-slate-950 min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <DashboardSection />
      <MLEngineSection />
      <WorkflowSection />
      <ImpactSection />
    </div>
  );
}
