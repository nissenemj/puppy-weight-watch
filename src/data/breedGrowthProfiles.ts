// Suositut koirarodut Suomessa ja niiden kasvuprofiilit
export interface BreedProfile {
  name: string
  nameFi: string
  category: 'toy' | 'small' | 'medium' | 'large' | 'giant'
  adultWeight: {
    male: { min: number; max: number }
    female: { min: number; max: number }
  }
  maturityMonths: number
  growthNotes?: string
}

export const FINNISH_BREED_PROFILES: BreedProfile[] = [
  // Toy breeds (alle 5 kg)
  {
    name: 'Chihuahua',
    nameFi: 'Chihuahua',
    category: 'toy',
    adultWeight: {
      male: { min: 1.5, max: 3 },
      female: { min: 1.5, max: 2.5 }
    },
    maturityMonths: 8,
    growthNotes: 'Maailman pienin koirarotu, saavuttaa aikuiskoon nopeasti'
  },
  {
    name: 'Yorkshire Terrier',
    nameFi: 'Yorkshirenterrieri',
    category: 'toy',
    adultWeight: {
      male: { min: 2, max: 3.5 },
      female: { min: 1.8, max: 3.2 }
    },
    maturityMonths: 8
  },
  {
    name: 'Papillon',
    nameFi: 'Papillon',
    category: 'toy',
    adultWeight: {
      male: { min: 3.5, max: 5 },
      female: { min: 3, max: 4.5 }
    },
    maturityMonths: 9
  },

  // Small breeds (5-10 kg)
  {
    name: 'French Bulldog',
    nameFi: 'Ranskanbulldoggi',
    category: 'small',
    adultWeight: {
      male: { min: 9, max: 14 },
      female: { min: 8, max: 13 }
    },
    maturityMonths: 10,
    growthNotes: 'Suosittu perhekoira, tukeva rakenne'
  },
  {
    name: 'Cavalier King Charles Spaniel',
    nameFi: 'Cavalier kingcharlesinspanieli',
    category: 'small',
    adultWeight: {
      male: { min: 5.5, max: 8.5 },
      female: { min: 5, max: 8 }
    },
    maturityMonths: 10
  },
  {
    name: 'Jack Russell Terrier',
    nameFi: 'Jack Russell -terrieri',
    category: 'small',
    adultWeight: {
      male: { min: 6.5, max: 9 },
      female: { min: 5.5, max: 8 }
    },
    maturityMonths: 10
  },
  {
    name: 'Havanese',
    nameFi: 'Havannankoira',
    category: 'small',
    adultWeight: {
      male: { min: 4.5, max: 7.5 },
      female: { min: 3.5, max: 6.5 }
    },
    maturityMonths: 9
  },

  // Medium breeds (10-25 kg)
  {
    name: 'Finnish Lapphund',
    nameFi: 'Suomenlapinkoira',
    category: 'medium',
    adultWeight: {
      male: { min: 17, max: 21 },
      female: { min: 15, max: 19 }
    },
    maturityMonths: 12,
    growthNotes: 'Suomalainen kansallisrotu, sopeutuvainen ja ystävällinen'
  },
  {
    name: 'Shetland Sheepdog',
    nameFi: 'Shetlanninlammaskoira',
    category: 'medium',
    adultWeight: {
      male: { min: 9, max: 12 },
      female: { min: 8, max: 11 }
    },
    maturityMonths: 11
  },
  {
    name: 'Cocker Spaniel',
    nameFi: 'Cockerspanieli',
    category: 'medium',
    adultWeight: {
      male: { min: 13, max: 16 },
      female: { min: 12, max: 15 }
    },
    maturityMonths: 12
  },
  {
    name: 'Beagle',
    nameFi: 'Beagle',
    category: 'medium',
    adultWeight: {
      male: { min: 10, max: 15 },
      female: { min: 9, max: 14 }
    },
    maturityMonths: 11
  },
  {
    name: 'Finnish Spitz',
    nameFi: 'Suomenpystykorva',
    category: 'medium',
    adultWeight: {
      male: { min: 12, max: 16 },
      female: { min: 9, max: 13 }
    },
    maturityMonths: 12,
    growthNotes: 'Suomen kansalliskoira'
  },
  {
    name: 'Border Collie',
    nameFi: 'Bordercollie',
    category: 'medium',
    adultWeight: {
      male: { min: 18, max: 23 },
      female: { min: 16, max: 20 }
    },
    maturityMonths: 14
  },

  // Large breeds (25-40 kg)
  {
    name: 'Golden Retriever',
    nameFi: 'Kultainennoutaja',
    category: 'large',
    adultWeight: {
      male: { min: 30, max: 34 },
      female: { min: 27, max: 32 }
    },
    maturityMonths: 15,
    growthNotes: 'Perheen suosikki, tasainen kasvu'
  },
  {
    name: 'Labrador Retriever',
    nameFi: 'Labradorinnoutaja',
    category: 'large',
    adultWeight: {
      male: { min: 29, max: 36 },
      female: { min: 25, max: 32 }
    },
    maturityMonths: 15,
    growthNotes: 'Suomen suosituin koirarotu'
  },
  {
    name: 'German Shepherd',
    nameFi: 'Saksanpaimenkoira',
    category: 'large',
    adultWeight: {
      male: { min: 30, max: 40 },
      female: { min: 22, max: 32 }
    },
    maturityMonths: 16
  },
  {
    name: 'Siberian Husky',
    nameFi: 'Siperianhusky',
    category: 'large',
    adultWeight: {
      male: { min: 20, max: 27 },
      female: { min: 16, max: 23 }
    },
    maturityMonths: 14
  },
  {
    name: 'Standard Poodle',
    nameFi: 'Isovillakoira',
    category: 'large',
    adultWeight: {
      male: { min: 20, max: 32 },
      female: { min: 18, max: 28 }
    },
    maturityMonths: 15
  },

  // Giant breeds (yli 40 kg)
  {
    name: 'Bernese Mountain Dog',
    nameFi: 'Berninpaimenkoira',
    category: 'giant',
    adultWeight: {
      male: { min: 38, max: 55 },
      female: { min: 36, max: 48 }
    },
    maturityMonths: 20,
    growthNotes: 'Suuri, rauhallinen perhekoira'
  },
  {
    name: 'Great Dane',
    nameFi: 'Tanskandoggi',
    category: 'giant',
    adultWeight: {
      male: { min: 54, max: 90 },
      female: { min: 45, max: 68 }
    },
    maturityMonths: 24,
    growthNotes: 'Yksi suurimmista koiraroduista, hidas kasvu'
  },
  {
    name: 'Newfoundland',
    nameFi: 'Newfoundlandinkoira',
    category: 'giant',
    adultWeight: {
      male: { min: 60, max: 70 },
      female: { min: 45, max: 55 }
    },
    maturityMonths: 22
  },
  {
    name: 'Saint Bernard',
    nameFi: 'Bernhardinkoira',
    category: 'giant',
    adultWeight: {
      male: { min: 64, max: 82 },
      female: { min: 54, max: 64 }
    },
    maturityMonths: 22
  },
  {
    name: 'Leonberger',
    nameFi: 'Leonberginkoira',
    category: 'giant',
    adultWeight: {
      male: { min: 48, max: 77 },
      female: { min: 41, max: 62 }
    },
    maturityMonths: 20
  }
]

