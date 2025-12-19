// carousel-playground.js
// Carousel + controls; calls PlaygroundTags.update() when slides change
(() => {
    const rail = document.getElementById('rail');
    if (!rail) return;
    const slides = Array.from(rail.querySelectorAll('.slide'));
    const dots = document.getElementById('dots');
    const counterEl = document.getElementById('counter');
    const pill = counterEl?.querySelector('.pill');
    const edgeL = document.getElementById('edge-left');
    const edgeR = document.getElementById('edge-right');
    const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;


    function editingActive(e) {
        // ignore when a tag is dragged or when the event started on a tag
        if (document.body.dataset.editDragging === '1') return true;
        if (e && (e.target.closest && e.target.closest('.tag'))) return true;
        return false;
    }

    function pointerDown(e) {
        if (editingActive(e)) return;      // NEW
        // existing code...
    }
    function pointerMove(e) {
        if (!isDown || editingActive(e)) return;   // NEW
        // existing code...
    }
    function pointerUp(e) {
        if (editingActive(e)) { isDown = false; return; }  // NEW
        // existing code...
    }

    rail.addEventListener('wheel', (e) => {
        if (editingActive(e)) return;       // NEW
        // existing code...
    }, { passive: false });

    rail.addEventListener('keydown', (e) => {
        if (editingActive(e)) return;       // NEW
        // existing code...
    });




    function makeDots() {
        if (!dots) return;
        dots.innerHTML = '';
        slides.forEach((_, i) => {
            const b = document.createElement('button');
            b.className = 'dot';
            b.setAttribute('role', 'tab');
            b.addEventListener('click', () => go(i));
            dots.appendChild(b);
        });
    }
    makeDots();

    addEventListener('mousemove', (e) => {
        const band = 80;
        edgeL?.classList.toggle('show', e.clientX < band);
        edgeR?.classList.toggle('show', innerWidth - e.clientX < band);
    });
    edgeL?.querySelector('button')?.addEventListener('click', () => go(idx - 1));
    edgeR?.querySelector('button')?.addEventListener('click', () => go(idx + 1));

    rail.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            rail.scrollLeft += e.deltaY;
            e.preventDefault();
        }
    }, { passive: false });

    let isDown = false, startX = 0, startScroll = 0, lastX = 0, lastT = 0, vel = 0;
    const px = e => (e.touches ? e.touches[0].clientX : e.clientX);
    const now = () => performance.now();
    const friction = 0.95;

    function pointerDown(e) {
        isDown = true; rail.classList.add('dragging');
        startX = px(e); startScroll = rail.scrollLeft; lastX = startX; lastT = now(); vel = 0;
    }
    function pointerMove(e) {
        if (!isDown) return; const x = px(e), t = now();
        rail.scrollLeft = startScroll - (x - startX);
        vel = ((lastX - x) / (t - lastT)) * 16; lastX = x; lastT = t;
    }
    function pointerUp() {
        if (!isDown) return; isDown = false; rail.classList.remove('dragging');
        (function fling(v) {
            if (Math.abs(v) < 0.1) return; rail.scrollLeft += v; v *= friction;
            requestAnimationFrame(() => fling(v));
        })(vel * 14);
    }

    rail.addEventListener('pointerdown', pointerDown);
    addEventListener('pointermove', pointerMove);
    addEventListener('pointerup', pointerUp);

    rail.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') go(idx + 1);
        if (e.key === 'ArrowLeft') go(idx - 1);
    });

    let idx = 0;

    function updateUI(i) {
        pill && (pill.textContent = `${i + 1} / ${slides.length}`);
        slides.forEach((s, n) => s.classList.toggle('is-active', n === i));
        if (dots) [...dots.children].forEach((d, n) =>
            d.setAttribute('aria-current', n === i ? 'true' : 'false'));
    }

    function go(i) {
        idx = (i + slides.length) % slides.length;
        slides[idx].scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', inline: 'center' });
        updateUI(idx);

        // Let layout settle, then update pins and notify editor
        requestAnimationFrame(() => requestAnimationFrame(() => {
            window.PlaygroundTags?.update();
            document.dispatchEvent(new CustomEvent('slidechange', { detail: { index: idx, slide: slides[idx] } }));
        }));
    }

    function onScroll() {
        const x = rail.scrollLeft, w = rail.clientWidth;
        let best = Infinity, nearest = 0;
        slides.forEach((s, i) => {
            const d = Math.abs((s.offsetLeft - x) / w);
            if (d < best) { best = d; nearest = i; }
        });
        if (nearest !== idx) {
            idx = nearest;
            updateUI(idx);
            // settle → update pins → announce change
            requestAnimationFrame(() => requestAnimationFrame(() => {
                window.PlaygroundTags?.update();
                document.dispatchEvent(new CustomEvent('slidechange', { detail: { index: idx, slide: slides[idx] } }));
            }));
        }
    }
    rail.addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', () => { onScroll(); window.PlaygroundTags?.update(); });

    // Counter auto-hide
    setTimeout(() => counterEl?.classList.add('is-hidden'), 3500);
    ['scroll', 'keydown', 'pointerdown', 'touchstart'].forEach(evt =>
        rail.addEventListener(evt, () => counterEl?.classList.add('is-hidden'), { once: true, passive: true })
    );

    updateUI(0);
    requestAnimationFrame(onScroll);
})();
