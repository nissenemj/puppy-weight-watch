import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, AlertTriangle, AlertCircle, Info, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorNotification as ErrorNotificationConfig } from '@/utils/errorHandling';

interface ErrorNotificationProps {
  notification: ErrorNotificationConfig;
  onDismiss: () => void;
  className?: string;
}

export function ErrorNotification({ notification, onDismiss, className = '' }: ErrorNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (notification.duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 300); // Allow exit animation
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification.duration, onDismiss]);

  const getIcon = () => {
    switch (notification.type) {
      case 'error':
        return <AlertTriangle className="h-4 w-4" aria-hidden="true" />;
      case 'warning':  
        return <AlertCircle className="h-4 w-4" aria-hidden="true" />;
      default:
        return <Info className="h-4 w-4" aria-hidden="true" />;
    }
  };

  const getColorClasses = () => {
    switch (notification.type) {
      case 'error':
        return 'border-red-200 bg-red-50 text-red-900';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-900'; 
      default:
        return 'border-blue-200 bg-blue-50 text-blue-900';
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`fixed top-4 right-4 z-50 w-full max-w-md ${className}`}
          role="alert"
          aria-live={notification.ariaLive}
          aria-labelledby={`error-title-${notification.id}`}
          aria-describedby={`error-message-${notification.id}`}
        >
          <Card className={`shadow-lg border-2 ${getColorClasses()}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getIcon()}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 id={`error-title-${notification.id}`} className="font-medium text-sm mb-1">
                        {notification.type === 'error' ? 'Virhe' : 
                         notification.type === 'warning' ? 'Varoitus' : 'Huomio'}
                      </h4>
                      <p id={`error-message-${notification.id}`} className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDismiss}
                      className="h-6 w-6 p-0 ml-2 hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-offset-2"
                      aria-label="Sulje viesti"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Action buttons */}
                  {notification.actions && notification.actions.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {notification.actions.map((action, index) => (
                        <Button
                          key={index}
                          variant={action.primary ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            action.onClick();
                            if (action.primary) {
                              handleDismiss();
                            }
                          }}
                          className="text-xs touch-target focus-enhanced"
                        >
                          {action.label === 'Yritä uudelleen' && (
                            <RefreshCw className="w-3 h-3 mr-1" aria-hidden="true" />
                          )}
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for managing error notifications
export function useErrorNotifications() {
  const [notifications, setNotifications] = useState<ErrorNotificationConfig[]>([]);

  const addNotification = (notification: ErrorNotificationConfig) => {
    setNotifications(prev => [...prev, notification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll
  };
}

// Global error notification container
export function ErrorNotificationContainer() {
  const { notifications, removeNotification } = useErrorNotifications();

  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-2 pointer-events-none">
      {notifications.map(notification => (
        <div key={notification.id} className="pointer-events-auto">
          <ErrorNotification
            notification={notification}
            onDismiss={() => removeNotification(notification.id)}
          />
        </div>
      ))}
    </div>
  );
}

// Inline error message for forms
interface InlineErrorProps {
  message?: string;
  suggestions?: string[];
  className?: string;
}

export function InlineError({ message, suggestions = [], className = '' }: InlineErrorProps) {
  if (!message) return null;

  return (
    <div className={`mt-1 ${className}`} role="alert" aria-live="polite">
      <p className="text-sm text-red-600 flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
        <span>{message}</span>
      </p>
      {suggestions.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-medium text-muted-foreground mb-1">Korjausehdotukset:</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-1">
                <span className="text-primary">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Loading error state component
interface LoadingErrorProps {
  error: any;
  onRetry?: () => void;
  context?: string;
  className?: string;
}

export function LoadingError({ error, onRetry, context, className = '' }: LoadingErrorProps) {
  return (
    <div className={`text-center py-12 ${className}`} role="alert" aria-live="assertive">
      <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="h-8 w-8 text-red-500" aria-hidden="true" />
      </div>
      
      <h3 className="text-lg font-semibold text-red-900 mb-2">
        Lataus epäonnistui
      </h3>
      
      <p className="text-red-700 mb-6 max-w-md mx-auto">
        {context ? `${context}: ` : ''}
        {error?.message || 'Tapahtui odottamaton virhe.'}
      </p>
      
      {onRetry && (
        <Button onClick={onRetry} className="touch-target focus-enhanced">
          <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
          Yritä uudelleen
        </Button>
      )}
    </div>
  );
}