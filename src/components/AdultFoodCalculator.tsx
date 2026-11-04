import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ADULT_DOG_FOODS } from "@/data/adultDogFoods";
import {
  ADULT_ACTIVITIES,
  ADULT_ENERGY_SOURCE,
  adultFoodAmount,
  parseAdultWeight,
  type AdultActivity,
} from "@/utils/adultFeeding";

const number = (value: number) =>
  new Intl.NumberFormat("fi-FI", { maximumFractionDigits: 0 }).format(value);
export default function AdultFoodCalculator({
  currentWeight,
}: {
  currentWeight?: number;
}) {
  const id = useId();
  const [weight, setWeight] = useState(currentWeight?.toString() ?? "");
  const [foodId, setFoodId] = useState("");
  const [method, setMethod] = useState<"manufacturer" | "energy">(
    "manufacturer",
  );
  const [activity, setActivity] = useState<AdultActivity>("low");
  const [meals, setMeals] = useState(2);
  const [confirmed, setConfirmed] = useState(false);
  const [result, setResult] = useState<
    ReturnType<typeof adultFoodAmount> | undefined
  >();
  const [error, setError] = useState("");
  const [calculatedFor, setCalculatedFor] = useState("");
  const output = useRef<HTMLDivElement>(null);
  const food = ADULT_DOG_FOODS.find((item) => item.id === foodId);
  const signature = JSON.stringify([
    weight,
    foodId,
    method,
    activity,
    meals,
    confirmed,
  ]);
  const stale = calculatedFor !== signature;
  useEffect(() => {
    if (calculatedFor && !stale && !error) output.current?.focus();
  }, [calculatedFor, stale, error, result]);
  return (
    <section className="adult-food-panel" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>Aikuisen koiran ruoka-annos</h2>
      <p>
        Terveen, täysikasvuisen koiran ylläpitoruokintaan sen nykyisestä
        painosta. Kasvavan pennun, tiineen tai imettävän koiran, laihdutuksen ja
        sairauden ruokinta arvioidaan erikseen.
      </p>
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          const kg = parseAdultWeight(weight);
          if (kg === null) {
            setError(
              "Syötä paino välillä 0,1–150 kg. Voit käyttää pilkkua tai pistettä.",
            );
            setCalculatedFor(signature);
            document.getElementById(`${id}-weight`)?.focus();
            return;
          }
          if (!food) {
            setError(
              "Valitse käytössä oleva ruoka. Tarkista tuotteen tarkka nimi pakkauksesta.",
            );
            setCalculatedFor(signature);
            document.getElementById(`${id}-food`)?.focus();
            return;
          }
          if (!confirmed) {
            setError(
              "Vahvista, että kyse on sopivassa painossa olevan aikuisen koiran ylläpitoruokinnasta.",
            );
            setCalculatedFor(signature);
            document.getElementById(`${id}-confirm`)?.focus();
            return;
          }
          if (food.minimumWeightKg && kg < food.minimumWeightKg) {
            setError(
              `Valitse koirallesi tarkoitettu ruoka. Valitun tuotteen valmistajan taulukko alkaa ${food.minimumWeightKg} kg:sta, ja tuote on suurille aikuisille koirille.`,
            );
            setCalculatedFor(signature);
            document.getElementById(`${id}-food`)?.focus();
            return;
          }
          setError("");
          setResult(adultFoodAmount(kg, food, method, activity, meals));
          setCalculatedFor(signature);
        }}
      >
        <div className="adult-food-fields">
          <div>
            <label htmlFor={`${id}-weight`}>Nykyinen paino (kg) *</label>
            <input
              id={`${id}-weight`}
              name="adult-weight"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
              aria-invalid={!stale && error.startsWith("Syötä paino")}
              aria-describedby={`${id}-weight-help${!stale && error ? ` ${id}-error` : ""}`}
              required
            />
            <p id={`${id}-weight-help`}>
              Esimerkiksi 12,5. Tulevaa aikuispainoa tai ikää kuukausina ei
              tarvita.
            </p>
          </div>
          <div>
            <label htmlFor={`${id}-food`}>Aikuisen koiran ruoka *</label>
            <select
              id={`${id}-food`}
              name="adult-food"
              autoComplete="off"
              aria-invalid={!stale && error.startsWith("Valitse käytössä")}
              aria-describedby={!stale && error ? `${id}-error` : undefined}
              value={foodId}
              onChange={(event) => setFoodId(event.target.value)}
              required
            >
              <option value="">Valitse käytössä oleva ruoka</option>
              {ADULT_DOG_FOODS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <p>
              Aluksi kolme tarkistettua kuivaruokaa. Valikoima ei ole
              suositusjärjestys.
            </p>
          </div>
        </div>
        <fieldset>
          <legend>Laskentatapa</legend>
          <label>
            <input
              type="radio"
              name={`${id}-method`}
              checked={method === "manufacturer"}
              onChange={() => setMethod("manufacturer")}
            />{" "}
            Valmistajan taulukko
          </label>
          <label>
            <input
              type="radio"
              name={`${id}-method`}
              checked={method === "energy"}
              onChange={() => setMethod("energy")}
            />{" "}
            Yleinen energia-arvio
          </label>
        </fieldset>
        {method === "energy" && (
          <div>
            <label htmlFor={`${id}-activity`}>Päivittäinen aktiivisuus</label>
            <select
              id={`${id}-activity`}
              name="adult-activity"
              value={activity}
              onChange={(event) =>
                setActivity(event.target.value as AdultActivity)
              }
            >
              {Object.entries(ADULT_ACTIVITIES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
            <p>
              Energia-arvio on lähtökohta, ei valmistajan tuotekohtainen annos.
              Herkut ja muu ruoka kuuluvat samaan päiväenergiaan.
            </p>
          </div>
        )}
        <div>
          <label htmlFor={`${id}-meals`}>Aterioita päivässä</label>
          <select
            id={`${id}-meals`}
            name="adult-meals"
            value={meals}
            onChange={(event) => setMeals(Number(event.target.value))}
          >
            {[1, 2, 3, 4].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <label className="adult-food-confirm">
          <input
            id={`${id}-confirm`}
            name="adult-maintenance"
            type="checkbox"
            checked={confirmed}
            aria-describedby={!stale && error ? `${id}-error` : undefined}
            onChange={(event) => setConfirmed(event.target.checked)}
          />{" "}
          Koira on täysikasvuinen, terve ja sopivassa painossa. Tarkistan, että
          pakkauksen tuote vastaa valintaani.
        </label>
        {!stale && error && (
          <p id={`${id}-error`} role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="journal-button">
          Laske aikuisen ruoka-annos
        </button>
      </form>
      {calculatedFor && stale && (
        <p role="status">Tiedot muuttuivat. Laske uusi annos.</p>
      )}
      {!stale && !error && result !== undefined && food && (
        <div
          ref={output}
          tabIndex={-1}
          className="adult-food-result"
          role="region"
          aria-label="Aikuisen ruoka-annoksen tulos"
        >
          {result ? (
            <>
              <h3>
                {method === "manufacturer"
                  ? "Valmistajan taulukon päiväannos"
                  : "Suuntaa antava energia-arvio"}
              </h3>
              <p className="adult-food-amount">
                {number(result.gramsPerDay)} g / päivä
              </p>
              <p>
                {number(result.gramsPerMeal)} g / ateria, {meals} ateriaa.{" "}
                {number(result.kcalPerDay)} kcal / päivä.
              </p>
              {result.coefficient && (
                <p>
                  Energia: {result.coefficient} × ({weight} kg)<sup>0,75</sup>{" "}
                  kcal/päivä. Annos grammoina: energia ÷ {food.energyKcalPerKg}{" "}
                  kcal/kg × 1 000 g/kg.{" "}
                  <a
                    href={ADULT_ENERGY_SOURCE}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    FEDIAF 2025, taulukko VII-7 (avautuu uuteen välilehteen)
                  </a>
                  .
                </p>
              )}
            </>
          ) : (
            <>
              <h3>Valmistajan taulukossa ei ole tätä painoa.</h3>
              <p>
                Emme päättele puuttuvaa annosta. Voit tarkistaa taulukon alta
                tai valita yleisen energia-arvion ja laskea uudelleen.
              </p>
            </>
          )}
          <p>
            <a href={food.sourceUrl} target="_blank" rel="noopener noreferrer">
              Valmistajan tuote ja ruokintaohje (avautuu uuteen välilehteen)
            </a>
            . {food.sourceLocale}, tarkistettu 4.11.2026. Tarkista ajantasainen
            annos omasta pakkauksesta.
          </p>
          <p>
            Seuraa painoa ja kehon kuntoa. Tarvittava annos vaihtelee
            koirittain. Muuta annosta havaintojen ja tarvittaessa eläinlääkärin
            ohjeen perusteella.
          </p>
        </div>
      )}
      {food && (
        <details>
          <summary>Valitun ruoan tiedot ja annostelutaulukko</summary>
          <p>
            {food.name}. Aikuisen koiran täysravinto. {food.energyKcalPerKg}{" "}
            kcal/kg. Taulukon annoksia ei korjata yleisillä rotu- tai
            aktiivisuuskertoimilla.
          </p>
          <table>
            <caption>Valmistajan päiväannokset</caption>
            <thead>
              <tr>
                <th scope="col">Paino (kg)</th>
                <th scope="col">Ruokaa (g/päivä)</th>
              </tr>
            </thead>
            <tbody>
              {food.feeding.map((row) => (
                <tr key={row.weightKg}>
                  <td>{row.weightKg}</td>
                  <td>{row.gramsPerDay}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      )}
      <Link to="/weight-tracker?vaihe=aikuinen" className="journal-text-link">
        Seuraa aikuisen koiran painoa
      </Link>
    </section>
  );
}
