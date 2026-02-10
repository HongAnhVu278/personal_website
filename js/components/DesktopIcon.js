export function createDesktopIcon({ id, label, icon, position, interactive }) {
  const el = document.createElement('div');
  el.classList.add('desktop-icon');
  el.dataset.id = id;
  el.style.gridArea = position.gridArea;

  if (!interactive) {
    el.classList.add('desktop-icon--disabled');
  }

  const img = document.createElement('img');
  img.src = icon;
  img.alt = label;
  img.classList.add('desktop-icon__img');
  img.draggable = false;

  const labelEl = document.createElement('span');
  labelEl.classList.add('desktop-icon__label');
  labelEl.textContent = label;

  el.appendChild(img);
  el.appendChild(labelEl);

  return {
    el,
    onClick(callback) {
      if (interactive) {
        el.addEventListener('dblclick', () => callback(id));
      }
    },
  };
}
