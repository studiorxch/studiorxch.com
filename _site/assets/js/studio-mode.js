// studio-mode.js
console.log("Studio Mode Activated");

// Background loop
const bgLoop = document.getElementById("bgLoop");
bgLoop.src = "/assets/video/loop.mp4";

// Hook into global-stream.js events
document.addEventListener("srTrackChanged", e => {
  const { title } = e.detail;
  document.getElementById("trackName").textContent = title;
});

// Progress bar update
document.addEventListener("srProgress", e => {
  const pct = e.detail.progressPercent;
  document.getElementById("progressBar").style.width = pct + "%";
});

// Play/pause control
document.getElementById("playPauseBtn").addEventListener("click", () => {
  if (window.srPlayer.isPlaying()) {
    window.srPlayer.pause();
    playPauseBtn.textContent = "▶ Play";
  } else {
    window.srPlayer.play();
    playPauseBtn.textContent = "⏸ Pause";
  }
});
