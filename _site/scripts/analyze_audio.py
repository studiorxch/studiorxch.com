#!/usr/bin/env python3
import librosa, csv, os

AUDIO_DIR = "audio"
OUT_CSV   = "metadata/analysis.csv"

with open(OUT_CSV, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["filename","duration_sec","bpm","key","energy","loudness","rhythm_density","peak_db"])

    for file in os.listdir(AUDIO_DIR):
        if not file.lower().endswith((".wav",".m4a",".mp3",".flac")):
            continue

        path = os.path.join(AUDIO_DIR, file)
        y, sr = librosa.load(path)

        duration = librosa.get_duration(y=y, sr=sr)
        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
        rms = librosa.feature.rms(y=y)[0].mean()
        loudness = 20 * librosa.core.amplitude_to_db([rms])[0]
        chroma = librosa.feature.chroma_cqt(y=y, sr=sr)
        key_idx = chroma.mean(axis=1).argmax()
        key_name = ["C","C#","D","Eb","E","F","F#","G","Ab","A","Bb","B"][key_idx]

        writer.writerow([
            file, round(duration,2), round(float(tempo),1), key_name,
            round(float(rms),4), round(float(loudness),2), 0.0, 0.0
        ])
