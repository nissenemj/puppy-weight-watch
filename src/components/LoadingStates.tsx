import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface LoadingStateProps {
  loading?: boolean;
  error?: string | null;
  success?: string | null;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'inline' | 'overlay' | 'skeleton';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  loading = false,
  error = null,
  success = null,
  children,
  size = 'md',
  variant = 'inline'
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-4 w-4';
      case 'lg': return 'h-8 w-8';
      default: return 'h-6 w-6';
    }
  };

  const getSpinnerSize = () => {
    switch (size) {
      case 'sm': return 16;
      case 'lg': return 32;
      default: return 24;
    }
  };

  if (variant === 'overlay') {
    return (
      <div className="relative">
        {children}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-background border shadow-lg">
                <Loader2 className={`${getSizeClasses()} animate-spin text-primary`} />
                <p className="text-sm text-muted-foreground">Ladataan...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (variant === 'skeleton') {
    if (loading) {
      return (
        <div className="space-y-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </div>
      );
    }
    return <>{children}</>;
  }

  // Inline variant
  return (
    <div>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-center p-8"
          >
            <div className="flex flex-col items-center gap-3">
              <Loader2 className={`${getSizeClasses()} animate-spin text-primary`} />
              <p className="text-sm text-muted-foreground">Ladataan...</p>
            </div>
          </motion.div>
        )}
        
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-center p-8"
          >
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Virhe</p>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {success && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-center p-8"
          >
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p className="text-sm text-green-900">{success}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {!loading && !error && !success && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Specific loading components for common use cases
export const ButtonLoadingState: React.FC<{ loading: boolean; children: React.ReactNode }> = ({
  loading,
  children
}) => (
  <span className="flex items-center gap-2">
    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
    {children}
  </span>
);

export const FormLoadingState: React.FC<{ loading: boolean }> = ({ loading }) => {
  if (!loading) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center"
    >
      <div className="bg-background border rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="text-sm">Tallennetaan...</span>
        </div>
      </div>
    </motion.div>
  );
};

// Microanimations for interactions
export const InteractionFeedback: React.FC<{
  type: 'success' | 'error' | 'info';
  message: string;
  show: boolean;
  onClose?: () => void;
}> = ({ type, message, show, onClose }) => {
  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      case 'info': return <Info className="h-4 w-4" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success': return 'bg-green-100 border-green-200 text-green-900';
      case 'error': return 'bg-red-100 border-red-200 text-red-900';
      case 'info': return 'bg-blue-100 border-blue-200 text-blue-900';
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className={`fixed top-4 right-4 z-50 p-3 rounded-lg border shadow-lg ${getColors()}`}
          onClick={onClose}
        >
          <div className="flex items-center gap-2">
            {getIcon()}
            <span className="text-sm font-medium">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingState;