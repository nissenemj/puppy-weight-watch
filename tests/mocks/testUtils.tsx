/**
 * Testausapuohjelmat React-komponenteille
 */
import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

// Luo uusi QueryClient jokaiselle testille
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Poista retry testeissä nopeuttaakseen
        retry: false,
        // Poista background refetch
        refetchOnWindowFocus: false,
        // Älä pidä dataa cachessa pitkään
        staleTime: 0,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

interface WrapperProps {
  children: React.ReactNode;
}

// Provider wrapper testeille
export function createWrapper() {
  const queryClient = createTestQueryClient();

  return function Wrapper({ children }: WrapperProps) {
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryClientProvider>
    );
  };
}

// Custom render joka sisältää providerin
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(ui, {
    wrapper: createWrapper(),
    ...options,
  });
}

// Odota että React Query -kyselyt suorittuvat
export async function waitForQueries() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

// Mock user context
export const mockUser = {
  id: "user-test",
  email: "test@example.com",
  created_at: "2024-01-01T00:00:00.000Z",
};

// Mock session
export const mockSession = {
  user: mockUser,
  access_token: "mock-access-token",
  refresh_token: "mock-refresh-token",
  expires_at: Date.now() + 3600000,
};

// Re-export testing library utilities
// eslint-disable-next-line react-refresh/only-export-components
export * from "@testing-library/react";
export { renderWithProviders as render };
