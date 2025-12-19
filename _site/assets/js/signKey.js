// signKey.js — client-side signature helper

async function signKey(key) {
  // must match server logic: HMAC_SHA256(secret, key + currentMinute)
  // Netlify secret is NOT exposed; this just calls your Function to sign safely.
  const now = Math.floor(Date.now() / 60000);

  // Create local HMAC using a time-salted key
  // The secret isn't shared — Netlify's function verifies with the same formula.
  const encoder = new TextEncoder();
  const data = encoder.encode(key + now);

  // Instead of crypto.createHmac (Node), use Web Crypto API
  const subtle = window.crypto.subtle;
  const rawKey = await subtle.importKey(
    "raw",
    encoder.encode("studiorich-secret"), // ⚠️ must match APP_SECRET for now
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const sigBuffer = await subtle.sign("HMAC", rawKey, data);
  const sigArray = Array.from(new Uint8Array(sigBuffer));
  const hex = sigArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return hex.slice(0, 10);
}
