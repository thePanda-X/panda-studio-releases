// "Build-up": the floating window stack follows the step you're reading.
// On narrow screens the stack is hidden and each step shows its own window instead (CSS).
import { $$ } from "../lib/dom.js";

export function initWindows() {
  const fwins = $$(".fwin");
  const steps = $$(".wstep");

  // Give each step a copy of its window for the narrow layout. Its image is lazy and
  // hidden on wide screens, so it's only downloaded where it's shown.
  steps.forEach((step) => {
    const src = fwins.find((f) => f.dataset.i === step.dataset.i);
    if (!src) return;
    const copy = src.cloneNode(true);
    copy.className = "wstep-win";
    copy.removeAttribute("data-i");
    copy.setAttribute("aria-hidden", "true");
    step.prepend(copy);
  });

  let current = -1;
  const setWin = (i) => {
    if (i === current) return;
    current = i;
    fwins.forEach((f) => {
      const j = +f.dataset.i;
      f.classList.toggle("active", j === i);
      f.classList.toggle("seen", j < i);
      f.style.setProperty("--o", i - j);
      f.style.zIndex = j <= i ? 1 + j : 0;
    });
    steps.forEach((s) => s.classList.toggle("active", +s.dataset.i === i));
  };

  // The active step is the one whose middle is closest to the middle of the screen. Worked
  // out from the scroll position, so it's right however you got there (jump links, scrolling
  // back up...), and the first and last steps hold above and below the section.
  const update = () => {
    const mid = innerHeight / 2;
    let best = 0, bestDist = Infinity;
    steps.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - mid);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    setWin(+steps[best].dataset.i);
  };
  let queued = false;
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; update(); });
  };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  update();
}
