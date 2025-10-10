import * as React from "react"
import { motion } from "framer-motion"
import { SwipeGesture, useSwipeGesture } from "./swipe-gesture"
import { TouchButton } from "./touch-button"
import { PullToRefresh } from "./pull-to-refresh"
import { FloatingActionButton } from "./floating-action-button"
import { Card } from "./card"
import { Badge } from "./badge"
import { Heart, Share2, MessageCircle, Plus, RefreshCw } from "lucide-react"

// Example component demonstrating enhanced mobile interactions
export const MobileInteractionDemo: React.FC = () => {
  const [liked, setLiked] = React.useState(false)
  const [currentCard, setCurrentCard] = React.useState(0)
  const [refreshCount, setRefreshCount] = React.useState(0)

  const demoCards = [
    { id: 1, title: "Pentu Ässä", weight: "2.5kg", age: "3 kuukautta" },
    { id: 2, title: "Koira Bella", weight: "15.2kg", age: "2 vuotta" },
    { id: 3, title: "Pentu Charlie", weight: "5.8kg", age: "6 kuukautta" },
  ]

  const handleSwipeLeft = () => {
    setCurrentCard((prev) => Math.min(prev + 1, demoCards.length - 1))
  }

  const handleSwipeRight = () => {
    setCurrentCard((prev) => Math.max(prev - 1, 0))
  }

  const handleRefresh = async () => {
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    setRefreshCount(prev => prev + 1)
  }

  // Hook example for swipe detection
  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    threshold: 50
  })

  // Wrap handlers to convert DOM TouchEvent to React TouchEvent
  const reactSwipeHandlers = {
    onTouchStart: (e: React.TouchEvent<HTMLDivElement>) => {
      swipeHandlers.onTouchStart(e.nativeEvent)
    },
    onTouchEnd: (e: React.TouchEvent<HTMLDivElement>) => {
      swipeHandlers.onTouchEnd(e.nativeEvent)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      {/* Pull to refresh wrapper */}
      <PullToRefresh onRefresh={handleRefresh} className="space-y-6">

        {/* Header with touch-optimized controls */}
        <div className="text-center space-y-2">
          <h1 className="text-h4 font-bold text-[var(--color-text-primary)]">
            Mobile Interaction Demo
          </h1>
          <Badge variant="secondary" className="text-caption">
            Päivitetty {refreshCount} kertaa
          </Badge>
        </div>

        {/* Swipeable card carousel */}
        <div className="relative">
          <h2 className="text-h6 font-semibold mb-4 text-[var(--color-text-primary)]">
            Pyyhkäise vaihtaaksesi korttia
          </h2>

          <SwipeGesture
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            className="swipe-indicator"
          >
            <Card variant="elevated" className="p-6 text-center min-h-[200px] mobile-card-interactive">
              <motion.div
                key={currentCard}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-h5 font-bold mb-2 text-white">
                  {demoCards[currentCard].title}
                </h3>
                <p className="text-body text-white/80 mb-4">
                  Paino: {demoCards[currentCard].weight}<br/>
                  Ikä: {demoCards[currentCard].age}
                </p>
                <div className="flex justify-center gap-2">
                  {demoCards.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentCard ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </Card>
          </SwipeGesture>
        </div>

        {/* Touch-optimized buttons */}
        <div className="space-y-4">
          <h2 className="text-h6 font-semibold text-[var(--color-text-primary)]">
            Optimoidut kosketuspainikkeet
          </h2>

          <div className="mobile-button-wrapper">
            <TouchButton
              variant="default"
              size="default"
              fullWidth
              hapticFeedback
              onClick={() => setLiked(!liked)}
              className="haptic-medium"
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              {liked ? 'Tykätty!' : 'Tykkää'}
            </TouchButton>

            <TouchButton
              variant="glass"
              size="default"
              fullWidth
              hapticFeedback
              pressEffect="opacity"
            >
              <Share2 className="w-5 h-5" />
              Jaa
            </TouchButton>

            <TouchButton
              variant="neo"
              size="lg"
              fullWidth
              loading={false}
              hapticFeedback
            >
              <MessageCircle className="w-5 h-5" />
              Kommentoi
            </TouchButton>
          </div>
        </div>

        {/* Interactive list with enhanced touch targets */}
        <div className="space-y-4">
          <h2 className="text-h6 font-semibold text-[var(--color-text-primary)]">
            Kosketusoptimoitu lista
          </h2>

          <Card className="p-0 overflow-hidden">
            <div {...reactSwipeHandlers}>
              {[
                { icon: "🐕", text: "Painon mittaus", action: "Tallenna" },
                { icon: "🥘", text: "Ruokinta", action: "Laske" },
                { icon: "📸", text: "Pentupäiväkirja", action: "Lisää" },
                { icon: "📊", text: "Tilastot", action: "Näytä" }
              ].map((item, index) => (
                <div
                  key={index}
                  className="mobile-list-item flex items-center justify-between border-b border-[var(--color-border)] last:border-b-0 haptic-light"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-body font-medium text-[var(--color-text-primary)]">
                      {item.text}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-caption">
                    {item.action}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Gesture feedback indicator */}
        <div className="text-center space-y-2 mobile-text-wrap">
          <p className="text-caption text-[var(--color-text-secondary)]">
            Vedä alas päivittääksesi • Pyyhkäise korttia vaihtaaksesi
          </p>
          <div className="mobile-scroll-hint">
            <p className="text-caption text-[var(--color-text-secondary)]">
              Pyyhkäise listaa nähdäksesi lisää vaihtoehtoja
            </p>
          </div>
        </div>

        {/* Spacer for FAB */}
        <div className="h-24" />

      </PullToRefresh>

      {/* Floating Action Button */}
      <FloatingActionButton
        icon={Plus}
        label="Lisää uusi mittaus"
        variant="gradient"
        size="default"
        position="bottom-right"
        pulse
        onClick={() => console.log('FAB clicked')}
      />
    </div>
  )
}

export default MobileInteractionDemo