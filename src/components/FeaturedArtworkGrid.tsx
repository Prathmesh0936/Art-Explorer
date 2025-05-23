
import { fetchArtworks } from '@/lib/api';
import type { Artwork, ArticApiResponse } from '@/lib/types';
import { ArtworkCard } from './ArtworkCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

interface FeaturedArtworkGridProps {
  count?: number;
}

export async function FeaturedArtworkGrid({ count = 4 }: FeaturedArtworkGridProps) {
  const artworksData: ArticApiResponse<Artwork> = await fetchArtworks(undefined, 1, count);

  if (!artworksData.data || artworksData.data.length === 0) {
    return (
      <Alert variant="default" className="my-8">
        <Terminal className="h-4 w-4" />
        <AlertTitle>No Featured Artworks</AlertTitle>
        <AlertDescription>
          We couldn't find any featured artworks at the moment. Please check back later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
      {artworksData.data.map((artwork) => (
        <ArtworkCard key={artwork.id} artwork={artwork} />
      ))}
    </div>
  );
}
