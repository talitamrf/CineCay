let nomes = [];
let girando = false;
let historico = [];
let anguloAtual = 0;
const canvas = document.getElementById("roleta");
const ctx = canvas.getContext("2d");
const btnGirar = document.getElementById("btnGirar");

// Cores: rosa, vermelho e branco alternados
const cores = [
  "#ff6b9d",
  "#e63946",
  "#ffffff",
  "#ffb6c1",
  "#ff4757",
  "#fff0f6",
];

// Ajusta o tamanho do canvas
function ajustarCanvas() {
  const wrapper = document.querySelector(".roleta-wrapper");
  const size = wrapper.offsetWidth;
  canvas.width = size;
  canvas.height = size;
  desenharRoleta();
}

window.addEventListener("resize", ajustarCanvas);
window.addEventListener("orientationchange", () => {
  setTimeout(ajustarCanvas, 100);
});

function desenharRoleta() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 10;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (nomes.length === 0) {
    ctx.fillStyle = "#fff0f6";
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = "#ffb6c1";
    ctx.font = `bold ${canvas.width / 20}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Adicione os nomes", centerX, centerY);
    return;
  }

  const anglePerItem = (2 * Math.PI) / nomes.length;

  nomes.forEach((nome, i) => {
    const startAngle = i * anglePerItem - Math.PI / 2 + anguloAtual;
    const endAngle = startAngle + anglePerItem;

    // Desenha setor
    ctx.fillStyle = cores[i % cores.length];
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();

    // Desenha borda
    ctx.strokeStyle = "#ff6b9d";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Desenha texto
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(startAngle + anglePerItem / 2);
    ctx.textAlign = "right";

    if (
      cores[i % cores.length] === "#ffffff" ||
      cores[i % cores.length] === "#fff0f6"
    ) {
      ctx.fillStyle = "#e63946";
    } else {
      ctx.fillStyle = "#fff";
    }

    const fontSize = Math.max(12, Math.min(18, canvas.width / 25));
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.shadowColor = "rgba(0,0,0,0.2)";
    ctx.shadowBlur = 2;
    ctx.fillText(nome, radius - 15, 0);
    ctx.restore();
  });

  // Círculo central
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(centerX, centerY, canvas.width / 15, 0, 2 * Math.PI);
  ctx.fill();
  ctx.strokeStyle = "#ff6b9d";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = "#ff6b9d";
  ctx.font = `${canvas.width / 18}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("♥", centerX, centerY);
}

function iniciarRoleta() {
  const entrada = document.getElementById("nomes").value;
  const nomesTemp = entrada
    .split(",")
    .map((n) => n.trim())
    .filter((n) => n);

  if (nomesTemp.length === 0) {
    alert("Por favor, digite pelo menos um nome!");
    return;
  }

  if (girando) return;

  nomes = nomesTemp;

  // Reseta o ângulo para cada nova rodada
  anguloAtual = 0;
  canvas.style.transform = "rotate(0deg)";
  canvas.style.transition = "none";

  setTimeout(() => {
    desenharRoleta();
    girar();
  }, 50);
}

function girar() {
  if (girando || nomes.length === 0) return;

  girando = true;
  btnGirar.disabled = true;

  // Sorteia de forma verdadeiramente aleatória
  const sorteioIndex = Math.floor(Math.random() * nomes.length);
  const anglePerItem = 360 / nomes.length;
  const anguloVencedor = sorteioIndex * anglePerItem;

  // Randomiza o número de voltas entre 4 e 7
  const voltas = 4 + Math.floor(Math.random() * 4);

  // Adiciona uma pequena variação aleatória para parecer mais natural
  const variacao = (Math.random() - 0.5) * (anglePerItem * 0.8);
  const anguloFinal =
    voltas * 360 + (360 - anguloVencedor - anglePerItem / 2) + variacao;

  // Atualiza o ângulo atual para a próxima rodada
  anguloAtual = (anguloFinal % 360) * (Math.PI / 180);

  canvas.style.transition = "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)";
  canvas.style.transform = `rotate(${anguloFinal}deg)`;

  setTimeout(() => {
    mostrarResultado(nomes[sorteioIndex]);
    adicionarHistorico(nomes[sorteioIndex]);
    criarConfete();
    girando = false;
    btnGirar.disabled = false;
  }, 4000);
}

