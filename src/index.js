const express = require('express');
const path = require('path');
const fs = require('fs');
const qrcode = require('qrcode');
const bodyParser = require('body-parser');
const { Client, LocalAuth } = require('whatsapp-web.js');

const app = express();
const PORT = process.env.PORT || 8080;

const CONFIG_FILE_PATH = path.join(__dirname, '../config.json');

let client = null;
let lastQR = null;

// Configuração do Express
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rota da página de configuração
app.get('/config', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Rota para receber os dados e iniciar o bot
app.post('/config', (req, res) => {
  const { fluxo, numerosAtendimento, numerosMonitoramento } = req.body;

  const configData = { fluxo, numerosAtendimento, numerosMonitoramento };
  fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(configData, null, 2));

  res.send(`
    <h1>✅ Configurações salvas!</h1>
    <p>O bot está iniciando em background...</p>
    <p>Quando o QR estiver pronto, acesse <a href="/qr">/qr</a> para escanear.</p>
  `);

  if (!client) {
    inicializarBot();
  }
});

// Rota para exibir o QR Code atual
app.get('/qr', async (req, res) => {
  if (!lastQR) {
    return res.send('<h1>QR Code ainda não gerado. Aguarde alguns segundos e atualize.</h1>');
  }

  const qrImage = await qrcode.toDataURL(lastQR);
  res.send(`
    <h1>📱 Escaneie o QR Code abaixo para conectar seu WhatsApp</h1>
    <img src="${qrImage}" style="width:300px; height:300px;"/>
  `);
});

// Função para inicializar o bot
function inicializarBot() {
  console.log('Inicializando bot WhatsApp...');

  client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    }
  });

  client.on('qr', qr => {
    lastQR = qr;
    console.log('QR Code gerado!');
  });

  client.on('ready', () => {
    console.log('🤖 Bot conectado e pronto!');
  });

  client.on('authenticated', () => {
    console.log('✅ Sessão autenticada com sucesso.');
  });

  client.on('auth_failure', msg => {
    console.error('❌ Falha de autenticação:', msg);
  });

  client.on('disconnected', () => {
    console.log('⚠ Bot desconectado. Reiniciando...');
    client = null;
    inicializarBot();
  });

  client.initialize();
}

// Inicia o servidor Express
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
