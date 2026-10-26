import Link from "next/link";

export default function QuestionsPage() {
  return (
    <div className="flex justify-between items-center gap-4">
      <h1>Questions</h1>
      <Link href="/admin/questions/new" className="btn-primary">Add a question</Link>
    </div>
  )
}