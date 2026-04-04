import z from "zod"

export const updateFeedbackSchema = z.object({
    status: z.enum(["New" , "In Progress" , "Completed"]).optional()
})

export type UpdateFeedback = z.infer<typeof updateFeedbackSchema>