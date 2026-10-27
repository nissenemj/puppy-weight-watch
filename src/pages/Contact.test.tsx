import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Contact from "./Contact";

vi.mock("@/components/SEO", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));

let now: number;
const fetchMock = vi.fn();
beforeEach(() => {
  now = 100_000;
  vi.spyOn(Date, "now").mockImplementation(() => now);
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function form() {
  render(
    <MemoryRouter initialEntries={["/contact?aihe=muistokirja"]}>
      <Contact />
    </MemoryRouter>,
  );
  fireEvent.change(screen.getByLabelText("Nimi *"), {
    target: { value: "Esimerkkikäyttäjä" },
  });
  fireEvent.change(screen.getByLabelText("Sähköposti *"), {
    target: { value: "example@example.invalid" },
  });
  fireEvent.change(screen.getByLabelText("Viesti *"), {
    target: { value: "Haluaisin muistokirjaan oman kannen." },
  });
  return screen.getByRole("button", { name: "Lähetä viesti" }).closest("form")!;
}

describe("memory-book interest via the existing contact form", () => {
  it("prefills an editable subject without claiming that an order was placed", () => {
    form();
    expect(screen.getByLabelText("Aihe")).toHaveValue(
      "Kiinnostus muistokirjaan (hintaehdotus 14,90 €)",
    );
    fireEvent.change(screen.getByLabelText("Aihe"), {
      target: { value: "Oma kysymys muistokirjasta" },
    });
    expect(screen.getByLabelText("Aihe")).toHaveValue(
      "Oma kysymys muistokirjasta",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not report a message as sent when the timing guard blocks it, and allows retry", async () => {
    const contactForm = form();
    fireEvent.submit(contactForm);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Odota muutama sekunti",
    );
    expect(screen.queryByText("Kiitos viestistäsi!")).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
    now += 3100;
    fetchMock.mockResolvedValue({ ok: true });
    fireEvent.submit(contactForm);
    await waitFor(() =>
      expect(screen.getByText("Kiitos viestistäsi!")).toBeInTheDocument(),
    );
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, request] = fetchMock.mock.calls[0];
    expect(url).toBe("https://formspree.io/f/xbdlaeel");
    expect(request.body.get("subject")).toContain("Kiinnostus muistokirjaan");
  });

  it("keeps the message available after a delivery failure", async () => {
    const contactForm = form();
    now += 3100;
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({
        error: "Viestipalvelu ei vastaa. Yritä uudelleen.",
      }),
    });
    fireEvent.submit(contactForm);
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Viestipalvelu ei vastaa",
      ),
    );
    expect(screen.getByLabelText("Viesti *")).toHaveValue(
      "Haluaisin muistokirjaan oman kannen.",
    );
    expect(screen.queryByText("Kiitos viestistäsi!")).not.toBeInTheDocument();
  });
});
