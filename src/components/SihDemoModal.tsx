import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ArrowRight, 
  Ship, 
  Cpu, 
  Sparkles, 
  Sliders, 
  CloudLightning, 
  RefreshCw, 
  FileText,
  RotateCcw
} from 'lucide-react';

interface SihDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
}

interface DemoStep {
  stepNumber: number;
  title: string;
  tabTarget: string;
  description: string;
  actionLabel: string;
  icon: any;
  metricBadge: string;
}

export const SihDemoModal: React.FC<SihDemoModalProps> = ({
  isOpen,
  onClose,
  onSelectTab
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const demoSteps: DemoStep[] = [
    {
      stepNumber: 1,
      title: "Inspect Baseline Fleet & Corridors",
      tabTarget: "dashboard",
      description: "Observe the live digital twin telemetry for 12 vessels, 8 transoceanic shipping corridors, and baseline daily consumption of 4,650 tonnes fuel.",
      actionLabel: "View Fleet Dashboard",
      icon: Ship,
      metricBadge: "12 Vessels | 8 Voyages"
    },
    {
      stepNumber: 2,
      title: "Explore Digital Twin Maritime Map",
      tabTarget: "map",
      description: "Visualize live vessel GPS positions, weather overlays (waves, wind drag), sea-state resistance, and global green bunkering ports.",
      actionLabel: "Inspect Digital Twin Map",
      icon: Ship,
      metricBadge: "Global AIS + Weather GIS"
    },
    {
      stepNumber: 3,
      title: "Propulsion Physics & ML Prediction",
      tabTarget: "prediction",
      description: "Demonstrate physics-informed cubic power calculation (P ∝ v³) alongside XGBoost hybrid residual correction, achieving R² = 0.964.",
      actionLabel: "Run Fuel Predictor",
      icon: Cpu,
      metricBadge: "Physics + ML Hybrid"
    },
    {
      stepNumber: 4,
      title: "Quantum-Inspired Optimization (AQPSO)",
      tabTarget: "optimization",
      description: "Execute the Adaptive QPSO multi-objective solver. Generates 4 distinct operational plans: Greenest, Cheapest, Balanced, and Reliability-first.",
      actionLabel: "Open Green Optimizer",
      icon: Sparkles,
      metricBadge: "Delta Potential Well"
    },
    {
      stepNumber: 5,
      title: "Pareto Frontier & Explainability",
      tabTarget: "optimization",
      description: "Inspect the non-dominated Pareto frontier and inspect the deterministic 'Why this plan?' machine explanation for vessel and speed assignments.",
      actionLabel: "Analyze Pareto Knee",
      icon: FileText,
      metricBadge: "Explainable Decisions"
    },
    {
      stepNumber: 6,
      title: "Scenario Lab: Carbon Tax Stress Test",
      tabTarget: "scenarios",
      description: "Test sensitivity by increasing carbon price to $100/t. Observe how alternative green fuels (Methanol/Ammonia) achieve immediate economic parity.",
      actionLabel: "Simulate $100 Carbon Tax",
      icon: Sliders,
      metricBadge: "Regulatory Sensitivity"
    },
    {
      stepNumber: 7,
      title: "Simulate Extreme Weather Disruption",
      tabTarget: "disruptions",
      description: "Inject a North Pacific Superstorm alert (5.4m wave height). The digital twin detects severe added wave drag and a projected 34.5-hour delay.",
      actionLabel: "Trigger Storm Event",
      icon: CloudLightning,
      metricBadge: "5.4m Significant Waves"
    },
    {
      stepNumber: 8,
      title: "Dynamic Re-Optimization & Plan Diff",
      tabTarget: "disruptions",
      description: "Trigger dynamic re-optimization. Compare the Old Plan vs New Plan side-by-side: southern Hawaiian divert saves 34.5h delay and cuts $55k OPEX.",
      actionLabel: "Compare Re-Opt Plan Diff",
      icon: RefreshCw,
      metricBadge: "Zero ETA Variance"
    },
    {
      stepNumber: 9,
      title: "Multi-Algorithm Benchmarking",
      tabTarget: "benchmark",
      description: "Compare AQPSO against classical QPSO, NSGA-II, Genetic Algorithm (GA), and Greedy Heuristic across runtime, hypervolume, and iterations.",
      actionLabel: "Review Benchmarks",
      icon: Sparkles,
      metricBadge: "Scientific Reproducibility"
    },
    {
      stepNumber: 10,
      title: "Carbon Budget & IMO CII Intelligence",
      tabTarget: "carbon",
      description: "Review fleet-wide carbon budget tracking (SAFE status, 68% utilized) and individual vessel Carbon Intensity Indicator (CII Grade A-E) ratings.",
      actionLabel: "Inspect Carbon Budget",
      icon: CheckCircle2,
      metricBadge: "IMO MEPC 80 Compliant"
    }
  ];

  const currentStep = demoSteps[currentStepIndex];

  const handleStepAction = () => {
    onSelectTab(currentStep.tabTarget);
    if (currentStepIndex < demoSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-sans flex items-center space-x-2">
                <span>SIH Presentation Storyboard</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-mono font-medium">
                  10-Step Journey
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                End-to-End Evaluation Workflow for Problem Statement 26138
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Tracker */}
        <div className="px-6 py-3 bg-white border-b border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-mono">
            <span>Step {currentStep.stepNumber} of {demoSteps.length}</span>
            <span className="text-blue-700 font-semibold">{currentStep.title}</span>
            <span>{Math.round(((currentStepIndex + 1) / demoSteps.length) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / demoSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">
          <div className="flex items-start space-x-4 mb-6">
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600">
              <currentStep.icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1.5">
                <span className="text-xs font-mono font-bold text-blue-700">STEP {currentStep.stepNumber}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                  {currentStep.metricBadge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{currentStep.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{currentStep.description}</p>
            </div>
          </div>

          {/* Quick Jump Step Grid */}
          <div className="border border-slate-200/80 rounded-2xl p-4 bg-slate-50 mb-6">
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-2.5 font-semibold">
              Fast Navigation to Any Step:
            </div>
            <div className="grid grid-cols-5 gap-2">
              {demoSteps.map((step, idx) => (
                <button
                  key={step.stepNumber}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`px-2 py-2 rounded-xl text-xs font-mono text-center transition-all ${
                    currentStepIndex === idx
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : idx < currentStepIndex
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Step {step.stepNumber}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              onClick={() => setCurrentStepIndex(0)}
              className="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Step 1</span>
            </button>

            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition-colors"
              >
                Close Story
              </button>
              <button
                onClick={handleStepAction}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all"
              >
                <span>{currentStep.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
