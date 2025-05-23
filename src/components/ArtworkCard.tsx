
import Link from 'next/link';
import Image from 'next/image';
import type { Artwork } from '@/lib/types';
import { getImageUrl } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageOff } from 'lucide-react';

interface ArtworkCardProps {
  artwork: Artwork;
}

export function ArtworkCard({ artwork }: ArtworkCardProps) {
  const imageUrl = getImageUrl(artwork.image_id, 400);
  const placeholderText = artwork.thumbnail?.alt_text || artwork.title || "Artwork image";

  return (
    <Link href={`/artwork/${artwork.id}`} passHref legacyBehavior>
      <a className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg">
        <Card className="h-full flex flex-col overflow-hidden shadow-md hover:shadow-xl focus-within:shadow-xl transition-all duration-300 ease-in-out border-border hover:border-primary/30 bg-card rounded-lg">
          <CardHeader className="p-0 relative aspect-[4/3] overflow-hidden rounded-t-lg">
            {artwork.image_id ? (
              <Image
                src={imageUrl}
                alt={placeholderText}
                layout="fill"
                objectFit="cover"
                className="group-hover:scale-105 transition-transform duration-300 ease-in-out"
                placeholder={artwork.thumbnail?.lqip ? 'blur' : 'empty'}
                blurDataURL={artwork.thumbnail?.lqip}
                data-ai-hint="artwork painting"
              />
            ) : (
              <div className="w-full h-full bg-secondary flex items-center justify-center rounded-t-lg" data-ai-hint="placeholder default">
                <ImageOff className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="text-base font-semibold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {artwork.title || 'Untitled'}
            </CardTitle>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
}
