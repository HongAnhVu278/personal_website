export function createTaskbar({ activeFileEl, clockEl }) {
  const activeIcon = activeFileEl.querySelector('.taskbar__active-icon');
  const activeText = activeFileEl.querySelector('.taskbar__active-text');

  // active file
  function setActiveFile(name, icon) {
    activeText.textContent = name;
    if (icon) {
      activeIcon.src = icon;
      activeIcon.style.display = '';
    } else {
      activeIcon.style.display = 'none';
    }
    activeFileEl.classList.remove('taskbar__active-file--empty');
  }

  function clearActiveFile() {
    activeText.textContent = '';
    activeIcon.src = '';
    activeFileEl.classList.add('taskbar__active-file--empty');
  }

  function getActiveFile() {
    return activeText.textContent;
  }

  // start hidden
  activeFileEl.classList.add('taskbar__active-file--empty');

  // clock
  function formatTime(date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    const day = days[date.getDay()];
    const month = months[date.getMonth()];
    const dateNum = date.getDate();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;
    const mins = minutes.toString().padStart(2, '0');

    return `${day} ${month} ${dateNum} ${hours}:${mins}${ampm}`;
  }

  function updateClock() {
    clockEl.textContent = formatTime(new Date());
  }

  updateClock();
  setInterval(updateClock, 1000);

  return { setActiveFile, clearActiveFile, getActiveFile };
}
