---
layout: home
title: StudioRich — Live Lo-Fi Stream + Creative Engine
permalink: /
---

<div id="centerWrap">

<div id="type-stage">
  <img class="type-slide active"
       src="{{ '/assets/type/after-hours.svg' | relative_url }}"
       alt="After Hours" />

<img class="type-slide"
       src="{{ '/assets/type/late-transmission.svg' | relative_url }}"
       alt="Late Transmission" />

<img class="type-slide"
       src="{{ '/assets/type/jp-stamp.svg' | relative_url }}"
       alt="StudioRich stamp" />

<img class="type-slide"
       src="{{ '/assets/type/1130-pm-est.svg' | relative_url }}"
       alt="11:30 PM EST" />

<img class="type-slide"
       src="{{ '/assets/type/built-slowly.svg' | relative_url }}"
       alt="Built Slowly" />

</div>

  <svg id="moodline" viewBox="0 0 100 40" preserveAspectRatio="none">
    <path
      id="moodPath"
      d="M0 20 Q 25 20, 50 20 T 100 20"
      stroke="#555"
      stroke-width="1"
      vector-effect="non-scaling-stroke"
      fill="none"
    />
  </svg>

  <div id="info-layer">
    <div id="nowplaying-label">Now Playing</div>
    <div id="track-title">“Live Lo-Fi broadcasts • Twitch & YouTube”</div>
  </div>

</div>

<div id="live-icons">
  <a id="twitch-icon" href="https://www.twitch.tv/studiorich"><img src="/assets/img/logos/twitch.svg"></a>
  <a id="yt-icon" href="https://www.youtube.com/@Studio-Rich?sub_confirmation=1">
  <img src="/assets/img/logos/youtube.svg" alt="Subscribe on YouTube">
</a>

</div>
 <script>
      const slides = document.querySelectorAll(".type-slide");
      let i = 0;

setInterval(() => {
slides[i].classList.remove("active");
i = (i + 1) % slides.length;
slides[i].classList.add("active");
}, 11000);

  </script>

<script>
const path = document.getElementById("moodPath");
let t = 0;

function animateLine() {
  const amp = 2 + Math.sin(t * 0.5) * 1.5;
  const y = 20 + Math.sin(t) * amp;

  path.setAttribute(
    "d",
    `M0 ${y} Q 25 ${20 - amp}, 50 ${y} T 100 ${20 + amp}`
  );

  t += 0.03;
  requestAnimationFrame(animateLine);
}

animateLine();
</script>
