const defaultProject = {
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
const statusDot = document.getElementById('statusDot');
const tabs = document.querySelectorAll('.tab');
const editors = document.querySelectorAll('.editor');

const state = loadProject();

function loadProject() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        html: parsed.html ?? defaultProject.html,
        css: parsed.css ?? defaultProject.css,
        js: parsed.js ?? defaultProject.js
      };
    } catch (error) {
      console.warn('Invalid saved project, resetting default project.', error);
    }
  }

  return {
    html: defaultProject.html,
    css: defaultProject.css,
    js: defaultProject.js
  };
}

function saveProject() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function updateEditors() {
  htmlEditor.value = state.html;
  cssEditor.value = state.css;
  jsEditor.value = state.js;
  renderPreview();
}

function renderPreview() {
  state.html = htmlEditor.value;
  state.css = cssEditor.value;
  state.js = jsEditor.value;
  saveProject();

  const doc = `
    <!DOCTYPE html>
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
            err.style.cssText = 'margin: 16px; padding: 12px; background: #fee2e2; color: #991b1b; border-radius: 8px; font-family: monospace; white-space: pre-wrap;';
            err.textContent = 'JavaScript error: ' + error.message;
            document.body.appendChild(err);
          }
        <\/script>
      </body>
    </html>
  `;

  previewFrame.srcdoc = doc;
  statusDot.style.color = '#6ee7b7';
  statusDot.title = 'Preview updated';
  setTimeout(() => {
    statusDot.style.color = '#6ee7b7';
  }, 500);
}

function activateTab(tabName) {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.tab === tabName;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });

  editors.forEach((editor) => {
    const isActive = editor.dataset.editor === tabName;
    editor.classList.toggle('active', isActive);
  });
}

function resetProject() {
  state.html = defaultProject.html;
  state.css = defaultProject.css;
  state.js = defaultProject.js;
  updateEditors();
}

function buildDownload(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportProject() {
  const project = JSON.stringify({ html: state.html, css: state.css, js: state.js }, null, 2);
  buildDownload('wscode-project.json', project, 'application/json');
}

function exportSingle(type) {
  const map = {
    html: { file: 'index.html', content: state.html },
    css: { file: 'styles.css', content: state.css },
    js: { file: 'script.js', content: state.js }
  };

  const selection = map[type];
  if (!selection) return;

  buildDownload(selection.file, selection.content, 'text/plain;charset=utf-8');
}

async function importProject(event) {
  const [file] = event.target.files || [];
  if (!file) return;

  const text = await file.text();

  try {
    const payload = JSON.parse(text);
    if (payload.html !== undefined || payload.css !== undefined || payload.js !== undefined) {
      state.html = payload.html ?? state.html;
      state.css = payload.css ?? state.css;
      state.js = payload.js ?? state.js;
      updateEditors();
      fileInput.value = '';
      return;
    }
  } catch (error) {
    // Not JSON, continue to file-based import below.
  }

  if (file.name.endsWith('.html')) {
    state.html = text;
  } else if (file.name.endsWith('.css')) {
    state.css = text;
  } else if (file.name.endsWith('.js')) {
    state.js = text;
  }

  updateEditors();
  fileInput.value = '';
}

htmlEditor.addEventListener('input', renderPreview);
cssEditor.addEventListener('input', renderPreview);
jsEditor.addEventListener('input', renderPreview);

fileInput.addEventListener('change', importProject);

document.getElementById('runBtn').addEventListener('click', renderPreview);
document.getElementById('resetBtn').addEventListener('click', resetProject);
document.getElementById('importBtn').addEventListener('click', () => fileInput.click());
document.getElementById('exportBtn').addEventListener('click', exportProject);
document.getElementById('exportHtmlBtn').addEventListener('click', () => exportSingle('html'));
document.getElementById('exportCssBtn').addEventListener('click', () => exportSingle('css'));
document.getElementById('exportJsBtn').addEventListener('click', () => exportSingle('js'));

tabs.forEach((tab) => {
  tab.addEventListener('click', () => activateTab(tab.dataset.tab));
});

updateEditors();
activateTab('html');
