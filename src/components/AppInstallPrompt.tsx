import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Download, Share, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export const AppInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = React.useState(false)
  const [isInstalled, setIsInstalled] = React.useState(false)
  const [isIOS, setIsIOS] = React.useState(false)
  const [showIOSInstructions, setShowIOSInstructions] = React.useState(false)

  // Detect iOS
  React.useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }
  }, [])

  // Listen for beforeinstallprompt event (Android/Desktop)
  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Show prompt after a delay (not immediately on first load)
      const hasSeenPrompt = localStorage.getItem('pwa-install-prompt-seen')
      if (!hasSeenPrompt) {
        setTimeout(() => {
          setShowPrompt(true)
        }, 3000) // Show after 3 seconds
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  // Handle install click
  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Show iOS instructions if on iOS
      if (isIOS) {
        setShowIOSInstructions(true)
        return
      }
      return
    }

    try {
      await deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice

      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true)
        localStorage.setItem('pwa-install-prompt-seen', 'true')
      }

      setDeferredPrompt(null)
      setShowPrompt(false)
    } catch (error) {
      console.error('Install prompt error:', error)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setShowIOSInstructions(false)
    localStorage.setItem('pwa-install-prompt-seen', 'true')
  }

  // Don't show if already installed
  if (isInstalled) return null

  return (
    <>
      {/* Android/Desktop install prompt */}
      <AnimatePresence>
        {showPrompt && deferredPrompt && !isIOS && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-20 left-4 right-4 z-[1000] md:bottom-4 md:left-auto md:right-4 md:max-w-sm"
          >
            <div className="rounded-2xl bg-white shadow-2xl border border-[var(--color-border)] p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[var(--color-primary-100)] flex items-center justify-center">
                  <Download className="w-6 h-6 text-[var(--color-primary-700)]" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-1">
                    Asenna sovellus
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                    Käytä Pentulaskuria kuin natiivisovellusta – nopeammin ja ilman selainta!
                  </p>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleInstall}
                      size="sm"
                      className="flex-1 bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-700)]"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Asenna
                    </Button>
                    <Button
                      onClick={handleDismiss}
                      variant="ghost"
                      size="sm"
                      className="px-3"
                    >
                      Ei nyt
                    </Button>
                  </div>
                </div>

                <button
                  onClick={handleDismiss}
                  className="flex-shrink-0 p-1 rounded-full hover:bg-[var(--color-neutral-200)] transition-colors"
                  aria-label="Sulje"
                >
                  <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS installation instructions */}
      <AnimatePresence>
        {showIOSInstructions && isIOS && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-sm"
              onClick={handleDismiss}
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-[1150] bg-white rounded-t-3xl shadow-2xl pb-safe"
            >
              <div className="flex items-center justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 bg-[var(--color-neutral-500)] rounded-full opacity-40" />
              </div>

              <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                    Asenna sovellus
                  </h3>
                  <button
                    onClick={handleDismiss}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-neutral-200)] hover:bg-[var(--color-neutral-500)] transition-colors"
                    aria-label="Sulje"
                  >
                    <X className="w-5 h-5 text-[var(--color-text-primary)]" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <p className="text-base text-[var(--color-text-secondary)]">
                    Asenna Pentulaskuri kotiruutuusi näillä ohjeilla:
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--color-neutral-200)]/50">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-primary-500)] text-white flex items-center justify-center text-sm font-semibold">
                        1
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[var(--color-text-primary)]">
                          Napauta <Share className="inline w-4 h-4 mx-1" /> -painiketta selaimen alaosassa
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--color-neutral-200)]/50">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-primary-500)] text-white flex items-center justify-center text-sm font-semibold">
                        2
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[var(--color-text-primary)]">
                          Selaa alaspäin ja valitse "Lisää Koti-valikkoon"
                        </p>
                        <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                          <Plus className="inline w-3 h-3 mr-1" />
                          Add to Home Screen
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--color-neutral-200)]/50">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-primary-500)] text-white flex items-center justify-center text-sm font-semibold">
                        3
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[var(--color-text-primary)]">
                          Napauta "Lisää" vahvistaaksesi
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleDismiss}
                  className="w-full bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-700)]"
                  size="lg"
                >
                  Selvä!
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating install button for iOS (small reminder) */}
      {isIOS && !isInstalled && !showIOSInstructions && !showPrompt && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 5, type: "spring", stiffness: 400, damping: 25 }}
          onClick={() => setShowIOSInstructions(true)}
          className="fixed bottom-24 right-4 z-50 w-14 h-14 rounded-full bg-[var(--color-primary-500)] text-white shadow-2xl flex items-center justify-center hover:bg-[var(--color-primary-700)] transition-colors md:hidden"
          aria-label="Asenna sovellus"
        >
          <Download className="w-6 h-6" />
        </motion.button>
      )}
    </>
  )
}

// Hook to check if app is installed
export function useIsAppInstalled() {
  const [isInstalled, setIsInstalled] = React.useState(false)

  React.useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }
  }, [])

  return isInstalled
}
