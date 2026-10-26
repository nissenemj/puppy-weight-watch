import { forwardRef, useState, type ImgHTMLAttributes } from 'react';
import { usePuppyBookImage } from '@/hooks/usePuppyBookImage';

interface PrivatePuppyImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'alt'> {
  src?: string | null;
  alt: string;
  /** Explicit non-user placeholder, never the original public image URL. */
  fallbackSrc?: string;
}

export const PrivatePuppyImage = forwardRef<
  HTMLImageElement,
  PrivatePuppyImageProps
>(function PrivatePuppyImage(
  { src, alt, fallbackSrc, className, style, onError, ...props },
  ref,
) {
  const { signedUrl, isLoading } = usePuppyBookImage(src);
  const [failedSignedUrl, setFailedSignedUrl] = useState<string>();
  const [failedFallbackSrc, setFailedFallbackSrc] = useState<string>();
  const imageUrl =
    signedUrl && signedUrl !== failedSignedUrl
      ? signedUrl
      : fallbackSrc !== failedFallbackSrc
        ? fallbackSrc
        : undefined;

  if (!imageUrl) {
    return (
      <span
        role="img"
        aria-label={`${alt}: ${isLoading ? 'kuva latautuu' : 'kuva ei ole saatavilla'}`}
        title={isLoading ? 'Kuva latautuu' : 'Kuva ei ole saatavilla'}
        className={className}
        style={{ display: 'inline-block', ...style }}
      />
    );
  }
  return (
    <img
      {...props}
      ref={ref}
      src={imageUrl}
      alt={alt}
      className={className}
      style={style}
      referrerPolicy="no-referrer"
      onError={(event) => {
        if (imageUrl === signedUrl) setFailedSignedUrl(imageUrl);
        else setFailedFallbackSrc(imageUrl);
        onError?.(event);
      }}
    />
  );
});
