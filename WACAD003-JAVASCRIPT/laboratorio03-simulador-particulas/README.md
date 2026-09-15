# Simulador de Partículas

Atividade baseada em "Object building practice" do MDN Web Docs
(https://developer.mozilla.org/pt-BR/docs/Learn/JavaScript/Objects/Object_building_practice),
que por sua vez é uma variação do clássico exemplo de "bolas saltitantes".

## O que a aplicação faz

- Desenha partículas que se movem pela tela e quicam nas bordas (Canvas API).
- Quando duas partículas se tocam, ambas mudam de cor (detecção de colisão).
- O usuário escolhe uma **cor tema**; todas as partículas usam apenas
  **intensidades (variações de claro/escuro) dessa mesma cor** — nunca cores
  aleatórias de tons diferentes.
- Usa **3 formas geométricas**: círculo, quadrado e triângulo.
- Um controle deslizante ajusta a quantidade de partículas, e um botão reinicia a simulação.

## Estrutura dos arquivos

```
simulador-particulas/
├── index.html
├── style.css
└── main.js
```

## Como executar

Abra o arquivo `index.html` em qualquer navegador.

## Autor

(Seu nome e sua turma.)
