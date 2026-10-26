import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  puppyBookImagePath,
  validatePuppyImage,
  uploadPuppyBookImage,
  signPuppyBookImage,
  removePuppyBookImage,
  PUPPY_IMAGE_MAX_BYTES,
} from './puppyBookStorage';

const sdk = vi.hoisted(() => ({
  getUser: vi.fn(),
  upload: vi.fn(),
  createSignedUrl: vi.fn(),
  remove: vi.fn(),
  from: vi.fn(),
}));
vi.mock('@/integrations/supabase/client', () => ({
  SUPABASE_URL: 'https://test-project.supabase.co',
  supabase: { auth: { getUser: sdk.getUser }, storage: { from: sdk.from } },
}));

const OWNER = '00000000-0000-4000-8000-000000000001';
const BOOK = '10000000-0000-4000-8000-000000000001';
const ORIGIN = 'https://test-project.supabase.co';
const PATH = `${OWNER}/puppy-profile/pentu.jpg`;
const PUBLIC = `${ORIGIN}/storage/v1/object/public/puppy-books/${PATH}`;

beforeEach(() => {
  vi.resetAllMocks();
  sdk.from.mockReturnValue(sdk);
  sdk.getUser.mockResolvedValue({ data: { user: { id: OWNER } }, error: null });
  sdk.upload.mockResolvedValue({ error: null });
  sdk.createSignedUrl.mockResolvedValue({
    data: { signedUrl: 'https://signed.example/image?token=test' },
    error: null,
  });
  sdk.remove.mockResolvedValue({ data: [{ name: PATH }], error: null });
});

describe('saved puppy image references', () => {
  it.each([
    [PATH, PATH],
    [PUBLIC, PATH],
    [
      `${ORIGIN}/storage/v1/object/sign/puppy-books/${PATH}?token=old-expired-token`,
      PATH,
    ],
    [`${ORIGIN}/storage/v1/object/authenticated/puppy-books/${PATH}`, PATH],
    [
      `${ORIGIN}/storage/v1/object/public/puppy-books/${BOOK}/old%20photo.jpg`,
      `${BOOK}/old photo.jpg`,
    ],
  ])('normalizes a supported saved reference: %s', (reference, expected) => {
    expect(puppyBookImagePath(reference)).toBe(expected);
  });

  it.each([
    '',
    `https://foreign.example/storage/v1/object/public/puppy-books/${PATH}`,
    `${ORIGIN}.evil.example/storage/v1/object/public/puppy-books/${PATH}`,
    `https://user:password@test-project.supabase.co/storage/v1/object/public/puppy-books/${PATH}`,
    `${ORIGIN}/storage/v1/object/public/food-images/${PATH}`,
    `${OWNER}/../other.jpg`,
    `${OWNER}/./a.jpg`,
    `${OWNER}//a.jpg`,
    `${OWNER}/a.jpg/`,
    `${OWNER}/a\\b.jpg`,
    `${OWNER}/a\nb.jpg`,
    `${OWNER}/a%2fb.jpg`,
    `${OWNER}/a.jpg?token=stale`,
    `${ORIGIN}/storage/v1/object/public/puppy-books/${OWNER}/%2e%2e/a.jpg`,
    `${ORIGIN}/storage/v1/object/public/puppy-books/${OWNER}/../${BOOK}/a.jpg`,
    `${ORIGIN}/storage/v1/object/public/puppy-books/${OWNER}/a%2fb.jpg`,
    `${ORIGIN}/storage/v1/object/public/puppy-books/${OWNER}/%252e%252e/a.jpg`,
    `${PUBLIC}#fragment`,
    `${ORIGIN}/storage/v1/object/public/puppy-books/${OWNER}/bad%xx.jpg`,
    'blob:https://test-project.supabase.co/file',
    'data:image/png;base64,test',
    'not-a-user/file.jpg',
    `${OWNER}/`,
    OWNER,
  ])('rejects unsafe or unrelated references: %s', (reference) => {
    expect(puppyBookImagePath(reference)).toBeNull();
  });
});

