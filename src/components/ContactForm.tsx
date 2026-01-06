import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ContactFormProps {
  onSubmit?: (data: { name: string, email: string, message: string }) => void;
}

export default function ContactForm({ onSubmit }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    honeypot: '' // Honeypot field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [formStartTime] = useState<number>(Date.now()); // Time-based protection
  const { toast } = useToast();

  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);
  const successRef = useRef<HTMLDivElement | null>(null);

  const validate = () => {
    const newErrors: { name?: string; email?: string; message?: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Nimi on pakollinen';
    if (!formData.email.trim()) {
      newErrors.email = 'Sähköpostiosoite on pakollinen';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Anna kelvollinen sähköpostiosoite';
    }
    if (!formData.message.trim()) newErrors.message = 'Viesti on pakollinen';
    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Bot protection: Check honeypot field
    if (formData.honeypot) {
      console.log('Bot detected: honeypot filled');
      setIsSubmitted(true); // Fake success for bots
      return;
    }

    // Bot protection: Check time (must be at least 3 seconds)
    const timeTaken = Date.now() - formStartTime;
    if (timeTaken < 3000) {
      console.log('Bot detected: form submitted too fast');
      setIsSubmitted(true); // Fake success for bots
      return;
    }

    const v = validate();
    if (Object.keys(v).length > 0) {
      // Siirrä fokus ensimmäiseen virheeseen
      if (v.name) nameRef.current?.focus();
      else if (v.email) emailRef.current?.focus();
      else if (v.message) messageRef.current?.focus();
      return;
    }
    setIsSubmitting(true);

    try {
      // Rate limiting: max 3 submissions per hour
      const rateLimitKey = 'contact_form_submissions';
      const submissions = JSON.parse(localStorage.getItem(rateLimitKey) || '[]') as number[];
      const oneHourAgo = Date.now() - 3600000;
      const recentSubmissions = submissions.filter((t: number) => t > oneHourAgo);
      
      if (recentSubmissions.length >= 3) {
        toast({
          title: 'Liian monta viestiä',
          description: 'Voit lähettää korkeintaan 3 viestiä tunnissa.',
          variant: 'destructive'
        });
        setIsSubmitting(false);
        return;
      }

      // Save to Supabase database
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name,
          email: formData.email,
          message: formData.message
        });

      if (error) {
        console.error('Database error:', error);
        throw new Error('Viestin tallennus epäonnistui');
      }

      // Update rate limit
      recentSubmissions.push(Date.now());
      localStorage.setItem(rateLimitKey, JSON.stringify(recentSubmissions));

      if (onSubmit) {
        onSubmit({ name: formData.name, email: formData.email, message: formData.message });
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: 'Virhe',
        description: 'Viestin lähetys epäonnistui. Yritä uudelleen.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }

    // Resetoi lomake 3 sekunnin kuluttua
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', message: '', honeypot: '' });
      setErrors({});
    }, 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl p-8 text-white text-center"
        role="status"
        aria-live="polite"
        ref={successRef}
      >
        <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold mb-2 text-[var(--color-text-primary)]">Kiitos viestistäsi!</h3>
        <p className="text-white/90">Vastaamme sinulle pian. Pentukoirasi on onnekkaassa!</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
    >
      <h3 className="text-2xl font-bold mb-4 flex items-center text-white">
        <span className="text-2xl mr-2">📧</span>
        Ota yhteyttä
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="contact-name" className="sr-only">Nimi</label>
          <input
            id="contact-name"
            ref={nameRef}
            type="text"
            name="name"
            placeholder="Nimesi"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            className={`w-full px-4 py-3 rounded-lg bg-white/20 border text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all ${errors.name ? 'border-red-400' : 'border-white/30'}`}
          />
          {errors.name && (
            <p id="contact-name-error" className="mt-2 text-sm text-red-200" role="alert">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="contact-email" className="sr-only">Sähköposti</label>
          <input
            id="contact-email"
            ref={emailRef}
            type="email"
            name="email"
            placeholder="Sähköpostiosoitteesi"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            className={`w-full px-4 py-3 rounded-lg bg-white/20 border text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all ${errors.email ? 'border-red-400' : 'border-white/30'}`}
          />
          {errors.email && (
            <p id="contact-email-error" className="mt-2 text-sm text-red-200" role="alert">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="contact-message" className="sr-only">Viesti</label>
          <textarea
            id="contact-message"
            ref={messageRef}
            name="message"
            placeholder="Viestisi meille..."
            rows={4}
            value={formData.message}
            onChange={handleChange}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'contact-message-error' : undefined}
            className={`w-full px-4 py-3 rounded-lg bg-white/20 border text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all resize-none ${errors.message ? 'border-red-400' : 'border-white/30'}`}
          />
          {errors.message && (
            <p id="contact-message-error" className="mt-2 text-sm text-red-200" role="alert">{errors.message}</p>
          )}
        </div>

        {/* Honeypot spam-suojaus */}
        <input type="text" name="honeypot" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" autoComplete="off" />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center justify-center">
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Lähetetään...
              </>
            ) : (
              <>
                <span className="mr-2">📤</span>
                Lähetä viesti
              </>
            )}
          </span>
        </button>
      </form>
    </motion.div>
  );
}