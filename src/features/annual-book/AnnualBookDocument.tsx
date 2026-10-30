import React from "react";
import {
  buildBookPages,
  DEFAULT_BOOK_DESIGN,
  formatDay,
  type AnnualBook,
} from "./model";
import { documentStyles } from "./documentStyles";
import { BookGrowthChart, BookWeightTable } from "./BookGrowthChart";
import journalIllustration from "@/assets/puppy-journal-lake.webp";
import letterIllustration from "@/assets/puppy-journal-letter.webp";
import mishapIllustration from "@/assets/puppy-journal-sock.webp";

export function AnnualBookDocument({
  book,
  pageIndex,
  standalone = false,
}: {
  book: AnnualBook;
  pageIndex?: number;
  standalone?: boolean;
}) {
  const allPages = buildBookPages(book);
  const design = book.design ?? DEFAULT_BOOK_DESIGN;
  const pages =
    pageIndex === undefined
      ? allPages
      : allPages.slice(pageIndex, pageIndex + 1);
  return (
    <div
      className={`annual-document annual-palette-${design.palette}`}
      lang="fi"
    >
      <style>{documentStyles}</style>
      {pages.map((page, offset) => {
        const index = pageIndex ?? offset;
        const Heading = standalone && page.kind === "cover" ? "h1" : "h2";
        return (
          <article
            key={page.key}
            className={`annual-sheet annual-page-${page.kind}`}
            aria-label={`${page.title}, sivu ${index + 1}`}
          >
            <header className="annual-page-header">
              <p className="annual-kicker">
                {book.puppyName} · {formatDay(book.start)}–{formatDay(book.end)}
              </p>
              <Heading>{page.title}</Heading>
            </header>
            {page.kind === "cover" && (
              <>
                {!design.title.trim() && (
                  <p className="annual-name">{book.puppyName}</p>
                )}
                <p className="annual-cover-subtitle">
                  Kuvia, kasvua ja yhteisiä kommelluksia.
                </p>
              </>
            )}
            <div
              className={
                page.kind === "comparison" ? "annual-comparison" : undefined
              }
            >
              {page.entries
                .filter(
                  () => page.kind !== "cover" || design.coverArt === "photo",
                )
                .map((entry, photoIndex) => (
                  <div key={entry.id}>
                    {entry.image && (
                      <figure>
                        <img
                          src={entry.image}
                          width={1400}
                          height={1000}
                          loading={standalone ? "eager" : "lazy"}
                          decoding="async"
                          alt={
                            page.kind === "comparison"
                              ? `${photoIndex === 0 ? "Silloin" : "Nyt"}: ${book.puppyName}, ${formatDay(entry.date)}`
                              : entry.caption
                                  .trim()
                                  .replace(/\s+/g, " ")
                                  .slice(0, 180) ||
                                `Valittu kuva: ${book.puppyName}, ${formatDay(entry.date)}`
                          }
                        />
                        <figcaption>
                          {page.kind === "comparison" &&
                            (photoIndex === 0 ? "Silloin · " : "Nyt · ")}
                          {formatDay(entry.date)}
                        </figcaption>
                      </figure>
                    )}
                    {page.kind !== "cover" && page.kind !== "comparison" && (
                      <>
                        {!entry.image && (
                          <p className="annual-kicker">
                            {formatDay(entry.date)}
                          </p>
                        )}
                        <p className="annual-copy">
                          {!entry.image &&
                          entry.caption.length <= 350 &&
                          entry.caption.includes("\n") &&
                          entry.caption.indexOf("\n") < 75 ? (
                            <>
                              <span className="annual-story-title">
                                {entry.caption.slice(
                                  0,
                                  entry.caption.indexOf("\n"),
                                )}
                              </span>
                              {entry.caption.slice(entry.caption.indexOf("\n"))}
                            </>
                          ) : (
                            entry.caption
                          )}
                        </p>
                      </>
                    )}
                  </div>
                ))}
            </div>
            {page.kind === "cover" &&
              (design.coverArt === "illustration" || !page.entries.length) && (
                <figure className="annual-cover-illustration">
                  <img
                    src={journalIllustration}
                    width={1000}
                    height={1000}
                    alt="Piirretty pentu järven rannalla. Yleiskuvitus, luotu tekoälyllä."
                  />
                </figure>
              )}
            {page.kind === "comparison" && (
              <p>Kaksi kuvaa yhteisen matkan varrelta.</p>
            )}
            {page.kind === "mishap" &&
              page.entries.length === 1 &&
              !page.entries[0].image &&
              page.entries[0].caption.length <= 180 &&
              page.entries[0].caption.split("\n").length <= 5 && (
                <div className="annual-mishap-illustration" aria-hidden="true">
                  <img
                    src={mishapIllustration}
                    width={640}
                    height={585}
                    alt=""
                  />
                </div>
              )}
            {page.kind === "growth" && (
              <BookGrowthChart weights={page.weights ?? []} />
            )}
            {page.kind === "measurements" && (
              <>
                <p>Omat tallennetut painomittaukset. Painot kilogrammoina.</p>
                <BookWeightTable weights={page.weights ?? []} />
              </>
            )}
            {page.kind === "letter" && (
              <>
                <p className="annual-copy annual-letter-copy">{page.text}</p>
                {page.key === "letter-0" && (
                  <div className="annual-letter-ending" aria-hidden="true">
                    <div className="annual-letter-lines" />
                    <img
                      src={letterIllustration}
                      width={640}
                      height={640}
                      alt=""
                    />
                  </div>
                )}
              </>
            )}
            <p className="annual-footer">
              <span>Pentukirja · Pentulaskuri</span>
              <span>
                {index + 1} / {allPages.length}
              </span>
            </p>
          </article>
        );
      })}
    </div>
  );
}
