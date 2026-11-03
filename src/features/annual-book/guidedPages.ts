export const GUIDED_PAGE_IDS = [
  "paw",
  "home",
  "sleep",
  "toy",
  "outfit",
  "friend",
  "learning",
  "mishap",
] as const;
export type GuidedPageId = (typeof GUIDED_PAGE_IDS)[number];

export const SLEEP_POSE_IDS = [
  "curl",
  "back",
  "side",
  "blanket",
  "pretzel",
  "stretch",
] as const;
export const TOY_USE_IDS = ["carry", "sleep", "throw", "shake"] as const;
export const MISHAP_ITEM_IDS = [
  "sock",
  "shoe",
  "paper",
  "toy",
  "other",
] as const;
export const sleepPoseLabels: Record<(typeof SLEEP_POSE_IDS)[number], string> =
  {
    curl: "Kerällä",
    back: "Selällään",
    side: "Kyljellään",
    blanket: "Kuono peiton alla",
    pretzel: "Pienessä solmussa",
    stretch: "Tassut pitkänä",
  };
export const toyUseLabels: Record<(typeof TOY_USE_IDS)[number], string> = {
  carry: "Kannan mukana",
  sleep: "Nukun vieressä",
  throw: "Heittelen",
  shake: "Ravistelen",
};
export const mishapItemLabels: Record<
  (typeof MISHAP_ITEM_IDS)[number],
  string
> = {
  sock: "Sukka",
  shoe: "Kenkä",
  paper: "Paperi",
  toy: "Lelu",
  other: "Muu esine",
};

interface GuidedPageTemplate {
  chapter: string;
  title: string;
  photoIdea: string;
  questions: readonly [string, string];
  placeholders: readonly [string, string];
}

export const guidedPageTemplates: Record<GuidedPageId, GuidedPageTemplate> = {
  paw: {
    chapter: "Tällainen minä olen",
    title: "Pieni tassuni",
    photoIdea:
      "Kuvaa pieni tassu rennossa lepohetkessä tai tassunjälki lumessa tai hiekassa. Pelkkä tassukuva riittää.",
    questions: [
      "Miltä pieni tassu näyttää?",
      "Mihin nämä tassut ovat jo ehtineet?",
    ],
    placeholders: [
      "Esimerkiksi: vaaleat karvat ja yksi tumma antura…",
      "Esimerkiksi: sohvan alle, omaan petiin ja koko perheen sydämeen…",
    ],
  },
  home: {
    chapter: "Ensimmäiset päivät",
    title: "Päivä, jolloin tulit kotiin",
    photoIdea:
      "Kuvaa ensimmäinen kotihetki, oma peti tai pentu tutkimassa uutta kotiaan. Tavallinen puhelinkuva on juuri sopiva.",
    questions: [
      "Mitä pentu tutki ensimmäisenä?",
      "Mikä kotiintulosta jäi mieleen?",
    ],
    placeholders: [
      "Esimerkiksi: eteisen kengät ja keittiön tuolinjalat…",
      "Esimerkiksi: nukahdit lopulta aivan jalkojeni viereen…",
    ],
  },
  sleep: {
    chapter: "Pieni arkeni",
    title: "Unen mestaruussarja",
    photoIdea:
      "Kerää enintään kolme unikuvaa ja keksi asennoille omat nimet. Kuvaa rauhassa nukkuvaa pentua sitä herättämättä.",
    questions: [
      "Missä nukut mieluiten?",
      "Millainen on sinun hassu uniasentosi?",
    ],
    placeholders: [
      "Esimerkiksi: omalla peitolla sohvan vieressä…",
      "Esimerkiksi: kaikki tassut kohti kattoa…",
    ],
  },
  toy: {
    chapter: "Omat suosikkini",
    title: "Lelupassi",
    photoIdea:
      "Kuvaa pentu lempilelunsa kanssa. Voit palata myöhemmin samaan leluun ja huomata, miten pentu on kasvanut.",
    questions: ["Mikä on lelun nimi?", "Miksi juuri tämä lelu on suosikki?"],
    placeholders: [
      "Esimerkiksi: Kettu, jo vähän korvaton…",
      "Esimerkiksi: se kulkee mukana jopa päiväunille…",
    ],
  },
  outfit: {
    chapter: "Ensimmäiset kerrat",
    title: "Ensimmäinen asuni",
    photoIdea:
      "Kuvaa ensimmäinen vaate tai tutut valjaat. Valitse varuste, jossa pentu on rennosti. Tämän sivun voi myös ohittaa.",
    questions: [
      "Mitä sinulla on päälläsi?",
      "Miten ensimmäinen sovitus sujui?",
    ],
    placeholders: [
      "Esimerkiksi: pienet siniset valjaat…",
      "Esimerkiksi: ensin nuuhkittiin, sitten lähdettiin pihalle…",
    ],
  },
  friend: {
    chapter: "Meidän jengimme",
    title: "Minä ja ystäväni",
    photoIdea:
      "Kuvaa pentu tutun ihmisen tai eläinystävän kanssa yhteisessä, rauhallisessa hetkessä. Myös vieretysten lepääminen on ystävyyttä.",
    questions: [
      "Kuka on kuvassa kanssasi?",
      "Mitä teette mielellänne yhdessä?",
    ],
    placeholders: [
      "Esimerkiksi: naapurimme vanhempi koira…",
      "Esimerkiksi: tutkimme samoja nurmikon tuoksuja…",
    ],
  },
  learning: {
    chapter: "Yhdessä opittua",
    title: "Tämän me opimme",
    photoIdea:
      "Kuvaa pieni yhteinen onnistuminen. Se voi olla katsekontakti, omaan petiin asettuminen tai ensimmäinen mukava hihnalenkki.",
    questions: [
      "Mitä opimme yhdessä?",
      "Miten juhlistimme pientä onnistumista?",
    ],
    placeholders: [
      "Esimerkiksi: pysähdyit katsomaan minua, kun sanoin nimesi…",
      "Esimerkiksi: leikimme hetken lempilelullasi…",
    ],
  },
  mishap: {
    chapter: "Meidän kommelluksemme",
    title: "Vahinkoilmoitus",
    photoIdea:
      "Tallenna pieni arjen kommellus. Kirjoita ensin oma havaintosi ja halutessasi pennulle kuviteltu puolustuspuhe. Tilannetta ei tarvitse järjestää kuvaa varten.",
    questions: ["Mitä oikein tapahtui?", "Mikä teki hetkestä hauskan?"],
    placeholders: [
      "Esimerkiksi: kaikki lelut siirtyivät yhden tuolin alle…",
      "Esimerkiksi: istuit keskellä kokoelmaa hyvin ylpeänä…",
    ],
  },
};

