import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import StorybookGenerator from "./StorybookGenerator";
import type { StorybookClient, StorybookJob } from "@/services/storybookImages";
import { prepareStorybookPhoto } from "@/utils/prepareStorybookPhoto";

vi.mock("@/utils/prepareStorybookPhoto", () => ({
  STORYBOOK_PHOTO_ACCEPT: "image/jpeg,image/png,image/webp",
  prepareStorybookPhoto: vi.fn(
    async () => new Blob(["normalized-photo"], { type: "image/png" }),
  ),
}));
beforeAll(() => {
  URL.createObjectURL = vi.fn(() => "blob:local-photo");
  URL.revokeObjectURL = vi.fn();
});

afterEach(cleanup);
const owner = "10000000-0000-4000-8000-000000000001",
  other = "10000000-0000-4000-8000-000000000002";
const ready: StorybookJob = {
  id: "20000000-0000-4000-8000-000000000001",
  owner_id: owner,
  request_id: "30000000-0000-4000-8000-000000000001",
  spec: {
    style: "nordic-watercolor-v1",
    scene: "forest",
    dogType: "mixed",
    colour: "golden",
    coat: "fluffy",
  },
  status: "ready",
  created_at: new Date().toISOString(),
  started_at: null,
  object_path: `${owner}/image.png`,
  error_code: null,
  signed_url: "https://storage.example/image.png",
};
const clientFixture = (): StorybookClient => ({
  list: vi.fn(async () => ({ available: true, reason: null, jobs: [] })),
  get: vi.fn(async () => ready),
  uploadPhoto: vi.fn(async () => `${owner}/${ready.id}.png`),
  create: vi.fn(async () => ({
    ...ready,
    status: "queued" as const,
    signed_url: null,
  })),
  retryDelivery: vi.fn(async () => ready),
  attach: vi.fn(async () => undefined),
});
const choosePhoto = async () => {
  await userEvent.upload(
    screen.getByLabelText("Koiran kuva"),
    new File(["photo"], "private-dog-name.jpg", { type: "image/jpeg" }),
  );
  await waitFor(() =>
    expect(
      screen.getByRole("button", { name: "Luo muokattu kuva" }),
    ).toBeEnabled(),
  );
};

