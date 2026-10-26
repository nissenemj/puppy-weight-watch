import { createRef } from 'react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
} from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PrivatePuppyImage } from './PrivatePuppyImage';

const state = vi.hoisted(() => ({
  userId: '00000000-0000-4000-8000-000000000001' as string | null,
  loading: false,
  sign: vi.fn(),
}));
vi.mock('@/contexts/UserContext', () => ({
  useUser: () => ({
    user: state.userId ? { id: state.userId } : null,
    loading: state.loading,
    isAuthenticated: !!state.userId,
  }),
}));
vi.mock('@/integrations/supabase/client', () => ({
  SUPABASE_URL: 'https://test-project.supabase.co',
  supabase: { storage: { from: () => ({ createSignedUrl: state.sign }) } },
}));

const A = '00000000-0000-4000-8000-000000000001';
const B = '00000000-0000-4000-8000-000000000002';
const PATH = `${A}/puppy-profile/a.jpg`;
const PUBLIC = `https://test-project.supabase.co/storage/v1/object/public/puppy-books/${PATH}`;
const SIGNED_A =
  'https://test-project.supabase.co/storage/v1/object/sign/puppy-books/a?token=account-a';
let client: QueryClient;

beforeEach(() => {
  state.userId = A;
  state.loading = false;
  state.sign
    .mockReset()
    .mockResolvedValue({ data: { signedUrl: SIGNED_A }, error: null });
  // Even if the app later enables previous-data placeholders, never render the old user's URL.
  client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, placeholderData: keepPreviousData },
    },
  });
});
afterEach(() => {
  cleanup();
  client.clear();
  vi.useRealTimers();
});

function image(src = PUBLIC) {
  return (
    <QueryClientProvider client={client}>
      <PrivatePuppyImage src={src} alt="Pennun kuva" />
    </QueryClientProvider>
  );
}

describe('private image display', () => {
  it('stops after both the signed image and the explicit fallback fail', async () => {
    const fallback = 'https://placeholder.example/puppy.jpg';
    const { container } = render(
      <QueryClientProvider client={client}>
        <PrivatePuppyImage src={PUBLIC} alt="Pentu" fallbackSrc={fallback} />
      </QueryClientProvider>,
    );
    await waitFor(() =>
      expect(container.querySelector('img')).toHaveAttribute('src', SIGNED_A),
    );
    fireEvent.error(container.querySelector('img')!);
    expect(container.querySelector('img')).toHaveAttribute('src', fallback);
    fireEvent.error(container.querySelector('img')!);
    expect(container.querySelector('img')).toBeNull();
    expect(state.sign).toHaveBeenCalledOnce();
  });

  it('renders only a newly signed URL and forwards the image ref', async () => {
    const ref = createRef<HTMLImageElement>();
    const { container } = render(
      <QueryClientProvider client={client}>
        <PrivatePuppyImage src={PUBLIC} alt="Pentu" ref={ref} />
      </QueryClientProvider>,
    );
    expect(container.querySelector('img')).toBeNull();
    await waitFor(() => expect(ref.current).toHaveAttribute('src', SIGNED_A));
    expect(ref.current).toHaveAttribute('referrerpolicy', 'no-referrer');
    expect(state.sign).toHaveBeenCalledWith(PATH, 300);
  });

  it('does not render the original public URL when signing is denied', async () => {
    state.sign.mockResolvedValue({ data: null, error: { message: 'denied' } });
    const { container } = render(image());
    await screen.findByRole('img', {
      name: 'Pennun kuva: kuva ei ole saatavilla',
    });
    expect(container.querySelector('img')).toBeNull();
    expect(container.innerHTML).not.toContain(PUBLIC);
  });

  it('removes the previous account URL immediately on an account change', async () => {
    const { rerender, container } = render(image());
    await waitFor(() =>
      expect(container.querySelector('img')).toHaveAttribute('src', SIGNED_A),
    );
    state.userId = B;
    state.sign.mockResolvedValue({
      data: null,
      error: { message: 'B denied' },
    });
    rerender(image());
    expect(container.querySelector('img')).toBeNull();
    await screen.findByRole('img', {
      name: 'Pennun kuva: kuva ei ole saatavilla',
    });
    expect(container.innerHTML).not.toContain('account-a');
  });

  it('does not reveal an in-flight response after logout', async () => {
    let complete!: (value: {
      data: { signedUrl: string };
      error: null;
    }) => void;
    state.sign.mockReturnValue(
      new Promise((resolve) => {
        complete = resolve;
      }),
    );
    const { rerender, container } = render(image());
    await waitFor(() => expect(state.sign).toHaveBeenCalledOnce());
    state.userId = null;
    rerender(image());
    await act(async () => {
      complete({ data: { signedUrl: SIGNED_A }, error: null });
    });
    expect(container.querySelector('img')).toBeNull();
    expect(container.innerHTML).not.toContain('account-a');
  });

  it('does not reuse the previous image URL while a new path is loading', async () => {
    const { rerender, container } = render(image());
    await waitFor(() =>
      expect(container.querySelector('img')).toHaveAttribute('src', SIGNED_A),
    );
    state.sign.mockReturnValue(new Promise(() => {}));
    rerender(image(`${A}/puppy-profile/new.jpg`));
    expect(container.querySelector('img')).toBeNull();
  });

  it.each([null, 'https://foreign.example/photo.jpg'])(
    'does not sign without a user or with an invalid reference: %s',
    async (reference) => {
      if (reference === null) state.userId = null;
      const { container } = render(image(reference ?? PUBLIC));
      expect(container.querySelector('img')).toBeNull();
      expect(state.sign).not.toHaveBeenCalled();
    },
  );

  it('hides a failed image request without trying its old public URL', async () => {
    const { container } = render(image());
    await waitFor(() =>
      expect(container.querySelector('img')).toHaveAttribute('src', SIGNED_A),
    );
    fireEvent.error(container.querySelector('img')!);
    expect(container.querySelector('img')).toBeNull();
    expect(state.sign).toHaveBeenCalledOnce();
  });

  it('refreshes before the five-minute expiry and hides data after a denied refresh', async () => {
    vi.useFakeTimers();
    const { container } = render(image());
    await act(async () => {
      await vi.advanceTimersByTimeAsync(10);
    });
    expect(container.querySelector('img')).toHaveAttribute('src', SIGNED_A);
    state.sign.mockResolvedValue({
      data: null,
      error: { message: 'ownership revoked' },
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(240_010);
    });
    expect(state.sign).toHaveBeenCalledTimes(2);
    expect(container.querySelector('img')).toBeNull();
  });
});
