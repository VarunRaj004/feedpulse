import express from "express";
import type { Request, Response } from "express";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.get("/health", (_req: Request, res: Response) => {
res.json({ ok: true });
});

app.listen(PORT, () => {
console.log("Backend running on port " + PORT);
});