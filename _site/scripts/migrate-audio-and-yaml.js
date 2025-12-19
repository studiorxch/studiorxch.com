// scripts/migrate-audio-and-yaml.js
// ---------------------------------------------------------
// StudioRich — Audio Filename Normalizer + YAML Migrator
// - Renames /assets/media/audio/*.m4a → 001.m4a, 002.m4a...
// - Rewrites moods.yml to use numeric filenames
// - Removes redundant id, filename, audio_path fields
// ---------------------------------------------------------

import fs from "fs";
import path from "path";
import yaml from "js-yaml";

const AUDIO_DIR = "./assets/media/audio";
const MOODS_YAML = "./app/data/moods.yml";
const OUTPUT_YAML = "./app/data/moods_final.yml";

// ---------------------------
// 1. LOAD EXISTING YAML
// ---------------------------
console.log("📘 Loading moods.yml…");

const yamlRaw = fs.readFileSync(MOODS_YAML, "utf8");
const moods = yaml.load(yamlRaw);

// Helper → zero-pad to 3 digits
const pad = (n) => String(n).padStart(3, "0");

// ---------------------------
// 2. RENAME AUDIO FILES
// ---------------------------
console.log("🎧 Normalizing audio filenames…");

const files = fs.readdirSync(AUDIO_DIR).filter(f => f.endsWith(".m4a"));

files.forEach((file) => {
  // Expect formats like:
  //   001_Blissful.m4a
  //   046_Complacent.m4a
  const match = file.match(/^(\d{3})_/);

  if (!match) {
    console.warn("⚠️ Skipping non-matching file:", file);
    return;
  }

  const index = match[1];
  const newName = `${index}.m4a`;

  const oldPath = path.join(AUDIO_DIR, file);
  const newPath = path.join(AUDIO_DIR, newName);

  if (!fs.existsSync(newPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`🔁 ${file} → ${newName}`);
  } else {
    console.log(`✔️ ${newName} already exists`);
  }
});

// ---------------------------
// 3. REWRITE YAML CLEANLY
// ---------------------------
console.log("📝 Rewriting moods YAML…");

const cleaned = moods.map((entry) => {
  const newEntry = {
    index: Number(entry.index),
    mood: entry.mood,
    variant: entry.variant,
    bpm: entry.bpm ? Number(entry.bpm) : null,
    key: entry.key || null,
    energy: entry.energy ? Number(entry.energy) : null,
    duration: entry.duration ? Number(entry.duration) : null,
    rhythm_density: entry.rhythm_density ? Number(entry.rhythm_density) : null,
    peak_db: entry.peak_db ? Number(entry.peak_db) : null,
    color: entry.color || null,
    hue: entry.hue || null,
    lightness: entry.lightness || null,
    saturation: entry.saturation || null,
    rgb: entry.rgb || null,
  };

  return newEntry;
});

// ---------------------------
// 4. WRITE OUTPUT YAML
// ---------------------------
const yamlOut = yaml.dump(cleaned, { lineWidth: -1 });
fs.writeFileSync(OUTPUT_YAML, yamlOut, "utf8");

console.log("✅ Migration complete!");
console.log(`→ Output written to ${OUTPUT_YAML}`);
console.log("→ Audio files renamed to pure index mode");
