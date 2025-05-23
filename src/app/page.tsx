import { fetchArtworks } from '@/lib/api';
import { ArtworkGrid } from '@/components/ArtworkGrid';
import { SearchBar } from '@/components/SearchBar';
import { FullPageLoading } from '@/components/LoadingSpinner'; // For suspense fallback
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { ArticApiResponse, Artwork } from '@/lib/types';

interface HomeProps {
  searchParams?: {
    q?: string;
    page?: string;
  };
}

async function ArtworksDisplay({ query, currentPage }: { query?: string; currentPage: number }) {
  const artworksData: ArticApiResponse<Artwork> = await fetchArtworks(query, currentPage);
  
  consttotalPages = artworksData.pagination.total_pages;

  return (
    <>
      <ArtworkGrid artworks={artworksData.data} />
      {artworksData.data.length > 0 && totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center gap-4">
          {currentPage > 1 && (
            <Link href={`/?${new URLSearchParams({ ...(query ? { q: query } : {}), page: (currentPage - 1).toString() })}`} passHref>
              <Button variant="outline">Previous</Button>
            </Link>
          )}
          <span className="text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link href={`/?${new URLSearchParams({ ...(query ? { q: query } : {}), page: (currentPage + 1).toString() })}`} passHref>
              <Button variant="outline">Next</Button>
            </Link>
          )}
        </div>
      )}
    </>
  );
}


export default async function HomePage({ searchParams }: HomeProps) {
  const query = searchParams?.q;
  const currentPage = parseInt(searchParams?.page || '1', 10);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-center sm:text-4xl md:text-5xl">
        Explore the Collection
      </h1>
      <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto">
        Discover a curated selection of masterpieces from the Art Institute of Chicago. Search by title or artist to find your favorites.
      </p>
      
      <SearchBar />

      <Suspense key={query + currentPage} fallback={<FullPageLoading message="Fetching artworks..." />}>
        <ArtworksDisplay query={query} currentPage={currentPage} />
      </Suspense>
    </div>
  );
}
