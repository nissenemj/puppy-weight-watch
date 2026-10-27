import React, { useState, useEffect, useRef } from 'react';
import { Plus, Camera, Calendar, Award, Heart, Stethoscope } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AddMemoryDialog from './AddMemoryDialog';
import { AddHealthRecordDialog } from './AddHealthRecordDialog';

interface FloatingActionButtonProps {
  bookId: string;
  onMemoryAdded?: () => void;
  onHealthRecordAdded?: () => void;
  showDialog?: boolean;
  initialType?: 'photo' | 'text';
  onShowDialogChange?: (show: boolean) => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ 
  bookId, 
  onMemoryAdded, 
  onHealthRecordAdded,
  showDialog = false,
  initialType = 'text',
  onShowDialogChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(showDialog);
  const [healthDialogOpen, setHealthDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'photo' | 'text' | 'event' | 'milestone'>(initialType);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const openingDialogRef = useRef(false);
  const restoreFocusToTrigger = useRef(false);

  const handleActionClick = (type: 'photo' | 'text' | 'event' | 'milestone') => {
    openingDialogRef.current = true;
    restoreFocusToTrigger.current = true;
    setDialogType(type);
    setDialogOpen(true);
    setIsOpen(false);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    onShowDialogChange?.(false);
  };

  const handleHealthClick = () => {
    openingDialogRef.current = true;
    restoreFocusToTrigger.current = true;
    setHealthDialogOpen(true);
    setIsOpen(false);
  };

  const actions = [
    { icon: Camera, label: 'Lisää kuva', onClick: () => handleActionClick('photo') },
    { icon: Calendar, label: 'Lisää tapahtuma', onClick: () => handleActionClick('event') },
    { icon: Award, label: 'Lisää virstanpylväs', onClick: () => handleActionClick('milestone') },
    { icon: Heart, label: 'Lisää muisto', onClick: () => handleActionClick('text') },
    { icon: Stethoscope, label: 'Lisää terveysmerkintä', onClick: handleHealthClick },
  ];

  // An internal type change must not reset a dialog opened from the action menu.
  useEffect(() => {
    setDialogOpen(showDialog);
    if (showDialog) {
      restoreFocusToTrigger.current = false;
      setDialogType(initialType);
    }
  }, [showDialog, initialType]);

  return (
    <>
      <AddMemoryDialog
        isOpen={dialogOpen}
        onClose={handleDialogClose}
        bookId={bookId}
        type={dialogType}
        onTypeChange={setDialogType}
        returnFocusTo={restoreFocusToTrigger.current ? triggerRef : undefined}
        onMemoryAdded={() => {
          onMemoryAdded?.();
          handleDialogClose();
        }}
      />

      <AddHealthRecordDialog
        bookId={bookId}
        open={healthDialogOpen}
        onOpenChange={setHealthDialogOpen}
        returnFocusTo={triggerRef}
        onHealthRecordAdded={() => {
          onHealthRecordAdded?.();
        }}
      />

      <div className="journal-entry-launcher">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <button ref={triggerRef} type="button" className="journal-entry-trigger">
              <Plus size={20} aria-hidden="true" /> Lisää merkintä
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            aria-label="Lisää merkintä"
            className="puppy-journal journal-entry-menu"
            side="top"
            align="end"
            sideOffset={10}
            collisionPadding={16}
            onCloseAutoFocus={(event) => {
              if (openingDialogRef.current) {
                event.preventDefault();
                openingDialogRef.current = false;
              }
            }}
          >
            {actions.map(({ icon: Icon, label, onClick }) => (
              <DropdownMenuItem key={label} onSelect={onClick} className="journal-entry-item">
                <Icon size={20} aria-hidden="true" /> {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

export default FloatingActionButton;
