import { deleteQuestion } from "@/lib/appwrite/question";
import { useState } from "react";

export function useDeleteQuestion() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState("");

  async function removeQuestion(id: string) {
    setMessage("");
    setIsDeleting(true);

    try {
      await deleteQuestion(id);
      return true;
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete question.");
      return false;
    } finally {
      setIsDeleting(false);
    }
  }

  return { removeQuestion, message, isDeleting };
}