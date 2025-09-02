import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Save, Clock } from 'lucide-react';

interface EnhancedFormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onAutoSave?: (value: string) => Promise<void>;
  type?: 'text' | 'number' | 'email' | 'date';
  placeholder?: string;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: string) => string | null;
  };
  autoSaveDelay?: number; // ms
  showValidation?: boolean;
  disabled?: boolean;
  helperText?: string;
  className?: string;
}

export const EnhancedFormField: React.FC<EnhancedFormFieldProps> = ({
  label,
  value,
  onChange,
  onAutoSave,
  type = 'text',
  placeholder,
  validation,
  autoSaveDelay = 2000,
  showValidation = true,
  disabled = false,
  helperText,
  className = ''
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // Validation function
  const validateValue = useCallback((val: string): string | null => {
    if (!validation) return null;

    if (validation.required && !val.trim()) {
      return 'Tämä kenttä on pakollinen';
    }

    if (type === 'number' && val) {
      const num = parseFloat(val);
      if (isNaN(num)) return 'Anna kelvollinen numero';
      if (validation.min !== undefined && num < validation.min) {
        return `Arvo ei voi olla pienempi kuin ${validation.min}`;
      }
      if (validation.max !== undefined && num > validation.max) {
        return `Arvo ei voi olla suurempi kuin ${validation.max}`;
      }
    }

    if (validation.pattern && !validation.pattern.test(val)) {
      return 'Virheellinen muoto';
    }

    if (validation.custom) {
      return validation.custom(val);
    }

    return null;
  }, [validation, type]);

  // Handle validation and auto-save
  useEffect(() => {
    const error = validateValue(localValue);
    setValidationError(error);
    setIsValid(!error);

    // Auto-save logic
    if (onAutoSave && !error && localValue !== value && localValue.trim()) {
      // Clear existing timeout
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }

      // Set new timeout
      const timeout = setTimeout(async () => {
        setSaveStatus('saving');
        try {
          await onAutoSave(localValue);
          onChange(localValue); // Update parent
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 2000);
        } catch (error) {
          console.error('Auto-save failed:', error);
          setSaveStatus('error');
          setTimeout(() => setSaveStatus('idle'), 3000);
        }
      }, autoSaveDelay);

      setAutoSaveTimeout(timeout);
    }

    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [localValue, value, validateValue, onAutoSave, autoSaveDelay, autoSaveTimeout, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    // For immediate validation feedback
    if (!onAutoSave) {
      onChange(newValue);
    }
  };

  const getStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'saved':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Tallennetaan...';
      case 'saved':
        return 'Tallennettu';
      case 'error':
        return 'Tallennusvirhe';
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label with status indicator */}
      <div className="flex items-center justify-between">
        <Label 
          htmlFor={`field-${label}`}
          className="text-sm font-medium text-foreground"
        >
          {label}
          {validation?.required && (
            <span className="text-red-500 ml-1" aria-label="pakollinen">*</span>
          )}
        </Label>
        
        {/* Auto-save status */}
        {onAutoSave && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1"
            >
              {getStatusIcon()}
              {getStatusText() && (
                <span className="text-xs text-muted-foreground">
                  {getStatusText()}
                </span>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Input field */}
      <div className="relative">
        <Input
          id={`field-${label}`}
          type={type}
          value={localValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`mobile-form-full transition-colors ${
            showValidation && validationError
              ? 'border-red-500 focus-visible:ring-red-500'
              : showValidation && isValid && localValue
              ? 'border-green-500 focus-visible:ring-green-500'
              : ''
          }`}
          aria-invalid={validationError ? 'true' : 'false'}
          aria-describedby={
            validationError
              ? `${label}-error`
              : helperText
              ? `${label}-helper`
              : undefined
          }
        />

        {/* Validation icon */}
        {showValidation && localValue && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {validationError ? (
              <AlertCircle className="h-4 w-4 text-red-500" />
            ) : (
              <Check className="h-4 w-4 text-green-500" />
            )}
          </div>
        )}
      </div>

      {/* Helper text or error message */}
      <AnimatePresence>
        {(validationError || helperText) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-1"
          >
            {validationError ? (
              <p
                id={`${label}-error`}
                className="text-sm text-red-600 flex items-center gap-1"
                role="alert"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {validationError}
              </p>
            ) : helperText ? (
              <p
                id={`${label}-helper`}
                className="text-sm text-muted-foreground"
              >
                {helperText}
              </p>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auto-save badge */}
      {onAutoSave && saveStatus === 'saved' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <Badge variant="secondary" className="text-xs">
            <Save className="h-3 w-3 mr-1" />
            Automaattisesti tallennettu
          </Badge>
        </motion.div>
      )}
    </div>
  );
};

export default EnhancedFormField;