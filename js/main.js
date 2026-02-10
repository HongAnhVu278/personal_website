import { createBackground } from './components/Background.js';
import { createDesktopIcon } from './components/DesktopIcon.js';
import { createWindow } from './components/Window.js';
import { createTaskbar } from './components/Taskbar.js';
import { desktopItems } from './data/desktopItems.js';

// background
const backgroundEl = document.getElementById('background');
createBackground(backgroundEl);

// taskbar
const taskbar = createTaskbar({
  activeFileEl: document.querySelector('.taskbar__active-file'),
  clockEl: document.querySelector('.taskbar__clock'),
});

// readme window
const windowsEl = document.getElementById('windows');

const readmeWindow = createWindow({
  title: 'README.txt',
  icon: 'assets/file.png',
  contentUrl: 'content/readme.txt',
  onOpen: () => taskbar.setActiveFile('README.txt'),
  onClose: () => taskbar.clearActiveFile(),
});

readmeWindow.el.style.left = '25%';
readmeWindow.el.style.top = '15%';
windowsEl.appendChild(readmeWindow.el);
readmeWindow.open();

// desktop icons
const desktopEl = document.getElementById('desktop');

desktopItems.forEach((item) => {
  const icon = createDesktopIcon(item);

  icon.onClick((id) => {
    if (id === 'readme') {
      readmeWindow.open();
    }
  });

  desktopEl.appendChild(icon.el);
});
