// A short visual introduction; no code shown here is executed.
import { startMatrixRain } from './matrix-rain.js';

export function runCodingIntro(profile) {
  const screen = document.getElementById('boot-screen');
  if (!screen) return;
  const root = document.documentElement;
  const skip = document.getElementById('boot-skip');
  const code = document.getElementById('boot-code');
  const status = document.getElementById('boot-status');
  const percent = document.getElementById('boot-percent');
  const progress = document.getElementById('boot-progress-fill');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const workspace = [...document.querySelectorAll('.menubar, #desktop, .taskbar')];
  let frame, revealTimer, removeTimer, finished = false;
  let stopRain = () => {};
  const focusBefore = document.activeElement;

  function reveal(immediate = false) {
    if (finished) return;
    finished = true;
    stopRain();
    window.cancelAnimationFrame(frame);
    window.clearTimeout(revealTimer);
    window.clearTimeout(window.portfolioIntroFallback);
    root.classList.remove('booting');
    root.classList.add('boot-ready');
    workspace.forEach(element => {
      element.inert = false;
      element.removeAttribute('data-intro-inert');
    });
    // Return keyboard focus if the intro's skip button held it.
    if (screen.contains(document.activeElement)) {
      const destination = focusBefore && focusBefore !== document.body ? focusBefore : document.getElementById('welcome-window');
      destination?.focus({ preventScroll: true });
    }
    screen.inert = true;
    screen.setAttribute('aria-hidden', 'true');
    skip.removeEventListener('click', onSkip);
    document.removeEventListener('keydown', onKey);
    motion.removeEventListener('change', onMotion);
    if (immediate) screen.remove();
    else {
      screen.classList.add('boot-leaving');
      removeTimer = window.setTimeout(() => screen.remove(), 700);
    }
  }
  function onSkip() { reveal(motion.matches); }
  function onKey(event) {
    if (event.key === 'Escape') { event.preventDefault(); reveal(motion.matches); }
  }
  function onMotion(event) { if (event.matches) reveal(true); }
  skip.addEventListener('click', onSkip);
  document.addEventListener('keydown', onKey);
  motion.addEventListener('change', onMotion);

  if (motion.matches) { reveal(true); return; }
  workspace.forEach(element => {
    element.inert = true;
    element.setAttribute('data-intro-inert', '');
  });
  document.getElementById('boot-name').textContent = profile.name;
  const source = [
    '// Every good thing starts with an idea.',
    'const developer = {',
    `  name: ${JSON.stringify(profile.name)},`,
    ...(profile.university ? [`  university: ${JSON.stringify(profile.university)},`] : []),
    '  curiosity: Infinity,',
    '};',
    '',
    'await createWorkspace(developer);',
    '// Ready. Make yourself at home.'
  ].join('\n');
  stopRain = startMatrixRain(document.getElementById('matrix-rain'));
  const started = window.performance.now();
  function type(now) {
    if (finished) return;
    const fraction = Math.min(1, Math.max(0, (now - started) / 3600));
    code.textContent = source.slice(0, Math.floor(source.length * fraction));
    progress.style.transform = `scaleX(${fraction})`;
    percent.textContent = `${String(Math.floor(fraction * 100)).padStart(2, '0')}%`;
    const message = fraction < .45 ? 'Writing a little introduction…' : fraction < 1 ? 'Making room for ideas…' : 'Ready. Welcome to my workspace.';
    if (status.textContent !== message) status.textContent = message;
    if (fraction < 1) frame = window.requestAnimationFrame(type);
    else {
      code.classList.add('boot-code-complete');
      revealTimer = window.setTimeout(() => reveal(), 650);
    }
  }
  frame = window.requestAnimationFrame(type);

  return () => {
    reveal(true);
    window.clearTimeout(removeTimer);
    screen.remove();
  };
}
