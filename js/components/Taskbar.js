export function createTaskbar({ tabsEl, clockEl }) {
  const tabs = new Map(); // name → tab element

  function addTab(name, icon) {
    if (tabs.has(name)) return;

    const tab = document.createElement('div');
    tab.classList.add('taskbar__tab');

    if (icon) {
      const img = document.createElement('img');
      img.src = icon;
      img.alt = name;
      img.classList.add('taskbar__tab-icon');
      img.draggable = false;
      tab.appendChild(img);
    }

    const text = document.createElement('span');
    text.classList.add('taskbar__tab-text');
    text.textContent = name;
    tab.appendChild(text);

    tabsEl.appendChild(tab);
    tabs.set(name, tab);
  }

  function removeTab(name) {
    const tab = tabs.get(name);
    if (tab) {
      tab.remove();
      tabs.delete(name);
    }
  }

  function getActiveFile() {
    // return the last tab name (most recently added)
    const keys = [...tabs.keys()];
    return keys.length > 0 ? keys[keys.length - 1] : '';
  }

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

  return { addTab, removeTab, getActiveFile };
}
