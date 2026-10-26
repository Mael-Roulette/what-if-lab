import { getQuestionById, getQuestions } from "@/lib/appwrite/question";
import { QuestionResponse } from "@/types";
import { useCallback, useState } from "react";

export function useQuestions() {
  const [questions, setQuestions] = useState<QuestionResponse[]>([]);
  const [question, setQuestion] = useState<QuestionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAllQuestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getQuestions();
      setQuestions(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      setError("Failed to load questions.");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getQuestion = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getQuestionById(id);

      if (!result) {
        setQuestion(null);
        setError("Question not found.");
        return null;
      }

      setQuestion(result);
      return result;
    } catch (err) {
      console.error(err);
      setError("Failed to load question.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    questions,
    question,
    isLoading,
    error,
    getAllQuestions,
    getQuestionById: getQuestion,
  };
}