import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Camera, Calendar, Award, Heart, X } from 'lucide-react';
import AddMemoryDialog from './AddMemoryDialog';

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
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ bookId, onMemoryAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'photo' | 'text' | 'event' | 'milestone'>('photo');

  const handleActionClick = (type: 'photo' | 'text' | 'event' | 'milestone') => {
    setDialogType(type);
    setDialogOpen(true);
    setIsOpen(false);
  };

  const actions = [
    { icon: Camera, label: 'Lisää kuva', onClick: () => handleActionClick('photo') },
    { icon: Calendar, label: 'Lisää tapahtuma', onClick: () => handleActionClick('event') },
    { icon: Award, label: 'Lisää virstanpylväs', onClick: () => handleActionClick('milestone') },
    { icon: Heart, label: 'Lisää muisto', onClick: () => handleActionClick('text') },
  ];

  return (
    <>
      <AddMemoryDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        bookId={bookId}
        type={dialogType}
        onMemoryAdded={() => {
          onMemoryAdded?.();
          setDialogOpen(false);
        }}
      />
      
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
        {/* Action Buttons */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-16 right-0 space-y-3"
            >
              {actions.map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <motion.span
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: index * 0.1 + 0.1 }}
                    className="bg-gray-800 text-white px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap"
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

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 -z-10"
          />
        )}
      </AnimatePresence>
      </div>
    </>
  );
};

export default FloatingActionButton;