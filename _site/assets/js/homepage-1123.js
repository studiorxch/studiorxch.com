// assets/js/homepage.js

// ======================================================================
// SAFARI-SAFE PLAY
// ======================================================================
async function safePlay(audio) {
  try {
    await audio.play();
  } catch (err) {
    setTimeout(() => audio.play().catch(() => {}), 100);
  }
}

// ======================================================================
// MOOD PRESETS (temporary; later replaced by catalog)
// ======================================================================
const presetMoods = [
  { mood: "Comforting", hex: "#FFC09F", tracks: ["041.m4a", "042.m4a"] },
  { mood: "Joyful", hex: "#FFEE93", tracks: ["017.m4a", "018.m4a"] },
  { mood: "Hopeful", hex: "#FCF5C7", tracks: ["043.m4a", "044.m4a"] },
  { mood: "Weightless", hex: "#A0CED9", tracks: ["226.m4a", "227.m4a"] },
  { mood: "Calm", hex: "#ADF7B6", tracks: ["085.m4a", "086.m4a"] },
];

let currentAudio = null;
let currentMood = null;
let playing = false;

// ======================================================================
// SIGNATURE FOR track FUNCTION
// ======================================================================
async function signKey(key) {
  const secret = "studiorich-secret";
  const ts = Math.floor(Date.now() / 60000);
  const msg = key + ts;

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const sigBuffer = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    new TextEncoder().encode(msg)
  );

  return Array.from(new Uint8Array(sigBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 10);
}

// ======================================================================
// RENDER MOOD BARS (correct ID: mood-bars)
// ======================================================================
function renderBars(set) {
  const container = document.getElementById("mood-bars");
  container.innerHTML = "";

  set.forEach((item) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.background = item.hex;
    bar.addEventListener("click", () => playMood(item));
    container.appendChild(bar);
  });
}

// ======================================================================
// MAIN PLAYBACK
// ======================================================================
async function playMood(item) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  currentMood = item;

  const filename = item.tracks[Math.floor(Math.random() * item.tracks.length)];
  const sig = await signKey(filename);

  const base =
    location.hostname === "localhost"
      ? "http://localhost:8888/.netlify/functions"
      : "/.netlify/functions";

  const url = `${base}/track?key=${filename}&sig=${sig}`;

  currentAudio = new Audio(url);
  safePlay(currentAudio);
  playing = true;

  updateToggleIcon();
  showToggle(true);

  currentAudio.onended = () => {
    playing = false;
    updateToggleIcon();
  };

  // Sync homepage banner
  document.getElementById("banner-title").textContent = item.mood;
  document.getElementById("banner-mood").textContent = "";
}

// ======================================================================
// PLAY / PAUSE
// ======================================================================
function togglePlayPause() {
  if (!currentAudio) return;

  if (playing) {
    currentAudio.pause();
    playing = false;
  } else {
    safePlay(currentAudio);
    playing = true;
  }

  updateToggleIcon();
}

function updateToggleIcon() {
  const icon = document.getElementById("toggleIcon");
  icon.src = playing ? "/assets/ui/pause.svg" : "/assets/ui/play.svg";
}

function showToggle(show = true) {
  document.getElementById("playPauseBtn").style.display = show
    ? "block"
    : "none";
}

// ======================================================================
// INIT
// ======================================================================
renderBars(presetMoods);
document
  .getElementById("playPauseBtn")
  .addEventListener("click", togglePlayPause);
