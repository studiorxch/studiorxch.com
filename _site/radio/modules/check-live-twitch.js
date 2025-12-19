// radio/modules/check-live-twitch.js
export async function checkTwitchLive() {
  try {
    const res = await fetch("/.netlify/functions/check-live-twitch");
    return await res.json();
  } catch (err) {
    return { live: false, error: String(err) };
  }
}
