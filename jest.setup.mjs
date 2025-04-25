import "@testing-library/jest-dom";
import fetch from "node-fetch";
import { TextEncoder, TextDecoder } from "util";
import { toHaveNoViolations } from "jest-axe";
import { server } from "./__tests__/mocks/server.mjs";

// Étendre les matchers
expect.extend(toHaveNoViolations);

// Configuration du fetchMock pour les tests
global.fetch = jest.fn();
global.Request = fetch.Request;
global.Response = fetch.Response;
global.Headers = fetch.Headers;

// Polyfills pour DOM API
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Global mock setup
global.ResizeObserver = ResizeObserverMock;
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock pour localStorage dans l'environnement JSDOM
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// Mock pour next-auth
jest.mock("next-auth/react", () => {
  const mockSession = {
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
    user: { name: "John Doe", email: "john@example.com" },
  };

  return {
    useSession: jest.fn(() => {
      return { data: mockSession, status: "authenticated" };
    }),
    signIn: jest.fn(),
    signOut: jest.fn(),
    getSession: jest.fn(() => Promise.resolve(mockSession)),
  };
});

// Setup MSW
beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks();
  localStorageMock.clear();
});
afterAll(() => server.close());

// Silencier les avertissements de console pendant les tests
jest.spyOn(console, "warn").mockImplementation(() => {});
jest.spyOn(console, "error").mockImplementation(() => {});

// Mock Supabase - Utilisation d'une approche différente pour éviter le problème de résolution de chemin
global.supabaseMock = {
  createClient: jest.fn(() => ({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    data: [],
    error: null,
  })),
};
