import express from "express";
import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

const CONFIG_PATH = path.join(__dirname, "../config.json");

// 🔹 Cria config.json se não existir
if (!fs.existsSync(CONFIG_PATH)) {
  fs.writeFileSync(
    CONFIG_PATH,
    JSON.stringify({
      fluxo: "Olá! Sou o assistente virtual. Digite 'menu' para ver as opções.",
      numerosAtendimento: "",
    }, null, 2)
  );
}

// 🔹 Inicializa o cliente WhatsApp
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

// 🔹 Exibe QR no console e frontend
client.on("qr", (qr) => {
  console.log("📱 Escaneie o QR code abaixo:");
  qrcode.generate(qr, { small: true });
});

// 🔹 Quando conectar
client.on("ready", () => {
  console.log("✅ Cliente conectado com sucesso!");
});

client.initialize();

// 🔹 Rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// 🔹 Salvar configurações
app.post("/config", (req, res) => {
  const { fluxo, numerosAtendimento } = req.body;

  fs.writeFileSync(
    CONFIG_PATH,
    JSON.stringify({ fluxo, numerosAtendimento }, null, 2)
  );

  console.log("⚙️ Configurações salvas:", { fluxo, numerosAtendimento });
  res.send(`<h2>✅ Configurações salvas com sucesso!</h2>
            <a href="/">⬅ Voltar</a>`);
});

// 🔹 Evento de mensagens
client.on("message", async (msg) => {
  try {
    console.log("📩 Mensagem recebida:", msg.body);

    // Ignora mensagens antigas
    if (msg.timestamp * 1000 < Date.now() - 60000) return;

    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
    const fluxo = config.fluxo || "";
    const numerosAtendimento = config.numerosAtendimento
      ? config.numerosAtendimento.split(",").map((n) => n.trim())
      : [];

    // Lógica básica
    if (msg.body.toLowerCase().includes("oi")) {
      await msg.reply("👋 Olá! Sou o assistente virtual. Digite 'menu' para ver as opções.");
    } else if (msg.body.toLowerCase().includes("menu")) {
      await msg.reply(`📋 Opções disponíveis:\n${fluxo}`);
    } else if (numerosAtendimento.includes(msg.from.replace("@c.us", ""))) {
      await msg.reply("🔧 Você é um número de atendimento autorizado.");
    } else {
      await msg.reply("🤖 Recebemos sua mensagem. Em breve alguém entrará em contato.");
    }
  } catch (error) {
    console.error("❌ Erro ao processar mensagem:", error);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
