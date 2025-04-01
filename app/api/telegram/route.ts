import { NextResponse } from 'next/server';
import telegramService from '@/lib/telegramService';

export async function GET() {
  try {
    const [channelInfo, messages] = await Promise.all([
      telegramService.getChannelInfo(),
      telegramService.getChannelMessages(),
    ]);

    return NextResponse.json({
      channelInfo,
      messages,
      channelLink: telegramService.getChannelLink(),
      botLink: telegramService.getBotLink(),
    });
  } catch (error) {
    console.error('Error fetching Telegram data:', error);
    
    // Même en cas d'erreur, fournir une réponse qui ne fera pas échouer le build
    return NextResponse.json({
      channelInfo: {
        id: 0,
        title: "DazLng Channel",
        username: "DazLngChannel",
        type: "channel",
        description: "Canal d'actualités et d'échanges sur DazLng. Actuellement indisponible."
      },
      messages: [{
        message_id: 1,
        date: Math.floor(Date.now() / 1000),
        text: "Le service est temporairement indisponible. Veuillez accéder directement au canal Telegram.",
        from: {
          id: 0,
          first_name: "DazLng"
        }
      }],
      channelLink: "https://t.me/DazLngChannel",
      botLink: "https://t.me/dazlngBot"
    });
  }
} 