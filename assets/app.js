

'use strict';

const API_BASE = './api/index.php';

const form = document.getElementById('config-form');
const inputQuantity = document.getElementById('input-quantity');
const inputLength = document.getElementById('input-length');
const inputType = document.getElementById('input-type');
const inputAesKey = document.getElementById('input-aes-key');
const aesKeyGroup = document.getElementById('aes-key-group');
const toggleAesKey = document.getElementById('toggle-aes-key');
const methodRadios = document.querySelectorAll('input[name="method"]');

const btnGenerate = document.getElementById('btn-generate');
const btnExport = document.getElementById('btn-export');
const btnDismissErr = document.getElementById('btn-dismiss-error');

const spinnerGenerate = document.getElementById('spinner-generate');
const spinnerExport = document.getElementById('spinner-export');

const emptyState = document.getElementById('empty-state');
const errorState = document.getElementById('error-state');
const errorMessage = document.getElementById('error-message');
const resultsWrapper = document.getElementById('results-wrapper');

const tableBody = document.getElementById('table-body');
const methodTag = document.getElementById('method-tag');
const resultsMeta = document.getElementById('results-meta');
const statsBox = document.getElementById('stats-box');
const statCount = document.getElementById('stat-count');
const statMethod = document.getElementById('stat-method');
const statLength = document.getElementById('stat-length');

const pageSizeSelect = document.getElementById('page-size-select');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const btnPrevBottom = document.getElementById('btn-prev-bottom');
const btnNextBottom = document.getElementById('btn-next-bottom');
const pageInfo = document.getElementById('page-info');
const pageInfoBottom = document.getElementById('page-info-bottom');

const copyToast = document.getElementById('copy-toast');

let allPasswords = [];
let currentPage = 1;
let pageSize = parseInt(pageSizeSelect.value, 10);

methodRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    const isAes = getSelectedMethod() === 'aes256';
    aesKeyGroup.style.display = isAes ? 'block' : 'none';
    if (!isAes) inputAesKey.value = '';
  });
});

toggleAesKey.addEventListener('click', () => {
  const isPassword = inputAesKey.type === 'password';
  inputAesKey.type = isPassword ? 'text' : 'password';
  toggleAesKey.textContent = isPassword ? '🙈' : '👁';
  toggleAesKey.setAttribute('aria-label', isPassword ? 'Ocultar clave' : 'Mostrar clave');
});

btnDismissErr.addEventListener('click', () => {
  errorState.style.display = 'none';
  emptyState.style.display = 'flex';
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const params = collectParams();
  if (!params) return;

  await generatePasswords(params);
});

btnExport.addEventListener('click', async () => {
  const params = collectParams();
  if (!params) return;

  await exportExcel(params);
});

btnPrev.addEventListener('click', () => changePage(currentPage - 1));
btnNext.addEventListener('click', () => changePage(currentPage + 1));
btnPrevBottom.addEventListener('click', () => changePage(currentPage - 1));
btnNextBottom.addEventListener('click', () => changePage(currentPage + 1));

pageSizeSelect.addEventListener('change', () => {
  pageSize = parseInt(pageSizeSelect.value, 10);
  currentPage = 1;
  renderTable();
});


/**
 * Collect and validate form parameters.
 * @returns {Object|null} Validated params or null on failure.
 */
function collectParams() {
  clearFieldErrors();

  const quantity = parseInt(inputQuantity.value, 10);
  const length = parseInt(inputLength.value, 10);
  const type = inputType.value;
  const method = getSelectedMethod();
  const aesKey = inputAesKey.value.trim();

  let valid = true;

  if (isNaN(quantity) || quantity < 1 || quantity > 30000) {
    markError(inputQuantity, 'Cantidad debe ser entre 1 y 10,000');
    valid = false;
  }
  if (isNaN(length) || length < 4 || length > 512) {
    markError(inputLength, 'Longitud debe ser entre 4 y 512');
    valid = false;
  }
  if (method === 'aes256' && aesKey.length < 8) {
    markError(inputAesKey, 'La clave AES debe tener al menos 8 caracteres');
    valid = false;
  }

  if (!valid) return null;

  return { quantity, length, type, method, aes_key: aesKey };
}

function getSelectedMethod() {
  for (const r of methodRadios) {
    if (r.checked) return r.value;
  }
  return 'sha256';
}

function markError(input, message) {
  input.classList.add('error');
  input.setAttribute('aria-describedby', 'field-error-' + input.id);

  if (existing) existing.remove();


  const msg = document.createElement('p');
  msg.id = 'field-error-' + input.id;
  msg.style.cssText = 'font-size:0.75rem;color:#FF6B6B;margin-top:5px;';
  msg.textContent = message;
  input.closest('.input-wrapper, .field-group').appendChild(msg);
}

function clearFieldErrors() {
  document.querySelectorAll('.field-input.error').forEach(el => {
    el.classList.remove('error');
  });
  document.querySelectorAll('[id^="field-error-"]').forEach(el => el.remove());
}

/**
 * Call API to generate passwords, update state and render.
 */
