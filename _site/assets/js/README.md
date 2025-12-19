# MOTION_ARCHETYPES.js

All eight groups, optimized for import.

# wave-engine.js

the GSAP Wave Engine Core
• wave path generator
• animation loop
• jitter + drift
• gradient sweep
• dynamic archetype application
• logo animator
• frame timing management
• color updates
• clean APIs

This is production-ready, modular, minimal, and built to plug directly into:
• your SVG wave
• your gradient stops
• your logo node
• your MOTION_ARCHETYPES.js file
• your homepage now-playing system

# mood-mapper.js

StudioRich Mood Intelligence Layer.
This module gives you:
• clean mapping structure
• automatic fallback groups
• optional hue-based routing (for color-driven moods)
• optional keyword routing
• explicit overrides (so you remain in control)
• final mapMoodToGroup(mood, hue, energy) API

# mood-motion-pipeline.js

This is your one-stop engine:
Track data → Mood Mapper → Archetype → GSAP Wave Engine → Live Motion

```js
import { MoodMotion } from "./mood-motion-pipeline.js";

async function updateNowPlaying() {
  const res = await fetch("/.netlify/functions/get-nowplaying");
  const track = await res.json();

  MoodMotion.applyTrack(track);
}
```

Motion will automatically:
• pick the right G01–G08 archetype
• set the wave shape + jitter + drift + motion
• adjust logo dynamics
• create a complementary gradient
• animate it with GSAP
• ensure smooth transitions
• keep the engine running across track changes

# gradient-blender.js

## How this works in the Motion Pipeline

```js
import { blendGradient } from "./gradient-blender.js";

const { stop1, stop2 } = blendGradient(track.color, group);
updateGradient(stop1, stop2);
```

But if you want the full StudioRich aesthetic with dual blending:
• Archetype-specific bias
• Balanced complement logic
• Split-tone logic for warm/cool moods
• Clean fallback behaviors

Then use the exported applyGradientToSVG:

```js
import { applyGradientToSVG } from "./gradient-blender.js";

applyGradientToSVG(gradNode, track.color, group);
```

# SUMMARY

    •	A dedicated, modern gradient system
    •	Per-group style intelligence
    •	Customizable warm/cool shifts
    •	Complementary color logic
    •	Dead clean hex parsing
    •	Minimal, extendable code

# homepage.js

✔ Mood engine booted

✔ GSAP wave engine running

✔ Gradient blender applied

✔ Mood → Group mapping locked

✔ Archetype applied instantly

✔ Live icons switching

✔ Track title updating

✔ Local + production endpoint detection

✔ Fault-tolerant, no-breaking errors

✔ Crisp, minimal, StudioRich-quality
