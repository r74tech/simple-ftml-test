// src/main.ts
// @ts-ignore
import { init, renderHTML, makeInfo, parse, inspectTokens } from './esm/wj-ftml-wasm.mjs';
// import { init, renderHTML, makeInfo, parse, inspectTokens } from '@vscode/ftml-wasm';

const createRenderer = () => {
  const template = document.createElement('template');
  template.innerHTML = `
    <div id="ftml-preview"></div>
  `;

  const updatePreview = (shadow: ShadowRoot, html: string) => {
    const container = shadow.querySelector('div');
    if (container) container.innerHTML = html;
  };

  const renderFTML = (inputText: string, shadow: ShadowRoot) => {
    if (!inputText) {
      updatePreview(shadow, '');
      return;
    }

    try {
      const htmlOutput = renderHTML(inputText, makeInfo({ score: 0 }));
      updatePreview(shadow, htmlOutput.html);
      console.log('Parsed Tokens:', parse(inputText));
      console.log('Inspected Tokens:', inspectTokens(inputText));
    } catch (error) {
      console.error('Error rendering HTML:', error);
      updatePreview(shadow, '<p style="color: red;">エラーが発生しました。</p>');
    }
  };

  customElements.define('ftml-renderer',
    class extends HTMLElement {
      private shadow: ShadowRoot;

      constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.shadow.appendChild(template.content.cloneNode(true));
      }

      connectedCallback() {
        const textarea = document.getElementById('ftml-input');
        textarea?.addEventListener('input', e =>
          renderFTML((e.target as HTMLTextAreaElement).value.trim(), this.shadow)
        );
      }
    }
  );
};

window.addEventListener('DOMContentLoaded', () => {
  init()
    .then(() => {
      console.log('FTML WASM initialized.');
      createRenderer();
    })
    .catch((err: unknown) => console.error('Failed to initialize FTML WASM:', err));
});