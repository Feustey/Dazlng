// Module minimal telegramService.ts pour éviter l'erreur de build

export const sendTelegramMessage = async (message: string) => {
  try {
    console.log("Simulating sending Telegram message:", message);
    return true;
  } catch (error) {
    console.error("Error sending Telegram message:", error);
    return false;
  }
};

export default { sendTelegramMessage };
