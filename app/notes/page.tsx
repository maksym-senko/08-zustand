import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My Notes | NoteHub",
  description: "Manage and filter your notes",
};

export default function NotesPage() {
  return (
    <main>
      <h1>Notes</h1>
      <Link href="/notes/action/create">Create note +</Link>
    </main>
  );
}