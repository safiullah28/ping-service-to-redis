require("dotenv").config();
const { createClient } = require("redis");

// Create Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

async function pingRedis() {
  try {
    console.log("Connecting to Redis...");
    await redisClient.connect();

    console.log("Pinging Redis...");
    const response = await redisClient.ping();
    console.log("Ping response:", response);

    return true;
  } catch (error) {
    console.error("Error pinging Redis:", error);
    return false;
  } finally {
    if (redisClient.isOpen) {
      console.log("Disconnecting from Redis...");
      await redisClient.disconnect();
    }
  }
}

module.exports = async (req, res) => {
  console.log("Running Redis ping...");
  const success = await pingRedis();

  if (success) {
    console.log("Ping successful");
    res.status(200).send("Redis ping successful");
  } else {
    console.log("Ping failed");
    res.status(500).send("Redis ping failed");
  }
};
