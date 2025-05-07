import type { Metadata } from 'next';
import { Open_Sans, Sora } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/navigation/Sidebar';

// Charger les polices
const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sora',
});

export const metadata: Metadata = {
  title: 'Katalyx Proposals',
  description: 'Génération de propositions commerciales automatisées',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='fr' className={`${openSans.variable} ${sora.variable}`}>
      <body className='bg-katalyx-off-white font-inter'>
        <div className='flex'>
          <Sidebar />
          <main className='flex-1 min-h-screen md:ml-64 transition-all duration-300'>
            <div className='container mx-auto px-4 sm:px-6 py-8'>
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
