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
  Users,
  Award
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container, Section, Stack } from '@/components/ui/Layout'
import { entranceAnimations, hoverAnimations } from '@/animations'

const Footer = () => {
  const quickLinks = [
    { href: '/weight-tracker', icon: Scale, label: 'Painonseuranta' },
    { href: '/calculator', icon: Calculator, label: 'Ruokalaskuri' },
    { href: '/puppy-book', icon: Book, label: 'Pentukirja' },
    { href: '/info', icon: Info, label: 'Tietoa' }
  ]

  const infoLinks = [
    { href: '/info/puppy-guide', label: 'Pentuopas' },
    { href: '/info/feeding-data', label: 'Ruokintaohjeita' },
    { href: '/info/safety', label: 'Turvallisuus' },
    { href: '/info/socialization-guide', label: 'Sosialiointi' }
  ]

  const socialLinks = [
    { href: '#', icon: Twitter, label: 'Twitter', color: 'hover:text-blue-400' },
    { href: '#', icon: Instagram, label: 'Instagram', color: 'hover:text-pink-400' },
    { href: '#', icon: Github, label: 'Github', color: 'hover:text-gray-300' },
    { href: 'mailto:info@pentulaskuri.fi', icon: Mail, label: 'Email', color: 'hover:text-green-400' }
  ]

  const stats = [
    { icon: Users, value: '10k+', label: 'Aktiivisia käyttäjiä' },
    { icon: Scale, value: '50k+', label: 'Seurattua mittausta' },
    { icon: Award, value: '98%', label: 'Tyytyväisyys' },
    { icon: Heart, value: '100%', label: 'Rakkautta' }
  ]

  return (
    <footer className="bg-[var(--color-primary-900)] text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-accent"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-accent"></div>
      </div>

      <div className="relative">
        {/* Top Section with Stats */}
        <Section className="border-b border-white/10 py-16">
          <Container size="xl" padding="lg">
            <div className="text-center mb-12">
              <h3 className="text-h2 mb-4">Luotettu ympäri maailmaa</h3>
              <p className="text-body-lg opacity-80 max-w-2xl mx-auto">
                Tuhansien koiranomistajien valinta päivittäiseen pennun seurantaan
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center group"
                  >
                    <motion.div
                      whileHover={hoverAnimations.scale.whileHover}
                      className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-2xl group-hover:shadow-accent/20 transition-all duration-300"
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <div className="text-display-3 font-bold text-accent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-body-sm opacity-80">
                      {stat.label}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </Container>
        </Section>

        {/* Main Footer Content */}
        <Section className="py-16">
          <Container size="xl" padding="lg">
            <div className="grid lg:grid-cols-4 gap-12">
              
              {/* Brand Column */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center shadow-lg"
                    >
                      <Dog className="w-7 h-7 text-white" />
                    </motion.div>
                    <div>
                      <h4 className="text-h4 font-bold">Pentulaskuri</h4>
                      <p className="text-body-sm opacity-80">Koiran kasvun ammattilainen</p>
                    </div>
                  </div>

                  <p className="text-body text-white/80 mb-6 max-w-md">
                    Moderni ja helppokäyttöinen sovellus koiran kasvun seuraamiseen. 
                    Täysin ilmainen käyttö ammattimaisilla työkaluilla.
                  </p>

                  <div className="flex items-center gap-3 mb-8">
                    {socialLinks.map((social, index) => {
                      const Icon = social.icon
                      return (
                        <motion.a
                          key={index}
                          href={social.href}
                          target={social.href.startsWith('http') ? '_blank' : undefined}
                          rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white/80 transition-all duration-300 ${social.color}`}
                          whileHover={hoverAnimations.lift.whileHover}
                          whileTap={hoverAnimations.lift.whileTap}
                        >
                          <Icon className="w-5 h-5" />
                        </motion.a>
                      )
                    })}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/weight-tracker">
                      <Button variant="secondary" size="lg" className="bg-accent text-white hover:bg-accent/90">
                        <Scale className="w-5 h-5 mr-2" />
                        Aloita seuranta
                      </Button>
                    </Link>
                    <Link to="/info">
                      <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                        Lue lisää
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </div>

              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h5 className="text-h5 font-semibold mb-6">Työkalut</h5>
                <Stack spacing="sm">
                  {quickLinks.map((link, index) => {
                    const Icon = link.icon
                    return (
                      <motion.div
                        key={index}
                        whileHover={hoverAnimations.lift.whileHover}
                      >
                        <Link
                          to={link.href}
                          className="flex items-center gap-3 text-white/80 hover:text-accent transition-colors duration-200 py-2"
                        >
                          <Icon className="w-4 h-4" />
                          <span>{link.label}</span>
                        </Link>
                      </motion.div>
                    )
                  })}
                </Stack>
              </motion.div>

              {/* Info Links */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h5 className="text-h5 font-semibold mb-6">Oppaat</h5>
                <Stack spacing="sm">
                  {infoLinks.map((link, index) => (
                    <motion.div
                      key={index}
                      whileHover={hoverAnimations.lift.whileHover}
                    >
                      <Link
                        to={link.href}
                        className="text-white/80 hover:text-accent transition-colors duration-200 py-2 block"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </Stack>

                <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-accent" />
                    <span className="text-body-sm font-medium">Turvallista käyttöä</span>
                  </div>
                  <p className="text-caption text-white/70">
                    Kaikki tiedot salataan ja käsitellään GDPR-määräysten mukaisesti.
                  </p>
                </div>
              </motion.div>

            </div>
          </Container>
        </Section>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <Container size="xl" padding="lg">
            <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-body-sm text-white/60">
                <p>&copy; 2024 Pentulaskuri. Kaikki oikeudet pidätetään.</p>
                <span className="hidden md:block">•</span>
                <div className="flex items-center gap-4">
                  <Link to="/privacy" className="hover:text-accent transition-colors">
                    Tietosuoja
                  </Link>
                  <Link to="/terms" className="hover:text-accent transition-colors">
                    Käyttöehdot
                  </Link>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-body-sm text-white/60">
                <span>Tehty</span>
                <Heart className="w-4 h-4 text-red-400 animate-pulse" />
                <span>rakkauden vuoksi</span>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </footer>
  )
}

export default Footer