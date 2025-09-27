import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, test, vi } from 'vitest';

import LoginPage from './LoginPage';
import { supabase } from '@/lib/supabaseClient';

vi.mock('@/lib/supabaseClient', () => {
  const auth = {
    getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
    signInWithOAuth: vi.fn().mockResolvedValue({ error: null }),
    signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
    signUp: vi.fn().mockResolvedValue({ error: null }),
    signInWithOtp: vi.fn().mockResolvedValue({ error: null }),
    resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
  };
  return { supabase: { auth } };
});

beforeEach(() => {
  Object.values(supabase.auth).forEach((value) => {
    if (typeof value === 'function' && 'mockClear' in value) {
      (value as vi.Mock).mockClear();
    }
  });
});

test('renders email inputs and buttons', () => {
  render(<LoginPage />);
  const [emailInput] = screen.getAllByRole('textbox');
  expect(emailInput).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /kirjaudu/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument();
});

test('validates email format', async () => {
  render(<LoginPage />);
  const [emailInput] = screen.getAllByRole('textbox');
  await userEvent.type(emailInput, 'not-an-email');
  await userEvent.click(screen.getByRole('button', { name: /kirjaudu/i }));
  expect(
    await screen.findByText(/kelvollinen/i)
  ).toBeInTheDocument();
});

