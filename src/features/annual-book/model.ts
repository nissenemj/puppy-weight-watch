import { z } from "zod";
import type { ScrapbookPage, ScrapbookSection } from "./scrapbook";
import {
  GUIDED_PAGE_IDS,
  MISHAP_ITEM_IDS,
  SLEEP_POSE_IDS,
  TOY_USE_IDS,
  guidedPageTemplates,
} from "./guidedPages";

export const day = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}$/,
    "Anna tapahtumapäivä muodossa vuosi-kuukausi-päivä.",
  )
  .refine((value) => {
    const date = new Date(`${value}T12:00:00Z`);
    return (
      !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
    );
  }, "Tarkista päivämäärä.");

export const bookDesignSchema = z
  .object({
    title: z.string().max(60),
    palette: z.enum(["forest", "lake", "berry"]),
    coverArt: z.enum(["photo", "illustration"]),
    letter: z.string().max(1200),
  })
  .strict();
export type BookDesign = z.infer<typeof bookDesignSchema>;
export const DEFAULT_BOOK_DESIGN: BookDesign = {
  title: "",
  palette: "forest",
  coverArt: "photo",
  letter: "",
};

export const bookImageSchema = z
  .string()
  .max(1_000_000)
  .regex(/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/);
const shortAnswer = z
  .string()
  .trim()
  .max(140)
  .regex(/^[^\r\n]*$/, "Kirjoita lyhyt vastaus ilman rivinvaihtoja.");

const guidedPhotoSchema = z
  .object({
    id: z.string().min(1).max(80),
    image: bookImageSchema,
    name: shortAnswer.pipe(z.string().max(40)),
    description: z.string().trim().max(180),
  })
  .strict();
export type GuidedPhoto = z.infer<typeof guidedPhotoSchema>;

const guidedDetailsSchema = z.discriminatedUnion("kind", [
  z
    .object({
      kind: z.literal("sleep"),
      poses: z.array(z.enum(SLEEP_POSE_IDS)).max(6),
    })
    .strict(),
  z
    .object({
      kind: z.literal("toy"),
      uses: z.array(z.enum(TOY_USE_IDS)).max(4),
    })
    .strict(),
  z
    .object({
      kind: z.literal("mishap"),
      items: z.array(z.enum(MISHAP_ITEM_IDS)).max(5),
      other: shortAnswer.pipe(z.string().max(60)),
    })
    .strict(),
]);

// Local guided-page experiment. This does not change the saved annual-draft format.
export const guidedPageSchema = z
  .object({
    templateId: z.enum(GUIDED_PAGE_IDS),
    date: z.union([day, z.literal("")]),
    first: shortAnswer,
    second: shortAnswer,
    image: bookImageSchema.optional(),
    photoDescription: z.string().trim().max(180),
    photos: z
      .array(guidedPhotoSchema)
      .max(3, "Unisivulle mahtuu enintään kolme kuvaa.")
      .optional(),
    details: guidedDetailsSchema.optional(),
  })
  .strict()
  .superRefine((page, context) => {
    const details = page.details;
    const choices =
      details?.kind === "sleep"
        ? details.poses
        : details?.kind === "toy"
          ? details.uses
          : details?.kind === "mishap"
            ? details.items
            : [];
    if (details && details.kind !== page.templateId)
      context.addIssue({
        code: "custom",
        path: ["details"],
        message: "Valinnat eivät kuulu tälle sivulle.",
      });
    if (new Set(choices).size !== choices.length)
      context.addIssue({
        code: "custom",
        path: ["details"],
        message: "Sama valinta voi olla mukana vain kerran.",
      });
    if (page.photos && (page.templateId !== "sleep" || page.image))
      context.addIssue({
        code: "custom",
        path: ["photos"],
        message:
          "Kuvakokoelma kuuluu vain unisivulle eikä sitä voi yhdistää yksittäiseen kuvaan.",
      });
    if (
      page.photos &&
      new Set(page.photos.map((photo) => photo.id)).size !== page.photos.length
    )
      context.addIssue({
        code: "custom",
        path: ["photos"],
        message: "Sama unikuva voi olla mukana vain kerran.",
      });
    const hasPhoto = Boolean(page.image || page.photos?.length);
    // An imagined defence alone must not be presented as an observed incident.
    const hasAnswer = Boolean(
      page.first || (details?.kind !== "mishap" && page.second),
    );
    if (!hasPhoto && !hasAnswer && !choices.length)
      context.addIssue({
        code: "custom",
        message:
          details?.kind === "mishap"
            ? "Lisää oma havainto, kuva tai tilanteeseen liittyvä esine. Kuviteltu puolustuspuhe on valinnainen lisä."
            : details
              ? "Lisää kuva, tee valinta tai kirjoita ainakin yksi vastaus."
              : "Lisää kuva tai kirjoita ainakin yksi vastaus.",
      });
  });
