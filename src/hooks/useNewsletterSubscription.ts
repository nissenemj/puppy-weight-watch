import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const EmailSchema = z.string().email('Sähköpostiosoite ei ole kelvollinen');

interface NewsletterSubscription {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed' | 'pending';
  subscribed_at: string;
  user_id?: string;
  source: string;
}

export const useNewsletterSubscription = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const subscribe = async (email: string) => {
    setIsLoading(true);
    
    try {
      // Validate email format
      const validatedEmail = EmailSchema.parse(email.trim().toLowerCase());
      
      // Check if already subscribed
      const { data: existing } = await supabase
        .from('newsletter_subscriptions')
        .select('id, status')
        .eq('email', validatedEmail)
        .maybeSingle();

      if (existing) {
        if (existing.status === 'active') {
          toast({
            title: "Olet jo tilannut uutiskirjeen",
            description: "Tämä sähköpostiosoite on jo rekisteröity uutiskirjeelle.",
            variant: "default"
          });
          setIsSubscribed(true);
          return { success: true, alreadySubscribed: true };
        } else if (existing.status === 'unsubscribed') {
          // Reactivate subscription
          const { error: updateError } = await supabase
            .from('newsletter_subscriptions')
            .update({ 
              status: 'active',
              subscribed_at: new Date().toISOString(),
              unsubscribed_at: null
            })
            .eq('id', existing.id);

          if (updateError) throw updateError;

          toast({
            title: "Uutiskirjetilaus aktivoitu!",
            description: "Olemme aktivoineet uutiskirjetilauksesi uudelleen. Kiitos!",
            variant: "default"
          });
          setIsSubscribed(true);
          return { success: true, reactivated: true };
        }
      }

      // Create new subscription
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert({
          email: validatedEmail,
          status: 'active',
          source: 'website_footer'
        });

      if (error) {
        // Handle unique constraint violation
        if (error.code === '23505') {
          toast({
            title: "Olet jo tilannut uutiskirjeen",
            description: "Tämä sähköpostiosoite on jo rekisteröity uutiskirjeelle.",
            variant: "default"
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Kiitos tilauksesta!",
          description: "Olet onnistuneesti tilannut uutiskirjeemme. Saat pian ensimmäisen viestin.",
          variant: "default"
        });
        setIsSubscribed(true);
      }

      return { success: true };

    } catch (error) {
      console.error('Newsletter subscription error:', error);
      
      if (error instanceof z.ZodError) {
        toast({
          title: "Virheellinen sähköpostiosoite",
          description: "Tarkista sähköpostiosoitteen oikeinkirjoitus.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Virhe tilauksessa",
          description: "Uutiskirjeen tilaaminen epäonnistui. Yritä hetken kuluttua uudelleen.",
          variant: "destructive"
        });
      }
      
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const checkSubscription = async (email: string) => {
    try {
      const validatedEmail = EmailSchema.parse(email.trim().toLowerCase());
      
      const { data } = await supabase
        .from('newsletter_subscriptions')
        .select('status')
        .eq('email', validatedEmail)
        .eq('status', 'active')
        .maybeSingle();

      return !!data;
    } catch {
      return false;
    }
  };

  const reset = () => {
    setIsSubscribed(false);
  };

  return {
    subscribe,
    checkSubscription,
    isLoading,
    isSubscribed,
    reset
  };
};