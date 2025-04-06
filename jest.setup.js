require("@testing-library/jest-dom");

// Configuration du timeout global
jest.setTimeout(10000);

// Mock des variables d'environnement
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/daznode_test";
process.env.MCP_API_URL = "http://localhost:3000/api";
process.env.JWT_SECRET = "test-secret";

// Mock des fonctions globales
const mockSetInterval = jest.fn();
const mockClearInterval = jest.fn();

global.setInterval = mockSetInterval;
global.clearInterval = mockClearInterval;

// Mock des fonctions de console pour réduire le bruit
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Mock de Prisma
jest.mock("@prisma/client", () => {
  const mockPrismaClient = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    node: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    peerOfPeer: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    capacityHistory: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

// Configuration des timers
beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

// Nettoyage des mocks avant et après chaque test
beforeEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});

afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});
