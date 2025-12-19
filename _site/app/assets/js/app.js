// ------------------------------------------------------
// StudioRich App — Single File Build (v1.0 stable)
// - Soft Revival palette
// - FadeMix engine
// - Tap to play / pause / toggle UI
// - Mood bar highlight
// - Audio unlock for iOS
// ------------------------------------------------------


// ---------- PALETTE CONFIG ----------
const SoftRevival = {
  title: "Soft Revival",
  image: "/assets/img/playground/001.webp",
  moods: [
    {
      name: "Comforting",
      color: "#FFC09F",
      audio: "/assets/media/audio/041_Comforting.m4a",
    },
    {
      name: "Joyful",
      color: "#FFEE93",
      audio: "/assets/media/audio/018_Joyful.m4a",
    },
    {
      name: "Hopeful",
      color: "#FCF5C7",
      audio: "/assets/media/audio/043_Hopeful.m4a",
    },
    {
      name: "Weightless",
      color: "#A0CED9",
      audio: "/assets/media/audio/226_Weightless.m4a",
    },
    {
      name: "Calm",
      color: "#ADF7B6",
      audio: "/assets/media/audio/085_Calm.m4a",
    },
  ],
};


// ---------- FADEMIX ENGINE ----------
class FadeMixPlayer {
  constructor(palette, options = {}) {
    this.palette = palette;
    this.current = 0;
    this.loop = options.loop ?? false;
    this.fadeTime = options.fadeTime ?? 3;
    this.onMoodChange = options.onMoodChange || null;

    this.audioA = new Audio();
    this.audioB = new Audio();
    this.active = this.audioA;
    this.next = this.audioB;

    this.isPlaying = false;
    this.crossfadeTimer = null;
    this.boundEnded = this.handleEnded.bind(this);
  }

  setMoodHighlight(index) {
    if (typeof this.onMoodChange === "function") {
      this.onMoodChange(index);
    }
  }

  async safePlay(el) {
    try {
      await el.play();
    } catch (e) {
      console.warn("[StudioRich] play() blocked:", e);
    }
  }

  async play() {
    if (this.isPlaying) return;

    this.isPlaying = true;
    const mood = this.palette.moods[this.current];

    this.setMoodHighlight(this.current);

    this.active.src = mood.audio;
    this.active.volume = 1;
    this.active.removeEventListener("ended", this.boundEnded);
    this.active.addEventListener("ended", this.boundEnded);

    await this.safePlay(this.active);
  }

  pause() {
    this.isPlaying = false;
    this.active.pause();
    this.next.pause();
    clearInterval(this.crossfadeTimer);
  }

  handleEnded() {
    this.crossfadeNext();
  }

  async crossfadeNext() {
    if (!this.isPlaying) return;

    const nextIndex = (this.current + 1) % this.palette.moods.length;
    const nextMood = this.palette.moods[nextIndex];

    this.next.src = nextMood.audio;
    this.next.volume = 0;
    await this.safePlay(this.next);

    const steps = 20;
    const stepTime = (this.fadeTime * 1000) / steps;
    const dv = 1 / steps;

    clearInterval(this.crossfadeTimer);

    this.crossfadeTimer = setInterval(() => {
      this.active.volume = Math.max(0, this.active.volume - dv);
      this.next.volume = Math.min(1, this.next.volume + dv);

      if (this.next.volume >= 1) {
        clearInterval(this.crossfadeTimer);

        this.active.pause();
        this.active.removeEventListener("ended", this.boundEnded);

        // swap
        [this.active, this.next] = [this.next, this.active];
        this.current = nextIndex;

        this.setMoodHighlight(this.current);
        this.active.addEventListener("ended", this.boundEnded);

        if (nextIndex === 0 && !this.loop) {
          this.pause();
        }
      }
    }, stepTime);
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }
}



// ---------- UI WIRING ----------
document.addEventListener("DOMContentLoaded", () => {
  const moodScreen = document.getElementById("moodScreen");
  const img = document.getElementById("displayImage");
  const titleEl = document.getElementById("track-title");
  const seeMoreEl = document.getElementById("see-more");
  const moodBarEl = document.getElementById("moodBar");

  if (!moodScreen || !img || !titleEl || !seeMoreEl || !moodBarEl) {
    console.warn("[StudioRich] Missing elements.");
    return;
  }

  // Load background + labels
  img.src = SoftRevival.image;
  titleEl.textContent = SoftRevival.title;
  seeMoreEl.textContent = "See more";

  // Build mood bar
  const swatches = [];
  SoftRevival.moods.forEach((mood, i) => {
    const sw = document.createElement("div");
    sw.className = "swatch";
    sw.style.background = mood.color;
    sw.dataset.index = i;
    moodBarEl.appendChild(sw);
    swatches.push(sw);
  });

  // Show UI first
  titleEl.classList.add("visible");
  seeMoreEl.classList.add("visible");
  moodBarEl.classList.add("visible");

  setTimeout(() => {
    titleEl.classList.remove("visible");
    seeMoreEl.classList.remove("visible");
    moodBarEl.classList.remove("visible");
  }, 4000);

  // Create Player
  const player = new FadeMixPlayer(SoftRevival, {
    fadeTime: 2,
    loop: false,
    onMoodChange: (idx) => {
      swatches.forEach((sw, i) => {
        if (i === idx) {
          sw.style.outline = "2px solid white";
          sw.style.boxShadow = "0 0 8px rgba(0,0,0,0.8)";
        } else {
          sw.style.outline = "none";
          sw.style.boxShadow = "none";
        }
      });
    },
  });

  let audioUnlocked = false;

  async function unlock() {
    if (audioUnlocked) return;
    audioUnlocked = true;

    // iOS unlock warm-up
    let p = new Audio();
    p.muted = true;

    try {
      await p.play();
    } catch (e) {}
    p.pause();
  }

  // Tap = toggle UI + toggle play/pause
  moodScreen.addEventListener("click", async () => {
    // toggle UI
    const isVisible = moodBarEl.classList.contains("visible");
    if (isVisible) {
      titleEl.classList.remove("visible");
      seeMoreEl.classList.remove("visible");
      moodBarEl.classList.remove("visible");
    } else {
      titleEl.classList.add("visible");
      seeMoreEl.classList.add("visible");
      moodBarEl.classList.add("visible");
    }

    // unlock audio if needed
    await unlock();

    // toggle playback
    player.toggle();
  });
});
