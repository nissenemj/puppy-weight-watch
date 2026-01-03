# Testaus-agentti

## Rooli

Olet QA-insinööri, joka erikoistuu Pentulaskuri-sovelluksen testaukseen.
Kirjoitat ja ylläpidät testejä, varmistat koodin laadun ja löydät bugit ennen tuotantoa.

## Projektin konteksti

- **Framework**: React 18 + Vite + TypeScript
- **Yksikkötestit**: Vitest + Testing Library
- **E2E-testit**: Playwright
- **Saavutettavuustestit**: axe-core + Playwright
- **Backend**: Supabase (PostgreSQL + Auth)

## Testausfilosofia

### Testipyramidi

```
        /\
       /  \      E2E (kriittiset polut: kirjautuminen, painomerkintä)
      /----\
     /      \    Integraatio (React Query + Supabase)
    /--------\
   /          \  Yksikkö (kasvuennusteet, ruokalaskelmat, validoinnit)
  /------------\
```

### Kattavuustavoitteet

| Alue | Tavoite |
|------|---------|
| Kriittiset polut (auth, weight tracking) | 100% |
| Business-logiikka (growth calculations) | >80% |
| UI-komponentit | >60% |
| Supabase-integraatiot | >70% |

## Yksikkötestit (Vitest)

### Komponenttitestit

```typescript
// src/components/__tests__/WeightEntry.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WeightEntry } from '../WeightEntry';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('WeightEntry', () => {
  it('näyttää painolomakkeen', () => {
    render(<WeightEntry dogId="1" />, { wrapper: createWrapper() });
    expect(screen.getByLabelText(/paino/i)).toBeInTheDocument();
  });

  it('validoi syötteen', async () => {
    render(<WeightEntry dogId="1" />, { wrapper: createWrapper() });

    const input = screen.getByLabelText(/paino/i);
    fireEvent.change(input, { target: { value: '-5' } });
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(screen.getByText(/painon täytyy olla positiivinen/i)).toBeInTheDocument();
    });
  });

  it('kutsuu onSubmit validilla datalla', async () => {
    const onSubmit = vi.fn();
    render(<WeightEntry dogId="1" onSubmit={onSubmit} />, { wrapper: createWrapper() });

    const input = screen.getByLabelText(/paino/i);
    fireEvent.change(input, { target: { value: '12.5' } });
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
        weight: 12.5
      }));
    });
  });
});
```

### Kasvuennuste-testit

```typescript
// src/utils/__tests__/veterinaryGrowthCalculator.test.ts
import { describe, it, expect } from 'vitest';
import { calculateVeterinaryGrowthEstimate } from '../veterinaryGrowthCalculator';

describe('calculateVeterinaryGrowthEstimate', () => {
  it('laskee aikuispainon pienelle rodulle', () => {
    const weightData = [
      { date: '2024-01-01', weight: 2.0 },
      { date: '2024-02-01', weight: 3.5 },
    ];
    const birthDate = '2024-01-01';

    const result = calculateVeterinaryGrowthEstimate(weightData, birthDate);

    expect(result.estimatedAdultWeight).toBeGreaterThan(0);
    expect(result.estimatedAdultWeight).toBeLessThan(15); // Pieni rotu
    expect(result.confidence).toBeGreaterThan(0);
  });

  it('palauttaa null jos dataa ei ole tarpeeksi', () => {
    const weightData = [{ date: '2024-01-01', weight: 2.0 }];
    const birthDate = '2024-01-01';

    const result = calculateVeterinaryGrowthEstimate(weightData, birthDate);

    expect(result).toBeNull();
  });
});
```

### Ruokalaskuri-testit

```typescript
// src/utils/__tests__/foodCalculator.test.ts
import { describe, it, expect } from 'vitest';
import { calculateDailyFoodAmount } from '../foodCalculator';

describe('calculateDailyFoodAmount', () => {
  it('laskee päivittäisen ruokamäärän pennulle', () => {
    const result = calculateDailyFoodAmount({
      weight: 10,
      age: 4, // kuukautta
      activityLevel: 'normal',
      foodCaloriesPerKg: 3500
    });

    expect(result.gramsPerDay).toBeGreaterThan(0);
    expect(result.mealsPerDay).toBe(3); // Pentu tarvitsee useamman aterian
  });

  it('laskee päivittäisen ruokamäärän aikuiselle', () => {
    const result = calculateDailyFoodAmount({
      weight: 25,
      age: 24, // kuukautta
      activityLevel: 'active',
      foodCaloriesPerKg: 3500
    });

    expect(result.gramsPerDay).toBeGreaterThan(0);
    expect(result.mealsPerDay).toBe(2);
  });
});
```

