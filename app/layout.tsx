import Providers from './providers';
import { Roboto } from 'next/font/google';
import { Metadata } from 'next';
import './globals.css';

const BASE_URL = 'https://notehub-goit.vercel.app';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'NoteHub',
  description: 'NoteHub helps you capture, organize and filter notes in one place.',
  openGraph: {
    title: 'NoteHub',
    description: 'NoteHub helps you capture, organize and filter notes in one place.',
    url: BASE_URL,
    images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='uk' className={roboto.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}