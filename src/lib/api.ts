import type { ArticApiResponse, Artwork, ArtworkDetail } from '@/lib/types';

const API_BASE_URL = 'https://api.artic.edu/api/v1';
const IIIF_BASE_URL = 'https://www.artic.edu/iiif/2';

const DEFAULT_FIELDS: (keyof Artwork)[] = ['id', 'title', 'artist_display', 'image_id', 'thumbnail', 'short_description'];
const DETAIL_FIELDS: (keyof ArtworkDetail)[] = [
  ...DEFAULT_FIELDS,
  'description', 
  'date_display', 
  'dimensions', 
  'medium_display', 
  'credit_line', 
  'place_of_origin',
  'provenance_text',
  'term_titles',
  'artist_title',
  'category_titles',
  'exhibition_history',
  'publication_history',
];

export async function fetchArtworks(
  query?: string,
  page: number = 1,
  limit: number = 24
): Promise<ArticApiResponse<Artwork>> {
  const fields = DEFAULT_FIELDS.join(',');
  let url: string;

  if (query) {
    url = `${API_BASE_URL}/artworks/search?q=${encodeURIComponent(query)}&fields=${fields}&page=${page}&limit=${limit}`;
  } else {
    url = `${API_BASE_URL}/artworks?fields=${fields}&page=${page}&limit=${limit}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error('API Error Response:', await response.text());
      throw new Error(`Failed to fetch artworks: ${response.statusText}`);
    }
    const data = await response.json();
    return data as ArticApiResponse<Artwork>;
  } catch (error) {
    console.error('Fetch Artworks Error:', error);
    // Return a default structure in case of error to prevent crashes
    return {
      pagination: { total: 0, limit, offset: (page - 1) * limit, total_pages: 0, current_page: page },
      data: [],
    };
  }
}

export async function fetchArtworkById(id: number | string): Promise<ArtworkDetail | null> {
  const fields = DETAIL_FIELDS.join(',');
  const url = `${API_BASE_URL}/artworks/${id}?fields=${fields}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) return null;
      console.error('API Error Response:', await response.text());
      throw new Error(`Failed to fetch artwork ${id}: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data as ArtworkDetail;
  } catch (error) {
    console.error(`Fetch Artwork by ID (${id}) Error:`, error);
    return null;
  }
}

export function getImageUrl(imageId: string | null | undefined, width: number = 843): string {
  if (!imageId) {
    return `https://placehold.co/${width}x${Math.round(width * 0.75)}.png`;
  }
  return `${IIIF_BASE_URL}/${imageId}/full/${width},/0/default.jpg`;
}

// Helper to get a textual description for the AI summarizer
export function getBestDescriptionForAI(artwork: ArtworkDetail): string {
  if (artwork.short_description && artwork.short_description.trim() !== "") {
    return artwork.short_description;
  }
  if (artwork.provenance_text && artwork.provenance_text.trim() !== "") {
    return artwork.provenance_text;
  }
  if (artwork.description) { // This is HTML, attempt basic stripping
    const text = artwork.description.replace(/<[^>]+>/g, ' ').replace(/\s\s+/g, ' ').trim();
    if (text.length > 50) return text.substring(0, 1000); // Limit length
  }
  if (artwork.term_titles && artwork.term_titles.length > 0) {
    return `This artwork is associated with terms: ${artwork.term_titles.join(', ')}.`;
  }
  return "No detailed textual description available for this artwork.";
}
