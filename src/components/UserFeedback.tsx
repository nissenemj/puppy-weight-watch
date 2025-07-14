import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, MessageCircle, ThumbsUp, ThumbsDown, Send, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface RatingProps {
  value: number
  onChange: (rating: number) => void
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function Rating({ value, onChange, maxRating = 5, size = 'md', showLabel = true }: RatingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1">
        {Array.from({ length: maxRating }, (_, index) => (
          <button
            key={index}
            onClick={() => onChange(index + 1)}
            className={`${sizeClasses[size]} transition-colors`}
            aria-label={`Arvostele ${index + 1} tähteä`}
          >
            <Star
              className={`w-full h-full ${
                index < value
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 hover:text-yellow-300'
              }`}
            />
          </button>
        ))}
      </div>
      {showLabel && (
        <p className="text-sm text-muted-foreground">
          {value === 0 && 'Arvostele'}
          {value === 1 && 'Huono'}
          {value === 2 && 'Välttävä'}
          {value === 3 && 'Hyvä'}
          {value === 4 && 'Erittäin hyvä'}
          {value === 5 && 'Erinomainen'}
        </p>
      )}
    </div>
  )
}

interface FeedbackFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (feedback: FeedbackData) => void
  title?: string
}

interface FeedbackData {
  rating: number
  category: string
  message: string
  contactEmail?: string
}

export function FeedbackForm({ isOpen, onClose, onSubmit, title = 'Anna palautetta' }: FeedbackFormProps) {
  const [feedback, setFeedback] = useState<FeedbackData>({
    rating: 0,
    category: '',
    message: ''
  })

  const categories = [
    { value: 'general', label: 'Yleinen palaute' },
    { value: 'bug', label: 'Virhe tai ongelma' },
    { value: 'feature', label: 'Uusi ominaisuus' },
    { value: 'usability', label: 'Käytettävyys' },
    { value: 'content', label: 'Sisältö' }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (feedback.rating > 0) {
      onSubmit(feedback)
      setFeedback({ rating: 0, category: '', message: '' })
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          
          <motion.div
            className="relative bg-background border rounded-xl p-6 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{title}</h2>
              <button
                onClick={onClose}
                className="p-1 rounded-md hover:bg-muted"
                aria-label="Sulje palaute"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Arvostelu</label>
                <Rating
                  value={feedback.rating}
                  onChange={(rating) => setFeedback(prev => ({ ...prev, rating }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Kategoria</label>
                <select
                  value={feedback.category}
                  onChange={(e) => setFeedback(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="">Valitse kategoria</option>
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Viesti (vapaaehtoinen)</label>
                <Textarea
                  value={feedback.message}
                  onChange={(e) => setFeedback(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Kerro lisää palautteestasi..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={feedback.rating === 0}
                  className="flex-1"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Lähetä
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                >
                  Peruuta
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface QuickFeedbackProps {
  onPositive: () => void
  onNegative: () => void
  question?: string
}

export function QuickFeedback({ onPositive, onNegative, question = 'Oliko tämä hyödyllistä?' }: QuickFeedbackProps) {
  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
      <p className="text-sm text-muted-foreground">{question}</p>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onPositive}
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
        >
          <ThumbsUp className="w-4 h-4 mr-1" />
          Kyllä
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onNegative}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <ThumbsDown className="w-4 h-4 mr-1" />
          Ei
        </Button>
      </div>
    </div>
  )
}

interface OnboardingStep {
  id: string
  title: string
  description: string
  image?: string
  action?: {
    label: string
    onClick: () => void
  }
}

interface OnboardingProps {
  steps: OnboardingStep[]
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export function Onboarding({ steps, isOpen, onClose, onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  if (!isOpen) return null

  const step = steps[currentStep]

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-background border rounded-xl p-6 w-full max-w-md"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="text-center space-y-4">
          {step.image && (
            <img src={step.image} alt="" className="w-32 h-32 mx-auto rounded-lg" />
          )}
          
          <h2 className="text-xl font-semibold">{step.title}</h2>
          <p className="text-muted-foreground">{step.description}</p>
          
          <div className="flex justify-center gap-2">
            {step.action && (
              <Button onClick={step.action.onClick}>
                {step.action.label}
              </Button>
            )}
            <Button variant="outline" onClick={handleNext}>
              {currentStep === steps.length - 1 ? 'Valmis' : 'Seuraava'}
            </Button>
          </div>
          
          <div className="flex justify-center gap-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          
          <Button variant="ghost" size="sm" onClick={handleSkip}>
            Ohita
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}