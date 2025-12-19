// /assets/js/user-settings.js
// ============================================================================
// StudioRich User Settings + Prefs
// Manages localStorage prefs, UI updates, and sign-out
// ============================================================================

import { auth } from "/assets/js/firebase-init.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

export function toast(msg) {
    let t = document.getElementById("toast");
    if (!t) return console.warn("Toast container missing.");
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2000);
}

// Load and save user prefs from localStorage
window.addEventListener("DOMContentLoaded", () => {
    const settings = JSON.parse(localStorage.getItem("sr_prefs") || "{}");
    const volume = document.querySelector("#volumeControl");
    const lang = settings.language || "en";

    if (volume) volume.value = settings.volume || 70;
    if (settings.theme) document.documentElement.dataset.theme = settings.theme;

    document.querySelector("#themeSelect")?.addEventListener("change", e => {
        settings.theme = e.target.value;
        localStorage.setItem("sr_prefs", JSON.stringify(settings));
    });

    volume?.addEventListener("input", e => {
        settings.volume = e.target.value;
        localStorage.setItem("sr_prefs", JSON.stringify(settings));
    });
});

// Helper functions for other modules
export function getLocalPrefs() {
    return JSON.parse(localStorage.getItem("sr_prefs") || "{}");
}
export function saveLocalPrefs(prefs) {
    localStorage.setItem("sr_prefs", JSON.stringify(prefs));
}

// expose globally so inline buttons or HTML onclick can access
window.toast = toast;
console.log("🔥 Toast system ready:", !!window.toast);
