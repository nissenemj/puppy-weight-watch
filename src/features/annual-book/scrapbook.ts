import { z } from "zod";
import { bookImageSchema, day } from "./model";

export const SCRAPBOOK_TOPIC_KEYS = [
  "moment", "paw", "sleep", "toy", "outfit", "home", "together", "adventure", "mishap",
] as const;
export const SCRAPBOOK_TOPICS = {
  moment: {
    name: "Kuvahetki",
    title: "Pieni suuri hetki",
    idea: "Tavallinenkin hetki kuuluu kirjaan.",
    placeholder: "Omat sanat, jos haluat…",
    questions: ["Mikä tässä hetkessä on parasta?", "Millaisen nimen antaisitte tälle kuvalle?", "Mikä pieni yksityiskohta kuvassa kannattaa muistaa?"],
  },
  paw: {
    name: "Tassunjälki",
    title: "Näillä tassuilla maailmaan",
    idea: "Kuvaa tassu läheltä pennun levätessä tai sen oma jälki hiekassa.",
    placeholder: "Pienet tassut, suuri seikkailu…",
    questions: ["Mihin nämä tassut kulkivat tänään?", "Miltä tassu näyttää läheltä?", "Millaisen nimen antaisitte tälle tassunjäljelle?"],
  },
  sleep: {
    name: "Unikeko",
    title: "Unen mestaruussarja",
    idea: "Kuvaa lepohetki pentua herättämättä. Keksi halutessasi asennolle oma nimi.",
    placeholder: "Mikä on tämän uniasennon nimi?…",
    questions: ["Millaisen nimen antaisitte tälle uniasennolle?", "Mihin pentu käpertyi nukkumaan?", "Mikä pieni yksityiskohta nukkuvassa pennussa on hauskin?"],
  },
  toy: {
    name: "Lelupassi",
    title: "Maailman paras lelu",
    idea: "Kuva lempilelusta riittää. Voit lisätä sen nimen suoraan sivulle.",
    placeholder: "Lelun nimi tai teidän oma tarinanne…",
    questions: ["Minkä nimen lelu on saanut?", "Miten pentu leikkii tällä lelulla?", "Mistä huomaatte, että tämä on lempilelu?"],
  },
  outfit: {
    name: "Ensimmäinen asu",
    title: "Pieni suuri pukeutuja",
    idea: "Kuvaa tuttu takki, valjaat tai oma panta. Kuva pelkästä varusteestakin riittää.",
    placeholder: "Tässä asussa lähdetään…",
    questions: ["Minkä värinen pennun asu on?", "Minne tässä asussa lähdetään?", "Minkä nimen antaisitte tälle asulle?"],
  },
  home: {
    name: "Oma paikka",
    title: "Tässä on hyvä olla",
    idea: "Kuvaa pennun oma peti, lempinurkka tai tuttu paikka kotona.",
    placeholder: "Tämä paikka on meidän suosikki, koska…",
    questions: ["Mikä tekee tästä paikasta pennun oman?", "Mitä pentu tekee tässä mieluiten?", "Mitä pientä tähän paikkaan kuuluu?"],
  },
  together: {
    name: "Yhteiskuva",
    title: "Meidän oma joukkue",
    idea: "Nappaa yhteinen kuva. Myös vierekkäiset tassut ja kengät kertovat teistä.",
    placeholder: "Tässä me ollaan…",
    questions: ["Mitä teette mieluiten yhdessä?", "Minkä nimen antaisitte omalle joukkueellenne?", "Mikä yhteinen hetki saa teidät nauramaan?"],
  },
  adventure: {
    name: "Pieni seikkailu",
    title: "Maailma nenän korkeudella",
    idea: "Kuvaa pieni löytö tutulta lenkiltä. Myös lehti, lätäkkö tai polku on seikkailu.",
    placeholder: "Tänään löysimme…",
    questions: ["Mitä pientä pentu löysi tänään?", "Mihin pentu pysähtyi tutkimaan?", "Mikä olisi tämän retken nimi?"],
  },
  mishap: {
    name: "Kommellus",
    title: "Pieni vahinkoilmoitus",
    idea: "Tallenna pieni kommellus. Oma havainto ja kuviteltu pennun puhe näkyvät erikseen.",
    placeholder: "Mitä itse näit?…",
    questions: ["Mitä näitte omin silmin?", "Minkä otsikon antaisitte tälle kommellukselle?", "Mikä pieni yksityiskohta saa teidät nauramaan?"],
  },
} as const;
export const SCRAPBOOK_LAYOUTS = ["polaroid", "poster", "story"] as const;
export const scrapbookLayoutNames = {
  polaroid: "Polaroidi",
  poster: "Iso kuva",
  story: "Tarinasivu",
};
export const scrapbookPageSchema = z
  .object({
    id: z.string().uuid(),
    topic: z.enum(SCRAPBOOK_TOPIC_KEYS),
    title: z.string().max(60),
    layout: z.enum(SCRAPBOOK_LAYOUTS),
    sticker: z.enum(["none", "paw", "heart", "star"]),
    caption: z.string().max(140),
    quote: z.string().max(140),
    date: z.union([day, z.literal("")]),
    image: bookImageSchema.optional(),
    imageDescription: z.string().max(180),
    imageSource: z.enum(["own", "example"]),
  })
  .strict();
export type ScrapbookPage = z.infer<typeof scrapbookPageSchema>;
export type ScrapbookSection = "full" | "story" | "photo" | "caption" | "quote";
export const scrapbookDraftSchema = z
  .object({
    version: z.literal(1),
    puppyName: z.string().max(40),
    palette: z.enum(["forest", "lake", "berry"]),
    selectedPageId: z.string().uuid(),
    pages: z.array(scrapbookPageSchema).min(1).max(24),
  })
  .strict()
  .superRefine((draft, context) => {
    if (new Set(draft.pages.map((page) => page.id)).size !== draft.pages.length)
      context.addIssue({
        code: "custom",
        path: ["pages"],
        message: "Sivutunnusten on oltava yksilöllisiä.",
      });
    if (!draft.pages.some((page) => page.id === draft.selectedPageId))
      context.addIssue({
        code: "custom",
        path: ["selectedPageId"],
        message: "Valittua sivua ei löytynyt.",
      });
  });
export type ScrapbookDraft = z.infer<typeof scrapbookDraftSchema>;

export function chooseScrapbookTopic(page: ScrapbookPage, topic: ScrapbookPage["topic"]): ScrapbookPage {
  const presetTitle = !page.title.trim() || Object.values(SCRAPBOOK_TOPICS).some((item) => item.title === page.title);
  return { ...page, topic, title: presetTitle ? SCRAPBOOK_TOPICS[topic].title : page.title };
}

export function newScrapbookPage(
  layout: ScrapbookPage["layout"] = "polaroid",
): ScrapbookPage {
  return {
    id: crypto.randomUUID(),
    topic: "moment",
    title: SCRAPBOOK_TOPICS.moment.title,
    layout,
    sticker: "none",
    caption: "",
    quote: "",
    date: "",
    imageDescription: "",
    imageSource: "own",
  };
}
export function newScrapbookDraft(): ScrapbookDraft {
  const page = newScrapbookPage();
  return {
    version: 1,
    puppyName: "Nuppu",
    palette: "lake",
    pages: [page],
    selectedPageId: page.id,
  };
}
export function hasScrapbookContent(page: ScrapbookPage) {
  return Boolean(page.image || page.caption.trim());
}
