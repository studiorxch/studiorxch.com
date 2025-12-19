// Attach clicks to desktop icons
document.querySelectorAll(".icon").forEach(icon => {
    icon.addEventListener("click", () => {
        const folder = icon.dataset.folder;
        const win = document.getElementById(`window-${folder}`);
        if (win) {
            win.classList.remove("hidden");
        }
    });
});

// Attach clicks to close buttons
document.querySelectorAll(".close-window").forEach(btn => {
    btn.addEventListener("click", () => {
        btn.closest(".window").classList.add("hidden");
    });
});


// Enable dragging for all .window elements
document.querySelectorAll('.window').forEach((win) => {
    const header = win.querySelector('.window-header');
    if (!header) return;

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        const rect = win.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        win.style.zIndex = 9999; // bring to front
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        win.style.left = `${e.clientX - offsetX}px`;
        win.style.top = `${e.clientY - offsetY}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
});
