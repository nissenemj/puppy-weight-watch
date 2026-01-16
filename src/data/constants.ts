// Hardcoded constants for the puppy book feature

export const DEFAULT_MILESTONES = [
  {
    title: 'Ensimmäinen rokotus',
    description: 'Perusrokotukset aloitettu',
    target_age_weeks: 8,
    display_order: 1
  },
  {
    title: 'Peruskomennot',
    description: 'Istu, maahan, tule -komennot',
    target_age_weeks: 12,
    display_order: 2
  },
  {
    title: 'Sosiaalistaminen',
    description: 'Tutustuminen muihin koiriin ja ihmisiin',
    target_age_weeks: 16,
    display_order: 3
  },
  {
    title: 'Toinen rokotus',
    description: 'Rokotussarja täydennetty',
    target_age_weeks: 12,
    display_order: 4
  },
  {
    title: 'Hihnakävely',
    description: 'Opetellut kävelemään hihnassa',
    target_age_weeks: 20,
    display_order: 5
  }
] as const;

export const PUPPY_BOOK_THEME = {
  colorScheme: 'warm',
  fontFamily: 'sans-serif'
} as const;
