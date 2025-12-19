document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("toggleChat");
    const chatBox = document.getElementById("chatBox");

    if (toggleBtn && chatBox) {
        toggleBtn.addEventListener("click", () => {
            const isHidden = chatBox.style.display === "none";
            chatBox.style.display = isHidden ? "block" : "none";
            toggleBtn.textContent = isHidden ? "🗨️ Hide Chat" : "🗨️ Show Chat";
        });
    }
});
