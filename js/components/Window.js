import { createWindowBase } from '../utils/createWindowBase.js';

export function createWindow({ title, icon, contentUrl, onOpen, onClose, theme = 'blue', linkMap, actionMap, highlightWords, image }) {
  const { el, body, open, close } = createWindowBase({ title, icon, theme, onOpen, onClose });

  // load content
  body.textContent = 'Loading...';
  fetch(contentUrl)
    .then((res) => res.text())
    .then((text) => {
      const hasFormatting = linkMap || actionMap || highlightWords || image;
      if (hasFormatting) {
        body.innerHTML = renderContent(text, { linkMap, actionMap, highlightWords, image });
        // bind action links
        if (actionMap) {
          body.querySelectorAll('a[data-action]').forEach((a) => {
            a.addEventListener('click', (e) => {
              e.preventDefault();
              const fn = actionMap[a.dataset.action];
              fn?.();
            });
          });
        }
      } else {
        body.textContent = text;
      }
    })
    .catch(() => { body.textContent = 'Failed to load content.'; });

  return { el, open, close };
}

function renderContent(text, { linkMap, actionMap, highlightWords, image }) {
  let safe = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // convert bare URLs to clickable "link" text
  safe = safe.replace(
    /https?:\/\/[^\s<]+/g,
    (url) => `<a href="${url}" target="_blank" rel="noopener">link</a>`,
  );

  if (linkMap) {
    for (const { text: phrase, href } of linkMap) {
      const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      safe = safe.replace(
        new RegExp(escaped, 'g'),
        `<a href="${href}" target="_blank" rel="noopener">${phrase}</a>`,
      );
    }
  }

  if (actionMap) {
    for (const key of Object.keys(actionMap)) {
      const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      safe = safe.replace(
        new RegExp(escaped, 'g'),
        `<a href="#" data-action="${key}">${key}</a>`,
      );
    }
  }

  if (highlightWords) {
    for (const word of highlightWords) {
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // only match text outside of HTML tags
      safe = safe.replace(
        new RegExp(`(?<![<\\w"=/])${escaped}(?![^<]*>)`, 'g'),
        `<span class="highlight">${word}</span>`,
      );
    }
  }

  // insert image before the links section (last --- block)
  if (image) {
    const imgTag = `</pre><img src="${image}" alt="${image}" class="window__content-img"><pre style="white-space:pre-wrap;font-family:inherit;margin:0">`;
    const lastDivider = safe.lastIndexOf('-------------------');
    if (lastDivider !== -1) {
      safe = safe.slice(0, lastDivider) + imgTag + safe.slice(lastDivider);
    } else {
      safe += imgTag;
    }
  }

  return '<pre style="white-space:pre-wrap;font-family:inherit;margin:0">' + safe + '</pre>';
}
