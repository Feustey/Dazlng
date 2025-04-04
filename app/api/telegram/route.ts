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
    return errorResponse("Telegram Bot Token n'est pas configuré.");
  }

  try {
    // 1. Récupérer les dernières mises à jour (messages)
    const updatesResponse = await fetch(
      `${TELEGRAM_API_BASE}/getUpdates?limit=20&allowed_updates=["message","channel_post"]`,
      {
        // Ne pas mettre en cache les updates, on veut toujours les plus récents
        cache: "no-store",
      }
    );

    if (!updatesResponse.ok) {
      const errorData: { description?: string } = await updatesResponse.json();
      console.error("Erreur API Telegram (getUpdates):", errorData.description);
      throw new Error(
        `Erreur API Telegram: ${errorData.description || "Inconnue"}`
      );
    }

    const updatesData: GetUpdatesResponse = await updatesResponse.json();

    if (!updatesData.ok || !Array.isArray(updatesData.result)) {
      console.error("Réponse invalide de getUpdates:", updatesData);
      throw new Error("Réponse invalide de l'API Telegram (getUpdates).");
    }

    // 2. Filtrer et formater les messages
    //    On extrait les messages des updates (peut être `message` ou `channel_post`)
    //    On ne garde que ceux qui ont du texte pour cet exemple
    const messages = updatesData.result
      .map((update) => update.message || update.channel_post)
      .filter(
        (msg): msg is TelegramMessage =>
          msg !== undefined && msg.text !== undefined
      )
      // Tri par date (le plus récent en premier, getUpdates les donne dans l'ordre)
      // .sort((a, b) => b.date - a.date) // Normalement déjà trié par l'API
      // On reformate pour correspondre à l'interface `TelegramMessage` attendue par le frontend
      .map((msg) => ({
        message_id: msg.message_id,
        date: msg.date,
        text: msg.text,
        // Gérer 'from' pour messages privés/groupes ou 'sender_chat' pour canaux
        from: msg.from
          ? {
              id: msg.from.id,
              first_name: msg.from.first_name,
              username: msg.from.username,
            }
          : msg.sender_chat
          ? {
              // Si envoyé par un canal, utiliser les infos du canal
              id: msg.sender_chat.id,
              first_name: msg.sender_chat.title || "Canal Inconnu", // Utiliser le titre du canal
              username: msg.sender_chat.username,
            }
          : {
              // Fallback si aucune info 'from' ou 'sender_chat'
              id: 0,
              first_name: "Inconnu",
            },
        chat: {
          // On garde les infos du chat où le message a été envoyé
          id: msg.chat.id,
          title: msg.chat.title,
          username: msg.chat.username,
          type: msg.chat.type,
        },
      }));

    // 3. (Optionnel) Récupérer info d'un canal spécifique si nécessaire
    //    Ici on suppose que le frontend veut afficher les messages *et* des infos
    //    sur UN canal spécifique (ex: le canal @DazLngBot comme dans le code frontend)
    //    Adaptez le TARGET_CHAT_ID si besoin.
    const targetChatUsername = "DazLngBot"; // Mettez le @username ou l'ID de votre canal/chat principal
    let channelInfo: TelegramChat | null = null;
    if (targetChatUsername) {
      channelInfo = await getChatInfo(`@${targetChatUsername}`); // Ou l'ID numérique si vous l'avez
    }

    // Construire le lien vers le bot et le canal (si info trouvée)
    const botUsername = (
      await (await fetch(`${TELEGRAM_API_BASE}/getMe`)).json()
    ).result.username;
    const botLink = `https://t.me/${botUsername || ""}`;
    const channelLink = channelInfo?.username
      ? `https://t.me/${channelInfo.username}`
      : botLink; // Fallback sur le bot si pas de canal

    // 4. Retourner les données formatées pour le frontend
    //    Adaptez cette structure si votre frontend attend autre chose
    const responseData = {
      // Utiliser les infos du canal récupérées ou un objet par défaut
      channelInfo: channelInfo || {
        id: 0,
        title: "Canal Telegram",
        username: targetChatUsername || "",
        type: "channel",
        description: "Infos du canal non trouvées.",
      },
      messages: messages,
      channelLink: channelLink,
      botLink: botLink,
    };

    return successResponse(responseData);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des messages Telegram:",
      error
    );
    return errorResponse(
      "Erreur lors de la récupération des messages Telegram"
    );
  }
}
