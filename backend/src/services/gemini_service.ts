import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config/env.js";

if (!config.geminiApiKey) {
  throw new Error("GEMINI_API_KEY is missing");
}

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

//Initialize the Gemini model
export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

export interface FeedbackAnalysis {
  category: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  priority: number; // 1 to 10, where 10 is the highest priority;
  summary:string;
  tags: string[];
}

export async function analyzeFeedback(
  title: string,
  description: string,
  category: string // 
): Promise<FeedbackAnalysis> {
  const prompt = `
    You are an expert product manager analyzing customer feedback.

    USER'S FEEDBACK:
    Title: ${title}
    Description: ${description}
    Category: ${category}

    Analyze this feedback and respond ONLY with valid JSON (no markdown, no explanation). Use this exact format:
    {
      "category": "Bug Report" | "Feature Request" | "Improvement Suggestion" | "Other",
      "sentiment": "Positive" | "Neutral" | "Negative",
      "priority": <number 1-10, where 10 is most critical>,
      "summary": "<1 sentence summary of the feedback>",
      "tags": ["<tag1>", "<tag2>", "<tag3>"]
    }

    Priority scoring rules:
    - Security bugs = 9-10
    - Critical bugs = 7-8
    - Minor bugs = 4-6
    - Feature requests = 5-7 depending on demand signals
    - Improvements = 3-5

    Tags should be specific: e.g., ["performance", "critical", "frontend"], ["ui-ux", "mobile"], etc.
    `;

    try{
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const analysis = JSON.parse(responseText) as FeedbackAnalysis;

      if(
        !analysis.category ||
        !analysis.sentiment ||
        !analysis.priority === undefined ||
        !analysis.summary ||
        !Array.isArray(analysis.tags))  
        {
          throw new Error("Invalid analysis result: " + responseText);
        }

        analysis.priority = Math.max(1, Math.min(10, analysis.priority));
        return analysis;
    }catch(error){
      console.error("Gemini analysis error:", error);

      // Graceful fallback if Gemini fails
      return {
        category: category,
        sentiment: "Neutral",
        priority: 5,
        summary: `${title} - ${description}`,
        tags: [category.toLowerCase()],
      };      
    }
}