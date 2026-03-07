import { createWindowBase } from '../utils/createWindowBase.js';

export function createFolderWindow({
  title,
  icon,
  items,
  filters,
  titlebarLink,
  onOpen,
  onClose,
  onItemClick,
}) {
  // optional titlebar link (e.g. GitHub icon)
  let titlebarExtra = null;
  if (titlebarLink) {
    const a = document.createElement('a');
    a.href = titlebarLink.href;
    a.target = '_blank';
    a.rel = 'noopener';
    a.classList.add('window__titlebar-link');
    if (titlebarLink.svgHTML) {
      a.innerHTML = titlebarLink.svgHTML;
    } else {
      const img = document.createElement('img');
      img.src = titlebarLink.iconSrc;
      img.alt = titlebarLink.alt ?? '';
      a.appendChild(img);
    }
    titlebarExtra = a;
  }

  const { el, body, open, close } = createWindowBase({
    title, icon, theme: 'yellow', titlebarExtra, onOpen, onClose,
  });

  body.classList.add('window__body--folder');

  // sidebar (optional)
  let activeFilter = 'All';

  if (filters && filters.length > 0) {
    const sidebar = document.createElement('div');
    sidebar.classList.add('folder__sidebar');

    filters.forEach((label) => {
      const btn = document.createElement('button');
      btn.classList.add('folder__filter-btn');
      btn.textContent = label;
      if (label === 'All') btn.classList.add('folder__filter-btn--active');

      btn.addEventListener('click', () => {
        activeFilter = label;
        sidebar.querySelectorAll('.folder__filter-btn').forEach((b) =>
          b.classList.toggle('folder__filter-btn--active', b === btn),
        );
        applyFilter();
      });

      sidebar.appendChild(btn);
    });

    body.appendChild(sidebar);
  }

  // main file grid
  const main = document.createElement('div');
  main.classList.add('folder__main');

  const itemEls = items.map((item) => {
    const div = document.createElement('div');
    div.classList.add('folder-item');
    div.dataset.categories = (item.categories ?? []).join(',');

    const img = document.createElement('img');
    img.src = item.icon ?? 'assets/file.png';
    img.alt = item.label;
    img.classList.add('folder-item__img');
    img.draggable = false;

    const label = document.createElement('span');
    label.classList.add('folder-item__label');
    label.textContent = item.label;

    div.appendChild(img);
    div.appendChild(label);

    div.addEventListener('click', () => onItemClick?.(item));
    return div;
  });

  itemEls.forEach((itemEl) => main.appendChild(itemEl));
  body.appendChild(main);

  // filter logic
  function applyFilter() {
    itemEls.forEach((itemEl) => {
      const cats = itemEl.dataset.categories.split(',');
      const show = activeFilter === 'All' || cats.includes(activeFilter);
      itemEl.classList.toggle('folder-item--hidden', !show);
    });
  }

  return { el, open, close };
}
