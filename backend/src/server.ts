import express from "express";
import type { Request, Response } from "express";
import {connectDB } from "./config/db.js";
import { createFeedback }from "./controllers/feedbackController.js";
import { connect } from "node:http2";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

connectDB();

app.get("/health", (_req: Request, res: Response) => {
res.json({ ok: true });
});

app.post("/api/feedback", createFeedback);

app.listen(PORT, () => {
console.log("Backend running on port " + PORT);
});