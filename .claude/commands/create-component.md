---
description: Luo uusi React-komponentti projektin standardien mukaan
---

# Tehtävä: Luo uusi React-komponentti

## Vaaditut tiedot käyttäjältä

Kysy:
1. **Komponentin nimi** (PascalCase, esim. "WeightCard")
2. **Tyyppi**: UI-komponentti vai feature-komponentti?
3. **Tarvitseeko dataa?** (React Query hook)
4. **Onko lomake?** (React Hook Form + Zod)

## Komponentin sijainti

- **UI-komponentit**: `src/components/ui/`
- **Feature-komponentit**: `src/components/` tai `src/components/[feature]/`
- **Sivut**: `src/pages/`

## Toteutus

### 1. Valitse oikea skill

```bash
# Lomake
cat .claude/skills/components/form-builder.md

# Muut komponentit
# Käytä tätä pohjaa
```

### 2. Luo komponentti

```typescript
// src/components/[Nimi].tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

interface [Nimi]Props {
  // Pakolliset propsit
  id: string;

  // Valinnaiset propsit
  className?: string;
  onAction?: () => void;
}

export const [Nimi]: React.FC<[Nimi]Props> = ({
  id,
  className,
  onAction,
}) => {
  return (
    <div
      className={cn(
        "base-styles-here",
        className
      )}
      role="region"
      aria-label="[Kuvaus]"
    >
      {/* Sisältö */}
    </div>
  );
};

[Nimi].displayName = '[Nimi]';
```

### 3. Saavutettavuus

Muista:
- [ ] Semanttiset HTML-elementit (`button`, `nav`, `main`, `article`)
- [ ] `aria-label` interaktiivisille elementeille
- [ ] Keyboard-navigointi (`onKeyDown` Enter/Space)
- [ ] Focus-tilat näkyvät
- [ ] Touch targets 44x44px mobiilissa

### 4. Responsiivisuus

```typescript
// Mobile-first
<div className="
  px-4 md:px-6          // Padding
  text-sm md:text-base  // Tekstikoko
  grid-cols-1 md:grid-cols-2  // Grid
">
```

### 5. TypeScript

- [ ] Kaikki propsit tyypitetty interfacessa
- [ ] Ei `any`-tyyppejä
- [ ] Export tyyppi jos käytetään muualla

```typescript
export type { [Nimi]Props };
```

### 6. Testit (valinnainen mutta suositeltava)

```typescript
// src/components/__tests__/[Nimi].test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { [Nimi] } from '../[Nimi]';

describe('[Nimi]', () => {
  it('renderöityy oikein', () => {
    render(<[Nimi] id="test" />);
    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  it('toimii näppäimistöllä', () => {
    const onAction = vi.fn();
    render(<[Nimi] id="test" onAction={onAction} />);

    const element = screen.getByRole('button');
    fireEvent.keyDown(element, { key: 'Enter' });
    expect(onAction).toHaveBeenCalled();
  });
});
```

## Tarkistuslista

- [ ] TypeScript-tyypit kunnossa
- [ ] Saavutettavuus huomioitu (ARIA, keyboard)
- [ ] Responsiivinen (mobile-first)
- [ ] Touch targets 44x44px
- [ ] Focus-tilat näkyvät
- [ ] Ei `any`-tyyppejä
- [ ] Nimeäminen johdonmukainen projektin kanssa

## Esimerkkejä projektista

Katso mallia näistä:
- `src/components/ui/button.tsx` - shadcn/ui painike
- `src/components/ui/card.tsx` - shadcn/ui kortti
- `src/components/WeightChart.tsx` - Data-visualisointi
- `src/components/DogSelector.tsx` - Valitsin-komponentti
