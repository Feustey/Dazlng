import { setupServer } from "msw/node";
import { rest } from "msw";

// Handlers par défaut pour les services utilisés dans les tests
const handlers = [
  // Network
  rest.get("/api/network/movements", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          date: "2023-01-01",
          amount: 1000000,
          type: "in",
          node: "node1",
        },
        {
          id: 2,
          date: "2023-01-02",
          amount: 2000000,
          type: "out",
          node: "node2",
        },
      ])
    );
  }),

  rest.get("/api/network/search", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: "node1", name: "ACINQ", capacity: 1000000 },
        { id: "node2", name: "Lightning Labs", capacity: 2000000 },
      ])
    );
  }),

  // Checkout
  rest.post("/api/checkout/session", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: "session_123",
        amount: 1000,
        status: "pending",
        createdAt: new Date().toISOString(),
      })
    );
  }),

  rest.get("/api/checkout/session/:sessionId", (req, res, ctx) => {
    const { sessionId } = req.params;

    if (sessionId === "invalid_id") {
      return res(ctx.status(404));
    }

    return res(
      ctx.status(200),
      ctx.json({
        id: sessionId,
        amount: 1000,
        status: "pending",
        createdAt: new Date().toISOString(),
      })
    );
  }),

  rest.patch("/api/checkout/session/:sessionId", (req, res, ctx) => {
    const { sessionId } = req.params;

    return res(
      ctx.status(200),
      ctx.json({
        id: sessionId,
        amount: 2000,
        status: "updated",
        createdAt: new Date().toISOString(),
      })
    );
  }),

  // Alby Service
  rest.post("/api/checkout/payment", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        invoice: {
          payment_hash: "hash123",
          payment_request: "lnbc...",
          amount: 1000,
        },
      })
    );
  }),

  rest.get("/api/check-payment", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        paid: true,
      })
    );
  }),

  // Fallbacks
  rest.get("*", (req, res, ctx) => {
    console.warn(`Requête GET non gérée: ${req.url.toString()}`);
    return res(ctx.status(200), ctx.json({}));
  }),

  rest.post("*", (req, res, ctx) => {
    console.warn(`Requête POST non gérée: ${req.url.toString()}`);
    return res(ctx.status(200), ctx.json({}));
  }),

  rest.patch("*", (req, res, ctx) => {
    console.warn(`Requête PATCH non gérée: ${req.url.toString()}`);
    return res(ctx.status(200), ctx.json({}));
  }),
];

export const server = setupServer(...handlers);
