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
      
      // Get current user for authentication-aware subscriptions
      const { data: { user } } = await supabase.auth.getUser();
      
      // For authenticated users, check their existing subscriptions securely
      if (user) {
        const { data: existing } = await supabase
          .from('newsletter_subscriptions')
          .select('id, status')
          .eq('user_id', user.id)
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
      }

      // Create new subscription with proper user association
      const subscriptionData = {
        email: validatedEmail,
        status: 'active' as const,
        source: 'website_footer',
        user_id: user?.id || null  // Associate with user if authenticated
      };

      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert(subscriptionData);

      if (error) {
        // Handle unique constraint violation or other conflicts
        if (error.code === '23505') {
          toast({
            title: "Olet jo tilannut uutiskirjeen",
            description: "Tämä sähköpostiosoite on jo rekisteröity uutiskirjeelle.",
            variant: "default"
          });
        } else {
          console.error('Subscription error:', error);
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

  const unsubscribe = async (email: string) => {
    setIsLoading(true);
    
    try {
      const validatedEmail = EmailSchema.parse(email.trim().toLowerCase());
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Kirjaudu sisään",
          description: "Tilauksen peruuttaminen vaatii sisäänkirjautumisen.",
          variant: "destructive"
        });
        return { success: false, error: 'Authentication required' };
      }

      const { error } = await supabase
        .from('newsletter_subscriptions')
        .update({ 
          status: 'unsubscribed',
          unsubscribed_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('email', validatedEmail);

      if (error) throw error;

      toast({
        title: "Tilaus peruutettu",
        description: "Uutiskirjeen tilaus on peruutettu onnistuneesti.",
        variant: "default"
      });
      
      setIsSubscribed(false);
      return { success: true };

    } catch (error) {
      console.error('Newsletter unsubscription error:', error);
      
      if (error instanceof z.ZodError) {
        toast({
          title: "Virheellinen sähköpostiosoite",
          description: "Tarkista sähköpostiosoitteen oikeinkirjoitus.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Virhe tilauksen peruutuksessa",
          description: "Tilauksen peruuttaminen epäonnistui. Yritä hetken kuluttua uudelleen.",
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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Can't check subscriptions for unauthenticated users due to security restrictions
        return false;
      }
      
      const { data } = await supabase
        .from('newsletter_subscriptions')
        .select('status')
        .eq('user_id', user.id)
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
    unsubscribe,
    checkSubscription,
    isLoading,
    isSubscribed,
    reset
  };
};