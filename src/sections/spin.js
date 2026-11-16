// The logo behind "Your turn" drops in from above as the outro scrolls up: it starts high,
// tipped back and faint, then slides down and swings round to face you, landing as the
// headline reaches the middle of the screen. Eased and smoothed so it moves like a camera shot.
import { $, clamp, reduceMotion } from "../lib/dom.js";

const START_Y = -45;   // vh above its resting place
const START_TILT = 75; // degrees, top edge tipped away from you
const OPACITY = 0.22;  // resting opacity

export function initSpin() {
  const logo = $(".outro-logo");
  if (!logo || reduceMotion) return;
  const box = logo.parentElement;
  let visible = false, running = false, cur = 0;

  const target = () => {
    const r = box.getBoundingClientRect();
    // 0 when the headline enters at the bottom, 1 when its middle reaches the screen's middle.
    return clamp((innerHeight - r.top) / ((innerHeight + r.height) / 2), 0, 1);
  };
  const apply = (p) => {
    const e = 1 - (1 - p) ** 3; // ease-out: fast at first, settles gently
    logo.style.setProperty("--y", `${(START_Y * (1 - e)).toFixed(2)}vh`);
    logo.style.setProperty("--tilt", `${(START_TILT * (1 - e)).toFixed(2)}deg`);
    logo.style.setProperty("--o", (OPACITY * clamp(p * 3, 0, 1)).toFixed(3));
  };
  const tick = () => {
    const t = target();
    cur += (t - cur) * 0.12; // follow the scroll with a little lag
    if (Math.abs(t - cur) < 0.0005) cur = t;
    apply(cur);
    running = visible && cur !== t;
    if (running) requestAnimationFrame(tick);
  };
  const wake = () => {
    if (visible && !running) { running = true; requestAnimationFrame(tick); }
  };

  cur = target();
  apply(cur);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; wake(); }, { rootMargin: "50% 0px" }).observe(box);
  addEventListener("scroll", wake, { passive: true });
  addEventListener("resize", wake);
}
