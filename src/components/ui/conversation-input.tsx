import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConversationInputProps {
  type: 'text' | 'number' | 'select';
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  value?: string | number;
  onSubmit: (value: string | number) => void;
  isLoading?: boolean;
  className?: string;
  autoFocus?: boolean;
}

export const ConversationInput: React.FC<ConversationInputProps> = ({
  type,
  placeholder = "Kirjoita vastauksesi...",
  options = [],
  value = '',
  onSubmit,
  isLoading = false,
  className,
  autoFocus = true
}) => {
  const [inputValue, setInputValue] = useState<string | number>(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue && !isLoading) {
      onSubmit(inputValue);
    }
  };

  const inputVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1
    }
  };

  if (type === 'select') {
    return (
      <motion.div
        variants={inputVariants}
        initial="hidden"
        animate="visible"
        transition={{
          duration: 0.3,
          ease: "easeOut"
        }}
        className={cn("space-y-3", className)}
      >
        <Select 
          value={inputValue as string} 
          onValueChange={(value) => setInputValue(value)}
          disabled={isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button 
          onClick={() => onSubmit(inputValue)}
          disabled={!inputValue || isLoading}
          className="w-full"
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                Tallentaa...
              </motion.div>
            ) : (
              <motion.div
                key="submit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Jatka
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      variants={inputVariants}
      initial="hidden"
      animate="visible"
      transition={{
        duration: 0.3,
        ease: "easeOut"
      }}
      className={cn("flex gap-2", className)}
    >
      <div className="flex-1">
        <Input
          type={type}
          value={inputValue}
          onChange={(e) => setInputValue(type === 'number' ? Number(e.target.value) : e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          autoFocus={autoFocus}
          className="w-full"
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={!inputValue || isLoading}
        size="icon"
        className="shrink-0"
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Loader2 className="h-4 w-4 animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              key="send"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Send className="h-4 w-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </motion.form>
  );
};