import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import SettingsDialog from './SettingsDialog';

const sdk = vi.hoisted(() => ({
  update: vi.fn(),
  eq: vi.fn(),
  toast: vi.fn(),
}));
vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: () => ({ update: sdk.update }) },
}));
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: sdk.toast }),
}));
beforeEach(() => {
  vi.resetAllMocks();
  sdk.update.mockReturnValue({ eq: sdk.eq });
  sdk.eq.mockResolvedValue({ error: null });
});
afterEach(cleanup);

it('does not offer public visibility and saves private even when the old flag was public', async () => {
  const onUpdated = vi.fn();
  render(
    <SettingsDialog
      isOpen
      onClose={() => {}}
      onBookUpdated={onUpdated}
      book={{
        id: 'book-a',
        title: 'Pennun kirja',
        theme: {},
        privacy_settings: { visibility: 'public' },
      }}
    />,
  );
  expect(
    screen.getByText(
      'Kirja ja sen kuvat ovat yksityisiä. Julkinen jakaminen ei ole käytössä.',
    ),
  ).toBeInTheDocument();
  expect(screen.getAllByRole('switch')).toHaveLength(1);
  expect(
    screen.getByRole('switch', { name: 'Salli kommentit' }),
  ).toBeInTheDocument();
  expect(sdk.update).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Tallenna' }));
  await waitFor(() => expect(onUpdated).toHaveBeenCalledOnce());
  expect(sdk.update).toHaveBeenCalledWith(
    expect.objectContaining({
      privacy_settings: expect.objectContaining({ visibility: 'private' }),
    }),
  );
});
