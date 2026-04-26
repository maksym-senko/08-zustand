import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { TanStackProvider } from "@/components/TanStackProvider/TanStackProvider";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import "./globals.css";

const BASE_URL = "https://notehub-goit.vercel.app";
const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "NoteHub",
  description: "Manage your notes efficiently",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "NoteHub",
    description: "Manage your notes efficiently",
    url: BASE_URL,
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
  },
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.variable} suppressHydrationWarning>
        <TanStackProvider>
          <div className="layout-wrapper">
            <Header />

            <main>{children}</main>

            {modal}

            <Footer />
          </div>
          
          <div id="modal-root"></div>
        </TanStackProvider>
      </body>
    </html>
  );
}