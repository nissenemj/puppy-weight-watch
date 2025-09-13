import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Camera, Calendar, Award, Heart, X, Stethoscope } from '@/utils/iconImports';
import AddMemoryDialog from './AddMemoryDialog';
import { AddHealthRecordDialog } from './AddHealthRecordDialog';

interface ActionButtonProps {
  icon: React.ComponentType<any>;
  label: string;
  onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon: Icon, label, onClick }) => (
  <motion.button
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0, opacity: 0 }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className="bg-white rounded-full p-3 shadow-lg border border-orange-200 hover:border-orange-300 transition-colors group"
  >
    <Icon className="w-5 h-5 text-orange-600 group-hover:text-orange-700" />
    <span className="sr-only">{label}</span>
  </motion.button>
);

interface FloatingActionButtonProps {
  bookId: string;
  onMemoryAdded?: () => void;
  onHealthRecordAdded?: () => void;
  showDialog?: boolean;
  onShowDialogChange?: (show: boolean) => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ 
  bookId, 
  onMemoryAdded, 
  onHealthRecordAdded,
  showDialog = false, 
  onShowDialogChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(showDialog);
  const [healthDialogOpen, setHealthDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'photo' | 'text' | 'event' | 'milestone'>('photo');
  const [menuPosition, setMenuPosition] = useState<'right' | 'left'>('right');
  const [menuDirection, setMenuDirection] = useState<'up' | 'down'>('up');
  const menuRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLDivElement>(null);

  const handleActionClick = (type: 'photo' | 'text' | 'event' | 'milestone') => {
    setDialogType(type);
    setDialogOpen(true);
    setIsOpen(false);
    onShowDialogChange?.(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    onShowDialogChange?.(false);
  };

  const handleHealthClick = () => {
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

  // Enhanced overflow detection for proper inward positioning
  useEffect(() => {
    if (isOpen && fabRef.current) {
      const fabRect = fabRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const safeMargin = 20;
      
      // Estimate menu dimensions including text labels
      const menuWidth = 200; // max-w-[200px] for text labels
      const buttonWidth = 56; // FAB button width (w-14)
      const totalMenuWidth = menuWidth + buttonWidth + 12; // gap-3
      const menuItemHeight = 60;
      const menuHeight = actions.length * menuItemHeight + (actions.length - 1) * 12;

      // Check horizontal positioning - open inward when possible
      const availableRight = windowWidth - fabRect.right - safeMargin;
      const availableLeft = fabRect.left - safeMargin;
      
      // If FAB is on right side and no space to expand right, open left (inward)
      // If FAB is on left side and no space to expand left, open right (inward)
      if (totalMenuWidth <= availableRight) {
        setMenuPosition('right'); // Open to the right of FAB
      } else if (totalMenuWidth <= availableLeft) {
        setMenuPosition('left'); // Open to the left of FAB
      } else {
        // Choose the side with more space, preferring inward direction
        setMenuPosition(availableLeft >= availableRight ? 'left' : 'right');
      }

      // Check vertical overflow
      const availableUp = fabRect.top - safeMargin;
      const availableDown = windowHeight - fabRect.bottom - safeMargin;
      
      if (menuHeight <= availableUp) {
        setMenuDirection('up');
      } else if (menuHeight <= availableDown) {
        setMenuDirection('down');
      } else {
        setMenuDirection(availableUp >= availableDown ? 'up' : 'down');
      }
    }
  }, [isOpen, actions.length]);

  // Update dialog state when external showDialog changes
  useEffect(() => {
    if (showDialog !== dialogOpen) {
      setDialogOpen(showDialog);
      if (showDialog) {
        setDialogType('photo');
      }
    }
  }, [showDialog, dialogOpen]);

  return (
    <>
      <AddMemoryDialog
        isOpen={dialogOpen}
        onClose={handleDialogClose}
        bookId={bookId}
        type={dialogType}
        onMemoryAdded={() => {
          onMemoryAdded?.();
          handleDialogClose();
        }}
      />

      <AddHealthRecordDialog
        bookId={bookId}
        open={healthDialogOpen}
        onOpenChange={setHealthDialogOpen}
        onHealthRecordAdded={() => {
          onHealthRecordAdded?.();
        }}
      >
        <></>
      </AddHealthRecordDialog>
      

      <div 
        ref={fabRef} 
        className="fixed bottom-safe-or-4 right-safe-or-4 z-50"
        style={{ 
          bottom: `max(env(safe-area-inset-bottom, 0px), 1rem)`,
          right: `max(env(safe-area-inset-right, 0px), 1rem)`
        }}
      >
        <div className="relative">
          {/* Action Buttons Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`absolute space-y-3 max-w-[200px] ${
                  menuDirection === 'up' 
                    ? 'bottom-16' 
                    : 'top-16'
                } ${
                  menuPosition === 'right' 
                    ? 'left-full ml-3' 
                    : 'right-full mr-3'
                }`}
              >
                {actions.map((action, index) => (
                  <motion.div
                    key={action.label}
                    initial={{ y: menuDirection === 'up' ? 20 : -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: menuDirection === 'up' ? 20 : -20, opacity: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-3 ${
                      menuPosition === 'right' ? 'flex-row' : 'flex-row-reverse'
                    }`}
                  >
                    <motion.span
                      initial={{ opacity: 0, x: menuPosition === 'right' ? -10 : 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: menuPosition === 'right' ? -10 : 10 }}
                      transition={{ delay: index * 0.1 + 0.1 }}
                      className={`bg-gray-800 text-white px-3 py-1 rounded-lg text-sm font-medium break-words min-w-0 ${
                        menuPosition === 'right' ? 'text-left' : 'text-right'
                      }`}
                    >
                      {action.label}
                    </motion.span>
                    <ActionButton {...action} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main FAB */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="w-14 h-14 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-shadow"
          >
            <motion.div
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
            </motion.div>
          </motion.button>
        </div>
      </div>
    </>
  );
};

export default FloatingActionButton;