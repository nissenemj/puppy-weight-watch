import React from "react";
import { buildBookPages, formatDay, type AnnualBook } from "./model";
import { documentStyles } from "./documentStyles";

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
  const pages =
    pageIndex === undefined
      ? allPages
      : allPages.slice(pageIndex, pageIndex + 1);
  return (
    <div className="annual-document" lang="fi">
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
            <p className="annual-kicker">
              {book.puppyName} · {formatDay(book.start)}–{formatDay(book.end)}
            </p>
            <Heading>{page.title}</Heading>
            {page.kind === "cover" && (
              <>
                <p className="annual-name">{book.puppyName}: pentuvuosi</p>
                <p>Kuvia, kasvua ja yhteisiä kommelluksia.</p>
              </>
            )}
            <div
              className={
                page.kind === "comparison" ? "annual-comparison" : undefined
              }
            >
              {page.entries.map((entry, photoIndex) => (
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
                        <p className="annual-kicker">{formatDay(entry.date)}</p>
                      )}
                      <p className="annual-copy">{entry.caption}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
            {page.kind === "comparison" && (
              <p>Kaksi kuvaa yhteisen matkan varrelta.</p>
            )}
            {page.kind === "growth" && (
              <>
                <p>Omat tallennetut painomittaukset. Painot kilogrammoina.</p>
                <table>
                  <caption>Painomittaukset</caption>
                  <thead>
                    <tr>
                      <th scope="col">Päivämäärä</th>
                      <th scope="col">Paino (kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {page.weights?.map((weight, n) => (
                      <tr key={`${weight.date}-${n}`}>
                        <td>{formatDay(weight.date)}</td>
                        <td>
                          {new Intl.NumberFormat("fi-FI", {
                            maximumFractionDigits: 2,
                          }).format(weight.kg)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
            <p className="annual-footer">
              Pentulaskuri · {index + 1} / {allPages.length}
            </p>
          </article>
        );
      })}
    </div>
  );
}
