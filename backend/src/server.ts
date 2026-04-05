import express from "express";
import type { Request, Response } from "express";
import {connectDB } from "./config/db.js";
import { createFeedback }from "./controllers/feedbackController.js";
import { getFeedback } from "./controllers/getFeedbackController.js";
import { updateFeedback } from "./controllers/updateFeedbackController.js";
import { adminLogin } from "./controllers/loginController.js";
import { verifyToken, requireAdmin, AuthRequest } from "./middleware/authMiddleware.js";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.get("/health", (_req: Request, res: Response) => {
res.json({ ok: true });
});

app.get("/api/feedback", (req: AuthRequest, res: Response) => {
    verifyToken(req, res, () => {
      requireAdmin(req, res, () => {
        getFeedback(req, res);
      });
    });
});

app.post("/api/feedback", (req : Request , res: Response) => {
    createFeedback(req, res);
});

app.post("/api/auth/login", (req: Request, res: Response) => {
    adminLogin(req, res);
});

app.patch("/api/feedback/:id", (req: AuthRequest, res: Response) => {
    verifyToken(req, res, () => {
      requireAdmin(req, res, () => {
        updateFeedback(req, res);
      });
    });
});


connectDB().then(() => {
    app.listen(PORT, () => {
    console.log("Backend running on port " + PORT);
    })
}).catch((error) => {
    console.error("Error starting backend:", error);
    process.exit(1);});




