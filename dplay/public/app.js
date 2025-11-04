document.getElementById("salvar").addEventListener("click", async () => {
  const fluxo = document.getElementById("fluxo").value;
  const numerosAtendimento = document.getElementById("numerosAtendimento").value;

  const res = await fetch("/salvar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fluxo, numerosAtendimento }),
  });

  const data = await res.json();
  const status = document.getElementById("status");

  if (data.ok) {
    status.innerHTML = "<p class='ok'>✅ Fluxo atualizado com sucesso!</p>";
    carregarQR();
  } else {
    status.innerHTML = "<p class='erro'>❌ Erro ao salvar fluxo.</p>";
  }
});

async function carregarQR() {
  const area = document.getElementById("qrArea");
  const res = await fetch("/qr");
  const html = await res.text();
  area.innerHTML = html;
}

carregarQR();
