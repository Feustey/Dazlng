const { TextEncoder, TextDecoder } = require("util");
require("@testing-library/jest-dom");
require("jest-axe/extend-expect");

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock de next/router
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    query: {},
    pathname: "/",
    asPath: "/",
  }),
}));

// Mock de next-auth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

// Mock de next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: function (props) {
    // eslint-disable-next-line jsx-a11y/alt-text
    return "<img {...props} />";
  },
}));

// On définit React explicitement
const React = require("react");

// Mock des variables d'environnement
process.env = {
  ...process.env,
  NEXT_PUBLIC_SUPABASE_URL: "http://localhost:54321",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "dummy-key",
};

// Configuration globale pour les timeouts
jest.setTimeout(10000);

// Configuration de l'environnement de test
beforeAll(() => {
  // Suppression des avertissements console pendant les tests
  jest.spyOn(console, "warn").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  // Restauration des fonctions console
  jest.restoreAllMocks();
});

// Nettoyage après chaque test
afterEach(() => {
  jest.clearAllMocks();
});
