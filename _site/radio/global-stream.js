// radio/global-stream.js
// StudioRich — Final Cross-Browser Stream Engine

import { checkTwitchLive } from "./modules/check-live-twitch.js";

async function pollTwitch() {
  const status = await checkTwitchLive();
  const el = document.getElementById("twitch-status");

  el.textContent = status.live ? "🟢 LIVE" : "🔴 Offline";

  setTimeout(pollTwitch, 5000);
}

export const BLACKLIST = [
  "337",
  "338",
  "343",
  "344",
  "345",
  "346",
  "347",
  "351",
  "352",
  "355",
  "356",
  "357",
  "358",
  "365",
  "366",
  "370",
  "375",
  "376",
];

// --------------------------------------------------
// TRACK → HOMEPAGE PAYLOAD EXPANDER (shared logic)
// --------------------------------------------------
function expandTrackPayload(track) {
  // Always force a single # — moods.yml now contains raw hex only.
  const hex = "#" + track.color.replace(/^#/, "");

  // Convert hex → hue
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

  h = Math.round(h);

  // shiftHue (unchanged except input normalized)
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
      Math.round((r2 + m) * 255)
        .toString(16)
        .padStart(2, "0") +
      Math.round((g2 + m) * 255)
        .toString(16)
        .padStart(2, "0") +
      Math.round((b2 + m) * 255)
        .toString(16)
        .padStart(2, "0")
    );
  }

  return {
    ...track,
    hex,
    colorA: hex,
    colorB: shiftHue(hex, 40),
    hue: h,
    energy: track.energy ?? 0.5,
  };
}

// --- Helpers ---
function isBlacklisted(file) {
  return BLACKLIST.includes(file.split(".")[0]);
}

function pickSafeTrack(list) {
  for (let i = 0; i < 50; i++) {
    const t = list[Math.floor(Math.random() * list.length)];
    const file = String(t.index).padStart(3, "0") + ".m4a";
    if (!isBlacklisted(file)) return t;
  }
  return list[0];
}

// === UNIVERSAL NETLIFY FUNCTION BASE ===
const FN_BASE = "/.netlify/functions";

// --- Engine ---
export const GlobalStream = {
  tracks: [],
  audio: null,
  current: null,
  onTrackChange: null,

  async loadLibrary() {
    if (this.tracks.length) return;
    const res = await fetch("/assets/data/moods.yml");
    this.tracks = jsyaml.load(await res.text());
  },

  async generateSignature(filename) {
    const SECRET = "studiorich-secret";
    const msg = filename + Math.floor(Date.now() / 60000);

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const buf = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(msg)
    );

    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .slice(0, 10);
  },

  // --- MAIN PLAY LOOP ---
  async playRandom() {
    await this.loadLibrary();

    this.current = pickSafeTrack(this.tracks);
    const filename = `${String(this.current.index).padStart(3, "0")}.m4a`;
    const sig = await this.generateSignature(filename);

    const base = FN_BASE;
    const src = `${base}/track?file=${filename}&sig=${sig}`;

    if (!this.audio) {
      this.audio = new Audio();
      this.audio.playsInline = true;
      this.audio.autoplay = false;
      this.audio.preload = "auto";
    }

    this.audio.onended = () => {
      this.audio.currentTime = 0;
      this.playRandom();
    };

    this.audio.pause();
    this.audio.currentTime = 0;

    this.audio.src = src;

    try {
      await this.audio.play();
    } catch (err) {
      console.warn("Safari blocked autoplay; waiting for gesture.");
    }

    this.updateNowPlaying();
    if (this.onTrackChange) this.onTrackChange(this.current);
  },

  async updateNowPlaying() {
    if (!this.current) return;

    const baseColor = this.current.color
      ? this.current.color.replace(/^#/, "")
      : "999999";

    const rawTrack = {
      title: `${this.current.mood}${
        this.current.variant ? " (" + this.current.variant + ")" : ""
      }`,
      mood: this.current.mood,
      bpm: this.current.bpm,
      key: this.current.key,
      color: baseColor,
      cover: null,
      energy: this.current.energy ?? 0.5,
    };

    const expanded = expandTrackPayload(rawTrack);

    // Server attempt (non-critical)
    fetch(`${FN_BASE}/write-nowplaying`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expanded),
    }).catch(() => {});

    // 🔥 Authoritative synced state (overlays + homepage)
    try {
      localStorage.setItem("SR_NOWPLAYING", JSON.stringify(expanded));
    } catch (err) {
      console.warn("localStorage set failed:", err);
    }

    if (this.onTrackChange) this.onTrackChange(this.current);
  },
};

window.GlobalStream = GlobalStream;
pollTwitch();
