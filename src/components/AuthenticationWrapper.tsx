import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import AuthModal from './AuthModal'

interface AuthenticationWrapperProps {
  onAuthSuccess: (user: User) => void
  mode?: 'signin' | 'signup'
  onClose?: () => void
}

const AuthenticationWrapper = ({ onAuthSuccess, mode = 'signup', onClose }: AuthenticationWrapperProps) => {
  const [currentMode, setCurrentMode] = useState<'signin' | 'signup'>(mode)

  return (
    <AuthModal
      isOpen={true}
      onClose={onClose}
      mode={currentMode}
      onModeChange={setCurrentMode}
      onAuthSuccess={onAuthSuccess}
      fullScreen={!onClose} // Use fullscreen when no close handler (standalone mode)
    />
  )
}

export default AuthenticationWrapper