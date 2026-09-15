// ===== Configuração inicial do canvas (igual ao exemplo do MDN) =====
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

// Se a janela mudar de tamanho, o canvas acompanha
window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

// Função auxiliar: número aleatório entre min e max (igual ao MDN)
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ===== Cor por intensidade (requisito do professor) =====
// Em vez de sortear uma cor qualquer (matiz aleatório), guardamos o matiz (hue)
// e a saturação da cor escolhida pelo usuário, e só variamos a luminosidade (L).
// Isso gera várias "intensidades" da MESMA cor, nunca uma cor diferente.

let corAtual = hexParaHSL(document.querySelector("#corTema").value);

function hexParaHSL(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100) };
}

// Gera uma nova intensidade (luminosidade) da cor tema atual
function novaCorIntensidade() {
  const luminosidade = random(25, 75);
  return `hsl(${corAtual.h}, ${corAtual.s}%, ${luminosidade}%)`;
}

// ===== "Classe" base: Partícula =====
// Guarda tudo que toda forma tem em comum: posição, velocidade, cor e tamanho.
// draw() fica em branco aqui — cada forma (Circulo, Quadrado, Triangulo)
// vai definir o seu próprio jeito de se desenhar.
function Particula(x, y, velX, velY, color, size) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.color = color;
  this.size = size;
}

// update(): faz a partícula quicar nas bordas da tela (igual ao MDN)
Particula.prototype.update = function () {
  if (this.x + this.size >= width) this.velX = -this.velX;
  if (this.x - this.size <= 0) this.velX = -this.velX;
  if (this.y + this.size >= height) this.velY = -this.velY;
  if (this.y - this.size <= 0) this.velY = -this.velY;

  this.x += this.velX;
  this.y += this.velY;
};

// collisionDetect(): verifica se colidiu com outra partícula.
// Quando colide, as duas ganham uma nova intensidade da MESMA cor tema.
Particula.prototype.collisionDetect = function () {
  for (let j = 0; j < particulas.length; j++) {
    const outra = particulas[j];
    if (this === outra) continue;

    const dx = this.x - outra.x;
    const dy = this.y - outra.y;
    const distancia = Math.sqrt(dx * dx + dy * dy);

    if (distancia < this.size + outra.size) {
      const cor = novaCorIntensidade();
      this.color = cor;
      outra.color = cor;
    }
  }
};

// ===== Forma 1: Círculo (a bola clássica do exemplo do MDN) =====
function Circulo(x, y, velX, velY, color, size) {
  Particula.call(this, x, y, velX, velY, color, size);
}
Circulo.prototype = Object.create(Particula.prototype);
Circulo.prototype.constructor = Circulo;

Circulo.prototype.draw = function () {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

// ===== Forma 2: Quadrado (requisito do professor — outra forma geométrica) =====
function Quadrado(x, y, velX, velY, color, size) {
  Particula.call(this, x, y, velX, velY, color, size);
}
Quadrado.prototype = Object.create(Particula.prototype);
Quadrado.prototype.constructor = Quadrado;

Quadrado.prototype.draw = function () {
  ctx.fillStyle = this.color;
  ctx.fillRect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
};

// ===== Forma 3: Triângulo (bônus — mais uma forma além do pedido) =====
function Triangulo(x, y, velX, velY, color, size) {
  Particula.call(this, x, y, velX, velY, color, size);
}
Triangulo.prototype = Object.create(Particula.prototype);
Triangulo.prototype.constructor = Triangulo;

Triangulo.prototype.draw = function () {
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.moveTo(this.x, this.y - this.size);
  ctx.lineTo(this.x - this.size, this.y + this.size);
  ctx.lineTo(this.x + this.size, this.y + this.size);
  ctx.closePath();
  ctx.fill();
};

// ===== Criando as partículas =====
let particulas = [];

function criarParticulas(quantidade) {
  particulas = [];
  const formas = [Circulo, Quadrado, Triangulo];

  while (particulas.length < quantidade) {
    const size = random(10, 22);
    const Forma = formas[random(0, formas.length - 1)];

    const particula = new Forma(
      random(0 + size, width - size),
      random(0 + size, height - size),
      random(-5, 5),
      random(-5, 5),
      novaCorIntensidade(),
      size,
    );

    particulas.push(particula);
  }
}

// ===== Loop de animação (igual ao MDN) =====
function loop() {
  ctx.fillStyle = "rgba(11, 13, 18, 0.25)";
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < particulas.length; i++) {
    particulas[i].draw();
    particulas[i].update();
    particulas[i].collisionDetect();
  }

  requestAnimationFrame(loop);
}

// ===== Controles da tela (cor tema, quantidade, botão reiniciar) =====
const inputCor = document.querySelector("#corTema");
const inputQuantidade = document.querySelector("#quantidade");
const labelQuantidade = document.querySelector("#quantidadeValor");
const botaoReiniciar = document.querySelector("#reiniciar");

// Deixa a interface combinando com a cor escolhida
document.documentElement.style.setProperty("--acento", inputCor.value);

inputCor.addEventListener("input", () => {
  corAtual = hexParaHSL(inputCor.value);
  document.documentElement.style.setProperty("--acento", inputCor.value);
  criarParticulas(Number(inputQuantidade.value));
});

inputQuantidade.addEventListener("input", () => {
  labelQuantidade.textContent = inputQuantidade.value;
});

inputQuantidade.addEventListener("change", () => {
  criarParticulas(Number(inputQuantidade.value));
});

botaoReiniciar.addEventListener("click", () => {
  criarParticulas(Number(inputQuantidade.value));
});

// ===== Início =====
criarParticulas(Number(inputQuantidade.value));
loop();