export type GuidedBookPage = z.infer<typeof guidedPageSchema>;

export function getGuidedPhotos(page: GuidedBookPage): GuidedPhoto[] {
  return (
    page.photos ??
    (page.image
      ? [
          {
            id: "primary",
            image: page.image,
            name: "",
            description: page.photoDescription,
          },
        ]
      : [])
  );
}
export const guidedPageSetSchema = z
  .array(guidedPageSchema)
  .max(8)
  .refine(
    (pages) =>
      new Set(pages.map((page) => page.templateId)).size === pages.length,
    "Sama sivu voi olla kirjassa vain kerran.",
  );

export const annualBookSchema = z
  .object({
    bookId: z.string().uuid(),
    puppyName: z
      .string()
      .trim()
      .min(1, "Anna pennun nimi.")
      .max(40, "Pennun nimi voi olla enintään 40 merkkiä."),
    start: day,
    end: day,
    design: bookDesignSchema.optional(),
    entries: z
      .array(
        z.object({
          id: z.string().min(1).max(100),
          date: day,
          caption: z
            .string()
            .max(
              5000,
              "Yksi muisto voi sisältää enintään 5 000 merkkiä. Lyhennä sitä Muistot-osiossa tai poista se valinnasta.",
            ),
          image: bookImageSchema.optional(),
          mishap: z.boolean(),
        }),
      )
      .max(24, "Valitse kirjaan enintään 24 muistoa."),
    weights: z
      .array(z.object({ date: day, kg: z.number().positive().max(200) }))
      .max(400),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.start > value.end)
      context.addIssue({
        code: "custom",
        path: ["end"],
        message: "Loppupäivä ei voi olla ennen alkupäivää.",
      });
    if (firstYearEnd(value.start) && value.end > firstYearEnd(value.start))
      context.addIssue({
        code: "custom",
        path: ["end"],
        message: "Valitse enintään vuoden jakso.",
      });
    const ids = value.entries.map((entry) => entry.id);
    if (new Set(ids).size !== ids.length)
      context.addIssue({
        code: "custom",
        path: ["entries"],
        message: "Sama muisto voi olla kirjassa vain kerran.",
      });
    if (
      value.entries.some(
        (entry) => entry.date < value.start || entry.date > value.end,
      )
    )
      context.addIssue({
        code: "custom",
        path: ["entries"],
        message: "Valitse muistoille päivämäärä kirjan ajanjaksolta.",
      });
  });

// Display-only metadata for the public fixture. The saved-book schema stays strict.
export type AnnualBook = z.infer<typeof annualBookSchema> & {
  isExample?: true;
};
export type BookEntry = AnnualBook["entries"][number];
export type BookPage = {
  key: string;
  kind:
    | "cover"
    | "comparison"
    | "month"
    | "mishap"
    | "growth"
    | "measurements"
    | "letter"
    | "guided"
    | "scrapbook";
  title: string;
  entries: BookEntry[];
  weights?: AnnualBook["weights"];
  text?: string;
  guided?: GuidedBookPage;
  guidedPhotoIndex?: number;
  guidedSection?: "details" | "photo";
  scrapbook?: ScrapbookPage;
  scrapbookSection?: ScrapbookSection;
};

