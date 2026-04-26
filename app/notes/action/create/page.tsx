import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createNote } from '@/lib/api/notes';
import type { NoteTag } from '@/types/note';
import NoteForm from '@/components/NoteForm/NoteForm';
import css from './CreateNote.module.css';

const BASE_URL = 'https://notehub-goit.vercel.app';

export const metadata: Metadata = {
  title: 'Create Note | NoteHub',
  description: 'Create a new note to keep your thoughts organized.',
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: 'Create Note | NoteHub',
    description: 'Create a new note to keep your thoughts organized.',
    url: `${BASE_URL}/notes/action/create`,
    images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
  },
};

async function createNoteAction(formData: FormData) {
  'use server';

  const title = formData.get('title')?.toString().trim() ?? '';
  const content = formData.get('content')?.toString().trim() ?? '';
  const tag = (formData.get('tag')?.toString() ?? 'Todo') as NoteTag;

  if (!title || !content) {
    throw new Error('Title and content are required');
  }

  await createNote({ title, content, tag });
  redirect('/notes?created=1');
}

export default function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm createNoteAction={createNoteAction} />
      </div>
    </main>
  );
}