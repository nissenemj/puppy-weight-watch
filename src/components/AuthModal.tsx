import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { useGuestAuth } from '@/contexts/GuestAuthContext'
import { User } from '@supabase/supabase-js'
import { LogIn, UserPlus, X } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

// Import the generated assets
import appIcon from '@/assets/app-icon.png'
import welcomeIllustration from '@/assets/welcome-illustration.png'

interface AuthModalProps {
  isOpen?: boolean
  onClose?: () => void
  mode?: 'signin' | 'signup'
  onModeChange?: (mode: 'signin' | 'signup') => void
  onAuthSuccess?: (user: User) => void
  fullScreen?: boolean
  title?: string
  description?: string
}

export default function AuthModal({
  isOpen = true,
  onClose,
  mode = 'signup',
  onModeChange,
  onAuthSuccess,
  fullScreen = false,
  title,
  description
}: AuthModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const {
    signInWithEmail,
    signUpWithEmail,
    signInWithOAuth,
    guestWeightEntries,
    syncGuestDataToUser
  } = useGuestAuth()

  const isLogin = mode === 'signin'

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const success = isLogin
        ? await signInWithEmail(email, password)
        : await signUpWithEmail(email, password)

      if (success) {
        // Sync guest data if available (only for sign in)
        if (isLogin && guestWeightEntries.length > 0) {
          try {
            await syncGuestDataToUser()
            toast({
              title: "Sisäänkirjautuminen onnistui!",
              description: `Tervetuloa takaisin! ${guestWeightEntries.length} mittausta synkronoitu.`,
            })
          } catch (error) {
            toast({
              title: "Sisäänkirjautuminen onnistui!",
              description: "Tervetuloa takaisin! Huom: vanhoja mittauksia ei voitu synkronoida.",
              variant: "destructive"
            })
          }
        } else {
          toast({
            title: isLogin ? "Sisäänkirjautuminen onnistui!" : "Rekisteröityminen onnistui!",
            description: isLogin
              ? "Tervetuloa takaisin!"
              : "Tarkista sähköpostisi vahvistuslinkin saamiseksi.",
          })
        }

        setEmail('')
        setPassword('')

        // Call success callback if provided
        if (onAuthSuccess && isLogin) {
          // Note: We don't have direct access to the user object here
          // The GuestAuthContext will handle the auth state change
          setTimeout(() => {
            onAuthSuccess({} as User) // Placeholder, actual user will be set by context
          }, 100)
        }

        // Close modal if in modal mode
        if (!fullScreen && onClose) {
          onClose()
        }
      } else {
        throw new Error('Autentikointi epäonnistui')
      }
    } catch (error: any) {
      toast({
        title: "Virhe",
        description: error.message || 'Autentikointi epäonnistui',
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleModeToggle = () => {
    const newMode = isLogin ? 'signup' : 'signin'
    if (onModeChange) {
      onModeChange(newMode)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    try {
      const success = await signInWithOAuth(provider)

      if (success) {
        // Store guest data state for later sync after OAuth redirect
        if (guestWeightEntries.length > 0) {
          // Store in sessionStorage that guest data sync is needed
          sessionStorage.setItem('pentulaskuri-oauth-guest-sync', 'true')
          sessionStorage.setItem('pentulaskuri-oauth-guest-count', guestWeightEntries.length.toString())
        }

        toast({
          title: "Kirjautuminen käynnistetty",
          description: `Sinut ohjataan ${provider === 'google' ? 'Google' : 'Apple'} kirjautumissivulle...`,
        })
      } else {
        throw new Error('OAuth kirjautuminen epäonnistui')
      }
    } catch (error: any) {
      toast({
        title: "Virhe",
        description: `${provider === 'google' ? 'Google' : 'Apple'} kirjautuminen epäonnistui: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  const AuthContent = () => (
    <Card className={`backdrop-blur-sm bg-white/80 shadow-2xl border-0 animate-scale-in ${fullScreen ? 'border-0 shadow-none bg-white/90' : ''}`}>
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <img src={appIcon} alt="Pentulaskuri" className="w-12 h-12 rounded-2xl shadow-lg" />
          <CardTitle className="text-2xl sm:text-3xl text-foreground font-semibold">
            {title || 'Pentulaskuri'}
          </CardTitle>
        </div>
        <CardDescription className="text-base sm:text-lg">
          {description || (isLogin
            ? 'Kirjaudu sisään jatkaaksesi painonseurantaa'
            : 'Luo tili seurataksesi pentusi kasvua ja ruokintaa'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAuth} className="space-y-4 sm:space-y-6">
          <div className="space-y-2 sm:space-y-3">
            <Label htmlFor="email" className="text-sm sm:text-base font-medium">Sähköposti</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-10 sm:h-12 text-sm sm:text-base rounded-xl border-2 focus:border-primary focus:ring-primary"
              placeholder="esimerkki@email.com"
            />
          </div>

          <div className="space-y-2 sm:space-y-3">
            <Label htmlFor="password" className="text-sm sm:text-base font-medium">Salasana</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-10 sm:h-12 text-sm sm:text-base rounded-xl border-2 focus:border-primary focus:ring-primary"
              placeholder="Vähintään 6 merkkiä"
            />
          </div>

          <Button
            type="submit"
            size="mobile"
            className="w-full rounded-xl bg-gradient-warm hover:opacity-90 transition-all duration-200 hover:scale-105 shadow-lg"
            disabled={loading}
          >
            {loading ? 'Odota...' : isLogin ? (
              <>
                <LogIn className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Kirjaudu sisään
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Rekisteröidy
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full h-10 sm:h-12 text-sm sm:text-base rounded-xl border-2 hover:bg-secondary transition-all duration-200"
            onClick={handleModeToggle}
          >
            {isLogin ? 'Luo uusi tili' : 'Kirjaudu sisään olemassa olevalla tilillä'}
          </Button>
        </form>

        {/* Social Login Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500 mb-4">
            Tai kirjaudu sosiaalisen median tilillä
          </div>

          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full h-10 sm:h-12 rounded-xl border-2 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-3"
              onClick={() => handleSocialLogin('google')}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm sm:text-base">Kirjaudu Google-tilillä</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-10 sm:h-12 rounded-xl border-2 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-3"
              onClick={() => handleSocialLogin('apple')}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 6.73.94 8.01-.2.6-.45 1.18-.75 1.72-.41.77-.86 1.48-1.34 2.48zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              <span className="text-sm sm:text-base">Kirjaudu Apple ID:llä</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gradient-primary p-4 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-warm rounded-full blur-3xl opacity-20 animate-bounce-gentle"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-cool rounded-full blur-3xl opacity-20 animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>

        <div className="max-w-sm sm:max-w-md mx-auto pt-16 sm:pt-20 px-4">
          {/* Welcome illustration - Mobile Responsive */}
          <div className="text-center mb-6 sm:mb-8 animate-fade-in">
            <img
              src={welcomeIllustration}
              alt="Tervetuloa"
              className="w-48 h-36 sm:w-64 sm:h-48 mx-auto mb-4 object-contain max-w-full"
            />
          </div>

          <AuthContent />
        </div>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">
            {isLogin ? 'Kirjaudu sisään' : 'Rekisteröidy'}
          </DialogTitle>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Sulje</span>
            </Button>
          )}
        </DialogHeader>
        <div className="p-0">
          <AuthContent />
        </div>
      </DialogContent>
    </Dialog>
  )
}