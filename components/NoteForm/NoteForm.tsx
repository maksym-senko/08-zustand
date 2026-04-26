'use client';

import { useNoteStore } from '@/lib/store/noteStore';
import { useRouter } from 'next/navigation';
import type { NoteTag } from '@/types/note';
import { NOTE_TAGS } from '@/types/note';
import css from './NoteForm.module.css';

type NoteFormProps = {
  createNoteAction: (formData: FormData) => Promise<void>;
};

export default function NoteForm({ createNoteAction }: NoteFormProps) {
  const router = useRouter();
  const { draft, setDraft } = useNoteStore();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setDraft({
      [name]: value,
    } as Partial<{ title: string; content: string; tag: NoteTag }>);
  };

  return (
    <form className={css.form}>
      <input
        name="title"
        value={draft.title}
        onChange={handleChange}
        required
        className={css.input}
      />
      <textarea
        name="content"
        value={draft.content}
        onChange={handleChange}
        required
        className={css.textarea}
      />
      <select
        name="tag"
        value={draft.tag}
        onChange={handleChange}
        className={css.select}
      >
        {NOTE_TAGS.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>
      <div className={css.actions}>
        <button type="submit" formAction={createNoteAction} className={css.submit}>
          Create
        </button>
        <button type="button" onClick={() => router.back()} className={css.cancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
