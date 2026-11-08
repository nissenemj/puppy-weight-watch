// Official store front pages checked 2026-11-08. Old Adtraction campaigns returned "Invalid link".
// These are direct links. No unverified publisher ID or commission is implied.
export const RETAILERS = {
  peten: {
    name: "Peten Koiratarvike",
    href: "https://www.petenkoiratarvike.com/",
  },
  haukkula: {
    name: "Koiratarvike Haukkula",
    href: "https://koiratarvikehaukkula.fi/",
  },
  muotitassu: { name: "Muotitassu", href: "https://muotitassu.fi/" },
} as const;
export const PREPARATION_RETAILERS = [RETAILERS.peten, RETAILERS.haukkula];
