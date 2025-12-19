// radio/modules/nowplaying.js

export async function loadNowPlaying() {
  try {
    const t = Date.now();
    const resp = await fetch(`/.netlify/functions/get-nowplaying?t=${t}`, {
      cache: "no-store",
    });
    if (!resp.ok) return {};
    return await resp.json();
  } catch (err) {
    console.warn("loadNowPlaying error:", err);
    return {};
  }
}
