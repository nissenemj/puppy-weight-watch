---
description: Tarkista sivun tai komponentin saavutettavuus WCAG 2.1 AA -standardin mukaan
---

# Tehtävä: Saavutettavuustarkistus

## Vaaditut tiedot

Kysy tarvittaessa:
1. **Kohde**: Sivu, komponentti vai koko sovellus?
2. **Tiedostopolku** (jos yksittäinen komponentti)

## Tarkistusvaiheet

### 1. Automaattinen tarkistus

Aja Playwright-saavutettavuustestit:

```bash
npm run a11y-test
```

Tai luo uusi testi:

```typescript
// tests/a11y/[sivu].spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('[Sivu] on saavutettava', async ({ page }) => {
  await page.goto('/[polku]');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  console.log('Virheet:', results.violations);
  expect(results.violations).toEqual([]);
});
```

### 2. Semanttinen HTML -tarkistus

Tarkista:
- [ ] `<main>`, `<nav>`, `<header>`, `<footer>` käytössä
- [ ] Otsikkohierarkia looginen (h1 → h2 → h3)
- [ ] Listat `<ul>`/`<ol>` eikä div-elementtejä
- [ ] Taulukot `<table>` + `<th>` + `<caption>`

### 3. ARIA-attribuutit

Tarkista lomakkeissa:
- [ ] `aria-label` tai `aria-labelledby` interaktiivisille elementeille
- [ ] `aria-required="true"` pakollisille kentille
- [ ] `aria-invalid="true"` virheellisille kentille
- [ ] `aria-describedby` virheilmoituksille

Tarkista navigaatiossa:
- [ ] `aria-current="page"` aktiiviselle sivulle
- [ ] `aria-expanded` avattaville valikoille
- [ ] `aria-hidden="true"` dekoratiivisille ikoneille

### 4. Näppäimistönavigointi

Testaa manuaalisesti:
- [ ] Tab-järjestys on looginen
- [ ] Focus-indikaattori näkyy aina
- [ ] Enter/Space aktivoi painikkeet
- [ ] Escape sulkee modaalit
- [ ] Ei focus-loukkuja

### 5. Värikontrastit

Käytä työkalua (axe DevTools, WAVE):
- [ ] Teksti/tausta kontrasti ≥ 4.5:1
- [ ] Isot tekstit (≥18px) ≥ 3:1
- [ ] UI-komponentit ≥ 3:1
- [ ] Ei pelkkään väriin perustuvaa informaatiota

### 6. Mobiilisaavutettavuus

Tarkista:
- [ ] Touch targets ≥ 44x44px
- [ ] Teksti skaalautuu 200%
- [ ] Ei horisontaalista scrollausta
- [ ] Orientaatio ei ole lukittu

### 7. Kuvat ja media

Tarkista:
- [ ] Informatiiviset kuvat: kuvaava alt-teksti
- [ ] Dekoratiiviset kuvat: `alt=""` ja `aria-hidden="true"`
- [ ] Monimutkaiset kuvat: `aria-describedby` pitkälle kuvaukselle

## Raportti

Anna raportti muodossa:

```markdown
## Saavutettavuusraportti: [Sivu/Komponentti]

### Yhteenveto
- Automaattinen tarkistus: [X virheitä / OK]
- Kriittiset ongelmat: [määrä]
- Vakavat ongelmat: [määrä]
- Pienet ongelmat: [määrä]

### Kriittiset ongelmat (korjattava heti)
1. [Kuvaus] - [Sijainti] - [Korjausehdotus]

### Vakavat ongelmat (korjattava pian)
1. [Kuvaus] - [Sijainti] - [Korjausehdotus]

### Pienet ongelmat (korjattava mahdollisuuksien mukaan)
1. [Kuvaus] - [Sijainti] - [Korjausehdotus]

### Hyvät käytännöt (OK)
- [Lista toimivista asioista]
```

## Korjausten priorisointi

1. **Kriittinen**: Estää käytön kokonaan (ei pääse sisältöön)
2. **Vakava**: Vaikeuttaa käyttöä merkittävästi
3. **Pieni**: Heikentää käyttökokemusta mutta ei estä

## Hyödyllisiä työkaluja

- **Selain**: axe DevTools, WAVE, Lighthouse
- **Kontrasti**: Colour Contrast Analyser
- **Ruudunlukija**: NVDA (Windows), VoiceOver (Mac)
