import z from "zod";

export const questionSchema = z
  .object({
    question: z.string().trim().min(1, "Question is required.").max(255, "Question is too long."),
    correctAnswer: z.string().trim().min(1, "Question answer is required").max(255, "Answer is too long."),
    explanation: z.string().trim().min(1, "Explanation is required").max(1500, "Explanation is too long."),
    points: z.number().positive("Points must be greater than 0").lte(50, "Points must be less or equal to 50"),
    options: z
      .array(z.string().trim().max(255, "Option is too long"))
      .transform((opts) => opts.filter(Boolean))
      .refine((opts) => opts.length === 0 || opts.length >= 2, {
        message: "Add at least 2 options (or none)",
      }),
    experimentId: z
      .string()
      .nullable()
      .refine((value) => !!value, { message: "Select an experiment" }),
  })
  .refine(
    (data) => data.options.length === 0 || data.options.includes(data.correctAnswer),
    { message: "The answer must be one of the options", path: ["correctAnswer"] }
  );