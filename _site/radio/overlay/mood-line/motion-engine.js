//radio/overlay/mood-line/motion-engine.js

import { getNowPlaying, onNowPlayingChange } from "./nowplaying-bridge.js";

let canvas, ctx;
let colorA = "#444";
let colorB = "#222";

export const MotionEngine = {
  init() {
    canvas = document.getElementById("sr-motion");
    ctx = canvas.getContext("2d");
    this.resize();
    window.addEventListener("resize", () => this.resize());
    this.loop();
  },

  resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  },

  setColors(a, b) {
    colorA = a;
    colorB = b;
  },

  loop() {
    requestAnimationFrame(() => this.loop());

    const w = canvas.width;
    const h = canvas.height;

    const grad = ctx.createRadialGradient(
      w / 2,
      h / 2,
      h * 0.1,
      w / 2,
      h / 2,
      h * 0.8
    );

    grad.addColorStop(0, colorA);
    grad.addColorStop(1, colorB);

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  },

  applyTrack(track) {
    this.setColors(track.colorA, track.colorB);
  },
};

// Initialize immediately
MotionEngine.init();

// Sync now-playing
onNowPlayingChange((data) => {
  if (!data) return;
  MotionEngine.applyTrack(data);
});
