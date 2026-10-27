import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AddMemoryDialog from './AddMemoryDialog';

const sdk = vi.hoisted(() => ({
  getUser: vi.fn(),
  book: vi.fn(),
  insert: vi.fn(),
  upload: vi.fn(),
  from: vi.fn(),
  toast: vi.fn(),
}));
vi.mock('@/integrations/supabase/client', () => ({
  SUPABASE_URL: 'https://test-project.supabase.co',
  supabase: {
    auth: { getUser: sdk.getUser },
    from: sdk.from,
    storage: { from: () => ({ upload: sdk.upload }) },
  },
}));
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: sdk.toast }),
}));
const OWNER = '00000000-0000-4000-8000-000000000001';
const BOOK = '10000000-0000-4000-8000-000000000001';
const onAdded = vi.fn();
let revoke: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubGlobal(
    'URL',
    class extends URL {
      static createObjectURL = vi.fn(() => 'blob:local-preview');
      static revokeObjectURL = vi.fn();
    },
  );
  revoke = vi.mocked(URL.revokeObjectURL);
  sdk.getUser.mockResolvedValue({ data: { user: { id: OWNER } }, error: null });
  sdk.book.mockResolvedValue({ data: { owner_id: OWNER }, error: null });
  sdk.upload.mockResolvedValue({ data: {}, error: null });
  sdk.insert.mockReturnValue({
    select: () => Promise.resolve({ error: null }),
  });
  sdk.from.mockImplementation((table) => {
    if (table === 'puppy_books')
      return { select: () => ({ eq: () => ({ single: sdk.book }) }) };
    if (table === 'memories') return { insert: sdk.insert };
    throw new Error(`Unexpected table: ${table}`);
  });
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function form() {
  return render(
    <AddMemoryDialog
      isOpen
      onClose={() => {}}
      bookId={BOOK}
      type="photo"
      onMemoryAdded={onAdded}
    />,
  );
}
function choosePhoto() {
  fireEvent.change(screen.getByLabelText('Valitse muiston kuva'), {
    target: {
      files: [new File(['jpeg'], 'pentu.html', { type: 'image/jpeg' })],
    },
  });
}

describe('saving private memory images', () => {
  it('checks the book owner and saves the user-prefixed object path', async () => {
    form();
    choosePhoto();
    fireEvent.click(screen.getByRole('button', { name: 'Tallenna' }));
    await waitFor(() => expect(sdk.insert).toHaveBeenCalledOnce());
    const saved = sdk.insert.mock.calls[0][0];
    expect(saved.book_id).toBe(BOOK);
    expect(saved.created_by).toBe(OWNER);
    expect(saved.content_url).toMatch(
      new RegExp(`^${OWNER}/books/${BOOK}/[0-9a-f-]{36}\\.jpg$`),
    );
    expect(sdk.upload).toHaveBeenCalledWith(
      saved.content_url,
      expect.any(File),
      expect.objectContaining({ upsert: false }),
    );
    await waitFor(() => expect(onAdded).toHaveBeenCalledOnce());
    expect(revoke).toHaveBeenCalledWith('blob:local-preview');
  });

  it('stops before upload when the selected book belongs to another user', async () => {
    sdk.book.mockResolvedValue({
      data: { owner_id: '00000000-0000-4000-8000-000000000002' },
      error: null,
    });
    form();
    choosePhoto();
    fireEvent.click(screen.getByRole('button', { name: 'Tallenna' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Sinulla ei ole oikeutta muokata tätä pentukirjaa');
    expect(screen.getByRole('alert')).toHaveFocus();
    expect(sdk.upload).not.toHaveBeenCalled();
    expect(sdk.insert).not.toHaveBeenCalled();
  });

  it('does not save a memory after a denied upload', async () => {
    sdk.upload.mockResolvedValue({
      data: null,
      error: { message: 'RLS denied' },
    });
    form();
    choosePhoto();
    fireEvent.click(screen.getByRole('button', { name: 'Tallenna' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Kuvan tallennus epäonnistui. Tarkista yhteys ja käyttöoikeus.');
    expect(sdk.insert).not.toHaveBeenCalled();
    expect(onAdded).not.toHaveBeenCalled();
  });

  it('rejects unsupported images before creating a preview or contacting storage', () => {
    form();
    fireEvent.change(screen.getByLabelText('Valitse muiston kuva'), {
      target: {
        files: [new File(['svg'], 'x.svg', { type: 'image/svg+xml' })],
      },
    });
    expect(URL.createObjectURL).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('Valitse JPEG-, PNG- tai WebP-kuva.');
    expect(screen.getByRole('button', {name:'Valitse kuva (pakollinen)'})).toHaveFocus();
    expect(sdk.upload).not.toHaveBeenCalled();
    expect(sdk.getUser).not.toHaveBeenCalled();
  });
});
