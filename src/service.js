import fs from "fs";
import { create } from "venom-bot";

export async function startBot(config) {
  const { atendimento, monitoramento, fluxo } = config;

  const client = await create({
    session: "session-dplay",
    headless: true,
    browserArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
    disableWelcome: true,
  });

  client.onMessage(async (msg) => {
    const flow = fluxo || [];
    const matched = flow.find(f =>
      msg.body.toLowerCase().includes(f.palavraChave.toLowerCase())
    );

    if (matched) {
      await client.sendText(msg.from, matched.resposta);
    } else {
      await client.sendText(
        msg.from,
        "Olá! Não entendi sua mensagem. Selecione uma das opções abaixo:\n" +
          flow.map(f => `👉 *${f.palavraChave}*`).join("\n")
      );
    }
  });

  console.log(`🤖 Bot iniciado com sucesso para o número ${atendimento}`);
}
