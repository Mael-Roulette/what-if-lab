"use client"

import { FormField } from "@/components/form/form-field"

export default function NewQuestionPage() {
  const handleSubmit = () => {
    // TODO : Handle question creation
  }

  return (
    <div>
      <h1 className="mb-6">Add a question</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4 rounded-xl border border-foreground/15 bg-white/60 p-6">
          <FormField label="Question" htmlFor="question">
            <input
              type="text"
              id="question"
              placeholder="Does the distance change if the gravity is doubled ? (yes/no)"
              className="w-full"
            />
          </FormField>

          <FormField label="Answer" htmlFor="answer">
            <input
              type="text"
              id="answer"
              placeholder="Yes"
              className="w-full"
            />
          </FormField>

          <FormField label="Explanation" htmlFor="explanation">
            <textarea
              id="explanation"
              placeholder="It's because..."
              className="w-full"
            />
          </FormField>

          <FormField label="Point" htmlFor="point">
            <input
              type="number"
              id="point"
              placeholder="20"
            />
          </FormField>

          {/* TODO : Add experiment selection field */}
        </div>

        <div className="flex flex-col items-end gap-4">
          <button type="submit" className="btn-primary">
            Add question
          </button>
        </div>
      </form>
    </div>
  )
}