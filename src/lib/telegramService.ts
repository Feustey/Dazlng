const TELEGRAM_BOT_TOKEN = '8194608329:AAFW4YXono0x5QKhUlV2tA-y9p5d-HmF4aQ';
const BOT_USERNAME = 'dazlngBot';
const CHANNEL_USERNAME = 'dazlngBot';

interface TelegramMessage {
  message_id: number;
  date: number;
  text: string;
  from: {
    id: number;
    first_name: string;
    username?: string;
  };
}

interface TelegramChat {
  id: number;
  title: string;
  username: string;
  type: string;
  description?: string;
}

class TelegramService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
  }

  async getChannelInfo(): Promise<TelegramChat> {
    try {
      const response = await fetch(`${this.baseUrl}/getChat?chat_id=@${CHANNEL_USERNAME}`);
      if (!response.ok) {
        throw new Error('Failed to fetch channel info');
      }
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error fetching channel info:', error);
      throw error;
    }
  }

  async getChannelMessages(limit: number = 50): Promise<TelegramMessage[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/getUpdates?chat_id=@${CHANNEL_USERNAME}&limit=${limit}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      return data.result.map((update: any) => update.message).filter(Boolean);
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  getChannelLink(): string {
    return `https://t.me/${CHANNEL_USERNAME}`;
  }

  getBotLink(): string {
    return `https://t.me/${BOT_USERNAME}`;
  }
}

const telegramService = new TelegramService();
export default telegramService; 