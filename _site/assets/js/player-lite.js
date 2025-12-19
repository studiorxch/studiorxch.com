(function () {
    const $ = id => document.getElementById(id);

    const audio = $('audio') || document.querySelector('audio');
    const btnPlay = $('npPlay');
    const btnLoop = $('npLoop');
    const elPl = $('npPlaylist');
    const elTrack = $('npTrack');
    const elCover = $('npCover');
    const elCur = $('npCur');
    const elDur = $('npDur');
    const iconPlay = $('iconPlay');
    const iconPause = $('iconPause');

    let QUEUE = Array.isArray(window.SRC) ? window.SRC.slice() : [];
    let index = 0;

    // --- utils ---
    const fmtTime = (sec = 0) => {
        if (!isFinite(sec) || sec < 0) sec = 0;
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const updatePlayIcon = () => {
        if (!audio || !iconPlay || !iconPause) return;
        const playing = !audio.paused && !audio.ended;
        iconPlay.style.display = playing ? 'none' : '';
        iconPause.style.display = playing ? '' : 'none';
    };

    const updateLoopUI = () => {
        if (!btnLoop || !audio) return;
        btnLoop.dataset.active = audio.loop ? 'true' : 'false';
        btnLoop.setAttribute('aria-label', audio.loop ? 'Loop on' : 'Loop off');
        btnLoop.title = audio.loop ? 'Loop: On' : 'Loop: Off';
    };

    const updateMetaLabels = () => {
        if (elPl) elPl.textContent = '⋅˚₊‧⧘∘';      // no “3”, no bullet
        if (elTrack) elTrack.textContent = QUEUE[index]?.title || 'Nothing queued';
    };

    const updateTimes = () => {
        if (!audio) return;
        if (elCur) elCur.textContent = fmtTime(audio.currentTime);
        if (elDur) elDur.textContent = fmtTime(audio.duration);
    };

    // --- core ---
    function load(i, autoplay = false) {
        if (!audio || !QUEUE.length) return;
        index = Math.max(0, Math.min(i, QUEUE.length - 1));
        const t = QUEUE[index];

        // set cover
        if (elCover) {
            if (t.cover) { elCover.src = t.cover; elCover.hidden = false; }
            else { elCover.hidden = true; }
        }

        // loop per track (default false unless track.loop true)
        audio.loop = !!t.loop;

        audio.src = t.url;
        audio.preload = 'metadata';

        updateMetaLabels();
        updateLoopUI();
        // reset time UI immediately
        if (elCur) elCur.textContent = '0:00';
        if (elDur) elDur.textContent = '0:00';

        if (autoplay) audio.play().catch(() => { });
    }

    function togglePlay() {
        if (!audio || !QUEUE.length) return;
        if (!audio.src) { load(index || 0, true); return; }
        (audio.paused ? audio.play() : audio.pause()).catch(() => { });
    }

    // --- events (single block) ---
    function onEnded() { updatePlayIcon(); /* if (!audio.loop) next(); */ }
    function onPlay() { updateMetaLabels(); updatePlayIcon(); }
    function onPause() { updateMetaLabels(); updatePlayIcon(); }
    function onError() { console.warn('Audio error – skipping', QUEUE[index]); }
    function onMeta() { updateTimes(); }       // duration available
    function onTick() { updateTimes(); }       // progress

    if (audio) {
        audio.addEventListener('ended', onEnded);
        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);
        audio.addEventListener('error', onError);
        audio.addEventListener('loadedmetadata', onMeta);
        audio.addEventListener('timeupdate', onTick);
    }

    // buttons
    btnPlay?.addEventListener('click', togglePlay);
    btnLoop?.addEventListener('click', () => { if (audio) { audio.loop = !audio.loop; updateLoopUI(); } });

    // --- boot ---
    if (QUEUE.length) load(0, false); else updateMetaLabels();
})();
