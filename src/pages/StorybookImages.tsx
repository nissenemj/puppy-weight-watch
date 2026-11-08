import StorybookGenerator from "@/components/StorybookGenerator";
import SEO from "@/components/SEO";
import { useUser } from "@/contexts/UserContext";

export default function StorybookImages() {
  const { user, loading } = useUser();
  return (
    <div className="py-4 sm:py-8">
      <SEO
        title="Koirasi kuvahaasteet ja satukuvat | Pentulaskuri"
        description="Muokkaa oman koirasi kuva prinsessaksi, ihmishahmoksi tai avaruussankariksi viidellä valmiilla tyylillä. Lataa kuva tai lisää se pentukirjaan."
      />
      {loading ? (
        <p role="status">Tarkistetaan kirjautumista…</p>
      ) : (
        <StorybookGenerator
          key={user?.id ?? "guest"}
          signedIn={!!user}
          ownerId={user?.id ?? null}
          headingLevel="h1"
        />
      )}
    </div>
  );
}
