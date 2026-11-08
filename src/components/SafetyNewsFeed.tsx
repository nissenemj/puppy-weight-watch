import { useEffect, useState } from "react";
import { ExternalLink, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  fetchSafetyNews,
  sourceIsCurrent,
  SAFETY_SOURCES,
  SAFETY_GUIDES,
  type SafetySnapshot,
} from "@/services/rssFeedService";

const KINDS = {
  recall: "Takaisinveto",
  warning: "Viranomaisen varoitus",
  disease: "Eläintautitiedote",
  notice: "Tiedote",
};
const date = (value: string) => new Date(value).toLocaleDateString("fi-FI");
const time = (value: string) => new Date(value).toLocaleString("fi-FI");

export default function SafetyNewsFeed({
  loadSnapshot = fetchSafetyNews,
}: {
  loadSnapshot?: typeof fetchSafetyNews;
}) {
  const [snapshot, setSnapshot] = useState<SafetySnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [archive, setArchive] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    loadSnapshot(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setSnapshot(data);
        setNow(Date.now());
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setError(
            "Tiedotteiden päivitystä ei saatu tarkistettua. Viimeksi ladattu aineisto säilyy näkyvissä. Tarkista tarvittaessa viranomaisen alkuperäissivu.",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt, loadSnapshot]);
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
      setAttempt((value) => value + 1);
    }, 5 * 60_000);
    return () => clearInterval(timer);
  }, []);

  const checks = snapshot?.checks ?? [];
  const current = SAFETY_SOURCES.filter((source) =>
    sourceIsCurrent(
      checks.find((check) => check.source_id === source.id),
      now,
    ),
  ).length;
  const allItems = [...(snapshot?.items ?? [])].sort(
    (a, b) =>
      (b.published_at ? Date.parse(b.published_at) : 0) -
      (a.published_at ? Date.parse(a.published_at) : 0),
  );
  const recent = allItems.filter(
    (item) =>
      item.published_at &&
      now - Date.parse(item.published_at) <= 90 * 24 * 60 * 60_000,
  );
  const items = archive ? allItems : recent;
  const label = error
    ? "Päivitystä ei voitu tarkistaa"
    : !snapshot
      ? "Tarkistetaan seurantaa"
      : current === SAFETY_SOURCES.length
        ? "Lähteet tarkistettu"
        : current > 0
          ? "Seuranta on osittainen"
          : "Lähteiden tarkistus puuttuu tai on vanhentunut";

  return (
    <Card
      className="min-w-0 border-stone-200 bg-white"
      aria-labelledby="safety-news-title"
    >
      <CardHeader className="gap-3">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row">
          <CardTitle
            id="safety-news-title"
            className="flex items-center gap-2 font-serif text-xl"
          >
            <ShieldCheck aria-hidden="true" className="h-5 w-5 shrink-0" />
            Turvallisuustiedotteet
          </CardTitle>
          <Button
            variant="outline"
            onClick={() => setAttempt((value) => value + 1)}
            disabled={loading}
            className="min-h-11 shrink-0"
          >
            <RefreshCw
              aria-hidden="true"
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Päivitä näkymä
          </Button>
        </div>
        <p role="status" className="text-sm text-stone-700">
          {loading ? "Ladataan seurantatietoja…" : label}
        </p>
        <p className="text-sm leading-relaxed text-stone-600">
          Ruokaviraston julkaisuista poimittuja koiriin ja lemmikkiruokiin
          liittyviä otsikoita. Avaa alkuperäinen tiedote tarkistaaksesi
          tuotteen, erän, alueen ja toimintaohjeen.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {error && (
          <p
            role="alert"
            className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950"
          >
            {error}
          </p>
        )}
        {!loading && !error && snapshot && current < SAFETY_SOURCES.length && (
          <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950">
            Kaikkien lähteiden ajantasaisuutta ei ole vahvistettu. Julkaisujen
            puuttuminen tästä näkymästä ei tarkoita, ettei varoituksia olisi.
          </p>
        )}
        <ul
          className="space-y-2 text-sm"
          aria-label="Seurattavat viranomaislähteet"
        >
          {SAFETY_SOURCES.map((source) => {
            const check = checks.find((check) => check.source_id === source.id);
            return (
              <li key={source.id} className="rounded-md bg-stone-50 p-3">
                <a
                  className="inline-flex min-h-11 items-center gap-1 underline underline-offset-4"
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {source.name}
                  <ExternalLink aria-hidden="true" className="h-3 w-3" />
                </a>
                <p className="text-xs leading-relaxed text-stone-600">
                  {check?.last_success_at
                    ? `Viimeinen onnistunut tarkistus: ${time(check.last_success_at)}.`
                    : "Onnistunutta tarkistusta ei vielä ole."}{" "}
                  {check?.status === "error"
                    ? "Viimeisin haku epäonnistui."
                    : check && !sourceIsCurrent(check, now)
                      ? "Tarkistus ei ole ajantasainen."
                      : ""}
                </p>
              </li>
            );
          })}
        </ul>
        {items.length > 0 && (
          <ul
            className="space-y-3"
            aria-label={
              archive
                ? "Kaikki tallennetut tiedotteet"
                : "Viimeisen 90 päivän tiedotteet"
            }
          >
            {items.map((item) => (
              <li
                key={item.id}
                className="space-y-2 rounded-md border border-stone-200 p-4"
              >
                <Badge variant="outline">{KINDS[item.kind]}</Badge>
                <h3 className="break-words font-semibold leading-relaxed">
                  <a
                    className="underline underline-offset-4"
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.title}
                    <span className="sr-only">
                      , avaa Ruokaviraston tiedote
                    </span>
                  </a>
                </h3>
                <p className="text-xs leading-relaxed text-stone-600">
                  {item.published_at
                    ? `Julkaistu ${date(item.published_at)}`
                    : "Julkaisupäivä ei ole saatavilla"}{" "}
                  ·{" "}
                  {
                    SAFETY_SOURCES.find(
                      (source) => source.id === item.source_id,
                    )?.name
                  }
                  {item.region
                    ? ` · ${item.region}`
                    : " · Alue ja voimassaolo: katso alkuperäinen tiedote"}
                </p>
              </li>
            ))}
          </ul>
        )}
        {!loading &&
          !error &&
          current === SAFETY_SOURCES.length &&
          items.length === 0 && (
            <p className="text-sm">
              {archive
                ? "Tarkistetuista julkaisuista ei löytynyt koiriin liittyviä tiedotteita."
                : "Seuratuista julkaisuista ei löytynyt viimeisen 90 päivän koiriin liittyviä tiedotteita."}
            </p>
          )}
        {allItems.length > recent.length && (
          <Button
            variant="outline"
            className="h-auto min-h-11 whitespace-normal"
            onClick={() => setArchive((value) => !value)}
          >
            {archive
              ? "Näytä viimeisen 90 päivän julkaisut"
              : `Näytä myös aiemmat tiedotteet (${allItems.length - recent.length})`}
          </Button>
        )}
        <p className="text-xs leading-relaxed text-stone-600">
          Vanha päiväys ei tarkoita takaisinvedon tai rajoituksen päättymistä.
          Seuranta ei kata kaikkia julkaisuja. Lähteet tarkistetaan palvelimella
          noin 30 minuutin välein.
        </p>
        <div className="border-t pt-4">
          <h3 className="font-semibold">Viranomaisen pysyvät ohjeet</h3>
          <ul>
            {SAFETY_GUIDES.map((guide) => (
              <li key={guide.url}>
                <a
                  className="inline-flex min-h-11 items-center gap-2 text-sm underline underline-offset-4"
                  href={guide.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {guide.name}
                  <ExternalLink
                    className="h-3 w-3 shrink-0"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <details className="border-t pt-4">
          <summary className="min-h-11 cursor-pointer py-3 font-semibold">
            Muita koiranomistajan uutislähteitä
          </summary>
          <p className="py-2 text-sm text-stone-600">
            Nämä linkit täydentävät viranomaisohjeita. Mukana voi olla
            järjestöjen tai yritysten tiedotteita.
          </p>
          <a
            className="inline-flex min-h-11 items-center text-sm underline"
            href="https://www.kennelliitto.fi/ajankohtaista/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Kennelliiton ajankohtaiset
          </a>
        </details>
      </CardContent>
    </Card>
  );
}
