// Outro background: the studio's master oscilloscope, big, drawing a slow idle wave.
import { $ } from "../lib/dom.js";
import { colors } from "../theme.js";
import { makeCanvas } from "./canvas.js";

let scope;

export function initScope() {
  scope = makeCanvas($("#outroWave"));
}

export function drawScope(time) {
  if (!scope.visible) return;
  const { c, w, h } = scope;
  c.clearRect(0, 0, w, h);
  const [r, g, b] = colors.accent;
  const N = 220;
  for (let layer = 0; layer < 3; layer++) {
    c.beginPath();
    c.lineWidth = layer === 0 ? 2 : 1;
    c.strokeStyle = `rgba(${r},${g},${b},${layer === 0 ? 0.65 : 0.18})`;
    for (let i = 0; i <= N; i++) {
      const u = i / N;
      const v = Math.sin(u * 18 + time * 0.0015) * 0.12 * Math.sin(u * Math.PI) + Math.sin(u * 47 - time * 0.003) * 0.03;
      const y = h / 2 + v * h * 0.32 * (1 - layer * 0.25) + layer * 10 * Math.sin(time * 0.001 + layer);
      i ? c.lineTo(u * w, y) : c.moveTo(u * w, y);
    }
    c.stroke();
  }
}
