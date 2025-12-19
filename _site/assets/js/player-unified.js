
// assets/js/player-unified.js

(function () {
    // ---- Elements
    const audio = document.getElementById('audio');
    const btnPrev = document.getElementById('npPrev');
    const btnNext = document.getElementById('npNext');
    const btnToggle = document.getElementById('npToggle');
    const elPlaylist = document.getElementById('npPlaylist');
    const elTrack = document.getElementById('npTrack');
    const elCur = document.getElementById('npCur');
    const elDur = document.getElementById('npDur');
    const elSeek = document.getElementById('npSeek');
    const qPanel = document.getElementById('npQueue');
    const qTitle = document.getElementById('npQueueTitle');
    const qList = document.getElementById('npQueueList');
    const qClose = document.getElementById('npQueueClose');

    // ---- State
    const DEFAULT_COVER = '/assets/img/covers/default.webp';
    const DEFAULT_ARTIST = 'StudioRich';
    const DEFAULT_TITLE = 'Untitled';
    let QUEUE = Array.isArray(window.SRC) ? window.SRC.slice() : [];
    let index = 0;
    let seeking = false;
    let metaTimer = null;

    // ---- Helpers
    const fmt = s => {
        s = Math.max(0, Math.floor(s || 0));
        const m = Math.floor(s / 60);
        const r = s % 60;
        return `${m}:${r < 10 ? '0' : ''}${r}`;
    };

    function current() {
        if (!QUEUE.length) return null;
        return QUEUE[Math.min(Math.max(index, 0), QUEUE.length - 1)];
    }

    function setQueue(list, startAt = 0, title = 'Queue') {
        QUEUE = (list || []).filter(Boolean);
        index = Math.min(Math.max(startAt, 0), Math.max(0, QUEUE.length - 1));
        qTitle.textContent = title;
        renderQueue();
        if (QUEUE.length) load(index, /*autoplay*/ false);
        else clearUI();
    }

    function renderQueue() {
        qList.innerHTML = '';
        QUEUE.forEach((t, i) => {
            const li = document.createElement('li');
            li.className = 'np-item' + (i === index ? ' is-active' : '');
            li.innerHTML = `
        <button class="np-jump" data-i="${i}">
          <img src="${(t.cover || DEFAULT_COVER)}" alt="" loading="lazy" />
          <div class="np-i-meta">
            <div class="np-i-title">${t.title || DEFAULT_TITLE}</div>
            <div class="np-i-artist">${t.artist || DEFAULT_ARTIST}</div>
          </div>
        </button>`;
            qList.appendChild(li);
        });
    }

    function clearUI() {
        elPlaylist.textContent = '—';
        elTrack.textContent = 'Nothing queued';
        elCur.textContent = '0:00';
        elDur.textContent = '0:00';
        elSeek.value = 0;
        btnPrev.disabled = true;
        btnNext.disabled = true;
        btnToggle.disabled = true;
    }

    function updateButtons() {
        btnPrev.disabled = (index <= 0);
        btnNext.disabled = (index >= QUEUE.length - 1);
        btnToggle.disabled = !QUEUE.length;
    }

    function updateMeta() {
        try {
            elCur.textContent = fmt(audio.currentTime);
            if (!isNaN(audio.duration) && audio.duration !== Infinity) {
                elDur.textContent = fmt(audio.duration);
                if (!seeking) {
                    elSeek.value = Math.floor((audio.currentTime / audio.duration) * 1000) || 0;
                }
            }
        } catch (e) { }
    }

    function load(i, autoplay = true) {
        if (!QUEUE.length) return;
        index = Math.min(Math.max(i, 0), QUEUE.length - 1);
        const t = current();

        // Update labels
        elPlaylist.textContent = `Playlist • ${QUEUE.length} tracks`;
        elTrack.textContent = `${t.title || DEFAULT_TITLE} — ${t.artist || DEFAULT_ARTIST}`;
        updateButtons();
        renderQueue();

        // (Optional) update page <meta> cover for share cards, skip if not desired.

        // Load audio
        audio.src = t.url;
        audio.preload = 'auto';
        audio.load();

        // Autoplay when we can
        const doPlay = () => {
            audio.play().catch(() => {
                // Autoplay blocked — just update UI to paused state
            });
        };

        // If duration is known quickly, UI updates immediately
        if (autoplay) {
            // Some browsers need canplay or loadeddata
            const ready = () => {
                audio.removeEventListener('canplay', ready);
                audio.removeEventListener('loadeddata', ready);
                doPlay();
            };
            audio.addEventListener('canplay', ready);
            audio.addEventListener('loadeddata', ready);
        }
    }

    function playPause() {
        if (!QUEUE.length) return;
        if (audio.paused) audio.play().catch(() => { });
        else audio.pause();
    }

    function next() {
        if (index < QUEUE.length - 1) load(index + 1, true);
    }

    function prev() {
        if (audio.currentTime > 3) {
            audio.currentTime = 0;
            return;
        }
        if (index > 0) load(index - 1, true);
    }

    // ---- Events
    btnPrev?.addEventListener('click', prev);
    btnNext?.addEventListener('click', next);
    btnToggle?.addEventListener('click', playPause);

    qClose?.addEventListener('click', () => qPanel.setAttribute('hidden', ''));
    // Toggle queue with playlist title click
    elPlaylist?.addEventListener('click', () => {
        if (!QUEUE.length) return;
        if (qPanel.hasAttribute('hidden')) qPanel.removeAttribute('hidden');
        else qPanel.setAttribute('hidden', '');
    });
    qList?.addEventListener('click', (e) => {
        const btn = e.target.closest('.np-jump');
        if (!btn) return;
        const i = parseInt(btn.getAttribute('data-i'), 10);
        if (!isNaN(i)) load(i, true);
    });

    // Seeking
    elSeek?.addEventListener('input', () => {
        seeking = true;
        if (!isNaN(audio.duration) && audio.duration > 0) {
            const pct = parseInt(elSeek.value, 10) / 1000;
            audio.currentTime = Math.max(0, Math.min(audio.duration * pct, audio.duration - 0.25));
            updateMeta();
        }
    });
    elSeek?.addEventListener('change', () => { seeking = false; });

    // Audio lifecycle
    audio.addEventListener('timeupdate', updateMeta);
    audio.addEventListener('durationchange', updateMeta);
    audio.addEventListener('play', () => { metaTimer = setInterval(updateMeta, 250); });
    audio.addEventListener('pause', () => { if (metaTimer) { clearInterval(metaTimer); metaTimer = null; } updateMeta(); });
    audio.addEventListener('ended', next);
    audio.addEventListener('error', () => {
        // Skip corrupt/missing sources
        console.warn('Audio error, skipping track', current());
        next();
    });

    // Keyboard (space, arrows)
    document.addEventListener('keydown', (e) => {
        if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
        if (e.code === 'Space') { e.preventDefault(); playPause(); }
        if (e.code === 'ArrowRight') next();
        if (e.code === 'ArrowLeft') prev();
    });

    // ---- Boot
    if (!QUEUE.length) {
        clearUI();
    } else {
        setQueue(QUEUE, 0, 'Default Queue');
    }

    // Expose small API (for Genie later)
    window.Player = {
        setQueue,
        append(list) { setQueue(QUEUE.concat(list || []), index, qTitle.textContent); },
        playPause, next, prev,
        current: () => current(),
        isPlaying: () => !audio.paused
    };
})();
