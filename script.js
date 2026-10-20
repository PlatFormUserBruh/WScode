:root {
  --bg: #151a21;
  --bg-2: #1d2430;
  --bg-3: #111821;
  --panel: #141c24;
  --panel-2: #1b2430;
  --panel-3: #202b38;
  --toolbar: #131a22;
  --border: rgba(255, 255, 255, 0.08);
  --border-strong: rgba(255, 255, 255, 0.14);
  --muted: #8a93a6;
  --text: #ebf1ff;
  --text-soft: #c9d2e4;
  --accent: #ffdd57;
  --accent-2: #6bdcff;
  --accent-3: #7dff9f;
  --danger: #ff6b6b;
  --shadow: rgba(0, 0, 0, 0.32);
}

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  height: 100%;
  background: var(--bg);
  color: var(--text);
  font-family: Inter, "Segoe UI", Roboto, sans-serif;
}

body {
  min-height: 100vh;
}

button, input, textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

.app-shell {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: linear-gradient(180deg, #0e141a 0%, #141b24 100%);
}

.toolbar-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 62px;
  padding: 10px 14px;
  background: rgba(19, 24, 31, 0.96);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 1px 0 rgba(255,255,255,0.02);
}

.header-left,
.header-center,
.header-right {
  display: flex;
  align-items: center;
}

.header-left {
  flex: 0 0 auto;
}

.header-center {
  flex: 1;
  justify-content: center;
  min-width: 0;
}

.header-right {
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding-right: 10px;
}

.brand-mark {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #ffdd57, #6bdcff);
  color: #111;
  font-weight: 900;
  font-size: 0.82rem;
  box-shadow: 0 10px 20px rgba(107, 220, 255, 0.24);
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.brand-text strong {
  font-size: 1rem;
  letter-spacing: 0.02em;
}

.brand-text span {
  font-size: 0.68rem;
  color: var(--muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.project-input-wrap {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 7px 10px;
  min-width: min(400px, 45vw);
}

.project-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px 8px;
  border-radius: 7px;
  font-size: 0.64rem;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  background: rgba(255,255,255,0.04);
  color: var(--muted);
}

.project-input-wrap input {
  width: 100%;
  border: none;
  background: transparent;
  color: var(--text);
  font-size: 0.86rem;
  outline: none;
}

.action-btn,
.small-btn,
.tab {
  border: 1px solid var(--border);
  background: rgba(255,255,255,0.02);
  color: var(--text);
  border-radius: 8px;
  transition: 160ms ease;
}

.action-btn {
  min-height: 36px;
  padding: 0 14px;
  font-weight: 600;
}

.action-btn.primary {
  background: linear-gradient(135deg, #ffd857, #f5c542);
  border-color: transparent;
  color: #1b1b1b;
  box-shadow: 0 12px 24px rgba(255, 216, 87, 0.18);
}

.action-btn.subtle {
  background: rgba(255,255,255,0.03);
}

.action-btn:hover,
.small-btn:hover,
.tab:hover {
  transform: translateY(-1px);
  border-color: var(--border-strong);
  box-shadow: 0 8px 18px rgba(0,0,0,0.18);
}

.editor-layout {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(420px, 1.2fr) 12px minmax(300px, 0.8fr);
  overflow: hidden;
}

.code-panel,
.preview-panel {
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: var(--panel);
}

.panel-top,
.preview-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 52px;
  padding: 8px 14px;
  background: rgba(21, 26, 33, 0.98);
  border-bottom: 1px solid var(--border);
}

.tab-list {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab {
  padding: 8px 12px;
  min-height: 32px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.tab.active {
  background: rgba(255, 221, 87, 0.1);
  border-color: rgba(255, 221, 87, 0.42);
  color: #ffd857;
}

.tab-tools {
  display: flex;
  align-items: center;
  gap: 8px;
}

.small-btn {
  min-height: 30px;
  padding: 0 10px;
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.editor-stack {
  flex: 1;
  min-height: 0;
  background: var(--bg-3);
}

.editor-wrap {
  display: none;
  height: 100%;
  flex-direction: column;
}

.editor-wrap.active {
  display: flex;
}

.editor-label {
  display: flex;
  align-items: center;
  padding: 8px 14px 6px;
  font-size: 0.72rem;
  color: var(--muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: rgba(255,255,255,0.015);
  border-bottom: 1px solid var(--border);
}

textarea {
  width: 100%;
  flex: 1;
  resize: none;
  border: none;
  outline: none;
  padding: 16px 14px 18px;
  background: #10171d;
  color: #edf3ff;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 14px;
  line-height: 1.6;
  tab-size: 2;
}

textarea::selection {
  background: rgba(107, 220, 255, 0.35);
}

.splitter {
  position: relative;
  background: rgba(255,255,255,0.04);
  border-left: 1px solid var(--border);
  border-right: 1px solid var(--border);
  cursor: col-resize;
}

.splitter::before {
  content: "";
  position: absolute;
  inset: 50% 4px auto 4px;
  transform: translateY(-50%);
  height: 48px;
  border-radius: 999px;
  background: rgba(255,255,255,0.09);
}

.preview-panel {
  background: #f3f5f9;
}

.preview-topbar {
  background: rgba(18, 23, 29, 0.96);
  color: var(--text);
}

.status-wrap {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.live-indicator {
  color: var(--accent-3);
  font-size: 0.8rem;
  text-shadow: 0 0 10px rgba(125, 255, 159, 0.8);
}

.status-text {
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
}

#previewFrame {
  width: 100%;
  height: 100%;
  border: 0;
  background: white;
}

@media (max-width: 980px) {
  .toolbar-bar {
    flex-wrap: wrap;
    padding-top: 12px;
    padding-bottom: 12px;
  }

  .header-center {
    order: 3;
    width: 100%;
  }

  .project-input-wrap {
    width: 100%;
    min-width: 0;
  }

  .editor-layout {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(420px, 1fr) 12px minmax(300px, 0.8fr);
  }

  .splitter {
    display: none;
  }
}

@media (max-width: 640px) {
  .header-right {
    width: 100%;
    justify-content: flex-start;
  }

  .action-btn {
    flex: 1 1 calc(50% - 10px);
  }

  .panel-top {
    flex-wrap: wrap;
  }

  .tab-list,
  .tab-tools {
    width: 100%;
    justify-content: space-between;
  }
}
