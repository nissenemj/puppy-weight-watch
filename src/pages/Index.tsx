import React, { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import LandingPage from '@/components/LandingPage'
import Dashboard from '@/components/Dashboard'

const Index = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUser();
  }, [])

  const loadUser = async () => {
    try {
      setLoading(true);

      // Create a timeout promise to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 5000); // 5s timeout for initial load
      });

      // Race between auth check and timeout
      const { data } = await Promise.race([
        supabase.auth.getUser(),
        timeoutPromise
      ]) as { data: { user: User | null } };

      if (data?.user) {
        setUser(data.user);
      }
    } catch (error) {
      // If timeout or error, we just stay as guest (user=null), 
      // effectively showing landing page (fail open)
      // console.error('Auth check failed:', error); 
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    // Show a minimal loader to avoid flash of content
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="w-12 h-12 border-4 border-terracotta-200 border-t-terracotta-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (user) {
    return <Dashboard user={user} />
  }

  return <LandingPage />
}

export default Index