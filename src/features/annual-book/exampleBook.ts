import puppyHome from "@/assets/puppy-home-1200.webp";
import puppyLater from "@/assets/puppy-book-home-1200.webp";
import sleeping from "@/assets/puppy-example-sleep.webp";
import paw from "@/assets/puppy-example-paw.webp";
import toy from "@/assets/puppy-example-toy.webp";
import outfit from "@/assets/puppy-example-outfit.webp";
import sock from "@/assets/puppy-journal-sock.webp";
import shore from "@/assets/puppy-journal-lake.webp";
import { buildBookPages, type AnnualBook, type BookPage } from "./model";
import type { ScrapbookPage } from "./scrapbook";

// Public fictional fixture. Never loaded from or written to a user's book.
export const exampleBook: AnnualBook = {
  isExample: true,
  bookId: "00000000-0000-4000-8000-000000000001",
  puppyName: "Nuppu",
  start: "2026-06-03",
  end: "2027-06-02",
  design: {
    title: "Nupun ensimmäinen vuosi",
    palette: "lake",
    coverArt: "photo",
    letter:
      "Rakas Nuppu,\n\nensimmäisenä iltana nukahdit kenkämme viereen. Me kuuntelimme pientä tuhinaa.\n\nSinä opetit, että kiire voi odottaa yhden nuuhkaisun verran. Toivon meille monta uutta polkua ja aivan tavallista aamua.\n\nOmat ihmiset",
  },
  entries: [
    {
      id: "home",
      date: "2026-06-03",
      image: puppyHome,
      mishap: false,
      caption:
        "Ensimmäinen ilta kotona.\nTutkit ensin maton reunan, sitten vesikupin. Illalla nukahdit peitolle kenkämme viereen.",
    },
    {
      id: "autumn",
      date: "2026-09-03",
      image: puppyLater,
      mishap: false,
      caption:
        "Meidän tavallinen tiistai.\nKirja jäi kesken, kun laskit nenän sen päälle. Istuimme lattialla vähän pidempään.",
    },
  ],
  weights: [
    { date: "2026-06-03", kg: 4.2 },
    { date: "2026-07-03", kg: 6.5 },
    { date: "2026-09-03", kg: 10.8 },
    { date: "2026-12-03", kg: 17.4 },
    { date: "2027-05-03", kg: 22.1 },
  ],
};

const page = (
  number: number,
  topic: ScrapbookPage["topic"],
  title: string,
  image: string,
  imageDescription: string,
  caption: string,
  date: string,
  layout: ScrapbookPage["layout"],
  sticker: ScrapbookPage["sticker"] = "none",
  quote = "",
): ScrapbookPage => ({
  id: `00000000-0000-4000-8000-${String(number).padStart(12, "0")}`,
  topic,
  title,
  image,
  imageDescription,
  caption,
  date,
  layout,
  sticker,
  quote,
  imageSource: "example",
});

export const exampleScrapbookPages: ScrapbookPage[] = [
  page(
    11,
    "paw",
    "Näillä tassuilla maailmaan",
    paw,
    "Kuvitteellisen pennun etutassut harmaalla neulepeitolla. Tekoälyllä luotu kuva.",
    "Samettiset anturat, vähän liian isot tassut. Näillä tassuilla alkoi meidän matkamme.",
    "2026-06-04",
    "poster",
    "paw",
  ),
  page(
    12,
    "sleep",
    "Unen pieni mestari",
    sleeping,
    "Kuvitteellinen kultainennoutajan pentu nukkuu kyljellään harmaalla peitolla. Tekoälyllä luotu kuva.",
    "Harmaa peitto oli päivän paras löytö. Nenä tassulla, koko maailma hetken hiljaa.",
    "2026-06-05",
    "polaroid",
    "star",
  ),
  page(
    13,
    "toy",
    "Lelupassi: Ankka",
    toy,
    "Kuvitteellinen pentu ja sen keltainen ankka-lelu vaalealla puulattialla. Tekoälyllä luotu kuva.",
    "Nimi: Ankka.\nErikoistaito: muuttuu tyynyksi.\nLöytöpaikka: melkein aina sohvan alta.",
    "2026-06-12",
    "story",
    "heart",
    "Minä valitsin tämän.",
  ),
  page(
    14,
    "outfit",
    "Valmiina maailmalle",
    outfit,
    "Kuvitteellinen pentu istuu eteisessä vihreissä valjaissa. Tekoälyllä luotu kuva.",
    "Vihreät valjaat, heiluvat korvat. Ensimmäinen kierros ulko-ovelta postilaatikolle.",
    "2026-06-18",
    "poster",
  ),
  page(
    15,
    "mishap",
    "Tapaus kadonnut sukka",
    sock,
    "Piirretty kultainennoutajan pentu kantaa harmaata sukkaa. Tekoälyllä luotu kuvitus.",
    "Sukka löytyi pedin vierestä. Vaihdoimme sen omaan leluun. Omistaja sai taas kaksi sukkaa.",
    "2026-07-12",
    "polaroid",
    "paw",
    "Minä vain vartioin.",
  ),
  page(
    16,
    "adventure",
    "Retki nenän korkeudella",
    shore,
    "Piirretty kultainennoutajan pentu järven rannalla. Tekoälyllä luotu kuvitus.",
    "Rannassa oli uusi tuoksu ja yksi hyvin tärkeä kivi. Istuimme hetken aivan hiljaa.",
    "2026-08-03",
    "poster",
    "star",
  ),
];

const legacyPages: Record<string, { slug: string; label: string }> = {
  cover: { slug: "kansi", label: "Kansi" },
  comparison: { slug: "silloin-ja-nyt", label: "Silloin ja nyt" },
  "2026-06-home-0": { slug: "ensimmaiset-paivat", label: "Ensimmäiset päivät" },
  "2026-09-autumn-0": { slug: "hetket", label: "Pieniä suuria hetkiä" },
  "growth-chart": { slug: "kasvu", label: "Kasvu" },
  "measurements-0": { slug: "mittaukset", label: "Mittaukset" },
  "letter-0": { slug: "kirje", label: "Kirje pennulle" },
};
const topics = {
  paw: ["tassunjalki", "Tassunjälki"],
  sleep: ["unikeko", "Unikeko"],
  toy: ["lelupassi", "Lelupassi"],
  outfit: ["ensimmainen-asu", "Ensimmäinen asu"],
  mishap: ["kommellus", "Kuukauden kommellus"],
  adventure: ["seikkailu", "Pieni seikkailu"],
} as const;
function pageMeta(page: BookPage) {
  if (legacyPages[page.key]) return legacyPages[page.key];
  const topic = page.scrapbook?.topic;
  if (topic && topic in topics) {
    const [slug, label] = topics[topic as keyof typeof topics];
    return {
      slug:
        page.scrapbookSection === "full"
          ? slug
          : `${slug}-${page.scrapbookSection}`,
      label,
    };
  }
  return { slug: page.key, label: page.title };
}
export const exampleBookPages = buildBookPages(
  exampleBook,
  [],
  exampleScrapbookPages,
).map((page) => ({ ...pageMeta(page), page }));
