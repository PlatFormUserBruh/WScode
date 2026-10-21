const defaultProject = {
  projectName: 'WScode Playground',
  html: `<!DOCTYPE html>
<html>
  <body>
    <div class="card">
      <h1>Hello, WScode 👋</h1>
      <p>Build anything here and watch it update instantly.</p>
      <button id="demoBtn">Click me</button>
    </div>
  </body>
</html>`,
  css: `body {
  margin: 0;
  min-height: 100vh;
  font-family: Arial, sans-serif;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #0f172a, #1d4ed8);
  color: #e2e8f0;
}

.card {
  width: min(420px, 80vw);
  padding: 32px;
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.22);
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.45);
  text-align: center;
}

h1 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: clamp(2rem, 4vw, 2.8rem);
}

p {
  font-size: 1rem;
  color: #cbd5e1;
  margin-bottom: 20px;
}

button {
  background: linear-gradient(135deg, #6ee7b7, #60a5fa);
  color: #04131b;
  border: 0;
  padding: 12px 18px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}`,
  js: `document.getElementById('demoBtn')?.addEventListener('click', () => {
  alert('WScode preview is live!');
});`
};

const STORAGE_KEY = 'wscode-project-v1';
const htmlEditor = document.getElementById('htmlEditor');
const cssEditor = document.getElementById('cssEditor');
const jsEditor = document.getElementById('jsEditor');
const previewFrame = document.getElementById('previewFrame');
const fileInput = document.getElementById('fileInput');
const liveIndicator = document.getElementById('liveIndicator');
const projectNameInput = document.getElementById('projectName');
const sidebar = document.getElementById('sidebar');
const fileList = document.getElementById('fileList');
const tabs = document.querySelectorAll('.tab');
const editors = document.querySelectorAll('.editor-wrap');

const state = loadProject();
let activeType = 'html';
let activeFileId = 'html';

const BASE_FILES = [
  { id: 'html', label: 'index.html', type: 'HTML', kind: 'html' },
  { id: 'css', label: 'style.css', type: 'CSS', kind: 'css' },
  { id: 'js', label: 'script.js', type: 'JS', kind: 'js' }
];

let fileModel = [...BASE_FILES];

function loadProject() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return JSON.parse(JSON.stringify(defaultProject));

  try {
    const parsed = JSON.parse(saved);
    return {
      projectName: parsed.projectName || defaultProject.projectName,
      html: parsed.html ?? defaultProject.html,
      css: parsed.css ?? defaultProject.css,
      js: parsed.js ?? defaultProject.js
    };
  } catch (error) {
    return JSON.parse(JSON.stringify(defaultProject));
  }
}

function saveProject() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function syncEditorsFromState() {
  htmlEditor.value = state.html;
  cssEditor.value = state.css;
  jsEditor.value = state.js;
  projectNameInput.value = state.projectName;
  renderPreview();
}

function setActiveTab(type) {
  activeType = type;

  tabs.forEach((tab) => {
    const isActive = tab.dataset.tab === type;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });

  editors.forEach((editor) => {
    const isActive = editor.dataset.editor === type;
    editor.classList.toggle('active', isActive);
  });
}

function focusFile(fileId) {
  const item = fileModel.find((entry) => entry.id === fileId);
  if (!item) return;
  activeFileId = fileId;
  setActiveTab(item.kind);
  renderFileList();
}

