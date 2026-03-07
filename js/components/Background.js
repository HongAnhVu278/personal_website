export function createBackground(containerEl) {
  const cellSize = parseInt(
    getComputedStyle(document.documentElement)
      .getPropertyValue('--cell-size')
  );

  // seeded PRNG (mulberry32) — same pattern every load
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  const rand = mulberry32(42);

  function build() {
    containerEl.innerHTML = '';

    const cols = Math.ceil(containerEl.clientWidth / cellSize) + 1;
    const rows = Math.ceil(containerEl.clientHeight / cellSize) + 1;

    containerEl.style.gridTemplateColumns = `repeat(${cols}, var(--cell-size))`;
    const total = cols * rows;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < total; i++) {
      const colorIndex = Math.floor(rand() * 4);
      const cell = document.createElement('div');
      cell.classList.add('bg-cell', `bg-cell--c${colorIndex}`);
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
