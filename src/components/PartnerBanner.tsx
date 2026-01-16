import React, { useState, useEffect } from 'react'

interface BannerData {
  href: string
  src: string
  alt: string
}

const banners: BannerData[] = [
  {
    href: 'https://to.koiratarvikehaukkula.fi/t/t?a=2005863340&as=2037227635&t=2&tk=1',
    src: 'https://track.adtraction.com/t/t?a=2005863340&as=2037227635&t=1&tk=1&i=1',
    alt: 'Koiratarvike Haukkula - Koiratarvikkeita verkosta'
  },
  {
    href: 'https://pin.petenkoiratarvike.com/t/t?a=1984341102&as=2037227635&t=2&tk=1',
    src: 'https://track.adtraction.com/t/t?a=1984341102&as=2037227635&t=1&tk=1&i=1',
    alt: 'Peten Koiratarvike - Laaja valikoima koiratarvikkeita'
  }
]

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
        rel="noopener noreferrer sponsored"
        className="block max-w-[980px] w-full hover:opacity-90 transition-opacity"
      >
        <img
          src={banner.src}
          width={980}
          height={120}
          alt={banner.alt}
          className="w-full h-auto rounded-lg shadow-sm"
          loading="lazy"
        />
      </a>
    </div>
  )
}
