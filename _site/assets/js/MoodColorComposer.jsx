// MoodColorComposer.jsx
import React, { useState } from "react";
import chroma from "chroma-js";
import { motion } from "framer-motion";

export default function MoodColorComposer() {
  const [moods, setMoods] = useState([
    { name: "Calm", hex: "#88C9BF" },
    { name: "Dreamy", hex: "#B89BE2" },
    { name: "Tense", hex: "#E85D3F" },
  ]);

  const addMood = () => setMoods([...moods, { name: "New Mood", hex: chroma.random().hex() }]);
  const updateMood = (i, field, val) =>
    setMoods(moods.map((m, idx) => (idx === i ? { ...m, [field]: val } : m)));
  const deleteMood = (i) => setMoods(moods.filter((_, idx) => idx !== i));

  const exportCSV = () => {
    const csv = "mood,hex\n" + moods.map((m) => `${m.name},${m.hex}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "mood_colors_custom.csv";
    a.click();
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-10 gap-6">
      <h1 className="text-3xl font-bold mb-4">🎨 Mood Color Composer</h1>

      <div className="flex flex-wrap justify-center gap-4 w-full max-w-5xl">
        {moods.map((m, i) => (
          <motion.div
            key={i}
            className="relative p-4 rounded-xl w-48 flex flex-col items-center gap-2"
            style={{ backgroundColor: m.hex }}
            whileHover={{ scale: 1.05 }}
          >
            <input
              className="text-black text-center font-semibold w-full rounded bg-white/70"
              value={m.name}
              onChange={(e) => updateMood(i, "name", e.target.value)}
            />
            <input
              type="color"
              value={m.hex}
              onChange={(e) => updateMood(i, "hex", e.target.value)}
              className="cursor-pointer w-12 h-12 rounded-full border-none"
            />
            <div className="text-xs font-mono bg-black/40 px-2 py-1 rounded">{m.hex}</div>
            <button
              className="absolute top-1 right-2 bg-black/40 hover:bg-black/70 text-xs px-2 py-1 rounded"
              onClick={() => deleteMood(i)}
            >
              ✕
            </button>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg"
          onClick={addMood}
        >
          ➕ Add Mood
        </button>
        <button
          className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg"
          onClick={exportCSV}
        >
          💾 Export CSV
        </button>
      </div>
    </div>
  );
}
