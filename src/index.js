const express = require('express');
const fs = require('fs');
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const bodyParser = require('body-parser');

const SESSION_FILE_PATH = './session.json';
const CONFIG_FILE_PATH = './config.json';

let sessionData = fs.existsSync(SESSION_FILE_PATH) ? require(SESSION_FILE_PATH) : null;
let client;

// --- Express ---
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Formulário web para configuração
app.get('/config', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/config', async (req, res) => {
    const { fluxo, numerosAtendimento, numerosMonitoramento } = req.body;

    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify({
        fluxo,
        numerosAtendimento,
        numerosMonitoramento
    }, null, 2));

    // Se o cliente ainda não estiver inicializado, inicializa agora
    if (!client) {
        client = new Client({ session: sessionData, puppeteer: { headless: true } });

        client.on('qr', async qr => {
            const qrImage = await qrcode.toDataURL(qr);
            res.send(`<h1>Escaneie o QR Code</h1><img src="${qrImage}" />`);
        });

        client.on('authenticated', session => {
            fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(session));
            console.log('Bot autenticado e sessão salva!');
        });

        client.on('ready', () => {
            console.log('Bot pronto!');
            if (!res.headersSent) res.send('<h1>Bot pronto! Sessão existente usada.</h1>');
        });

        client.initialize();
    } else {
        res.send('<h1>Configurações salvas! Bot já está rodando.</h1>');
    }
});

// --- Servidor ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
