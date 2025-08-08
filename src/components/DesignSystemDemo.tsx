import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageLayout, Container, Section, CardGrid, Stack } from '@/components/ui/Layout'
import { Heart, Star, Zap, Target, Award, Users } from 'lucide-react'
import { entranceAnimations, hoverAnimations } from '@/animations'

const DesignSystemDemo = () => {
  return (
    <PageLayout variant="default">
      <Container size="xl" padding="lg">
        
        {/* Typography Demo */}
        <Section className="text-center mb-16">
          <h1 className="text-display-1 mb-4">Design System</h1>
          <h2 className="text-display-2 text-accent mb-6">Puppy Weight Watch</h2>
          <p className="text-body-xl text-muted max-w-2xl mx-auto">
            Modern, puppy-themed design system inspired by Transparent Video aesthetics
          </p>
        </Section>

        {/* Button Showcase */}
        <Section className="mb-16">
          <h3 className="text-h3 mb-8 text-center">Button Variants</h3>
          <Stack spacing="lg" align="center">
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="default" size="lg">Primary Button</Button>
              <Button variant="secondary" size="lg">Secondary</Button>
              <Button variant="outline" size="lg">Outline</Button>
              <Button variant="ghost" size="lg">Ghost</Button>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="success" size="lg">Success</Button>
              <Button variant="destructive" size="lg">Destructive</Button>
              <Button variant="link">Link Button</Button>
            </div>

            <div className="flex gap-4 justify-center">
              <Button variant="default" size="sm">Small</Button>
              <Button variant="default" size="default">Default</Button>
              <Button variant="default" size="lg">Large</Button>
              <Button variant="default" size="xl">Extra Large</Button>
            </div>
          </Stack>
        </Section>

        {/* Card Variants */}
        <Section className="mb-16">
          <h3 className="text-h3 mb-8 text-center">Card Variants</h3>
          <CardGrid cols={4} gap="lg" stagger>
            <Card variant="default">
              <CardHeader>
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-2">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>
                  Standard card with border and subtle shadow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm">Learn More</Button>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-2">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Elevated Card</CardTitle>
                <CardDescription>
                  Enhanced shadow for important content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="default" size="sm">Get Started</Button>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader>
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-2">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Glass Card</CardTitle>
                <CardDescription>
                  Glassmorphism effect with backdrop blur
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" size="sm">Explore</Button>
              </CardContent>
            </Card>

            <Card variant="minimal">
              <CardHeader>
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-2">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Minimal Card</CardTitle>
                <CardDescription>
                  Clean design without borders or shadows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm">View Details</Button>
              </CardContent>
            </Card>
          </CardGrid>
        </Section>

        {/* Typography Scale */}
        <Section className="mb-16">
          <h3 className="text-h3 mb-8 text-center">Typography Scale</h3>
          <Card variant="default" className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <Stack spacing="lg">
                <div>
                  <h1 className="text-display-1">Display 1</h1>
                  <p className="text-body-sm text-muted">text-display-1</p>
                </div>
                <div>
                  <h2 className="text-display-2">Display 2</h2>
                  <p className="text-body-sm text-muted">text-display-2</p>
                </div>
                <div>
                  <h1 className="text-h1">Heading 1</h1>
                  <p className="text-body-sm text-muted">text-h1</p>
                </div>
                <div>
                  <h2 className="text-h2">Heading 2</h2>
                  <p className="text-body-sm text-muted">text-h2</p>
                </div>
                <div>
                  <h3 className="text-h3">Heading 3</h3>
                  <p className="text-body-sm text-muted">text-h3</p>
                </div>
                <div>
                  <p className="text-body-xl">Body XL - Large body text for important content</p>
                  <p className="text-body-sm text-muted">text-body-xl</p>
                </div>
                <div>
                  <p className="text-body">Body - Standard body text for most content</p>
                  <p className="text-body-sm text-muted">text-body</p>
                </div>
                <div>
                  <p className="text-body-sm">Body Small - Smaller text for secondary content</p>
                  <p className="text-body-sm text-muted">text-body-sm</p>
                </div>
              </Stack>
            </CardContent>
          </Card>
        </Section>

        {/* Animation Showcase */}
        <Section className="mb-16">
          <h3 className="text-h3 mb-8 text-center">Animations</h3>
          <CardGrid cols={3} gap="lg">
            <motion.div
              whileHover={hoverAnimations.lift.whileHover}
              whileTap={hoverAnimations.lift.whileTap}
            >
              <Card variant="elevated">
                <CardHeader>
                  <Award className="w-8 h-8 text-accent mb-2" />
                  <CardTitle>Hover Lift</CardTitle>
                  <CardDescription>Hover to see lift animation</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              whileHover={hoverAnimations.scale.whileHover}
              whileTap={hoverAnimations.scale.whileTap}
            >
              <Card variant="elevated">
                <CardHeader>
                  <Users className="w-8 h-8 text-accent mb-2" />
                  <CardTitle>Hover Scale</CardTitle>
                  <CardDescription>Hover to see scale animation</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              whileHover={hoverAnimations.glow.whileHover}
            >
              <Card variant="elevated">
                <CardHeader>
                  <Zap className="w-8 h-8 text-accent mb-2" />
                  <CardTitle>Hover Glow</CardTitle>
                  <CardDescription>Hover to see glow effect</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </CardGrid>
        </Section>

        {/* Color Palette */}
        <Section>
          <h3 className="text-h3 mb-8 text-center">Color Palette</h3>
          <Card variant="default" className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <Stack spacing="lg">
                <div>
                  <h4 className="text-h5 mb-4">Primary Colors</h4>
                  <div className="grid grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-lg mx-auto mb-2" style={{backgroundColor: 'hsl(220, 15%, 95%)'}}></div>
                      <p className="text-caption">50</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-lg mx-auto mb-2" style={{backgroundColor: 'hsl(220, 15%, 90%)'}}></div>
                      <p className="text-caption">100</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-lg mx-auto mb-2" style={{backgroundColor: 'hsl(220, 15%, 50%)'}}></div>
                      <p className="text-caption">500</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-lg mx-auto mb-2" style={{backgroundColor: 'hsl(220, 15%, 20%)'}}></div>
                      <p className="text-caption">800</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-lg mx-auto mb-2" style={{backgroundColor: 'hsl(220, 15%, 10%)'}}></div>
                      <p className="text-caption">900</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-h5 mb-4">Accent Colors</h4>
                  <div className="grid grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-lg mx-auto mb-2" style={{backgroundColor: 'hsl(25, 85%, 95%)'}}></div>
                      <p className="text-caption">50</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-lg mx-auto mb-2" style={{backgroundColor: 'hsl(25, 85%, 80%)'}}></div>
                      <p className="text-caption">200</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-lg mx-auto mb-2" style={{backgroundColor: 'hsl(25, 85%, 60%)'}}></div>
                      <p className="text-caption">500</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-lg mx-auto mb-2" style={{backgroundColor: 'hsl(25, 85%, 50%)'}}></div>
                      <p className="text-caption">700</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-lg mx-auto mb-2" style={{backgroundColor: 'hsl(25, 85%, 40%)'}}></div>
                      <p className="text-caption">900</p>
                    </div>
                  </div>
                </div>
              </Stack>
            </CardContent>
          </Card>
        </Section>

      </Container>
    </PageLayout>
  )
}

export default DesignSystemDemo