const venom = require('venom-bot');
const fs = require('fs');
const SESSION_FILE = './session.json';

// Função para criar ou recuperar sessão
function createClient() {
  let sessionData = {};
  if (fs.existsSync(SESSION_FILE)) {
    sessionData = JSON.parse(fs.readFileSync(SESSION_FILE));
  }

  return venom.create({
    session: 'session-bot',
    multidevice: true,
    headless: false, // true para servidor, false para testes locais com QR code
    useChrome: true,
    disableSpins: true,
    logQR: true,
    sessionData: sessionData,
    waitForLogin: 60000, // tempo de espera aumentado
  });
}

// Inicia o bot
createClient()
  .then(client => start(client))
  .catch(error => console.log('Erro ao iniciar Venom-Bot:', error));

// Função principal do bot
function start(client) {
  console.log('Bot iniciado e aguardando mensagens...');

  // Captura todas as mensagens, mas filtrando apenas texto
  client.onAnyMessage(async (message) => {
    if (message.type !== 'chat') return; // só mensagens de texto
    if (message.fromMe) return; // ignora mensagens enviadas pelo próprio bot

    console.log(`Mensagem recebida de ${message.from}: ${message.body}`);

    const lower = message.body.toLowerCase();

    // Fluxo de respostas
    if (lower.includes('hi') || lower.includes('olá')) {
      await client.sendText(message.from, 'Hello!');
    } else if (lower.includes('bye') || lower.includes('tchau')) {
      await client.sendText(message.from, 'Goodbye!');
    } else {
      await client.sendText(message.from, 'Desculpe, não entendi.');
    }
  });

  // Salva sessão automaticamente quando conectado
  client.onStateChange((state) => {
    if (state === 'CONNECTED') {
      console.log('Bot conectado, salvando sessão...');
      const sessionData = client.getSessionTokenBrowser();
      fs.writeFileSync(SESSION_FILE, JSON.stringify(sessionData, null, 2));
    }
  });

  client.onAck((ack) => {
    // Opcional: log de status das mensagens enviadas
    // console.log('Ack:', ack);
  });
}
