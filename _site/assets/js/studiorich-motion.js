// assets/js/studiorich-motion.js
// StudioRich Mood Motion Engine — GSAP-powered SVG emotion system

// -------------------------------------------------------------
// INTERNAL STATE
// -------------------------------------------------------------
const motionState = { t: 0 };
let waveEl = null;
let gradientEl = null;
let logoEl = null;

// Default neutral archetype (prevents null freeze)
let currentArchetype = { amp: 10, freq: 1, chaos: 0.1, tension: 0.5, speed: 1 };

// -------------------------------------------------------------
// EMOTIONAL ARCHETYPES (G01–G08)
// -------------------------------------------------------------
const MotionArchetypes = {
  G01: { amp: 22, freq: 2.2, chaos: 0.45, tension: 0.2, speed: 1.4 }, // Anger / Energy
  G02: { amp: 14, freq: 1.6, chaos: 0.25, tension: 0.4, speed: 1.2 }, // Joy / Optimism
  G03: { amp: 8, freq: 0.9, chaos: 0.05, tension: 0.8, speed: 0.9 }, // Trust / Peace
  G04: { amp: 18, freq: 1.8, chaos: 0.6, tension: 0.1, speed: 1.1 }, // Fear / Mystery
  G05: { amp: 6, freq: 0.7, chaos: 0.02, tension: 0.9, speed: 0.7 }, // Sadness / Calm
  G06: { amp: 20, freq: 2.3, chaos: 0.55, tension: 0.25, speed: 1.3 }, // Surprise / Imagination
  G07: { amp: 12, freq: 1.4, chaos: 0.3, tension: 0.5, speed: 1.1 }, // Anticipation / Dream
  G08: { amp: 10, freq: 1.0, chaos: 0.15, tension: 0.65, speed: 1.0 }, // Neutral / Meta
};

// -------------------------------------------------------------
// COLOR LERP ENGINE
// -------------------------------------------------------------
let targetColorA = "#ff00aa";
let targetColorB = "#5511ff";
let colorA = targetColorA;
let colorB = targetColorB;

console.log("motion.js v5");

function lerpColor(a, b, t) {
  a = a.replace("#", "");
  b = b.replace("#", "");

  const ar = parseInt(a.substring(0, 2), 16);
  const ag = parseInt(a.substring(2, 4), 16);
  const ab = parseInt(a.substring(4, 6), 16);

  const br = parseInt(b.substring(0, 2), 16);
  const bg = parseInt(b.substring(2, 4), 16);
  const bb = parseInt(b.substring(4, 6), 16);

  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const b2 = Math.round(ab + (bb - ab) * t);

  return (
    "#" +
    r.toString(16).padStart(2, "0") +
    g.toString(16).padStart(2, "0") +
    b2.toString(16).padStart(2, "0")
  );
}

// -------------------------------------------------------------
// WAVE GENERATION
// -------------------------------------------------------------
function generateWavePath(A, F, C, T, time) {
  const mid = 90;
  const pts = [];

  // Smooth multi-frequency blend
  for (let x = 0; x <= 1000; x += 40) {
    const slow = Math.sin(time * 0.25 + x * 0.0015) * (A * 0.4);
    const med = Math.sin(time * 0.6 + x * 0.003) * (A * 0.35);
    const fast = Math.sin(time * 1.2 + x * 0.007) * (A * 0.25);
    pts.push({ x, y: mid + slow + med + fast });
  }

  let d = `M 0 ${mid}`;

  // First cubic curve
  const p1 = pts[1];
  const p2 = pts[2];
  const p3 = pts[3];
  d += ` C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`;

  // Continue with S commands
  for (let i = 4; i < pts.length; i++) {
    const p = pts[i];
    d += ` S ${p.x} ${p.y}, ${p.x} ${p.y}`;
  }

  return d;
}

