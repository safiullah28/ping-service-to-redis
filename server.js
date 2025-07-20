import express from "express";
import cron from "node-cron";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const redisUrl = process.env.REDIS_URL;

// Cron job (every 24 hours at 10:00 AM)
cron.schedule("0 10 * * *", async () => {
  try {
    const res = await fetch(redisUrl);
    console.log(
      `[${new Date().toISOString()}] Pinged Redis URL: ${res.status}`
    );
  } catch (err) {
    console.error(
      `[${new Date().toISOString()}] Failed to ping Redis URL:`,
      err.message
    );
  }
});

app.get("/", (req, res) => {
  res.send("Redis Cron Job is running.");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
