// radio/overlay/overlay.js

const DATA = `${location.origin}/.netlify/functions/get-nowplaying`;

const elCapsule = document.getElementById("np-moodCapsule");
const elBPM = document.getElementById("np-bpm-badge");
const elKey = document.getElementById("np-key-badge");

async function refresh() {
  try {
    const r = await fetch(DATA + "?t=" + Date.now());
    if (!r.ok) return;

    const meta = await r.json();

    elCapsule.textContent = meta.mood || "—";
    elCapsule.style.backgroundColor = meta.color
      ? `#${meta.color.replace(/^#/, "")}`
      : "#555";

    elBPM.textContent = meta.bpm ? Math.round(meta.bpm) : "—";
    elKey.textContent = meta.key || "—";
  } catch (e) {
    console.warn("overlay update failed", e);
  }
}

setInterval(refresh, 900);
refresh();
