const API_BASE = './api/index.php';

export async function fetchPasswords(params) {
  const response = await fetch(`${API_BASE}?action=generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return await response.json();
}

export async function fetchExportExcel(params) {
  const response = await fetch(`${API_BASE}?action=export`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return response;
}

export function getFilenameFromResponse(response) {
  const disposition = response.headers.get('content-disposition') || '';
  const match = disposition.match(/filename="?([^";\n]+)"?/i);
  return match ? match[1] : null;
}
