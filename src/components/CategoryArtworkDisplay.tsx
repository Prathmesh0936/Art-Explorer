
// src/components/CategoryArtworkDisplay.tsx
import { fetchArtworks } from '@/lib/api';
import { ArtworkGrid } from '@/components/ArtworkGrid';
import type { Artwork } from '@/lib/types';
import { Card } from '@/components/ui/card';

interface CategoryArtworkDisplayProps {
  title: string;
  description?: string;
  query: string;
  itemCount?: number;
  className?: string;
}

export async function CategoryArtworkDisplay({ title, description, query, itemCount = 4, className }: CategoryArtworkDisplayProps) {
  const artworksData = await fetchArtworks(query, 1, itemCount);
  return (
    <section className={`py-12 md:py-16 ${className || ''}`}>
      <div className="container mx-auto px-4">
        <div className="mb-10 md:mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-3">{title}</h2>
          {description && <p className="text-md sm:text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>}
        </div>
        {artworksData.data.length > 0 ? (
          <ArtworkGrid artworks={artworksData.data} />
        ) : (
          <Card className="p-8 text-center text-muted-foreground">
            <p>No artworks found for "{query}" at the moment. Please try a different search or check back later.</p>
          </Card>
        )}
      </div>
    </section>
  );
}
