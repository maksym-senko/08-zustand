'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useNoteStore } from '@/lib/store/noteStore';
import { createNote } from '@/lib/api';
import { NOTE_TAGS } from '@/types/note';
import styles from './NoteForm.module.css';

interface NoteFormProps {
  createNoteAction?: (formData: FormData) => Promise<{ error?: string } | void>;
}

export default function NoteForm({ createNoteAction }: NoteFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { draft, setDraft, clearDraft } = useNoteStore();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDraft({ [name]: value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (createNoteAction) {
        const formData = new FormData(e.currentTarget);
        const result = await createNoteAction(formData);
        
        if (result && typeof result === 'object' && 'error' in result && result.error) {
          setError(result.error);
          setIsSubmitting(false);
          return;
        }
        
        clearDraft();
        router.push('/notes?created=1');
      } else {
        await createNote({
          title: draft.title,
          content: draft.content,
          tag: draft.tag,
        });
        clearDraft();
        router.push('/notes?created=1');
      }
    } catch (err) {
      console.error('Failed to create note:', err);
      setError('Failed to create note. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
      
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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.actions}>
        <button 
          type="button" 
          onClick={handleCancel} 
          className={styles.cancelButton}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Note'}
        </button>
      </div>
    </form>
  );
}