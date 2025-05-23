import { fetchArtworkById, getImageUrl, getBestDescriptionForAI } from '@/lib/api';
import { summarizeArtwork } from '@/ai/flows/artwork-summarizer';
import type { ArtworkDetail } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Info, Sparkles, Feather, FileText, Brain, Archive } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface ArtworkPageProps {
  params: {
    id: string;
  };
}

async function ArtworkSummary({ artwork }: { artwork: ArtworkDetail }) {
  if (!artwork.title || !artwork.artist_display) {
    return (
       <Card className="mt-6 bg-secondary/30 border-border shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold"><Feather className="text-primary w-5 h-5" /> AI-Powered Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Summary cannot be generated due to missing title or artist information.</p>
        </CardContent>
      </Card>
    );
  }
  const descriptionForAI = getBestDescriptionForAI(artwork);
  try {
    const summaryResult = await summarizeArtwork({
      title: artwork.title,
      artist: artwork.artist_display,
      description: descriptionForAI,
    });

    return (
      <Card className="mt-0 shadow-none border-0 bg-transparent">
        {/* <CardHeader className="p-0 pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-primary">
            <Feather className="w-5 h-5" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader> */}
        <CardContent className="p-0">
          <p className="text-foreground/90 leading-relaxed">{summaryResult.summary}</p>
        </CardContent>
      </Card>
    );
  } catch (error) {
    console.error("Failed to generate artwork summary:", error);
    return (
      <Card className="mt-0 bg-destructive/10 shadow-none border-0">
        {/* <CardHeader className="p-0 pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold"><Sparkles className="text-destructive w-5 h-5" /> AI Insights Error</CardTitle>
        </CardHeader> */}
        <CardContent className="p-0">
          <p className="text-destructive-foreground">Could not generate AI insights at this time. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }
}

function DetailItem({ label, value }: { label: string; value: string | null | undefined | string[] }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  const displayValue = Array.isArray(value) ? value.join(', ') : value;
  return (
    <div className="mb-3">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</h3>
      <p className="text-foreground/90 text-sm">{displayValue}</p>
    </div>
  );
}

export default async function ArtworkPage({ params }: ArtworkPageProps) {
  const artworkId = parseInt(params.id, 10);
  if (isNaN(artworkId)) {
    notFound();
  }

  const artwork = await fetchArtworkById(artworkId);

  if (!artwork) {
    notFound();
  }

  const imageUrl = getImageUrl(artwork.image_id, 800);
  const placeholderText = artwork.thumbnail?.alt_text || artwork.title || "Artwork image";

  return (
    <div className="container mx-auto max-w-7xl p-4 md:p-8">
      <Link href="/" passHref className="mb-6 inline-flex">
        <Button variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Gallery
        </Button>
      </Link>

      <div className="grid md:grid-cols-5 gap-8 lg:gap-12">
        {/* Left Column: Image */}
        <div className="md:col-span-3">
          <Card className="overflow-hidden shadow-xl aspect-w-4 aspect-h-3 md:aspect-h-auto md:sticky md:top-24">
             <Image
                src={imageUrl}
                alt={placeholderText}
                width={800}
                height={600} // Adjust height as needed, or use aspect ratio
                className="object-contain w-full h-full bg-muted rounded-lg"
                placeholder={artwork.thumbnail?.lqip ? 'blur' : 'empty'}
                blurDataURL={artwork.thumbnail?.lqip}
                data-ai-hint="artwork large painting"
                priority
              />
          </Card>
        </div>

        {/* Right Column: Details & Tabs */}
        <div className="md:col-span-2">
          <div className="mb-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-primary leading-tight">
              {artwork.title || 'Untitled'}
            </h1>
            <p className="text-lg text-muted-foreground mt-1">
              {artwork.artist_title || artwork.artist_display || 'Unknown Artist'}
            </p>
          </div>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto mb-4">
              <TabsTrigger value="details" className="py-2.5"><Info className="mr-2 h-4 w-4 sm:hidden md:inline-block" />Details</TabsTrigger>
              <TabsTrigger value="description" className="py-2.5"><FileText className="mr-2 h-4 w-4 sm:hidden md:inline-block" />Description</TabsTrigger>
              <TabsTrigger value="ai-insights" className="py-2.5"><Brain className="mr-2 h-4 w-4 sm:hidden md:inline-block" />AI Insights</TabsTrigger>
              <TabsTrigger value="additional" className="py-2.5"><Archive className="mr-2 h-4 w-4 sm:hidden md:inline-block" />Additional</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-0">
              <Card className="border-0 shadow-none bg-transparent md:border md:shadow-sm md:bg-card">
                <CardContent className="pt-6 space-y-3">
                  <DetailItem label="Date" value={artwork.date_display} />
                  <DetailItem label="Medium" value={artwork.medium_display} />
                  <DetailItem label="Dimensions" value={artwork.dimensions} />
                  <DetailItem label="Origin" value={artwork.place_of_origin} />
                  <DetailItem label="Credit Line" value={artwork.credit_line} />
                  
                  {artwork.category_titles && artwork.category_titles.length > 0 && (
                    <div>
                      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Categories</h3>
                      <div className="flex flex-wrap gap-2">
                        {artwork.category_titles.map((cat, index) => <Badge key={`${cat}-${index}`} variant="secondary">{cat}</Badge>)}
                      </div>
                    </div>
                  )}

                  {artwork.term_titles && artwork.term_titles.length > 0 && (
                     <div className="mt-3">
                      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                        {artwork.term_titles.map((term, index) => <Badge key={`${term}-${index}`} variant="outline">{term}</Badge>)}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="description" className="mt-0">
               <Card className="border-0 shadow-none bg-transparent md:border md:shadow-sm md:bg-card">
                <CardContent className="pt-6">
                  {artwork.description ? (
                    <div 
                      className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 leading-relaxed" 
                      dangerouslySetInnerHTML={{ __html: artwork.description }} 
                    />
                  ) : (
                    <p className="text-muted-foreground">No description provided for this artwork.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ai-insights" className="mt-0">
              <Card className="border-0 shadow-none bg-transparent md:border md:shadow-sm md:bg-card">
                <CardHeader>
                   <CardTitle className="flex items-center gap-2 text-lg font-semibold text-primary">
                      <Feather className="w-5 h-5" />
                      AI-Powered Insights
                    </CardTitle>
                    <CardDescription>A concise summary generated by our Art AI.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={
                      <div className="flex items-center gap-2 text-muted-foreground py-4">
                        <LoadingSpinner size={20}/> AI is thinking...
                      </div>
                  }>
                    <ArtworkSummary artwork={artwork} />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="additional" className="mt-0">
              <Card className="border-0 shadow-none bg-transparent md:border md:shadow-sm md:bg-card">
                <CardContent className="pt-6 space-y-4">
                    {artwork.provenance_text && (
                        <div>
                            <h3 className="font-semibold text-md mb-1 text-foreground">Provenance</h3>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{artwork.provenance_text}</p>
                        </div>
                    )}
                    {artwork.exhibition_history && (
                        <>
                          {artwork.provenance_text && <Separator className="my-4" />}
                          <div>
                              <h3 className="font-semibold text-md mb-1 text-foreground">Exhibition History</h3>
                              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{artwork.exhibition_history}</p>
                          </div>
                        </>
                    )}
                     {artwork.publication_history && (
                        <>
                          {(artwork.provenance_text || artwork.exhibition_history) && <Separator className="my-4" />}
                          <div>
                              <h3 className="font-semibold text-md mb-1 text-foreground">Publication History</h3>
                              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{artwork.publication_history}</p>
                          </div>
                        </>
                    )}
                    {!artwork.provenance_text && !artwork.exhibition_history && !artwork.publication_history && (
                        <p className="text-muted-foreground">No additional information available for this artwork.</p>
                    )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: ArtworkPageProps) {
  const artworkId = parseInt(params.id, 10);
  if (isNaN(artworkId)) return { title: "Artwork Not Found" };
  
  const artwork = await fetchArtworkById(artworkId);
  if (!artwork) {
    return {
      title: 'Artwork Not Found | Art Explorer',
    };
  }
  return {
    title: `${artwork.title || 'Untitled'} by ${artwork.artist_display || 'Unknown Artist'} | Art Explorer`,
    description: artwork.short_description || `Details for artwork: ${artwork.title}`,
  };
}
