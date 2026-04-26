import Link from 'next/link';
import { Metadata } from 'next';

const BASE_URL = 'https://notehub-goit.vercel.app';

export const metadata: Metadata = {
  title: 'Сторінку не знайдено | NoteHub',
  description: 'На жаль, такої сторінки не існує на NoteHub.',
  openGraph: {
    title: 'Сторінку не знайдено | NoteHub',
    description: 'На жаль, такої сторінки не існує на NoteHub.',
    url: `${BASE_URL}/not-found`,
    images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
  },
};

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404 - Сторінку не знайдено</h1>
      <p>Схоже, ви заблукали.</p>
      <Link href="/notes">Повернутися до нотаток</Link>
    </div>
  );
}