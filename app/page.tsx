import Navbar from "@/components/landing/Navbar";
import HeroWarRoom from "@/components/landing/HeroWarRoom";
import AgentMarketplace from "@/components/landing/AgentMarketplace";
import ActivityPulse from "@/components/landing/ActivityPulse";
import PricingSlider from "@/components/landing/PricingSlider";
import FAQ from "@/components/landing/FAQ";
import LiveChat from "@/components/landing/LiveChat";
import ScanEffect from "@/components/ui/ScanEffect";
import HUDOverlay from "@/components/ui/HUDOverlay";
import VoiceCommand from "@/components/landing/VoiceCommand";
import NeuralBrain from "@/components/3d/NeuralBrain";
import CommandCenter from "@/components/landing/CommandCenter";
import WorkflowBuilder from "@/components/landing/WorkflowBuilder";
import ComparisonMatrix from "@/components/landing/ComparisonMatrix";
import AgentDeploy from "@/components/landing/AgentDeploy";
import ImmersiveFooter from "@/components/landing/ImmersiveFooter";

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Jarvis HUD effects */}
      <ScanEffect />
      <HUDOverlay />
      
      {/* Circuit pattern background */}
      <div className="fixed inset-0 circuit-bg opacity-20 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-hud-blue/5 via-transparent to-hud-purple/5 pointer-events-none" />
      
      <div className="relative z-10">
        <Navbar />
        <HeroWarRoom />
        
        {/* Voice Command Demo */}
        <VoiceCommand />
        
        {/* Neural Brain Visualization */}
        <NeuralBrain />
        
        {/* Command Center Preview */}
        <CommandCenter />
        
        {/* Workflow Builder */}
        <WorkflowBuilder />
        
        <AgentMarketplace />
        
        {/* Agent Deployment Animation */}
        <AgentDeploy />
        
        {/* Comparison Matrix */}
        <ComparisonMatrix />
        
        <ActivityPulse />
        <PricingSlider />
        <FAQ />
        <ImmersiveFooter />
        <LiveChat />
      </div>
    </main>
  );
}
