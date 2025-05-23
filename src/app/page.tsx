
import { fetchArtworks } from '@/lib/api';
import { ArtworkGrid } from '@/components/ArtworkGrid';
import { FeaturedArtworkGrid } from '@/components/FeaturedArtworkGrid';
import { SearchBar } from '@/components/SearchBar';
import { FullPageLoading } from '@/components/LoadingSpinner';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { ArticApiResponse, Artwork } from '@/lib/types';
import { Palette } from 'lucide-react';
import GlobalPageStyles from '@/components/GlobalPageStyles';
import CategorizedArtPreview from '@/components/CategorizedArtPreview';


interface HomeProps {
  searchParams?: {
    q?: string;
    page?: string;
  };
}

async function PaginatedArtworksSearch({ query, currentPage }: { query?: string; currentPage: number }) {
  const artworksData: ArticApiResponse<Artwork> = await fetchArtworks(query, currentPage);
  const totalPages = artworksData.pagination.total_pages;

  return (
    <>
      <ArtworkGrid artworks={artworksData.data} />
      {artworksData.data.length > 0 && totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center gap-4">
          {currentPage > 1 && (
            <Link href={`/?${new URLSearchParams({ ...(query ? { q: query } : {}), page: (currentPage - 1).toString() })}#explore-collection`} passHref>
              <Button variant="outline">Previous</Button>
            </Link>
          )}
          <span className="text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link href={`/?${new URLSearchParams({ ...(query ? { q: query } : {}), page: (currentPage + 1).toString() })}#explore-collection`} passHref>
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
    <div className="flex flex-col bg-background text-foreground">
      <GlobalPageStyles />

      {/* Featured Artworks Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <Palette className="text-primary h-10 w-10 md:h-12 md:w-12 mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">Featured Artworks</h2>
            <p className="text-md sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              A glimpse into the diverse and captivating pieces from our collection.
            </p>
          </div>
          <Suspense fallback={<FullPageLoading message="Loading featured art..." />}>
            <FeaturedArtworkGrid count={4} />
          </Suspense>
        </div>
      </section>
      
      {/* Browse Highlights by Category Section */}
      <Suspense fallback={<FullPageLoading message="Loading categories..." />}>
        <CategorizedArtPreview />
      </Suspense>
      
      {/* Explore Our Full Collection Section */}
      <section id="explore-collection" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">Explore Our Full Collection</h2>
            <p className="text-md sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Use the search below to find specific artworks or browse our extensive catalog.
            </p>
          </div>
          <div className="mb-10 md:mb-12 max-w-xl mx-auto">
             <SearchBar />
          </div>
          <Suspense key={query + currentPage.toString()} fallback={<FullPageLoading message="Fetching artworks..." />}>
            <PaginatedArtworksSearch query={query} currentPage={currentPage} />
          </Suspense>
        </div>
      </section>

    </div>
  );
}
