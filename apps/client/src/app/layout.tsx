import type { Metadata } from 'next';
import { Archivo } from 'next/font/google';
import './globals.css';

const archivo = Archivo({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Voguify — Start with $0 investment',
  description:
    'Create and sell custom print-on-demand products with $0 investment.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={archivo.className}>{children}</body>
    </html>
  );
}
