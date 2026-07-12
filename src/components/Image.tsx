import { useState } from 'react';
import { cn } from './ui/utils';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

export function Image({ src, alt, className, fallbackClassName, ...props }: ImageProps) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setIsError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (isError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gray-100 text-gray-400',
          fallbackClassName,
          className
        )}
      >
        <svg
          width="88"
          height="88"
          xmlns="http://www.w3.org/2000/svg"
          stroke="currentColor"
          strokeLinejoin="round"
          fill="none"
          strokeWidth="3.7"
          opacity="0.3"
        >
          <rect x="16" y="16" width="56" height="56" rx="6" />
          <path d="m16 58 16-18 32 32" />
          <circle cx="53" cy="35" r="7" />
        </svg>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div
          className={cn(
            'absolute inset-0 animate-pulse bg-gray-200',
            className
          )}
        />
      )}
      <img
        src={src}
        alt={alt}
        className={cn(className, isLoading && 'opacity-0')}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </>
  );
}
