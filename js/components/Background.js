export function createBackground(containerEl) {
  const cellSize = parseInt(
    getComputedStyle(document.documentElement)
      .getPropertyValue('--cell-size')
  );

  function build() {
    containerEl.innerHTML = '';

    const cols = Math.ceil(containerEl.clientWidth / cellSize);
    const rows = Math.ceil(containerEl.clientHeight / cellSize);
    const total = cols * rows;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < total; i++) {
      const cell = document.createElement('div');
      cell.classList.add('bg-cell');
      fragment.appendChild(cell);
    }

    containerEl.appendChild(fragment);
  }

  function enableDrawing() {
    containerEl.addEventListener('mouseover', (e) => {
      if (e.target.classList.contains('bg-cell')) {
        e.target.style.backgroundColor = 'var(--color-grid-hover)';
      }
    });
  }

  build();
  enableDrawing();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 200);
  });

  return { rebuild: build };
}
