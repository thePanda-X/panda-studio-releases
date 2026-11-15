// The top bar as a song transport: scrolling moves the playhead across the section
// markers and the song position.
import { $, $$, clamp, reduceMotion } from "./lib/dom.js";
import { SONG_BARS } from "./config.js";

let sections, rulerLinks, rulerHead, lcdTime, stageFrame, stagePlayhead, drop;
let docMax = 1;

// The playlist in the studio screenshot: bar 1 starts at x=468 of 1600 and bars are ~42.2px wide.
const SHOT_BAR1_X = 468, SHOT_BAR_W = 42.19, SHOT_W = 1600;
let lastActive = "";

/** bars (0-based, fractional) -> "bar:beat:tick", like the studio's song position (96 ticks per beat). */
function fmtPos(bars) {
  const bar = Math.floor(bars);
  const beats = (bars - bar) * 4;
  const beat = Math.floor(beats);
  const tick = Math.floor((beats - beat) * 96);
  return `${bar + 1}:${String(beat + 1).padStart(2, "0")}:${String(tick).padStart(2, "0")}`;
}

/** Place each marker on the ruler where its section is on the page. */
function layoutRuler() {
  docMax = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  rulerLinks.forEach((a) => {
    const sec = document.getElementById(a.dataset.sec);
    if (!sec) return;
    const at = clamp((sec.offsetTop - innerHeight * 0.25) / docMax, 0, 0.94);
    a.style.setProperty("--at", a.dataset.sec === "intro" ? 0 : at);
  });
}

const moveHead = (frac) => {
  rulerHead.style.transform = `translateX(${frac * rulerHead.parentElement.clientWidth}px)`;
};

function onScroll() {
  const p = clamp(scrollY / docMax, 0, 1);
  document.documentElement.classList.toggle("scrolled", scrollY > 40);
  moveHead(p);
  lcdTime.textContent = fmtPos(Math.min(p * SONG_BARS, SONG_BARS - 0.001));
  // Current section
  let cur = sections[0].dataset.sec;
  for (const s of sections) if (s.getBoundingClientRect().top < innerHeight * 0.45) cur = s.dataset.sec;
  if (cur !== lastActive) {
    lastActive = cur;
    rulerLinks.forEach((a) => a.classList.toggle("active", a.dataset.sec === cur));
    if (cur === "drop") drop.classList.add("hit");
  }
  // Tilt the studio screenshot into place, and run its playhead across the song as it scrolls by.
  const r = stageFrame.getBoundingClientRect();
  if (!reduceMotion) {
    const t = clamp(1 - (r.top - innerHeight * 0.12) / (innerHeight * 0.75), 0, 1);
    stageFrame.style.setProperty("--p", t.toFixed(4));
  }
  const pass = clamp((innerHeight * 0.6 - r.top) / r.height, 0, 1);
  stagePlayhead.style.left = `${((SHOT_BAR1_X + pass * SONG_BARS * SHOT_BAR_W) / SHOT_W) * 100}%`;
  stagePlayhead.classList.toggle("on", pass > 0 && pass < 1);
}

export function initTransport() {
  sections = $$("section[data-sec]");
  rulerLinks = $$(".ruler-track a");
  rulerHead = $("#rulerHead");
  lcdTime = $("#lcdTime");
  stageFrame = $("#stageFrame");
  stagePlayhead = $("#stagePlayhead");
  drop = $("#drop");

  const relayout = () => { layoutRuler(); onScroll(); };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", relayout);
  addEventListener("load", relayout);
  // Images and fonts arriving change the page height; keep the markers where their sections are.
  new ResizeObserver(relayout).observe(document.body);
  relayout();

  // The "drop" flash replays each time the section is reached.
  new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting) drop.classList.remove("hit"); })).observe(drop);
}

