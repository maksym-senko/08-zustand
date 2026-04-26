'use client';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '@/lib/api/notes';
import type { Note } from '@/types/note';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
}

export const NoteList = ({ notes }: NoteListProps) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  if (notes.length === 0) {
    return <p className={css.empty}>No notes found.</p>;
  }

  return (
    <ul className={css.list}>
      {notes.map(({ id, title, content, tag }) => (
        <li key={id} className={css.listItem}>
          <div className={css.content}>
            <div className={css.header}>
              <h2>{title}</h2>
              <span className={css.tag}>{tag}</span>
            </div>
            <p>{content}</p>
          </div>
          <div className={css.actions}>
            <Link href={`/notes/${id}`} className={css.detailsBtn}>
              View details
            </Link>
            <button 
              type="button" 
              className={css.deleteBtn}
              onClick={() => mutate(id)}
              disabled={isPending}
            >
              {isPending ? '...' : 'Delete'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};