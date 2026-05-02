import { fetchPasswords, fetchExportExcel, getFilenameFromResponse } from './api.js';
import { escapeHtml, escapeAttr, formatType, showToast, copyToClipboard, generateZeroKnowledge, exportToJson, exportToEnv } from './utils.js';

'use strict';

const form = document.getElementById('config-form');
const inputQuantity = document.getElementById('input-quantity');
const inputLength = document.getElementById('input-length');
const inputType = document.getElementById('input-type');
const inputAesKey = document.getElementById('input-aes-key');
const aesKeyGroup = document.getElementById('aes-key-group');
const toggleAesKey = document.getElementById('toggle-aes-key');
const inputMethod = document.getElementById('input-method');
const optExcludeAmbiguous = document.getElementById('opt-exclude-ambiguous');
const optStrict = document.getElementById('opt-strict');
const searchPasswords = document.getElementById('search-passwords');

const themeToggle = document.getElementById('theme-toggle');
const inputCustomSymbols = document.getElementById('input-custom-symbols');
const customSymbolsGroup = document.getElementById('custom-symbols-group');
const optZeroKnowledge = document.getElementById('opt-zero-knowledge');
const btnExportJson = document.getElementById('btn-export-json');
const btnExportEnv = document.getElementById('btn-export-env');

const qrModal = document.getElementById('qr-modal');
const closeQrModal = document.getElementById('close-qr-modal');
const qrcodeContainer = document.getElementById('qrcode-container');
let currentQrCode = null;

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

const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'light') {
  document.body.classList.add('light-theme');
  themeToggle.textContent = '🌙';
}
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  let theme = 'dark';
  if (document.body.classList.contains('light-theme')) {
    theme = 'light';
    themeToggle.textContent = '🌙';
  } else {
    themeToggle.textContent = '🌞';
  }
  localStorage.setItem('theme', theme);
});

closeQrModal.addEventListener('click', () => {
  qrModal.style.display = 'none';
});

function loadPreferences() {
  try {
    const raw = localStorage.getItem('pwd_app_prefs');
    if (!raw) return;
    const prefs = JSON.parse(raw);
    if (prefs.quantity) inputQuantity.value = prefs.quantity;
    if (prefs.length) inputLength.value = prefs.length;
    if (prefs.type) {
      inputType.value = prefs.type;
      inputType.dispatchEvent(new Event('change'));
    }
    if (prefs.method) {
      inputMethod.value = prefs.method;
      const event = new Event('change');
      inputMethod.dispatchEvent(event);
    }
    if (prefs.exclude_ambiguous !== undefined) optExcludeAmbiguous.checked = prefs.exclude_ambiguous;
    if (prefs.strict_rules !== undefined) optStrict.checked = prefs.strict_rules;
  } catch (e) {
    console.error('Failed to load preferences from localStorage', e);
  }
}

loadPreferences();

inputType.addEventListener('change', () => {
  customSymbolsGroup.style.display = inputType.value === 'alphanumeric_symbols' ? 'block' : 'none';
});

