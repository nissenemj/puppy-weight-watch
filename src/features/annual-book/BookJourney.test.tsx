import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { BookJourney } from "./BookJourney";
afterEach(cleanup);
it("connects each chapter to real book actions", async () => {
  const onSectionChange = vi.fn(),
    onAddMemory = vi.fn();
  render(
    <MemoryRouter>
      <BookJourney
        onSectionChange={onSectionChange}
        onAddMemory={onAddMemory}
      />
    </MemoryRouter>,
  );
  expect(screen.getAllByRole("img")).toHaveLength(4);
  await userEvent.click(
    screen.getByRole("button", { name: "Lisää ensimmäinen muisto" }),
  );
  expect(onAddMemory).toHaveBeenCalledOnce();
  await userEvent.click(
    screen.getByRole("button", { name: "Kirjaa kasvun hetki" }),
  );
  expect(onSectionChange).toHaveBeenLastCalledWith("growth");
  await userEvent.click(screen.getByRole("button", { name: "Avaa Oma kirja" }));
  expect(onSectionChange).toHaveBeenLastCalledWith("annual");
  await userEvent.click(
    screen.getByRole("button", { name: "Kokeile satukuvaa" }),
  );
  expect(onSectionChange).toHaveBeenLastCalledWith("images");
  await userEvent.click(
    screen.getByRole("button", { name: "Näin tallennat ja tulostat" }),
  );
  expect(
    screen.getByRole("region", { name: "Kirjan tallennus ja tulostus" }),
  ).toHaveTextContent("A5");
  expect(
    screen.getByRole("region", { name: "Kirjan tallennus ja tulostus" }),
  ).toHaveTextContent("Painatusta ei vielä tilata Pentulaskurin kautta");
});
it("keeps the guide available alongside existing sections", async () => {
  render(
    <MemoryRouter>
      <BookJourney compact />
    </MemoryRouter>,
  );
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
  await userEvent.click(
    screen.getByRole("button", { name: "Näytä kuvitettu ohje" }),
  );
  expect(screen.getByRole("link", { name: "Avaa Oma kirja" })).toHaveAttribute(
    "href",
    "/puppy-book?osio=vuosikirja",
  );
});
