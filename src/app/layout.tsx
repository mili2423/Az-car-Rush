import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['400', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Azúcar Rush — Pasteler\u00eda',
  description: 'Juego 3D de gesti\u00f3n y rapidez en primera persona. Hornea, decora y levanta tu pasteler\u00eda hasta la Gran Apertura.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={outfit.variable}>
      <body className="font-sans antialiased overflow-hidden select-none bg-pink-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
