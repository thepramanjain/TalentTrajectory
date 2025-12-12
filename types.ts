export interface UserInput {
  education: string;
  currentSkills: string;
  targetRole: string;
  hoursPerDay: string;
  currentRole?: string;
  areaFocus?: string;
  experienceLevel?: string;
}

export enum SkillPriority {
  High = "High",
  Medium = "Medium",
  Low = "Low",
}

export enum Status {
  Have = "Have",
  Missing = "Missing",
}

export interface SkillGap {
  skill: string;
  status: Status;
  priority: SkillPriority;
}

export interface CareerPath {
  title: string;
  type: "Fast-track" | "Balanced Learning" | "Advanced Specialization";
  description: string;
  duration: string;
}

export interface RoadmapMonth {
  monthTitle: string;
  concepts: string[];
  tools: string[];
  exercises: string[];
  projectTitle: string;
}

export interface StudyPlanDay {
  day: string;
  activity: string;
  duration: string;
}

export interface Project {
  title: string;
  problemSolved: string;
  toolsUsed: string[];
  expectedOutput: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

export interface InterviewQA {
  question: string;
  answer: string; // STAR method
}

export interface Resource {
  title: string;
  type: "Course" | "Documentation" | "Practice";
  url: string; // Placeholder or description of where to find it
}

export interface CareerPlan {
  clarityScore: number;
  clarityReasoning: string;
  skillGapAnalysis: SkillGap[];
  suggestedPaths: CareerPath[];
  monthlyRoadmap: RoadmapMonth[];
  weeklySchedule: StudyPlanDay[];
  portfolioProjects: Project[];
  resumeBullets: string[];
  interviewPrep: InterviewQA[];
  resources: Resource[];
  mistakesToAvoid: string[];
  nextSteps: string[];
  closingMotivation: string;
}
