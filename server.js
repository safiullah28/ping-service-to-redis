require("dotenv").config();
const cron = require("node-cron");
const { createClient } = require("redis");

// Create Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

// Function to ping Redis
async function pingRedis() {
  try {
    console.log("Connecting to Redis...");
    await redisClient.connect();

    console.log("Pinging Redis...");
    const response = await redisClient.ping();
    console.log("Redis Ping Response:", response);
  } catch (error) {
    console.error("Error pinging Redis:", error);
  } finally {
    if (redisClient.isOpen) {
      await redisClient.disconnect();
      console.log("Disconnected from Redis.");
    }
  }
}

// Run every 25 minutes (Upstash deletes after 1 day idle)
cron.schedule("*/25 * * * *", async () => {
  console.log(`\n[${new Date().toISOString()}] Running Redis ping...`);
  await pingRedis();
});

// Start immediately
(async () => {
  console.log("Node-cron Redis ping scheduler started.");
  await pingRedis(); // Initial ping on startup
})();
