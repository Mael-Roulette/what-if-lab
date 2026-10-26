"use client"

import QuestionCard from "@/components/questions/question-card";
import { useQuestions } from "@/hooks/questions/use-questions";
import Link from "next/link";
import { useEffect } from "react";

export default function QuestionsPage() {

  const { getAllQuestions, questions, isLoading, error } = useQuestions();

  useEffect(() => {
    getAllQuestions();
  }, [getAllQuestions])

  if ( isLoading ) {
    return (
      <>
        <div className="flex justify-between items-center gap-4">
          <h1>Questions</h1>
          <Link href="/admin/questions/new" className="btn-primary">Add a question</Link>
        </div>
        <p>Loading...</p>
      </>
    )
  }

  if ( error ) {
    return (
      <>
        <div className="flex justify-between items-center gap-4">
          <h1>Questions</h1>
          <Link href="/admin/questions/new" className="btn-primary">Add a question</Link>
        </div>
        <p>An error occurred while getting the questions.</p>
        <p>{ error }</p>
      </>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <h1>Questions</h1>
        <Link href="/admin/questions/new" className="btn-primary">Add a question</Link>
      </div>
      { questions.length > 0 ? (
        <ul className="flex flex-col gap-4 mt-6">
          {questions.map((question) => (
            <li key={question.$id}>
              <QuestionCard question={question} onDeleted={getAllQuestions} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center rounded-xl border border-dashed bg-foreground/10 border-blue/40 px-6 py-14 mt-6 text-center">
          <p className="font-bold text-lg">No questions yet</p>
          <p className="opacity-70">
            Create your first question to start collecting results.
          </p>
          <Link href="/admin/questions/new" className="btn-primary mt-5">
            Create a question
          </Link>
        </div>
      )}
    </>
  )
}