import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { startBot } from "./service.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.post("/save-config", async (req, res) => {
  try {
    const config = req.body;
    fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));
    await startBot(config);
    res.json({ success: true, message: "Bot iniciado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro ao iniciar o bot." });
  }
});

app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
