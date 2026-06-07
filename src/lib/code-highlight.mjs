const htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
};

const tokenPattern = /(`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/[^\n\r]*|#[^\n\r]*)/g;

function escapeHtml(value) {
  return value.replace(/[&<>]/g, (char) => htmlEscapes[char]);
}

function highlightPlainText(value) {
  const keywords = [
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
    'import', 'export', 'from', 'default', 'class', 'extends', 'new', 'this',
    'async', 'await', 'try', 'catch', 'throw', 'typeof', 'instanceof',
    'true', 'false', 'null', 'undefined', 'None', 'True', 'False',
    'def', 'print', 'self', 'yield', 'lambda', 'with', 'as', 'in',
    'curl', 'POST', 'GET', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS',
  ];
  const kwPattern = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');

  return escapeHtml(value)
    .replace(kwPattern, '<span class="keyword">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>');
}

export function highlightCode(code, language) {
  let html = '';
  let cursor = 0;

  for (const match of code.matchAll(tokenPattern)) {
    const token = match[0];
    const index = match.index ?? 0;

    html += highlightPlainText(code.slice(cursor, index));

    const isString = token.startsWith('"') || token.startsWith("'") || token.startsWith('`');
    html += `<span class="${isString ? 'string' : 'comment'}">${escapeHtml(token)}</span>`;
    cursor = index + token.length;
  }

  html += highlightPlainText(code.slice(cursor));

  return html;
}
