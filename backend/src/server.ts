import express from "express";
import type { Request, Response } from "express";
import {connectDB } from "./config/db.js";
import { createFeedback }from "./controllers/feedbackController.js";
import { getFeedback } from "./controllers/getFeedbackController.js";
import { updateFeedback } from "./controllers/updateFeedbackController.js";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
res.json({ ok: true });
});

app.get("/api/feedback", (req: Request, res: Response) => {
    getFeedback(req, res);
});

app.post("/api/feedback", (req : Request , res: Response) => {
    createFeedback(req, res);
});

app.patch("/api/feedback/:id", (req: Request, res: Response) => {
    updateFeedback(req, res);
});


connectDB().then(() => {
    app.listen(PORT, () => {
    console.log("Backend running on port " + PORT);
    })
}).catch((error) => {
    console.error("Error starting backend:", error);
    process.exit(1);});




