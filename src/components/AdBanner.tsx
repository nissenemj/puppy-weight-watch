import React, { useState } from "react";

interface AdBannerProps {
  variant: "rectangle" | "skyscraper";
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ variant, className = "" }) => {
  const [imageFailed, setImageFailed] = useState(false);

  if (variant === "rectangle") {
    // 300x250px
    return (
      <div
        data-ad-banner
        role="group"
        aria-label="Mainos"
        className={`flex flex-col justify-center items-center p-4 bg-stone-50 rounded-xl ${className}`}
      >
        <span className="mb-2 text-sm text-muted-foreground">Mainos</span>
        <a
          href="https://in.muotitassu.fi/t/t?a=1962036211&as=2037227635&t=2&tk=1"
          target="_blank"
          rel="noopener noreferrer"
        >
          {imageFailed ? (
            <span
              className="flex max-w-full flex-col items-center justify-center gap-3 border border-border p-4 text-center text-sm text-foreground"
              style={{ width: 300, minHeight: 250 }}
            >
              <strong>Muotitassu</strong>
              <span className="underline underline-offset-4">
                Tutustu koiratarvikkeisiin
              </span>
            </span>
          ) : (
            <img
              src="https://track.adtraction.com/t/t?a=1962036211&as=2037227635&t=1&tk=1&i=1"
              width="300"
              height="250"
              alt="Muotitassu - Laadukkaat koiratarvikkeet"
              data-external-ad
              loading="lazy"
              decoding="async"
              onError={() => setImageFailed(true)}
              className="rounded-lg shadow-sm hover:shadow-md transition-shadow"
              style={{ border: 0 }}
            />
          )}
        </a>
      </div>
    );
  }

  if (variant === "skyscraper") {
    // 120x600px
    return (
      <div
        data-ad-banner
        role="group"
        aria-label="Mainos"
        className={`hidden lg:flex flex-col justify-center items-center p-4 ${className}`}
      >
        <a
          href="https://in.muotitassu.fi/t/t?a=1962036177&as=2037227635&t=2&tk=1"
          target="_blank"
          rel="noopener noreferrer"
        >
          {imageFailed ? (
            <span
              className="flex max-w-full flex-col items-center justify-center gap-3 border border-border p-3 text-center text-sm text-foreground"
              style={{ width: 120, minHeight: 600 }}
            >
              <strong>Muotitassu</strong>
              <span className="underline underline-offset-4">
                Tutustu koiratarvikkeisiin
              </span>
            </span>
          ) : (
            <img
              src="https://track.adtraction.com/t/t?a=1962036177&as=2037227635&t=1&tk=1&i=1"
              width="120"
              height="600"
              alt="Muotitassu: koiratarvikkeita"
              data-external-ad
              loading="lazy"
              decoding="async"
              onError={() => setImageFailed(true)}
              className="rounded-lg shadow-sm hover:shadow-md transition-shadow"
              style={{ border: 0 }}
            />
          )}
        </a>
      </div>
    );
  }

  return null;
};

export default AdBanner;
