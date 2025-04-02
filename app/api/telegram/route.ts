import { NextResponse } from "next/server";
import telegramService from "../../lib/telegramService";

export async function GET() {
  try {
    // Pour l'instant, on retourne des données statiques car le service n'est pas encore implémenté
    return NextResponse.json({
      channelInfo: {
        id: 0,
        title: "DazLng Channel",
        username: "DazLngChannel",
        type: "channel",
        description: "Canal d'actualités et d'échanges sur DazLng.",
      },
      messages: [
        {
          message_id: 1,
          date: Math.floor(Date.now() / 1000),
          text: "Bienvenue sur le canal DazLng !",
          from: {
            id: 0,
            first_name: "DazLng",
          },
        },
      ],
      channelLink: "https://t.me/DazLngChannel",
      botLink: "https://t.me/dazlngBot",
    });
  } catch (error) {
    console.error("Error fetching Telegram data:", error);

    // En cas d'erreur, fournir une réponse qui ne fera pas échouer le build
    return NextResponse.json({
      channelInfo: {
        id: 0,
        title: "DazLng Channel",
        username: "DazLngChannel",
        type: "channel",
        description:
          "Canal d'actualités et d'échanges sur DazLng. Actuellement indisponible.",
      },
      messages: [
        {
          message_id: 1,
          date: Math.floor(Date.now() / 1000),
          text: "Le service est temporairement indisponible. Veuillez accéder directement au canal Telegram.",
          from: {
            id: 0,
            first_name: "DazLng",
          },
        },
      ],
      channelLink: "https://t.me/DazLngChannel",
      botLink: "https://t.me/dazlngBot",
    });
  }
}
