import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Dog, 
  Heart,
  Mail,
  Github,
  Twitter,
  Instagram,
  Scale,
  Calculator,
  Book,
  TrendingUp,
  Info,
  Shield,
  ArrowRight,
  MapPin,
  Phone,
  Clock,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { entranceAnimations, hoverAnimations } from '@/animations'

const Footer = () => {
  const quickLinks = [
    { href: '/weight-tracker', icon: Scale, label: 'Painonseuranta', badge: 'Suosituin' },
    { href: '/calculator', icon: Calculator, label: 'Ruokalaskuri' },
    { href: '/puppy-book', icon: Book, label: 'Pentukirja' },
    { href: '/info', icon: Info, label: 'Tietoa & Oppaat' }
  ]

  const supportLinks = [
    { href: '/info/puppy-guide', label: 'Pentuopas aloittelijoille' },
    { href: '/info/feeding-data', label: 'Ruokintaohjeita roduittain' },
    { href: '/info/safety', label: 'Turvallisuus & hyvinvointi' },
    { href: '/info/socialization-guide', label: 'Sosiaalistaminen' }
  ]

  const legalLinks = [
    { href: '/privacy', label: 'Tietosuoja' },
    { href: '/terms', label: 'Käyttöehdot' },
    { href: '/cookies', label: 'Evästeet' },
    { href: '/accessibility', label: 'Saavutettavuus' }
  ]

  const socialLinks = [
    { href: '#', icon: Instagram, label: 'Instagram', color: 'from-pink-500 to-purple-600' },
    { href: '#', icon: Twitter, label: 'Twitter', color: 'from-blue-400 to-blue-600' },
    { href: '#', icon: Github, label: 'Github', color: 'from-gray-600 to-gray-800' }
  ]

  return (
    <footer className="relative">
      {/* Newsletter Section */}
      <section className="full-width-section bg-gradient-warm py-16 mobile-container-safe">
        <div className="full-width-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="max-w-2xl mx-auto">
              <Badge className="bg-white/20 text-white border-white/30 mb-4">
                <Mail className="w-4 h-4 mr-2" />
                Liity yhteisöön
              </Badge>
              <h2 className="text-h2 text-white mb-4">
                Saa vinkkejä & päivityksiä
              </h2>
              <p className="text-body-lg text-white/90 mb-8">
                Liity 10 000+ koiranomistajan joukkoon ja saa viikoittaiset vinkit suoraan sähköpostiisi
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="sinun@email.fi"
                  className="flex-1 px-6 py-3 rounded-xl bg-white/90 backdrop-blur text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <Button size="lg" className="bg-white text-[var(--color-primary-600)] hover:bg-white/90">
                  Tilaa uutiskirje
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
              
              <p className="text-body-sm text-white/70 mt-4">
                <CheckCircle className="w-4 h-4 inline mr-1" />
                Ei roskapostia. Voit peruuttaa milloin tahansa.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Footer */}
      <div className="bg-gradient-to-br from-[var(--color-neutral-900)] via-[var(--color-neutral-800)] to-[var(--color-primary-900)] text-white">
        <div className="full-width-section py-16 mobile-container-safe">
          <div className="full-width-content">
            <div className="grid lg:grid-cols-12 gap-12">
              
              {/* Brand Column - Wider */}
              <motion.div 
                className="lg:col-span-5"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                    <Dog className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-h4 font-bold">Pentulaskuri.com</h3>
                    <p className="text-body-sm text-white/70">Moderni pennunhoito</p>
                  </div>
                </div>

                <p className="text-body text-white/80 mb-6 max-w-md leading-relaxed">
                  Suomen johtava digitaalinen alusta koiran kasvun seuraamiseen. 
                  Yhdistämme tieteellisen tiedon ja modernin teknologian.
                </p>

                {/* Social Links */}
                <div className="flex gap-3 mb-8">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon
                    return (
                      <motion.a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${social.color} flex items-center justify-center text-white shadow-lg`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.a>
                    )
                  })}
                  <a
                    href="mailto:info@pentulaskuri.fi"
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-white/10 text-white border-white/20">
                    <Shield className="w-3 h-3 mr-1" />
                    GDPR
                  </Badge>
                  <Badge className="bg-white/10 text-white border-white/20">
                    <Heart className="w-3 h-3 mr-1" />
                    100% Ilmainen
                  </Badge>
                  <Badge className="bg-white/10 text-white border-white/20">
                    <Clock className="w-3 h-3 mr-1" />
                    24/7 Käytössä
                  </Badge>
                </div>
              </motion.div>

              {/* Quick Access */}
              <motion.div 
                className="lg:col-span-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <h4 className="text-h5 font-semibold mb-6 text-white/90">Työkalut</h4>
                <ul className="space-y-3">
                  {quickLinks.map((link, index) => {
                    const Icon = link.icon
                    return (
                      <li key={index}>
                        <Link
                          to={link.href}
                          className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="flex-1">{link.label}</span>
                          {link.badge && (
                            <Badge className="bg-gradient-primary text-white border-0 text-xs">
                              {link.badge}
                            </Badge>
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </motion.div>

              {/* Support */}
              <motion.div 
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h4 className="text-h5 font-semibold mb-6 text-white/90">Oppaat</h4>
                <ul className="space-y-3">
                  {supportLinks.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.href}
                        className="text-white/70 hover:text-white transition-colors text-body-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Legal */}
              <motion.div 
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <h4 className="text-h5 font-semibold mb-6 text-white/90">Juridiset</h4>
                <ul className="space-y-3">
                  {legalLinks.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.href}
                        className="text-white/70 hover:text-white transition-colors text-body-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                
                {/* Contact Info */}
                <div className="mt-6 p-4 bg-white/5 rounded-xl">
                  <p className="text-body-sm text-white/60 mb-2">
                    <MapPin className="w-3 h-3 inline mr-1" />
                    Helsinki, Suomi
                  </p>
                  <p className="text-body-sm text-white/60">
                    <Phone className="w-3 h-3 inline mr-1" />
                    Tuki 24/7
                  </p>
                </div>
              </motion.div>

            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="full-width-section py-6 mobile-container-safe">
            <div className="full-width-content">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-body-sm text-white/60">
                <div className="flex items-center gap-2">
                  <span>© 2024 Pentulaskuri.com</span>
                  <span className="hidden md:inline">•</span>
                  <span className="hidden md:inline">Kaikki oikeudet pidätetään</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span>Suunniteltu & Kehitetty</span>
                  <Heart className="w-4 h-4 text-red-400 animate-pulse" />
                  <span>Suomessa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer