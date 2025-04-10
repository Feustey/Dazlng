import { http, HttpResponse } from "msw";

export const handlers = [
  // Mock pour la création de session
  http.post("/api/checkout/session", () => {
    return HttpResponse.json({
      id: "123",
      userId: "456",
      amount: 1000,
      status: "pending",
    });
  }),

  // Mock pour la récupération de session
  http.get("/api/checkout/session/:id", ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      userId: "456",
      amount: 1000,
      status: "pending",
    });
  }),

  // Mock pour la mise à jour de session
  http.patch("/api/checkout/session/:id", ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      userId: "456",
      amount: 1000,
      status: "completed",
    });
  }),
];
