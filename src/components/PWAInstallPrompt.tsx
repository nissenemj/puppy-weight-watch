import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePWAInstall } from '@/hooks/usePWAInstall';

export function PWAInstallPrompt() {
  const { isInstallable, installApp } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isInstallable || isDismissed) return null;

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setIsDismissed(true);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
      >
        <Card className="p-4 shadow-lg border-primary/20 bg-card">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Smartphone className="w-4 h-4 text-primary" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm text-foreground text-[var(--color-text-primary)]">
                Asenna Pentulaskuri
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Lisää kotiruutuun nopeaa käyttöä varten
              </p>
              
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  onClick={handleInstall}
                  className="text-xs h-7"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Asenna
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDismissed(true)}
                  className="text-xs h-7"
                >
                  Ei kiitos
                </Button>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDismissed(true)}
              className="h-6 w-6 hover:bg-muted"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}