// Sekarotujen arviointi painon perusteella
export function getMixedBreedProfile(estimatedAdultWeight: number): BreedProfile {
  const baseProfiles: BreedProfile[] = [
    {
      name: 'Toy Mix',
      nameFi: 'Pieni sekarotu',
      category: 'toy',
      adultWeight: {
        male: { min: 1, max: 5 },
        female: { min: 1, max: 5 }
      },
      maturityMonths: 8
    },
    {
      name: 'Small Mix',
      nameFi: 'Pieni-keskikokoinen sekarotu',
      category: 'small',
      adultWeight: {
        male: { min: 5, max: 10 },
        female: { min: 5, max: 10 }
      },
      maturityMonths: 10
    },
    {
      name: 'Medium Mix',
      nameFi: 'Keskikokoinen sekarotu',
      category: 'medium',
      adultWeight: {
        male: { min: 10, max: 25 },
        female: { min: 10, max: 25 }
      },
      maturityMonths: 12
    },
    {
      name: 'Large Mix',
      nameFi: 'Suuri sekarotu',
      category: 'large',
      adultWeight: {
        male: { min: 25, max: 40 },
        female: { min: 25, max: 40 }
      },
      maturityMonths: 15
    },
    {
      name: 'Giant Mix',
      nameFi: 'Jättikokoinen sekarotu',
      category: 'giant',
      adultWeight: {
        male: { min: 40, max: 80 },
        female: { min: 40, max: 80 }
      },
      maturityMonths: 20
    }
  ]

  // Palauta sopiva profiili painon perusteella
  if (estimatedAdultWeight < 5) return baseProfiles[0]
  if (estimatedAdultWeight < 10) return baseProfiles[1]
  if (estimatedAdultWeight < 25) return baseProfiles[2]
  if (estimatedAdultWeight < 40) return baseProfiles[3]
  return baseProfiles[4]
}

// Etsi rotuprofiili nimen perusteella
export function findBreedProfile(breedName: string): BreedProfile | undefined {
  const searchName = breedName.toLowerCase().trim()

  return FINNISH_BREED_PROFILES.find(profile =>
    profile.name.toLowerCase() === searchName ||
    profile.nameFi.toLowerCase() === searchName ||
    profile.name.toLowerCase().includes(searchName) ||
    profile.nameFi.toLowerCase().includes(searchName)
  )
}

// Palauta kaikki rodut kategorian mukaan
export function getBreedsByCategory(category: 'toy' | 'small' | 'medium' | 'large' | 'giant'): BreedProfile[] {
  return FINNISH_BREED_PROFILES.filter(profile => profile.category === category)
}

// Helper: Hae rodun kategoriatieto
export function getBreedCategoryInfo(category: 'toy' | 'small' | 'medium' | 'large' | 'giant') {
  const info = {
    toy: {
      label: 'Kääpiörodut',
      description: 'Alle 5 kg, nopea kasvu',
      icon: '🐕‍🦺',
      averageMaturity: 8
    },
    small: {
      label: 'Pienet rodut',
      description: '5-10 kg, tasainen kasvu',
      icon: '🐕',
      averageMaturity: 10
    },
    medium: {
      label: 'Keskikokoiset rodut',
      description: '10-25 kg, kohtuullinen kasvu',
      icon: '🦮',
      averageMaturity: 12
    },
    large: {
      label: 'Suuret rodut',
      description: '25-40 kg, pitkä kasvuaika',
      icon: '🦴',
      averageMaturity: 15
    },
    giant: {
      label: 'Jättirodut',
      description: 'Yli 40 kg, erittäin hidas kasvu',
      icon: '🐕‍🦺',
      averageMaturity: 20
    }
  }

  return info[category]
}