async function generatePasswords(params) {
  setLoading(btnGenerate, spinnerGenerate, true);
  hideAll();

  try {
    const response = await fetch(`${API_BASE}?action=generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const json = await response.json();

    if (!response.ok || !json.success) {
      const errMsg = json.errors
        ? json.errors.join(' | ')
        : (json.error || 'Error desconocido del servidor.');

      showError(errMsg);
      return;
    }

    allPasswords = json.data;
    currentPage = 1;
    pageSize = parseInt(pageSizeSelect.value, 10);

    statCount.textContent = json.count.toLocaleString('es-MX');
    statMethod.textContent = json.method.toUpperCase();
    statLength.textContent = json.length;
    statsBox.style.display = 'flex';


    methodTag.textContent = json.method.toUpperCase();


    resultsMeta.textContent = `${json.count.toLocaleString('es-MX')} contraseñas · Tipo: ${formatType(json.type)} · ${new Date().toLocaleTimeString('es-MX')}`;


    renderTable();
    resultsWrapper.style.display = 'block';
    resultsWrapper.classList.add('fade-in');
    btnExport.disabled = false;

  } catch (err) {
    showError('No se pudo conectar con el servidor. Verifica que WAMP esté activo y que la API esté en /api/index.php.');
    console.error('[RandomPasswordApp] Error:', err);
  } finally {
    setLoading(btnGenerate, spinnerGenerate, false);
  }
}

/**
 * Call API to export Excel and trigger browser download.
 */
async function exportExcel(params) {
  setLoading(btnExport, spinnerExport, true);

  try {
    const response = await fetch(`${API_BASE}?action=export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await response.json();
        showError(json.error || 'Error al exportar el archivo.');
      } else {
        showError('Error al exportar: el servidor devolvió un estado inesperado (' + response.status + ').');
      }
      return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const filename = getFilenameFromResponse(response) || `contraseñas_${params.method}_${Date.now()}.xlsx`;
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);

    showToast('✓ Excel descargado correctamente');

  } catch (err) {
    showError('Error de red al intentar descargar el Excel. Verifica tu conexión con el servidor.');
    console.error('[RandomPasswordApp] Export error:', err);
  } finally {
    setLoading(btnExport, spinnerExport, false);
  }
}

/**
 * Extract filename from Content-Disposition header.
 */
function getFilenameFromResponse(response) {
  const disposition = response.headers.get('content-disposition') || '';
  const match = disposition.match(/filename="?([^";\n]+)"?/i);
  return match ? match[1] : null;
}


function renderTable() {
  const totalPages = Math.ceil(allPasswords.length / pageSize);
  currentPage = Math.min(Math.max(1, currentPage), totalPages || 1);

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const slice = allPasswords.slice(start, end);

  tableBody.innerHTML = '';

  slice.forEach((item, relIndex) => {
    const absIndex = start + relIndex + 1;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="td-index">${absIndex}</td>
      <td class="td-plain">${escapeHtml(item.plain)}</td>
      <td class="td-hashed" title="${escapeHtml(item.hashed)}">${escapeHtml(item.hashed)}</td>
      <td style="text-align:center;">
        <button
          class="btn-copy"
          data-plain="${escapeAttr(item.plain)}"
          aria-label="Copiar contraseña ${absIndex}"
          title="Copiar contraseña"
        >
          📋
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  tableBody.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-plain');
      copyToClipboard(text, btn);
    });
  });

  updatePagination(totalPages);
}

function updatePagination(totalPages) {
  const label = `${currentPage} / ${totalPages}`;
  pageInfo.textContent = label;
  pageInfoBottom.textContent = label;

  btnPrev.disabled = currentPage <= 1;
  btnNext.disabled = currentPage >= totalPages;
  btnPrevBottom.disabled = currentPage <= 1;
  btnNextBottom.disabled = currentPage >= totalPages;
}

function changePage(p) {
  const totalPages = Math.ceil(allPasswords.length / pageSize);
  if (p < 1 || p > totalPages) return;
  currentPage = p;
  renderTable();
  resultsWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


function setLoading(btn, spinner, isLoading) {
  btn.disabled = isLoading;
  spinner.classList.toggle('visible', isLoading);
  const svg = btn.querySelector('.btn-icon-svg');
  if (svg) svg.style.display = isLoading ? 'none' : '';

}

function hideAll() {
  emptyState.style.display = 'none';
  errorState.style.display = 'none';
  resultsWrapper.style.display = 'none';
  statsBox.style.display = 'none';
}

function showError(message) {
  emptyState.style.display = 'none';
  resultsWrapper.style.display = 'none';
  errorMessage.textContent = message;
  errorState.style.display = 'flex';
}

let toastTimer = null;
function showToast(message) {
  copyToast.textContent = message;
  copyToast.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => copyToast.classList.remove('show'), 2500);

}

async function copyToClipboard(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    btn.classList.add('copied');
    btn.textContent = '✓';
    showToast('✓ Contraseña copiada al portapapeles');
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
    showToast('✓ Contraseña copiada');
  }
}

function formatType(type) {
  const map = {
    numbers: 'Números',
    letters: 'Letras',
    alphanumeric: 'Alfanumérico',
    alphanumeric_symbols: 'Alfanumérico + Símbolos',
  };
  return map[type] || type;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttr(str) {
  return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
