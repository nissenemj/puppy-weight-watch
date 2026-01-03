# Modal & Bottom Sheet -skill

## Käyttötarkoitus

Käytä tätä skilliä kun tarvitset:
- Modal-dialogin desktopilla
- Bottom sheetin mobiilissa
- Vahvistusdialogin
- Lomakkeen overlayssa

## Teknologiat

- **Framer Motion** - Animaatiot
- **shadcn/ui Dialog** - Pohjakomponentti
- **Custom BottomSheet** - Mobiili-optimoitu

## Responsiivinen lähestymistapa

Desktopilla → Modal dialog
Mobiilissa → Bottom sheet

## Bottom Sheet

### Käyttö

```typescript
import { BottomSheet, useBottomSheet } from '@/components/ui/bottom-sheet';

export function MyComponent() {
  const { isOpen, open, close } = useBottomSheet();

  return (
    <>
      <Button onClick={open}>Avaa</Button>

      <BottomSheet
        isOpen={isOpen}
        onClose={close}
        title="Otsikko"
        description="Valinnainen kuvaus"
        snapPoints={[0.5, 0.9]}
      >
        <div className="p-4">
          {/* Sisältö */}
        </div>
      </BottomSheet>
    </>
  );
}
```

### Props

```typescript
interface BottomSheetProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  snapPoints?: number[];    // [0.5, 0.9] = 50% ja 90% korkeudesta
  defaultSnap?: number;     // Indeksi snapPointsista
  title?: string;
  description?: string;
  showDragHandle?: boolean; // Oletuksena true
  enableBackdropDismiss?: boolean;
  enableDragDismiss?: boolean;
  hapticFeedback?: boolean;
}
```

### Toteutus

```typescript
// src/components/ui/bottom-sheet.tsx
import * as React from "react";
import { motion, PanInfo, useAnimation } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomSheet({
  children,
  isOpen,
  onClose,
  snapPoints = [0.5, 1],
  title,
  description,
  showDragHandle = true,
  enableBackdropDismiss = true,
  enableDragDismiss = true,
  hapticFeedback = true,
}: BottomSheetProps) {
  const controls = useAnimation();

  const triggerHaptic = React.useCallback(() => {
    if (hapticFeedback && "vibrate" in navigator) {
      navigator.vibrate(10);
    }
  }, [hapticFeedback]);

  const handleDragEnd = React.useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (!enableDragDismiss) return;

      const { offset, velocity } = info;
      const windowHeight = window.innerHeight;
      const dismissThreshold = windowHeight * 0.3;

      if (offset.y > dismissThreshold || velocity.y > 800) {
        triggerHaptic();
        onClose();
      } else {
        controls.start({ y: 0 });
      }
    },
    [controls, onClose, enableDragDismiss, triggerHaptic]
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={enableBackdropDismiss ? onClose : undefined}
      />

      {/* Sheet */}
      <motion.div
        drag={enableDragDismiss ? "y" : false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.3 }}
        onDragEnd={handleDragEnd}
        animate={controls}
        initial={{ y: "100%" }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[1150]",
          "bg-white rounded-t-3xl shadow-2xl",
          "max-h-[95vh] flex flex-col"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "sheet-title" : undefined}
      >
        {/* Drag handle */}
        {showDragHandle && (
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-neutral-400 rounded-full opacity-50" />
          </div>
        )}

        {/* Header */}
        {(title || description) && (
          <div className="px-6 py-4 border-b">
            <div className="flex items-start justify-between">
              <div>
                {title && (
                  <h2 id="sheet-title" className="text-xl font-semibold">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {description}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-neutral-100 -mr-2"
                aria-label="Sulje"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain pb-safe">
          {children}
        </div>
      </motion.div>
    </>
  );
}

// Hook
export function useBottomSheet(defaultOpen = false) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };
}
```

## Responsiivinen Modal/Sheet

```typescript
// src/components/ResponsiveDialog.tsx
import { useMediaQuery } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BottomSheet } from '@/components/ui/bottom-sheet';

interface ResponsiveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function ResponsiveDialog({
  isOpen,
  onClose,
  title,
  children,
}: ResponsiveDialogProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <BottomSheet isOpen={isOpen} onClose={onClose} title={title}>
        <div className="p-4">{children}</div>
      </BottomSheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
```

## Vahvistusdialogi

```typescript
// src/components/ConfirmDialog.tsx
import { ResponsiveDialog } from './ResponsiveDialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'default';
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Vahvista',
  cancelLabel = 'Peruuta',
  variant = 'default',
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <ResponsiveDialog isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        {variant === 'danger' && (
          <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive">{description}</p>
          </div>
        )}

        {variant !== 'danger' && (
          <p className="text-muted-foreground">{description}</p>
        )}

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'destructive' : 'default'}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Odota...' : confirmLabel}
          </Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
}
```

## Käyttöesimerkki: Poiston vahvistus

```typescript
function WeightEntryList() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleteEntry = useDeleteWeightEntry();

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteEntry.mutateAsync(deleteId);
    setDeleteId(null);
  };

  return (
    <>
      {entries.map((entry) => (
        <WeightCard
          key={entry.id}
          entry={entry}
          onDelete={() => setDeleteId(entry.id)}
        />
      ))}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Poista merkintä?"
        description="Tätä toimintoa ei voi perua."
        confirmLabel="Poista"
        variant="danger"
        isLoading={deleteEntry.isPending}
      />
    </>
  );
}
```

## Saavutettavuus

- ✅ `role="dialog"` ja `aria-modal="true"`
- ✅ `aria-labelledby` otsikkoon
- ✅ Focus trap (focus pysyy dialogissa)
- ✅ Escape sulkee dialogin
- ✅ Backdrop-klikkaus sulkee
- ✅ Haptic feedback mobiilissa
