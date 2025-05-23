
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Header } from '@/components/Header';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Art Explorer - Discover Timeless Artistry',
  description: 'Explore a curated collection of masterpieces from the Art Institute of Chicago and other renowned artists.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased flex flex-col min-h-screen bg-background text-foreground">
        <AuthProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Toaster />
          <footer className="py-8 text-center text-muted-foreground text-sm border-t border-border mt-auto bg-card">
            <p>&copy; {new Date().getFullYear()} Art Explorer. All rights reserved.</p>
            <p>Powered by creativity and code. Artwork data from public APIs.</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
