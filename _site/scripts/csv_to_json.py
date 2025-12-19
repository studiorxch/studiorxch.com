#!/usr/bin/env python3
import csv, json

IN_CSV  = "metadata/catalog_master.csv"
OUT_DIR = "pwa_data/"

tracks = []
with open(IN_CSV) as f:
    for row in csv.DictReader(f):
        tracks.append({
            "code": row["track_code"],
            "title": row["track_title"],
            "file": row["filename"],
            "palette": row["palette"],
            "moods": [row["mood1"], row["mood2"], row["mood3"]],
            "colors": [row["color1"], row["color2"], row["color3"]],
            "bpm": float(row["bpm"]),
            "key": row["key"],
            "duration": float(row["duration_sec"]),
            "version": row["version"],
            "wallpaper": row["wallpaper"]
        })

with open(f"{OUT_DIR}/tracks.json","w") as f:
    json.dump(tracks, f, indent=2)

print("Generated JSON for PWA.")
