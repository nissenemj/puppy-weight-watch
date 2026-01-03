# Form Builder -skill

## Käyttötarkoitus

Käytä tätä skilliä kun tarvitset:
- Lomakkeen validoinnilla
- React Hook Form + Zod -yhdistelmän
- Saavutettavan lomakkeen virheilmoituksilla
- Supabase-integraation lomakkeelle

## Teknologiat

- **React Hook Form** - Lomakkeiden hallinta
- **Zod** - Validointi
- **@hookform/resolvers** - Zod-integraatio
- **shadcn/ui** - UI-komponentit
- **Supabase** - Tietokantatallennukset

## Perusrakenne

### 1. Zod-skeema

```typescript
// src/lib/validation/weightEntry.ts
import { z } from 'zod';

export const weightEntrySchema = z.object({
  weight: z
    .number({ required_error: 'Paino on pakollinen' })
    .positive('Painon täytyy olla positiivinen')
    .max(200, 'Paino on liian suuri'),
  date: z
    .string({ required_error: 'Päivämäärä on pakollinen' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Virheellinen päivämäärä'),
  notes: z
    .string()
    .max(500, 'Muistiinpanot voivat olla enintään 500 merkkiä')
    .optional(),
});

export type WeightEntryInput = z.infer<typeof weightEntrySchema>;

// Muokkausskeema - kaikki kentät valinnaisia paitsi id
export const updateWeightEntrySchema = weightEntrySchema.partial().extend({
  id: z.string().uuid(),
});

export type UpdateWeightEntryInput = z.infer<typeof updateWeightEntrySchema>;
```

### 2. Lomakekomponentti

```typescript
// src/components/WeightEntryForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import {
  weightEntrySchema,
  type WeightEntryInput,
} from '@/lib/validation/weightEntry';

interface WeightEntryFormProps {
  dogId: string;
  defaultValues?: Partial<WeightEntryInput>;
  onSubmit: (data: WeightEntryInput) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export function WeightEntryForm({
  dogId,
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = 'Tallenna',
}: WeightEntryFormProps) {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<WeightEntryInput>({
    resolver: zodResolver(weightEntrySchema),
    defaultValues: {
      weight: undefined,
      date: new Date().toISOString().split('T')[0],
      notes: '',
      ...defaultValues,
    },
  });

  const handleFormSubmit = async (data: WeightEntryInput) => {
    try {
      setError(null);
      await onSubmit(data);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Jokin meni pieleen');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6"
      noValidate
      aria-label="Painomerkintälomake"
    >
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {/* Paino */}
        <div>
          <Label htmlFor="weight">
            Paino (kg) <span aria-hidden="true" className="text-destructive">*</span>
            <span className="sr-only">(pakollinen)</span>
          </Label>
          <Input
            id="weight"
            type="number"
            step="0.1"
            min="0"
            max="200"
            placeholder="12.5"
            aria-required="true"
            aria-invalid={errors.weight ? 'true' : 'false'}
            aria-describedby={errors.weight ? 'weight-error' : 'weight-hint'}
            className="mt-1.5"
            {...register('weight', { valueAsNumber: true })}
          />
          <p id="weight-hint" className="text-sm text-muted-foreground mt-1">
            Käytä yhtä desimaalia, esim. 12.5
          </p>
          {errors.weight && (
            <p id="weight-error" role="alert" className="text-sm text-destructive mt-1 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.weight.message}
            </p>
          )}
        </div>

        {/* Päivämäärä */}
        <div>
          <Label htmlFor="date">
            Päivämäärä <span aria-hidden="true" className="text-destructive">*</span>
            <span className="sr-only">(pakollinen)</span>
          </Label>
          <Input
            id="date"
            type="date"
            aria-required="true"
            aria-invalid={errors.date ? 'true' : 'false'}
            aria-describedby={errors.date ? 'date-error' : undefined}
            className="mt-1.5"
            {...register('date')}
          />
          {errors.date && (
            <p id="date-error" role="alert" className="text-sm text-destructive mt-1 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.date.message}
            </p>
          )}
        </div>

        {/* Muistiinpanot */}
        <div>
          <Label htmlFor="notes">Muistiinpanot</Label>
          <Textarea
            id="notes"
            placeholder="Lisätietoja mittauksesta..."
            aria-invalid={errors.notes ? 'true' : 'false'}
            aria-describedby={errors.notes ? 'notes-error' : 'notes-hint'}
            className="mt-1.5"
            {...register('notes')}
          />
          <p id="notes-hint" className="text-sm text-muted-foreground mt-1">
            Valinnainen, max 500 merkkiä
          </p>
          {errors.notes && (
            <p id="notes-error" role="alert" className="text-sm text-destructive mt-1 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.notes.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-h-[44px]"
        >
          {isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          )}
          {submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="min-h-[44px]"
          >
            Peruuta
          </Button>
        )}
      </div>
    </form>
  );
}
```

### 3. Käyttö React Queryn kanssa

```typescript
// src/hooks/useWeightEntry.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { WeightEntryInput } from '@/lib/validation/weightEntry';

export function useAddWeightEntry(dogId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: WeightEntryInput) => {
      const { data: result, error } = await supabase
        .from('weight_entries')
        .insert({
          dog_id: dogId,
          weight: data.weight,
          date: data.date,
          notes: data.notes,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weightEntries', dogId] });
      toast({
        title: 'Tallennettu!',
        description: 'Painomerkintä lisätty onnistuneesti.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Virhe',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
```

### 4. Käyttö sivulla

```typescript
// src/pages/WeightTrackerPage.tsx
import { WeightEntryForm } from '@/components/WeightEntryForm';
import { useAddWeightEntry } from '@/hooks/useWeightEntry';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { BottomSheet } from '@/components/ui/bottom-sheet';

export default function WeightTrackerPage() {
  const [showForm, setShowForm] = useState(false);
  const addEntry = useAddWeightEntry(selectedDogId);

  const handleSubmit = async (data: WeightEntryInput) => {
    await addEntry.mutateAsync(data);
    setShowForm(false);
  };

  return (
    <div>
      <Button onClick={() => setShowForm(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Lisää merkintä
      </Button>

      <BottomSheet
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Lisää painomerkintä"
      >
        <WeightEntryForm
          dogId={selectedDogId}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      </BottomSheet>
    </div>
  );
}
```

## Edistyneet ominaisuudet

### Asynkroninen validointi

```typescript
// Tarkista onko päivämäärä tulevaisuudessa
const schema = z.object({
  date: z
    .string()
    .refine(
      (date) => new Date(date) <= new Date(),
      { message: 'Päivämäärä ei voi olla tulevaisuudessa' }
    ),
});
```

### Ehdollinen validointi

```typescript
// Muistiinpanot pakollisia jos paino on epätavallinen
const schema = z.object({
  weight: z.number().positive(),
  notes: z.string().optional(),
}).refine(
  (data) => {
    if (data.weight > 50) {
      return data.notes && data.notes.length > 0;
    }
    return true;
  },
  {
    message: 'Lisää muistiinpano epätavalliselle painolle',
    path: ['notes'],
  }
);
```

## Saavutettavuus

- ✅ `noValidate` lomakkeessa (käytetään JS-validointia)
- ✅ `aria-describedby` virheilmoituksille
- ✅ `aria-invalid` virheellisille kentille
- ✅ `aria-required` pakollisille kentille
- ✅ Virheet näytetään `role="alert"`
- ✅ Touch targets 44x44px
- ✅ Input font-size 16px (estää iOS zoomin)

## Riippuvuudet

Projektissa jo asennettuna:
- react-hook-form
- @hookform/resolvers
- zod
