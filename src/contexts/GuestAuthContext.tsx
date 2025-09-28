import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'

interface GuestWeightEntry {
  id: string
  date: string
  weight: number
  created_at: string
}

interface GuestDogProfile {
  name: string
  breed?: string
  birthDate?: string
  gender?: string
}

interface GuestAuthContextType {
  // Auth state
  user: User | null
  isGuest: boolean
  isLoading: boolean

  // Guest data
  guestWeightEntries: GuestWeightEntry[]
  guestDogProfile: GuestDogProfile | null

  // Guest actions
  addGuestWeightEntry: (weight: number) => void
  updateGuestDogProfile: (profile: GuestDogProfile) => void
  clearGuestData: () => void

  // Auth actions
  signInWithEmail: (email: string, password: string) => Promise<boolean>
  signUpWithEmail: (email: string, password: string) => Promise<boolean>
  signInWithOAuth: (provider: 'google' | 'apple') => Promise<boolean>
  signOut: () => Promise<void>
  syncGuestDataToUser: () => Promise<void>
}

const GuestAuthContext = createContext<GuestAuthContextType | undefined>(undefined)

const GUEST_DATA_KEY = 'pentulaskuri-guest-data'
const GUEST_PROFILE_KEY = 'pentulaskuri-guest-profile'

interface GuestAuthProviderProps {
  children: ReactNode
}

export function GuestAuthProvider({ children }: GuestAuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [guestWeightEntries, setGuestWeightEntries] = useState<GuestWeightEntry[]>([])
  const [guestDogProfile, setGuestDogProfile] = useState<GuestDogProfile | null>(null)

  const isGuest = !user

  const syncGuestDataToUser = useCallback(async (): Promise<void> => {
    if (!user || guestWeightEntries.length === 0) return

    try {
      // First, create a dog profile if guest has one
      let dogId: string | null = null

      if (guestDogProfile) {
        const { data: dogData, error: dogError } = await supabase
          .from('dogs')
          .insert({
            user_id: user.id,
            name: guestDogProfile.name,
            breed: guestDogProfile.breed,
          })
          .select()
          .single()

        if (dogError) {
          console.error('Error creating dog profile:', dogError)
        } else {
          dogId = dogData.id
        }
      }

      // Sync weight entries
      const weightEntriesToSync = guestWeightEntries.map(entry => ({
        user_id: user.id,
        dog_id: dogId,
        date: entry.date,
        weight: entry.weight
      }))

      const { error: weightError } = await supabase
        .from('weight_entries')
        .insert(weightEntriesToSync)

      if (weightError) {
        console.error('Error syncing weight entries:', weightError)
        throw weightError
      }

      // Create a puppy book if we created a dog
      if (dogId && guestDogProfile) {
        const { error: bookError } = await supabase
          .from('puppy_books')
          .insert({
            owner_id: user.id,
            dog_id: dogId,
            title: `${guestDogProfile.name}n elämäntarina`,
            birth_date: guestDogProfile.birthDate || null
          })

        if (bookError) {
          console.error('Error creating puppy book:', bookError)
        }
      }

      // Clear guest data after successful sync
      clearGuestData()
    } catch (error) {
      console.error('Error syncing guest data to user:', error)
      throw error
    }
  }, [user, guestWeightEntries, guestDogProfile])

  // Load guest data from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem(GUEST_DATA_KEY)
    const savedProfile = localStorage.getItem(GUEST_PROFILE_KEY)

    if (savedEntries) {
      try {
        setGuestWeightEntries(JSON.parse(savedEntries))
      } catch (error) {
        console.error('Failed to parse guest weight entries:', error)
      }
    }

    if (savedProfile) {
      try {
        setGuestDogProfile(JSON.parse(savedProfile))
      } catch (error) {
        console.error('Failed to parse guest profile:', error)
      }
    }
  }, [])

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const newUser = session?.user ?? null
      setUser(newUser)
      setIsLoading(false)

      // Handle OAuth guest data sync
      if (event === 'SIGNED_IN' && newUser && sessionStorage.getItem('pentulaskuri-oauth-guest-sync') === 'true') {
        const guestCount = sessionStorage.getItem('pentulaskuri-oauth-guest-count')

        // Clear the session storage flags
        sessionStorage.removeItem('pentulaskuri-oauth-guest-sync')
        sessionStorage.removeItem('pentulaskuri-oauth-guest-count')

        // Attempt to sync guest data if available
        if (guestWeightEntries.length > 0) {
          try {
            await syncGuestDataToUser()
            console.log(`OAuth login: Successfully synced ${guestWeightEntries.length} guest weight entries`)
          } catch (error) {
            console.error('OAuth login: Failed to sync guest data:', error)
          }
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [guestWeightEntries, syncGuestDataToUser])

  // Save guest data to localStorage whenever it changes
  useEffect(() => {
    if (guestWeightEntries.length > 0) {
      localStorage.setItem(GUEST_DATA_KEY, JSON.stringify(guestWeightEntries))
    }
  }, [guestWeightEntries])

  useEffect(() => {
    if (guestDogProfile) {
      localStorage.setItem(GUEST_PROFILE_KEY, JSON.stringify(guestDogProfile))
    }
  }, [guestDogProfile])

  const addGuestWeightEntry = (weight: number) => {
    const newEntry: GuestWeightEntry = {
      id: `guest-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      weight,
      created_at: new Date().toISOString()
    }

    setGuestWeightEntries(prev => [newEntry, ...prev].slice(0, 50)) // Keep max 50 entries
  }

  const updateGuestDogProfile = (profile: GuestDogProfile) => {
    setGuestDogProfile(profile)
  }

  const clearGuestData = () => {
    setGuestWeightEntries([])
    setGuestDogProfile(null)
    localStorage.removeItem(GUEST_DATA_KEY)
    localStorage.removeItem(GUEST_PROFILE_KEY)
  }

  const signInWithEmail = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      return true
    } catch (error) {
      console.error('Sign in error:', error)
      return false
    }
  }

  const signUpWithEmail = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      })
      if (error) throw error
      return true
    } catch (error) {
      console.error('Sign up error:', error)
      return false
    }
  }

  const signInWithOAuth = async (provider: 'google' | 'apple'): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      })
      if (error) throw error
      return true
    } catch (error) {
      console.error('OAuth sign in error:', error)
      return false
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      await supabase.auth.signOut()
      // Keep guest data when signing out
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const value: GuestAuthContextType = {
    user,
    isGuest,
    isLoading,
    guestWeightEntries,
    guestDogProfile,
    addGuestWeightEntry,
    updateGuestDogProfile,
    clearGuestData,
    signInWithEmail,
    signUpWithEmail,
    signInWithOAuth,
    signOut,
    syncGuestDataToUser
  }

  return (
    <GuestAuthContext.Provider value={value}>
      {children}
    </GuestAuthContext.Provider>
  )
}

export function useGuestAuth() {
  const context = useContext(GuestAuthContext)
  if (context === undefined) {
    throw new Error('useGuestAuth must be used within a GuestAuthProvider')
  }
  return context
}