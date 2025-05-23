import type { Metadata } from 'next';
import { GeistSans } from 'next/font/google'; // Corrected import for GeistSans
import './globals.css';
import { Header } from '@/components/Header';
import { Toaster } from "@/components/ui/toaster"; // Ensure Toaster is imported

const geistSans = GeistSans({ // Correct instantiation
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

// GeistMono is not explicitly used but kept from original for font variable consistency
import { GeistMono } from 'next/font/google';
const geistMono = GeistMono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});


export const metadata: Metadata = {
  title: 'Art Explorer',
  description: 'Discover and explore artworks from the Art Institute of Chicago.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Toaster />
        <footer className="py-6 text-center text-muted-foreground text-sm border-t border-border mt-auto">
          <p>&copy; {new Date().getFullYear()} Art Explorer. All rights reserved.</p>
          <p>Artwork data provided by the Art Institute of Chicago API.</p>
        </footer>
      </body>
    </html>
  );
}
