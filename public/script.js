const container = document.getElementById("fluxoContainer");
const addBtn = document.getElementById("addEtapa");
const salvarBtn = document.getElementById("salvarFluxo");
const msg = document.getElementById("mensagem");
const preview = document.getElementById("chatPreview");
const simularBtn = document.getElementById("simularFluxo");

function criarEtapa(id = "", mensagem = "", botoes = []) {
  const div = document.createElement("div");
  div.classList.add("etapa");
  div.innerHTML = `
    <label>ID da Etapa:</label>
    <input class="id" placeholder="ex: inicio" value="${id}">
    <label>Mensagem:</label>
    <textarea class="mensagem" rows="2">${mensagem}</textarea>
    <div class="botoes-container"></div>
    <button class="addBotao">+ Adicionar Botão</button>
  `;

  const botoesContainer = div.querySelector(".botoes-container");
  const addBotaoBtn = div.querySelector(".addBotao");

  const addBotao = (texto = "", destino = "") => {
    const linha = document.createElement("div");
    linha.classList.add("botao-opcao");
    linha.innerHTML = `
      <input class="texto" placeholder="Texto do botão" value="${texto}">
      <input class="destino" placeholder="Destino (id da etapa)" value="${destino}">
      <button class="remover">🗑️</button>
    `;
    linha.querySelector(".remover").addEventListener("click", () => linha.remove());
    botoesContainer.appendChild(linha);
  };

  botoes.forEach(b => addBotao(b.texto, b.destino));
  addBotaoBtn.addEventListener("click", () => addBotao());
  container.appendChild(div);
}

addBtn.addEventListener("click", () => criarEtapa());

salvarBtn.addEventListener("click", async () => {
  const etapas = coletarFluxo();
  const resp = await fetch("/salvar-fluxo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(etapas)
  });
  const data = await resp.json();
  msg.textContent = data.mensagem;
  msg.style.color = data.sucesso ? "#00ffcc" : "#ff4444";
});

function coletarFluxo() {
  const etapas = [];
  document.querySelectorAll(".etapa").forEach(e => {
    const id = e.querySelector(".id").value.trim();
    const mensagem = e.querySelector(".mensagem").value.trim();
    const botoes = [];
    e.querySelectorAll(".botao-opcao").forEach(b => {
      const texto = b.querySelector(".texto").value.trim();
      const destino = b.querySelector(".destino").value.trim();
      if (texto && destino) botoes.push({ texto, destino });
    });
    if (id && mensagem) etapas.push({ id, mensagem, botoes });
  });
  return etapas;
}

// Simulação visual do fluxo
simularBtn.addEventListener("click", () => {
  const etapas = coletarFluxo();
  if (!etapas.length) return alert("Crie ao menos uma etapa!");
  preview.innerHTML = "";
  mostrarEtapa(etapas, etapas[0].id);
});

function mostrarEtapa(etapas, id) {
  const etapa = etapas.find(e => e.id === id);
  if (!etapa) return;

  const botMsg = document.createElement("div");
  botMsg.classList.add("msg", "bot");
  botMsg.innerHTML = etapa.mensagem;
  preview.appendChild(botMsg);

  if (etapa.botoes?.length) {
    etapa.botoes.forEach(b => {
      const btn = document.createElement("button");
      btn.textContent = b.texto;
      btn.onclick = () => {
        const userMsg = document.createElement("div");
        userMsg.classList.add("msg", "user");
        userMsg.textContent = b.texto;
        preview.appendChild(userMsg);
        setTimeout(() => mostrarEtapa(etapas, b.destino), 400);
      };
      botMsg.appendChild(btn);
    });
  }

  preview.scrollTop = preview.scrollHeight;
}