export function formatDay(value: string) {
  return new Intl.DateTimeFormat("fi-FI", { timeZone: "UTC" }).format(
    new Date(`${value}T12:00:00Z`),
  );
}

export function firstYearEnd(start: string) {
  if (!day.safeParse(start).success) return "";
  const date = new Date(`${start}T12:00:00Z`);
  // End on the day before the next anniversary; February 29 ends on February 28.
  const anniversary = new Date(
    Date.UTC(date.getUTCFullYear() + 1, date.getUTCMonth(), date.getUTCDate()),
  );
  anniversary.setUTCDate(anniversary.getUTCDate() - 1);
  return anniversary.toISOString().slice(0, 10);
}

/** Conservative line budgets leave room for images. Every character is retained. */
export function splitCaption(
  caption: string,
  hasImage: boolean,
  firstPageLines?: number,
  continuationLines = 18,
): string[] {
  const chunks: string[] = [];
  let chunk = "";
  let column = 0;
  let lines = 1;
  let budget = firstPageLines ?? (hasImage ? 6 : 18);
  for (const character of caption) {
    if (character === "\n" || column >= 50) {
      lines += 1;
      column = 0;
    }
    if (lines > budget && chunk) {
      chunks.push(chunk);
      chunk = "";
      lines = 1;
      budget = continuationLines;
    }
    chunk += character;
    if (character !== "\n")
      column +=
        character === "\t"
          ? 8
          : /[MW@\u1100-\u11ff\u3000-\u9fff\uac00-\ud7af]/.test(character) ||
              character.codePointAt(0)! > 0xffff
            ? 2
            : 1;
  }
  if (chunk || chunks.length === 0) chunks.push(chunk);
  return chunks;
}

