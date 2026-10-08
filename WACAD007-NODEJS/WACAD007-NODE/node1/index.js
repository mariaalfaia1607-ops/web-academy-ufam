// Exercício I - Parte 6 (WACAD007-NODE)
// Servidor Web que lista os arquivos de um diretório como links.
// Ao clicar em um link, mostra o conteúdo do arquivo com um link "Voltar".

const http = require('http');
const fs = require('fs');
const path = require('path');
const { createLink } = require('./util');

// Diretório informado como parâmetro (ex: ./public/)
// process.argv[0] = node, process.argv[1] = index.js, process.argv[2] = parâmetro
const diretorioAlvo = process.argv[2];

if (!diretorioAlvo) {
  console.error('Erro: informe o diretório como parâmetro.');
  console.error('Exemplo de uso: node index.js ./public/');
  process.exit(1);
}

// A porta vem do arquivo .env.development / .env.production,
// carregado pelo script do package.json (--env-file)
const PORT = process.env.PORT || 3333;
const caminhoDiretorio = path.resolve(diretorioAlvo);

function escaparHtml(texto) {
  return texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);

  // Rota "/" -> um link para cada arquivo do diretório
  if (urlPath === '/') {
    fs.readdir(caminhoDiretorio, (err, arquivos) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`Erro ao ler o diretório "${diretorioAlvo}": ${err.message}`);
        return;
      }

      const links = arquivos.map((arquivo) => createLink(arquivo)).join('');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(links);
    });
    return;
  }

  // Rota "/nome-do-arquivo" -> conteúdo do arquivo + link "Voltar"
  // path.basename impede acessar arquivos fora do diretório informado
  const nomeArquivo = path.basename(urlPath);
  const caminhoArquivo = path.join(caminhoDiretorio, nomeArquivo);

  fs.readFile(caminhoArquivo, 'utf-8', (err, conteudo) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<a href="/">Voltar</a><br>\nArquivo não encontrado.');
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<a href="/">Voltar</a><br>\n${escaparHtml(conteudo)}`);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Listando conteúdo de: ${diretorioAlvo}`);
});
