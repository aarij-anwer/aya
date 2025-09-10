import { type Metadata } from 'next';
import { Inter, Lexend } from 'next/font/google';
import clsx from 'clsx';
import { Analytics } from '@vercel/analytics/next';

import '@/styles/tailwind.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.qutoofacademy.com'),
  title: {
    template: '%s - Qutoof Academy',
    default: 'Qutoof Academy',
  },
  description: 'Bringing the fruits of the Qur&apos;an closer.',
  openGraph: {
    title: 'Qutoof Academy',
    description: 'Bringing the fruits of the Qur&apos;an closer.',
    url: 'https://www.qutoofacademy.com',
    siteName: 'Qutoof Academy',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Qutoof Academy banner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Qutoof Academy',
    description: "Bringing the fruits of the Qur'an closer.",
    images: ['/og-image.jpg'],
  },
};

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={clsx(
        'h-full scroll-smooth bg-white antialiased',
        inter.variable,
        lexend.variable
      )}
    >
      <body className="flex h-full flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
