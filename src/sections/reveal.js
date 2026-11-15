// Elements with .reveal fade up as they enter the screen; [data-count] numbers count up.
import { $$, clamp, reduceMotion } from "../lib/dom.js";

function countUp(el) {
  const to = +el.dataset.count, t0 = performance.now(), dur = 1400;
  const tick = (now) => {
    const k = clamp((now - t0) / dur, 0, 1);
    el.textContent = Math.round(to * (1 - (1 - k) ** 3));
    if (k < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export function initReveal() {
  const io = new IntersectionObserver(
    (es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      io.unobserve(e.target);
      const n = e.target.querySelector("[data-count]");
      if (n && !reduceMotion) countUp(n);
    }),
    { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
  );
  $$(".reveal").forEach((el) => {
    // Stagger siblings
    const sibs = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
    el.style.setProperty("--d", `${Math.min(sibs.indexOf(el), 6) * 0.08}s`);
    io.observe(el);
  });
}
