import {z} from "zod";

export const createFeedbackSchema = z.object({
    title:z.string().min(1).max(120),
    description: z.string().min(20).max(2000),
    category: z.enum(["Bug", "Feature Request", "Improvement"]),
    submitterName: z.string().max(50).optional(),
    submitterEmail: z.string().max(100).optional(),
});

export type CreateFeedbackRequest = z.infer<typeof createFeedbackSchema>;