import {Request , Response} from "express";
import {Feedback} from "../models/Feedback.js";
import { updateFeedbackSchema } from "../validators/updateFeedback_val.js";



export async function updateFeedback(req: Request , res: Response) {
    try{
        const validateData = updateFeedbackSchema.parse(req.body);
        const {id} = req.params ;

        if(!id || typeof id !== "string" || !id.match(/^[0-9a-fA-F]{24}$/)){
            res.status(400).json({
                success:false,
                message:"Invalid feedback ID"
            });
            return ;
        }

        const feedback = await Feedback.findById(id);
        if(!feedback){
            res.status(404).json({
                success:false,
                message:"Feedback not found"
            })
            return ;
        }

        if(validateData.status){
            feedback.status = validateData.status;
            feedback.updatedAt = new Date();
        }

        await feedback.save();
        res.status(200).json({
            success:true,
            data:feedback
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:"Failed to update feedback"
        })
    }
}