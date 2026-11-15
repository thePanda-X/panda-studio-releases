// Panda Studio landing page.
// Canvas 2D for the visuals, no sound. No runtime dependencies.
import "./styles.css";
import { $, $$, reduceMotion } from "./lib/dom.js";
import { RELEASE } from "./config.js";
import { initTransport } from "./transport.js";
import { initThemes } from "./theme.js";
import { initSilk, drawSilk } from "./visuals/silk.js";
import { initScope, drawScope } from "./visuals/scope.js";
import { initWindows } from "./sections/windows.js";
import { initMarquee } from "./sections/marquee.js";
import { initReveal } from "./sections/reveal.js";

function initDownloads() {
  $$("[data-download]").forEach((a) => {
    a.href = RELEASE.url;
    a.setAttribute("download", "");
  });
  $$("[data-version]").forEach((el) => (el.textContent = `Version ${RELEASE.version}`));
  $$("[data-size]").forEach((el) => (el.textContent = `${(RELEASE.sizeBytes / 1048576).toFixed(1)} MB`));
  $("#dlAll").href = RELEASE.releasesPage;
  $("#year").textContent = new Date().getFullYear();
}

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
