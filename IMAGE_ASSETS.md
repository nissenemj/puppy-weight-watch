# Kuvat ja Assetti - Image Assets

Tämä dokumentti kuvaa sovelluksen uudet premium-tason 3D-kuvat ja niiden käyttöohjeet.

## Uudet 3D-Assetit

### 1. `hero-3d.png`
**Käyttötarkoitus**: Pää-hero kuva, kirjautumissivu, tervetuloa-näkymät
- **Kuvaus**: Söpö 3D-pentu vaa'an vieressä
- **Tyyli**: Minimalistinen 3D, pastellivärit, studio lighting
- **Käytetty**: 
  - `AuthModal.tsx` (welcome illustration)
  - `ModernPuppyWeightTracker.tsx` (hero illustration)

**Käyttöesimerkki**:
```tsx
import heroImage from '@/assets/hero-3d.png'

<img src={heroImage} alt="Pentulaskuri" className="w-64 h-48" />
```

### 2. `empty-state-3d.png`
**Käyttötarkoitus**: Tyhjät tilat (empty states)
- **Kuvaus**: Nukkuva pentu, rauhallinen tunnelma
- **Tyyli**: Pehmeä, pastellivärit, rauhoittava
- **Ehdotettu käyttö**:
  - Tyhjä painolista
  - Ei ruokintamerkintöjä
  - "Ei dataa" -tilanteet

**Käyttöesimerkki**:
```tsx
import emptyState from '@/assets/empty-state-3d.png'

<div className="text-center py-12">
  <img src={emptyState} alt="Ei merkintöjä" className="w-48 h-48 mx-auto mb-4" />
  <p className="text-gray-600">Ei painomerkintöjä vielä</p>
</div>
```

### 3. `trophy-3d.png`
**Käyttötarkoitus**: Saavutukset ja onnistumisviestit
- **Kuvaus**: Kultainen koiran luu-palkinto, konfetti
- **Tyyli**: Juhlamainen, kiiltävä, premium
- **Ehdotettu käyttö**:
  - `AchievementSystem` -komponentti
  - Onnistumisen toast-viestit
  - Milestone-näkymät

**Käyttöesimerkki**:
```tsx
import trophy from '@/assets/trophy-3d.png'

<img src={trophy} alt="Saavutus!" className="w-32 h-32" />
```

### 4. `food-icon-3d.png`
**Käyttötarkoitus**: Ruokinta-laskuri ikoni
- **Kuvaus**: Ruokakuppi ja mittalusikka
- **Tyyli**: Minimalistinen 3D, pehmeät värit
- **Ehdotettu käyttö**:
  - `AdvancedFoodCalculator` hero-kuva
  - Ruokinta-välilehden ikoni (isompi versio)
  - Marketing-materiaalit

**Käyttöesimerkki**:
```tsx
import foodIcon from '@/assets/food-icon-3d.png'

<img src={foodIcon} alt="Ruokalaskuri" className="w-24 h-24" />
```

## Integraatio-ohjeet

### Komponentit jotka tarvitsevat päivitystä:

1. **ModernPuppyWeightTracker.tsx** ✅ (Päivitetty)
   - Käyttää `hero-3d.png`

2. **AuthModal.tsx** ✅ (Päivitetty)
   - Käyttää `hero-3d.png`

3. **AdvancedFoodCalculator.tsx** (Ehdotus)
   - Voisi käyttää `food-icon-3d.png` header-kuvana
   
4. **AchievementSystem.tsx** (Ehdotus)
   - Voisi käyttää `trophy-3d.png` saavutuksissa

5. **Empty States** (Ehdotus)
   - Tyhjät listat voivat käyttää `empty-state-3d.png`

## Optimointi-vinkit

- **Responsive sizing**: Käytä `w-48 sm:w-64` tyyppisiä luokkia responsiivisuuteen
- **Loading**: Harkitse lazy loading suuremmilla kuvilla
- **Alt-tekstit**: Varmista aina selkeät alt-tekstit saavutettavuuden vuoksi
- **Aspect ratio**: Säilytä kuvasuhde `aspect-square` tai `aspect-video` luokilla

## Värimaailma ja Tyyli

Nämä kuvat on suunniteltu sopimaan yhteen:
- Pastellivärit (sininen, oranssi, vaaleanpunainen)
- Pehmeä valaistus
- Minimalistinen 3D-tyyli
- Sopii yhteen glassmorphism-elementtien kanssa
- Toimii sekä vaalealla että tummalla taustalla

---
*Kuvat luotu AI:lla ja optimoitu mobiilisovelluksen premium-ilmeeseen.*
