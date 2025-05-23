import type { Artwork } from '@/lib/types';
import { ArtworkCard } from './ArtworkCard';

interface ArtworkGridProps {
  artworks: Artwork[];
}

export function ArtworkGrid({ artworks }: ArtworkGridProps) {
  if (!artworks || artworks.length === 0) {
    return <p className="text-center text-muted-foreground py-10">No artworks found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {artworks.map((artwork) => (
        <ArtworkCard key={artwork.id} artwork={artwork} />
      ))}
    </div>
  );
}
