require('dotenv').config();
const wppconnect = require('@wppconnect-team/wppconnect');
const { handleMessage } = require('./flow');
const { connectRedis, getSession, setSession } = require('./services/sessionStore');
const logger = require('./utils/logger') || console;

(async () => {
  try {
    // Conectar Redis se disponível
    if (process.env.REDIS_URL) {
      await connectRedis(process.env.REDIS_URL);
      logger.info && logger.info('Redis conectado');
    }

    const sessionKey = process.env.SESSION_KEY || 'dplay-bot-session';
    let initialSession = null;
    try { initialSession = await getSession(sessionKey); } catch(e) { /* sem session */ }

    const client = await wppconnect.create({
      session: initialSession || (process.env.SESSION_NAME || 'dplay-bot'),
      puppeteerOptions: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });

    logger.info && logger.info('🤖 Bot conectado ao WhatsApp!');

    // tenta salvar sessão ao iniciar
    try {
      const sessionData = await client.getSession?.() || null;
      if (sessionData) await setSession(sessionKey, sessionData);
    } catch (e) {
      logger.warn && logger.warn('Não foi possível salvar sessionData automaticamente', e.message);
    }

    // timestamp de início para evitar reagir a mensagens pré-existentes
    const startTime = Math.floor(Date.now() / 1000);

    client.onMessage(async (message) => {
      try {
        const msgTs = message.timestamp || message.t || 0;

        if (msgTs && msgTs < startTime) {
          logger.info && logger.info('Ignorando mensagem antiga', { id: message.id, ts: msgTs });
          return;
        }

        if (message.isStatus || (message.from && message.from.includes('status@broadcast'))) {
          return;
        }

        if (message.fromMe) return; // evita loops respondendo a si próprio

        await handleMessage(client, message);
      } catch (err) {
        logger.error && logger.error('Erro no processamento de mensagem', err);
      }
    });

    // salvar session quando houver mudança de estado (opcional)
    if (client.onStateChange) {
      client.onStateChange(async (state) => {
        logger.info && logger.info('Estado do client:', state);
        try {
          const sessionData = await client.getSession?.();
          if (sessionData) await setSession(sessionKey, sessionData);
        } catch (e) {}
      });
    }

  } catch (err) {
    console.error('Erro ao iniciar bot:', err);
  }
})();
