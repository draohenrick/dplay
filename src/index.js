import express from "express";
import { Client, LocalAuth } from "whatsapp-web.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import qrcode from "qrcode";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

const SERVICE_PATH = path.join(__dirname, "servico.js");
const SESSION_FILE = path.join(__dirname, "../.wwebjs_auth");

// 🔹 Inicializa o cliente do WhatsApp
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

let qrAtual = null;

// Gera QR code para exibição na interface
client.on("qr", async (qr) => {
  qrAtual = await qrcode.toDataURL(qr);
  console.log("📱 QR Code gerado. Acesse o painel para escanear.");
});

client.on("ready", () => {
  qrAtual = null;
  console.log("✅ Bot conectado e pronto para uso!");
});

client.initialize();

// Página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Retorna QR em base64
app.get("/qr", (req, res) => {
  if (qrAtual) {
    res.send(`<img src="${qrAtual}" alt="QR Code" style="width:300px">`);
  } else {
    res.send("<h2>✅ Sessão ativa! Bot já conectado.</h2>");
  }
});

// Salva fluxo e números em servico.js
app.post("/salvar", (req, res) => {
  const { fluxo, numerosAtendimento } = req.body;

  const conteudo = `
export const fluxoAtendimento = \`${fluxo}\`;
export const numerosPermitidos = ${JSON.stringify(
    numerosAtendimento.split(",").map((n) => n.trim())
  )};
`;

  fs.writeFileSync(SERVICE_PATH, conteudo);
  console.log("💾 Fluxo salvo com sucesso!");
  res.json({ ok: true });
});

// Lógica de mensagens
client.on("message", async (msg) => {
  if (msg.timestamp * 1000 < Date.now() - 60000) return;

  try {
    const { fluxoAtendimento, numerosPermitidos } = await import("./servico.js?" + Date.now());

    console.log("📩 Nova mensagem:", msg.body);

    if (numerosPermitidos.includes(msg.from.replace("@c.us", ""))) {
      await msg.reply("✅ Número autorizado de atendimento.");
    } else if (msg.body.toLowerCase() === "menu") {
      await msg.reply(`📋 Opções de atendimento:\n${fluxoAtendimento}`);
    } else {
      await msg.reply("🤖 Digite 'menu' para ver as opções disponíveis.");
    }
  } catch (err) {
    console.error("❌ Erro no processamento:", err);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
