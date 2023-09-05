import './globals.css';
import { Inter } from 'next/font/google';
import NextAuthSessionProvider from '@/components/NextAuthSessionProvider';
import ReactQueryProvider from '@/components/ReactQueryProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Pin My Map',
  description: 'Create a personalised map of your world. Mark your favorite spots, travel footprints and explore new places.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <NextAuthSessionProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
