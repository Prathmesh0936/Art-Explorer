'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { type FormEvent, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    // Update local state if query param changes from outside (e.g. browser back/forward)
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set('q', query.trim());
    } else {
      params.delete('q');
    }
    router.push(`/?${params.toString()}`);
  };
  
  const clearSearch = () => {
    setQuery('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    router.push(`/?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2 mb-8">
      <div className="relative flex-grow">
        <Input
          type="text"
          placeholder="Search artworks by title or artist..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-10"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={clearSearch}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button type="submit" variant="default">
        <Search className="mr-2 h-4 w-4" />
        Search
      </Button>
    </form>
  );
}
