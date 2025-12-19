// tags-controller.js
// tags-controller.js (keep this click handler)
document.addEventListener('click', e => {
    const el = e.target.closest('.tag');
    if (!el) return;

    const href = el.getAttribute('href') || '';
    const ref = el.dataset.ref || href;
    const isPlaylist = /\.json(\?|#|$)/i.test(ref);
    const cat = el.dataset.category || '';

    if (cat === 'track' || isPlaylist) {
        e.preventDefault();
        const current = window.SRPlay?.state?.source?.ref;
        if (current && current === ref) window.SRPlay?.toggle();
        else window.SRPlay?.loadPlaylist(ref, { autoplay: true });

        el.classList.add('is-added');

        const cover = el.dataset.cover || el.dataset.icon;
        const target = document.getElementById('npMeta') || document.querySelector('.nowbar');
        if (cover && target && window.flyToDrawer) {
            flyToDrawer({ fromEl: el, coverUrl: cover, targetEl: target });
        }
    }
});


document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.tag[data-cover]').forEach(el => {
        const url = el.dataset.cover;
        if (url) el.style.setProperty('--cover-url', `url("${url}")`);
    });
});


function setMiniContext({ title, lines = [] } = {}) {
    const t = document.getElementById('ctxMiniTitle');
    const L = document.getElementById('ctxMiniLines');
    if (!t || !L) return;
    t.textContent = title || '—';
    L.innerHTML = lines.map(x => `<span class="route-bullet line-${String(x).toLowerCase()}">${x}</span>`).join('');
}

// Example: when a slide becomes active
document.addEventListener('sr:slide', (e) => {
    const s = e.detail?.frontmatter || {}; // however you expose per-slide data
    setMiniContext({ title: s.eyebrow || s.title, lines: s.lines || [] });

    // also keep the full drawer header in sync if you want
    const ctxTitle = document.getElementById('ctxTitle');
    const ctxLines = document.getElementById('ctxHeadLines');
    if (ctxTitle) ctxTitle.textContent = s.eyebrow || s.title || 'Station';
    if (ctxLines) ctxLines.innerHTML = (s.lines || []).map(x => `<span class="route-bullet line-${String(x).toLowerCase()}">${x}</span>`).join('');
});


const ctxMini = document.getElementById('ctxMini');
const ctxPanel = document.getElementById('ctxPanel');
const ctxClose = document.getElementById('ctxClose');

ctxMini?.addEventListener('click', () => {
    const open = !ctxPanel.hasAttribute('hidden');
    if (open) { ctxPanel.setAttribute('hidden', ''); ctxMini.setAttribute('aria-expanded', 'false'); }
    else { ctxPanel.removeAttribute('hidden'); ctxMini.setAttribute('aria-expanded', 'true'); }
});

    // your existing queue toggle can bind to a button if you add one later



});
