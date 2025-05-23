'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-4">
      <h2 className="text-2xl font-semibold text-destructive mb-4">Oops! Something went wrong.</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        {error.message || "An unexpected error occurred. Please try again, or refresh the page."}
      </p>
      <div className="flex gap-4">
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
          variant="destructive"
        >
          Try again
        </Button>
        <Button variant="outline" onClick={() => window.location.href = '/'}>
          Go to Homepage
        </Button>
      </div>
    </div>
  );
}
