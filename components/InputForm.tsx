import React, { useState, useEffect } from "react";
import { UserInput } from "../types";
import { Briefcase, Clock, GraduationCap, Target, Code, Layers, User, Sparkles, Wand2 } from "lucide-react";

interface InputFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
  initialValues?: UserInput | null;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, initialValues }) => {
  const [formData, setFormData] = useState<UserInput>({
    education: "",
    currentSkills: "",
    targetRole: "",
    hoursPerDay: "",
    currentRole: "",
    areaFocus: "",
    experienceLevel: "Entry Level",
  });

  useEffect(() => {
    if (initialValues) {
      setFormData((prev) => ({
        ...prev,
        ...initialValues,
      }));
    }
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAutoFill = () => {
    setFormData({
      targetRole: "Senior Frontend Engineer",
      hoursPerDay: "2 hours",
      currentSkills: "HTML, CSS, JavaScript, React basics, Git, Tailwind CSS",
      education: "B.S. Computer Science",
      currentRole: "Junior Web Developer",
      areaFocus: "Performance & Architecture",
      experienceLevel: "Junior",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClass = "w-full p-3 pl-10 rounded-lg border border-slate-300 dark:border-[#30363D] bg-slate-50 dark:bg-[#0D1117] text-slate-900 dark:text-[#E6EDF3] focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent outline-none transition-all placeholder-slate-400 focus:bg-white dark:focus:bg-[#161B22]";
  const labelClass = "block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2";

  return (
    <div className="w-full max-w-3xl mx-auto">
       {/* Hero Section */}
       <div className="text-center mb-10 space-y-4">
         <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
           Design Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4A90E2] to-[#34C759]">Dream Career</span>
         </h1>
         <p className="text-lg text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
           CareerPilot AI analyzes your profile to build a step-by-step roadmap, tailored study schedule, and portfolio strategy.
         </p>
       </div>

      <div className="bg-white dark:bg-[#161B22] rounded-2xl shadow-xl border border-slate-200 dark:border-[#30363D] p-8 md:p-10 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

        <div className="flex justify-between items-center mb-8 relative z-10">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-[#4A90E2]" />
            Your Profile
          </h2>
          <button
            type="button"
            onClick={handleAutoFill}
            className="group flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#4A90E2] bg-blue-50 dark:bg-blue-900/20 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all border border-blue-200 dark:border-blue-800"
          >
            <Wand2 className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
            Try Example
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          
          {/* Section 1: Goals */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className={labelClass}>Target Role</label>
                <Target className="absolute left-3 top-10 w-4 h-4 text-slate-400" />
                <input
                  required
                  name="targetRole"
                  value={formData.targetRole}
                  onChange={handleChange}
                  placeholder="e.g. Senior Frontend Engineer"
                  className={inputClass}
                />
              </div>
              <div className="relative">
                <label className={labelClass}>Daily Commitment</label>
                <Clock className="absolute left-3 top-10 w-4 h-4 text-slate-400" />
                <input
                  required
                  name="hoursPerDay"
                  value={formData.hoursPerDay}
                  onChange={handleChange}
                  placeholder="e.g. 2 hours"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-[#30363D] w-full"></div>

          {/* Section 2: Current Status */}
          <div className="space-y-6">
             <div className="relative">
                <label className={labelClass}>Current Skills & Tech Stack</label>
                <Code className="absolute left-3 top-10 w-4 h-4 text-slate-400" />
                <textarea
                  required
                  name="currentSkills"
                  value={formData.currentSkills}
                  onChange={handleChange}
                  placeholder="List everything you know: HTML, CSS, JavaScript, Git..."
                  className={`${inputClass} h-32 pt-3`}
                />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className={labelClass}>Education</label>
                <GraduationCap className="absolute left-3 top-10 w-4 h-4 text-slate-400" />
                <input
                  required
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  placeholder="Degree, Bootcamp, or Self-taught"
                  className={inputClass}
                />
              </div>
              <div className="relative">
                <label className={labelClass}>Current Role (Optional)</label>
                <Briefcase className="absolute left-3 top-10 w-4 h-4 text-slate-400" />
                <input
                  name="currentRole"
                  value={formData.currentRole}
                  onChange={handleChange}
                  placeholder="Current Job Title"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="relative">
                <label className={labelClass}>Area of Focus</label>
                <Layers className="absolute left-3 top-10 w-4 h-4 text-slate-400" />
                <input
                  name="areaFocus"
                  value={formData.areaFocus}
                  onChange={handleChange}
                  placeholder="Specific interest (e.g. UI/UX, Backend)"
                  className={inputClass}
                />
              </div>
              <div className="relative">
                <label className={labelClass}>Experience Level</label>
                <Sparkles className="absolute left-3 top-10 w-4 h-4 text-slate-400" />
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none`}
                >
                  <option value="Entry Level">Entry Level (0-1 years)</option>
                  <option value="Junior">Junior (1-3 years)</option>
                  <option value="Mid-Level">Mid-Level (3-5 years)</option>
                  <option value="Senior">Senior (5+ years)</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg shadow-blue-500/30 transition-all transform active:scale-[0.98] ${
              isLoading
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-[#4A90E2] to-[#3B82F6] hover:from-[#3B82F6] hover:to-[#2563EB] hover:-translate-y-1"
            }`}
          >
            {isLoading ? "Analyzing..." : "Generate My Roadmap 🚀"}
          </button>
        </form>
      </div>
      
      <p className="text-center text-xs text-slate-400 mt-6">
        AI-generated advice can be inaccurate. Always verify important career decisions.
      </p>
    </div>
  );
};