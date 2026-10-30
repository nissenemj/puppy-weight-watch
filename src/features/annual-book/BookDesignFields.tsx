import { useId } from "react";
import { Trees, Waves, Leaf } from "lucide-react";
import { type BookDesign } from "./model";
import { BookCoverPreview } from "./BookCoverPreview";

const palettes = [
  { value: "forest", name: "Metsä", color: "#245246", icon: Trees },
  { value: "lake", name: "Järvi", color: "#233f50", icon: Waves },
  { value: "berry", name: "Marja", color: "#74465c", icon: Leaf },
] as const;

export function BookDesignFields({
  design,
  puppyName,
  start,
  end,
  coverPhoto,
  onChange,
}: {
  design: BookDesign;
  puppyName: string;
  start: string;
  end: string;
  coverPhoto?: string;
  onChange: (design: BookDesign) => void;
}) {
  const letterId = useId();
  const change = (patch: Partial<BookDesign>) =>
    onChange({ ...design, ...patch });
  return (
    <div className="annual-design-fields">
      <div className="annual-cover-studio">
        <div className="annual-cover-controls">
          <label>
            Kirjan oma nimi (valinnainen)
            <input
              name="cover-title"
              value={design.title}
              maxLength={60}
              autoComplete="off"
              placeholder="Pennun ensimmäinen vuosi"
              onChange={(event) => change({ title: event.target.value })}
            />
          </label>
          <div
            role="radiogroup"
            aria-label="Kirjan kansiväri"
            className="annual-palette-options"
          >
            {palettes.map((palette) => (
              <label className="annual-radio" key={palette.value}>
                <input
                  type="radio"
                  name="book-palette"
                  value={palette.value}
                  checked={design.palette === palette.value}
                  onChange={() => change({ palette: palette.value })}
                />
                <palette.icon
                  size={26}
                  style={{ color: palette.color }}
                  aria-hidden="true"
                />
                {palette.name}
              </label>
            ))}
          </div>
          <div
            role="radiogroup"
            aria-label="Kannen kuvitus"
            className="annual-art-options"
          >
            <label className="annual-radio">
              <input
                type="radio"
                name="cover-art"
                value="photo"
                checked={design.coverArt === "photo"}
                onChange={() => change({ coverArt: "photo" })}
              />
              Oma kuva kanteen
            </label>
            <label className="annual-radio">
              <input
                type="radio"
                name="cover-art"
                value="illustration"
                checked={design.coverArt === "illustration"}
                onChange={() => change({ coverArt: "illustration" })}
              />
              Piirretty pentu kanteen
            </label>
          </div>
          <p className="annual-field-hint">
            Kanteen tulee valittujen muistojen ensimmäinen kuva tapahtumapäivän
            mukaan. Piirretty pentu on tekoälyllä tehty yleiskuvitus.
          </p>
          {design.coverArt === "photo" && !coverPhoto && (
            <p className="annual-field-hint" role="status">
              Valitse alempaa kuvamuisto ja tarkista sen tapahtumapäivä. Siihen
              asti kansimalli näyttää kuvituksen. Ilman kuvaa kirjassa käytetään
              kuvitusta.
            </p>
          )}
        </div>
        <BookCoverPreview
          design={design}
          puppyName={puppyName}
          start={start}
          end={end}
          photo={coverPhoto}
        />
      </div>
      <details className="annual-letter-editor">
        <summary>Kirje isommalle sinulle (valinnainen)</summary>
        <p id="annual-letter-idea">
          Mitä haluaisit muistaa juuri nyt? Kerro vaikka yksi tapa, joka saa
          sinut hymyilemään, ja mitä toivot yhteiseltä vuodelta.
        </p>
        <label htmlFor={letterId}>Oma kirje pennulle</label>
        <textarea
          id={letterId}
          name="book-letter"
          rows={6}
          maxLength={1200}
          value={design.letter}
          aria-describedby="annual-letter-idea annual-letter-count"
          onChange={(event) => change({ letter: event.target.value })}
          placeholder="Pieni ystäväni, haluan muistaa sinusta…"
        />
        <p id="annual-letter-count" className="annual-field-hint">
          {design.letter.length} / 1 200 merkkiä. Kirje tallentuu yksityiseen
          luonnokseen ja saa oman sivunsa kirjan loppuun.
        </p>
      </details>
    </div>
  );
}
