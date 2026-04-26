import { Metadata } from 'next';
import { fetchNoteById } from '@/lib/api/notes';
import { NoteDetails } from '@/components/NoteDetails/NoteDetails';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const note = await fetchNoteById(params.id);

  return {
    title: `${note.title} | NoteHub`,
    description: note.content.slice(0, 150),
    openGraph: {
      title: note.title,
      description: note.content.slice(0, 150),
      url: `https://your-domain.vercel.app/notes/${params.id}`,
      images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
    },
  };
}

export default async function NotePage({ params }: Props) {
  const note = await fetchNoteById(params.id);
  return <NoteDetails note={note} />;
}