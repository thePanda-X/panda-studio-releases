// Download buttons. The visitor's system picks the main download (Windows, macOS or Linux);
// phones, tablets and unknown systems are sent to the platform list instead.
import { $, $$ } from "./lib/dom.js";
import { PLATFORMS, downloadUrl, RELEASES_PAGE } from "./config.js";

/** "windows" | "macos" | "linux", or null when Panda Studio can't run here. */
export function detectOS() {
  const ua = navigator.userAgent.toLowerCase();
  const hint = (navigator.userAgentData?.platform || navigator.platform || "").toLowerCase();
  if (navigator.userAgentData?.mobile || /android|iphone|ipad|ipod|mobile/.test(ua)) return null;
  if (hint.includes("win") || ua.includes("windows")) return "windows";
  if (hint.includes("mac") || ua.includes("mac os")) {
    // iPads ask for the desktop site and say they're a Mac; they have a touch screen.
    return navigator.maxTouchPoints > 1 ? null : "macos";
  }
  if (hint.includes("linux") || ua.includes("linux") || ua.includes("x11")) return "linux";
  return null;
}

const mb = (bytes) => `${(bytes / 1048576).toFixed(1)} MB`;

const ICONS = {
  windows: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5.3l7.4-1v7.2H3zm8.3-1.1L21 3v8.4h-9.7zM3 12.4h7.4v7.2L3 18.7zm8.3 0H21V21l-9.7-1.3z"/></svg>`,
  macos: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.9-.9-3.1-.8C6.8 7.4 5.3 8.3 4.5 9.8c-1.7 2.9-.4 7.2 1.2 9.6.8 1.2 1.7 2.4 3 2.4 1.2-.1 1.6-.8 3.1-.8s1.8.8 3.1.8c1.3 0 2.1-1.2 2.9-2.3.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.6-1-2.7-4.2zM14.1 5.6c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.1-.6 2.8-1.4z"/></svg>`,
  // Tux: body in the text colour, belly and eyes cut out in the card colour, beak and feet in the accent.
  linux: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2c-2.5 0-4 2-4 4.7 0 1.4.3 2.3-.5 3.6-1.2 1.8-2.9 4-2.9 6.6 0 2 1.1 3.3 2.6 3.9h9.6c1.5-.6 2.6-1.9 2.6-3.9 0-2.6-1.7-4.8-2.9-6.6-.8-1.3-.5-2.2-.5-3.6 0-2.7-1.5-4.7-4-4.7z"/><ellipse class="cut" cx="12" cy="15.6" rx="3.5" ry="4.4"/><ellipse class="cut" cx="10.6" cy="6.6" rx=".9" ry="1.2"/><ellipse class="cut" cx="13.4" cy="6.6" rx=".9" ry="1.2"/><circle cx="10.8" cy="6.9" r=".45"/><circle cx="13.2" cy="6.9" r=".45"/><path class="acc" d="M10.3 8.7q1.7-.9 3.4 0-1.7 1.6-3.4 0z"/><ellipse class="acc" cx="8.6" cy="20.6" rx="2.4" ry="1.1"/><ellipse class="acc" cx="15.4" cy="20.6" rx="2.4" ry="1.1"/></svg>`,
};

function fillCards() {
  for (const [id, p] of Object.entries(PLATFORMS)) {
    const card = $(`.platform[data-os="${id}"]`);
    if (!card) continue;
    $(".platform-icon", card).innerHTML = ICONS[id];
    $(".platform-meta", card).textContent = [`Version ${p.version}`, p.sizeBytes && mb(p.sizeBytes)].filter(Boolean).join(" · ");
    $(".platform-req", card).textContent = p.requires;
    const a = $(".platform-dl", card);
    a.href = downloadUrl(p);
    a.setAttribute("download", "");
  }
}

export function initDownloads() {
  fillCards();
  $("#dlAll").href = RELEASES_PAGE;
  $("#year").textContent = new Date().getFullYear();

  const os = detectOS();
  const p = os && PLATFORMS[os];
  document.documentElement.dataset.os = os || "other";

  // The main buttons: straight to this system's file, or to the platform list.
  $$("[data-download]").forEach((a) => {
    const label = $("[data-download-label]", a);
    if (p) {
      a.href = downloadUrl(p);
      a.setAttribute("download", "");
      if (label) label.textContent = `Download for ${p.name}`;
    } else {
      a.href = "#download";
      a.removeAttribute("download");
      if (label) label.textContent = label.dataset.downloadLabelDefault || "Download free";
    }
  });

  // The line under the main buttons: what you're getting, or which systems it runs on.
  // Each piece stays on one line; the line breaks between pieces.
  const parts = p
    ? [`Version ${p.version}`, p.sizeBytes && mb(p.sizeBytes), ...p.requires.split(" · "), p.experimental && "Experimental"]
    : ["Windows", "macOS", "Linux"];
  $$("[data-download-meta]").forEach((el) => {
    el.replaceChildren();
    parts.filter(Boolean).forEach((text, i) => {
      if (i) el.append(" · ");
      const span = document.createElement("span");
      span.textContent = text;
      if (text === "Experimental") span.className = "meta-exp";
      el.append(span);
    });
  });

  // Highlight this system's card in the list.
  if (os) $(`.platform[data-os="${os}"]`)?.classList.add("is-yours");
}
