const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Remove banner headers and structural comments I added
  content = content.replace(/^\s*\/\/ ============================================================\r?\n/gm, '');
  content = content.replace(/^\s*\/\/ ----.*----\r?\n/gm, '');
  content = content.replace(/^\s*\/\/ Context:.*\r?\n/gm, '');
  content = content.replace(/^\s*\/\/ Tipos.*\r?\n/gm, '');
  content = content.replace(/^\s*\/\/ Dados Mock.*\r?\n/gm, '');
  content = content.replace(/^\s*\/\/ Service:.*\r?\n/gm, '');
  content = content.replace(/^\s*\/\/ Hook:.*\r?\n/gm, '');
  content = content.replace(/^\s*\/\/ Componente:.*\r?\n/gm, '');
  content = content.replace(/^\s*\/\/ Theme:.*\r?\n/gm, '');
  content = content.replace(/^\s*\/\/ Tipagem de.*\r?\n/gm, '');
  content = content.replace(/^\s*\/\/ Cliente HTTP.*\r?\n/gm, '');
  content = content.replace(/^\s*\/\/ Configurações.*\r?\n/gm, '');
  content = content.replace(/^\s*\/\/ Estes tipos.*\r?\n/gm, '');
  content = content.replace(/^\s*\/\/ Os tipos agora.*\r?\n/gm, '');
  
  // Remove JSX comments like {/* Header */}
  content = content.replace(/\s*\{\/\*.*?\*\/\}\r?\n/g, '\n');

  // Remove some specific single line comments
  content = content.replace(/^\s*\/\/\s*Re-export types.*\r?\n/gm, '');
  content = content.replace(/^\s*\/\/\s*Helper functions.*\r?\n/gm, '');
  content = content.replace(/^\s*\/\/\s*Usuário mock.*\r?\n/gm, '');
  content = content.replace(/^\s*\/\/\s*This screen is used.*\r?\n/gm, '');
  content = content.replace(/^\s*\/\/\s*Pegamos todos e filtramos.*\n/gm, '\n');
  content = content.replace(/\s*\/\*\*\s*URL base da API.*\*\//g, '');
  content = content.replace(/\s*\/\*\*\s*Versão do app.*\*\//g, '');
  content = content.replace(/\s*\/\*\*\s*Se true, usa dados mock.*\*\//g, '');
  content = content.replace(/^\s*\/\/\s*Mude para false quando o backend.*?\r?\n/gm, '');
  content = content.replace(/\s*\/\*\*\s*Timeout padrão para.*\*\//g, '');
  content = content.replace(/\s*\/\*\*\s*Chaves de storage.*\*\//g, '');
  content = content.replace(/\s*\/\*\*\s*Verifica se tem token salvo para auto-login\s*\*\//g, '');
  content = content.replace(/\s*\/\*\*\s*Salva dados do user no storage\s*\*\//g, '');

  content = content.replace(/^\s*\/\/\s*Auto-login:.*\r?\n/gm, '');
  content = content.replace(/^\s*\/\/\s*Carregar carrinho.*\r?\n/gm, '');
  content = content.replace(/^\s*\/\/\s*Persistir carrinho.*\r?\n/gm, '');
  content = content.replace(/^\s*\/\/\s*Carregar favoritos.*\r?\n/gm, '');
  content = content.replace(/^\s*\/\/\s*Persistir favoritos.*\r?\n/gm, '');
  content = content.replace(/^\s*\/\/\s*Se falhar.*\r?\n/gm, '');
  content = content.replace(/^\s*\/\/\s*Falha silenciosa.*\r?\n/gm, '');
  content = content.replace(/^\s*\/\/\s*Token inválido.*\r?\n/gm, '');
  content = content.replace(/^\s*\/\/\s*SecureStore pode.*?\r?\n/gm, '');
  content = content.replace(/^\s*\/\/\s*Se recebeu 401.*?\r?\n/gm, '');
  content = content.replace(/^\s*\/\/\s*Enfileira requisição.*?\r?\n/gm, '');
  content = content.replace(/^\s*\/\/\s*Limpa tokens.*?\r?\n/gm, '');
  
  // Clean up excess empty lines (replace 3 or more consecutive newlines with exactly 2)
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
  // Clean up empty lines at the start of the file
  content = content.replace(/^\s*\n/g, '');

  fs.writeFileSync(file, content, 'utf8');
});

console.log('Comentários removidos com sucesso!');