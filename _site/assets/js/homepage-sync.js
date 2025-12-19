// /assets/js/homepage-sync.js

async function pull() {
  const url = "/.netlify/functions/get-nowplaying?t=" + Date.now();

  try {
    const r = await fetch(url);
    if (!r.ok) return;

    const meta = await r.json();

    document.getElementById("banner-title").textContent = meta.title || "—";
    document.getElementById("banner-mood").textContent = meta.mood || "—";
  } catch (err) {
    console.warn("homepage sync:", err);
  }
}

setInterval(pull, 1200);
pull();
