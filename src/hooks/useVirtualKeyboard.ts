import { useEffect, useState } from 'react';
import { VirtualKeyboardHandler } from '@/utils/VirtualKeyboardHandler';

interface UseVirtualKeyboardReturn {
  isKeyboardOpen: boolean;
  keyboardHeight: number;
}

export function useVirtualKeyboard(): UseVirtualKeyboardReturn {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const handler = new VirtualKeyboardHandler();

    const handleKeyboardOpen = () => {
      setIsKeyboardOpen(true);
      setKeyboardHeight(handler.getKeyboardHeight());
    };

    const handleKeyboardClose = () => {
      setIsKeyboardOpen(false);
      setKeyboardHeight(0);
    };

    window.addEventListener('keyboardopen', handleKeyboardOpen);
    window.addEventListener('keyboardclose', handleKeyboardClose);

    return () => {
      window.removeEventListener('keyboardopen', handleKeyboardOpen);
      window.removeEventListener('keyboardclose', handleKeyboardClose);
      handler.destroy();
    };
  }, []);

  return {
    isKeyboardOpen,
    keyboardHeight
  };
}