import Link from 'next/link';
import Image from 'next/image';
import type { Artwork } from '@/lib/types';
import { getImageUrl } from '@/lib/api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageOff } from 'lucide-react';

interface ArtworkCardProps {
  artwork: Artwork;
}

export function ArtworkCard({ artwork }: ArtworkCardProps) {
  const imageUrl = getImageUrl(artwork.image_id, 400);
  const placeholderText = artwork.thumbnail?.alt_text || artwork.title;

  return (
    <Link href={`/artwork/${artwork.id}`} passHref>
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 ease-in-out group">
        <CardHeader className="p-0 relative aspect-[3/2] overflow-hidden">
          {artwork.image_id ? (
            <Image
              src={imageUrl}
              alt={placeholderText}
              width={400}
              height={300}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 ease-in-out"
              placeholder={artwork.thumbnail?.lqip ? 'blur' : 'empty'}
              blurDataURL={artwork.thumbnail?.lqip}
              data-ai-hint="artwork painting"
            />
          ) : (
            <div className="w-full h-full bg-secondary flex items-center justify-center" data-ai-hint="placeholder image">
              <ImageOff className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-semibold leading-tight mb-1 group-hover:text-primary transition-colors">
            {artwork.title || 'Untitled'}
          </CardTitle>
          <p className="text-sm text-muted-foreground truncate">
            {artwork.artist_display || 'Unknown Artist'}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
           <p className="text-xs text-accent group-hover:underline">View Details</p>
        </CardFooter>
      </Card>
    </Link>
  );
}
