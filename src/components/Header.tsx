import Link from 'next/link';
import { Palette } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center">
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-primary hover:text-primary/90 transition-colors">
          <Palette className="w-7 h-7" />
          <span>Art Explorer</span>
        </Link>
      </div>
    </header>
  );
}
