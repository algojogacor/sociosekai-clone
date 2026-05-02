import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Header } from '@/components/layout/Header';
import { Tabs } from '@/components/layout/Tabs';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'SOCIOSEKAI — Multimodal Forum',
  description: 'A dark-themed multimodal forum with music embeds and AI features',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <ThemeProvider>
          <Header />
          <Tabs />
          <main className="mx-auto max-w-[680px] px-4">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
