// Browser presentation of the Macintosh wallpaper's Spectrum mode.
// The retro textures are bundled locally; CSS handles color and camera motion.
export function startSpectrumWallpaper() {
  const root = document.documentElement;
  const control = document.getElementById('wallpaper-motion');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false;
  try { paused = localStorage.getItem('portfolio-wallpaper-paused') === 'true'; } catch {}

  function sync() {
    const staticWallpaper = paused || motion.matches;
    root.dataset.wallpaperMotion = staticWallpaper || document.hidden ? 'paused' : 'running';
    control.textContent = staticWallpaper ? 'Resume' : 'Pause';
    control.setAttribute('aria-label', staticWallpaper ? 'Resume live wallpaper' : 'Pause live wallpaper');
    control.setAttribute('aria-pressed', String(staticWallpaper));
    control.disabled = motion.matches;
  }
  control.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem('portfolio-wallpaper-paused', String(paused)); } catch {}
    sync();
  });
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', sync);
  sync();
}
