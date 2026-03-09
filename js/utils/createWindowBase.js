let zCounter = 1;

export function createWindowBase({ title, icon, theme = 'blue', titlebarExtra, onOpen, onClose }) {
  const el = document.createElement('div');
  el.classList.add('window');
  if (theme === 'yellow') el.classList.add('window--yellow');

  // title bar
  const titlebar = document.createElement('div');
  titlebar.classList.add('window__titlebar');

  const titlebarLeft = document.createElement('div');
  titlebarLeft.classList.add('window__titlebar-left');

  const titleIcon = document.createElement('img');
  titleIcon.src = icon;
  titleIcon.alt = title;
  titleIcon.classList.add('window__titlebar-icon');

  const titleText = document.createElement('span');
  titleText.classList.add('window__title');
  titleText.textContent = title;

  titlebarLeft.appendChild(titleIcon);
  titlebarLeft.appendChild(titleText);
  if (titlebarExtra) titlebarLeft.appendChild(titlebarExtra);

  const closeBtn = document.createElement('button');
  closeBtn.classList.add('window__close-btn');
  const closeImg = document.createElement('img');
  closeImg.src = 'assets/close.png';
  closeImg.alt = 'Close';
  closeBtn.appendChild(closeImg);

  titlebar.appendChild(titlebarLeft);
  titlebar.appendChild(closeBtn);

  // body
  const body = document.createElement('div');
  body.classList.add('window__body');

  el.appendChild(titlebar);
  el.appendChild(body);

  // bring to front on click anywhere on the window
  el.addEventListener('mousedown', () => {
    el.style.zIndex = ++zCounter;
  });

  // open / close
  function open() {
    el.style.zIndex = ++zCounter;
    el.classList.add('window--open');
    onOpen?.();
  }

  function close() {
    el.classList.remove('window--open');
    onClose?.();
  }

  closeBtn.addEventListener('click', close);

  // drag
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  titlebar.addEventListener('mousedown', (e) => {
    if (e.target.closest('a, button')) return;
    isDragging = true;
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
    titlebar.style.cursor = "url('assets/handdrag1_sm.png'), grabbing";
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    el.style.left = (e.clientX - offsetX) + 'px';
    el.style.top = (e.clientY - offsetY) + 'px';
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    titlebar.style.cursor = "url('assets/handdrag1_sm.png'), grab";
  });

  return { el, titlebar, body, open, close };
}
