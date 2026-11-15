// The studio's eight themes. Picking one recolours the page (CSS variables in styles.css)
// and swaps the screenshot; the canvases read the new colours from CSS.
import { $, $$, reduceMotion } from "./lib/dom.js";

const shots = import.meta.glob("./assets/themes/*.webp", { eager: true, query: "?url", import: "default" });
const shotFor = (id) => shots[`./assets/themes/${id}.webp`];

export const THEMES = [
  { id: "pink", name: "Panda Pink", bg: "#121215", ac: "#f6b3cb" },
  { id: "midnight", name: "Midnight", bg: "#0e1118", ac: "#8cc4ff" },
  { id: "ember", name: "Ember", bg: "#141110", ac: "#ffb36b" },
  { id: "lagoon", name: "Lagoon", bg: "#0f1414", ac: "#6fd6c8" },
  { id: "blossom", name: "Blossom", bg: "#e9e6ea", ac: "#d9467e" },
  { id: "paper", name: "Paper", bg: "#e6e8ec", ac: "#2f6fd6" },
  { id: "sage", name: "Sage", bg: "#e5e9e5", ac: "#2e8b6f" },
  { id: "sand", name: "Sand", bg: "#ebe5dd", ac: "#c8641e" },
];

const STORAGE_KEY = "panda-theme";

/** The current theme's colours, for the canvases. */
export const colors = { accent: [246, 179, 203], accent2: [196, 168, 244], bg: "#121215", dark: true };

function readColors() {
  const cs = getComputedStyle(document.documentElement);
  const rgb = (n) => cs.getPropertyValue(n).split(",").map((x) => parseFloat(x));
  colors.accent = rgb("--accent-rgb");
  colors.accent2 = rgb("--accent-2-rgb");
  colors.bg = cs.getPropertyValue("--bg").trim();
  colors.dark = cs.getPropertyValue("color-scheme").trim() !== "light";
}

let themeImgs;

export function applyTheme(id, ev) {
  const t = THEMES.find((x) => x.id === id) || THEMES[0];
  const swap = () => {
    document.documentElement.dataset.theme = t.id;
    $$(".swatch").forEach((s) => s.setAttribute("aria-checked", String(s.dataset.id === t.id)));
    $$("img", themeImgs).forEach((im) => im.classList.toggle("on", im.dataset.id === t.id));
    $("#themeName").textContent = `Panda Studio — ${t.name} theme`;
    $('meta[name="theme-color"]').setAttribute("content", t.bg);
    readColors();
  };
  try { localStorage.setItem(STORAGE_KEY, t.id); } catch (_) { /* private mode */ }

  // A circular wipe from the click, where the browser supports view transitions.
  if (ev && document.startViewTransition && !reduceMotion) {
    const x = ev.clientX, y = ev.clientY;
    const rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(swap).ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${rad}px at ${x}px ${y}px)`] },
        { duration: 750, easing: "cubic-bezier(.2,.8,.2,1)", pseudoElement: "::view-transition-new(root)" }
      );
    });
  } else swap();
}

export function initThemes() {
  const swatchBox = $("#swatches");
  themeImgs = $("#themeImgs");
  for (const t of THEMES) {
    const b = document.createElement("button");
    b.className = "swatch";
    b.type = "button";
    b.dataset.id = t.id;
    b.setAttribute("role", "radio");
    b.setAttribute("aria-label", t.name);
    b.style.setProperty("--s-bg", t.bg);
    b.style.setProperty("--s-ac", t.ac);
    b.innerHTML = `<span>${t.name}</span>`;
    b.addEventListener("click", (e) => applyTheme(t.id, e));
    swatchBox.appendChild(b);

    const img = new Image(1600, 940);
    img.src = shotFor(t.id);
    img.alt = `Panda Studio in the ${t.name} theme`;
    img.loading = "lazy";
    img.decoding = "async";
    img.dataset.id = t.id;
    themeImgs.appendChild(img);
  }
  let saved = "pink";
  try { saved = localStorage.getItem(STORAGE_KEY) || "pink"; } catch (_) { /* private mode */ }
  applyTheme(saved);
}
