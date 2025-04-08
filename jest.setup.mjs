import "@testing-library/jest-dom";

// Configuration du timeout global
jest.setTimeout(10000);

// Mock des variables d'environnement
process.env.NEXT_PUBLIC_API_URL = "http://localhost:3000";
process.env.NEXT_PUBLIC_MCP_URL = "http://localhost:3001";
process.env.MONGODB_URI = "mongodb://localhost:27017/test";

// Mock des fonctions globales
global.setInterval = jest.fn();
global.clearInterval = jest.fn();

// Mock de fetch
global.fetch = jest.fn();

// Mock de localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock de window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Configuration des timers
jest.useFakeTimers();

// Nettoyage des mocks avant et après chaque test
beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.clearAllTimers();
});

// Mock de mongoose
jest.mock("mongoose", () => ({
  connect: jest.fn().mockResolvedValue({
    connection: {
      collection: jest.fn().mockReturnValue({
        deleteMany: jest.fn().mockResolvedValue({ deletedCount: 1 }),
        find: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([]),
          }),
        }),
      }),
    },
  }),
}));
