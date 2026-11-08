import React, { useState, useEffect } from 'react'
import { PREPARATION_RETAILERS } from '@/data/retailers'

interface BannerData {
  href: string
  name: string
}

const banners: BannerData[] = PREPARATION_RETAILERS

export default function PartnerBanner() {
  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.floor(Math.random() * banners.length)
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 15000) // Vaihda banneria 15 sekunnin välein

    return () => clearInterval(interval)
  }, [])

  const banner = banners[currentIndex]

  return (
    <div className="w-full flex justify-center py-4">
      <a
        href={banner.href}
        target="_blank"
        rel="noopener noreferrer"
        className="block max-w-[980px] w-full rounded-lg border border-stone-200 bg-stone-50 p-5 text-center hover:bg-stone-100 transition-colors"
      >
        <span className="block text-xs text-stone-600">Kauppalinkki</span>
        <strong className="my-2 block">{banner.name}</strong>
        <span className="text-sm underline underline-offset-4">Siirry kaupan sivuille (avautuu uuteen välilehteen)</span>
      </a>
    </div>
  )
}
