import {
  useId,
  useLayoutEffect,
  useRef,
  type TextareaHTMLAttributes,
} from "react";
import { Camera, Heart, PawPrint, Star } from "lucide-react";
import { formatDay } from "./model";
import {
  SCRAPBOOK_TOPICS,
  type ScrapbookPage as Page,
  type ScrapbookSection,
} from "./scrapbook";

export function GrowingBookField(
  props: TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  const field = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const element = field.current;
    if (!element) return;
    const resize = () => {
      element.style.height = "auto";
      element.style.height = `${element.scrollHeight + 2}px`;
    };
    resize();
    let previousWidth = element.clientWidth;
    const observer = new ResizeObserver(() => {
      if (element.clientWidth !== previousWidth) {
        previousWidth = element.clientWidth;
        resize();
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [props.value]);
  return <textarea ref={field} rows={1} {...props} />;
}

export function ScrapbookPageContent({
  page,
  section = "full",
  partText,
  editor,
}: {
  page: Page;
  section?: ScrapbookSection;
  partText?: string;
  editor?: {
    onChange: (change: Partial<Page>, group?: string) => void;
    onFinish: () => void;
    onCamera: () => void;
    showQuote: boolean;
    disabled: boolean;
  };
}) {
  const id = useId();
  const showPhoto = section === "full" || section === "photo";
  const showCaption =
    section === "full" || section === "story" || section === "caption";
  const showQuote =
    section === "full" || section === "story" || section === "quote";
  const Sticker =
    page.sticker === "paw" ? PawPrint : page.sticker === "heart" ? Heart : Star;
  const caption = section === "caption" ? (partText ?? "") : page.caption;
  const quote = section === "quote" ? (partText ?? "") : page.quote;
  const hasQuote = showQuote && Boolean(quote || editor?.showQuote);
  const quoteOnPhoto = hasQuote && showPhoto && Boolean(page.image);
  const quoteHint = (
    <span id={`${id}-quote-hint`} className="scrap-fiction-label">
      Pennun kuviteltu puhe. Leikillinen, itse keksitty teksti.
    </span>
  );
  const speechBubble = hasQuote ? (
    <div
      className={`scrap-quote${quoteOnPhoto ? " scrap-quote-on-photo" : ""}`}
    >
      {editor ? (
        <>
          <label htmlFor={`${id}-quote`} className="sr-only">
            Pennun kuviteltu puhe
          </label>
          <GrowingBookField
            id={`${id}-quote`}
            name="scrapbook-quote"
            className="scrap-inline-field"
            maxLength={140}
            autoComplete="off"
            disabled={editor.disabled}
            placeholder="Jos pentu osaisi puhua…"
            value={page.quote}
            aria-describedby={`${id}-quote-hint`}
            onChange={(event) =>
              editor.onChange({ quote: event.target.value }, "quote")
            }
            onBlur={editor.onFinish}
          />
        </>
      ) : (
        <p className="scrap-copy" aria-describedby={`${id}-quote-hint`}>
          {quote}
        </p>
      )}
    </div>
  ) : null;
  return (
    <div
      className={`scrap-content scrap-layout-${page.layout}${section === "photo" ? " scrap-photo-only" : ""}`}
    >
      {showPhoto &&
        (page.image ? (
          <figure className="scrap-photo-frame">
            <div className="scrap-photo-scene">
              <img
                src={page.image}
                width={1400}
                height={1000}
                decoding="async"
                alt={
                  page.imageDescription ||
                  `Oma kuva sivulla ${page.title.trim() || "Oma kuvahetki"}`
                }
              />
              {quoteOnPhoto && speechBubble}
            </div>
            {page.sticker !== "none" && (
              <span className="scrap-paper-sticker" aria-hidden="true">
                <Sticker size={26} strokeWidth={1.6} />
              </span>
            )}
            {(page.imageSource === "example" || quoteOnPhoto) && (
              <figcaption>
                {page.imageSource === "example" && (
                  <span>Tekoälyllä luotu esimerkkikuva.</span>
                )}
                {quoteOnPhoto && quoteHint}
              </figcaption>
            )}
          </figure>
        ) : editor ? (
          <button
            type="button"
            className="scrap-empty-photo"
            onClick={editor.onCamera}
            disabled={editor.disabled}
          >
            <Camera size={44} strokeWidth={1.4} aria-hidden="true" />
            <strong>Ota kuva</strong>
            <span>
              {page.topic === "moment"
                ? "Oma kirjasivu alkaa yhdestä kuvasta."
                : SCRAPBOOK_TOPICS[page.topic].idea}
            </span>
          </button>
        ) : null)}
      {page.date && <p className="scrap-event-date">{formatDay(page.date)}</p>}
      {showCaption &&
        (editor ? (
          <div className="scrap-editable-copy">
            <label
              htmlFor={`${id}-caption`}
              className={
                page.topic === "mishap" ? "scrap-copy-label" : "sr-only"
              }
            >
              {page.topic === "mishap"
                ? "Oma havainto"
                : "Omat sanat (valinnainen)"}
            </label>
            <GrowingBookField
              id={`${id}-caption`}
              name="scrapbook-caption"
              className="scrap-inline-field"
              autoComplete="off"
              maxLength={140}
              disabled={editor.disabled}
              placeholder={SCRAPBOOK_TOPICS[page.topic].placeholder}
              value={page.caption}
              onChange={(event) =>
                editor.onChange({ caption: event.target.value }, "caption")
              }
              onBlur={editor.onFinish}
              aria-describedby={`${id}-copy-hint`}
            />
            <p id={`${id}-copy-hint`} className="scrap-copy-hint">
              Valinnainen. Enintään 140 merkkiä.
            </p>
          </div>
        ) : caption ? (
          <div className="scrap-readable-copy">
            {page.topic === "mishap" && (
              <p className="scrap-copy-label">Oma havainto</p>
            )}
            <p className="scrap-copy">{caption}</p>
          </div>
        ) : null)}
      {hasQuote && !quoteOnPhoto && (
        <div className="scrap-quote-continuation">
          {speechBubble}
          {quoteHint}
        </div>
      )}
    </div>
  );
}
