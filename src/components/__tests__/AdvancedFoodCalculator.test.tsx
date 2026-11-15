import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import AdvancedFoodCalculator from "../AdvancedFoodCalculator";

function select(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

function showPortion(food: string, weight: string, age: string, meals: string) {
  render(<MemoryRouter><AdvancedFoodCalculator /></MemoryRouter>);
  select("Käytössä oleva penturuoka", food);
  select("Arvioitu aikuispaino taulukossa", weight);
  select("Pennun ikä taulukossa", age);
  select("Aterioita päivässä", meals);
  fireEvent.click(screen.getByRole("button", { name: "Laske päiväannos" }));
  return within(screen.getByRole("region", { name: "Pennun ruoka-annoksen tulos" }));
}

describe("valmistajan penturuokataulukko", () => {
  it.each([
    ["hau-hau-puppy", "20", "3–4", "4", "200 g", "50 g / ateria"],
    ["brit-care-hypoallergenic-puppy", "10", "4–6", "3", "130 g", "43,3 g / ateria"],
    ["royal-canin-labrador-puppy", "32", "4", "4", "312 g", "78 g / ateria"],
  ])("näyttää oikean taulukkoannoksen ja lähteen, %s", (product, weight, age, meals, day, meal) => {
    const result = showPortion(product, weight, age, meals);
    expect(result.getByText(day, { exact: true })).toBeInTheDocument();
    expect(result.getByText(new RegExp(meal))).toBeInTheDocument();
    expect(result.getByRole("link", { name: "Valmistajan ruokintaohje" })).toHaveAttribute("href", expect.stringMatching(/^https:\/\//));
  });

  it("ei täydennä valmistajan tyhjää taulukkosolua", () => {
    const result = showPortion("brit-care-hypoallergenic-puppy", "25", "3–4", "4");
    expect(result.getByText(/taulukossa ei ole annosta/)).toBeInTheDocument();
    expect(result.queryByText(/g \/ ateria/)).not.toBeInTheDocument();
  });

  it("piilottaa vanhan tuloksen ja tyhjentää tuotekohtaiset valinnat tuotteen vaihtuessa", () => {
    showPortion("hau-hau-puppy", "20", "3–4", "4");
    select("Käytössä oleva penturuoka", "royal-canin-labrador-puppy");
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Arvioitu aikuispaino taulukossa")).toHaveValue("");
    expect(screen.getByLabelText("Pennun ikä taulukossa")).toHaveValue("");
  });
});
