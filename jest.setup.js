// Configuration globale pour les tests
jest.setTimeout(10000); // Augmente le timeout à 10 secondes

// Mock des variables d'environnement
process.env.MONGODB_URI = 'mongodb://localhost:27017/dazlng-test';
process.env.MCP_API_URL = 'http://localhost:3000';

// Mock des fonctions globales
global.setInterval = jest.fn();
global.clearInterval = jest.fn();

// Mock des fonctions de console pour éviter le bruit dans les tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn()
};

// Réinitialisation des mocks avant chaque test
beforeEach(() => {
  jest.clearAllMocks();
});

// Nettoyage après chaque test
afterEach(() => {
  jest.clearAllMocks();
}); 