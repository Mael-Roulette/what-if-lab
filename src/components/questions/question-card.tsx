"use client"

import { QuestionResponse } from "@/types";
import { formatDate } from "@/utils/date";
import Link from "next/link";
import { useState } from "react";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import ConfirmModal from "../confirm-modal";
import { useDeleteQuestion } from "@/hooks/questions/use-delete-question";

export default function QuestionCard({ question, onDeleted }: { question: QuestionResponse, onDeleted: () => void }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { removeQuestion, message, isDeleting } = useDeleteQuestion();

  const handleDelete = async () => {
    const success = await removeQuestion(question.$id);

    if (success) {
      setIsDeleteOpen(false);
      onDeleted();
    }
  };

  return (
    <>
      <div className="flex flex-col w-full rounded-xl border border-blue/30 bg-foreground/10 p-4 transition-all hover:border-blue/60 group">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <p className="title-2">{question.question}</p>
            <p className="inline-flex shrink-0 items-baseline gap-1 rounded-full border border-zinc-800 bg-zinc-100 px-2 py-0.5">
              {question.points}
              <span className="text-sm">pts</span>
            </p>
          </div>

          <div className="invisible group-hover:visible flex gap-3 items-center">
            <Link
              href={`/admin/questions/${question.$id}/edit`}
              aria-label="Edit question"
              className="px-3 py-1.5 rounded bg-blue/10 border border-blue"
            >
              <MdEdit />
            </Link>

            <button
              type="button"
              aria-label="Delete question"
              onClick={() => setIsDeleteOpen(true)}
              className="px-3 py-1.5 rounded bg-red-100 border border-red-900 cursor-pointer"
            >
              <MdDeleteForever />
            </button>
          </div>
        </div>

        <p className="mt-2 text-foreground/80">{question.correctAnswer}</p>

        <p className="border-t border-blue/20 pt-2 text-xs opacity-60 mt-4">
          Updated {formatDate(question.$updatedAt)}
        </p>
      </div>

      <ConfirmModal
        open={isDeleteOpen}
        variant="danger"
        title="Delete this question?"
        message={message || "This action cannot be undone."}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setIsDeleteOpen(false)}
      />
    </>
  );
}