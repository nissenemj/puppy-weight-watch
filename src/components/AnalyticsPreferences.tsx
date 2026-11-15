import { useSyncExternalStore } from "react";
import { Link } from "react-router-dom";
import {
  getAnalyticsChoice,
  setAnalyticsChoice,
  subscribeToAnalyticsChoice,
} from "@/utils/ga4";

export function AnalyticsPreferences({ compact = false }: { compact?: boolean }) {
  const choice = useSyncExternalStore(subscribeToAnalyticsChoice, getAnalyticsChoice, () => null);
  if (compact && choice) return null;

  return (
    <section className="analytics-preferences" aria-label="Analytiikka-asetukset">
      <p>
        Voit sallia Google-analytiikan, jotta tiedämme, kuinka moni saa
        ruoka-annoksen laskettua tai tallentaa ensimmäisen punnituksen.
        {compact && <> <Link to="/cookies">Evästeasetukset</Link></>}
      </p>
      <div className="analytics-preferences-actions">
        <button type="button" aria-pressed={choice === "declined"} onClick={() => setAnalyticsChoice("declined")}>
          {choice === "allowed" ? "Peru analytiikkasuostumus" : "Jatka ilman analytiikkaa"}
        </button>
        <button type="button" aria-pressed={choice === "allowed"} onClick={() => setAnalyticsChoice("allowed")}>
          Salli analytiikka
        </button>
      </div>
      {!compact && (
        <p role="status">{choice === "allowed" ? "Analytiikka on sallittu." : "Analytiikka on pois käytöstä."}</p>
      )}
    </section>
  );
}
