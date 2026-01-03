---
description: Aja testit ja varmista koodin laatu ennen committia
---

# Tehtävä: Testaa ja varmista

## Pikatarkistus

Aja kaikki tarkistukset:

```bash
npm run lint && npm run type-check && npm run test
```

## Yksityiskohtaiset vaiheet

### 1. TypeScript-tarkistus

```bash
npm run type-check
```

**Tavoite**: 0 virhettä

Yleiset virheet:
- `any`-tyypit → Määritä oikea tyyppi
- Puuttuvat propsit → Lisää interface
- Undefined-arvot → Käytä optional chaining `?.`

### 2. ESLint

```bash
npm run lint
```

**Tavoite**: 0 virhettä, 0 varoitusta

Automaattinen korjaus:
```bash
npm run lint -- --fix
```

### 3. Formatointi

```bash
npm run format:check
```

Korjaa:
```bash
npm run format
```

### 4. Yksikkötestit

```bash
npm run test
```

Watch-mode kehityksessä:
```bash
npm run test:watch
```

Yksittäinen testi:
```bash
npm run test src/components/__tests__/WeightChart.test.tsx
```

### 5. E2E-testit

```bash
npm run test:e2e
```

Yksittäinen testi:
```bash
npm run test:e2e tests/e2e/weight-tracking.spec.ts
```

UI-tilassa (debuggaukseen):
```bash
npx playwright test --ui
```

### 6. Saavutettavuustestit

```bash
npm run a11y-test
```

### 7. Mobiilitarkistus

```bash
npm run mobile-check
```

Tai manuaalisesti Chrome DevToolsissa:
- iPhone SE (320px)
- iPad (768px)
- Desktop (1024px+)

Tarkista:
- [ ] Ei horisontaalista scrollia
- [ ] Touch targets 44x44px
- [ ] Teksti luettavaa

### 8. Build-tarkistus

```bash
npm run build
```

**Tavoite**: Build onnistuu ilman virheitä

## Yhteenvetoraportti

Aja ja raportoi:

```bash
echo "=== TypeScript ===" && npm run type-check
echo "=== ESLint ===" && npm run lint
echo "=== Tests ===" && npm run test
echo "=== Build ===" && npm run build
```

## Ennen PR:ää

Varmista:
- [ ] TypeScript: 0 virhettä
- [ ] ESLint: 0 virhettä
- [ ] Testit: Kaikki läpi
- [ ] Build: Onnistuu
- [ ] Mobiili: Ei horisontaalista scrollia

## Pikakomento

Lisää `package.json`:iin:

```json
{
  "scripts": {
    "verify": "npm run lint && npm run type-check && npm run test && npm run build"
  }
}
```

Käytä:
```bash
npm run verify
```
