import { NextResponse } from "next/server";
import telegramService from "@/app/lib/telegramService";
import {
  dynamic,
  runtime,
  errorResponse,
  successResponse,
} from "@/app/api/config";

export { dynamic, runtime };

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_BASE = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
// Optionnel: ID du chat spécifique si vous ne voulez les messages que d'un chat/canal
// const TARGET_CHAT_ID = process.env.TELEGRAM_TARGET_CHAT_ID;

// Interfaces simplifiées pour les types de l'API Telegram (adaptez si besoin)
interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage; // Message peut être optionnel (ex: channel_post)
  channel_post?: TelegramMessage; // Ajouter si vous écoutez des canaux
  // ... autres types d'update possibles
}

interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  username?: string;
  language_code?: string;
}

interface TelegramChat {
  id: number;
  title?: string;
  username?: string;
  type: "private" | "group" | "supergroup" | "channel";
}

interface TelegramMessage {
  message_id: number;
  from?: TelegramUser; // Optionnel (ex: messages de canal)
  sender_chat?: TelegramChat; // Pour les messages envoyés par un canal
  chat: TelegramChat;
  date: number; // timestamp Unix
  text?: string;
  // ... autres champs de message possibles (photo, etc.)
}

interface GetUpdatesResponse {
  ok: boolean;
  result: TelegramUpdate[];
  description?: string;
  error_code?: number;
}

// Récupérer les informations d'un chat spécifique (ex: le canal)
async function getChatInfo(
  chatId: string | number
): Promise<TelegramChat | null> {
  if (!TELEGRAM_BOT_TOKEN) {
    console.error("Telegram Bot Token n'est pas défini.");
    return null;
  }
  try {
    const response = await fetch(`${TELEGRAM_API_BASE}/getChat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId }),
      // Revalidation pour éviter le cache excessif si les infos changent peu
      next: { revalidate: 3600 }, // Revalider toutes les heures
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erreur API Telegram (getChat):", errorData.description);
      return null;
    }
    const data = await response.json();
    return data.ok ? data.result : null;
  } catch (error) {
    console.error("Erreur fetch (getChat):", error);
    return null;
  }
}

export async function GET() {
  if (!TELEGRAM_BOT_TOKEN) {
    return errorResponse("Telegram Bot Token is not configured");
  }

  try {
    const updatesResponse = await fetch(
      `${TELEGRAM_API_BASE}/getUpdates?limit=20&allowed_updates=["message","channel_post"]`,
      {
        cache: "no-store",
      }
    );

    if (!updatesResponse.ok) {
      const errorData = await updatesResponse.json();
      throw new Error(
        `Telegram API Error: ${errorData.description || "Unknown"}`
      );
    }

    const updatesData: GetUpdatesResponse = await updatesResponse.json();

    if (!updatesData.ok || !Array.isArray(updatesData.result)) {
      throw new Error("Invalid response from Telegram API");
    }

    return successResponse(updatesData.result);
  } catch (error) {
    console.error("Error fetching Telegram updates:", error);
    return errorResponse("Failed to fetch Telegram updates");
  }
}
