import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import MemoryGallery from "./MemoryGallery";

const sdk = vi.hoisted(() => ({ read: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: (_column: string, bookId: string) => ({
          order: () => sdk.read(bookId),
        }),
      }),
    }),
  },
}));
vi.mock("./MemoryCard", () => ({
  default: ({ memory }: { memory: { caption: string } }) => (
    <p>{memory.caption}</p>
  ),
}));

type Response = {
  data: { id: string; caption: string }[] | null;
  error: { message: string } | null;
};
function deferred() {
  let resolve!: (value: Response) => void;
  const promise = new Promise<Response>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}
beforeEach(() => sdk.read.mockReset());
afterEach(cleanup);

describe("puppy-book memory loading", () => {
  it("distinguishes a loading failure from an empty book and offers retry", async () => {
    sdk.read.mockResolvedValueOnce({
      data: null,
      error: { message: "Offline" },
    });
    const onAdd = vi.fn();
    render(<MemoryGallery bookId="book-a" onAddMemory={onAdd} />);
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Muistoja ei voitu ladata",
      ),
    );
    expect(
      screen.queryByText("Mikä hetki jäi tänään mieleen?"),
    ).not.toBeInTheDocument();
    sdk.read.mockResolvedValueOnce({ data: [], error: null });
    fireEvent.click(
      screen.getByRole("button", {
        name: "Yritä muistojen lataamista uudelleen",
      }),
    );
    await waitFor(() =>
      expect(
        screen.getByText("Mikä hetki jäi tänään mieleen?"),
      ).toBeInTheDocument(),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Lisää ensimmäinen muisto" }),
    );
    expect(onAdd).toHaveBeenCalledOnce();
  });

  it("does not display a delayed response from the previous book after switching", async () => {
    const previousBook = deferred();
    const nextBook = deferred();
    sdk.read
      .mockReturnValueOnce(previousBook.promise)
      .mockReturnValueOnce(nextBook.promise);
    const view = render(<MemoryGallery bookId="book-a" />);
    view.rerender(<MemoryGallery bookId="book-b" />);
    await act(async () => {
      nextBook.resolve({
        data: [{ id: "b", caption: "Toisen kirjan muisto" }],
        error: null,
      });
    });
    expect(screen.getByText("Toisen kirjan muisto")).toBeInTheDocument();
    await act(async () => {
      previousBook.resolve({
        data: [{ id: "a", caption: "Vanhan kirjan myöhäinen vastaus" }],
        error: null,
      });
    });
    expect(
      screen.queryByText("Vanhan kirjan myöhäinen vastaus"),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Toisen kirjan muisto")).toBeInTheDocument();
  });
});
