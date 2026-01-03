import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import { entranceAnimations } from '@/animations';

// Formspree form ID
const FORMSPREE_FORM_ID = 'xbdlaeel';

const Contact = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        setStatus('success');
        form.reset();
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Viestin lähetys epäonnistui');
        setStatus('error');
      }
    } catch {
      setErrorMessage('Verkkovirhe. Yritä uudelleen.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Ota yhteyttä - Pentulaskuri"
        description="Ota yhteyttä Pentulaskuri-tiimiin. Lähetä palautetta, kysymyksiä tai ehdotuksia."
        keywords="yhteydenotto, palaute, pentulaskuri, asiakaspalvelu"
      />

      {/* Hero Section */}
      <section className="relative pt-20 md:pt-28 pb-12 bg-gradient-to-br from-stone-50 to-terracotta-50">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={entranceAnimations.staggerContainer}
            className="max-w-2xl mx-auto space-y-6"
          >
            <motion.div variants={entranceAnimations.staggerChild}>
              <Badge variant="secondary" className="bg-white border-stone-200 text-stone-600 px-4 py-1.5 text-sm shadow-sm">
                <Mail className="w-3.5 h-3.5 mr-2 text-terracotta-500" />
                Yhteydenotto
              </Badge>
            </motion.div>

            <motion.h1
              variants={entranceAnimations.staggerChild}
              className="text-3xl md:text-5xl font-serif font-bold text-stone-900 tracking-tight"
            >
              Ota meihin <span className="text-terracotta-500">yhteyttä</span>
            </motion.h1>

            <motion.p
              variants={entranceAnimations.staggerChild}
              className="text-lg text-stone-600 leading-relaxed"
            >
              Onko sinulla kysyttävää, palautetta tai ehdotuksia? Kuulemme mielellämme sinusta!
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="flex-1 py-12 md:py-16">
        <div className="container px-4 md:px-6 mx-auto max-w-xl">
          <Card className="border-stone-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-serif">Lähetä viesti</CardTitle>
              <CardDescription>
                Täytä alla oleva lomake ja vastaamme mahdollisimman pian.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-4"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-stone-900">Kiitos viestistäsi!</h3>
                  <p className="text-stone-600">
                    Olemme vastaanottaneet viestisi ja palaamme asiaan mahdollisimman pian.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setStatus('idle')}
                    className="mt-4"
                  >
                    Lähetä uusi viesti
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nimi *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Nimesi"
                      disabled={status === 'submitting'}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Sähköposti *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="sinun@email.fi"
                      disabled={status === 'submitting'}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Aihe</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="Viestin aihe"
                      disabled={status === 'submitting'}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Viesti *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder="Kirjoita viestisi tähän..."
                      disabled={status === 'submitting'}
                    />
                  </div>

                  {status === 'error' && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={status === 'submitting'}
                  >
                    {status === 'submitting' ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Lähetetään...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Lähetä viesti
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-stone-500 text-center">
                    Käsittelemme tietojasi tietosuojakäytäntömme mukaisesti.
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
