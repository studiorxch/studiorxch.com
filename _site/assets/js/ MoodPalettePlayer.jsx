// MoodPalettePlayer.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import chroma from "chroma-js";

export default function MoodPalettePlayer() {
  const [palette, setPalette] = useState(generatePalette());
  const [locked, setLocked] = useState(Array(5).fill(false));
  const [showHex, setShowHex] = useState(true);
  const audioCtxRef = useRef(null);

  function generatePalette() {
    return Array.from({ length: 5 }, () =>
      chroma.random().set("hsl.s", 0.5).set("hsl.l", 0.65).hex()
    );
  }

  // --- AUDIO ENGINE ---
  function playTone(hex) {
    const ctx = (audioCtxRef.current ??= new (window.AudioContext || window.webkitAudioContext)());
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const hue = chroma(hex).get("hsl.h");
    const freq = 200 + (hue / 360) * 800; // map hue → 200–1000 Hz
    const waveform = ["sine", "square", "triangle", "sawtooth"][Math.floor((hue / 360) * 4)];

    osc.type = waveform;
    osc.frequency.value = freq;

    gain.gain.value = 0.15;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  }

  // --- KEYBINDINGS ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        setPalette((prev) =>
          prev.map((color, i) => (locked[i] ? color : generatePalette()[i]))
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [locked]);

  const toggleLock = (index) => {
    setLocked((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white items-center justify-center gap-6 p-6">
      <div className="flex flex-col sm:flex-row gap-2 w-full max-w-5xl">
        {palette.map((color, i) => (
          <motion.div
            key={i}
            className="flex-1 relative cursor-pointer rounded-xl overflow-hidden"
            style={{
              backgroundColor: color,
              height: "300px",
              border: locked[i] ? "3px solid white" : "3px solid transparent",
            }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              playTone(color);
              toggleLock(i);
            }}
          >
            {showHex && (
              <div className="absolute bottom-4 left-4 text-xs font-mono bg-black/40 px-2 py-1 rounded">
                {color}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg"
          onClick={() =>
            setPalette((prev) =>
              prev.map((c, i) => (locked[i] ? c : generatePalette()[i]))
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
