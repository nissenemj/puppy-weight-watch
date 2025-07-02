
import Tesseract from 'tesseract.js'

export interface GuideEntry {
  weightMin: number
  weightMax: number
  amountMin: number
  amountMax: number
}

export class OCRService {
  static async recognizeText(imageDataUrl: string): Promise<string> {
    const { data: { text } } = await Tesseract.recognize(
      imageDataUrl,
      'fin+eng', // Käytä sekä suomen että englannin kieltä
      {
        logger: m => console.log(m) // Debuggausta varten
      }
    )
    return text
  }

  static parseNutritionInfo(text: string): {
    calories?: string
    protein?: string
    fat?: string
  } {
    const cleanedText = text.toLowerCase().replace(/,/g, '.')
    
    const patterns = {
      calories: /(?:energiaa?|kalorit?|kcal|energy)\s*[:\s]*(\d{3,4})/i,
      protein: /(?:proteiini|valkuais|protein)\s*[:\s]*(\d{1,2}(?:\.\d{1,2})?)/i,
      fat: /(?:rasva|rasvaa|fat)\s*[:\s]*(\d{1,2}(?:\.\d{1,2})?)/i,
    }

    const getMatch = (pattern: RegExp) => {
      const match = cleanedText.match(pattern)
      return match ? match[1] : undefined
    }
    
    return {
      calories: getMatch(patterns.calories),
      protein: getMatch(patterns.protein),
      fat: getMatch(patterns.fat)
    }
  }

  static parseFeedingGuide(text: string): GuideEntry[] | null {
    const guide: GuideEntry[] = []
    const lines = text.split('\n')

    // RegEx-lausekkeet eri annostelutaulukkomuotojen tunnistamiseen
    const patterns = [
      // Esim: "10-15kg 150-200g" tai "10 - 15 kg ... 150 - 200 g"
      /(\d+)\s*-\s*(\d+)\s*kg.*?(\d+)\s*-\s*(\d+)\s*g/i,
      // Esim: "10kg 150g" tai "10 kg ... 150 g"
      /(\d+)\s*kg.*?(\d+)\s*g/i,
      // Esim: "5-10 kg: 100-150 g"
      /(\d+)\s*-\s*(\d+)\s*kg\s*[:]\s*(\d+)\s*-\s*(\d+)\s*g/i,
      // Esim: "Weight 5kg Amount 100g"
      /(?:weight|paino).*?(\d+)\s*kg.*?(?:amount|määrä).*?(\d+)\s*g/i,
    ]

    for (const line of lines) {
      const cleanLine = line.replace(/[,]/g, '.').trim()
      if (cleanLine.length < 5) continue // Ohita liian lyhyet rivit

      for (const pattern of patterns) {
        const match = cleanLine.match(pattern)
        if (match) {
          if (match.length === 5) { // Painoväli ja annosväli
            const weightMin = parseFloat(match[1])
            const weightMax = parseFloat(match[2])
            const amountMin = parseFloat(match[3])
            const amountMax = parseFloat(match[4])
            
            if (weightMin > 0 && weightMax > weightMin && amountMin > 0 && amountMax >= amountMin) {
              guide.push({ weightMin, weightMax, amountMin, amountMax })
            }
          } else if (match.length === 3) { // Yksittäinen paino ja annos
            const weight = parseFloat(match[1])
            const amount = parseFloat(match[2])
            
            if (weight > 0 && amount > 0) {
              guide.push({
                weightMin: weight,
                weightMax: weight,
                amountMin: amount,
                amountMax: amount,
              })
            }
          }
          break // Siirry seuraavaan riviin kun osuma löytyi
        }
      }
    }

    return guide.length > 0 ? guide : null
  }

  static calculateFromGuide(guide: GuideEntry[], puppyWeight: number): number | null {
    if (!guide || guide.length === 0) return null

    // 1. Etsi tarkka osuma
    for (const entry of guide) {
      if (puppyWeight >= entry.weightMin && puppyWeight <= entry.weightMax) {
        if (entry.weightMin === entry.weightMax) return entry.amountMin
        
        const weightRange = entry.weightMax - entry.weightMin
        const amountRange = entry.amountMax - entry.amountMin
        const weightRatio = (puppyWeight - entry.weightMin) / weightRange
        return Math.round(entry.amountMin + (weightRatio * amountRange))
      }
    }

    // 2. Interpoloi kahden rivin väliltä
    const sortedGuide = [...guide].sort((a, b) => a.weightMin - b.weightMin)
    for (let i = 0; i < sortedGuide.length - 1; i++) {
      const entry1 = sortedGuide[i]
      const entry2 = sortedGuide[i + 1]
      
      if (puppyWeight > entry1.weightMax && puppyWeight < entry2.weightMin) {
        const avgWeight1 = (entry1.weightMin + entry1.weightMax) / 2
        const avgAmount1 = (entry1.amountMin + entry1.amountMax) / 2
        const avgWeight2 = (entry2.weightMin + entry2.weightMax) / 2
        const avgAmount2 = (entry2.amountMin + entry2.amountMax) / 2

        const weightDiff = avgWeight2 - avgWeight1
        const amountDiff = avgAmount2 - avgAmount1
        const ratio = (puppyWeight - avgWeight1) / weightDiff
        
        return Math.round(avgAmount1 + (ratio * amountDiff))
      }
    }

    return null
  }
}
