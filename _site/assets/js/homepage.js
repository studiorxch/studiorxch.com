// assets/js/homepage.js
import { MotionEngine } from "./studiorich-motion.js";

console.log("homepage.js loaded");

MotionEngine.init();

// rest of your homepage code...

function readNowPlaying() {
  try {
    const raw = localStorage.getItem("SR_NOWPLAYING");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function updateHomepage() {
  const t = readNowPlaying();

  if (!t || !t.title) {
    document.getElementById("track-title").textContent = "—";
    document.getElementById("track-variant").textContent = "";
    MotionEngine.setColors("#444", "#333");
    MotionEngine.applyTrack({
      hue: 0,
      colorA: "#444",
      colorB: "#333",
      amp: 0,
      freq: 0,
      chaos: 0,
      tension: 0,
      speed: 0,
      energy: 0,
    });
    return;
  }

  const parts = t.title.split("(");
  document.getElementById("track-title").textContent =
    parts[0]?.trim() || t.mood || "—";
  document.getElementById("track-variant").textContent =
    parts[1]?.replace(")", "").trim() || "";

  MotionEngine.setColors(t.colorA, t.colorB);
  MotionEngine.applyTrack(t);
}

setInterval(updateHomepage, 300);
updateHomepage();
