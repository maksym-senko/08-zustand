import { Metadata } from 'next';
import { NotesPage } from '@/components/NotesPage/NotesPage';

type Props = {
  params: Promise<{ slug: string[] }>;
};

const BASE_URL = 'https://notehub-goit.vercel.app';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const rawTag = slug[0] ?? 'all';
  const visibleTag = rawTag === 'all' ? 'All notes' : rawTag;
  const title = `${visibleTag} | NoteHub`;
  const description =
    rawTag === 'all'
      ? 'Browse all notes on NoteHub.'
      : `Browse all notes filtered by ${rawTag}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/notes/filter/${rawTag}`,
      images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
    },
  };
}

export default async function FilterPage({ params }: Props) {
  const { slug } = await params;
  const rawTag = slug[0] ?? 'all';
  const tag = rawTag === 'all' ? undefined : rawTag;

  return (
    <main>
      <NotesPage tag={tag} />
    </main>
  );
}