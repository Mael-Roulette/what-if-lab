"use client"

import { useUpdateQuestion } from "@/hooks/questions/use-update-question";
import { QuestionRequest, QuestionResponse } from "@/types";
import { ExperimentResponse } from "@/types/experiment";
import { useState } from "react";
import QuestionForm from "./question-form";

export default function EditQuestionForm({
  question,
  experiments,
}: {
  question: QuestionResponse;
  experiments: ExperimentResponse[];
}) {
  const [fields, setFields] = useState<QuestionRequest>({
    question: question.question,
    correctAnswer: question.correctAnswer,
    options: question.options ?? [],
    explanation: question.explanation,
    points: question.points,
    experimentId: question.experimentId,
  });

  const { submitQuestion, errors, message, isSubmitting } = useUpdateQuestion();

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;

    setFields((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? 0 : Number(value)) : value,
    }));
  };

  const handleOptionsChange = (options: string[]) =>
    setFields((prev) => ({ ...prev, options }));

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submitQuestion(question.$id, fields);
  };

  return (
    <QuestionForm
      fields={fields}
      experiments={experiments}
      questionErrors={errors}
      handleChange={handleChange}
      onOptionsChange={handleOptionsChange}
      handleSubmit={handleSubmit}
      message={message}
      isSubmitting={isSubmitting}
      submitLabel="Save changes"
      submittingLabel="Saving..."
    />
  );
}