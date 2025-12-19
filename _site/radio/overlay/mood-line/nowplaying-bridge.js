// radio/overlay/mood-line/nowplaying-bridge.js
export let CURRENT = null;

function poll() {
  try {
    const raw = localStorage.getItem("SR_NOWPLAYING");
    if (raw) {
      CURRENT = JSON.parse(raw);
    }
  } catch (err) {
    console.warn("NP-Bridge error:", err);
  }

  requestAnimationFrame(poll);
}
export function getNowPlaying() {
  try {
    const raw = localStorage.getItem("SR_NOWPLAYING");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn("bridge parse error:", err);
    return null;
  }
}

export function onNowPlayingChange(callback) {
  callback(getNowPlaying()); // initial fire

  window.addEventListener("storage", (e) => {
    if (e.key === "SR_NOWPLAYING") {
      callback(getNowPlaying());
    }
  });

  setInterval(() => callback(getNowPlaying()), 500);
}

poll();
