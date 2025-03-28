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
    return NextResponse.json(
      { error: 'Failed to fetch Telegram data' },
      { status: 500 }
    );
  }
} 