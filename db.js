import sqlite3 from "sqlite3";
import { open } from "sqlite";

let db;

export async function initDB() {
  if (db) return db;
  db = await open({ filename: "./bot.db", driver: sqlite3.Database });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chat_id TEXT,
      username TEXT,
      text TEXT,
      is_command INTEGER DEFAULT 0,
      raw_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      target_chat_id TEXT,
      message TEXT,
      status TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return db;
}

export async function logIncomingMessage(msg, isCommand = false) {
  const db = await initDB();
  const username = msg.from?.username || msg.from?.first_name || "";
  await db.run(
    `INSERT INTO messages (chat_id, username, text, is_command, raw_json)
     VALUES (?, ?, ?, ?, ?)`,
    [String(msg.chat.id), username, msg.text || "", isCommand ? 1 : 0, JSON.stringify(msg)]
  );
}

export async function logNotification(chatId, message, status) {
  const db = await initDB();
  await db.run(
    `INSERT INTO notifications (target_chat_id, message, status)
     VALUES (?, ?, ?)`,
    [String(chatId), message, status]
  );
}
