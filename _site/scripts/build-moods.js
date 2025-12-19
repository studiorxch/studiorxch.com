// -------------------------------------------------------------
// StudioRich — Unified Mood Catalog Builder
// Merges:
//   - _data/mood_track_analyzed.csv    (track audio + mood names)
//   - _data/mood_color_master.csv      (198 master colors)
// Produces:
//   - app/data/moods.yml
// -------------------------------------------------------------

import fs from "fs";
import { parse } from "csv-parse/sync";
import yaml from "js-yaml";

const TRACKS_CSV = "./_data/mood_track_analyzed.csv";
const COLORS_CSV = "./_data/mood_color_master.csv";
const OUTPUT_YAML = "./app/data/moods.yml";

console.log("🎛️  StudioRich — Building unified mood catalog…");

// -------------------------------------------------------------
// Load CSVs
// -------------------------------------------------------------
const tracksRaw = fs.readFileSync(TRACKS_CSV, "utf8");
const colorsRaw = fs.readFileSync(COLORS_CSV, "utf8");

const tracks = parse(tracksRaw, { columns: true });
const colors = parse(colorsRaw, { columns: true });

// -------------------------------------------------------------
// Build a lookup map for color data
// colorMood = colors.Mood (normalized lowercase)
// -------------------------------------------------------------
const colorMap = {};

colors.forEach((c) => {
  const key = String(c.Mood || "").trim().toLowerCase();
  if (!key) return;

  colorMap[key] = {
    color: c.hex || null,
    hue: c.hue || null,
    lightness: c.lightness || null,
    saturation: c.saturation || null,
    rgb: c.rgb || null,
    url: c.url || null,
  };
});

// -------------------------------------------------------------
// Merge tracks with their color entry
// Track mood = track.name (before variant), already correct
// -------------------------------------------------------------
const merged = tracks.map((t) => {
  const moodName = String(t.name || "").trim().toLowerCase();
  const color = colorMap[moodName] || null;

  return {
    id: t.id,
    index: t.index,
    mood: t.name,                // Clean mood name (Blissful, Ecstatic…)
    variant: t.variant,
    filename: t.filename,
    audio_path: t.audio_path,

    // Audio analysis
    bpm: t.bpm || null,
    key: t.key || null,
    energy: t.energy || null,
    duration: t.duration_sec || null,
    rhythm_density: t.rhythm_density || null,
    peak_db: t.peak_db || null,

    // Color mapping
    color: color?.color || null,
    hue: color?.hue || null,
    lightness: color?.lightness || null,
    saturation: color?.saturation || null,
    rgb: color?.rgb || null,
    url: color?.url || null,
  };
});

// -------------------------------------------------------------
// Output YAML
// -------------------------------------------------------------
const yamlOut = yaml.dump(merged, { lineWidth: -1 });
fs.writeFileSync(OUTPUT_YAML, yamlOut, "utf8");

console.log("✅ moods.yml generated!");
