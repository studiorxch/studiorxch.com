// radio/modules/obs-preview.js

export function connectPreview(videoEl, log) {
  try {
    const src = "/radio/overlay/nowplaying.html";
    videoEl.src = src;
    log("OBS preview loaded");
  } catch (err) {
    log("OBS Preview error: " + err);
  }
}
