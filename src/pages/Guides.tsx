import React from 'react';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageLayout, Container, Section } from '@/components/ui/Layout';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Dog,
  Users,
  Shield,
  Utensils,
  BookOpen,
  ArrowRight,
  Info
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { entranceAnimations } from '@/animations';
import { MobileOptimizedLayout } from '@/components/MobileOptimizedLayout';
import { generateBreadcrumbs } from '@/utils/navigation';
import Breadcrumb from '@/components/Breadcrumb';

const Guides = () => {
  const guides = [
    {
      icon: Dog,
      title: 'Pentuopas',
      description: 'Kattava opas koiranpennun hoitamiseen, kasvatukseen ja hyvinvointiin',
      href: '/guides/puppy-guide',
      badge: 'Suosittu',
      color: 'primary',
      features: ['Ruokinta', 'Liikunta', 'Koulutus', 'Terveys']
    },
    {
      icon: Users,
      title: 'Sosialisaatio-opas',
      description: 'Opettele sosialisoimaan pentusi turvallisesti ja tehokkaasti',
      href: '/guides/socialization', 
      badge: 'Tärkeä',
      color: 'secondary',
      features: ['Muut koirat', 'Ihmiset', 'Ympäristöt', 'Äänimaisema']
    },
    {
      icon: Shield,
      title: 'Turvallisuusopas',
      description: 'Tee kodistasi turvallinen ja mukava paikka koiranpennulle',
      href: '/guides/safety',
      badge: 'Välttämätön',
      color: 'warning',
      features: ['Kodin turvaaminen', 'Myrkylliset kasvit', 'Ensiapuohjeet', 'Varusteet']
    },
    {
      icon: Utensils,
      title: 'Ruokintaohjeet',
      description: 'Ammattimainen opas koiranpennun ruokintaan ja ruokamääriin',
      href: '/guides/feeding',
      badge: 'Päivitetty',
      color: 'success',
      features: ['Ruokamäärät', 'Ruokinta-ajat', 'Ruokavalio', 'Herkut']
    }
  ];

  const breadcrumbs = generateBreadcrumbs('/guides');

  return (
    <MobileOptimizedLayout>
    <PageLayout variant="default" animated className="no-horizontal-scroll mobile-text-wrap responsive-media">
      {/* Skip to main content */}
      <a href="#guides-main" className="skip-link focus-enhanced">
        Siirry pääsisältöön
      </a>
      
      <SEO
        title="Oppaat - Koiranpennun Hoito-ohjeet"
        description="Kattavat oppaat koiranpennun hoitamiseen: ruokinta, sosialisaatio, turvallisuus ja kasvatusvinkit asiantuntijoilta."
        keywords="pentuopas, koiranpennun hoito, sosialisaatio, turvallisuus, ruokinta, kasvatusvinkit"
      />

      {/* Breadcrumb */}
      <Section className="py-4 border-b border-[var(--color-border)]">
        <Container size="lg" padding="lg">
          <Breadcrumb items={breadcrumbs.map(b => ({ name: b.name, href: b.url, current: b.url === '/guides' }))} />
        </Container>
      </Section>

      {/* Hero Section */}
      <Section className="py-16 bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-secondary-50)]" role="banner" animated={false}>
        <Container size="lg" padding="lg">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={entranceAnimations.staggerContainer}
            className="text-center"
          >
            <motion.div variants={entranceAnimations.staggerChild} className="mb-4">
              <Badge className="bg-[var(--color-primary-100)] text-[var(--color-primary-700)] border-[var(--color-primary-500)]">
                <BookOpen className="w-4 h-4 mr-2" aria-hidden="true" />
                Asiantuntija-oppaat
              </Badge>
            </motion.div>
            
            <motion.h1 variants={entranceAnimations.staggerChild} className="text-display-1 mb-6" id="guides-title">
              Koiranpennun
              <br />
              <span className="text-[var(--color-primary-500)]">Hoito-oppaat</span>
            </motion.h1>
            
            <motion.p variants={entranceAnimations.staggerChild} className="text-body-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Kattavat, asiantuntija-arvioidut oppaat, jotka auttavat sinua kasvattamaan terveen ja onnellisen koiranpennun.
            </motion.p>

            <motion.div variants={entranceAnimations.staggerChild} className="flex items-center justify-center gap-6 text-body-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[var(--color-info)]" aria-hidden="true" />
                <span>Säännöllisesti päivitetty</span>
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </Section>

      {/* Guides Grid */}
      <Section className="py-20" role="main" id="guides-main" animated={false}>
        <Container size="lg" padding="lg">
          <div className="grid gap-8 md:grid-cols-2 mobile-grid-1">
            {guides.map((guide, index) => (
              <motion.div
                key={guide.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full group hover:shadow-lg transition-all duration-300 hover:-translate-y-1" role="article" aria-labelledby={`guide-${index}-title`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-[var(--color-primary-100)]">
                          <guide.icon className="h-6 w-6 text-[var(--color-primary-500)]" aria-hidden="true" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {guide.badge}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardTitle id={`guide-${index}-title`} className="text-h3 mb-2 text-foreground font-semibold">
                      {guide.title}
                    </CardTitle>
                    
                    <CardDescription className="text-body-base">
                      {guide.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">Sisältää:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {guide.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-500)]" aria-hidden="true" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Link to={guide.href} aria-describedby={`guide-${index}-title`}>
                      <Button 
                        className="w-full group-hover:bg-[var(--color-primary-700)] transition-colors touch-target focus-enhanced"
                        aria-label={`Lue ${guide.title} -opas`}
                      >
                        Lue opas
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Call to Action */}
      <Section className="py-16 bg-[var(--color-surface-alt)]" animated={false}>
        <Container size="lg" padding="lg">
          <div className="text-center">
            <h2 className="text-h2 mb-4">Aloita pennun seuranta</h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Yhdistä oppaamme käytäntöön - seuraa pennun kasvua ja hyvinvointia digitaalisilla työkaluilla.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/weight-tracker">
                <Button size="lg" className="w-full sm:w-auto touch-target focus-enhanced">
                  Aloita painonseuranta
                </Button>
              </Link>
              <Link to="/calculator">
                <Button variant="outline" size="lg" className="w-full sm:w-auto touch-target focus-enhanced">
                  Ruoka-annoslaskuri
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </PageLayout>
    </MobileOptimizedLayout>
  );
};

export default Guides;