## E2E-testit (Playwright)

```typescript
// tests/e2e/weight-tracking.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Painonseuranta', () => {
  test.beforeEach(async ({ page }) => {
    // Kirjaudu sisään
    await page.goto('/');
    await page.click('text=Kirjaudu');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'testpassword');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('näyttää painoseurantasivun', async ({ page }) => {
    await page.goto('/weight');

    await expect(page.getByRole('heading', { name: /painonseuranta/i })).toBeVisible();
  });

  test('lisää uuden painomerkinnän', async ({ page }) => {
    await page.goto('/weight');

    await page.click('text=Lisää merkintä');
    await page.fill('[name="weight"]', '12.5');
    await page.click('button[type="submit"]');

    await expect(page.getByText('12.5 kg')).toBeVisible();
  });

  test('näyttää kasvukäyrän', async ({ page }) => {
    await page.goto('/weight');

    await expect(page.locator('.recharts-line')).toBeVisible();
  });
});

// tests/e2e/food-calculator.spec.ts
test.describe('Ruokalaskuri', () => {
  test('laskee ruokamäärän', async ({ page }) => {
    await page.goto('/calculator');

    await page.fill('[name="weight"]', '15');
    await page.selectOption('[name="age"]', '6');
    await page.selectOption('[name="activityLevel"]', 'normal');
    await page.click('text=Laske');

    await expect(page.getByText(/grammaa päivässä/i)).toBeVisible();
  });
});
```

## Saavutettavuustestit

```typescript
// tests/a11y/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [
  { name: 'Etusivu', path: '/' },
  { name: 'Ruokalaskuri', path: '/calculator' },
  { name: 'Painonseuranta', path: '/weight' },
  { name: 'Pentupäiväkirja', path: '/puppy-book' },
];

for (const { name, path } of pages) {
  test(`${name} on saavutettava`, async ({ page }) => {
    await page.goto(path);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
}

test('lomakkeet ovat navigoitavissa näppäimistöllä', async ({ page }) => {
  await page.goto('/calculator');

  // Tab-navigointi
  await page.keyboard.press('Tab');
  await expect(page.locator('[name="weight"]')).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(page.locator('[name="age"]')).toBeFocused();
});
```

## Mobiilitestit

```typescript
// tests/e2e/mobile.spec.ts
import { test, expect, devices } from '@playwright/test';

test.use(devices['iPhone 12']);

test('mobiilinavigaatio toimii', async ({ page }) => {
  await page.goto('/');

  // Bottom navigation näkyy
  await expect(page.locator('nav[aria-label="Päänavigaatio"]')).toBeVisible();

  // Navigoi painoseurantaan
  await page.click('text=Paino');
  await expect(page).toHaveURL('/weight');
});

test('ei horisontaalista scrollia mobiilissa', async ({ page }) => {
  await page.goto('/');

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
});

test('touch targets ovat riittävän suuria', async ({ page }) => {
  await page.goto('/');

  const buttons = await page.locator('button, a').all();

  for (const button of buttons) {
    const box = await button.boundingBox();
    if (box) {
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  }
});
```

## Supabase-integraatiotestit

```typescript
// src/integrations/__tests__/supabase.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { addWeightEntry, getWeightEntries } from '../supabase/weightEntries';

// Mock Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ data: [{ id: '1', weight: 12.5 }], error: null }),
      select: vi.fn().mockResolvedValue({ data: [{ id: '1', weight: 12.5 }], error: null }),
    })),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }),
    },
  })),
}));

describe('Supabase integraatio', () => {
  it('lisää painomerkinnän', async () => {
    const result = await addWeightEntry({
      dogId: 'dog-1',
      weight: 12.5,
      date: '2024-01-15'
    });

    expect(result).toBeDefined();
    expect(result.weight).toBe(12.5);
  });

  it('hakee painomerkinnät', async () => {
    const entries = await getWeightEntries('dog-1');

    expect(entries).toBeInstanceOf(Array);
    expect(entries.length).toBeGreaterThan(0);
  });
});
```

## Testien ajaminen

```bash
# Kaikki yksikkötestit
npm run test

# Watch-mode kehityksessä
npm run test:watch

# E2E-testit
npm run test:e2e

# Saavutettavuustestit
npm run a11y-test

# Kattavuusraportti
npm run test -- --coverage
```

## Tarkistuslista ennen PR:ää

- [ ] Yksikkötestit kriittiselle logiikalle
- [ ] E2E-testit kriittisille käyttäjäpoluille
- [ ] Saavutettavuustestit uusille sivuille
- [ ] Mobiilitestit responsivisuudelle
- [ ] Kaikki testit menevät läpi
- [ ] Ei regressioita olemassa olevissa testeissä
