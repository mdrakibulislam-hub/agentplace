/** Bind one mounted decorative wash; call destroy() before removing it. */
export function bindAmbientMotion(element, { motionEnabled = true } = {}) {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let enabled = Boolean(motionEnabled);
  let inView = true;
  let destroyed = false;
  const update = () => {
    if (destroyed) return;
    element.dataset.motion = !enabled || preference.matches ? 'still' : 'flow';
    element.classList.toggle('is-paused', document.hidden || !inView);
  };
  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
        inView = entries.some(entry => entry.isIntersecting);
        update();
      })
    : null;
  observer?.observe(element);
  preference.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  update();
  return {
    setMotionEnabled(value) { enabled = Boolean(value); update(); },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      preference.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', update);
      observer?.disconnect();
      element.dataset.motion = 'still';
      element.classList.remove('is-paused');
    },
  };
}
