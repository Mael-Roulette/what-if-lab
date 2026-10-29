import { QuestionRequest } from "@/types";
import { FormField } from "../../form/form-field";
import { ExperimentResponse } from "@/types/experiment";

export default function QuestionForm (
  { fields,
    experiments,
    questionErrors,
    handleChange,
    handleSubmit,
    message,
    isSubmitting,
    submitLabel = "Add question",
    submittingLabel = "Creation..." }:
  { fields: QuestionRequest,
    experiments: ExperimentResponse[],
    questionErrors: Record<string, string>,
    handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void,
    handleSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void,
    message: string,
    isSubmitting: boolean,
    submitLabel?: string,
    submittingLabel?: string }
) {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4 rounded-xl border border-foreground/15 bg-white/60 p-6">
        <FormField label="Question" htmlFor="question" error={questionErrors["question"]}>
          <input
            type="text"
            id="question"
            name="question"
            placeholder="Does the distance change if the gravity is doubled ? (yes/no)"
            value={fields.question}
            onChange={handleChange}
            className="w-full"
          />
        </FormField>

        <FormField label="Answer" htmlFor="correctAnswer" error={questionErrors["correctAnswer"]}>
          <input
            type="text"
            id="correctAnswer"
            name="correctAnswer"
            placeholder="Yes"
            value={fields.correctAnswer}
            onChange={handleChange}
            className="w-full"
          />
        </FormField>

        <FormField label="Explanation" htmlFor="explanation" error={questionErrors["explanation"]}>
          <textarea
            id="explanation"
            name="explanation"
            placeholder="It's because..."
            value={fields.explanation}
            onChange={handleChange}
            className="w-full"
          />
        </FormField>

        <FormField label="Points" htmlFor="points" error={questionErrors["points"]}>
          <input
            type="number"
            id="points"
            name="points"
            placeholder="20"
            min={0}
            value={fields.points === 0 ? "" : fields.points}
            onChange={handleChange}
          />
        </FormField>

        <FormField label="Experiment" htmlFor="experimentId" error={questionErrors["experimentId"]}>
          <select
            id="experimentId"
            name="experimentId"
            value={fields.experimentId || ""}
            onChange={handleChange}
          >
            <option value="" disabled>Select an experiment</option>
            {experiments.map((experiment) => (
              <option key={experiment.$id} value={experiment.$id}>
                {experiment.title}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="flex flex-col items-end gap-4">
        {message && <p role="alert" className="rounded-full px-3 py-1.5 border border-green-900 bg-green-100">{message}</p>}

        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? submittingLabel : submitLabel}
        </button>
      </div>
    </form>
  )
}