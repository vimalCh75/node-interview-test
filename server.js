import express from "express";
import dotenv from "dotenv";
import { startBot, sendMessageToChat } from "./bot.js";
import { initDB } from "./db.js";

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

startBot();
initDB();

function requireApiKey(req, res, next) {
  const provided = req.header("x-api-key");
  if (provided !== API_KEY) return res.status(401).json({ error: "Unauthorized" });
  next();
}

// POST /notify/:userId
app.post("/notify/:userId", requireApiKey, async (req, res) => {
  const chatId = req.params.userId;
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Missing message" });

  try {
    const result = await sendMessageToChat(chatId, message);
    res.json({ ok: true, result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/", (_, res) => res.send("Telegram Notification Service running 🚀"));

app.listen(PORT, () => console.log(`Server ready on http://localhost:${PORT}`));
