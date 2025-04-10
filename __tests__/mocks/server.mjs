import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

export const server = setupServer(
  http.get("*", () => {
    return HttpResponse.json({}, { status: 404 });
  })
);
