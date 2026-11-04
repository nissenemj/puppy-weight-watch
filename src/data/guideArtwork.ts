import home320avif from "@/assets/guide-home-v2-320.avif";
import home320webp from "@/assets/guide-home-v2-320.webp";
import home640avif from "@/assets/guide-home-v2-640.avif";
import home640webp from "@/assets/guide-home-v2-640.webp";
import home1200avif from "@/assets/guide-home-v2-1200.avif";
import home1200webp from "@/assets/guide-home-v2-1200.webp";
import feeding320avif from "@/assets/guide-feeding-v2-320.avif";
import feeding320webp from "@/assets/guide-feeding-v2-320.webp";
import feeding640avif from "@/assets/guide-feeding-v2-640.avif";
import feeding640webp from "@/assets/guide-feeding-v2-640.webp";
import feeding1200avif from "@/assets/guide-feeding-v2-1200.avif";
import feeding1200webp from "@/assets/guide-feeding-v2-1200.webp";
import socialization320avif from "@/assets/guide-socialization-v2-320.avif";
import socialization320webp from "@/assets/guide-socialization-v2-320.webp";
import socialization640avif from "@/assets/guide-socialization-v2-640.avif";
import socialization640webp from "@/assets/guide-socialization-v2-640.webp";
import socialization1200avif from "@/assets/guide-socialization-v2-1200.avif";
import socialization1200webp from "@/assets/guide-socialization-v2-1200.webp";
import safety320avif from "@/assets/guide-safety-v2-320.avif";
import safety320webp from "@/assets/guide-safety-v2-320.webp";
import safety640avif from "@/assets/guide-safety-v2-640.avif";
import safety640webp from "@/assets/guide-safety-v2-640.webp";
import safety1200avif from "@/assets/guide-safety-v2-1200.avif";
import safety1200webp from "@/assets/guide-safety-v2-1200.webp";
import relaxation320avif from "@/assets/guide-relaxation-v2-320.avif";
import relaxation320webp from "@/assets/guide-relaxation-v2-320.webp";
import relaxation640avif from "@/assets/guide-relaxation-v2-640.avif";
import relaxation640webp from "@/assets/guide-relaxation-v2-640.webp";
import relaxation1200avif from "@/assets/guide-relaxation-v2-1200.avif";
import relaxation1200webp from "@/assets/guide-relaxation-v2-1200.webp";

export type GuideArtworkKey =
  | "home"
  | "feeding"
  | "socialization"
  | "safety"
  | "relaxation";

interface ArtworkSource {
  url: string;
  width: number;
}
interface GuideArtwork {
  src: string;
  alt: string;
  caption: string;
  sources: { avif: ArtworkSource[]; webp: ArtworkSource[] };
}

export const guideArtwork: Record<GuideArtworkKey, GuideArtwork> = {
  home: {
    src: home1200webp,
    alt: "Kultainennoutajan pentu lepää peitolla, vierellään valjaat ja vesikuppi.",
    caption: "Tekoälyllä luotu kuvituskuva.",
    sources: {
      avif: [
        { url: home320avif, width: 320 },
        { url: home640avif, width: 640 },
        { url: home1200avif, width: 1200 },
      ],
      webp: [
        { url: home320webp, width: 320 },
        { url: home640webp, width: 640 },
        { url: home1200webp, width: 1200 },
      ],
    },
  },
  feeding: {
    src: feeding1200webp,
    alt: "Kultainennoutajan pentu istuu ruoka- ja vesikuppien takana.",
    caption:
      "Tekoälyllä luotu kuvituskuva. Kuvan ruokamäärä ei ole annosteluohje.",
    sources: {
      avif: [
        { url: feeding320avif, width: 320 },
        { url: feeding640avif, width: 640 },
        { url: feeding1200avif, width: 1200 },
      ],
      webp: [
        { url: feeding320webp, width: 320 },
        { url: feeding640webp, width: 640 },
        { url: feeding1200webp, width: 1200 },
      ],
    },
  },
  socialization: {
    src: socialization1200webp,
    alt: "Pentu tutkii puutarhaa. Rauhallinen aikuinen koira lepää kauempana.",
    caption: "Tekoälyllä luotu kuvituskuva.",
    sources: {
      avif: [
        { url: socialization320avif, width: 320 },
        { url: socialization640avif, width: 640 },
        { url: socialization1200avif, width: 1200 },
      ],
      webp: [
        { url: socialization320webp, width: 320 },
        { url: socialization640webp, width: 640 },
        { url: socialization1200webp, width: 1200 },
      ],
    },
  },
  safety: {
    src: safety1200webp,
    alt: "Pentu istuu kotona ulko-oven vieressä vihreät valjaat yllään.",
    caption: "Tekoälyllä luotu kuvituskuva.",
    sources: {
      avif: [
        { url: safety320avif, width: 320 },
        { url: safety640avif, width: 640 },
        { url: safety1200avif, width: 1200 },
      ],
      webp: [
        { url: safety320webp, width: 320 },
        { url: safety640webp, width: 640 },
        { url: safety1200webp, width: 1200 },
      ],
    },
  },
  relaxation: {
    src: relaxation1200webp,
    alt: "Hereillä oleva pentu lepää sinisellä matolla rauhallisessa olohuoneessa.",
    caption: "Tekoälyllä luotu kuvituskuva.",
    sources: {
      avif: [
        { url: relaxation320avif, width: 320 },
        { url: relaxation640avif, width: 640 },
        { url: relaxation1200avif, width: 1200 },
      ],
      webp: [
        { url: relaxation320webp, width: 320 },
        { url: relaxation640webp, width: 640 },
        { url: relaxation1200webp, width: 1200 },
      ],
    },
  },
};
