// MoodPaletteAtlas.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import chroma from "chroma-js";
import Papa from "papaparse";

export default function MoodPaletteAtlas() {
  const [moods, setMoods] = useState([]);
  const [palette, setPalette] = useState([]);
  const [locked, setLocked] = useState(Array(5).fill(false));
  const [showHex, setShowHex] = useState(true);
  const audioCtxRef = useRef(null);

  // --- Load CSV once ---
  useEffect(() => {
    fetch("/data/")
      .then((res) => res.text())
      .then((csv) => {
        const parsed = Papa.parse(csv, { header: true }).data;
        const clean = parsed.filter((m) => m.hex && m.mood);
        setMoods(clean);
        setPalette(generatePalette(clean));
      });
  }, []);

  // --- Pick 5 random moods ---
  function generatePalette(data = moods) {
    if (!data.length) return [];
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }

  // --- Play tone (temporary sound mapping) ---
  function playTone(hex) {
    const ctx = (audioCtxRef.current ??= new (window.AudioContext || window.webkitAudioContext)());
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const hue = chroma(hex).get("hsl.h");
    const freq = 150 + (hue / 360) * 1000;
    const waveform = ["sine", "triangle", "sawtooth"][Math.floor((hue / 120) % 3)];

    osc.type = waveform;
    osc.frequency.value = freq;

    gain.gain.value = 0.12;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  }

  // --- Spacebar randomizer ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        setPalette((prev) =>
          prev.map((m, i) => (locked[i] ? m : generatePalette(moods)[i]))
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [locked, moods]);

  const toggleLock = (i) => {
    setLocked((prev) => prev.map((v, j) => (j === i ? !v : v)));
  };

  if (!palette.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Loading Mood Atlas…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white items-center justify-center gap-6 p-6">
      <div className="flex flex-col sm:flex-row gap-2 w-full max-w-5xl">
        {palette.map((m, i) => (
          <motion.div
            key={i}
            className="flex-1 relative cursor-pointer rounded-xl overflow-hidden"
            style={{
              backgroundColor: m.hex,
              height: "300px",
              border: locked[i] ? "3px solid white" : "3px solid transparent",
            }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              playTone(m.hex);
              toggleLock(i);
            }}
          >
            <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-1 bg-black/40 px-3 py-2 rounded text-center">
              <span className="text-sm font-semibold">{m.mood}</span>
              {showHex && <span className="text-xs opacity-80">{m.hex}</span>}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg"
          onClick={() =>
            setPalette((prev) =>
              prev.map((m, i) => (locked[i] ? m : generatePalette(moods)[i]))
            )
          }
        >
          🎨 New Palette
        </button>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showHex}
            onChange={(e) => setShowHex(e.target.checked)}
          />
          <span>Show HEX</span>
        </label>
      </div>
    </div>
  );
}
