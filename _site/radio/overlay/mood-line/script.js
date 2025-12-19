// radio/overlay/mood-line/script.js

import { getNowPlaying, onNowPlayingChange } from "./nowplaying-bridge.js";

function updateMoodLine(track) {
  const el = document.getElementById("mood-line");

  if (!track) {
    el.style.background = "linear-gradient(90deg,#444,#222)";
    return;
  }

  el.style.background = `linear-gradient(90deg, ${track.colorA}, ${track.colorB})`;
}

onNowPlayingChange(updateMoodLine);
