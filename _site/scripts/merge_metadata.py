# merge_metadata.py — FINAL VERSION
import csv, os

BASE = "/Users/studio/Projects/studiorich.shop/scripts/metadata"

ANALYSIS = f"{BASE}/analysis.csv"
COLORS   = f"{BASE}/mood_color_master.csv"
OUT      = f"{BASE}/catalog_master.csv"

# ----------------------------------------------------
# LOAD: analysis.csv
# ----------------------------------------------------
analysis = {}

try:
    with open(ANALYSIS) as f:
        r = csv.DictReader(f)

        for row in r:
            filename = row["filename"].strip()

            # Extract mood name → "049_At Ease.m4a" → "At Ease"
            try:
                mood = filename.split("_", 1)[1].rsplit(".", 1)[0].strip()
            except:
                print(f"⚠️ Skipping invalid filename: {filename}")
                continue

            # Normalize naming so everything downstream is predictable
            row["Mood"] = mood
            row["File"] = filename
            row["BPM"] = row["bpm"]
            row["Key"] = row["key"]

            analysis[mood] = row

except FileNotFoundError:
    print("❌ ERROR: analysis.csv not found at:\n   ", ANALYSIS)
    exit(1)

# ----------------------------------------------------
# LOAD: mood_color_master.csv
# ----------------------------------------------------
color_data = {}
try:
    with open(COLORS) as f:
        r = csv.DictReader(f)
        for row in r:
            mood = row["Mood"].strip()
            color_data[mood] = row
except FileNotFoundError:
    print("❌ ERROR: mood_color_master.csv not found at:\n   ", COLORS)
    exit(1)

print("✓ Loaded analysis + color master")

# ----------------------------------------------------
# CODE SYSTEM: JO01A, FM14A, AE30A, NS12B
# ----------------------------------------------------
group_counters = {}

def make_code(group):
    group_counters[group] = group_counters.get(group, 0) + 1
    return f"{group}{group_counters[group]:02d}A"

# ----------------------------------------------------
# MERGE + OUTPUT
# ----------------------------------------------------
rows = []

for mood, a in analysis.items():
    if mood not in color_data:
        print(f"⚠️ Missing color data for mood: {mood}")
        continue

    c = color_data[mood]
    group = c["Group"]

    rows.append({
        "Code": make_code(group),
        "Mood": mood,
        "File": a["File"],
        "Duration": a["duration_sec"],
        "BPM": a["BPM"],
        "Key": a["Key"],
        "Hex": c["hex"],
        "Group": group,
    })

if not rows:
    print("❌ ERROR: No merged results generated")
    exit(1)

with open(OUT, "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)

print("✅ catalog_master.csv created:\n   ", OUT)