describe("storybook generator", () => {
  it("requires sign-in and never calls the image service for a visitor", () => {
    const client = clientFixture();
    render(
      <MemoryRouter>
        <StorybookGenerator signedIn={false} ownerId={null} client={client} />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("button", { name: "Luo muokattu kuva" }),
    ).toBeDisabled();
    expect(screen.getByRole("link", { name: "Kirjaudu sisään" })).toBeVisible();
    expect(client.list).not.toHaveBeenCalled();
  });
  it("shows that a missing provider connection is unavailable", async () => {
    const client = clientFixture();
    vi.mocked(client.list).mockResolvedValue({
      available: false,
      reason: "not_configured",
      jobs: [],
    });
    render(
      <MemoryRouter>
        <StorybookGenerator signedIn ownerId={owner} client={client} />
      </MemoryRouter>,
    );
    expect(
      await screen.findByText(/Kuvapalvelun yhteys ei ole vielä käytössä/),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Luo muokattu kuva" }),
    ).toBeDisabled();
  });
  it("sends only one request on a double submit", async () => {
    const client = clientFixture();
    let resolve: (value: StorybookJob) => void = () => undefined;
    vi.mocked(client.create).mockReturnValue(
      new Promise((done) => {
        resolve = done;
      }),
    );
    const { container } = render(
      <MemoryRouter>
        <StorybookGenerator signedIn ownerId={owner} client={client} />
      </MemoryRouter>,
    );
    await choosePhoto();
    fireEvent.submit(container.querySelector("form")!);
    fireEvent.submit(container.querySelector("form")!);
    await waitFor(() => expect(client.create).toHaveBeenCalledTimes(1));
    expect(client.uploadPhoto).toHaveBeenCalledTimes(1);
    resolve({ ...ready, status: "queued" as const, signed_url: null });
    expect(
      await screen.findByText(/Kuvapyyntö odottaa käsittelyä/),
    ).toBeVisible();
  });
  it("reuses the request id after an ambiguous browser connection failure", async () => {
    const client = clientFixture();
    vi.mocked(client.create)
      .mockRejectedValueOnce(new Error("Yhteys katkesi"))
      .mockResolvedValueOnce(ready);
    render(
      <MemoryRouter>
        <StorybookGenerator signedIn ownerId={owner} client={client} />
      </MemoryRouter>,
    );
    await choosePhoto();
    await userEvent.click(
      screen.getByRole("button", { name: "Luo muokattu kuva" }),
    );
    await userEvent.click(
      await screen.findByRole("button", {
        name: "Tarkista saman pyynnön tila",
      }),
    );
    expect(vi.mocked(client.create).mock.calls[0][0]).toBe(
      vi.mocked(client.create).mock.calls[1][0],
    );
    expect(client.uploadPhoto).toHaveBeenCalledTimes(1);
    expect(
      await screen.findByRole("img", { name: /Tekoälyllä luotu/ }),
    ).toBeVisible();
  });
  it("keeps the photo on the device until an explicit creation request and sends the selected preset", async () => {
    const client = clientFixture();
    render(
      <MemoryRouter>
        <StorybookGenerator signedIn ownerId={owner} client={client} />
      </MemoryRouter>,
    );
    await choosePhoto();
    expect(client.uploadPhoto).not.toHaveBeenCalled();
    await userEvent.click(
      screen.getByRole("radio", { name: /Koirani ihmisenä/ }),
    );
    await userEvent.type(screen.getByLabelText(/Lisätoive/), "Punainen neule");
    await userEvent.click(
      screen.getByRole("button", { name: "Luo muokattu kuva" }),
    );
    await waitFor(() =>
      expect(client.create).toHaveBeenCalledWith(expect.any(String), {
        style: "dog-photo-transform-v1",
        scene: "human",
        notes: "Punainen neule",
        inputPath: `${owner}/${ready.id}.png`,
      }),
    );
    expect(JSON.stringify(vi.mocked(client.create).mock.calls)).not.toContain(
      "private-dog-name",
    );
  });
  it("shows an invalid photo error without uploading or generating", async () => {
    const client = clientFixture();
    vi.mocked(prepareStorybookPhoto).mockRejectedValueOnce(
      new Error("Kuvaa ei voitu avata."),
    );
    render(
      <MemoryRouter>
        <StorybookGenerator signedIn ownerId={owner} client={client} />
      </MemoryRouter>,
    );
    await userEvent.upload(
      screen.getByLabelText("Koiran kuva"),
      new File(["broken"], "broken.jpg", { type: "image/jpeg" }),
    );
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Kuvaa ei voitu avata.",
    );
    expect(client.uploadPhoto).not.toHaveBeenCalled();
    expect(client.create).not.toHaveBeenCalled();
  });
  it("adds an image only on an explicit click and hides it on account change", async () => {
    const client = clientFixture();
    vi.mocked(client.list).mockResolvedValue({
      available: true,
      reason: null,
      jobs: [ready],
    });
    const props = {
      signedIn: true,
      ownerId: owner,
      client,
      bookId: "40000000-0000-4000-8000-000000000001",
    };
    const { rerender } = render(
      <MemoryRouter>
        <StorybookGenerator {...props} />
      </MemoryRouter>,
    );
    await screen.findByRole("img", { name: /Tekoälyllä luotu/ });
    expect(client.attach).not.toHaveBeenCalled();
    await userEvent.click(
      screen.getByRole("button", { name: "Lisää pentukirjaan" }),
    );
    expect(client.attach).toHaveBeenCalledWith(ready.id, props.bookId);
    rerender(
      <MemoryRouter>
        <StorybookGenerator {...props} ownerId={other} />
      </MemoryRouter>,
    );
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.queryByRole("button", { name: "Lataa PNG" }),
      ).not.toBeInTheDocument(),
    );
  });
});
