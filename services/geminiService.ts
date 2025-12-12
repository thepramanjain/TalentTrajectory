import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserInput, CareerPlan } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

const careerPlanSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    clarityScore: { type: Type.NUMBER, description: "Score from 0 to 100 indicating alignment." },
    clarityReasoning: { type: Type.STRING, description: "Short explanation of the score." },
    skillGapAnalysis: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          skill: { type: Type.STRING },
          status: { type: Type.STRING, enum: ["Have", "Missing"] },
          priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
        },
        required: ["skill", "status", "priority"],
      },
    },
    suggestedPaths: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          type: { type: Type.STRING, enum: ["Fast-track", "Balanced Learning", "Advanced Specialization"] },
          description: { type: Type.STRING },
          duration: { type: Type.STRING },
        },
        required: ["title", "type", "description", "duration"],
      },
    },
    monthlyRoadmap: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          monthTitle: { type: Type.STRING },
          concepts: { type: Type.ARRAY, items: { type: Type.STRING } },
          tools: { type: Type.ARRAY, items: { type: Type.STRING } },
          exercises: { type: Type.ARRAY, items: { type: Type.STRING } },
          projectTitle: { type: Type.STRING },
        },
        required: ["monthTitle", "concepts", "tools", "exercises", "projectTitle"],
      },
    },
    weeklySchedule: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.STRING },
          activity: { type: Type.STRING },
          duration: { type: Type.STRING },
        },
        required: ["day", "activity", "duration"],
      },
      description: "A typical weekly schedule based on user's available hours."
    },
    portfolioProjects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          problemSolved: { type: Type.STRING },
          toolsUsed: { type: Type.ARRAY, items: { type: Type.STRING } },
          expectedOutput: { type: Type.STRING },
          difficulty: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Advanced"] },
        },
        required: ["title", "problemSolved", "toolsUsed", "expectedOutput", "difficulty"],
      },
    },
    resumeBullets: { type: Type.ARRAY, items: { type: Type.STRING } },
    interviewPrep: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          answer: { type: Type.STRING, description: "STAR method answer" },
        },
        required: ["question", "answer"],
      },
    },
    resources: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          type: { type: Type.STRING, enum: ["Course", "Documentation", "Practice"] },
          url: { type: Type.STRING, description: "A valid HTTP URL to the resource." },
        },
        required: ["title", "type", "url"],
      },
    },
    mistakesToAvoid: { type: Type.ARRAY, items: { type: Type.STRING } },
    nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
    closingMotivation: { type: Type.STRING },
  },
  required: [
    "clarityScore",
    "clarityReasoning",
    "skillGapAnalysis",
    "suggestedPaths",
    "monthlyRoadmap",
    "weeklySchedule",
    "portfolioProjects",
    "resumeBullets",
    "interviewPrep",
    "resources",
    "mistakesToAvoid",
    "nextSteps",
    "closingMotivation",
  ],
};

export const generateCareerPlan = async (userInput: UserInput): Promise<CareerPlan> => {
  const model = "gemini-2.5-flash";
  
  const prompt = `
    Act as an expert AI Career Coach and Product Mentor.
    Create a detailed, personalized career roadmap based on the following user profile:
    
    - Education: ${userInput.education}
    - Current Skills: ${userInput.currentSkills}
    - Target Role: ${userInput.targetRole}
    - Time Available: ${userInput.hoursPerDay}
    - Current Role: ${userInput.currentRole || "N/A"}
    - Area of Focus: ${userInput.areaFocus || "General"}
    - Experience Level: ${userInput.experienceLevel || "Entry"}

    Be specific, actionable, and encouraging. Focus on modern industry standards.
  `;

  try {
    const result = await genAI.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: careerPlanSchema,
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for speed on flash model, purely generative task
      },
    });

    if (result.text) {
      return JSON.parse(result.text) as CareerPlan;
    }
    throw new Error("No content generated");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};