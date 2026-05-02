export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function escapeAttr(str) {
  return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

export function formatType(type) {
  const map = {
    numbers: 'Números',
    letters: 'Letras',
    alphanumeric: 'Alfanumérico',
    alphanumeric_symbols: 'Alfanumérico + Símbolos',
    passphrase: 'Frase de Contraseña (Diceware)'
  };
  return map[type] || type;
}

export function showToast(message, copyToast) {
  copyToast.textContent = message;
  copyToast.classList.add('show');
  setTimeout(() => copyToast.classList.remove('show'), 2500);
}

export async function copyToClipboard(text, btn, showToastFn, copyToast) {
  try {
    await navigator.clipboard.writeText(text);
    btn.classList.add('copied');
    btn.textContent = '✓';
    showToastFn('✓ Contraseña copiada al portapapeles', copyToast);
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.textContent = '📋';
    }, 1600);
  } catch {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    el.remove();
    showToastFn('✓ Contraseña copiada', copyToast);
  }
}

import { wordlist } from './wordlist.js';

export function generateZeroKnowledge(params) {
  const result = [];
  const { quantity, length, type, custom_symbols, exclude_ambiguous } = params;

  for (let i = 0; i < quantity; i++) {
    result.push({
      plain: generateSingle(length, type, custom_symbols, exclude_ambiguous),
      hashed: 'N/A (Local)'
    });
  }
  return result;
}

function generateSingle(length, type, customSymbols, excludeAmbiguous) {
  if (type === 'passphrase') {
    const words = [];
    const count = Math.max(3, Math.min(10, length));
    for (let i = 0; i < count; i++) {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      words.push(wordlist[array[0] % wordlist.length]);
    }
    return words.join('-');
  }

  let charset = getCharset(type, customSymbols);
  if (excludeAmbiguous) {
    charset = charset.replace(/[0Ol1I]/g, '');
  }
  if (!charset) return '';

  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  
  let pass = '';
  for (let i = 0; i < length; i++) {
    pass += charset[array[i] % charset.length];
  }
  return pass;
}

function getCharset(type, customSymbols) {
  const NUMBERS = '0123456789';
  const LETTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const SYMBOLS = customSymbols || '!@#$%^&*()-_=+[]{}|;:,.<>?';
  
  switch (type) {
    case 'numbers': return NUMBERS;
    case 'letters': return LETTERS;
    case 'alphanumeric': return NUMBERS + LETTERS;
    case 'alphanumeric_symbols': return NUMBERS + LETTERS + SYMBOLS;
    default: return NUMBERS + LETTERS;
  }
}

export function exportToJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  triggerDownload(blob, filename);
}

export function exportToEnv(data, filename) {
  let content = '';
  data.forEach((item, index) => {
    content += `DB_PASS_${index + 1}=${item.plain}\n`;
  });
  const blob = new Blob([content], { type: 'text/plain' });
  triggerDownload(blob, filename);
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
