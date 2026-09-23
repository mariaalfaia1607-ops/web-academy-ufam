// Exercício I - Parte 1 (WACAD007-NODE)
// Servidor Web que lista os arquivos e subdiretórios de um diretório
// informado como parâmetro na linha de comando, usando fs.readdir.

const http = require('http');
const fs = require('fs');
const path = require('path');

// Pega o diretório informado como parâmetro (ex: ./public/)
// process.argv[0] = node, process.argv[1] = index.js, process.argv[2] = parâmetro
const diretorioAlvo = process.argv[2];

if (!diretorioAlvo) {
  console.error('Erro: informe o diretório como parâmetro.');
  console.error('Exemplo de uso: node index.js ./public/');
  process.exit(1);
}

const PORT = 3333;

const server = http.createServer((req, res) => {
  const caminhoCompleto = path.resolve(diretorioAlvo);

  fs.readdir(caminhoCompleto, (err, arquivos) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`Erro ao ler o diretório "${diretorioAlvo}": ${err.message}`);
      return;
    }

    // Monta uma linha <p> para cada arquivo/subdiretório encontrado
    const listaHtml = arquivos
      .map((item) => `<p>${item}</p>`)
      .join('\n      ');

    const paginaHtml = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <title>Conteúdo de ${diretorioAlvo}</title>
      <style>
        body { font-family: monospace; font-size: 1.5rem; padding: 2rem; }
        p { margin: 0.3rem 0; }
      </style>
    </head>
    <body>
      ${listaHtml}
    </body>
    </html>`;

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(paginaHtml);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Listando conteúdo de: ${diretorioAlvo}`);
});