function mostrarResultado(vencedor) {
  const resultado = document.getElementById("resultado");
  const overlay = document.querySelector(".overlay");

  resultado.innerHTML = `${vencedor}  <img src="imgs/sparkle.png" alt="estrela" class="icone-estrela"><br><span style="font-size: 0.7em;">Foi sorteado(a)!</span>`;
  resultado.style.display = "block";
  overlay.style.display = "block";

  // Vibração no mobile (se suportado)
  if (navigator.vibrate) {
    navigator.vibrate([200, 100, 200]);
  }

  setTimeout(fecharResultado, 3000);
}

function fecharResultado() {
  document.getElementById("resultado").style.display = "none";
  document.querySelector(".overlay").style.display = "none";
}

function adicionarHistorico(nome) {
  const agora = new Date();
  const hora = agora.getHours().toString().padStart(2, "0");
  const minuto = agora.getMinutes().toString().padStart(2, "0");

  historico.unshift({
    nome: nome,
    horario: `${hora}:${minuto}`,
    timestamp: Date.now(),
  });

  if (historico.length > 10) historico.pop();

  atualizarListaHistorico();
  salvarLocal();
}

function atualizarListaHistorico() {
  const lista = document.getElementById("listaHistorico");
  lista.innerHTML = historico
    .slice(0, 5)
    .map(
      (item, i) =>
        `<li>${i === 0 ? '<img src="imgs/trophy.png">' : `${i + 1}º`} ${
          item.nome
        } - ${item.horario}</li>`
    )
    .join("");
}

function limparTudo() {
  document.getElementById("nomes").value = "";
  nomes = [];
  anguloAtual = 0;
  canvas.style.transform = "rotate(0deg)";
  canvas.style.transition = "none";
  setTimeout(() => {
    canvas.style.transition = "";
    desenharRoleta();
  }, 10);
}

function criarConfete() {
  const cores = ["#ff6b9d", "#e63946", "#ffb6c1", "#ffd700", "#ff4757"];
  const quantidade = window.innerWidth < 768 ? 20 : 30;

  for (let i = 0; i < quantidade; i++) {
    setTimeout(() => {
      const confete = document.createElement("div");
      confete.className = "confete";
      confete.style.left = Math.random() * 100 + "%";
      confete.style.background =
        cores[Math.floor(Math.random() * cores.length)];
      confete.style.transform = `rotate(${Math.random() * 360}deg)`;
      document.body.appendChild(confete);

      setTimeout(() => confete.remove(), 3000);
    }, i * 50);
  }
}

// Salvar e carregar histórico localmente
function salvarLocal() {
  try {
    const dados = {
      historico: historico,
      timestamp: Date.now(),
    };
    localStorage.setItem("roletaHistorico", JSON.stringify(dados));
  } catch (e) {
    console.log("Não foi possível salvar no localStorage");
  }
}

function carregarLocal() {
  try {
    const dados = localStorage.getItem("roletaHistorico");
    if (dados) {
      const parsed = JSON.parse(dados);
      historico = parsed.historico || [];
      atualizarListaHistorico();
    }
  } catch (e) {
    console.log("Não foi possível carregar do localStorage");
  }
}

function salvarHistorico() {
  const dados = {
    historico: historico,
    data: new Date().toLocaleDateString("pt-BR"),
    hora: new Date().toLocaleTimeString("pt-BR"),
  };

  const texto = JSON.stringify(dados, null, 2);
  const blob = new Blob([texto], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `roleta_historico_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);

  alert("Histórico salvo! Você pode compartilhar este arquivo.");
}

function carregarHistorico() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const dados = JSON.parse(e.target.result);
          historico = dados.historico || [];
          atualizarListaHistorico();
          alert("Histórico carregado com sucesso!");
        } catch (err) {
          alert("Erro ao carregar o arquivo!");
        }
      };
      reader.readAsText(file);
    }
  };
  input.click();
}

// Inicialização
setTimeout(ajustarCanvas, 100);
carregarLocal();

document.addEventListener("gesturestart", (e) => e.preventDefault());
document.addEventListener(
  "touchmove",
  (e) => {
    if (typeof e.scale !== "undefined" && e.scale !== 1) {
      e.preventDefault();
    }
  },
  { passive: false }
);