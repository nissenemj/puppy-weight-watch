import { z } from "zod";

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
          image: z
            .string()
            .max(1_000_000)
            .regex(/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/)
            .optional(),
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

export type AnnualBook = z.infer<typeof annualBookSchema>;
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
    | "letter";
  title: string;
  entries: BookEntry[];
  weights?: AnnualBook["weights"];
  text?: string;
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
      budget = 18;
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

export function buildBookPages(book: AnnualBook): BookPage[] {
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
