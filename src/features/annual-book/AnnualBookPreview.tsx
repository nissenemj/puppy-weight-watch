import { useId } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnnualBookDocument } from "./AnnualBookDocument";
import { buildBookPages, type AnnualBook } from "./model";
import { BookReader } from "./BookReader";

export function AnnualBookPreview({
  book,
  pageIndex,
  onPageChange,
  canPrint = true,
}: {
  book: AnnualBook;
  pageIndex: number;
  onPageChange: (index: number) => void;
  canPrint?: boolean;
}) {
  const id = useId();
  const pages = buildBookPages(book);
  const index = Math.max(0, Math.min(pageIndex, pages.length - 1));
  return (
    <div className="annual-preview">
      <BookReader
        book={book}
        pageIndex={index}
        onPageChange={onPageChange}
        canPrint={canPrint}
      />
      <nav className="annual-pagination" aria-label="Kirjan esikatselun sivut">
        <button
          type="button"
          className="journal-icon-button"
          aria-label="Edellinen esimerkkisivu"
          disabled={index === 0}
          onClick={() => onPageChange(index - 1)}
        >
          <ArrowLeft size={18} aria-hidden="true" />
        </button>
        <label htmlFor={id} className="sr-only">
          Valitse kirjan sivu
        </label>
        <select
          id={id}
          name="book-page"
          value={index}
          onChange={(event) => onPageChange(Number(event.target.value))}
        >
          {pages.map((page, number) => (
            <option key={page.key} value={number}>
              {number + 1}. {page.title}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="journal-icon-button"
          aria-label="Seuraava esimerkkisivu"
          disabled={index === pages.length - 1}
          onClick={() => onPageChange(index + 1)}
        >
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </nav>
      <p className="annual-page-status" role="status">
        Sivu {index + 1} / {pages.length}
      </p>
      <AnnualBookDocument book={book} pageIndex={index} />
    </div>
  );
}
