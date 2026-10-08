// util.js - funções auxiliares da aplicação

function createLink(filename) {
    return `<a href="/${filename}">${filename}</a><br>\n`;
}

module.exports = { createLink };
