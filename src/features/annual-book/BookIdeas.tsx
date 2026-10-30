import { useState } from "react";
import { Camera, Check, PenLine, Plus } from "lucide-react";
import AddMemoryDialog from "@/components/PuppyBook/AddMemoryDialog";

const ideas = [
  {
    title: "Ensimmäinen ilta kotona",
    question: "Mitä pentu tutki ensimmäisenä? Mihin se lopulta nukahti?",
  },
  {
    title: "Sinun hassu tapasi",
    question:
      "Mikä pieni tapa saa sinut aina hymyilemään? Kerro yksi tavallinen hetki.",
  },
  {
    title: "Meidän kommellus",
    question:
      "Mikä meni vähän hassusti? Millaisen nimen antaisit sille seikkailulle?",
  },
  {
    title: "Tämä me opittiin yhdessä",
    question: "Mitä kokeilitte ensimmäistä kertaa? Miltä onnistuminen tuntui?",
  },
];

export function BookIdeas({
  bookId,
  memories,
  dated,
  photos,
  hasLetter,
  onMemoryAdded,
  disabled,
}: {
  bookId: string;
  memories: number;
  dated: number;
  photos: number;
  hasLetter: boolean;
  onMemoryAdded: () => void;
  disabled: boolean;
}) {
  const [composer, setComposer] = useState<{
    open: boolean;
    type: "photo" | "text";
    inspiration?: (typeof ideas)[number];
  } | null>(null);
  return (
    <section className="annual-ideas" aria-labelledby="annual-ideas-title">
      <div className="annual-progress-note">
        <p className="annual-progress-heading">
          <strong>
            {memories
              ? `${memories} ${memories === 1 ? "muisto valittuna" : "muistoa valittuna"}.`
              : "Yksi pieni hetki riittää alkuun."}
          </strong>{" "}
          {memories
            ? dated === memories
              ? "Tapahtumapäivät vahvistettu."
              : `${memories - dated} muistolta puuttuu vielä tapahtumapäivä.`
            : "Kirjoita muutama lause tai lisää oma kuva. Kaikkia ideoita ei tarvitse toteuttaa."}
        </p>
        {Boolean(photos || hasLetter) && (
          <ul aria-label="Kirjaasi valittua">
            {photos > 0 && (
              <li>
                <Check size={16} aria-hidden="true" />
                {photos} {photos === 1 ? "oma kuva" : "omaa kuvaa"}
              </li>
            )}
            {hasLetter && (
              <li>
                <Check size={16} aria-hidden="true" />
                Oma kirje mukana
              </li>
            )}
          </ul>
        )}
      </div>
      <details>
        <summary id="annual-ideas-title">
          Pieni ideapankki täyttämisen tueksi
        </summary>
        <p>
          Valitse idea. Saat apukysymyksen, jonka pohjalta kirjoitat oman
          muistosi. Voit myös liittää oman kuvan.
        </p>
        <div className="annual-idea-list">
          {ideas.map((idea) => (
            <button
              key={idea.title}
              type="button"
              className="annual-idea-button"
              disabled={disabled}
              onClick={() =>
                setComposer({ open: true, type: "text", inspiration: idea })
              }
            >
              <PenLine size={18} aria-hidden="true" />
              <span>
                <strong>{idea.title}</strong>
                <small>{idea.question}</small>
              </span>
              <Plus size={18} aria-hidden="true" />
            </button>
          ))}
        </div>
      </details>
      <div className="annual-idea-actions">
        <button
          type="button"
          className="journal-text-link"
          disabled={disabled}
          onClick={() => setComposer({ open: true, type: "text" })}
        >
          <PenLine size={18} aria-hidden="true" />
          Kirjoita uusi muisto
        </button>
        <button
          type="button"
          className="journal-text-link"
          disabled={disabled}
          onClick={() => setComposer({ open: true, type: "photo" })}
        >
          <Camera size={18} aria-hidden="true" />
          Kuvita omalla kuvalla
        </button>
      </div>
      {composer && (
        <AddMemoryDialog
          isOpen={composer.open}
          onClose={() => setComposer({ ...composer, open: false })}
          bookId={bookId}
          type={composer.type}
          inspiration={composer.inspiration}
          onTypeChange={(type) => {
            if (type === "text" || type === "photo")
              setComposer({ ...composer, type });
          }}
          onMemoryAdded={onMemoryAdded}
        />
      )}
    </section>
  );
}
