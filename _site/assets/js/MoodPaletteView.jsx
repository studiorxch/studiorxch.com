// MoodPaletteView.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import chroma from "chroma-js";

export default function MoodPaletteView() {
  const [palette, setPalette] = useState(generatePalette());
  const [locked, setLocked] = useState(Array(5).fill(false));
  const [showHex, setShowHex] = useState(true);

  // Generate 5 random pastel colors using chroma.js
  function generatePalette() {
    return Array.from({ length: 5 }, () =>
      chroma.random().set("hsl.s", 0.5).set("hsl.l", 0.65).hex()
    );
  }

  // Spacebar randomizes unlocked colors
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

  // Lock/unlock a color by clicking it
  const toggleLock = (index) => {
    setLocked((prev) =>
      prev.map((val, i) => (i === index ? !val : val))
    );
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
            onClick={() => toggleLock(i)}
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
