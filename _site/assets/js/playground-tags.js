// assets/js/playground-tags.js
(() => {
    function parseObjectPosition(str) {
        if (!str) return [0.5, 0.5];
        const s = String(str).replace('-', ' ');
        const map = { left: 0, center: 0.5, right: 1, top: 0, bottom: 1 };
        const parts = s.trim().split(/\s+/);
        if (parts.length === 1) parts.push('50%');
        const toNum = v => v.endsWith('%') ? Math.min(1, Math.max(0, parseFloat(v) / 100)) : (map[v] ?? 0.5);
        return [toNum(parts[0]), toNum(parts[1])];
    }

    function positionTagsForSlide(slide) {
        const img = slide.querySelector('.media');
        const tagsC = slide.querySelector('.tags');
        if (!img || !tagsC) return;

        const rect = img.getBoundingClientRect();
        const cw = rect.width, ch = rect.height;
        const nw = img.naturalWidth || cw;
        const nh = img.naturalHeight || ch;

        const scale = Math.max(cw / nw, ch / nh);
        const dw = nw * scale, dh = nh * scale;

        const cssPos = getComputedStyle(img).objectPosition || slide.dataset.pos;
        const [ox, oy] = parseObjectPosition(cssPos);
        const offsetLeft = (cw - dw) * ox;
        const offsetTop = (ch - dh) * oy;

        tagsC.querySelectorAll('.tag').forEach(tag => {
            const x = parseFloat(tag.dataset.x);
            const y = parseFloat(tag.dataset.y);
            tag.style.left = `${offsetLeft + x * dw}px`;
            tag.style.top = `${offsetTop + y * dh}px`;
        });
    }

    const ro = new ResizeObserver(entries => {
        for (const e of entries) {
            const slide = e.target.closest('.slide') || e.target;
            positionTagsForSlide(slide);
        }
    });

    function bootstrap() {
        document.querySelectorAll('.slide').forEach(slide => {
            const img = slide.querySelector('.media');
            if (!img) return;
            if (img.complete) positionTagsForSlide(slide);
            else img.addEventListener('load', () => positionTagsForSlide(slide), { once: true });
            ro.observe(slide);
        });
    }

    window.PlaygroundTags = {
        update() {
            const active = document.querySelector('.slide.is-active') || document.querySelector('.slide');
            if (active) positionTagsForSlide(active);
        }
    };

    if (document.readyState !== 'loading') bootstrap();
    else document.addEventListener('DOMContentLoaded', bootstrap);
})();
