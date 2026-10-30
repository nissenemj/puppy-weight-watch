import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNewsletterSubscription } from "@/hooks/useNewsletterSubscription";
import {
  trackNewsletterSubscription,
  trackFooterLinkClicked,
} from "@/utils/analytics";

const links = [
  { href: "/weight-tracker", label: "Painonseuranta" },
  { href: "/calculator", label: "Ruokalaskuri" },
  { href: "/puppy-book-landing", label: "Pentukirja" },
  { href: "/guides", label: "Tietopankki" },
  { href: "/privacy", label: "Tietosuoja" },
  { href: "/terms", label: "Käyttöehdot" },
  { href: "/contact", label: "Ota yhteyttä" },
];

export default function Footer({ compact = false }: { compact?: boolean }) {
  const { subscribe, isLoading, isSubscribed } = useNewsletterSubscription();
  const [email, setEmail] = useState("");
  const id = useId();
  const handleNewsletterSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    const success = await subscribe(email);
    trackNewsletterSubscription(email, Boolean(success));
    if (success) setEmail("");
  };
  return (
    <footer className="site-footer">
      {!compact && (
        <section
          className="site-footer-newsletter"
          aria-labelledby={`${id}-title`}
        >
          <div>
            <h2 id={`${id}-title`}>Vinkkejä yhteiseen arkeen.</h2>
            <p>
              Tilaa Pentulaskurin uutiskirje. Voit peruuttaa tilauksen
              myöhemmin.
            </p>
          </div>
          <div>
            <form onSubmit={handleNewsletterSubmit}>
              <label htmlFor={`${id}-email`}>
                Sähköpostiosoite
                <input
                  id={`${id}-email`}
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sinun@email.fi"
                  required
                  disabled={isLoading || isSubscribed}
                  aria-describedby={`${id}-status`}
                />
              </label>
              <Button
                type="submit"
                disabled={isLoading || isSubscribed || !email.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                      aria-hidden="true"
                    />{" "}
                    Tilataan…
                  </>
                ) : isSubscribed ? (
                  <>
                    <CheckCircle size={18} aria-hidden="true" /> Tilattu
                  </>
                ) : (
                  <>
                    Tilaa uutiskirje <ArrowRight size={18} aria-hidden="true" />
                  </>
                )}
              </Button>
            </form>
            <p id={`${id}-status`} role="status" aria-live="polite">
              {isSubscribed
                ? "Kiitos. Tilaus on tallennettu."
                : "Sähköpostiosoitettasi käytetään uutiskirjeen lähettämiseen."}
            </p>
          </div>
        </section>
      )}
      <div className="site-footer-links">
        <div>
          <strong>Pentulaskuri</strong>
          <p>Kasvua, arkea ja yhteisiä tarinoita.</p>
        </div>
        <nav aria-label="Alatunnisteen linkit">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() =>
                trackFooterLinkClicked("footer", link.label, link.href)
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <p className="site-footer-bottom">
        © {new Date().getFullYear()} Pentulaskuri.com
      </p>
    </footer>
  );
}
