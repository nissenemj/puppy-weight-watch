import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import MemoryCard from './MemoryCard';

const sdk = vi.hoisted(() => ({
  remove: vi.fn(),
  delete: vi.fn(),
  eq: vi.fn(),
  toast: vi.fn(),
}));
vi.mock('@/integrations/supabase/client', () => ({
  SUPABASE_URL: 'https://test-project.supabase.co',
  supabase: {
    from: () => ({ delete: sdk.delete }),
    storage: { from: () => ({ remove: sdk.remove }) },
  },
}));
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: sdk.toast }),
}));
vi.mock('./PrivatePuppyImage', () => ({
  PrivatePuppyImage: () => <span>Kuva</span>,
}));
vi.mock('./SocialShareGenerator', () => ({ SocialShareGenerator: () => null }));
vi.mock('./CommentSection', () => ({ default: () => null }));
vi.mock('./StickerEditor', () => ({ default: () => null }));

const PATH =
  '00000000-0000-4000-8000-000000000001/books/10000000-0000-4000-8000-000000000001/image.jpg';
const onUpdated = vi.fn();
beforeEach(() => {
  vi.resetAllMocks();
  vi.stubGlobal(
    'confirm',
    vi.fn(() => true),
  );
  sdk.remove.mockResolvedValue({ data: [{ name: PATH }], error: null });
  sdk.delete.mockReturnValue({ eq: sdk.eq });
  sdk.eq.mockResolvedValue({ error: null });
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

async function deleteMemory() {
  render(
    <MemoryCard
      memory={{
        id: 'memory-a',
        book_id: '10000000-0000-4000-8000-000000000001',
        content_type: 'image',
        content_url: PATH,
        caption: 'Ensimmäinen lenkki',
        tags: [],
        created_at: '2026-10-01T12:00:00Z',
      }}
      viewMode="list"
      onMemoryUpdated={onUpdated}
    />,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Muiston valinnat' }));
  fireEvent.click(screen.getByRole('button', { name: 'Poista' }));
  await waitFor(() => expect(sdk.toast).toHaveBeenCalled());
}

describe('memory image deletion', () => {
  it('does not treat a legacy public flag as a sharing permission', () => {
    render(
      <MemoryCard
        memory={{
          id: 'memory-a',
          book_id: 'book-a',
          content_type: 'image',
          content_url: PATH,
          tags: [],
          created_at: '2026-10-01T12:00:00Z',
          privacy_settings: { visibility: 'public' },
        }}
        viewMode="list"
        onMemoryUpdated={onUpdated}
      />,
    );
    expect(screen.getByTitle('Vain omistajalle')).toBeInTheDocument();
    expect(screen.queryByTitle('Julkinen')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Muiston valinnat' }));
    expect(
      screen.getByText('Vain omistajalle. Julkinen jakaminen ei ole käytössä.'),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Julkinen' }),
    ).not.toBeInTheDocument();
  });

  it('deletes the actual saved path before deleting the memory row', async () => {
    await deleteMemory();
    expect(sdk.remove).toHaveBeenCalledWith([PATH]);
    expect(sdk.eq).toHaveBeenCalledWith('id', 'memory-a');
    expect(sdk.remove.mock.invocationCallOrder[0]).toBeLessThan(
      sdk.delete.mock.invocationCallOrder[0],
    );
    expect(onUpdated).toHaveBeenCalledOnce();
  });

  it.each([
    { data: [], error: null },
    { data: null, error: { message: 'denied' } },
  ])('keeps the memory when storage removal is denied', async (response) => {
    sdk.remove.mockResolvedValue(response);
    await deleteMemory();
    expect(sdk.delete).not.toHaveBeenCalled();
    expect(onUpdated).not.toHaveBeenCalled();
    expect(sdk.toast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'destructive' }),
    );
  });
});
