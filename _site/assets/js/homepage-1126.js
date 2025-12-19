// assets/js/homepage.js

// Auto-select correct endpoint based on environment
let ENDPOINT;

if (location.hostname === "localhost") {
  // Netlify Dev: local proxy works fine
  ENDPOINT = "/.netlify/functions/get-nowplaying";
} else {
  // Production: use deployed playground functions
  ENDPOINT =
    "https://playground-studiorich.netlify.app/.netlify/functions/get-nowplaying";
}

console.log("Using endpoint:", ENDPOINT);

const titleEl = document.getElementById("nowplaying-title");
const barEl = document.getElementById("moodbar");

async function refreshNowPlaying() {
  try {
    const res = await fetch(ENDPOINT + "?t=" + Date.now());
    if (!res.ok) return;

    const meta = await res.json();

    // Update title
    titleEl.textContent = meta.title || meta.mood || "—";

    // Update mood bar color
    if (meta.color) {
      const clean = meta.color.replace(/^#/, "");
      barEl.style.setProperty("--mood-color", `#${clean}`);

      barEl.style.background = `#${clean}`; // Safari fallback
    }
  } catch (err) {
    console.warn("homepage update failed", err);
  }
}

setInterval(refreshNowPlaying, 1000);
refreshNowPlaying();
