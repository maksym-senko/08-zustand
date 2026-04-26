'use client';

import { useRouter } from 'next/navigation';
import { Modal } from '@/components/Modal/Modal';
import { NoteDetails } from '@/components/NoteDetails/NoteDetails';
import { fetchNotes } from '@/lib/api/notes';
import { Note } from '@/types/note';
import { useEffect, useState } from 'react';

type Props = {
  params: Promise<{ id: string }>;
};

export default function ModalNoteDetailsPage({ params }: Props) {
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadNote = async () => {
      try {
        const { id } = await params;
        const response = await fetch(`https://notehub-public.goit.study/api/notes/${id}`, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
          },
        });

        if (!response.ok) throw new Error('Failed to load note');
        const data = await response.json();
        
        if (isMounted) {
          setNote(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setNote(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadNote();

    return () => {
      isMounted = false;
    };
  }, [params]);

  const handleClose = () => {
    router.back();
  };

  if (loading) return <Modal onClose={handleClose}><div>Loading...</div></Modal>;
  if (error || !note) return <Modal onClose={handleClose}><div>Error: {error}</div></Modal>;

  return (
    <Modal onClose={handleClose}>
      <NoteDetails note={note} />
    </Modal>
  );
}
