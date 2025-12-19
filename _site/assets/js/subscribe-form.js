// /assets/js/subscribe-form.js
document.addEventListener("submit", async (e) => {
    const form = e.target;
    if (!form.matches("#subscribeForm")) return;
    e.preventDefault();

    const btn = form.querySelector("button[type='submit']");
    const msg = form.querySelector(".form-msg");
    const data = new FormData(form);
    const email = (data.get("email") || "").trim();

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        msg.textContent = "Please enter a valid email.";
        return;
    }

    // Simulate success locally
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        msg.textContent = "Dev mode: captured email. (No email sent.)";
        console.log("📩 DEV SUBSCRIBE:", Object.fromEntries(data.entries()));
        form.reset();
        return;
    }

    // Submit to Formspree
    btn.disabled = true;
    const prior = btn.textContent;
    btn.textContent = "Subscribing…";
    msg.textContent = "";

    try {
        const res = await fetch(form.action, {
            method: "POST",
            body: data,
            headers: { Accept: "application/json" },
        });

        if (res.ok) {
            msg.textContent = "You’re in. Check your email for confirmation.";
            form.reset();
        } else {
            const err = await res.json().catch(() => ({}));
            const detail =
                (err.errors && err.errors.map((e) => e.message).join(", ")) ||
                `HTTP ${res.status}: ${res.statusText}`;
            msg.textContent = "Oops — " + detail;
        }
    } catch (err) {
        msg.textContent = "Network error. Try again soon.";
    } finally {
        btn.disabled = false;
        btn.textContent = prior;
    }
});
