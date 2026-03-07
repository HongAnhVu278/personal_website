import { createWindowBase } from '../utils/createWindowBase.js';

export function createWindow({ title, icon, contentUrl, onOpen, onClose, theme = 'blue', linkMap }) {
  const { el, body, open, close } = createWindowBase({ title, icon, theme, onOpen, onClose });

  // load content
  body.textContent = 'Loading...';
  fetch(contentUrl)
    .then((res) => res.text())
    .then((text) => {
      if (linkMap) {
        body.innerHTML = renderTextWithLinks(text, linkMap);
      } else {
        body.textContent = text;
      }
    })
    .catch(() => { body.textContent = 'Failed to load content.'; });

  return { el, open, close };
}

function renderTextWithLinks(text, linkMap) {
  let safe = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  for (const { text: phrase, href } of linkMap) {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    safe = safe.replace(
      new RegExp(escaped, 'g'),
      `<a href="${href}" target="_blank" rel="noopener">${phrase}</a>`,
    );
  }

  return '<pre style="white-space:pre-wrap;font-family:inherit;margin:0">' + safe + '</pre>';
}
