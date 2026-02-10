import { createBackground } from './components/Background.js';
import { createDesktopIcon } from './components/DesktopIcon.js';
import { desktopItems } from './data/desktopItems.js';

// background
const backgroundEl = document.getElementById('background');
createBackground(backgroundEl);

// desktop icons
const desktopEl = document.getElementById('desktop');

desktopItems.forEach((item) => {
  const icon = createDesktopIcon(item);

  icon.onClick((id) => {
    console.log(`Opened: ${id}`);
    // window opening will be wired in step 4
  });

  desktopEl.appendChild(icon.el);
});
