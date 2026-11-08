import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Download, Sparkles, RefreshCw, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SCENES,
  PHOTO_STYLE,
  storybookSceneName,
  type StorybookSpec,
} from "../../supabase/functions/_shared/storybook";
import {
  storybookClient,
  storybookMessage,
  StorybookApiError,
  downloadStorybookImage,
  type StorybookClient,
  type StorybookJob,
} from "@/services/storybookImages";
import {
  prepareStorybookPhoto,
  STORYBOOK_PHOTO_ACCEPT,
} from "@/utils/prepareStorybookPhoto";

const HINTS = {
  princess: "Elokuvamainen 3D-satuhahmo, pieni kruunu ja lumottu puutarha.",
  human:
    "Koirasi väreistä ja ilmeestä inspiroitunut kuvitteellinen aikuinen ihminen.",
  royal: "Öljymaalaus, samettiviitta ja arvokas palatsitunnelma.",
  yearbook: "90-luvun koulukuvauksen neule ja nostalginen studiotausta.",
  space: "Animaatiohahmo avaruuspuvussa ja keksin muotoinen kuu.",
};
const ACTIVE = new Set(["queued", "processing", "delivery_pending"]);
const stateMessage = (job: StorybookJob) => {
  if (job.status === "queued")
    return "Kuvapyyntö odottaa käsittelyä. Voit palata myöhemmin tähän näkymään.";
  if (job.status === "processing")
    return "Satukuvaa luodaan. Kuvan valmistuminen voi kestää pari minuuttia.";
  if (job.status === "delivery_pending")
    return "Kuva on luotu. Tallennetaan sitä ladattavaksi.";
  if (job.status === "delivery_failed")
    return "Kuva on luotu, mutta sen toimitus keskeytyi. Voit yrittää toimitusta uudelleen ilman uutta kuvapyyntöä.";
  if (job.status === "unknown")
    return "Kuvapyynnön lopputulosta ei voitu varmistaa. Kuvaa ei luoda uudelleen automaattisesti. Pyyntö odottaa ylläpidon tarkistusta.";
  if (job.status === "failed")
    return job.error_code === "moderation_blocked"
      ? "Kuvapalvelu ei voinut toteuttaa valintaa. Voit kokeilla toista tilannetta."
      : "Kuvapyyntö ei onnistunut. Aiemmat kuvat ovat edelleen käytettävissä.";
  return "Satukuva on valmis. Tämä on tekoälyllä luotu kuvitus.";
};

