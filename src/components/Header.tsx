import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Import Button for styling links

const categories = [
  { name: "Paintings", query: "painting" },
  { name: "Sculptures", query: "sculpture" },
  { name: "Photography", query: "photography" },
  { name: "Drawings & Prints", query: "drawing OR print" }, // Using OR for broader search
  { name: "Textiles & Fabrics", query: "textile OR fabric" },
];

export function Header() {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-auto md:h-16 flex flex-col md:flex-row items-center justify-between py-2 md:py-0">
        <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/90 transition-colors mb-2 md:mb-0">
          Art Explorer
        </Link>
        <nav className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3">
          {categories.map((category) => (
            <Button
              key={category.name}
              variant="ghost"
              size="sm"
              asChild
              className="text-muted-foreground hover:text-primary hover:bg-primary/10 px-2 py-1 md:px-3"
            >
              <Link href={`/?q=${encodeURIComponent(category.query)}#explore-collection`}>
                {category.name}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}
