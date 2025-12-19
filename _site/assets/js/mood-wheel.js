// StudioRich Mood Engine v2.6 — Flat, Retina, Theme Adaptive
async function drawMoodWheel() {
  let data;
  const inline = document.getElementById("moods-json");
  if (inline) {
    data = JSON.parse(inline.textContent);
  } else {
    const res = await fetch("/assets/data/moods.json");
    data = await res.json();
  }


  const res = await fetch("/assets/data/moods.json");

  const canvas = document.getElementById("moodWheel");
  const ctx = canvas.getContext("2d");

  // Retina scaling
  const dpr = window.devicePixelRatio || 1;
  const size = 600;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = size + "px";
  canvas.style.height = size + "px";
  ctx.scale(dpr, dpr);

  const cx = size / 2;
  const cy = size / 2;
  const ringNames = Object.keys(data.rings);
  const ringWidth = 60;
  const baseRadius = 60;

  function render() {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    ctx.clearRect(0, 0, size, size);

    ringNames.forEach((ringName, ringIndex) => {
      const moods = data.rings[ringName];
      const slice = (2 * Math.PI) / moods.length;
      const innerR = baseRadius + ringWidth * ringIndex;
      const outerR = baseRadius + ringWidth * (ringIndex + 1);

      moods.forEach((mood, i) => {
        const start = i * slice - Math.PI / 2;
        const end = start + slice;

        ctx.beginPath();
        ctx.arc(cx, cy, outerR, start, end, false);
        ctx.arc(cx, cy, innerR, end, start, true);
        ctx.closePath();

        // flat fill only — no border
        ctx.fillStyle = mood.color;
        ctx.fill();

        // label
        const mid = start + slice / 2;
        const labelR = innerR + ringWidth / 2;
        const lx = cx + labelR * Math.cos(mid);
        const ly = cy + labelR * Math.sin(mid);
        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(mid);
        ctx.textAlign = "center";
        ctx.fillStyle = isDark ? "#fff" : "#111";
        ctx.font = "11px Inter, sans-serif";
        ctx.fillText(mood.name, 0, 0);
        ctx.restore();
      });
    });

    // titles
    const textColor = isDark ? "#fff" : "#111";
    ctx.font = "bold 18px Inter, sans-serif";
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.fillText(" ", cx, 40);
    ctx.font = "13px Inter, sans-serif";
    ctx.fillText(" ", cx, 60);
  }

  render();
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", render);
}

document.addEventListener("DOMContentLoaded", drawMoodWheel);
