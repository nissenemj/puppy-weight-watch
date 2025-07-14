/**
 * Utility functions for calculating puppy age and determining appropriate content
 */

export interface PuppyAgeInfo {
  days: number;
  weeks: number;
  months: number;
  ageString: string;
  isValidForContent: boolean;
}

/**
 * Calculate puppy's current age from birth date
 */
export const calculatePuppyAge = (birthDate: string | Date): PuppyAgeInfo => {
  const birth = new Date(birthDate);
  const now = new Date();
  
  // Calculate difference in milliseconds
  const diffMs = now.getTime() - birth.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30.44); // Average days per month
  
  // Generate age string
  let ageString = '';
  if (days < 7) {
    ageString = `${days} päivää`;
  } else if (weeks < 8) {
    ageString = `${weeks} viikkoa${days % 7 > 0 ? ` ${days % 7} päivää` : ''}`;
  } else if (months < 12) {
    const remainingWeeks = Math.floor((days % 30.44) / 7);
    ageString = `${months} kuukautta${remainingWeeks > 0 ? ` ${remainingWeeks} viikkoa` : ''}`;
  } else {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    ageString = `${years} vuotta${remainingMonths > 0 ? ` ${remainingMonths} kuukautta` : ''}`;
  }
  
  return {
    days,
    weeks,
    months,
    ageString,
    isValidForContent: days >= 0 && days <= 365 * 2 // Valid for content up to 2 years
  };
};

/**
 * Get the appropriate month number for monthly content based on age
 */
export const getMonthNumberFromAge = (birthDate: string | Date): number => {
  const age = calculatePuppyAge(birthDate);
  return Math.min(Math.max(age.months, 0), 12); // Cap at 12 months
};

/**
 * Get age-appropriate milestones based on current age
 */
export const getAgeAppropriateMilestones = (birthDate: string | Date) => {
  const age = calculatePuppyAge(birthDate);
  const weeks = age.weeks;
  
  // Define milestone timing
  const milestones = [
    { minWeeks: 0, maxWeeks: 2, title: 'Silmät auki', description: 'Silmät avautuvat 10-14 päivässä' },
    { minWeeks: 2, maxWeeks: 4, title: 'Ensimmäiset askeleet', description: 'Alkaa kävelemään noin 3 viikon iässä' },
    { minWeeks: 4, maxWeeks: 8, title: 'Hampaiden puhkeaminen', description: 'Maitohampaita alkaa tulla' },
    { minWeeks: 6, maxWeeks: 10, title: 'Ensimmäinen haukahdus', description: 'Ääntely kehittyy' },
    { minWeeks: 7, maxWeeks: 12, title: 'Ensimmäinen rokotus', description: 'Perusrokotukset 7-9 viikon iässä' },
    { minWeeks: 10, maxWeeks: 16, title: 'Sosiaalistaminen alkaa', description: 'Turvallisia kohtaamissia muiden kanssa' },
    { minWeeks: 12, maxWeeks: 16, title: 'Toinen rokotus', description: 'Rokotussarja täydennetään' },
    { minWeeks: 12, maxWeeks: 20, title: 'Peruskomennot', description: 'Istu, maahan -komentojen opettelu' },
    { minWeeks: 14, maxWeeks: 24, title: 'Hihnakävely', description: 'Opetellaan kävelemään hihnassa' }
  ];
  
  return milestones.filter(milestone => 
    weeks >= milestone.minWeeks && weeks <= milestone.maxWeeks
  );
};

/**
 * Calculate recommended date for a milestone based on target weeks
 */
export const calculateMilestoneDate = (birthDate: string | Date, targetWeeks: number): Date => {
  const birth = new Date(birthDate);
  const milestoneDate = new Date(birth);
  milestoneDate.setDate(birth.getDate() + (targetWeeks * 7));
  return milestoneDate;
};

/**
 * Format date for display in Finnish locale
 */
export const formatFinnishDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('fi-FI', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Get default birth date suggestion (today minus 8 weeks for a typical adoption age)
 */
export const getDefaultBirthDate = (): string => {
  const today = new Date();
  const eightWeeksAgo = new Date(today);
  eightWeeksAgo.setDate(today.getDate() - (8 * 7));
  return eightWeeksAgo.toISOString().split('T')[0];
};