inputMethod.addEventListener('change', () => {
  const isAes = inputMethod.value === 'aes256';
  aesKeyGroup.style.display = isAes ? 'block' : 'none';
  if (!isAes) inputAesKey.value = '';
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

btnExportJson.addEventListener('click', () => {
  if (allPasswords.length) exportToJson(allPasswords, `passwords_${Date.now()}.json`);
});

btnExportEnv.addEventListener('click', () => {
  if (allPasswords.length) exportToEnv(allPasswords, `.env.passwords_${Date.now()}`);
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

searchPasswords.addEventListener('input', () => {
  currentPage = 1;
  renderTable();
});

function collectParams() {
  clearFieldErrors();
  const quantity = parseInt(inputQuantity.value, 10);
  const length = parseInt(inputLength.value, 10);
  const type = inputType.value;
  const customSymbols = inputCustomSymbols.value.trim();
  const method = inputMethod.value;
  const aesKey = inputAesKey.value.trim();

  let valid = true;

  if (isNaN(quantity) || quantity < 1 || quantity > 30000) {
    markError(inputQuantity, 'Cantidad debe ser entre 1 y 30,000');
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

  return {
    quantity,
    length,
    type,
    method,
    custom_symbols: customSymbols,
    aes_key: aesKey,
    exclude_ambiguous: optExcludeAmbiguous.checked,
    strict_rules: optStrict.checked,
    zero_knowledge: optZeroKnowledge.checked
  };
}

function markError(input, message) {
  input.classList.add('error');
  input.setAttribute('aria-describedby', 'field-error-' + input.id);
  const existing = document.getElementById('field-error-' + input.id);
  if (existing) existing.remove();

  const msg = document.createElement('p');
  msg.id = 'field-error-' + input.id;
  msg.style.cssText = 'font-size:0.75rem;color:#FF6B6B;margin-top:5px;';
  msg.textContent = message;
  input.closest('.input-wrapper, .field-group').appendChild(msg);
}

function clearFieldErrors() {
  document.querySelectorAll('.field-input.error').forEach(el => el.classList.remove('error'));
  document.querySelectorAll('[id^="field-error-"]').forEach(el => el.remove());
}

async function generatePasswords(params) {
  setLoading(btnGenerate, spinnerGenerate, true);
  hideAll();

  try {
    let json;
    if (params.zero_knowledge) {
      const localData = generateZeroKnowledge(params);
      json = {
        success: true,
        data: localData,
        count: localData.length,
        method: 'local_crypto',
        type: params.type,
        length: params.length
      };
    } else {
      json = await fetchPasswords(params);
    }

    if (!json.success) {
      const errMsg = json.errors ? json.errors.join(' | ') : (json.error || 'Error desconocido.');
      showError(errMsg);
      return;
    }

    allPasswords = json.data;
    currentPage = 1;
    pageSize = parseInt(pageSizeSelect.value, 10);

    localStorage.setItem('pwd_app_prefs', JSON.stringify({
      quantity: params.quantity,
      length: params.length,
      type: params.type,
      method: params.method,
      exclude_ambiguous: params.exclude_ambiguous,
      strict_rules: params.strict_rules
    }));

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
    btnExportJson.disabled = false;
    btnExportEnv.disabled = false;

  } catch (err) {
    showError('No se pudo conectar con el servidor.');
    console.error(err);
  } finally {
    setLoading(btnGenerate, spinnerGenerate, false);
  }
}

async function exportExcel(params) {
  setLoading(btnExport, spinnerExport, true);

  try {
    const response = await fetchExportExcel(params);

    if (!response.ok) {
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await response.json();
        showError(json.error || 'Error al exportar.');
      } else {
        showError('Error al exportar: ' + response.status);
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

    showToast('✓ Excel descargado correctamente', copyToast);

  } catch (err) {
    showError('Error de red al intentar descargar el Excel.');
    console.error(err);
  } finally {
    setLoading(btnExport, spinnerExport, false);
  }
}

function getFilteredPasswords() {
  const query = searchPasswords ? searchPasswords.value.trim().toLowerCase() : '';
  if (!query) return allPasswords;
  return allPasswords.filter(p => 
    p.plain.toLowerCase().includes(query) || 
    p.hashed.toLowerCase().includes(query)
  );
}

function renderTable() {
  const filtered = getFilteredPasswords();
  const totalPages = Math.ceil(filtered.length / pageSize);
  currentPage = Math.min(Math.max(1, currentPage), totalPages || 1);

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const slice = filtered.slice(start, end);

  tableBody.innerHTML = '';

  slice.forEach((item, relIndex) => {
    const absIndex = start + relIndex + 1;
    let strengthHtml = '<span style="color:var(--text-muted); font-size:0.75rem;">N/A</span>';
    
    if (typeof zxcvbn === 'function') {
      const result = zxcvbn(item.plain);
      const scores = ['Muy débil', 'Débil', 'Justa', 'Fuerte', 'Muy Fuerte'];
      const colors = ['#FF6B6B', '#FF6B6B', '#FFE66D', '#4ECDC4', '#4ECDC4'];
      const scoreColor = colors[result.score];
      const scoreText = scores[result.score];
      const pct = ((result.score + 1) * 20) + '%';
      
      strengthHtml = `
        <div style="display:flex; flex-direction:column; gap:4px; max-width: 100px;">
          <span style="font-size:0.75rem; font-weight:600; color:${scoreColor};">${scoreText}</span>
          <div style="width:100%; height:4px; background:rgba(108, 99, 255, 0.15); border-radius:2px; overflow:hidden;">
            <div style="width:${pct}; height:100%; background:${scoreColor};"></div>
          </div>
          <span style="font-size:0.65rem; color:var(--text-muted);" title="Crack time: ${result.crack_times_display.offline_fast_hashing_1e10_per_second}">${result.crack_times_display.offline_fast_hashing_1e10_per_second}</span>
        </div>
      `;
    }

    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="td-index">${absIndex}</td>
      <td class="td-plain">${escapeHtml(item.plain)}</td>
      <td class="td-strength">${strengthHtml}</td>
      <td class="td-hashed" title="${escapeHtml(item.hashed)}">${escapeHtml(item.hashed)}</td>
      <td style="text-align:center;">
        <button class="btn-qr btn-ghost" data-plain="${escapeAttr(item.plain)}" title="Generar QR" style="padding: 2px 6px; font-size: 0.8rem;">QR</button>
      </td>
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
      copyToClipboard(text, btn, showToast, copyToast);
    });
  });

  tableBody.querySelectorAll('.btn-qr').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-plain');
      if (currentQrCode) {
        currentQrCode.clear();
        qrcodeContainer.innerHTML = '';
      }
      currentQrCode = new QRCode(qrcodeContainer, {
        text: text,
        width: 180,
        height: 180,
      });
      qrModal.style.display = 'flex';
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
  const totalPages = Math.ceil(getFilteredPasswords().length / pageSize);
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
