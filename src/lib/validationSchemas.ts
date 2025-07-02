
import { z } from 'zod'

// Weight entry validation
export const WeightEntrySchema = z.object({
  weight: z.number()
    .min(0.1, "Painon tulee olla vähintään 0.1 kg")
    .max(100, "Painon tulee olla alle 100 kg")
    .refine((val) => Number((val * 10).toFixed(0)) / 10 === val, 
      "Paino voi olla korkeintaan yhden desimaalin tarkkuudella"),
  date: z.string().min(1, "Päivämäärä on pakollinen")
})

// Dog profile validation
export const DogProfileSchema = z.object({
  name: z.string()
    .min(1, "Nimi on pakollinen")
    .max(50, "Nimi saa olla korkeintaan 50 merkkiä")
    .regex(/^[a-zA-ZäöåÄÖÅ\s-]+$/, "Nimi saa sisältää vain kirjaimia, välilyöntejä ja viivoja"),
  weight_kg: z.number()
    .min(0.1, "Painon tulee olla vähintään 0.1 kg")
    .max(100, "Painon tulee olla alle 100 kg")
    .optional(),
  age_years: z.number()
    .min(0, "Ikä ei voi olla negatiivinen")
    .max(25, "Ikä ei voi olla yli 25 vuotta")
    .optional(),
  activity_level: z.enum(['low', 'medium', 'high']).optional(),
  breed: z.string().max(100, "Rotu saa olla korkeintaan 100 merkkiä").optional()
})

// Password validation
export const PasswordSchema = z.string()
  .min(8, "Salasanan tulee olla vähintään 8 merkkiä")
  .regex(/[A-Z]/, "Salasanassa tulee olla vähintään yksi iso kirjain")
  .regex(/[a-z]/, "Salasanassa tulee olla vähintään yksi pieni kirjain")
  .regex(/[0-9]/, "Salasanassa tulee olla vähintään yksi numero")
  .regex(/[^A-Za-z0-9]/, "Salasanassa tulee olla vähintään yksi erikoismerkki")

// Email validation
export const EmailSchema = z.string()
  .email("Sähköpostiosoite ei ole kelvollinen")
  .min(1, "Sähköpostiosoite on pakollinen")

// Authentication schemas
export const LoginSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, "Salasana on pakollinen")
})

export const RegisterSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Salasanat eivät täsmää",
  path: ["confirmPassword"]
})

// Food calculator validation
export const FoodCalculatorSchema = z.object({
  weight: z.number()
    .min(0.1, "Painon tulee olla vähintään 0.1 kg")
    .max(100, "Painon tulee olla alle 100 kg"),
  age: z.enum(['puppy', 'adult', 'senior']),
  activityLevel: z.enum(['low', 'moderate', 'high']),
  foodType: z.enum(['dry', 'wet']),
  customCalories: z.number()
    .min(50, "Kalorimäärän tulee olla vähintään 50 kcal/100g")
    .max(600, "Kalorimäärän tulee olla alle 600 kcal/100g")
    .optional()
})

// Smart weight validation that checks against previous measurements
export const validateWeightChange = (newWeight: number, previousWeights: Array<{weight: number, date: string}>) => {
  if (previousWeights.length === 0) return { isValid: true }
  
  const lastWeight = previousWeights[previousWeights.length - 1]
  const weightChange = Math.abs(newWeight - lastWeight.weight)
  const weightChangePercent = (weightChange / lastWeight.weight) * 100
  
  // Flag significant changes (more than 20% from last measurement)
  if (weightChangePercent > 20) {
    return {
      isValid: false,
      warning: `Uusi paino (${newWeight} kg) poikkeaa merkittävästi edellisestä mittauksesta (${lastWeight.weight} kg). Tarkista, että paino on oikein.`
    }
  }
  
  return { isValid: true }
}

export type WeightEntry = z.infer<typeof WeightEntrySchema>
export type DogProfile = z.infer<typeof DogProfileSchema>
export type LoginData = z.infer<typeof LoginSchema>
export type RegisterData = z.infer<typeof RegisterSchema>
export type FoodCalculatorData = z.infer<typeof FoodCalculatorSchema>
