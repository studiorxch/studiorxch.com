// assets/js/nav-toggle.js
(function () {
    const nav = document.getElementById("globalNav");
    const overlay = document.getElementById("mobileOverlay");
    const btn = document.getElementById("hamburgerBtn");

    if (!nav || !btn) return;

    function toggleNav(force) {
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        const willOpen =
            typeof force === "boolean"
                ? force
                : isMobile
                    ? !nav.classList.contains("open")
                    : nav.classList.contains("collapsed");

        if (isMobile) {
            nav.classList.toggle("open", willOpen);
            overlay?.classList.toggle("active", willOpen);
            document.body.classList.toggle("menu-open", willOpen);
        } else {
            nav.classList.toggle("collapsed", !willOpen);
        }

        btn.setAttribute("aria-expanded", String(willOpen));
        btn.classList.toggle("is-open", willOpen);
    }

    // Hook up button
    btn.addEventListener("click", () => toggleNav());

    // Close on ESC (mobile only)
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") toggleNav(false);
    });

    // Expose globally if inline calls exist
    window.toggleNav = toggleNav;
})();
