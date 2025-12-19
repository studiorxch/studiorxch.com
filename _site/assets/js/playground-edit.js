// /assets/js/playground-edit.js
// Toggle with "E". Cmd/Ctrl+E exports YAML ready for front-matter.
// Drag existing .tag anchors; double-click image to add a new sticker pin.

(() => {
    const state = { on: false, currentSlide: null, dragging: null };

    function px2norm(x, y, slide) {
        const img = slide.querySelector('.media');
        const rect = img.getBoundingClientRect();
        const cw = rect.width, ch = rect.height;
        const nw = img.naturalWidth || cw;
        const nh = img.naturalHeight || ch;
        const scale = Math.max(cw / nw, ch / nh);
        const dw = nw * scale, dh = nh * scale;

        const cssPos = getComputedStyle(img).objectPosition || slide.dataset.pos || '50% 50%';
        const map = { left: 0, center: 0.5, right: 1, top: 0, bottom: 1 };
        const parts = String(cssPos).replace('-', ' ').trim().split(/\s+/);
        const toNum = v => String(v).endsWith('%') ? Math.min(1, Math.max(0, parseFloat(v) / 100)) : (map[v] ?? 0.5);
        const ox = toNum(parts[0] || '50%');
        const oy = toNum(parts[1] || '50%');

        const offsetLeft = (cw - dw) * ox;
        const offsetTop = (ch - dh) * oy;

        const rx = (x - offsetLeft) / dw;
        const ry = (y - offsetTop) / dh;
        return [Math.min(1, Math.max(0, rx)), Math.min(1, Math.max(0, ry))];
    }

    function setEdit(on) {
        state.on = on;
        document.documentElement.classList.toggle('edit-mode', on);
        if (on) {
            state.currentSlide = document.querySelector('.slide.is-active') || document.querySelector('.slide');
            wireSlide(state.currentSlide);
        }
    }

    function wireSlide(slide) {
        if (!slide) return;
        const tags = slide.querySelector('.tags');
        if (!tags) return;

        // Make existing pins draggable
        tags.querySelectorAll('.tag').forEach(a => {
            a.classList.add('editable-pin');
            a.addEventListener('pointerdown', (e) => {
                if (!state.on) return;
                e.preventDefault();
                state.dragging = a;
                a.setPointerCapture?.(e.pointerId);
            });
            a.addEventListener('pointermove', (e) => {
                if (!state.on || state.dragging !== a) return;
                const slideRect = slide.getBoundingClientRect();
                const x = e.clientX - slideRect.left;
                const y = e.clientY - slideRect.top;
                const [nx, ny] = px2norm(x, y, slide);
                a.dataset.x = nx.toFixed(4);
                a.dataset.y = ny.toFixed(4);
                window.PlaygroundTags?.update();
            });
            a.addEventListener('pointerup', () => { state.dragging = null; });
        });

        // Double-click to add sticker pin
        slide.addEventListener('dblclick', (e) => {
            if (!state.on) return;
            const slideRect = slide.getBoundingClientRect();
            const x = e.clientX - slideRect.left;
            const y = e.clientY - slideRect.top;
            const [nx, ny] = px2norm(x, y, slide);

            const href = prompt('Sticker link (href):', 'https://');
            if (href === null) return;
            const label = prompt('Sticker label:', 'New sticker') || 'Sticker';

            const tagsC = slide.querySelector('.tags') || slide.appendChild(Object.assign(document.createElement('div'), { className: 'tags' }));
            const a = document.createElement('a');
            a.className = 'tag editable-pin sticker';
            a.href = href; a.target = '_blank'; a.rel = 'noopener';
            a.dataset.x = nx.toFixed(4); a.dataset.y = ny.toFixed(4);
            a.innerHTML = `<span class="tag-tooltip">${label}</span>`;
            tagsC.appendChild(a);

            window.PlaygroundTags?.update();
            wireSlide(slide); // rebind for the new node
        }, { passive: true });

        // in pointerdown for the pin
        pin.addEventListener('pointerdown', (e) => {
            if (!document.documentElement.classList.contains('edit-mode')) return;
            e.preventDefault();
            e.stopPropagation();
            pin.setPointerCapture(e.pointerId);
            pin.dataset.__drag = '1';
            document.body.dataset.editDragging = '1';   // <-- flag
            pin.classList.add('is-dragging');           // optional, for z-index
        });

        // in pointerup / pointercancel
        pin.addEventListener('pointerup', () => {
            if (!pin.dataset.__drag) return;
            delete pin.dataset.__drag;
            delete document.body.dataset.editDragging;  // <-- clear flag
            pin.classList.remove('is-dragging');
            window.PlaygroundTags?.update();
        });

    }

    // Export YAML ready for front-matter
    function exportSlidePins() {
        const slide = document.querySelector('.slide.is-active') || document.querySelector('.slide');
        if (!slide) return;

        const pins = [...slide.querySelectorAll('.tag')].map(a => {
            const x = parseFloat(a.dataset.x);
            const y = parseFloat(a.dataset.y);
            const href = a.getAttribute('href') || '';
            const label = a.querySelector('.tag-tooltip')?.textContent || a.getAttribute('aria-label') || '';
            const toPct = v => Math.round(v * 1000) / 10; // 1 decimal
            return { x: toPct(x), y: toPct(y), href, label };
        });

        const yaml = pinsToYaml(pins);
        navigator.clipboard?.writeText(yaml).catch(() => { });
        console.log('[edit] YAML pins copied:\n' + yaml);
        alert('YAML for `tags:` copied to clipboard.\nPaste into your slide front-matter.');
    }

    function pinsToYaml(pins) {
        const esc = (s) => {
            if (s == null) return "''";
            const needsQuotes = /[:#\-?&*!|>'"%@`{}\[\],]|^\s|^\d+$|\s$/.test(s) || s.includes(': ') || s.includes('\n');
            let out = String(s).replace(/\r?\n/g, '\\n');
            return needsQuotes ? `'${out.replace(/'/g, "''")}'` : out;
        };
        let lines = ['tags:'];
        for (const p of pins) {
            const xx = Number.isFinite(p.x) ? p.x : 0;
            const yy = Number.isFinite(p.y) ? p.y : 0;
            lines.push(`  - x: ${xx}`, `    y: ${yy}`, `    href: ${esc(p.href)}`, `    label: ${esc(p.label)}`);
        }
        return lines.join('\n') + '\n';
    }

    // KEY BINDINGS — this is what was missing
    addEventListener('keydown', (e) => {
        // Don’t toggle while typing in inputs/textareas/contenteditable
        if (e.target && (e.target.closest('input, textarea, [contenteditable=""], [contenteditable="true"]'))) return;

        const k = e.key?.toLowerCase();
        if ((e.metaKey || e.ctrlKey) && k === 'e') {
            e.preventDefault();
            exportSlidePins();
            return;
        }
        if (k === 'e') {
            setEdit(!state.on);
        }
    });

    // Optional button support
    document.querySelector('[data-edit]')?.addEventListener('click', () => setEdit(!state.on));

    // Rewire when slide changes (carousel will dispatch this)
    document.addEventListener('slidechange', () => {
        if (state.on) wireSlide(document.querySelector('.slide.is-active'));
    });
})();
