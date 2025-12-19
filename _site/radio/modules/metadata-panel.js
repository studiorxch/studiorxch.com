// radio/modules/metadata-panel.js

export function updateMetadata(meta) {
  document.getElementById("np-title").textContent = meta.title || "—";
  document.getElementById("np-mood").textContent = meta.mood || "—";
  document.getElementById("np-bpm").textContent = meta.bpm || "—";
  document.getElementById("np-key").textContent = meta.key || "—";

  const cover = document.getElementById("np-cover");
  cover.src = `/assets/img/swatches/${meta.hex}.svg?t=${Date.now()}`;
}
