// Mock minimal de prisma pour les tests
export const prisma = {
  user: {
    upsert: async () => ({}),
  },
  session: {
    create: async () => ({}),
  },
}; 