export function buildBookPages(
  book: AnnualBook,
  guidedPages: GuidedBookPage[] = [],
  scrapbookPages: ScrapbookPage[] = [],
): BookPage[] {
  const entries = [...book.entries].sort(
    (a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id),
  );
  const photos = entries.filter((entry) => entry.image);
  const pages: BookPage[] = [
    {
      key: "cover",
      kind: "cover",
      title: book.design?.title.trim() || "Pennun ensimmäinen vuosi",
      entries: photos.slice(0, 1),
    },
  ];
  const lastPhoto = photos[photos.length - 1];
  // The author controls scrapbook order. A template can be used more than once.
  for (const scrapbook of scrapbookPages) {
    if (!scrapbook.image && !scrapbook.caption.trim()) continue;
    const title = scrapbook.title.trim() || "Oma kuvahetki";
    const copy = [title, scrapbook.caption, scrapbook.quote]
      .filter(Boolean)
      .join("\n");
    const separatePhoto = Boolean(
      scrapbook.image && splitCaption(copy, true, 6, 6).length > 1,
    );
    const storyFits = splitCaption(copy, false, 14, 14).length === 1;
    const add = (section: ScrapbookSection, suffix: string, text?: string) =>
      pages.push({
        key: `scrapbook-${scrapbook.id}-${suffix}`,
        kind: "scrapbook",
        title: `${title}${suffix === "full" || suffix === "story" ? "" : section === "photo" ? " · Kuva" : " · Jatkuu"}`,
        entries: [],
        scrapbook,
        scrapbookSection: section,
        text,
      });
    if (!separatePhoto && storyFits) add("full", "full");
    else {
      if (storyFits) add("story", "story");
      else {
        if (scrapbook.caption)
          splitCaption(scrapbook.caption, false, 10, 10).forEach(
            (part, index) => add("caption", `caption-${index}`, part),
          );
        if (scrapbook.quote)
          splitCaption(scrapbook.quote, false, 10, 10).forEach((part, index) =>
            add("quote", `quote-${index}`, part),
          );
      }
      if (scrapbook.image) add("photo", "photo");
    }
  }
  // Stable chapter order, independent of the order in which pages were filled.
  for (const id of GUIDED_PAGE_IDS) {
    const guided = guidedPages.find((page) => page.templateId === id);
    if (guided) {
      const images = getGuidedPhotos(guided);
      // The same conservative line budget used for captions leaves room for a
      // photo, choice labels and the page header. Rich answers get their own page.
      const copy = [
        guided.first,
        guided.second,
        images[0]?.name,
        guided.details?.kind === "mishap" &&
        guided.details.items.includes("other")
          ? guided.details.other
          : "",
      ]
        .filter(Boolean)
        .join("\n");
      const separatePhoto = Boolean(
        guided.details &&
          images.length &&
          splitCaption(copy, true, 6).length > 1,
      );
      if (separatePhoto)
        pages.push({
          key: `guided-${id}`,
          kind: "guided",
          title: guidedPageTemplates[id].title,
          entries: [],
          guided,
          guidedSection: "details",
        });
      const photoCount = id === "sleep" ? Math.max(1, images.length) : 1;
      for (let photoIndex = 0; photoIndex < photoCount; photoIndex += 1) {
        pages.push({
          key: `guided-${id}${separatePhoto ? `-photo-${photoIndex}` : photoIndex ? `-${photoIndex}` : ""}`,
          kind: "guided",
          title: `${guidedPageTemplates[id].title}${separatePhoto || photoIndex ? ` · ${id === "sleep" ? "Unikuva" : "Kuva"} ${photoIndex + 1}` : ""}`,
          entries: [],
          guided,
          guidedPhotoIndex: photoIndex,
          ...(separatePhoto ? { guidedSection: "photo" as const } : {}),
        });
      }
    }
  }
  if (photos.length >= 2 && photos[0].date !== lastPhoto.date)
    pages.push({
      key: "comparison",
      kind: "comparison",
      title: "Silloin ja nyt",
      entries: [photos[0], lastPhoto],
    });
  const months = new Map<string, BookEntry[]>();
  for (const entry of entries) {
    const key = entry.date.slice(0, 7);
    months.set(key, [...(months.get(key) ?? []), entry]);
  }
  for (const [month, items] of months) {
    const title = new Intl.DateTimeFormat("fi-FI", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(`${month}-01T12:00:00Z`));
    // A memory gets its own sheet. Long text continues without truncation.
    for (const entry of items) {
      const chunks = splitCaption(entry.caption, Boolean(entry.image));
      chunks.forEach((caption, index) =>
        pages.push({
          key: `${month}-${entry.id}-${index}`,
          kind: entry.mishap ? "mishap" : "month",
          title: entry.mishap ? "Kuukauden kommellus" : title,
          entries: [
            { ...entry, caption, image: index === 0 ? entry.image : undefined },
          ],
        }),
      );
    }
  }
  const weights = book.weights
    .filter((weight) => weight.date >= book.start && weight.date <= book.end)
    .sort((a, b) => a.date.localeCompare(b.date));
  if (weights.length)
    pages.push({
      key: "growth-chart",
      kind: "growth",
      title: "Näin kasvoin",
      entries: [],
      weights,
    });
  for (let index = 0; index < weights.length; index += 16)
    pages.push({
      key: `measurements-${index}`,
      kind: "measurements",
      title: "Kasvu numeroina",
      entries: [],
      weights: weights.slice(index, index + 16),
    });
  if (book.design?.letter.trim()) {
    splitCaption(book.design.letter, false, 12).forEach((text, index) =>
      pages.push({
        key: `letter-${index}`,
        kind: "letter",
        title: "Sinulle, pieni ystävä",
        entries: [],
        text,
      }),
    );
  }
  return pages;
}
