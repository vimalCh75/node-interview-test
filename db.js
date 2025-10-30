// db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let pool;

export async function initDB() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 5,
    });
    console.log("✅ MySQL connected");
  }
  return pool;
}

// Log incoming messages
export async function logIncomingMessage(msg, isCommand = false) {
  const db = await initDB();
  const username = msg.from?.username || msg.from?.first_name || "";
  const chatId = String(msg.chat.id);
  const text = msg.text || "";
  const raw = JSON.stringify(msg);

  await db.execute(
    `INSERT INTO messages (chat_id, username, text, is_command, raw_json)
     VALUES (?, ?, ?, ?, ?)`,
    [chatId, username, text, isCommand, raw]
  );
}

// Log outgoing notifications
export async function logNotification(targetChatId, message, status) {
  const db = await initDB();
  await db.execute(
    `INSERT INTO notifications (target_chat_id, message, status)
     VALUES (?, ?, ?)`,
    [String(targetChatId), message, status]
  );
}

