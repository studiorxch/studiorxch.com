// /assets/js/firebase-sync.js #placeholder
// ============================================================================
// StudioRich Firestore Sync (placeholder v1.0)
// Handles future user preference + profile sync
// ============================================================================

import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { app } from "/assets/js/firebase-init.js";

const db = getFirestore(app);
const auth = getAuth(app);

// Save user prefs to Firestore
export async function syncUserPrefs(prefs) {
    const user = auth.currentUser;
    if (!user) return console.warn("User not signed in — skip sync");
    try {
        await setDoc(doc(db, "users", user.uid), { prefs }, { merge: true });
        console.log("✅ Synced prefs to Firestore");
    } catch (err) {
        console.error("❌ Firestore sync failed:", err);
    }
}

// Load prefs from Firestore
export async function loadUserPrefs() {
    const user = auth.currentUser;
    if (!user) return {};
    try {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        return docSnap.exists() ? docSnap.data().prefs : {};
    } catch (err) {
        console.error("⚠️ Failed to load prefs:", err);
        return {};
    }
}

// Auto-sync on sign-in
onAuthStateChanged(auth, async (user) => {
    if (!user) return;
    const prefs = await loadUserPrefs();
    if (prefs.theme) document.documentElement.dataset.theme = prefs.theme;
    localStorage.setItem("sr_prefs", JSON.stringify(prefs));
});
