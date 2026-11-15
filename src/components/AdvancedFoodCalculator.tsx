import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { PUPPY_DOG_FOODS } from "@/data/puppyDogFoods";
import { trackGa4FoodResult } from "@/utils/ga4";

const grams = new Intl.NumberFormat("fi-FI", { maximumFractionDigits: 1 });
const checkedDate = new Intl.DateTimeFormat("fi-FI", { timeZone: "UTC" });

export default function AdvancedFoodCalculator() {
  const id = useId();
  const resultRegion = useRef<HTMLDivElement>(null);
  const [foodId, setFoodId] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [age, setAge] = useState("");
  const [meals, setMeals] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [stale, setStale] = useState(false);
  const food = PUPPY_DOG_FOODS.find((item) => item.id === foodId);
  const row = food?.rows.find((item) => item.weightKg === weightKg);
  const amount = row?.gramsPerDay[food?.ages.indexOf(age) ?? -1] ?? null;

  function revealResult() {
    resultRegion.current?.focus({ preventScroll: true });
    resultRegion.current?.scrollIntoView?.({ block: "start" });
  }

  useEffect(() => {
    if (submitted) revealResult();
  }, [submitted]);

  return (
    <div className={`food-calculator-workspace${food && submitted ? " has-result" : ""}`}>
      <Card className="food-input-panel">
        <CardHeader>
          <h2 className="food-panel-title">Pennun ruoka-annos</h2>
          <CardDescription>
            Valitse ruoka ja valmistajan taulukossa ilmoitettu ikä sekä arvioitu aikuispaino.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onChange={() => {
              if (submitted) setStale(true);
              setSubmitted(false);
            }}
            onSubmit={(event) => {
              event.preventDefault();
              setStale(false);
              setSubmitted(true);
              if (submitted) revealResult();
              if (amount !== null) trackGa4FoodResult("puppy", "table");
            }}
          >
            <label className="puppy-food-field">
              Käytössä oleva penturuoka
              <select value={foodId} onChange={(event) => {
                setFoodId(event.target.value);
                setAge("");
                setWeightKg("");
              }} required>
                <option value="">Valitse ruoka</option>
                {PUPPY_DOG_FOODS.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </label>
            {food && (
              <>
                <label className="puppy-food-field">
                  Arvioitu aikuispaino taulukossa
                  <select value={weightKg} onChange={(event) => setWeightKg(event.target.value)}
                    aria-describedby={`${id}-weight-hint`} required>
                    <option value="">Valitse taulukon paino</option>
                    {food.rows.map((item) => (
                      <option key={item.weightKg} value={item.weightKg}>{item.weightKg} kg</option>
                    ))}
                  </select>
                </label>
                <p id={`${id}-weight-hint`} className="site-field-hint">
                  Valitse valmistajan ilmoittama painorivi. Jos sopivaa arvoa ei löydy, katso tuotepakkauksen ohje.
                </p>
                <label className="puppy-food-field">
                  Pennun ikä taulukossa
                  <select value={age} onChange={(event) => setAge(event.target.value)} required>
                    <option value="">Valitse ikä</option>
                    {food.ages.map((item) => <option key={item} value={item}>{item} kk</option>)}
                  </select>
                </label>
                <label className="puppy-food-field">
                  Aterioita päivässä
                  <select value={meals} onChange={(event) => setMeals(event.target.value)} required>
                    <option value="">Valitse aterioiden määrä</option>
                    {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}</option>)}
                  </select>
                </label>
              </>
            )}
            <Button type="submit" className="min-h-11 w-full" disabled={!food}>
              Laske päiväannos
            </Button>
            {stale && <p role="status" className="food-stale-notice">Valinta muuttui. Laske uusi annos.</p>}
          </form>
        </CardContent>
      </Card>

      {food && submitted && (
        <Card className="food-result-panel" ref={resultRegion} tabIndex={-1}
          role="region" aria-label="Pennun ruoka-annoksen tulos">
          <CardHeader>
            <h2 className="food-panel-title">{amount === null
              ? "Valmistajan taulukossa ei ole annosta tälle yhdistelmälle"
              : "Valmistajan taulukkoannos"}</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {amount === null ? (
              <><p>{food.name}</p><p>Tarkista annos pakkauksesta tai kysy valmistajalta.</p></>
            ) : (
              <>
                <p className="food-result-total"><strong>{amount} g</strong> päivässä</p>
                <p>{grams.format(amount / Number(meals))} g / ateria, {meals} ateriaa päivässä.</p>
                <p>{food.name}. Taulukon valinta: {weightKg} kg aikuisena, {age} kk.</p>
              </>
            )}
            <p>
              <a className="journal-text-link" href={food.sourceUrl}>Valmistajan ruokintaohje</a>
              {food.chartUrl && <> · <a className="journal-text-link" href={food.chartUrl}>Pakkauksen annostelutaulukko</a></>}.
              {" "}{food.sourceLocale}, tarkistettu {checkedDate.format(new Date(food.checkedAt))}.
              Tarkista ohje oman ruokapakkauksesi versiosta.
            </p>
            {amount !== null && (
              <Link to="/weight-tracker#uusi-punnitus" className="site-link">
                Tallenna pennun paino
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="food-notes-panel">
        <CardHeader><h2 className="food-panel-title">Jos et löydä omaa ruokaasi</h2></CardHeader>
        <CardContent className="space-y-3">
          <p>Laskuri kattaa tarkistetut tuotteet. Katso muun ruoan annos pakkauksesta tai valmistajan sivulta.</p>
          <Link className="journal-text-link" to="/guides/feeding">Lue pennun ruokintaohjeet</Link>
        </CardContent>
      </Card>
    </div>
  );
}
