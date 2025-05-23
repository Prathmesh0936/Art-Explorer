
'use server';

import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { fetchArtworks, getImageUrl } from '@/lib/api';
import type { Artwork } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';

interface ArtworkListItemProps {
  artwork: Artwork;
}

function ArtworkListItem({ artwork }: ArtworkListItemProps) {
  const imageUrl = getImageUrl(artwork.image_id, 100); // Smaller image for circular preview

  return (
    <Link
      href={`/artwork/${artwork.id}`}
      className="flex items-center gap-4 p-3 hover:bg-card/80 rounded-lg transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden shadow-md flex-shrink-0 bg-muted">
        <Image
          src={imageUrl}
          alt={artwork.thumbnail?.alt_text || artwork.title || 'Artwork preview'}
          fill
          sizes="(max-width: 768px) 64px, 80px"
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          data-ai-hint="artwork small circular"
        />
      </div>
      <span className="text-base font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 break-words">
        {artwork.title || 'Untitled'}
      </span>
    </Link>
  );
}

function ArtworkListItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-3">
      <Skeleton className="w-16 h-16 md:w-20 md:h-20 rounded-full flex-shrink-0" />
      <div className="space-y-2 flex-grow">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
      </div>
    </div>
  );
}

interface CategorySectionProps {
  title: string;
  query: string;
  itemCount?: number;
}

async function CategorySection({ title, query, itemCount = 3 }: CategorySectionProps) {
  const artworksData = await fetchArtworks(query, 1, itemCount);

  return (
    <div className="bg-card p-6 rounded-lg shadow-lg flex flex-col">
      <h3 className="text-xl sm:text-2xl font-semibold text-primary mb-6 pb-3 border-b border-border">
        {title}
      </h3>
      {artworksData.data && artworksData.data.length > 0 ? (
        <div className="space-y-4 flex-grow">
          {artworksData.data.map((artwork) => (
            <ArtworkListItem key={artwork.id} artwork={artwork} />
          ))}
        </div>
      ) : (
        <div className="space-y-4 flex-grow">
          <ArtworkListItemSkeleton />
          <ArtworkListItemSkeleton />
          <ArtworkListItemSkeleton />
        </div>
      )}
      <div className="mt-auto pt-6">
        <Button variant="outline" size="sm" asChild className="w-full sm:w-auto hover:bg-primary/10 hover:text-primary">
          <Link href={`/?q=${encodeURIComponent(query)}#explore-collection`}>
            View All in {title}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

const CATEGORIES_TO_DISPLAY = [
  { id: 'paintings', title: 'Iconic Paintings', query: 'famous paintings OR oil on canvas', itemCount: 3 },
  { id: 'sculptures', title: 'Sculptural Forms', query: 'sculpture OR bronze OR marble', itemCount: 3 },
  { id: 'photography', title: 'Photographic Narratives', query: 'photography OR silver gelatin print', itemCount: 3 },
];

export default async function CategorizedArtPreview() {
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">
            Browse Highlights by Category
          </h2>
          <p className="text-md sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore curated selections from various artistic domains, each offering a unique glimpse into the world of art.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {CATEGORIES_TO_DISPLAY.map((category) => (
            <Suspense
              key={category.id}
              fallback={
                <div className="bg-card p-6 rounded-lg shadow-lg">
                  <Skeleton className="h-8 w-3/4 mb-6 pb-3" />
                  <ArtworkListItemSkeleton />
                  <ArtworkListItemSkeleton />
                  <ArtworkListItemSkeleton />
                  <Skeleton className="h-10 w-full sm:w-auto mt-6" />
                </div>
              }
            >
              <CategorySection title={category.title} query={category.query} itemCount={category.itemCount} />
            </Suspense>
          ))}
        </div>
      </div>
    </section>
  );
}
