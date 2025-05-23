import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center">
        <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/90 transition-colors">
          Art Explorer
        </Link>
        {/* Navigation items can be added here if needed later */}
        {/* <nav className="ml-auto flex gap-4">
          <Link href="/gallery" className="text-sm font-medium text-muted-foreground hover:text-primary">Gallery</Link>
          <Link href="/artists" className="text-sm font-medium text-muted-foreground hover:text-primary">Artists</Link>
          <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary">About</Link>
        </nav> */}
      </div>
    </header>
  );
}
