// Outro background: the studio's master oscilloscope, big, drawing a slow idle wave.
// It runs behind the "Your turn" headline, whatever else the section holds.
import { $, clamp } from "../lib/dom.js";
import { colors } from "../theme.js";
import { makeCanvas } from "./canvas.js";

let scope;
// The headline's vertical middle and height on the canvas, in pixels (measured on resize).
const line = { y: 300, size: 200 };

function measure() {
  const c = scope.el.getBoundingClientRect();
  const r = $(".outro .display").getBoundingClientRect();
  if (!c.height || !r.height) return;
  line.y = r.top - c.top + r.height * 0.62; // just under the middle, through the letters' lower half
  line.size = r.height;
}

export function initScope() {
  scope = makeCanvas($("#outroWave"));
  measure();
  addEventListener("resize", measure);
  addEventListener("load", measure);
  document.fonts?.ready.then(measure);
  // The cards above it can change height (fonts, images, theme), moving the headline.
  new ResizeObserver(measure).observe($(".outro-inner"));
}

export function drawScope(time) {
  if (!scope.visible) return;
  const { c, w } = scope;
  c.clearRect(0, 0, w, scope.h);
  const [r, g, b] = colors.accent;
  const amp = clamp(line.size * 1.6, 120, 320);
  const N = 220;
  for (let layer = 0; layer < 3; layer++) {
    c.beginPath();
    c.lineWidth = layer === 0 ? 2 : 1;
    c.strokeStyle = `rgba(${r},${g},${b},${layer === 0 ? 0.65 : 0.18})`;
    for (let i = 0; i <= N; i++) {
      const u = i / N;
      const v = Math.sin(u * 18 + time * 0.0015) * 0.12 * Math.sin(u * Math.PI) + Math.sin(u * 47 - time * 0.003) * 0.03;
      const y = line.y + v * amp * (1 - layer * 0.25) + layer * 10 * Math.sin(time * 0.001 + layer);
      i ? c.lineTo(u * w, y) : c.moveTo(u * w, y);
    }
    c.stroke();
  }
}
