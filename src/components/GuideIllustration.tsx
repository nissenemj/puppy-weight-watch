import { useRef, useState } from "react";
import { ImageOff, RotateCcw } from "lucide-react";
import { guideArtwork, type GuideArtworkKey } from "@/data/guideArtwork";
import "@/styles/guide-illustrations.css";

interface GuideIllustrationProps {
  artwork: GuideArtworkKey;
  priority?: boolean;
  decorative?: boolean;
  caption?: boolean;
  sizes?: string;
}

export function GuideIllustration({
  artwork,
  priority = false,
  decorative = false,
  caption = true,
  sizes = "(min-width: 1280px) 560px, (min-width: 768px) 46vw, calc(100vw - 48px)",
}: GuideIllustrationProps) {
  const art = guideArtwork[artwork];
  const [webpOnly, setWebpOnly] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const figure = useRef<HTMLElement>(null);
  const retryButton = useRef<HTMLButtonElement>(null);
  const source = (url: string) => (attempt ? `${url}?retry=${attempt}` : url);
  const srcSet = (format: "avif" | "webp") =>
    art.sources[format]
      .map(({ url, width }) => `${source(url)} ${width}w`)
      .join(", ");

  function handleLoad() {
    if (failed && document.activeElement === retryButton.current) {
      figure.current?.focus();
    }
    setFailed(false);
  }

  return (
    <figure
      className="guide-illustration"
      data-artwork={artwork}
      ref={figure}
      tabIndex={-1}
      aria-label={!decorative && (failed || attempt > 0) ? art.alt : undefined}
    >
      <div className="guide-illustration-frame">
        <picture key={`${webpOnly}-${attempt}`} hidden={failed}>
          {!webpOnly && (
            <source type="image/avif" srcSet={srcSet("avif")} sizes={sizes} />
          )}
          <img
            src={source(art.src)}
            srcSet={srcSet("webp")}
            sizes={sizes}
            width={1200}
            height={800}
            alt={decorative ? "" : art.alt}
            loading={priority || attempt > 0 ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
            onLoad={handleLoad}
            onError={() => {
              if (!webpOnly) setWebpOnly(true);
              else setFailed(true);
            }}
          />
        </picture>
        {failed && (
          <div className="guide-illustration-error">
            <ImageOff size={28} strokeWidth={1.5} aria-hidden="true" />
            <p>Kuvitus ei latautunut. Voit silti lukea oppaan.</p>
            <button
              ref={retryButton}
              type="button"
              onClick={() => setAttempt((value) => value + 1)}
            >
              <RotateCcw size={16} aria-hidden="true" />
              Lataa kuvitus uudelleen
            </button>
          </div>
        )}
      </div>
      <span role="status" className="sr-only">
        {failed
          ? "Oppaan kuvitusta ei voitu ladata."
          : attempt > 0
            ? "Kuvitus ladattu."
            : ""}
      </span>
      {caption && <figcaption>{art.caption}</figcaption>}
    </figure>
  );
}

interface IllustratedGuideIntroProps {
  title: string;
  description: string;
  artwork: GuideArtworkKey;
}

export function IllustratedGuideIntro({
  title,
  description,
  artwork,
}: IllustratedGuideIntroProps) {
  return (
    <section className="guide-illustration-intro" aria-label="Oppaan esittely">
      <div className="guide-intro-copy">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <GuideIllustration key={artwork} artwork={artwork} priority />
    </section>
  );
}
