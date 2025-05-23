
export interface ArtworkThumbnail {
  lqip: string; // Low-quality image placeholder (base64)
  width: number;
  height: number;
  alt_text: string | null;
}

export interface Artwork {
  id: number;
  title: string;
  artist_display: string | null;
  image_id: string | null;
  thumbnail: ArtworkThumbnail | null;
  short_description?: string | null; 
}

export interface ArtworkDetail extends Artwork {
  description: string | null; // Can be HTML
  date_display: string | null;
  dimensions: string | null;
  medium_display: string | null;
  credit_line: string | null;
  place_of_origin?: string | null;
  provenance_text?: string | null;
  exhibition_history?: string | null;
  publication_history?: string | null;
  term_titles?: string[];
  artist_title?: string | null; // Sometimes `artist_display` is more complete with dates
  category_titles?: string[];
}

export interface ArticApiResponse<T> {
  pagination: {
    total: number;
    limit: number;
    offset: number;
    total_pages: number;
    current_page: number;
    next_url?: string;
  };
  data: T[];
  info?: {
    license_text: string;
    license_links: string[];
    version: string;
  };
  config?: {
    iiif_url: string;
    website_url: string;
  };
}
