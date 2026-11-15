// "Drop": two rows of effect names scrolling in opposite directions.
import { $ } from "../lib/dom.js";

// Every built-in effect (FxKind::name in the studio's src/dsp/fx.rs).
export const EFFECTS = [
  "Room Reverb", "Echo Delay", "Filter", "3-Band EQ", "Compressor", "Limiter", "Drive", "Chorus", "Phaser",
  "Bitcrusher", "Stereo Tool", "Flanger", "Auto Pan", "Noise Gate", "Pump", "Soft Clipper", "Parametric EQ",
  "Transient Processor", "Multiband Maximizer", "De-esser", "Vocal Compressor", "Pitch Tune", "Doubler", "Exciter",
  "Plate Reverb", "Tape Echo", "Saturator", "Glue Compressor", "Hall Reverb", "Frequency Shifter", "Ring Mod",
  "Resonator", "Trance Gate", "Tape Stop", "Grain Cloud", "Half Time", "Recorder",
];

export function initMarquee() {
  const half = Math.ceil(EFFECTS.length / 2);
  [[$("#mq1"), EFFECTS.slice(0, half)], [$("#mq2"), EFFECTS.slice(half)]].forEach(([el, list]) => {
    const html = list.map((n) => `<span>${n}</span>`).join("");
    el.innerHTML = html + html; // doubled for a seamless loop
  });
}
