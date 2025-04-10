import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";
import { server } from "@/__tests__/mocks/server.mjs";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
