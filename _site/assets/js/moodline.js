// assets/js/moodline.js

(function () {
  const wave = document.getElementById("mood-wave");
  const logo = document.getElementById("mood-logo");
  const grad = document.getElementById("mood-gradient");

  // -----------------------------------------------
  // Dynamic Mood Colors (same as before)
  // -----------------------------------------------
  function updateMoodColors(hexA, hexB) {
    grad.children[0].setAttribute("stop-color", `#${hexA}`);
    grad.children[1].setAttribute("stop-color", `#${hexB}`);
  }
  window.updateMoodLine = updateMoodColors;

  // ----------------------------------------------------------
  // WAVE ANIMATION — GSAP Version
  // ----------------------------------------------------------
  // GSAP drives a param (t) which curves the wave
  const params = { t: 0 };

  gsap.to(params, {
    t: 9999,
    duration: 600,
    ease: "none",
    repeat: -1,
    onUpdate() {
      const t = params.t * 0.02;
      const amp = 5 + Math.sin(t * 2) * 2;
      const mid = 20;

      const p = `
        M 0 ${mid}
        Q 250 ${mid + Math.sin(t) * amp}
          500 ${mid + Math.sin(t + 1) * amp}
        T 1000 ${mid + Math.sin(t + 2) * amp}
      `;

      wave.setAttribute("d", p);
    },
  });

  // ----------------------------------------------------------
  // LOGO PULSE — GSAP Timeline (so smooth)
  // ----------------------------------------------------------
  gsap.to(logo, {
    scale: 1.06,
    duration: 2,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    transformOrigin: "50% 50%",
  });

  // ----------------------------------------------------------
  // OPTIONAL: Dotted Dash Movement
  // ----------------------------------------------------------
  function enableDashMotion() {
    wave.style.strokeDasharray = "6 10";

    gsap.fromTo(
      wave,
      { strokeDashoffset: 0 },
      {
        strokeDashoffset: -40,
        duration: 1.8,
        ease: "none",
        repeat: -1,
      }
    );
  }

  // enableDashMotion(); // Enable if you want dotted/dash movement

  // ----------------------------------------------------------
  // OPTIONAL: Gradient Sweep Animation
  // Subtle color movement across the gradient
  // ----------------------------------------------------------
  function enableGradientSweep() {
    gsap.to(grad, {
      attr: { x1: "-30%", x2: "130%" },
      duration: 4,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  }

  // enableGradientSweep(); // Enable if you want this
})();