export const puppyBookChapterIdeas = [
  {
    title: "Tällainen minä olen",
    ideas: [
      "Kasvokuva ja tarina nimen takana",
      "Pieni tassu tai tassunjälki",
      "Lähikuvat kuonosta ja korvista",
      "Lempinimet ja omat erityistaidot",
    ],
  },
  {
    title: "Ensimmäiset päivät",
    ideas: [
      "Kotiintulo ja ensimmäinen oma peti",
      "Ensimmäinen yhteinen aamu",
      "Ensimmäinen kuva sylissä",
      "Se paikka, johon nukahdit",
    ],
  },
  {
    title: "Pieni arkeni ja suosikkini",
    ideas: [
      "Lempilelu ja sen oma nimi",
      "Unikokoelma: kerällä, selällään ja kuono peiton alla",
      "Lempipaikka ja lempileikki",
      "Tavallinen yhteinen tiistai",
    ],
  },
  {
    title: "Ensimmäiset kerrat",
    ideas: [
      "Ensimmäinen asu tai valjaat",
      "Ensimmäinen yhteinen retki",
      "Ensimmäinen lumi, syksyn lehdet tai sade",
      "Ensimmäinen kyläily ja matkustaminen",
    ],
  },
  {
    title: "Meidän jengimme",
    ideas: [
      "Pentu ja perheenjäsenet",
      "Ensimmäinen tuttu koirakaveri",
      "Yhteinen leikki tai päiväunet",
      "Teidän oma pieni perinteenne",
    ],
  },
  {
    title: "Kommellukset ja opitut asiat",
    ideas: [
      "Sukkasaalis ja muut tärkeät aarteet",
      "Ilme, joka saa aina nauramaan",
      "Pieni yhteinen onnistuminen",
      "Ennen ja jälkeen tavallisen metsälenkin",
    ],
  },
  {
    title: "Näin minä kasvan",
    ideas: [
      "Sama lelu tai kuvauspaikka eri kuukausina",
      "Kuukauden kuva ja uusi lempiasia",
      "Oma kasvukäyrä ja oikeat mittaukset",
      "Tassu silloin ja nyt",
    ],
  },
  {
    title: "Vuosi kanssasi",
    ideas: [
      "Ensimmäinen syntymäpäivä",
      "Vuoden kolme rakkainta hetkeä",
      "Lempilelun pieni elämäkerta",
      "Kirje isommalle pennulle ja seuraavan vuoden toiveet",
    ],
  },
] as const;
