import { createQuestion } from "@/lib/appwrite/question";
import { questionSchema } from "@/lib/validations/question";
import { QuestionRequest } from "@/types";
import { useState } from "react";

export function useCreateQuestion() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function submitQuestion(
    questionRequest: QuestionRequest
  ) {
    setMessage("");
    setErrors({});

    const result = questionSchema.safeParse(questionRequest);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      for (const issue of result.error.issues) {
        const key = issue.path.join(".");

        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }

      setErrors(fieldErrors);
      return false;
    }

    setIsSubmitting(true);

    try {
      const request = result.data;

      await createQuestion( request );
      
      setMessage("Question created successfully.");
      return true;
    } catch (error) {
      console.error(error);
      setMessage("Failed to create question.");

      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    submitQuestion,
    errors,
    message,
    isSubmitting
  }
}