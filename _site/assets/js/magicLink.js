// /assets/js/magicLink.js
// ============================================================================
// StudioRich Magic Link Authentication — Debug Safe Version (v3.2)
// ============================================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// --- Firebase Config (replace with your .env or inline keys) ---
const firebaseConfig = {
  apiKey: " ",
  authDomain: " ",
  projectId: " ",
  storageBucket: " ",
  messagingSenderId: " ",
  appId: " ",
};

// --- Initialize Firebase ---
let app, auth;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  console.log("🔥 Firebase initialized:", app.name);
} catch (err) {
  console.error("❌ Firebase init failed:", err);
}

// --- Elements ---
const emailInput = document.getElementById("emailInput");
const magicBtn = document.getElementById("magicLinkBtn");
const statusMsg = document.getElementById("statusMsg");

// --- Utility ---
function setStatus(msg, cls = "info") {
  if (!statusMsg) return console.log("Status:", msg);
  statusMsg.textContent = msg;
  statusMsg.className = "status-msg " + cls;
  console.log("Status:", msg);
}

// --- Event Binding ---
window.addEventListener("DOMContentLoaded", () => {
  if (!magicBtn) return console.warn("Magic Link button not found.");

  magicBtn.addEventListener("click", async () => {
    const email = emailInput?.value.trim();
    if (!email) return setStatus("Enter a valid email.", "error");

    setStatus("Sending magic link...", "info");

    try {
      // --- Dynamic redirect URL (adjusts between dev and prod) ---
      const redirectUrl = window.location.hostname.includes("dev.")
        ? "https://dev.studiorich.shop"
        : "https://studiorich.shop";

      await sendSignInLinkToEmail(auth, email, {
        url: redirectUrl,
        handleCodeInApp: true,
      });

      window.localStorage.setItem("emailForSignIn", email);
      setStatus("✅ Magic link sent! Check your inbox.", "success");
    } catch (err) {
      console.error("Magic Link error:", err);
      setStatus("❌ " + err.message, "error");
    }
  });

  // --- Handle login redirect ---
  if (isSignInWithEmailLink(auth, window.location.href)) {
    let email = window.localStorage.getItem("emailForSignIn");
    if (!email) email = prompt("Enter your email to complete sign-in:");
    setStatus("Verifying link...", "info");

    signInWithEmailLink(auth, email, window.location.href)
      .then(() => {
        window.localStorage.removeItem("emailForSignIn");
        setStatus("🎉 Signed in successfully!", "success");
        console.log("User signed in via Magic Link.");
      })
      .catch((err) => {
        console.error("Sign-in failed:", err);
        setStatus("❌ " + err.message, "error");
      });
  }
});

// --- New Section: Persistent User Session ---
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const userInfo = document.getElementById("userInfo");
const signOutBtn = document.getElementById("signOutBtn");
const userBadge = document.getElementById("userBadge");

onAuthStateChanged(auth, (user) => {
  if (user) {
    // Save to localStorage
    localStorage.setItem("user", JSON.stringify({ email: user.email }));

    // Update UI
    updateUI(user.email);
    if (userBadge) userBadge.style.display = "inline-block";
  } else {
    localStorage.removeItem("user");
    resetUI();
    if (userBadge) userBadge.style.display = "none";
  }
});

function updateUI(email) {
  if (userInfo) userInfo.textContent = `Signed in as ${email}`;
  signOutBtn.style.display = "block";
  emailInput.style.display = magicBtn.style.display = "none";
}

function resetUI() {
  if (userInfo) userInfo.textContent = "";
  signOutBtn.style.display = "none";
  emailInput.style.display = magicBtn.style.display = "inline-block";
}

// Sign-out handler
signOutBtn.addEventListener("click", async () => {
  await signOut(auth);
  resetUI();
  setStatus("👋 Signed out successfully", "info");

  // toast confirmation
  if (window.toast) window.toast("👋 Signed out");
});
