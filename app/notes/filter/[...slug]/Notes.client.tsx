'use client';

import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesList from '@/components/NoteList/NoteList';
import { Pagination } from '@/components/Pagination/Pagination';
import { SearchBox } from '@/components/SearchBox/SearchBox';
import { NOTE_TAGS } from '@/types/note';
import styles from './page.module.css';
import Link from 'next/link';

interface NotesClientProps {
  initialFilter: string;
}

const DEBOUNCE_DELAY = 300;
const PER_PAGE = 12;

export default function NotesClient({ initialFilter }: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  const tag = initialFilter === 'all' ? undefined : initialFilter;

  // Дебаунс для пошукового запиту
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(0); // Скидаємо на першу сторінку при новому пошуку
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['filteredNotes', initialFilter, debouncedSearchQuery, currentPage],
    queryFn: () => fetchNotes({ 
      page: currentPage + 1, // react-paginate використовує 0-based індексування
      perPage: PER_PAGE, 
      tag: tag,
      search: debouncedSearchQuery,
    }),
  });

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

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
  const totalPages = data?.totalPages || 0;

  return (
    <>
      <SearchBox value={searchQuery} onChange={handleSearchChange} />

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
          <p>No notes found {debouncedSearchQuery && `matching "${debouncedSearchQuery}"`} with tag: {initialFilter === 'all' ? 'all' : initialFilter}</p>
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
          {totalPages > 1 && (
            <Pagination 
              pageCount={totalPages}
              forcePage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </>
  );
}