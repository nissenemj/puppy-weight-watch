import { Bone, Moon, PawPrint } from "lucide-react";
import {
  formatDay,
  getGuidedPhotos,
  type GuidedBookPage as Page,
} from "./model";
import {
  guidedPageTemplates,
  mishapItemLabels,
  sleepPoseLabels,
  toyUseLabels,
} from "./guidedPages";

/** Shared by the fill-in preview and the assembled book. */
export function GuidedBookPage({
  page,
  placeholders = false,
  photoIndex,
  section,
}: {
  page: Page;
  placeholders?: boolean;
  photoIndex?: number;
  section?: "details" | "photo";
}) {
  const template = guidedPageTemplates[page.templateId];
  const photos = getGuidedPhotos(page);
  const visiblePhotos =
    section === "details"
      ? []
      : photoIndex === undefined
        ? photos
        : photos.slice(photoIndex, photoIndex + 1);
  const showDetails =
    section !== "photo" && (photoIndex === undefined || photoIndex === 0);
  const details = page.details;
  const selections =
    details?.kind === "sleep"
      ? details.poses.map((value) => sleepPoseLabels[value])
      : details?.kind === "toy"
        ? details.uses.map((value) => toyUseLabels[value])
        : details?.kind === "mishap"
          ? details.items.map((value) =>
              value === "other" && details.other.trim()
                ? details.other.trim()
                : mishapItemLabels[value],
            )
          : [];
  const isMishap = details?.kind === "mishap";
  const questions = isMishap
    ? ["Havainto", "Pennun kuviteltu puolustuspuhe"]
    : template.questions;
  return (
    <div
      className={`annual-guided-content annual-guided-${page.templateId}${showDetails ? "" : " annual-guided-continuation"}`}
    >
      {details?.kind === "toy" && (
        <p className="annual-guided-edition">
          <Bone size={19} aria-hidden="true" /> Suosikkien kokoelma · Lelupassi
        </p>
      )}
      {isMishap && (
        <p className="annual-guided-edition">Arjen pienet kommellukset</p>
      )}
      {visiblePhotos.length ? (
        visiblePhotos.map((photo, index) => (
          <figure key={photo.id} className="annual-guided-photo">
            <img
              src={photo.image}
              width={1400}
              height={1000}
              alt={
                photo.description ||
                `Oma kuva sivulla ${template.title}${page.templateId === "sleep" ? `, unikuva ${(photoIndex ?? 0) + index + 1}` : ""}`
              }
              decoding="async"
            />
            {page.templateId === "sleep" && (
              <figcaption>
                <span>
                  Unikuva {(photoIndex ?? 0) + index + 1} / {photos.length}
                </span>
                {photo.name && <strong>{photo.name}</strong>}
              </figcaption>
            )}
          </figure>
        ))
      ) : placeholders ? (
        <div className="annual-guided-placeholder" aria-label="Kuvan paikka">
          {page.templateId === "sleep" ? (
            <Moon size={48} strokeWidth={1} aria-hidden="true" />
          ) : page.templateId === "toy" ? (
            <Bone size={48} strokeWidth={1} aria-hidden="true" />
          ) : (
            <PawPrint size={48} strokeWidth={1} aria-hidden="true" />
          )}
          <p>Tähän tulee oma kuvasi.</p>
          <small>Voit täyttää sivun myös ilman kuvaa.</small>
        </div>
      ) : null}
      {showDetails && page.date && (
        <p className="annual-guided-date">{formatDay(page.date)}</p>
      )}
      {showDetails && selections.length > 0 && (
        <div className="annual-guided-selections">
          <p>
            {details?.kind === "sleep"
              ? "Omat unityylini"
              : details?.kind === "toy"
                ? "Lelun tärkeimmät tehtävät"
                : "Tilanteeseen liittyvät esineet"}
          </p>
          <ul>
            {selections.map((label, index) => (
              <li key={index}>{label}</li>
            ))}
          </ul>
        </div>
      )}
      {showDetails && (
        <>
          <dl className="annual-guided-answers">
            {(["first", "second"] as const).map((key, index) =>
              page[key].trim() || placeholders ? (
                <div
                  key={key}
                  className={
                    isMishap && key === "second"
                      ? "annual-guided-imagined"
                      : undefined
                  }
                >
                  <dt>
                    {questions[index]}
                    {isMishap && key === "second" && (
                      <span>Leikillinen, itse keksitty selitys</span>
                    )}
                  </dt>
                  <dd
                    className={
                      page[key].trim() ? undefined : "annual-guided-empty"
                    }
                  >
                    {page[key].trim() || "Vastauksesi ilmestyy tähän."}
                  </dd>
                </div>
              ) : null,
            )}
          </dl>
        </>
      )}
    </div>
  );
}
