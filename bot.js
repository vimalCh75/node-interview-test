import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import { initDB, logIncomingMessage, logNotification } from "./db.js";

dotenv.config();

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(TOKEN, { polling: true });

export function startBot() {
  initDB();

  bot.onText(/\/start/, async (msg) => {
    await bot.sendMessage(msg.chat.id, "👋 Hello! Use /help to see commands.");
    await logIncomingMessage(msg, true);
  });

  bot.onText(/\/help/, async (msg) => {
    const help = "Commands:\n/start – welcome\n/help – this help\n/status – bot status";
    await bot.sendMessage(msg.chat.id, help);
    await logIncomingMessage(msg, true);
  });

  bot.onText(/\/status/, async (msg) => {
    await bot.sendMessage(msg.chat.id, "✅ Bot is running fine!");
    await logIncomingMessage(msg, true);
  });

  bot.on("message", async (msg) => {
    if (!msg.text?.startsWith("/")) {
      await logIncomingMessage(msg, false);
    }
  });

  console.log("🤖 Telegram bot started (polling)...");
}

export async function sendMessageToChat(chatId, text) {
  try {
    const sent = await bot.sendMessage(chatId, text);
    await logNotification(chatId, text, "SENT");
    return sent;
  } catch (err) {
    await logNotification(chatId, text, `FAILED: ${err.message}`);
    throw err;
  }
}
