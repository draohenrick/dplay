const express = require("express");
const router = express.Router();

// Exemplo de fluxo de mensagens do bot
router.post("/", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ text: "Mensagem não recebida" });
  }

  // Lógica do bot: respostas e botões clicáveis
  let response = { text: "Não entendi.", buttons: ["Menu", "Ajuda"] };

  if (message.toLowerCase().includes("olá")) {
    response = { text: "Olá! Bem-vindo à Dplay!", buttons: ["Serviços", "Contato"] };
  } else if (message.toLowerCase() === "serviços") {
    response = { text: "Oferecemos Marketing, Comunicação e Design!", buttons: ["Orçamento", "Voltar"] };
  } else if (message.toLowerCase() === "contato") {
    response = { text: "Nosso e-mail: contato@dplay.com.br", buttons: ["Voltar"] };
  }

  return res.json(response);
});

module.exports = router;
