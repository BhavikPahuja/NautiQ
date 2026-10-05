import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { SihDemoModal } from './components/SihDemoModal';
import { DashboardPage } from './pages/DashboardPage';
import { FleetPage } from './pages/FleetPage';
import { MapPage } from './pages/MapPage';
import { PredictionPage } from './pages/PredictionPage';
import { OptimizationPage } from './pages/OptimizationPage';
import { ScenarioPage } from './pages/ScenarioPage';
import { DisruptionPage } from './pages/DisruptionPage';
import { BenchmarkPage } from './pages/BenchmarkPage';
import { CarbonPage } from './pages/CarbonPage';
import { CopilotPage } from './pages/CopilotPage';
import { Anchor, ShieldCheck } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardPage
            onNavigateTab={setCurrentTab}
            onOpenDemo={() => setIsDemoModalOpen(true)}
          />
        );
      case 'fleet':
        return <FleetPage />;
      case 'map':
        return <MapPage />;
      case 'prediction':
        return <PredictionPage />;
      case 'optimization':
        return <OptimizationPage />;
      case 'scenarios':
        return <ScenarioPage />;
      case 'disruptions':
        return <DisruptionPage />;
      case 'benchmark':
        return <BenchmarkPage />;
      case 'carbon':
        return <CarbonPage />;
      case 'copilot':
        return <CopilotPage />;
      default:
        return (
          <DashboardPage
            onNavigateTab={setCurrentTab}
            onOpenDemo={() => setIsDemoModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenDemoModal={() => setIsDemoModalOpen(true)}
      />

      {/* Main Page Body */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {renderContent()}
      </main>

      {/* 10-Step SIH Story Walkthrough Modal */}
      <SihDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500 font-mono mt-16">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center text-white">
              <Anchor className="w-3 h-3" />
            </div>
            <span className="text-slate-900 font-bold font-sans">NautiQ GreenOps</span>
            <span className="text-slate-300">•</span>
            <span>SIH PS-26138 Prototype</span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700 font-medium">Theme: Clean & Green Tech</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-slate-500">
            <span>Admiralty Power Model (P ∝ v³)</span>
            <span>•</span>
            <span className="text-indigo-600 font-medium">Adaptive QPSO Swarm</span>
            <span>•</span>
            <span className="text-slate-600">Zero External Backend Required</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