function renderPreview() {
  state.html = htmlEditor.value;
  state.css = cssEditor.value;
  state.js = jsEditor.value;
  state.projectName = projectNameInput.value.trim() || defaultProject.projectName;
  saveProject();

  const doc = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>${state.css}</style>
  </head>
  <body>
    ${state.html}
    <script>
      try {
        ${state.js}
      } catch (error) {
        const err = document.createElement('pre');
        err.style.cssText = 'margin:16px;padding:12px;border-radius:8px;background:#fee2e2;color:#991b1b;font-family:monospace;white-space:pre-wrap;';
        err.textContent = 'JavaScript error: ' + error.message;
        document.body.appendChild(err);
      }
    <\/script>
  </body>
</html>`;

  previewFrame.srcdoc = doc;
  liveIndicator.style.color = '#7dff9f';
}

function buildDownload(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function exportProject() {
  const payload = JSON.stringify({ projectName: state.projectName, html: state.html, css: state.css, js: state.js }, null, 2);
  buildDownload('wscode-project.json', payload, 'application/json');
}

function exportSingle(type) {
  const map = {
    html: { file: 'index.html', content: state.html },
    css: { file: 'style.css', content: state.css },
    js: { file: 'script.js', content: state.js }
  };
  const item = map[type];
  if (!item) return;
  buildDownload(item.file, item.content, 'text/plain;charset=utf-8');
}

async function importProject(event) {
  const [file] = event.target.files || [];
  if (!file) return;

  const text = await file.text();
  try {
    const payload = JSON.parse(text);
    if (payload.html !== undefined || payload.css !== undefined || payload.js !== undefined) {
      state.projectName = payload.projectName || state.projectName;
      state.html = payload.html ?? state.html;
      state.css = payload.css ?? state.css;
      state.js = payload.js ?? state.js;
      syncEditorsFromState();
      fileInput.value = '';
      return;
    }
  } catch (error) {
    // ignore and fall through to single-file handling
  }

  if (file.name.endsWith('.html')) state.html = text;
  else if (file.name.endsWith('.css')) state.css = text;
  else if (file.name.endsWith('.js')) state.js = text;

  syncEditorsFromState();
  fileInput.value = '';
}

function renderFileList() {
  fileList.innerHTML = fileModel
    .map((file) => {
      const activeClass = activeFileId === file.id ? 'active' : '';
      return `
        <div class="file-item ${activeClass}" data-file-id="${file.id}" data-file-type="${file.kind}">
          <div class="file-meta">
            <span class="file-type">${file.type}</span>
            <span class="file-name">${file.label}</span>
          </div>
          <div class="file-actions-mini">
            <button class="file-action-btn" data-action="rename" data-target="${file.id}" type="button">✎</button>
            <button class="file-action-btn" data-action="delete" data-target="${file.id}" type="button">×</button>
          </div>
        </div>
      `;
    })
    .join('');
}

function renameFile(fileId) {
  const file = fileModel.find((entry) => entry.id === fileId);
  if (!file) return;

  const nextName = window.prompt('Rename file:', file.label);
  if (!nextName) return;

  const trimmed = nextName.trim();
  if (!trimmed) return;

  file.label = trimmed.includes('.') ? trimmed : `${trimmed}.${file.kind}`;
  renderFileList();
}

function addFile() {
  const kind = ['html', 'css', 'js'][fileModel.length % 3];
  const id = `custom-${Date.now()}`;
  const label = `custom-${fileModel.length + 1}.${kind}`;
  fileModel.push({ id, label, type: kind.toUpperCase(), kind });
  activeFileId = id;
  setActiveTab(kind);
  renderFileList();
}

function deleteFile(fileId) {
  const file = fileModel.find((entry) => entry.id === fileId);
  if (!file) return;

  const isBase = BASE_FILES.some((entry) => entry.id === file.id);

  if (isBase) {
    if (file.kind === 'html') state.html = defaultProject.html;
    if (file.kind === 'css') state.css = defaultProject.css;
    if (file.kind === 'js') state.js = defaultProject.js;
    syncEditorsFromState();
    return;
  }

  fileModel = fileModel.filter((entry) => entry.id !== fileId);

  if (activeFileId === fileId) {
    activeFileId = fileModel[0]?.id || 'html';
    setActiveTab(fileModel[0]?.kind || 'html');
  }

  renderFileList();
  syncEditorsFromState();
}

function toggleSidebar(forceState) {
  const shouldOpen = typeof forceState === 'boolean' ? forceState : sidebar.classList.contains('collapsed');
  sidebar.classList.toggle('collapsed', !shouldOpen);
}

htmlEditor.addEventListener('input', renderPreview);
cssEditor.addEventListener('input', renderPreview);
jsEditor.addEventListener('input', renderPreview);
projectNameInput.addEventListener('input', renderPreview);

document.getElementById('saveBtn').addEventListener('click', renderPreview);
document.getElementById('resetBtn').addEventListener('click', () => {
  const fresh = JSON.parse(JSON.stringify(defaultProject));
  state.projectName = fresh.projectName;
  state.html = fresh.html;
  state.css = fresh.css;
  state.js = fresh.js;
  syncEditorsFromState();
});
document.getElementById('runBtn').addEventListener('click', renderPreview);
document.getElementById('importBtn').addEventListener('click', () => fileInput.click());
document.getElementById('exportBtn').addEventListener('click', exportProject);
document.getElementById('downloadHtmlBtn').addEventListener('click', () => exportSingle('html'));
document.getElementById('downloadCssBtn').addEventListener('click', () => exportSingle('css'));
document.getElementById('downloadJsBtn').addEventListener('click', () => exportSingle('js'));
fileInput.addEventListener('change', importProject);
document.getElementById('newFileBtn').addEventListener('click', addFile);
document.getElementById('sidebarToggle').addEventListener('click', () => toggleSidebar());
document.getElementById('openSidebarBtn').addEventListener('click', () => toggleSidebar(true));

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const kind = tab.dataset.tab;
    activeType = kind;
    const matchingFile = fileModel.find((entry) => entry.kind === kind) || fileModel[0];
    if (matchingFile) activeFileId = matchingFile.id;
    setActiveTab(kind);
    renderFileList();
  });
});

fileList.addEventListener('click', (event) => {
  const actionButton = event.target.closest('[data-action]');
  if (actionButton) {
    const target = actionButton.dataset.target;
    if (actionButton.dataset.action === 'rename') renameFile(target);
    if (actionButton.dataset.action === 'delete') deleteFile(target);
    return;
  }

  const item = event.target.closest('.file-item');
  if (item) {
    const fileId = item.dataset.fileId;
    const match = fileModel.find((entry) => entry.id === fileId);
    if (match) {
      activeFileId = fileId;
      setActiveTab(match.kind);
      renderFileList();
    }
  }
});

const splitter = document.getElementById('splitter');
const editorLayout = document.getElementById('editorLayout');
let isDragging = false;

splitter.addEventListener('mousedown', () => {
  isDragging = true;
});

document.addEventListener('mousemove', (event) => {
  if (!isDragging) return;
  const containerWidth = editorLayout.clientWidth;
  const leftWidth = Math.min(Math.max(event.clientX - editorLayout.getBoundingClientRect().left, 300), containerWidth - 300);
  editorLayout.style.gridTemplateColumns = `${leftWidth}px 12px ${containerWidth - leftWidth - 12}px`;
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});

syncEditorsFromState();
setActiveTab('html');
renderFileList();
