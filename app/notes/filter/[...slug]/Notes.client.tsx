'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesList from '@/components/NoteList/NoteList';
import { NOTE_TAGS } from '@/types/note';
import styles from './page.module.css';
import Link from 'next/link';

interface NotesClientProps {
  initialFilter: string;
}

export default function NotesClient({ initialFilter }: NotesClientProps) {
  const tag = initialFilter === 'all' ? undefined : initialFilter;
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['filteredNotes', initialFilter],
    queryFn: () => fetchNotes({ 
      page: 1, 
      perPage: 100, 
      tag: tag 
    }),
  });

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading notes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error loading notes. Please try again later.</p>
        <Link href="/notes" className={styles.backLink}>
          ← Back to all notes
        </Link>
      </div>
    );
  }

  const notes = data?.notes || [];

  return (
    <>
      <div className={styles.tagsSection}>
        <h2 className={styles.tagsTitle}>Filter by tag:</h2>
        <div className={styles.tagsList}>
          <Link
            href="/notes/filter/all"
            className={`${styles.tagLink} ${initialFilter === 'all' ? styles.activeTag : ''}`}
          >
            All
          </Link>
          {NOTE_TAGS.map((tag) => (
            <Link
              key={tag}
              href={`/notes/filter/${tag}`}
              className={`${styles.tagLink} ${
                tag === initialFilter ? styles.activeTag : ''
              }`}
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {notes.length === 0 ? (
        <div className={styles.empty}>
          <p>No notes found with tag: {initialFilter === 'all' ? 'all' : initialFilter}</p>
          <Link href="/notes/action/create" className={styles.createLink}>
            Create your first note with this tag
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.resultsCount}>
            Found {notes.length} note{notes.length !== 1 ? 's' : ''}
          </div>
          <NotesList notes={notes} />
        </>
      )}
    </>
  );
}