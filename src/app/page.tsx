
import { fetchArtworks } from '@/lib/api';
import { ArtworkGrid } from '@/components/ArtworkGrid';
import { FeaturedArtworkGrid } from '@/components/FeaturedArtworkGrid';
import { SearchBar } from '@/components/SearchBar';
import { FullPageLoading } from '@/components/LoadingSpinner';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import type { ArticApiResponse, Artwork } from '@/lib/types';
import { ArrowRight, Brush, Palette } from 'lucide-react';
import GlobalPageStyles from '@/components/GlobalPageStyles';

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

      {/* Hero Section */}
      <section className="relative h-[calc(100vh-80px)] min-h-[500px] md:min-h-[600px] flex items-center justify-center text-center text-primary-foreground p-4 overflow-hidden">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="Art museum interior"
          fill
          priority
          className="object-cover brightness-[0.4] z-0"
          data-ai-hint="museum interior art"
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            Discover Timeless Artistry
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-primary-foreground/80 mb-10 animate-fade-in-up animation-delay-300">
            Explore a curated collection of masterpieces from renowned artists and emerging talents.
          </p>
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 py-3 px-6 md:px-8 text-md md:text-lg rounded-md shadow-xl transition-transform hover:scale-105 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background animate-fade-in-up animation-delay-600"
            asChild
          >
            <Link href="/#explore-collection">
              Explore Gallery <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

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
      
      {/* Artist Spotlight Section */}
      <section className="py-16 md:py-24 bg-card text-card-foreground">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-12 lg:gap-16">
            <div className="md:w-1/2 w-full relative aspect-square md:aspect-[4/3] rounded-lg overflow-hidden shadow-2xl group">
              <Image
                src="https://placehold.co/800x600.png"
                alt="Artist Elena Petrova"
                fill
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-500 ease-in-out group-hover:scale-105"
                data-ai-hint="artist portrait painting"
              />
            </div>
            <div className="md:w-1/2 text-center md:text-left">
              <Brush className="text-primary h-10 w-10 md:h-12 md:w-12 mx-auto md:mx-0 mb-4" />
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
                Spotlight on: Elena Petrova
              </h3>
              <p className="text-md sm:text-lg text-muted-foreground mb-6 leading-relaxed">
                Elena Petrova, a contemporary visionary, masterfully blends classical techniques with modern abstraction. Her work explores themes of nature, emotion, and the passage of time, inviting viewers into a world of vibrant color and intricate detail.
              </p>
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary/10 hover:text-primary rounded-md shadow-md transition-all hover:shadow-lg hover:border-primary/80"
                asChild
              >
                <Link href="/?q=Elena%20Petrova#explore-collection">
                  Discover Her Work <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

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

      {/* Call to Action Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-primary/80 to-accent text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold mb-6">
            Ready to Explore?
          </h2>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Dive into a world of creativity and find pieces that speak to you. Our collection is constantly growing.
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 py-3 px-6 md:px-8 text-md md:text-lg rounded-md shadow-xl transition-transform hover:scale-105 focus:ring-2 focus:ring-primary-foreground focus:ring-offset-2 focus:ring-offset-primary"
          >
            <Link href="/#explore-collection">Start Your Journey</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
