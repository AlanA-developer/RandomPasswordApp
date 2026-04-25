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
