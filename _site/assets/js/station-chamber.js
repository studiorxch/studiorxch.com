// station-chamber.js

(function () {
    const panel = document.getElementById('ctxPanel');
    const toggle = document.getElementById('ctxToggle');
    const close = document.getElementById('ctxClose');
    const ctxStation = document.getElementById('ctxStation');
    const ctxLines = document.getElementById('ctxLines');
    const head = document.getElementById('ctxTitle');
    const headL = document.getElementById('ctxHeadLines');

    function renderLines(container, lines) {
        if (!container) return;
        container.innerHTML = '';
        (lines || []).forEach(L => {
            const span = document.createElement('span');
            span.className = 'route-bullet line-' + String(L).toLowerCase();
            span.textContent = L;
            container.appendChild(span);
        });
    }

    function getActiveSlide() {
        return document.querySelector('.slide.is-active') ||
            document.querySelector('.slide[data-active="true"]');
    }

    function readMetaFrom(slide) {
        if (!slide) return { station: null, lines: [] };
        const station = slide.getAttribute('data-station') || slide.getAttribute('aria-label');
        const linesCSV = slide.getAttribute('data-lines') || '';
        const lines = linesCSV.split(',').map(s => s.trim()).filter(Boolean);
        return { station, lines };
    }

    function refreshFromActive() {
        const slide = getActiveSlide();
        const meta = readMetaFrom(slide);
        ctxStation.textContent = meta.station || '—';
        head.textContent = meta.station || 'Station';
        renderLines(ctxLines, meta.lines);
        renderLines(headL, meta.lines);
    }

    function open() {
        panel.removeAttribute('hidden');
        toggle.setAttribute('aria-expanded', 'true');
        localStorage.setItem('sr.stationOpen', '1');
    }
    function closePanel() {
        panel.setAttribute('hidden', '');
        toggle.setAttribute('aria-expanded', 'false');
        localStorage.setItem('sr.stationOpen', '0');
    }

    toggle.addEventListener('click', e => { e.preventDefault(); panel.hasAttribute('hidden') ? open() : closePanel(); });
    close.addEventListener('click', e => { e.preventDefault(); closePanel(); });

    document.addEventListener('sr:station:open-request', open);

    document.addEventListener('DOMContentLoaded', () => {
        refreshFromActive();
        const pref = localStorage.getItem('sr.stationOpen');
        if (pref === '1') { open(); return; }
        if (pref === '0') { closePanel(); return; }
        open(); setTimeout(closePanel, 2500); // peek
    });

    window.SRStation = { open, close: closePanel, refresh: refreshFromActive };
})();