function renderWave() {
  if (!currentArchetype) return;

  const { amp, freq, chaos, tension } = currentArchetype;
  const d = generateWavePath(amp, freq, chaos, tension, motionState.t);

  waveEl.setAttribute("d", d);

  if (gradientEl) {
    colorA = lerpColor(colorA, targetColorA, 0.05);
    colorB = lerpColor(colorB, targetColorB, 0.05);

    gradientEl.children[0].setAttribute("stop-color", colorA);
    gradientEl.children[1].setAttribute("stop-color", colorB);
  }
}

// -------------------------------------------------------------
// PUBLIC: SET COLOR BASED ON TRACK HEX
// -------------------------------------------------------------
export function updateMoodLineColors(hexA, hexB) {
  if (!waveEl) return;

  const solid = "#" + hexA.replace(/^#/, "");
  waveEl.setAttribute("stroke", solid);
}
// -------------------------------------------------------------
// MIXER: CONTINUOUS EMOTIONAL BLENDING
// -------------------------------------------------------------
function getArchetypeBlend(hue) {
  const sectors = [
    { group: "G01", start: 0, end: 40 },
    { group: "G07", start: 40, end: 90 },
    { group: "G02", start: 90, end: 145 },
    { group: "G03", start: 145, end: 200 },
    { group: "G05", start: 200, end: 260 },
    { group: "G04", start: 260, end: 300 },
    { group: "G06", start: 300, end: 330 },
    { group: "G08", start: 330, end: 360 },
  ];

  const h = hue % 360;

  for (let i = 0; i < sectors.length; i++) {
    const A = sectors[i];
    const B = sectors[(i + 1) % sectors.length];

    if (h >= A.start && h < B.start) {
      const t = (h - A.start) / (B.start - A.start);
      return { A: A.group, B: B.group, t };
    }
  }

  return { A: "G08", B: "G08", t: 0 };
}

function blendArchetypes(A, B, t) {
  return {
    amp: A.amp + (B.amp - A.amp) * t,
    freq: A.freq + (B.freq - A.freq) * t,
    chaos: A.chaos + (B.chaos - A.chaos) * t,
    tension: A.tension + (B.tension - A.tension) * t,
    speed: A.speed + (B.speed - A.speed) * t,
  };
}

// -------------------------------------------------------------
// APPLY TRACK → MOTION (MAIN ENTRYPOINT)
// -------------------------------------------------------------
function applyTrackMotion(track) {
  if (!track || typeof track.hue !== "number") return;

  const { A, B, t } = getArchetypeBlend(track.hue);
  const archA = MotionArchetypes[A];
  const archB = MotionArchetypes[B];

  const blended = blendArchetypes(archA, archB, t);

  gsap.to(currentArchetype, {
    amp: blended.amp,
    freq: blended.freq,
    chaos: blended.chaos,
    tension: blended.tension,
    speed: blended.speed,
    duration: 1.0,
    ease: "power2.out",
    onUpdate: renderWave,
  });

  if (logoEl) {
    gsap.fromTo(
      logoEl,
      { scale: 0.96, opacity: 0.8 },
      { scale: 1.0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
  }
}

// -------------------------------------------------------------
// INIT
// -------------------------------------------------------------
export function initMotion() {
  waveEl = document.getElementById("mood-wave");
  gradientEl = document.getElementById("mood-gradient");
  logoEl = document.getElementById("mood-logo");

  if (!waveEl) {
    console.error("MotionEngine: #mood-wave not found.");
    return;
  }

  // NEW — force solid stroke immediately
  waveEl.setAttribute("stroke", colorA);

  gsap.to(motionState, {
    t: "+=10000",
    repeat: -1,
    ease: "none",
    duration: 20,
  });

  gsap.ticker.add(renderWave);
}

// -------------------------------------------------------------
// EXPORTS
// -------------------------------------------------------------
export const MotionEngine = {
  init: initMotion,
  applyTrack: applyTrackMotion,
  setColors: updateMoodLineColors,
};