export default function StorybookGenerator({
  signedIn,
  ownerId,
  bookId,
  onShowMemories,
  headingLevel = "h2",
  client = storybookClient,
}: {
  signedIn: boolean;
  ownerId: string | null;
  bookId?: string;
  onShowMemories?: () => void;
  headingLevel?: "h1" | "h2";
  client?: StorybookClient;
}) {
  const id = useId();
  const Title = headingLevel;
  const [scene, setScene] = useState<StorybookSpec["scene"]>("princess");
  const [notes, setNotes] = useState("");
  const [photoReady, setPhotoReady] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const photo = useRef<{ blob: Blob; id: string; path?: string } | null>(null);
  const photoVersion = useRef(0);
  const [jobs, setJobs] = useState<StorybookJob[]>([]);
  const [available, setAvailable] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  const [loading, setLoading] = useState(signedIn);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [revision, setRevision] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const request = useRef<{ id: string; spec: StorybookSpec } | null>(null);
  const epoch = useRef(0);
  const submitLock = useRef(false);
  const invalidateRequests = useCallback(() => {
    epoch.current++;
    photoVersion.current++;
  }, []);
  const [uncertain, setUncertain] = useState(false);
  const [brokenImage, setBrokenImage] = useState(false);
  const ownedJobs = jobs.filter((job) => job.owner_id === ownerId);
  const current = ownedJobs.find((job) => job.id === selected) ?? ownedJobs[0];
  const active = ownedJobs.some((job) => ACTIVE.has(job.status));
  const generationDisabled =
    !signedIn ||
    !available ||
    !photoReady ||
    preparing ||
    busy ||
    loading ||
    active ||
    uncertain;

  useEffect(() => {
    invalidateRequests();
    request.current = null;
    photo.current = null;
    submitLock.current = false;
    setJobs([]);
    setSelected(null);
    setError("");
    setNotice("");
    setAvailable(false);
    setReason(null);
    setUncertain(false);
    setPhotoReady(false);
    setPreview(null);
    setBusy(false);
    setPreparing(false);
    return invalidateRequests;
  }, [ownerId, invalidateRequests]);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  useEffect(() => {
    if (!signedIn || !ownerId) {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    client
      .list(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setJobs(data.jobs.filter((job) => job.owner_id === ownerId));
        setAvailable(data.available);
        setReason(data.reason);
        setError("");
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setError(
            "Kuvapalvelun tilaa ei saatu tarkistettua. Yritä näkymän päivitystä.",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [signedIn, ownerId, client, revision]);
  useEffect(() => {
    if (!signedIn || !ownerId || !jobs.length) return;
    const controller = new AbortController();
    const timer = setInterval(
      async () => {
        try {
          const data = await client.list(controller.signal);
          if (!controller.signal.aborted) {
            setJobs(data.jobs.filter((job) => job.owner_id === ownerId));
            setAvailable(data.available);
            setReason(data.reason);
          }
        } catch {
          /* Keep the last known result; a network failure must not submit another generation. */
        }
      },
      active ? 3000 : 45_000,
    );
    return () => {
      controller.abort();
      clearInterval(timer);
    };
  }, [signedIn, ownerId, client, active, jobs.length]);
  useEffect(() => {
    setBrokenImage(false);
  }, [current?.signed_url]);

  const upsert = (job: StorybookJob) => {
    if (job.owner_id !== ownerId) return;
    setJobs((existing) => [
      job,
      ...existing.filter((item) => item.id !== job.id),
    ]);
    setSelected(job.id);
  };
  const choosePhoto = async (file?: File) => {
    const version = ++photoVersion.current;
    photo.current = null;
    setPhotoReady(false);
    setPreview(null);
    setError("");
    if (!file) return;
    setPreparing(true);
    try {
      const blob = await prepareStorybookPhoto(file);
      if (version !== photoVersion.current) return;
      photo.current = { blob, id: crypto.randomUUID() };
      setPreview(URL.createObjectURL(blob));
      setPhotoReady(true);
    } catch (cause) {
      if (version === photoVersion.current)
        setError(
          cause instanceof Error ? cause.message : "Kuvaa ei voitu avata.",
        );
    } finally {
      if (version === photoVersion.current) setPreparing(false);
    }
  };
  const generate = async (event: React.FormEvent, retry = false) => {
    event.preventDefault();
    if (
      !signedIn ||
      !ownerId ||
      submitLock.current ||
      (!retry && generationDisabled) ||
      (retry && !request.current)
    )
      return;
    submitLock.current = true;
    setBusy(true);
    setError("");
    setNotice("");
    const version = epoch.current;
    try {
      let pending = request.current;
      if (!pending) {
        const input = photo.current;
        if (!input) throw new Error("Valitse ensin kuva koirastasi.");
        const choice = { scene, notes: notes.trim() };
        input.path ??= await client.uploadPhoto(input.blob, input.id);
        if (version !== epoch.current) return;
        pending = {
          id: crypto.randomUUID(),
          spec: { style: PHOTO_STYLE, inputPath: input.path, ...choice },
        };
        request.current = pending;
      }
      const job = await client.create(pending.id, pending.spec);
      if (version !== epoch.current) return;
      upsert(job);
      request.current = null;
      setUncertain(false);
    } catch (cause) {
      if (version !== epoch.current) return;
      if (
        !request.current ||
        (cause instanceof StorybookApiError &&
          [
            "daily_limit",
            "pilot_limit",
            "budget_limit",
            "email_not_verified",
            "pilot_closed",
            "job_in_progress",
            "not_configured",
            "invalid_request",
            "input_missing",
            "input_expired",
            "input_limit",
          ].includes(cause.code))
      ) {
        if (
          cause instanceof StorybookApiError &&
          ["input_missing", "input_expired"].includes(cause.code) &&
          photo.current
        )
          photo.current = { blob: photo.current.blob, id: crypto.randomUUID() };
        request.current = null;
        setUncertain(false);
        setError(
          cause instanceof Error
            ? cause.message
            : "Kuvan lähetys ei onnistunut.",
        );
      } else {
        setUncertain(true);
        setError(
          `${cause instanceof Error ? cause.message : "Kuvapyynnön tilaa ei saatu varmistettua."} Voit tarkistaa saman pyynnön tilan alla olevalla painikkeella.`,
        );
      }
    } finally {
      if (version === epoch.current) {
        submitLock.current = false;
        setBusy(false);
      }
    }
  };
  const action = async (task: () => Promise<void>) => {
    if (submitLock.current) return;
    submitLock.current = true;
    setBusy(true);
    setError("");
    setNotice("");
    const version = epoch.current;
    try {
      await task();
    } catch (cause) {
      if (version === epoch.current)
        setError(
          cause instanceof Error
            ? cause.message
            : "Toiminto ei onnistunut. Yritä uudelleen.",
        );
    } finally {
      if (version === epoch.current) {
        submitLock.current = false;
        setBusy(false);
      }
    }
  };

  return (
    <section className="min-w-0 space-y-6" aria-labelledby={`${id}-title`}>
      <div className="space-y-3">
        <p className="text-sm text-stone-600">
          Oman koiran kuvahaasteet · rajattu kokeilu
        </p>
        <Title id={`${id}-title`} className="font-serif text-3xl">
          Pentukirjan satukuvat
        </Title>
        <p className="max-w-2xl leading-relaxed text-stone-700">
          Miltä koirasi näyttäisi ihmisenä tai animaatiosadun prinsessana?
          Valitse kuva koirastasi ja hauska muokkaustyyli. Saat kuvan
          ladattavaksi tai pentukirjan muistoihin.
        </p>
      </div>
      {!signedIn && (
        <div className="rounded-md border bg-stone-50 p-4">
          <p className="mb-3">
            Kirjaudu sisään nähdäksesi omat kuvasi ja kokeilun käyttöoikeuden.
          </p>
          <Button asChild className="min-h-11">
            <Link to="/login">Kirjaudu sisään</Link>
          </Button>
        </div>
      )}
      {signedIn && !loading && !available && reason && (
        <p
          role="status"
          className="rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950"
        >
          {storybookMessage(reason)}
        </p>
      )}
      <form
        onSubmit={generate}
        className="space-y-5 rounded-lg border border-stone-200 bg-white p-4 sm:p-6"
      >
        <fieldset
          disabled={busy || active || uncertain}
          className="min-w-0 space-y-3"
        >
          <legend className="mb-3 font-semibold">
            1. Valitse kuva koirastasi
          </legend>
          <label htmlFor={`${id}-photo`} className="block text-sm">
            Koiran kuva
          </label>
          <input
            id={`${id}-photo`}
            type="file"
            accept={STORYBOOK_PHOTO_ACCEPT}
            aria-describedby={`${id}-photo-help`}
            onChange={(event) => void choosePhoto(event.target.files?.[0])}
            className="block min-h-12 w-full min-w-0 max-w-full rounded-md border border-stone-400 p-2 text-base file:mr-3 file:min-h-11 file:rounded file:border-0 file:bg-stone-100 file:px-3"
          />
          <p id={`${id}-photo-help`} className="text-sm text-stone-600">
            JPG, PNG tai WebP, enintään 5 Mt. Yksi koira, selvästi näkyvät
            kasvot ja hyvä valo auttavat. Käytä kuvaa, jonka käyttöön sinulla on
            lupa.
          </p>
          {preparing && (
            <p role="status">Valmistellaan kuvaa omalla laitteellasi…</p>
          )}
          {preview && (
            <img
              src={preview}
              width={1024}
              height={1024}
              alt="Valittu lähtökuva koirastasi"
              className="max-h-64 w-full rounded-md bg-stone-50 object-contain"
            />
          )}
        </fieldset>
        <fieldset disabled={busy || active || uncertain}>
          <legend className="mb-3 font-semibold">2. Valitse muokkaus</legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {SCENES.map((option) => (
              <label
                key={option.id}
                className={`flex min-h-20 cursor-pointer items-start gap-3 rounded-md border p-4 ${scene === option.id ? "border-primary bg-stone-50" : "border-stone-300"}`}
              >
                <input
                  type="radio"
                  name={`${id}-scene`}
                  value={option.id}
                  checked={scene === option.id}
                  onChange={() => setScene(option.id)}
                  className="mt-1 shrink-0"
                />
                <span className="text-sm leading-relaxed">
                  <span className="block font-semibold">{option.name}</span>
                  <span className="text-stone-600">{HINTS[option.id]}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <label className="block text-sm" htmlFor={`${id}-notes`}>
          Lisätoive, vapaaehtoinen
          <textarea
            id={`${id}-notes`}
            disabled={busy || active || uncertain}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            maxLength={240}
            rows={2}
            placeholder="Esimerkiksi violetti mekko tai vihreä avaruuspuku"
            className="mt-2 block w-full rounded-md border border-stone-400 p-3 text-base"
          />
        </label>
        <p className="text-sm leading-relaxed text-stone-600">
          Kuva lähetetään OpenAI:lle vasta painamalla Luo muokattu kuva.
          Lähetyksestä poistetaan alkuperäinen tiedostonimi ja kuvan metatiedot.
          Lähtökuva säilyy yksityisenä ja poistetaan automaattisessa
          siivouksessa vuorokauden kuluttua. Tulos on tekoälyn tulkinta, ja
          tuntomerkit voivat muuttua.{" "}
          <Link to="/privacy" className="underline underline-offset-2">
            Tietosuoja
          </Link>
        </p>
        <p className="text-xs leading-relaxed text-stone-600">
          Kokeilussa enintään kaksi kuvapyyntöä päivässä käyttöoikeuden
          saaneelle tilille. Ensimmäinen yhteinen laatukoe on rajattu kymmeneen
          kuvaan.
        </p>
        <Button
          type="submit"
          disabled={generationDisabled}
          className="h-auto min-h-12 w-full whitespace-normal sm:w-auto"
        >
          <Sparkles aria-hidden="true" className="mr-2 h-4 w-4 shrink-0" />
          {busy ? "Käsitellään…" : "Luo muokattu kuva"}
        </Button>
      </form>
      {loading && <p role="status">Tarkistetaan kuvapalvelua…</p>}
      {error && (
        <p
          role="alert"
          className="rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950"
        >
          {error}
        </p>
      )}
      {uncertain && (
        <Button
          variant="outline"
          className="h-auto min-h-11 whitespace-normal"
          disabled={busy}
          onClick={(event) => void generate(event, true)}
        >
          Tarkista saman pyynnön tila
        </Button>
      )}
      {signedIn && (
        <Button
          variant="outline"
          className="min-h-11"
          disabled={busy || loading}
          onClick={() => setRevision((value) => value + 1)}
        >
          <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
          Päivitä omat kuvat
        </Button>
      )}
      {notice && (
        <p role="status" className="rounded-md bg-stone-50 p-4 text-sm">
          {notice}
        </p>
      )}
      {current && current.owner_id === ownerId && (
        <div className="space-y-4 rounded-lg border p-4 sm:p-6">
          <h3 className="font-serif text-xl">
            {storybookSceneName(current.spec.scene)}
          </h3>
          <p role="status" className="text-sm leading-relaxed">
            {stateMessage(current)}
          </p>
          {current.status === "ready" && current.signed_url && !brokenImage && (
            <img
              src={current.signed_url}
              onError={() => setBrokenImage(true)}
              alt={`Tekoälyllä luotu kuva: ${storybookSceneName(current.spec.scene)}`}
              width={1024}
              height={1024}
              className="mx-auto aspect-square w-full max-w-lg rounded-md object-contain"
            />
          )}
          {brokenImage && (
            <p className="text-sm">
              Kuvan esikatselulinkki ei toimi. Päivitä omat kuvat tai kokeile
              latausta uudelleen.
            </p>
          )}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {current.status === "ready" && (
              <>
                <Button
                  variant="outline"
                  disabled={busy}
                  className="min-h-12"
                  onClick={() =>
                    void action(() =>
                      downloadStorybookImage(client, current.id),
                    )
                  }
                >
                  <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                  Lataa PNG
                </Button>
                {bookId ? (
                  <Button
                    disabled={busy}
                    className="min-h-12"
                    onClick={() =>
                      void action(async () => {
                        await client.attach(current.id, bookId);
                        if (current.owner_id === ownerId)
                          setNotice(
                            "Satukuva lisättiin pentukirjan Muistot-osioon. Aiemmat sivut ja luonnoksesi säilyivät.",
                          );
                      })
                    }
                  >
                    <BookOpen className="mr-2 h-4 w-4" aria-hidden="true" />
                    Lisää pentukirjaan
                  </Button>
                ) : (
                  <Button asChild variant="outline" className="min-h-12">
                    <Link to="/puppy-book?osio=satukuvat">
                      Valitse pentukirja kuvalle
                    </Link>
                  </Button>
                )}
              </>
            )}
            {current.status === "delivery_failed" && (
              <Button
                variant="outline"
                className="h-auto min-h-12 whitespace-normal"
                disabled={busy}
                onClick={() =>
                  void action(async () =>
                    upsert(await client.retryDelivery(current.id)),
                  )
                }
              >
                Yritä kuvan toimitusta uudelleen
              </Button>
            )}
            {onShowMemories && notice && (
              <Button
                variant="outline"
                className="min-h-12"
                onClick={onShowMemories}
              >
                Näytä muisto
              </Button>
            )}
          </div>
        </div>
      )}
      {ownedJobs.length > 1 && (
        <div>
          <h3 className="mb-3 font-semibold">Omat satukuvat</h3>
          <ul className="flex flex-wrap gap-2">
            {ownedJobs.map((job, index) => (
              <li key={job.id}>
                <Button
                  variant={current?.id === job.id ? "default" : "outline"}
                  className="h-auto min-h-11 whitespace-normal text-left"
                  onClick={() => {
                    setSelected(job.id);
                    setNotice("");
                  }}
                >
                  {storybookSceneName(job.spec.scene)}{" "}
                  {ownedJobs.length - index}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
