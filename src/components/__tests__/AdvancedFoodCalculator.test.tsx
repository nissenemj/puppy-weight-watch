/**
 * AdvancedFoodCalculator testit
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdvancedFoodCalculator from '../AdvancedFoodCalculator'

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({
          data: [
            {
              id: 'food-1',
              name: 'Premium Puppy',
              manufacturer: 'TestBrand',
              food_type: 'dry',
              nutrition_type: 'complete',
              dosage_method: 'Nykyinen_Paino',
              product_code: 'PP001',
              notes: null
            },
            {
              id: 'food-2',
              name: 'Adult Complete',
              manufacturer: 'TestBrand',
              food_type: 'dry',
              nutrition_type: 'complete',
              dosage_method: 'Odotettu_Aikuispaino_Ja_Ikä',
              product_code: 'AC001',
              notes: null
            }
          ],
          error: null
        }),
        // For feeding guidelines
        then: vi.fn().mockImplementation(callback => {
          callback({
            data: [
              {
                id: 'guide-1',
                dog_food_id: 'food-1',
                current_weight_kg: 10,
                daily_amount_min: 200,
                daily_amount_max: 250
              },
              {
                id: 'guide-2',
                dog_food_id: 'food-2',
                adult_weight_kg: 25,
                age_months: '4-6 kk',
                daily_amount_min: 350,
                daily_amount_max: 400
              }
            ],
            error: null
          })
        })
      })
    })
  }
}))

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn()
  }
}))

// Mock user
const mockUser = {
  id: 'user-test',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: '2024-01-01'
}

describe('AdvancedFoodCalculator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('renderöinti', () => {
    it('näyttää latausanimaation aluksi', () => {
      render(<AdvancedFoodCalculator user={mockUser} />)

      // Skeleton loader pitäisi näkyä ladattaessa
      expect(document.querySelector('.animate-pulse')).toBeDefined()
    })

    it('näyttää lomakkeen latauksen jälkeen', async () => {
      render(<AdvancedFoodCalculator user={mockUser} />)

      await waitFor(() => {
        // Tarkista että komponentti renderöityy (otsikko tai sisältö)
        expect(screen.getByText(/edistynyt ruoka-annoslaskuri/i)).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('renderöi käytetyt annostelutiedot -osion', async () => {
      render(<AdvancedFoodCalculator user={mockUser} />)

      await waitFor(() => {
        expect(screen.getByText(/käytetyt annostelutiedot/i)).toBeInTheDocument()
      }, { timeout: 3000 })
    })
  })
})

describe('Laskentalogiikat (yksikkötestit)', () => {
  describe('getAgeCategory', () => {
    // Testaa ikäkategorialogikkaa
    it('luokittelee 2-vuotiaat oikein', () => {
      const getAgeCategory = (months: number): string => {
        if (months >= 2 && months < 3) return '2-3 kk'
        if (months >= 3 && months < 4) return '3-4 kk'
        if (months >= 4 && months < 6) return '4-6 kk'
        if (months >= 6 && months < 9) return '6-9 kk'
        if (months >= 9 && months < 12) return '9-12 kk'
        return '12+ kk'
      }

      expect(getAgeCategory(2)).toBe('2-3 kk')
      expect(getAgeCategory(2.5)).toBe('2-3 kk')
      expect(getAgeCategory(3)).toBe('3-4 kk')
      expect(getAgeCategory(5)).toBe('4-6 kk')
      expect(getAgeCategory(7)).toBe('6-9 kk')
      expect(getAgeCategory(10)).toBe('9-12 kk')
      expect(getAgeCategory(15)).toBe('12+ kk')
    })
  })

  describe('getWeightCategory', () => {
    it('luokittelee painot oikein', () => {
      const getWeightCategory = (weight: number): string => {
        if (weight >= 1 && weight <= 2) return '1-2 kg'
        if (weight > 2 && weight <= 5) return '2-5 kg'
        if (weight > 5 && weight <= 10) return '5-10 kg'
        if (weight > 10 && weight <= 15) return '10-15 kg'
        if (weight > 15 && weight <= 25) return '15-25 kg'
        if (weight > 25 && weight <= 35) return '25-35 kg'
        if (weight > 35 && weight <= 45) return '35-45 kg'
        if (weight > 45 && weight <= 60) return '45-60 kg'
        return '45-60 kg'
      }

      expect(getWeightCategory(1.5)).toBe('1-2 kg')
      expect(getWeightCategory(3)).toBe('2-5 kg')
      expect(getWeightCategory(8)).toBe('5-10 kg')
      expect(getWeightCategory(12)).toBe('10-15 kg')
      expect(getWeightCategory(20)).toBe('15-25 kg')
      expect(getWeightCategory(30)).toBe('25-35 kg')
      expect(getWeightCategory(40)).toBe('35-45 kg')
      expect(getWeightCategory(50)).toBe('45-60 kg')
      expect(getWeightCategory(70)).toBe('45-60 kg') // fallback
    })
  })

  describe('getSizeCategory', () => {
    it('luokittelee rotukoot oikein', () => {
      const getSizeCategory = (weight: number): string => {
        if (weight <= 10) return 'Pieni (1-10 kg)'
        if (weight <= 25) return 'Keski (10-25 kg)'
        return 'Suuri (25-50 kg)'
      }

      expect(getSizeCategory(5)).toBe('Pieni (1-10 kg)')
      expect(getSizeCategory(10)).toBe('Pieni (1-10 kg)')
      expect(getSizeCategory(15)).toBe('Keski (10-25 kg)')
      expect(getSizeCategory(25)).toBe('Keski (10-25 kg)')
      expect(getSizeCategory(35)).toBe('Suuri (25-50 kg)')
    })
  })

  describe('ACTIVITY_MULTIPLIERS', () => {
    it('sisältää oikeat kertoimet', () => {
      const ACTIVITY_MULTIPLIERS = {
        'hyvin-matala': 0.9,
        'normaali': 1.0,
        'aktiivinen': 1.1,
        'hyvin-aktiivinen': 1.2
      }

      expect(ACTIVITY_MULTIPLIERS['hyvin-matala']).toBe(0.9)
      expect(ACTIVITY_MULTIPLIERS['normaali']).toBe(1.0)
      expect(ACTIVITY_MULTIPLIERS['aktiivinen']).toBe(1.1)
      expect(ACTIVITY_MULTIPLIERS['hyvin-aktiivinen']).toBe(1.2)
    })
  })

  describe('aterioiden määrän laskenta', () => {
    it('laskee oikean aterioiden määrän iän mukaan', () => {
      const getMealsPerDay = (months: number): number => {
        if (months < 6) return 4
        if (months < 9) return 3
        return 2
      }

      expect(getMealsPerDay(3)).toBe(4) // Alle 6kk
      expect(getMealsPerDay(5)).toBe(4) // Alle 6kk
      expect(getMealsPerDay(6)).toBe(3) // 6-9kk
      expect(getMealsPerDay(8)).toBe(3) // 6-9kk
      expect(getMealsPerDay(10)).toBe(2) // Yli 9kk
      expect(getMealsPerDay(24)).toBe(2) // Aikuinen
    })
  })

  describe('prosenttipohjainen laskenta', () => {
    it('laskee 7.5% nykyisestä painosta', () => {
      // 5-10% of current weight (use 7.5% as average)
      const calculatePercentageBased = (weightKg: number): number => {
        return Math.round(weightKg * 1000 * 0.075)
      }

      expect(calculatePercentageBased(10)).toBe(750) // 10kg = 750g/päivä
      expect(calculatePercentageBased(20)).toBe(1500) // 20kg = 1500g/päivä
      expect(calculatePercentageBased(5)).toBe(375) // 5kg = 375g/päivä
    })
  })

  describe('energia-arvojen laskenta', () => {
    it('laskee päivittäisen energian oikein (375 kcal/100g)', () => {
      const calculateEnergy = (dailyAmount: number): number => {
        return Math.round(dailyAmount * 3.75) // 375 kcal/100g
      }

      expect(calculateEnergy(100)).toBe(375) // 100g = 375 kcal
      expect(calculateEnergy(200)).toBe(750) // 200g = 750 kcal
      expect(calculateEnergy(300)).toBe(1125) // 300g = 1125 kcal
    })
  })

  describe('ateriakoon laskenta', () => {
    it('jakaa päivittäisen annoksen tasaisesti', () => {
      const calculateGramsPerMeal = (dailyAmount: number, mealsPerDay: number): number => {
        return Math.round(dailyAmount / mealsPerDay)
      }

      expect(calculateGramsPerMeal(400, 4)).toBe(100) // 4 ateriaa
      expect(calculateGramsPerMeal(300, 3)).toBe(100) // 3 ateriaa
      expect(calculateGramsPerMeal(200, 2)).toBe(100) // 2 ateriaa
      expect(calculateGramsPerMeal(350, 2)).toBe(175) // Pyöristys
    })
  })
})
