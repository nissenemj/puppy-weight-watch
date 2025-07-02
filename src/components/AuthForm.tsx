
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'
import { LoginSchema, RegisterSchema } from '@/lib/validationSchemas'
import { ZodError } from 'zod'

interface AuthFormProps {
  onAuthSuccess: () => void
}

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '' 
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateAndSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    try {
      const validatedData = LoginSchema.parse(loginData)
      setIsLoading(true)

      const { error } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Virheelliset kirjautumistiedot')
        } else {
          toast.error('Kirjautuminen epäonnistui: ' + error.message)
        }
      } else {
        toast.success('Kirjautuminen onnistui!')
        onAuthSuccess()
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(fieldErrors)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const validateAndSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    try {
      const validatedData = RegisterSchema.parse(registerData)
      setIsLoading(true)

      const { error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password
      })

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('Sähköpostiosoite on jo käytössä')
        } else {
          toast.error('Rekisteröityminen epäonnistui: ' + error.message)
        }
      } else {
        toast.success('Rekisteröityminen onnistui! Tarkista sähköpostisi vahvistuslinkkiä varten.')
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(fieldErrors)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const PasswordStrengthIndicator = ({ password }: { password: string }) => {
    const checks = [
      { test: /.{8,}/, label: 'Vähintään 8 merkkiä' },
      { test: /[A-Z]/, label: 'Iso kirjain' },
      { test: /[a-z]/, label: 'Pieni kirjain' },
      { test: /[0-9]/, label: 'Numero' },
      { test: /[^A-Za-z0-9]/, label: 'Erikoismerkki' }
    ]

    const passedChecks = checks.filter(check => check.test.test(password))
    const strength = passedChecks.length

    if (!password) return null

    return (
      <div className="mt-2 space-y-1">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={`h-1 flex-1 rounded ${
                level <= strength
                  ? strength < 3
                    ? 'bg-red-500'
                    : strength < 5
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <div className="text-xs space-y-1">
          {checks.map((check, index) => (
            <div
              key={index}
              className={`flex items-center gap-1 ${
                check.test.test(password) ? 'text-green-600' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-1 h-1 rounded-full ${
                  check.test.test(password) ? 'bg-green-600' : 'bg-gray-400'
                }`}
              />
              {check.label}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">🐕 Puppy Weight Watch</CardTitle>
          <CardDescription>
            Seuraa pentusi kasvua ja laske optimaaliset ruokamäärät
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Kirjaudu</TabsTrigger>
              <TabsTrigger value="register">Rekisteröidy</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={validateAndSubmitLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Sähköposti</Label>
                  <div className="relative">
                    <Input
                      id="login-email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="sähköposti@example.com"
                    />
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Salasana</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                      placeholder="Salasana"
                    />
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Kirjaudutaan...' : 'Kirjaudu sisään'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              <form onSubmit={validateAndSubmitRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-email">Sähköposti</Label>
                  <div className="relative">
                    <Input
                      id="register-email"
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="sähköposti@example.com"
                    />
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Salasana</Label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                      placeholder="Salasana"
                    />
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                  <PasswordStrengthIndicator password={registerData.password} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Vahvista salasana</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      placeholder="Vahvista salasana"
                    />
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Rekisteröitymisen jälkeen saat sähköpostiisi vahvistuslinkin.
                  </AlertDescription>
                </Alert>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Rekisteröidään...' : 'Luo tili'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
