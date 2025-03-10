import { z } from "zod";

export const questionSchema = z.object({
  term: z.string(),
  definition: z.string(),
  options: z
    .array(z.string())
    .length(4)
    .optional()
    .describe("Multiple choice options for quiz mode"),
  answer: z
    .enum(["A", "B", "C", "D"])
    .optional()
    .describe("Correct answer for quiz mode"),
});

export type Question = z.infer<typeof questionSchema>;

export const questionsSchema = z.array(questionSchema).min(4);

export type LearningMode = "flashcards" | "quiz" | "match";
