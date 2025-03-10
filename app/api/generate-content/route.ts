import { questionSchema, questionsSchema } from "@/lib/schemas";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { files, mode } = await req.json();
  const firstFile = files[0].data;

  const systemPrompt = mode === "quiz" 
    ? "Create multiple choice questions based on the content"
    : "Create question-answer pairs from the content. Each question should be a complete sentence asking about a concept, and the answer should be concise and direct. For example, Q: 'What are the three core relationships that form the core of a firm's business environment?' A: 'Customers, suppliers, and competitors.'";

  const result = streamObject({
    model: google("gemini-1.5-pro-latest"),
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Process this document and generate learning content.",
          },
          {
            type: "file",
            data: firstFile,
            mimeType: "application/pdf",
          },
        ],
      },
    ],
    schema: questionSchema,
    output: "array",
    onFinish: ({ object }) => {
      const res = questionsSchema.safeParse(object);
      if (res.error) {
        throw new Error(res.error.errors.map((e) => e.message).join("\n"));
      }
    },
  });

  return result.toTextStreamResponse();
} 