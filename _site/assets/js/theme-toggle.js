// ============================================================================
// StudioRich Theme Toggle (v3.1 - Persistent + Preload Safe)
// ============================================================================

(function () {
    const STORAGE_KEY = "studiorich-theme";
    const html = document.documentElement;
    const toggles = document.querySelectorAll("[data-toggle-theme], #navThemeToggle, #footerThemeToggle");

    // --- Instant preload-safe application ---
    const stored = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const startTheme = stored || (prefersDark ? "dark" : "light");
    html.setAttribute("data-theme", startTheme);

    // --- DOM Ready ---
    window.addEventListener("DOMContentLoaded", () => {
        applyTheme(startTheme, false);

        toggles.forEach(toggle => {
            if (toggle.tagName === "INPUT") {
                toggle.checked = html.dataset.theme === "dark";
                toggle.addEventListener("change", () => applyTheme(toggle.checked ? "dark" : "light"));
            } else {
                toggle.addEventListener("click", () => {
                    const next = html.dataset.theme === "dark" ? "light" : "dark";
                    applyTheme(next);
                });
            }
        });
    });

    // --- Core logic ---
    function applyTheme(theme, persist = true) {
        html.dataset.theme = theme;
        if (persist) localStorage.setItem(STORAGE_KEY, theme);

        document.querySelectorAll("#navThemeToggle, #footerThemeToggle").forEach(cb => {
            if (cb.tagName === "INPUT") cb.checked = theme === "dark";
        });
    }

    // --- Sync between tabs ---
    window.addEventListener("storage", e => {
        if (e.key === STORAGE_KEY && e.newValue) applyTheme(e.newValue, false);
    });
})();



// === Unified User Menu ===
window.addEventListener("DOMContentLoaded", () => {
    const userMenu = document.querySelector(".user-menu");
    const toggleBtn = document.querySelector("#userMenuToggle");
    const dropdown = document.querySelector("#userMenuDropdown");
    const themeSelect = document.querySelector("#themeSelect");
    const volumeControl = document.querySelector("#volumeControl");

    if (!userMenu || !themeSelect) return;

    // Toggle menu open/close
    toggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        userMenu.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
        if (!userMenu.contains(e.target)) userMenu.classList.remove("active");
    });

    // Sync theme dropdown
    const current = localStorage.getItem("studiorich-theme") || "system";
    themeSelect.value = current;

    themeSelect.addEventListener("change", (e) => {
        const val = e.target.value;
        if (val === "system") {
            localStorage.removeItem("studiorich-theme");
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            document.documentElement.dataset.theme = prefersDark ? "dark" : "light";
        } else {
            localStorage.setItem("studiorich-theme", val);
            document.documentElement.dataset.theme = val;
        }
    });

    // Placeholder: volume (for future connection)
    volumeControl.addEventListener("input", (e) => {
        const vol = e.target.value;
        console.log(`Volume set to ${vol}%`);
    });
});
