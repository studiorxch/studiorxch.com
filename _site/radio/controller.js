// radio/controller.js
// StudioRich Controller Panel — Safari-Safe Version

import { GlobalStream } from "./global-stream.js";

GlobalStream.onTrackChange = (meta) => {
  if (!meta) return;

  const idxEl = document.getElementById("np-index");
  if (idxEl) idxEl.textContent = meta.index ?? "—";

  const titleEl = document.getElementById("np-title");
  if (titleEl)
    titleEl.textContent = `${meta.index} — ${meta.mood}${
      meta.variant ? " (" + meta.variant + ")" : ""
    }`;

  const capsule = document.getElementById("np-moodCapsule");
  if (capsule) {
    const raw = meta.hex || meta.color || "#555";
    const normalized = "#" + raw.replace(/^#/, "");
    capsule.textContent = meta.mood || "—";
    capsule.style.backgroundColor = normalized;
  }

  const bpmEl = document.getElementById("np-bpm-badge");
  if (bpmEl) bpmEl.textContent = meta.bpm || "—";

  const keyEl = document.getElementById("np-key-badge");
  if (keyEl) keyEl.textContent = meta.key || "—";
};

const $ = (s) => document.querySelector(s);
const log = (m) => {
  const box = $("#log");
  box.innerHTML += m + "<br>";
  box.scrollTop = box.scrollHeight;
};

// UI elements
const elTitle = $("#np-title");
const elMood = $("#np-mood");
const elBpm = $("#np-bpm");
const elKey = $("#np-key");
const elCover = $("#np-cover");

// ---- START ----
$("#btn-start").addEventListener("click", () => {
  log("Starting stream…");

  if (GlobalStream.audio) {
    GlobalStream.audio.play().catch(() => {});
  }

  GlobalStream.playRandom();

  // 🔥 Write metadata for the first track
  GlobalStream.updateNowPlaying();
});

// ---- NEXT ----
$("#btn-next").addEventListener("click", () => {
  log("Next track…");

  if (GlobalStream.audio) {
    GlobalStream.audio.pause();
    GlobalStream.audio.currentTime = 0;
  }

  GlobalStream.playRandom();

  // 🔥 After picking new track, write to Netlify
  GlobalStream.updateNowPlaying();
});

// ---- STOP ----
$("#btn-stop").addEventListener("click", () => {
  log("Stopping playback…");

  if (GlobalStream.audio) {
    GlobalStream.audio.pause();
    GlobalStream.audio.currentTime = 0;
  }

  // Title
  const titleEl = document.getElementById("np-title");
  if (titleEl) titleEl.textContent = "—";

  // Mood Capsule
  const capsule = document.getElementById("np-moodCapsule");
  if (capsule) {
    capsule.textContent = "—";
    capsule.style.backgroundColor = "#555"; // neutral reset
  }

  // BPM Badge
  const bpmEl = document.getElementById("np-bpm-badge");
  if (bpmEl) bpmEl.textContent = "—";

  // Key Badge
  const keyEl = document.getElementById("np-key-badge");
  if (keyEl) keyEl.textContent = "—";

  // Cover reset (optional)
  const coverEl = document.getElementById("np-cover");
  if (coverEl) coverEl.src = "";
});

// -----------------------------
// HELPER
// -----------------------------
function expandTrackPayload(track) {
  const hex = "#" + track.color.replace(/^#/, "");

  const hue = (() => {
    const r = parseInt(hex.substr(1, 2), 16) / 255;
    const g = parseInt(hex.substr(3, 2), 16) / 255;
    const b = parseInt(hex.substr(5, 2), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h;
    if (max === min) h = 0;
    else if (max === r) h = (60 * ((g - b) / (max - min)) + 360) % 360;
    else if (max === g) h = 60 * ((b - r) / (max - min)) + 120;
    else h = 60 * ((r - g) / (max - min)) + 240;

    return Math.round(h);
  })();

  function shiftHue(hex, shift = 40) {
    hex = hex.replace("#", "");
    let r = parseInt(hex.substr(0, 2), 16) / 255;
    let g = parseInt(hex.substr(2, 2), 16) / 255;
    let b = parseInt(hex.substr(4, 2), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h, s, l;
    l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h *= 60;
    }

    h = (h + shift) % 360;

    const c2 = (1 - Math.abs(2 * l - 1)) * s;
    const x = c2 * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c2 / 2;

    let r2, g2, b2;
    if (h < 60) [r2, g2, b2] = [c2, x, 0];
    else if (h < 120) [r2, g2, b2] = [x, c2, 0];
    else if (h < 180) [r2, g2, b2] = [0, c2, x];
    else if (h < 240) [r2, g2, b2] = [0, x, c2];
    else if (h < 300) [r2, g2, b2] = [x, 0, c2];
    else [r2, g2, b2] = [c2, 0, x];

    return (
      "#" +
      [r2, g2, b2]
        .map((v) =>
          Math.round(v + m)
            .toString(16)
            .padStart(2, "0")
        )
        .join("")
    );
  }

  const colorB = shiftHue(hex, 40);

  return {
    ...track,
    hex,
    colorA: hex,
    colorB,
    hue,
    energy: track.energy ?? 0.5,
  };
}
