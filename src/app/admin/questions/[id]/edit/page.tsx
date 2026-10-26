"use client"

import EditQuestionForm from "@/components/questions/form/edit-question-form";
import { useExperiment } from "@/hooks/experiments/use-experiments";
import { useQuestions } from "@/hooks/questions/use-questions";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function EditQuestionPage() {
  const { id } = useParams<{ id: string }>();

  const { experiments, isLoading: experimentLoading, error: experimentError, getAllExperiments } = useExperiment();
  const { question, isLoading: questionLoading, error: questionError, getQuestionById } = useQuestions();

  useEffect(() => {
    getAllExperiments();
  }, [getAllExperiments]);

  useEffect(() => {
    if (id) getQuestionById(id);
  }, [id, getQuestionById]);

  if (experimentLoading || questionLoading) {
    return (
      <div>
        <h1 className="mb-6">Edit question</h1>
        <p>Form loading...</p>
      </div>
    );
  }

  if (experimentError || questionError || !question) {
    return (
      <div>
        <h1 className="mb-6">Edit question</h1>
        <p>An error occurred...</p>
        <p>{experimentError ?? questionError ?? "Question not found."}</p>
      </div>
    );
  }

  return (
    <div>
      <Link href="/admin/questions" className="link">
        Back to questions
      </Link>
      <h1 className="mb-6 mt-3">Edit question</h1>
      <EditQuestionForm key={question.$id} question={question} experiments={experiments} />
    </div>
  );
}