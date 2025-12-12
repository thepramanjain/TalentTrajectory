import React, { useState, useRef, useEffect } from "react";
import { CareerPlan, SkillPriority, Status, UserInput } from "../types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import {
  CheckCircle,
  XCircle,
  TrendingUp,
  Calendar,
  BookOpen,
  Briefcase,
  AlertTriangle,
  Award,
  List,
  User,
  Clock,
  Share2,
  FileText,
  RotateCcw,
  Check,
  Loader,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MapPin,
  Layout,
  Target
} from "lucide-react";

interface DashboardProps {
  plan: CareerPlan;
  userInput: UserInput | null;
  onReset: () => void;
}

const COLORS = ['#4A90E2', '#34C759', '#FFB800', '#AF52DE', '#FF3B30', '#8E8E93'];

export const Dashboard: React.FC<DashboardProps> = ({ plan, userInput, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);
  const [activeSection, setActiveSection] = useState('overview');
  const contentRef = useRef<HTMLDivElement>(null);

  const clarityColor = plan.clarityScore >= 80 ? "#34C759" : plan.clarityScore >= 50 ? "#FFB800" : "#EF4444";

  // Parse duration for chart
  const weeklyData = plan.weeklySchedule.map(item => {
    const match = item.duration.match(/(\d+(\.\d+)?)/);
    const value = match ? parseFloat(match[0]) : 1;
    return { name: item.activity, value };
  });

  const handleShare = () => {
    if (!userInput) return;
    try {
      const shareData = btoa(JSON.stringify(userInput));
      const url = `${window.location.origin}${window.location.pathname}?share=${shareData}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to generate share link", e);
    }
  };

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;
    setIsGeneratingPdf(true);

    const element = contentRef.current;
    const opt = {
      margin:       [10, 10],
      filename:     `career-roadmap-${new Date().toISOString().split('T')[0]}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
    };

    try {
      // @ts-ignore
      await window.html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("PDF Generation failed", err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const toggleQuestion = (idx: number) => {
    setExpandedQuestions(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 relative">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#161B22] p-4 rounded-xl border border-slate-200 dark:border-[#30363D] shadow-sm sticky top-20 z-40">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Career Roadmap</h2>
          <p className="text-sm text-slate-500 dark:text-gray-400">Tailored for {userInput?.targetRole}</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <button
            onClick={handleShare}
            className={`flex-1 sm:flex-none items-center justify-center flex gap-2 px-4 py-2 font-medium text-sm rounded-lg transition-all shadow-sm ${
              copied 
                ? "bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 dark:bg-[#21262D] dark:text-gray-200 dark:border-gray-600 dark:hover:bg-[#30363D]"
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            {copied ? "Copied" : "Share"}
          </button>
          
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="flex-1 sm:flex-none items-center justify-center flex gap-2 px-4 py-2 bg-[#4A90E2] text-white font-medium text-sm rounded-lg hover:bg-[#357ABD] transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGeneratingPdf ? <Loader className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            {isGeneratingPdf ? "..." : "PDF"}
          </button>

          <button
            onClick={onReset}
            className="flex-1 sm:flex-none items-center justify-center flex gap-2 px-4 py-2 bg-slate-100 text-slate-600 font-medium text-sm rounded-lg hover:bg-slate-200 transition-colors border border-slate-200 dark:bg-[#21262D] dark:text-gray-300 dark:border-gray-600 dark:hover:bg-[#30363D]"
          >
            <RotateCcw className="w-4 h-4" />
            New
          </button>
        </div>
      </div>

      {/* Sticky Section Nav - Hidden in PDF */}
      <div className="sticky top-[5.5rem] z-30 bg-[#F0F4F8]/95 dark:bg-[#0D1117]/95 backdrop-blur py-2 overflow-x-auto no-scrollbar" data-html2canvas-ignore="true">
        <div className="flex gap-2 min-w-max px-1">
          {[
            { id: 'overview', label: 'Overview', icon: Layout },
            { id: 'skills', label: 'Skill Gaps', icon: TrendingUp },
            { id: 'roadmap', label: 'Roadmap', icon: MapPin },
            { id: 'projects', label: 'Projects', icon: Briefcase },
            { id: 'prep', label: 'Prep & Resources', icon: BookOpen },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeSection === item.id 
                  ? "bg-[#4A90E2] text-white shadow-md" 
                  : "bg-white dark:bg-[#161B22] text-slate-600 dark:text-gray-300 border border-slate-200 dark:border-[#30363D] hover:bg-slate-50 dark:hover:bg-[#21262D]"
              }`}
            >
              <item.icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Printable Content Container */}
      <div ref={contentRef} className="space-y-12 p-1">
        
        {/* OVERVIEW SECTION */}
        <section id="overview" className="space-y-6 scroll-mt-32">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 break-inside-avoid">
            {/* Clarity Score */}
            <div className="lg:col-span-1 bg-white dark:bg-[#161B22] rounded-2xl p-6 border border-slate-200 dark:border-[#30363D] shadow-sm flex flex-col justify-center items-center text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400"></div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-gray-300 mb-4">Clarity Score</h3>
              <div className="relative flex items-center justify-center w-40 h-40 mb-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[{ value: plan.clarityScore }, { value: 100 - plan.clarityScore }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={75}
                      startAngle={180}
                      endAngle={0}
                      dataKey="value"
                    >
                      <Cell fill={clarityColor} />
                      <Cell fill="#e5e7eb" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-4 text-center">
                   <span className="text-4xl font-bold text-slate-900 dark:text-white block">{plan.clarityScore}</span>
                   <span className="text-xs text-slate-400 uppercase tracking-wide">out of 100</span>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-gray-400 px-2">{plan.clarityReasoning}</p>
            </div>

            {/* Next Steps (Moved up for visibility) */}
            <div className="lg:col-span-2 bg-[#4A90E2] dark:bg-[#1F6FEB] rounded-2xl p-8 text-white shadow-lg flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-8 h-8 opacity-90" />
                <h2 className="text-2xl font-bold">Your Immediate Next Steps</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plan.nextSteps.map((step, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-colors">
                    <span className="block text-2xl font-bold opacity-50 mb-1">0{idx + 1}</span>
                    <p className="font-medium text-sm leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
           {/* Suggested Paths */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 break-inside-avoid">
            {plan.suggestedPaths.map((path, idx) => (
              <div key={idx} className="bg-white dark:bg-[#161B22] p-5 rounded-xl border border-slate-200 dark:border-[#30363D] shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                   <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${
                     path.type === 'Fast-track' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' :
                     path.type === 'Balanced Learning' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' :
                     'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                   }`}>
                     {path.type}
                   </span>
                   <span className="text-xs text-slate-500 font-mono">{path.duration}</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">{path.title}</h4>
                <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">{path.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="scroll-mt-32 break-inside-avoid">
          <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-[#30363D] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-[#30363D] flex justify-between items-center bg-slate-50/50 dark:bg-[#1F242C]/50">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#4A90E2]" /> Skill Gap Analysis
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-[#0D1117] text-slate-500 dark:text-gray-400 uppercase tracking-wider text-xs">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Skill</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Priority</th>
                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-[#30363D]">
                  {plan.skillGapAnalysis.map((gap, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#1C2128] transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{gap.skill}</td>
                      <td className="px-6 py-4">
                        {gap.status === Status.Have ? (
                          <span className="inline-flex items-center gap-1.5 text-[#34C759] font-medium bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-full text-xs">
                            <CheckCircle className="w-3.5 h-3.5" /> Acquired
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-slate-500 font-medium bg-slate-100 dark:bg-gray-800 px-2.5 py-1 rounded-full text-xs">
                            <XCircle className="w-3.5 h-3.5" /> Missing
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-1">
                          {[1, 2, 3].map((bar) => (
                            <div 
                              key={bar} 
                              className={`h-1.5 w-4 rounded-full ${
                                (gap.priority === SkillPriority.High) ? 'bg-red-500' :
                                (gap.priority === SkillPriority.Medium && bar <= 2) ? 'bg-yellow-500' :
                                (gap.priority === SkillPriority.Low && bar === 1) ? 'bg-green-500' :
                                'bg-slate-200 dark:bg-gray-700'
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-xs text-slate-500">{gap.priority}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <span className="text-xs text-[#4A90E2] cursor-pointer hover:underline">Find Resources</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ROADMAP SECTION */}
        <section id="roadmap" className="scroll-mt-32 break-inside-avoid">
          <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-[#30363D] shadow-sm p-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
              <MapPin className="w-6 h-6 text-[#FFB800]" /> Strategic Timeline
            </h3>
            
            <div className="relative space-y-0">
               {/* Vertical Line */}
              <div className="absolute left-4 md:left-1/2 top-10 bottom-10 w-0.5 bg-slate-200 dark:bg-[#30363D] transform -translate-x-1/2 hidden md:block"></div>
              
              {plan.monthlyRoadmap.map((month, idx) => (
                <div key={idx} className={`relative flex flex-col md:flex-row gap-8 mb-12 last:mb-0 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-[#4A90E2] border-4 border-white dark:border-[#161B22] shadow-sm transform -translate-x-1/2 z-10 flex items-center justify-center font-bold text-white text-xs top-0 md:top-6">
                    {idx + 1}
                  </div>

                  {/* Content Card */}
                  <div className="md:w-1/2 pl-12 md:pl-0">
                     <div className={`bg-slate-50 dark:bg-[#0D1117] p-6 rounded-2xl border border-slate-100 dark:border-[#30363D] relative hover:border-[#4A90E2]/30 transition-colors ${idx % 2 === 0 ? 'md:mr-12' : 'md:ml-12'}`}>
                        {/* Mobile Vertical Line */}
                        <div className="absolute left-[-2rem] top-4 bottom-[-3rem] w-0.5 bg-slate-200 dark:bg-[#30363D] md:hidden"></div>

                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{month.monthTitle}</h4>
                        
                        <div className="space-y-4">
                          <div>
                            <span className="text-xs font-bold text-[#4A90E2] uppercase tracking-wider mb-2 block">Key Concepts</span>
                            <div className="flex flex-wrap gap-2">
                              {month.concepts.map((c, i) => (
                                <span key={i} className="px-2.5 py-1 bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-md text-xs text-slate-700 dark:text-gray-300 shadow-sm">{c}</span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="p-3 bg-white dark:bg-[#161B22] rounded-lg border border-green-100 dark:border-green-900/20">
                             <div className="flex items-start gap-2">
                               <CheckCircle className="w-4 h-4 text-[#34C759] mt-0.5 flex-shrink-0" />
                               <div>
                                 <span className="text-xs font-bold text-[#34C759] uppercase tracking-wider block mb-1">Milestone Project</span>
                                 <p className="text-sm font-medium text-slate-800 dark:text-gray-200">{month.projectTitle}</p>
                               </div>
                             </div>
                          </div>
                        </div>
                     </div>
                  </div>
                   {/* Empty Space for Grid */}
                   <div className="md:w-1/2 hidden md:block"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WEEKLY SCHEDULE CHART */}
         <section className="scroll-mt-32 break-inside-avoid">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="md:col-span-2 bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-[#30363D] shadow-sm p-6">
               <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#4A90E2]" /> Weekly Routine
              </h3>
               <div className="space-y-3">
                {plan.weeklySchedule.map((day, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#0D1117] rounded-lg border border-slate-100 dark:border-[#30363D] group hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[#4A90E2] font-bold text-xs group-hover:bg-[#4A90E2] group-hover:text-white transition-colors">
                        {day.day.substring(0, 3)}
                      </div>
                      <span className="font-medium text-slate-800 dark:text-gray-200 text-sm">{day.activity}</span>
                    </div>
                    <span className="text-xs font-mono text-slate-500 bg-white dark:bg-[#161B22] px-2 py-1 rounded border border-slate-200 dark:border-[#30363D]">{day.duration}</span>
                  </div>
                ))}
              </div>
             </div>

             <div className="md:col-span-1 bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-[#30363D] shadow-sm p-6 flex flex-col items-center justify-center">
                <h4 className="text-sm font-semibold text-slate-500 mb-4">Time Distribution</h4>
                <div className="w-full h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={weeklyData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {weeklyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB', borderRadius: '8px', fontSize: '12px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                   {weeklyData.slice(0, 3).map((entry, index) => (
                     <div key={index} className="flex items-center gap-1 text-xs text-slate-500">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                        <span className="truncate max-w-[80px]">{entry.name}</span>
                     </div>
                   ))}
                </div>
             </div>
           </div>
         </section>


        {/* PROJECTS SECTION */}
        <section id="projects" className="scroll-mt-32 break-inside-avoid">
          <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-[#30363D] shadow-sm p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#FFB800]" /> Portfolio Projects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plan.portfolioProjects.map((project, idx) => (
                <div key={idx} className="flex flex-col p-5 border border-slate-200 dark:border-[#30363D] rounded-xl hover:shadow-lg hover:border-[#4A90E2] transition-all bg-gradient-to-br from-slate-50 to-white dark:from-[#0D1117] dark:to-[#161B22]">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-slate-900 dark:text-white text-lg">{project.title}</h4>
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                      project.difficulty === 'Advanced' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                      project.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                    }`}>{project.difficulty}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-gray-400 mb-4 flex-grow">{project.problemSolved}</p>
                  
                  <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-[#30363D]">
                    <div>
                      <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Tech Stack</span>
                      <div className="flex flex-wrap gap-1.5">
                        {project.toolsUsed.map((tool, i) => (
                          <span key={i} className="text-[10px] bg-white dark:bg-[#21262D] border border-slate-200 dark:border-[#30363D] text-slate-600 dark:text-gray-300 px-2 py-0.5 rounded shadow-sm">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PREP & RESOURCES SECTION */}
        <section id="prep" className="grid grid-cols-1 md:grid-cols-2 gap-8 scroll-mt-32 break-inside-avoid">
          {/* Interview Prep */}
          <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-[#30363D] shadow-sm p-6">
             <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
               <User className="w-5 h-5 text-[#4A90E2]" /> Interview Prep
            </h3>
            <div className="space-y-3">
              {plan.interviewPrep.slice(0, 3).map((qa, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-[#0D1117] rounded-lg border border-slate-100 dark:border-[#30363D] overflow-hidden">
                  <button 
                    onClick={() => toggleQuestion(idx)}
                    className="w-full text-left p-3 flex justify-between items-start gap-2 focus:outline-none hover:bg-slate-100 dark:hover:bg-[#21262D] transition-colors"
                  >
                    <span className="font-semibold text-slate-900 dark:text-white text-sm">Q: {qa.question}</span>
                    {expandedQuestions.includes(idx) ? 
                      <ChevronUp className="w-4 h-4 mt-1 flex-shrink-0 text-slate-500" /> : 
                      <ChevronDown className="w-4 h-4 mt-1 flex-shrink-0 text-slate-500" />
                    }
                  </button>
                  {expandedQuestions.includes(idx) && (
                    <div className="p-3 pt-0 text-sm text-slate-600 dark:text-gray-400 bg-slate-50 dark:bg-[#0D1117] animate-fade-in">
                       <div className="pl-3 border-l-2 border-[#4A90E2] italic">
                        "{qa.answer}"
                       </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-[#30363D]">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                   <List className="w-4 h-4 text-[#34C759]" /> Resume Power Bullets
                </h3>
                <ul className="space-y-2">
                  {plan.resumeBullets.map((bullet, idx) => (
                    <li key={idx} className="flex gap-2 text-xs text-slate-700 dark:text-gray-300">
                      <span className="text-[#34C759] font-bold">•</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
            </div>
          </div>

          {/* Resources & Mistakes */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#4A90E2]/5 to-[#4A90E2]/10 dark:from-[#161B22] dark:to-[#161B22] rounded-2xl border border-[#4A90E2]/20 dark:border-[#30363D] p-6">
               <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                 <BookOpen className="w-5 h-5 text-[#4A90E2]" /> Recommended Resources
              </h3>
              <ul className="space-y-3">
                {plan.resources.map((res, idx) => (
                  <li key={idx} className="flex items-center justify-between text-sm group bg-white dark:bg-[#0D1117] p-3 rounded-lg border border-slate-100 dark:border-[#30363D] hover:shadow-sm transition-all">
                    <a 
                      href={res.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-2 text-slate-700 dark:text-gray-300 hover:text-[#4A90E2] dark:hover:text-[#4A90E2] transition-colors flex-1"
                    >
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded text-[#4A90E2]">
                         <ExternalLink className="w-3 h-3" />
                      </div>
                      <span className="font-medium truncate max-w-[180px] sm:max-w-[220px]">{res.title}</span>
                    </a>
                    <span className="text-[10px] uppercase font-bold text-slate-400 border border-slate-200 dark:border-gray-700 px-1.5 py-0.5 rounded">
                      {res.type}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30 p-6">
               <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                 <AlertTriangle className="w-5 h-5 text-red-500" /> Mistakes to Avoid
              </h3>
              <ul className="space-y-2">
                {plan.mistakesToAvoid.map((mistake, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-slate-700 dark:text-gray-300">
                    <span className="text-red-500 font-bold">•</span>
                    {mistake}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <div className="text-center pt-8 opacity-50 text-xs break-inside-avoid">
           <p>" {plan.closingMotivation} "</p>
        </div>
      </div>
    </div>
  );
};