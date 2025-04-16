import "@testing-library/jest-dom";
import fetch from "node-fetch";
import { server } from "./__tests__/mocks/server.mjs";

// Setup fetch pour Node.js
if (!global.fetch) {
  global.fetch = fetch;
}

// Setup MSW
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock Supabase
jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => ({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    data: null,
    error: null,
  })),
}));
