import {Request , Response} from "express";
import {Feedback} from "../models/Feedback.js";
import { createFeedbackSchema } from "../validators/feedback_val.js";
import { analyzeFeedback } from "../services/gemini_service.js";


export async function createFeedback(req: Request , res : Response){
    try{
        const validatedData = createFeedbackSchema.parse(req.body);

        const analyzedData = await analyzeFeedback(
            validatedData.title,
            validatedData.description,
            validatedData.category
        )

        const feedback = new Feedback({
            title: validatedData.title,
            description: validatedData.description,
            category: validatedData.category,
            submitterName: validatedData.submitterName,
            submitterEmail: validatedData.submitterEmail,
            ai_category: analyzedData.category,
            ai_sentiment: analyzedData.sentiment,
            ai_priority: analyzedData.priority,
            ai_summary: analyzedData.summary,
            ai_tags: analyzedData.tags,
            ai_processed: true,
            status: "New",
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await feedback.save();
        res.status(201).json(feedback);
    } catch (error) {
        console.error("Error creating feedback:", error);
        res.status(400).json({ error: "Invalid feedback data" });
    }
}