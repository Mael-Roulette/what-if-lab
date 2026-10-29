"use client"

import QuestionForm from "@/components/questions/form/question-form";
import { useExperiment } from "@/hooks/experiments/use-experiments";
import { useCreateQuestion } from "@/hooks/questions/use-create-question";
import { QuestionRequest } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";

type QuestionFormFields = {
  question: string;
  correctAnswer: string;
  explanation: string;
  points: number;
  experimentId: string;
};

const initialFields: QuestionFormFields = {
  question: "",
  correctAnswer: "",
  explanation: "",
  points: 0,
  experimentId: "",
};

export default function NewQuestionPage() {
  const { experiments, isLoading: experimentLoading, error: experimentError, getAllExperiments } = useExperiment();
  const [fields, setFields] = useState<QuestionFormFields>(initialFields);
  const { submitQuestion, errors: questionErrors, message, isSubmitting } = useCreateQuestion();

  useEffect(() => {
    getAllExperiments();
  }, [getAllExperiments]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;

    setFields((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? 0 : Number(value)) : value,
    }));
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const request: QuestionRequest = {
      ...fields,
      experimentId: fields.experimentId || null,
    };

    const success = await submitQuestion(request);

    if (success) {
      setFields(initialFields);
    }
  };

  if (experimentLoading) {
    return (
      <div>
        <h1 className="mb-6">Add a question</h1>
        <p>Form loading...</p>
      </div>
    );
  }

  if (experimentError) {
    return (
      <div>
        <h1 className="mb-6">Add a question</h1>
        <p>An error occurred...</p>
        <p>{experimentError}</p>
      </div>
    );
  }

  return (
    <div>
      <Link href="/admin/questions" className="link">
        Back to questions
      </Link>
      <h1 className="mb-6 mt-3">Add a question</h1>

      <QuestionForm
        fields={fields}
        experiments={experiments}
        questionErrors={questionErrors}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        message={message}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}