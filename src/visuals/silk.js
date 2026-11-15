// Intro background: silk made of waveforms. It breathes on its own and bends toward the pointer.
// It stays out of the hero text: on wide screens it sweeps up to the right and is invisible over
// the text column; where the text fills the width (tablets, phones) it's a band below the text.
import { $, clamp } from "../lib/dom.js";
import { colors } from "../theme.js";
import { makeCanvas } from "./canvas.js";

let silk;
const mouse = { x: 0.6, y: 0.5, tx: 0.6, ty: 0.5 };
// Where the hero copy is, as fractions of the canvas (measured on resize).
const text = { right: 0.5, bottom: 0.75 };
const head = { right: 0.7, bottom: 0.5 };

function measureText() {
  const c = silk.el.getBoundingClientRect();
  if (!c.width || !c.height) return;
  let right = 0, bottom = 0;
  // The paragraph, buttons and version line sit lowest; the headline is above where lines pass.
  for (const el of document.querySelectorAll(".intro .lede, .intro .cta-row, .intro .hero-meta")) {
    const r = el.getBoundingClientRect();
    // Use the text's real width, not its box: the paragraph box is wider than its lines.
    const range = document.createRange();
    range.selectNodeContents(el);
    const tr = range.getBoundingClientRect();
    right = Math.max(right, Math.min(r.right, tr.right));
    bottom = Math.max(bottom, r.bottom);
  }
  text.right = (right - c.left) / c.width;
  text.bottom = (bottom - c.top) / c.height;

  const range = document.createRange();
  range.selectNodeContents(document.querySelector(".intro .display"));
  const hr = range.getBoundingClientRect();
  head.right = (hr.right - c.left) / c.width;
  head.bottom = (hr.bottom - c.top) / c.height;
}

export function initSilk() {
  silk = makeCanvas($("#silk"));
  addEventListener("pointermove", (e) => {
    mouse.tx = e.clientX / innerWidth;
    mouse.ty = e.clientY / innerHeight;
  }, { passive: true });
  measureText();
  addEventListener("resize", measureText);
  document.fonts?.ready.then(measureText); // the web fonts change the text's size
}

export function drawSilk(time) {
  if (!silk.visible) return;
  const { c, w, h } = silk;
  c.clearRect(0, 0, w, h);
  mouse.x += (mouse.tx - mouse.x) * 0.05;
  mouse.y += (mouse.ty - mouse.y) * 0.05;
  const t = time * 0.00022;
  const narrow = w < 700;
  const lines = narrow ? 26 : 44;
  const step = narrow ? 10 : 8;
  const [r, g, b] = colors.accent;
  const [r2, g2, b2] = colors.accent2;
  c.globalCompositeOperation = colors.dark ? "lighter" : "source-over";
  c.lineWidth = 1.1;

  // Layout: a diagonal beside the text, or a band below it.
  const beside = text.right < 0.7;
  let y0, y1, fadeFrom, fadeTo, amp, curve = 1;
  if (beside) {
    // A curve: low under the text, then sweeping up on the right. Its bend is chosen so it
    // passes under the end of the headline with room for the waves.
    y0 = h * 0.95; y1 = h * 0.3;
    const yAtHead = Math.min(head.bottom * h + 120, y0 - 1);
    const hr = clamp(head.right, 0.2, 0.95);
    curve = clamp(Math.log((y0 - yAtHead) / (y0 - y1)) / Math.log(hr), 1, 4);
    fadeFrom = clamp(text.right - 0.06, 0, 1); // invisible over the text...
    fadeTo = clamp(text.right + 0.14, 0, 1); // ...fully drawn just past it
    amp = 1;
  } else {
    const top = Math.min(text.bottom * h + 24, h - 40);
    const mid = (top + h) / 2;
    y0 = mid + (h - top) * 0.15; y1 = mid - (h - top) * 0.15;
    fadeFrom = 0; fadeTo = 0.25;
    amp = clamp((h - top) / 320, 0.25, 1); // a shorter band gets gentler waves
  }

  for (let i = 0; i < lines; i++) {
    const k = i / (lines - 1);
    const cr = (r + (r2 - r) * k) | 0, cg = (g + (g2 - g) * k) | 0, cb = (b + (b2 - b) * k) | 0;
    const a = Math.min(1, (colors.dark ? 0.12 : 0.2) + Math.sin(k * Math.PI) * (colors.dark ? 0.3 : 0.38));
    const grad = c.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, `rgba(${cr},${cg},${cb},0)`);
    grad.addColorStop(fadeFrom, `rgba(${cr},${cg},${cb},0)`);
    grad.addColorStop(Math.max(fadeTo, fadeFrom + 0.01), `rgba(${cr},${cg},${cb},${a})`);
    grad.addColorStop(1, `rgba(${cr},${cg},${cb},${a * 0.8})`);
    c.strokeStyle = grad;
    c.beginPath();
    for (let x = -10; x <= w + 10; x += step) {
      const u = x / w;
      const envl = 0.25 + 0.75 * Math.sin(clamp(u * 0.9 + 0.1, 0, 1) * Math.PI) ** 1.2;
      const md = Math.exp(-((u - mouse.x) ** 2) / 0.02) * (0.5 - mouse.y) * 120;
      const y =
        y0 + (y1 - y0) * clamp(u, 0, 1) ** curve +
        ((k - 0.5) * 70 +
          Math.sin(u * 3.1 + t * 2.0 + k * 2.4) * 60 * envl +
          Math.sin(u * 7.3 - t * 3.1 + k * 5.1) * 18 * envl +
          md * envl * (0.4 + k)) * amp;
      x === -10 ? c.moveTo(x, y) : c.lineTo(x, y);
    }
    c.stroke();
  }
  c.globalCompositeOperation = "source-over";
}
