// Matrix rain exists only inside the opening screen and is stopped on reveal.
export function startMatrixRain(canvas) {
  const ctx = canvas?.getContext('2d');
  if (!ctx) return () => {};
  const symbols = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ012345789ABCDEF<>/{}';
  const glyph = () => symbols[Math.floor(Math.random() * symbols.length)];
  let width, height, streams = [], frame, lastFrame = 0, stopped = false;

  function draw(delta) {
    ctx.clearRect(0, 0, width, height);
    for (const stream of streams) {
      stream.y += delta * stream.speed;
      if (stream.y - stream.length * stream.size > height) {
        stream.y = -stream.size;
        stream.speed = 75 + Math.random() * 120;
      }
      stream.change += delta;
      if (stream.change > .12) {
        stream.glyphs[Math.floor(Math.random() * stream.length)] = glyph();
        stream.change = 0;
      }
      ctx.font = `${stream.size}px monospace`;
      for (let index = stream.length - 1; index >= 0; index--) {
        const y = stream.y - index * stream.size;
        if (y < -stream.size || y > height + stream.size) continue;
        ctx.globalAlpha = (1 - index / stream.length) * stream.opacity;
        ctx.fillStyle = index === 0 ? '#d0ffdb' : '#39ed75';
        ctx.shadowColor = '#4bff8b';
        ctx.shadowBlur = index === 0 ? 8 : 0;
        ctx.fillText(stream.glyphs[index], stream.x, y);
      }
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }
  function resize() {
    width = canvas.clientWidth; height = canvas.clientHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    streams = Array.from({ length: Math.ceil(width / 23) }, (_, index) => {
      const length = 12 + Math.floor(Math.random() * 16);
      return { x: index * 23, y: Math.random() * (height + 350), size: 13 + Math.floor(Math.random() * 4),
        length, speed: 75 + Math.random() * 120, opacity: .3 + Math.random() * .5,
        change: 0, glyphs: Array.from({ length }, glyph) };
    });
    draw(0);
  }
  function stop() {
    if (stopped) return;
    stopped = true;
    window.cancelAnimationFrame(frame);
    window.removeEventListener('resize', resize);
    document.removeEventListener('visibilitychange', syncVisibility);
  }
  function tick(now) {
    if (stopped) return;
    if (!canvas.isConnected || !document.documentElement.classList.contains('booting')) { stop(); return; }
    if (document.hidden) { frame = null; return; }
    if (!lastFrame) lastFrame = now;
    if (now - lastFrame >= 32) {
      draw(Math.min((now - lastFrame) / 1000, .1));
      lastFrame = now;
    }
    frame = window.requestAnimationFrame(tick);
  }
  function syncVisibility() {
    window.cancelAnimationFrame(frame); frame = null; lastFrame = 0;
    if (!stopped && !document.hidden) frame = window.requestAnimationFrame(tick);
  }
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', syncVisibility);
  resize(); syncVisibility();
  return stop;
}
