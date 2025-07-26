import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { User } from '@supabase/supabase-js'
import { LogIn, UserPlus } from 'lucide-react'

// Import the generated assets
import appIcon from '@/assets/app-icon.png'
import welcomeIllustration from '@/assets/welcome-illustration.png'

interface AuthenticationWrapperProps {
  onAuthSuccess: (user: User) => void
}

const AuthenticationWrapper = ({ onAuthSuccess }: AuthenticationWrapperProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        if (data.user) {
          onAuthSuccess(data.user)
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        if (data.user) {
          toast({
            title: "Rekisteröityminen onnistui!",
            description: "Tarkista sähköpostisi vahvistuslinkin saamiseksi.",
          })
        }
      }
    } catch (error: any) {
      toast({
        title: "Virhe",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-pink-50 to-purple-100 p-4 relative overflow-hidden">
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

        <Card className="backdrop-blur-sm bg-white/80 shadow-2xl border-0 animate-scale-in">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src={appIcon} alt="Pentulaskuri" className="w-12 h-12 rounded-2xl shadow-lg" />
              <CardTitle className="text-3xl text-foreground font-semibold">
                Pentulaskuri
              </CardTitle>
            </div>
            <CardDescription className="text-lg">
              Kirjaudu sisään seurataksesi pentusi kasvua ja ruokintaa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-base font-medium">Sähköposti</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 text-base rounded-xl border-2 focus:border-primary focus:ring-primary"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="password" className="text-base font-medium">Salasana</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 text-base rounded-xl border-2 focus:border-primary focus:ring-primary"
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
                    <LogIn className="mr-2 h-5 w-5" />
                    Kirjaudu sisään
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" />
                    Rekisteröidy
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 text-base rounded-xl border-2 hover:bg-secondary transition-all duration-200"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Luo uusi tili' : 'Kirjaudu sisään olemassa olevalla tilillä'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  )
}

export default AuthenticationWrapper