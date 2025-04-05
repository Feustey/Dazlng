import { cookies } from "next/headers";

export async function getSessionFromCookie() {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) {
    return null;
  }

  // Vérifier le format du sessionId
  if (!/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(sessionId)) {
    return null;
  }

  try {
    // Vérifier si le token est expiré
    const payload = JSON.parse(atob(sessionId.split(".")[1]));
    if (payload.exp * 1000 < Date.now()) {
      return null;
    }

    return {
      sessionId,
      email: payload.email,
      expiresAt: new Date(payload.exp * 1000),
    };
  } catch (error) {
    console.error("Erreur lors de la vérification du token:", error);
    return null;
  }
}
