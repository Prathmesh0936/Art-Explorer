import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
}

export function LoadingSpinner({ className, size = 24 }: LoadingSpinnerProps) {
  return (
    <Loader2
      className={cn('animate-spin text-primary', className)}
      style={{ width: size, height: size }}
      aria-label="Loading content"
    />
  );
}

export function FullPageLoading({ message = "Loading..."}: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
      <LoadingSpinner size={48} />
      <p className="mt-4 text-lg text-muted-foreground">{message}</p>
    </div>
  );
}
