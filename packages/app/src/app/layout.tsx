import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import { Providers } from '../providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'SpeakUp · Give every on-chain shareholder a voice',
  description:
    'AI Copilot for on-chain shareholder governance. Read 100-page proxy statements in three lines, vote in one click, record on-chain.',
};

export const viewport: Viewport = {
  themeColor: '#0a0f1c',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
