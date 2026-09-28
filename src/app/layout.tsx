import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['400', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Azúcar Rush - Pastelería en Primera Persona 3D',
  description: 'Juego 3D de gestión y rapidez en primera persona. Hornea, decora y levanta tu pastelería hasta la Gran Apertura.',
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
