import React from 'react'
import { Link } from 'react-router-dom'
import appIcon from '@/assets/app-icon.png'

interface AppLogoProps {
  logoText?: string
}

export const AppLogo: React.FC<AppLogoProps> = ({ logoText = "Pentulaskuri" }) => {
  return (
    <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
      <img
        src={appIcon}
        alt="Pentulaskuri logo"
        className="w-10 h-10 rounded-lg shadow-sm"
      />
      <span className="font-bold text-xl text-foreground hidden sm:block">
        {logoText}
      </span>
    </Link>
  )
}

export default AppLogo