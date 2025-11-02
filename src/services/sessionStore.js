const fs = require('fs');
const path = require('path');
const Redis = require('ioredis');

const storageFile = path.join(__dirname, '..', '.session.json');
let redisClient = null;

async function connectRedis(url) {
  if (!url) return null;
  redisClient = new Redis(url);
  redisClient.on('error', (err) => console.error('Redis error', err));
  await redisClient.ping();
  return redisClient;
}

async function setSession(key, value) {
  if (!key) throw new Error('session key required');
  const data = JSON.stringify(value);
  if (redisClient) {
    await redisClient.set(key, data);
  } else {
    fs.writeFileSync(storageFile, data);
  }
}

async function getSession(key) {
  if (!key) throw new Error('session key required');
  if (redisClient) {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } else {
    if (fs.existsSync(storageFile)) {
      const raw = fs.readFileSync(storageFile, 'utf8');
      return raw ? JSON.parse(raw) : null;
    }
    return null;
  }
}

module.exports = { connectRedis, setSession, getSession };
