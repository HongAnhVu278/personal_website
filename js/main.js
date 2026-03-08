import { createBackground } from './components/Background.js';
import { createDesktopIcon } from './components/DesktopIcon.js';
import { createWindow } from './components/Window.js';
import { createFolderWindow } from './components/FolderWindow.js';
import { createTaskbar } from './components/Taskbar.js';
import { desktopItems } from './data/desktopItems.js';
import { projects } from './data/projects.js';
import { experiences } from './data/experiences.js';

// background
const backgroundEl = document.getElementById('background');
createBackground(backgroundEl);

// taskbar
const taskbar = createTaskbar({
  activeFileEl: document.querySelector('.taskbar__active-file'),

  clockEl: document.querySelector('.taskbar__clock'),
});

const windowsEl = document.getElementById('windows');

// cascade window positions so they don't stack
let windowOffset = 0;
function nextPosition() {
  const pos = { left: `${20 + windowOffset}%`, top: `${12 + windowOffset * 2}%` };
  windowOffset = (windowOffset + 2) % 10;
  return pos;
}

function mountWindow(win, pos) {
  win.el.style.left = pos.left;
  win.el.style.top = pos.top;
  windowsEl.appendChild(win.el);
}

// readme window
const readmeWindow = createWindow({
  title: 'README.txt',
  icon: 'assets/file.png',
  contentUrl: 'content/readme.txt',
  actionMap: {
    'Projects': () => windowMap.projects?.open(),
    'Experience': () => windowMap.experience?.open(),
    'Writing': () => windowMap.writing?.open(),
    'Say hi!!': () => windowMap.contact?.open(),
  },
  highlightWords: ['technology', 'art', 'writing'],
  onOpen: () => taskbar.setActiveFile('README.txt', 'assets/file.png'),
  onClose: () => {
    if (taskbar.getActiveFile() === 'README.txt') taskbar.clearActiveFile();
  },
});
mountWindow(readmeWindow, { left: '25%', top: '15%' });
readmeWindow.open();

// GitHub SVG icon for Projects titlebar
const githubSVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
  0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15
  -.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87
  .51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12
  0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82
  2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65
  3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0
  0 0 16 8c0-4.42-3.58-8-8-8z"/>
</svg>`;

// project detail windows (lazy-created on first click)
const projectDetailWindows = {};

function openProjectDetail(item) {
  if (!projectDetailWindows[item.id]) {
    const w = createWindow({
      title: item.title,
      icon: 'assets/file.png',
      contentUrl: item.contentUrl,
      image: item.image,
      onOpen: () => taskbar.setActiveFile(item.title, 'assets/file.png'),
      onClose: () => {
        if (taskbar.getActiveFile() === item.title) taskbar.clearActiveFile();
      },
    });
    mountWindow(w, nextPosition());
    projectDetailWindows[item.id] = w;
  }
  projectDetailWindows[item.id].open();
}

// projects window
const projectsWindow = createFolderWindow({
  title: 'Projects',
  icon: 'assets/folder_yellow.png',
  items: projects,
  filters: ['All', 'Web Dev', 'Creative', 'Data'],
  titlebarLink: {
    href: 'https://github.com/HongAnhVu278',
    svgHTML: githubSVG,
    alt: 'GitHub',
  },
  onOpen: () => taskbar.setActiveFile('Projects', 'assets/folder_yellow.png'),
  onClose: () => {
    if (taskbar.getActiveFile() === 'Projects') taskbar.clearActiveFile();
  },
  onItemClick: openProjectDetail,
});
mountWindow(projectsWindow, nextPosition());

// experience detail windows (lazy-created on first click)
const experienceDetailWindows = {};

function openExperienceDetail(item) {
  if (!experienceDetailWindows[item.id]) {
    const w = createWindow({
      title: item.title,
      icon: 'assets/file.png',
      contentUrl: item.contentUrl,
      linkMap: item.linkMap,
      onOpen: () => taskbar.setActiveFile(item.title, 'assets/file.png'),
      onClose: () => {
        if (taskbar.getActiveFile() === item.title) taskbar.clearActiveFile();
      },
    });
    mountWindow(w, nextPosition());
    experienceDetailWindows[item.id] = w;
  }
  experienceDetailWindows[item.id].open();
}

// experience window
const experienceWindow = createFolderWindow({
  title: 'Experience',
  icon: 'assets/folder_blue.png',
  items: experiences,
  filters: ['All', 'Current', 'Past'],
  onOpen: () => taskbar.setActiveFile('Experience', 'assets/folder_blue.png'),
  onClose: () => {
    if (taskbar.getActiveFile() === 'Experience') taskbar.clearActiveFile();
  },
  onItemClick: openExperienceDetail,
});
mountWindow(experienceWindow, nextPosition());

// writing window
const writingWindow = createWindow({
  title: 'Writing.txt',
  icon: 'assets/file.png',
  contentUrl: 'content/writing.txt',
  linkMap: [
    { text: 'Recurse Center', href: 'https://www.recurse.com/' },
    { text: 'Debugging My 20s', href: 'https://debuggingmy20s.substack.com/' },
  ],
  onOpen: () => taskbar.setActiveFile('Writing.txt', 'assets/file.png'),
  onClose: () => {
    if (taskbar.getActiveFile() === 'Writing.txt') taskbar.clearActiveFile();
  },
});
mountWindow(writingWindow, nextPosition());

// contacts window
const contactsWindow = createWindow({
  title: 'Contacts.txt',
  icon: 'assets/contacts.png',
  contentUrl: 'content/contacts.txt',
  linkMap: [
    { text: 'honganhvu278@gmail.com', href: 'mailto:honganhvu278@gmail.com' },
    { text: 'github.com/HongAnhVu278', href: 'https://github.com/HongAnhVu278' },
    { text: 'linkedin.com/in/anh-vu-120879242', href: 'https://www.linkedin.com/in/anh-vu-120879242/' },
    { text: 'instagram.com/h.anh_vu', href: 'https://www.instagram.com/h.anh_vu/' },
  ],
  onOpen: () => taskbar.setActiveFile('Contacts.txt', 'assets/contacts.png'),
  onClose: () => {
    if (taskbar.getActiveFile() === 'Contacts.txt') taskbar.clearActiveFile();
  },
});
mountWindow(contactsWindow, nextPosition());

// window map for desktop icon clicks
const windowMap = {
  readme: readmeWindow,
  projects: projectsWindow,
  experience: experienceWindow,
  writing: writingWindow,
  contact: contactsWindow,
};

// desktop icons
const desktopEl = document.getElementById('desktop');

desktopItems.forEach((item) => {
  const icon = createDesktopIcon(item);

  icon.onClick((id) => {
    windowMap[id]?.open();
  });

  desktopEl.appendChild(icon.el);
});
