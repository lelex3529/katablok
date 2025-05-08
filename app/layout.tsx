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
        <div className='min-h-screen bg-gradient-to-br from-katalyx-off-white via-white to-katalyx-off-white relative'>
          {/* Decorative elements */}
          <div className='fixed inset-0 z-0 overflow-hidden'>
            <div className='absolute -top-[10%] -right-[10%] w-[35%] h-[35%] rounded-full bg-katalyx-primary/5'></div>
            <div className='absolute top-[30%] -left-[15%] w-[30%] h-[30%] rounded-full bg-katalyx-secondary/5'></div>
            <div className='absolute -bottom-[10%] right-[20%] w-[25%] h-[25%] rounded-full bg-katalyx-tertiary/5'></div>
          </div>

          {/* Main content */}
          <div className='relative z-10 flex'>
            <Sidebar />
            <main className='flex-1 min-h-screen md:ml-72 transition-all duration-300'>
              <div className='container mx-auto px-6 py-10'>{children}</div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
