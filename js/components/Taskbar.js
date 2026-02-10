export function createTaskbar({ activeFileEl, clockEl }) {
  // active file
  function setActiveFile(name) {
    activeFileEl.textContent = name;
  }

  function clearActiveFile() {
    activeFileEl.textContent = '';
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

  return { setActiveFile, clearActiveFile };
}
