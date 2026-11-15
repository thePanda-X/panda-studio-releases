// Panda Studio landing page.
// Canvas 2D for the visuals, no sound. No runtime dependencies.
import "./styles.css";
import { reduceMotion } from "./lib/dom.js";
import { initDownloads } from "./downloads.js";
import { initTransport } from "./transport.js";
import { initThemes } from "./theme.js";
import { initSilk, drawSilk } from "./visuals/silk.js";
import { initScope, drawScope } from "./visuals/scope.js";
import { initWindows } from "./sections/windows.js";
import { initMarquee } from "./sections/marquee.js";
import { initReveal } from "./sections/reveal.js";

initDownloads();
initThemes(); // first, so the canvases start with the saved theme's colours
initTransport();
initSilk();
initScope();
initWindows();
initMarquee();
initReveal();

function frame(time) {
  const t = reduceMotion ? 0 : time;
  drawSilk(t);
  drawScope(t);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
