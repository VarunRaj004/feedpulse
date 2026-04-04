import type { Request, Response } from "express";
import { Feedback } from "../models/Feedback.js";



export async function getFeedback(req: Request , res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filters : any = {} ;
    if(req.query.status) filters.status = req.query.status;
    if(req.query.category) filters.category = req.query.category;
    if(req.query.sentiment) filters.ai_sentiment = req.query.sentiment;

    const sortBy = req.query.sortBy as string || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1 ;
    
    try{
        const total = await Feedback.countDocuments(filters);

        const feedbacklist = await Feedback.find(filters).sort({ [sortBy]:sortOrder }).skip(skip).limit(limit);

        res.status(200).json({
            success : true,
            data: feedbacklist,
            pagination:{
                page,
                limit,
                total,
                pages: Math.ceil(total/limit)
            }
        });
    }catch(error){
        console.error("Error fetching feedback:", error);
        res.status(500).json({ error: "Failed to fetch feedback" });
    }




}