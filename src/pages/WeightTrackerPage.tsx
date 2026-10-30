import { useState, useEffect, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import AuthenticationWrapper from "@/components/AuthenticationWrapper";
import ModernPuppyWeightTracker from "@/components/ModernPuppyWeightTracker";
import VeterinaryDisclaimer from "@/components/VeterinaryDisclaimer";
import { useGuestAuth } from "@/contexts/GuestAuthContext";
import GuestModeBar, { GuestModeBarMobile } from "@/components/GuestModeBar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Dog, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { PageIntro } from "@/components/PageIntro";
import SEO from "@/components/SEO";

const WeightTrackerPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { isGuest, guestWeightEntries, syncGuestDataToUser } = useGuestAuth();

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const [hasDogs, setHasDogs] = useState(false);
  const [checkingData, setCheckingData] = useState(true);

  const checkUserData = useCallback(
    async (userData: User) => {
      try {
        setCheckingData(true);
        // Check if user has any dogs
        const { data: dogs, error: dogsError } = await supabase
          .from("dogs")
          .select("id")
          .eq("user_id", userData.id)
          .limit(1);

        if (dogsError) {
          console.error("Error checking dogs:", dogsError);
          toast({
            title: "Virhe tietojen haussa",
            description: "Koirien tarkistaminen epäonnistui",
            variant: "destructive",
          });
        } else {
          const dogsExist = dogs && dogs.length > 0;
          setHasDogs(dogsExist);
        }
      } catch (error) {
        console.error("Error in checkUserData:", error);
        toast({
          title: "Virhe",
          description: "Tietojen lataaminen epäonnistui",
          variant: "destructive",
        });
      } finally {
        setCheckingData(false);
      }
    },
    [toast],
  );

  const retryDataLoad = () => {
    if (user) {
      checkUserData(user);
    }
  };

  useEffect(() => {
    if (user && !loading) {
      checkUserData(user);
    }
  }, [user, loading, checkUserData]);

  const handleAuthSuccess = async (user: User) => {
    setUser(user);
    setShowAuthModal(false);

    // Sync guest data if available
    if (guestWeightEntries.length > 0) {
      try {
        await syncGuestDataToUser();
        toast({
          title: "Sisäänkirjautuminen onnistui!",
          description: `Tervetuloa takaisin! ${guestWeightEntries.length} mittausta synkronoitu.`,
        });
      } catch (error) {
        toast({
          title: "Sisäänkirjautuminen onnistui!",
          description:
            "Tervetuloa takaisin! Huom: vanhoja mittauksia ei voitu synkronoida.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Sisäänkirjautuminen onnistui!",
        description: "Tervetuloa takaisin!",
      });
    }
  };

  const handleSignUpClick = () => {
    setAuthMode("signup");
    setShowAuthModal(true);
  };

  const handleSignInClick = () => {
    setAuthMode("signin");
    setShowAuthModal(true);
  };

  if (loading || (user && checkingData)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-terracotta-500 animate-spin" />
        <p className="text-stone-500 font-medium">Ladataan tietoja...</p>
      </div>
    );
  }

  // Show helpful message if authenticated user doesn't have dogs
  if (user && !hasDogs) {
    return (
      <div className="site-page site-tool">
        <PageIntro
          title="Aloita oman pennun seuranta."
          description="Lisää pennun profiili. Sen jälkeen voit tallentaa omat mittaukset ja seurata kasvun tarinaa."
        />
        <Card className="max-w-lg mx-auto">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-terracotta-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Dog className="w-8 h-8 text-terracotta-500" />
            </div>
            <CardTitle className="text-xl font-serif text-stone-900">
              Ei koiria lisättynä
            </CardTitle>
            <CardDescription className="text-stone-500">
              Painonseuranta edellyttää koiran profiilin luomista.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                Luo koirallesi profiili aloittaaksesi kasvun seurannan. Se vie
                vain hetken!
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => navigate("/onboarding")}
                className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white"
              >
                Lisää koira
              </Button>
              <Button
                variant="ghost"
                onClick={retryDataLoad}
                className="w-full text-stone-500 hover:text-stone-900"
              >
                Yritä uudelleen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="site-page site-tool site-weight-page">
      <SEO
        title="Painonseuranta: pennun painot ja kasvu"
        siteName="Pentulaskuri"
        description="Tallenna pennun painomittaukset ja seuraa muutosta ajan myötä."
        canonicalUrl="https://pentulaskuri.com/weight-tracker"
      />
      <div className="space-y-6">
        {/* Guest Mode Bar */}
        {isGuest && guestWeightEntries.length > 0 && (
          <div className="mb-6">
            {isMobile ? (
              <GuestModeBarMobile
                onSignUpClick={handleSignUpClick}
                onSignInClick={handleSignInClick}
              />
            ) : (
              <GuestModeBar
                onSignUpClick={handleSignUpClick}
                onSignInClick={handleSignInClick}
              />
            )}
          </div>
        )}

        <div className="space-y-6">
          <PageIntro
            title="Pennun kasvu, hetki kerrallaan."
            description="Tallenna painomittaukset ja seuraa muutosta ajan myötä."
          />

          <ModernPuppyWeightTracker />

          {/* Veterinary Disclaimer - E-E-A-T */}
          <VeterinaryDisclaimer variant="compact" className="mt-8" />
        </div>

        {/* Auth Modal */}
        {showAuthModal && (
          <AuthenticationWrapper
            onAuthSuccess={handleAuthSuccess}
            mode={authMode}
            onClose={() => setShowAuthModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default WeightTrackerPage;
