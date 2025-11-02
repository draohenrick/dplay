import express from "express";
import { initClient, sendMessage } from "./service.js";

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.get("/start", async (req, res) => {
  try {
    await initClient();
    res.send("QR code gerado! Escaneie no celular.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao iniciar o cliente.");
  }
});

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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
