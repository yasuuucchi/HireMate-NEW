import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/layouts/Navigation';
import { SWRProvider } from '@/components/providers/SWRProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HireMate',
  description: '採用管理システム',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <SWRProvider>
          <Navigation />
          {children}
        </SWRProvider>
      </body>
    </html>
  );
}
