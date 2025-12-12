import React, { useState, useEffect } from "react";
import { UserInput, CareerPlan } from "./types";
import { generateCareerPlan } from "./services/geminiService";
import { InputForm } from "./components/InputForm";
import { Dashboard } from "./components/Dashboard";
import { Moon, Sun, Compass, Sparkles, Brain, Map, Rocket } from "lucide-react";

// Loading Overlay Component
const LoadingOverlay = () => {
  const steps = [
    { text: "Analyzing your profile...", icon: <UserIcon className="w-6 h-6" /> },
    { text: "Identifying skill gaps...", icon: <Brain className="w-6 h-6" /> },
    { text: "Structuring your roadmap...", icon: <Map className="w-6 h-6" /> },
    { text: "Finalizing strategies...", icon: <Rocket className="w-6 h-6" /> }
  ];
  
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-white/95 dark:bg-[#0D1117]/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 border-4 border-slate-200 dark:border-gray-700 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#4A90E2] rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <Compass className="w-10 h-10 text-[#4A90E2] animate-pulse" />
          </div>
        </div>
        
        <div className="space-y-4">
           <h3 className="text-2xl font-bold text-slate-900 dark:text-white animate-fade-in">
            {steps[currentStep].text}
           </h3>
           <div className="flex justify-center gap-2">
             {steps.map((_, idx) => (
               <div 
                 key={idx} 
                 className={`h-1.5 rounded-full transition-all duration-500 ${
                   idx <= currentStep ? "w-8 bg-[#4A90E2]" : "w-2 bg-slate-200 dark:bg-gray-700"
                 }`}
               />
             ))}
           </div>
        </div>
        
        <p className="text-sm text-slate-500 dark:text-gray-400 italic max-w-sm mx-auto">
          "The best way to predict the future is to create it." <br/>– Peter Drucker
        </p>
      </div>
    </div>
  );
};

// Simple User Icon helper
const UserIcon = ({className}: {className: string}) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const App: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isLoading, setIsLoading] = useState(false);
  const [careerPlan, setCareerPlan] = useState<CareerPlan | null>(null);
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [initialValues, setInitialValues] = useState<UserInput | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check system preference on load
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme("dark");
    }

    // 1. Check URL for share parameter first
    const params = new URLSearchParams(window.location.search);
    const shareData = params.get('share');

    if (shareData) {
      try {
        const decoded = JSON.parse(atob(shareData));
        setInitialValues(decoded);
        window.history.replaceState({}, '', window.location.pathname);
        return;
      } catch (e) {
        console.error("Invalid share data found in URL");
      }
    }

    // 2. Load from LocalStorage if no share param
    const savedPlan = localStorage.getItem('careerPilot_plan');
    const savedInput = localStorage.getItem('careerPilot_input');

    if (savedInput) {
      try {
        const parsedInput = JSON.parse(savedInput);
        setUserInput(parsedInput);
        setInitialValues(parsedInput);
      } catch (e) {
        console.error("Failed to parse saved input");
      }
    }

    if (savedPlan) {
      try {
        setCareerPlan(JSON.parse(savedPlan));
      } catch (e) {
        console.error("Failed to parse saved plan");
      }
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const handleFormSubmit = async (data: UserInput) => {
    setIsLoading(true);
    setError(null);
    setUserInput(data);
    localStorage.setItem('careerPilot_input', JSON.stringify(data));
    
    try {
      const plan = await generateCareerPlan(data);
      setCareerPlan(plan);
      localStorage.setItem('careerPilot_plan', JSON.stringify(plan));
    } catch (err) {
      console.error(err);
      setError("Failed to generate roadmap. Please check your connection and API Key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCareerPlan(null);
    localStorage.removeItem('careerPilot_plan');
  };

  return (
    <div className={theme}>
      <div className="min-h-screen bg-[#F0F4F8] dark:bg-[#0D1117] text-[#1F2937] dark:text-[#E6EDF3] transition-colors duration-300 font-sans selection:bg-blue-100 selection:text-blue-900">
        
        {isLoading && <LoadingOverlay />}

        {/* Navigation / Header */}
        <nav className="sticky top-0 z-40 bg-white/80 dark:bg-[#161B22]/80 backdrop-blur-md border-b border-slate-200 dark:border-[#30363D]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
                <div className="bg-gradient-to-br from-[#4A90E2] to-[#3B82F6] p-1.5 rounded-lg shadow-sm">
                   <Compass className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">CareerPilot AI</span>
                  <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider hidden sm:block">Stop guessing. Start growing.</span>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-slate-100 dark:bg-[#30363D] hover:bg-slate-200 dark:hover:bg-[#3d444d] transition-colors flex items-center gap-2 text-sm font-medium border border-transparent hover:border-slate-300 dark:hover:border-gray-600"
              >
                {theme === "light" ? (
                  <>
                    <Sun className="w-4 h-4 text-[#FFB800]" />
                    <span className="hidden sm:inline">Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-[#4A90E2]" />
                    <span className="hidden sm:inline">Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {error && (
            <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 rounded-lg text-center shadow-sm">
              {error}
            </div>
          )}

          {!careerPlan ? (
            <div className="animate-fade-in">
              <InputForm 
                onSubmit={handleFormSubmit} 
                isLoading={isLoading} 
                initialValues={userInput || initialValues} 
              />
            </div>
          ) : (
            <Dashboard 
              plan={careerPlan} 
              userInput={userInput} 
              onReset={handleReset} 
            />
          )}
        </main>

        {/* Footer */}
        <footer className="mt-auto py-8 text-center text-sm text-slate-500 dark:text-gray-400 border-t border-slate-200 dark:border-[#30363D] bg-white dark:bg-[#161B22]">
          <p className="flex items-center justify-center gap-2">
            Made with <Sparkles className="w-3 h-3 text-yellow-500"/> using Google Gemini
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;