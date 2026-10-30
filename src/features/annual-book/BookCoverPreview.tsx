import { PrivatePuppyImage } from "@/components/PuppyBook/PrivatePuppyImage";
import journalIllustration from "@/assets/puppy-journal-lake.webp";
import { formatDay, day, type BookDesign } from "./model";

interface BookCoverPreviewProps {
  design: BookDesign;
  puppyName: string;
  start: string;
  end: string;
  photo?: string;
}

export function BookCoverPreview({
  design,
  puppyName,
  start,
  end,
  photo,
}: BookCoverPreviewProps) {
  const showPhoto = design.coverArt === "photo" && Boolean(photo);
  return (
    <figure className="annual-live-cover">
      <div className={`annual-cover-swatch annual-palette-${design.palette}`}>
        <p className="annual-cover-eyebrow">
          {puppyName.trim() || "Oma pentukirja"}
        </p>
        <p className="annual-cover-title">
          {design.title.trim() || "Pennun ensimmäinen vuosi"}
        </p>
        <p className="annual-cover-tagline">
          Kuvia, kasvua ja yhteisiä kommelluksia.
        </p>
        <div
          className={showPhoto ? "annual-cover-photo" : "annual-cover-drawing"}
        >
          {showPhoto ? (
            <PrivatePuppyImage
              src={photo}
              alt="Kanteen valittu oma kuva"
              width={1000}
              height={1000}
            />
          ) : (
            <img src={journalIllustration} width={1000} height={1000} alt="" />
          )}
        </div>
        {day.safeParse(start).success && day.safeParse(end).success && (
          <p className="annual-cover-period">
            {formatDay(start)}–{formatDay(end)}
          </p>
        )}
      </div>
      <figcaption>
        Kannen luonnos. Lopullinen taitto näkyy kootussa kirjassa.
      </figcaption>
    </figure>
  );
}
