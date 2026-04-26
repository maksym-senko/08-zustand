'use client';

import { useRouter } from 'next/navigation';
import { useNoteStore } from '@/lib/store/noteStore';
import { NOTE_TAGS } from '@/types/note';
import styles from './NoteForm.module.css';

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
    setDraft({ [name]: value });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form action={createNoteAction} method="post" className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="title" className={styles.label}>
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={draft.title}
          onChange={handleChange}
          required
          className={styles.input}
          placeholder="Enter note title"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="tag" className={styles.label}>
          Tag *
        </label>
        <select
          id="tag"
          name="tag"
          value={draft.tag}
          onChange={handleChange}
          required
          className={styles.select}
        >
          {NOTE_TAGS.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="content" className={styles.label}>
          Content *
        </label>
        <textarea
          id="content"
          name="content"
          value={draft.content}
          onChange={handleChange}
          required
          className={styles.textarea}
          placeholder="Write your note content here..."
          rows={8}
        />
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={handleCancel} className={styles.cancelButton}>
          Cancel
        </button>
        <button type="submit" className={styles.submitButton}>
          Create Note
        </button>
      </div>
    </form>
  );
}