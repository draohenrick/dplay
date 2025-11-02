import express from "express";
import { initClient, sendMessage, autoRespond } from "./service.js";

const app = express();
app.use(express.json());
app.use(express.static("public"));

// Inicializa o bot e QR code
app.get("/start", async (req, res) => {
  try {
    await initClient();
    res.send("QR code gerado! Escaneie no celular.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao iniciar o cliente.");
  }
});

// Envia mensagem manual
app.post("/send", async (req, res) => {
  const { number, message } = req.body;
  if (!number || !message) return res.status(400).send("Número e mensagem são obrigatórios.");

  try {
    await sendMessage(number, message);
    res.send("Mensagem enviada com sucesso!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao enviar mensagem.");
  }
});

// Salva fluxo do cliente
import fs from "fs";
app.post("/save-flow", (req, res) => {
  const { flow } = req.body;
  if (!flow) return res.status(400).send("Fluxo inválido");

  fs.writeFileSync("flow.json", JSON.stringify(flow, null, 2));
  res.send("Fluxo salvo com sucesso!");
});

// Rota para teste de atendimento automático
app.post("/auto", async (req, res) => {
  const { number, message } = req.body;
  if (!number || !message) return res.status(400).send("Número e mensagem são obrigatórios.");

  try {
    await autoRespond(number, message);
    res.send("Mensagem de fluxo processada!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no atendimento automático.");
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
