import z from "zod";

export const questionSchema = z
  .object({
    question: z.string().trim().min(1, "Question is required.").max(255, "Question is too long."),
    correctAnswer: z.string().trim().min(1, "Question answer is required").max(255, "Answer is too long."),
    explanation: z.string().trim().min(1, "Explanation is required").max(1500, "Explanation is too long."),
    points: z.number().positive("Points must be greater than 0").lte(100, "Points must be less or equal to 100"),
  })