// -------------------------------------------------------------
// StudioRich — Live Status Badges (Twitch + YouTube)
// -------------------------------------------------------------
// This script:
// • Keeps icons at 10% opacity
// • Lights them up when live
// • Keeps them clickable
// • Works with zero backend, no API keys
// -------------------------------------------------------------

(async function () {
  // -----------------------------------------------------------
  // CONFIG — update these two values only
  // -----------------------------------------------------------
  const TWITCH_CHANNEL = "YOUR_CHANNEL"; // e.g., studiorxch
  const YT_CHANNEL_URL = "https://www.youtube.com/@YOURID/live";
  // -----------------------------------------------------------

  // DOM elements
  const twitchEl = document.getElementById("twitch-icon");
  const youtubeEl = document.getElementById("youtube-icon");

  if (!twitchEl || !youtubeEl) {
    console.warn("Live icons not found on page.");
    return;
  }

  // -----------------------------------------------------------
  // YOUTUBE LIVE CHECK
  // Detects redirect → watch?v=xxxx means live now.
  // -----------------------------------------------------------
  async function checkYouTubeLive() {
    try {
      const res = await fetch(YT_CHANNEL_URL, {
        method: "GET",
        redirect: "follow",
      });
      return res.url.includes("watch");
    } catch (err) {
      console.warn("YT live check failed:", err);
      return false;
    }
  }

  // -----------------------------------------------------------
  // TWITCH LIVE CHECK
  // Uses public HTML response — no OAuth keys required.
  // -----------------------------------------------------------
  async function checkTwitchLive() {
    try {
      const res = await fetch(`https://twitch.tv/${TWITCH_CHANNEL}`);
      const text = await res.text();
      return text.includes('"isLiveBroadcast":true');
    } catch (err) {
      console.warn("Twitch live check failed:", err);
      return false;
    }
  }

  // -----------------------------------------------------------
  // Apply status to icons
  // -----------------------------------------------------------
  async function updateIcons() {
    const [ytLive, twitchLive] = await Promise.all([
      checkYouTubeLive(),
      checkTwitchLive(),
    ]);

    youtubeEl.classList.toggle("live", ytLive);
    twitchEl.classList.toggle("live", twitchLive);
  }

  // Initial run
  updateIcons();

  // Optional: re-check every 60s
  setInterval(updateIcons, 60000);
})();
