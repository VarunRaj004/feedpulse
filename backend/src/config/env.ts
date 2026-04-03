import dotenv from "dotenv"

dotenv.config();

export const config = {
    mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/feedpulse",
    jwtSecret: process.env.JWT_SECRET ,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    nodeEnv: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT) || 5000,
    geminiApiKey: process.env.GEMINI_API_KEY,
}