describe('private uploads', () => {
  it.each(['constructor', '__proto__'])(
    'rejects a prototype property used as MIME type: %s',
    async (type) => {
      const file = new File(['data'], 'not-an-image', { type });
      expect(validatePuppyImage(file)).not.toBeNull();
      await expect(uploadPuppyBookImage(file)).rejects.toThrow('Valitse JPEG');
      expect(sdk.getUser).not.toHaveBeenCalled();
      expect(sdk.upload).not.toHaveBeenCalled();
    },
  );

  it('uses the authenticated user prefix and the MIME extension; returns a stable path', async () => {
    const file = new File(['jpeg bytes'], 'untrusted.html', {
      type: 'image/jpeg',
    });
    const path = await uploadPuppyBookImage(file, BOOK);
    expect(path).toMatch(
      new RegExp(`^${OWNER}/books/${BOOK}/[0-9a-f-]{36}\\.jpg$`),
    );
    expect(sdk.upload).toHaveBeenCalledWith(path, file, {
      contentType: 'image/jpeg',
      upsert: false,
      cacheControl: '300',
    });
    expect(sdk.from).toHaveBeenCalledWith('puppy-books');
    expect(sdk.createSignedUrl).not.toHaveBeenCalled();
    expect(path).not.toContain('http');
  });

  it('supports profile uploads without the book-ID-only legacy prefix', async () => {
    const path = await uploadPuppyBookImage(
      new File(['png'], 'a.png', { type: 'image/png' }),
    );
    expect(path).toMatch(new RegExp(`^${OWNER}/puppy-profile/`));
  });

  it('rejects missing authentication before any upload', async () => {
    sdk.getUser.mockResolvedValue({ data: { user: null }, error: null });
    await expect(
      uploadPuppyBookImage(new File(['a'], 'a.png', { type: 'image/png' })),
    ).rejects.toThrow('Kirjaudu');
    expect(sdk.upload).not.toHaveBeenCalled();
  });

  it('rejects invalid types, empty files, oversized files and invalid book IDs locally', async () => {
    const large = new File(['a'], 'a.png', { type: 'image/png' });
    Object.defineProperty(large, 'size', { value: PUPPY_IMAGE_MAX_BYTES + 1 });
    for (const file of [
      new File(['svg'], 'a.svg', { type: 'image/svg+xml' }),
      new File([], 'empty.png', { type: 'image/png' }),
      large,
    ]) {
      expect(validatePuppyImage(file)).not.toBeNull();
      await expect(uploadPuppyBookImage(file)).rejects.toThrow();
    }
    await expect(
      uploadPuppyBookImage(
        new File(['a'], 'a.png', { type: 'image/png' }),
        '../book',
      ),
    ).rejects.toThrow();
    expect(sdk.getUser).not.toHaveBeenCalled();
    expect(sdk.upload).not.toHaveBeenCalled();
  });

  it('surfaces a denied storage upload without returning a saved reference', async () => {
    sdk.upload.mockResolvedValue({ error: { message: 'RLS denied' } });
    await expect(
      uploadPuppyBookImage(new File(['a'], 'a.png', { type: 'image/png' })),
    ).rejects.toThrow('Kuvan tallennus epäonnistui');
  });
});

describe('signing and deletion', () => {
  it('signs the full saved path for five minutes instead of using the old public URL', async () => {
    await expect(signPuppyBookImage(PUBLIC)).resolves.toBe(
      'https://signed.example/image?token=test',
    );
    expect(sdk.createSignedUrl).toHaveBeenCalledWith(PATH, 300);
  });

  it('never falls back to a saved public URL if signing is denied', async () => {
    sdk.createSignedUrl.mockResolvedValue({
      data: null,
      error: { message: 'denied' },
    });
    await expect(signPuppyBookImage(PUBLIC)).rejects.toThrow(
      'Kuvaa ei voi avata',
    );
  });

  it('does not call storage for an unsafe reference', async () => {
    await expect(
      signPuppyBookImage('https://foreign.example/photo.jpg'),
    ).rejects.toThrow();
    await expect(
      removePuppyBookImage(`${OWNER}/../other.jpg`),
    ).rejects.toThrow();
    expect(sdk.from).not.toHaveBeenCalled();
  });

  it.each([
    PATH,
    `${ORIGIN}/storage/v1/object/public/puppy-books/${BOOK}/legacy.jpg`,
  ])('deletes the complete current/legacy path: %s', async (reference) => {
    await removePuppyBookImage(reference);
    expect(sdk.remove).toHaveBeenCalledWith([puppyBookImagePath(reference)]);
  });

  it.each([
    { data: null, error: { message: 'denied' } },
    { data: [], error: null },
  ])(
    'stops when deletion is denied or RLS hides the object',
    async (result) => {
      sdk.remove.mockResolvedValue(result);
      await expect(removePuppyBookImage(PATH)).rejects.toThrow(
        'Muistoa ei poistettu',
      );
    },
  );
});
