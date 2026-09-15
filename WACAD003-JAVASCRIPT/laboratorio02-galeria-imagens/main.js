// ===== Pegando os pedaços da página =====
const displayedImage = document.querySelector(".displayed-img");
const thumbBar = document.querySelector(".thumb-bar");
const btn = document.querySelector("button");
const overlay = document.querySelector(".overlay");

// ===== Nomes dos arquivos e texto alternativo de cada foto =====
const imagens = ["pic1.jpg", "pic2.jpg", "pic3.jpg", "pic4.jpg", "pic5.jpg"];
const textosAlternativos = [
  "Dupla jogando vôlei de praia ao pôr do sol",
  "Bolas de vôlei de praia na areia",
  "Xícara de café sendo servida",
  "Baralho de cartas sobre a mesa",
  "Doces coloridos em um prato",
];

// ===== 1) Loop: criar as 5 miniaturas =====
for (let i = 0; i < imagens.length; i++) {
  const newImage = document.createElement("img");
  newImage.setAttribute("src", `images/${imagens[i]}`);
  newImage.setAttribute("alt", textosAlternativos[i]);
  newImage.setAttribute("tabindex", "0"); // permite navegar até a miniatura com Tab
  thumbBar.appendChild(newImage);

  // clique na miniatura troca a imagem grande
  newImage.onclick = function (e) {
    selecionarImagem(e.target);
  };

  // também funciona apertando Enter ou espaço, para quem navega pelo teclado
  newImage.onkeydown = function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      selecionarImagem(e.target);
    }
  };
}

// Função nomeada: troca a imagem grande e destaca a miniatura escolhida
function selecionarImagem(miniatura) {
  const imagemClicada = miniatura.getAttribute("src");
  displayedImage.setAttribute("src", imagemClicada);
  displayedImage.setAttribute("alt", miniatura.getAttribute("alt"));

  document.querySelectorAll(".thumb-bar img").forEach(function (img) {
    img.classList.remove("selecionada");
  });
  miniatura.classList.add("selecionada");
}

// ===== 2) Botão que escurece e clareia =====
btn.onclick = function () {
  const classeAtual = btn.getAttribute("class");

  if (classeAtual === "dark") {
    btn.setAttribute("class", "light");
    btn.textContent = "Lighten";
    overlay.style.backgroundColor = "rgba(0,0,0,0.5)";
  } else {
    btn.setAttribute("class", "dark");
    btn.textContent = "Darken";
    overlay.style.backgroundColor = "rgba(0,0,0,0)";
  }
};