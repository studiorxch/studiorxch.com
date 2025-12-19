<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>The Reading Room — Ambient Focus</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=IBM+Plex+Mono:wght@300;400&display=swap" rel="stylesheet" />
    <style>
      :root {
        --text: #e8eaed;
        --muted: #aab1bb;
        --accent: #8b5cf6;
        --bg1: hsl(250 42% 10%);
        --bg2: hsl(274 45% 14%);
        --bg3: hsl(298 42% 11%);
        --bg4: hsl(322 48% 13%);
        --glass-bg: rgba(10,12,16,0.55);
        --glass-brd: rgba(255,255,255,0.12);
      }
    html,body{height:100%}
    body{
      margin:0;color:var(--text);font-family:Inter,system-ui,sans-serif;
      background:
        radial-gradient(80vmax 80vmax at 15% 85%, rgba(255,255,255,.05), transparent 60%),
        linear-gradient(-45deg,var(--bg1),var(--bg2),var(--bg3),var(--bg4));
      background-size:100% 100%, 400% 400%;
      animation:gradientShift 24s ease-in-out infinite;
    }
    @keyframes gradientShift{0%{background-position:0% 50%,0% 50%}50%{background-position:0% 50%,100% 50%}100%{background-position:0% 50%,0% 50%}}
.container{max-width:1080px;margin:0 auto;padding:4rem 1.25rem 7.5rem}
    header{display:flex;align-items:center;justify-content:space-between;gap:1rem}
    header h1{margin:0 0 0 .5rem;font-weight:600}
    header .sub{color:var(--muted);font-size:.95rem;margin:.25rem 0 0 .5rem;line-height:1.5;letter-spacing:.02em}
.controls{display:flex;gap:.5rem;flex-wrap:wrap}
    .btn{display:inline-flex;align-items:center;gap:.55rem;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.03);color:var(--text);padding:.55rem .8rem;border-radius:999px;cursor:pointer;transition:background .15s,transform .12s}
    .btn:hover{background:rgba(255,255,255,.08);transform:translateY(-1px)}
    .btn[aria-pressed="true"]{background:rgba(139,92,246,.18);border-color:rgba(139,92,246,.35)}
    .btn.primary{background:var(--accent);color:#0b0d12;border-color:var(--accent)}
/* Quote stage */
    .grid{margin-top:2rem;display:grid;grid-template-columns:1fr;gap:2rem}
    #quoteStage{position:relative;min-height:48vh;display:grid;place-items:center}
    .quote-text{text-align:center;font-size:clamp(1.6rem,1.2rem + 2.2vw,3rem);line-height:1.3}
    .quote-meta{display:flex;justify-content:center;align-items:center;gap:.75rem;margin-top:1rem}
    .muted{color:var(--muted)}
/* Album header (small) */
    .album-mini {display:flex;align-items:center;gap:.75rem;margin:.5rem 0 0 .5rem}
    .album-mini img{width:40px;height:40px;border-radius:8px;object-fit:cover;box-shadow:0 3px 18px rgba(0,0,0,.35);cursor:pointer;transition:transform .15s}
    .album-mini img:hover{transform:scale(1.03)}
    #album-title{font-weight:600;letter-spacing:.02em}
/* Bottom Dock */
    .dock{position:fixed;left:0;right:0;bottom:12px;display:flex;justify-content:center;z-index:25}
    .dock-inner{display:flex;gap:.75rem;padding:.5rem;border:1px solid var(--glass-brd);background:var(--glass-bg);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-radius:18px;box-shadow:0 8px 30px rgba(0,0,0,.35)}
    .dock button{background:transparent;border:0;padding:0;cursor:pointer}
    .dock img{width:56px;height:56px;border-radius:12px;object-fit:cover;opacity:.92;transition:transform .15s,opacity .15s,box-shadow .15s}
    .dock img:hover{transform:translateY(-2px);opacity:1;box-shadow:0 6px 20px rgba(0,0,0,.35)}
    .dock img.active{outline:2px solid var(--accent);outline-offset:2px}
 /* Timer bar + big timer */
    #countdown-wrap{position:fixed;left:0;right:0;bottom:0;height:8px;background:rgba(255,255,255,.06)}
    #countdown-bar{height:100%;width:0%;background:var(--accent);transition:width 1s linear}
    #bigTimer{position:fixed;top:20px;right:28px;font-family:"IBM Plex Mono",ui-monospace,monospace;font-weight:300;font-size:3.25rem;letter-spacing:.02em;display:none;z-index:20}
/* Fullscreen overlay (used only as hint + exit button) */
    #fs-overlay{position:fixed;inset:0;display:none;place-items:center;text-align:center;padding:2rem;z-index:15}
    #fs-overlay.active{display:grid}
    .fs-card{max-width:720px;background:rgba(0,0,0,.2);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);border:1px solid var(--glass-brd);border-radius:16px;padding:2rem;animation:fadeIn .4s ease}
    @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
    .faded{opacity:.07;pointer-events:none;filter:blur(1px);transition:opacity .35s, filter .35s}
/* Lightbox modal for album cover */
    .lightbox{position:fixed;inset:0;display:none;place-items:center;z-index:30}
    .lightbox.active{display:grid}
    .lb-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.6);opacity:0;transition:opacity .25s}
    .lightbox.active .lb-backdrop{opacity:1}
    .lb-card{position:relative;border:1px solid var(--glass-brd);background:var(--glass-bg);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-radius:20px;padding:14px;box-shadow:0 12px 40px rgba(0,0,0,.5);transform:translateY(8px);opacity:0;transition:opacity .25s, transform .25s}
    .lightbox.active .lb-card{opacity:1;transform:translateY(0)}
    .lb-card img{max-width:min(72vw,520px);max-height:min(72vh,520px);border-radius:14px;display:block}
    .lb-title{margin:.6rem 2px 0;font-weight:600;text-align:center}
    .lb-close{position:absolute;top:10px;right:12px;border:0;background:rgba(255,255,255,.08);color:var(--text);border:1px solid var(--glass-brd);border-radius:999px;padding:.35rem .55rem;cursor:pointer}

    footer{height:48vh}

  </style>

  </head>
  <body>
    <div class="container" id="top">
      <header>
        <div>
          <h1>The Reading&nbsp;Room</h1>
          <div class="sub">In the right mood, music becomes ink’s echo.</div>
          <div class="album-mini">
            <img id="album-thumb" alt="Album cover" />
            <div id="album-title">—</div>
          </div>
        </div>
        <div class="controls" aria-label="Controls">
          <button id="focusBtn" class="btn primary" title="Focus mode">
            <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M4 4h6v2H6v4H4V4m10 0h6v6h-2V6h-4V4M4 14h2v4h4v2H4v-6m14 0h2v6h-6v-2h4v-4Z"/></svg>
            Focus
          </button>
          <button id="timerBtn" class="btn" aria-pressed="false" title="Start/stop timer">
            <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M15 1H9v2h6V1m-3 4a8 8 0 1 0 .001 16.001A8 8 0 0 0 12 5m0 2a6 6 0 1 1 0 12A6 6 0 0 1 12 7m-.5 2h1v5l4 2-.5.87L11.5 14V9Z"/></svg>
            Timer
          </button>
          <button id="fsBtn" class="btn" aria-pressed="false" title="Toggle fullscreen">
            <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M4 4h6v2H6v4H4V4m10 0h6v6h-2V6h-4V4M4 14h2v4h4v2H4v-6m14 0h2v6h-6v-2h4v-4Z"/></svg>
            Fullscreen
          </button>
          <button id="audioBtn" class="btn" aria-pressed="false" title="Play / Pause">
            <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M14 3.23v17.54c0 .62-.66 1-.12.64L8 17H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h4l5.88-4.41C13.34 2.23 14 2.61 14 3.23M19 12a3 3 0 0 1-3 3v-6a3 3 0 0 1 3 3Z"/></svg>
            Audio
          </button>
        </div>
      </header>

  <section class="grid" id="mainGrid">
    <div id="quoteStage" class="quote-card">
      <div class="quote-text" id="quoteText">Some loops don’t distract — they draw you further into the page.</div>
      <div class="quote-meta">
        <div class="muted" id="quoteSource">— Reading Room</div>
        <div class="muted" id="quoteIndex">1/1</div>
      </div>
    </div>
  </section>

  </div>

  <!-- Big timer & progress -->
  <div id="bigTimer">30:00</div>
  <div id="countdown-wrap" aria-hidden="true" role="progressbar" aria-valuemin="0" aria-valuemax="1800" aria-valuenow="0"><div id="countdown-bar"></div></div>

  <!-- Fullscreen minimal overlay -->
  <div id="fs-overlay" aria-live="polite">
    <div class="fs-card" id="fsCard">
      <h2 id="fsTitle" style="margin:.2rem 0 .5rem">Create less distraction.</h2>
      <p id="fsBody" class="muted" style="margin:0 0 1rem">Just read. Your session begins now…</p>
      <div class="row" style="display:flex;justify-content:center;gap:.75rem">
        <button class="btn" id="exitFs">Exit</button>
      </div>
    </div>
  </div>

  <!-- Lightbox for album cover -->
  <div class="lightbox" id="coverModal" aria-hidden="true">
    <div class="lb-backdrop" id="lbBackdrop"></div>
    <div class="lb-card" role="dialog" aria-label="Album cover">
      <button class="lb-close" id="lbClose">✕</button>
      <img id="coverLarge" alt="Album cover large" />
      <div class="lb-title" id="coverTitle"></div>
    </div>
  </div>

  <!-- Bottom Dock with collections -->
  <div class="dock" id="dock">
    <div class="dock-inner" id="dockInner"><!-- buttons injected --></div>
  </div>

<audio id="bgMusic" preload="none" loop></audio>

  <script>
    // ---------- Collections (album = quotes + cover + audio)
    const COLLECTION_META = {
      'ghost-shelves':   { title: 'Ghost Shelves' },
      'desk-light-loop': { title: 'Desk Light Loop' },
      'stacks-at-dusk':  { title: 'Stacks at Dusk' }
    };
    const COLLECTION_KEYS = Object.keys(COLLECTION_META);
    function assetsFor(key){
      return {
        key,
        title: COLLECTION_META[key].title,
        cover: `/assets/covers/${key}.webp`,
        audio: `/assets/audio/${key}.mp3`,
        quotes: `/assets/quotes/${key}.json`
      }
    }

    // ---------- Utilities
    const $ = (sel) => document.querySelector(sel);
    const params = new URLSearchParams(location.search);
    function setParam(k, v){ params.set(k, v); history.replaceState(null, '', '?' + params.toString()); }
    function fmt(s){ const m = Math.floor(s/60), sec=s%60; return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}` }

    // ---------- State
    const state = {
      collection: params.get('c') && COLLECTION_META[params.get('c')] ? params.get('c') : 'stacks-at-dusk',
      music: false,
      timer: false,
      fullscreen: false,
      durationMin: parseInt(params.get('duration') || '30', 10),
      secondsLeft: 0,
      rotateMs: parseInt(params.get('interval') || '12', 10) * 60 * 1000
    };

    // ---------- Elements
    const albumThumb = $('#album-thumb');
    const albumTitle = $('#album-title');
    const quoteText = $('#quoteText');
    const quoteSource = $('#quoteSource');
    const quoteIndexEl = $('#quoteIndex');
    const musicEl = $('#bgMusic');
    const bigTimer = $('#bigTimer');
    const barWrap = $('#countdown-wrap');
    const bar = $('#countdown-bar');
    const fsOverlay = $('#fs-overlay');
    const mainGrid = $('#mainGrid');
    const focusBtn = $('#focusBtn');
    const timerBtn = $('#timerBtn');
    const fsBtn = $('#fsBtn');
    const audioBtn = $('#audioBtn');
    const exitFsBtn = $('#exitFs');

    // Lightbox
    const coverModal = $('#coverModal');
    const coverLarge = $('#coverLarge');
    const coverTitle = $('#coverTitle');
    const lbBackdrop = $('#lbBackdrop');
    const lbClose = $('#lbClose');

    // Quotes
    let QUOTES = [];
    let qIndex = 0;
    let rotateInt = null;

    // ---------- Build Dock
    function buildDock(){
      const wrap = document.getElementById('dockInner');
      wrap.innerHTML = '';
      COLLECTION_KEYS.forEach((k)=>{
        const a = assetsFor(k);
        const btn = document.createElement('button');
        btn.setAttribute('aria-label', a.title);
        btn.innerHTML = `<img data-key="${k}" src="${a.cover}" alt="${a.title} cover" />`;
        btn.addEventListener('click', ()=> switchCollection(k));
        wrap.appendChild(btn);
      });
      highlightActiveThumb();
    }
    function highlightActiveThumb(){
      document.querySelectorAll('.dock img').forEach(img=>{
        img.classList.toggle('active', img.dataset.key === state.collection);
      });
    }

    // ---------- Load / Switch Collection
    async function switchCollection(key){
      if(!COLLECTION_META[key]) return;
      state.collection = key;
      setParam('c', key);
      highlightActiveThumb();
      await loadCollection();
    }

    async function loadCollection(){
      const a = assetsFor(state.collection);
      // Update mini header
      crossfadeImg(albumThumb, a.cover);
      albumTitle.textContent = a.title;
      albumThumb.onclick = openCoverModal;

      // Set up lightbox content
      coverLarge.src = a.cover;
      coverTitle.textContent = a.title;

      // Load quotes for the album
      QUOTES = [];
      try{
        const res = await fetch(a.quotes, {cache:'no-store'});
        if(res.ok){ QUOTES = await res.json(); }
      }catch(e){}
      if(!Array.isArray(QUOTES) || !QUOTES.length){ QUOTES = [{t:'(No quotes found.)', s:a.title}]; }
      qIndex = 0;
      renderQuote();

      // Swap audio with gentle fade
      await crossfadeAudio(a.audio, 350);
    }

    // ---------- Quote Render
    function renderQuote(){
      const q = QUOTES[qIndex];
      if(!q) return;
      quoteText.textContent = q.t;
      quoteSource.textContent = '— ' + q.s;
      quoteIndexEl.textContent = `${qIndex+1}/${QUOTES.length}`;
      // color tint by index
      const h = [250,210,180,320,140,30,12,196][qIndex % 8];
      document.documentElement.style.setProperty('--bg1', `hsl(${h} 48% 12%)`);
      document.documentElement.style.setProperty('--bg2', `hsl(${(h+24)%360} 52% 16%)`);
      document.documentElement.style.setProperty('--bg3', `hsl(${(h+48)%360} 46% 13%)`);
      document.documentElement.style.setProperty('--bg4', `hsl(${(h+72)%360} 50% 15%)`);
    }
    function nextQuote(){ qIndex = (qIndex+1)%QUOTES.length; renderQuote(); }
    function prevQuote(){ qIndex = (qIndex-1+QUOTES.length)%QUOTES.length; renderQuote(); }

    // ---------- Media helpers
    function crossfadeImg(imgEl, newSrc){
      const img = new Image();
      img.onload = () => {
        const clone = imgEl.cloneNode(true);
        clone.src = imgEl.src; // old
        clone.style.position = 'absolute';
        clone.style.inset = 'auto';
        clone.style.width = imgEl.offsetWidth + 'px';
        clone.style.height = imgEl.offsetHeight + 'px';
        clone.style.transition = 'opacity .25s';
        clone.style.opacity = '1';
        imgEl.parentElement.style.position = 'relative';
        imgEl.parentElement.appendChild(clone);
        requestAnimationFrame(()=>{ clone.style.opacity = '0'; });
        setTimeout(()=> clone.remove(), 260);
        imgEl.src = newSrc;
      };
      img.src = newSrc;
    }

    async function crossfadeAudio(newSrc, ms=300){
      // fade out
      await fadeAudioTo(0, ms);
      musicEl.src = newSrc;
      try { await musicEl.play(); } catch(e) {}
      // fade in
      await fadeAudioTo(1, ms);
    }
    function fadeAudioTo(target, ms){
      return new Promise(resolve=>{
        const start = musicEl.volume;
        const diff = target - start;
        const dur = Math.max(60, ms);
        const steps = Math.ceil(dur/30);
        let i=0;
        const int = setInterval(()=>{
          i++;
          musicEl.volume = Math.max(0, Math.min(1, start + diff * (i/steps)));
          if(i>=steps){ clearInterval(int); resolve(); }
        }, 30);
      });
    }

    // ---------- Timer
    let timerInt = null;
    function setDuration(mins){ state.durationMin = mins; setParam('duration', String(mins)); if(!state.timer) bigTimer.textContent = fmt(mins*60); }
    function updateBar(){ const total = state.durationMin*60; const pct = Math.min(100, ((total - state.secondsLeft)/total)*100); bar.style.width = pct+'%'; barWrap.setAttribute('aria-valuenow', total - state.secondsLeft); }
    function startTimer(){ if(state.timer) return; state.timer = true; timerBtn.setAttribute('aria-pressed','true'); barWrap.setAttribute('aria-hidden','false'); state.secondsLeft = state.durationMin*60; bigTimer.style.display='block'; clearInterval(timerInt); timerInt=setInterval(()=>{ bigTimer.textContent = fmt(state.secondsLeft); updateBar(); state.secondsLeft--; if(state.secondsLeft < 0){ clearInterval(timerInt); state.timer=false; timerBtn.setAttribute('aria-pressed','false'); } }, 1000); }
    function stopTimer(){ state.timer=false; timerBtn.setAttribute('aria-pressed','false'); clearInterval(timerInt); bar.style.width='0%'; barWrap.setAttribute('aria-hidden','true'); bigTimer.style.display='none'; }

    // ---------- Fullscreen + Audio toggles
    async function enterFs(){ if(!document.fullscreenElement){ try{ await document.documentElement.requestFullscreen(); }catch(e){} } state.fullscreen=true; fsBtn.setAttribute('aria-pressed','true'); fsOverlay.classList.add('active'); fadeNonessential(true); }
    async function exitFs(){ if(document.fullscreenElement){ try{ await document.exitFullscreen(); }catch(e){} } state.fullscreen=false; fsBtn.setAttribute('aria-pressed','false'); fsOverlay.classList.remove('active'); fadeNonessential(false); }
    function fadeNonessential(v){ const hdr=document.querySelector('#top header'); if(v){ mainGrid.classList.add('faded'); hdr.classList.add('faded'); } else { mainGrid.classList.remove('faded'); hdr.classList.remove('faded'); } }
    async function playAudio(){ try{ await musicEl.play(); state.music=true; audioBtn.setAttribute('aria-pressed','true'); }catch(e){} }
    function pauseAudio(){ musicEl.pause(); state.music=false; audioBtn.setAttribute('aria-pressed','false'); }
    async function focusMode(){ await enterFs(); setDuration(state.durationMin); startTimer(); await playAudio(); }

    // ---------- Lightbox
    function openCoverModal(){ coverModal.classList.add('active'); }
    function closeCoverModal(){ coverModal.classList.remove('active'); }

    // ---------- Init
    (async function init(){
      buildDock();
      setDuration(state.durationMin);
      await loadCollection();

      // Autostart options
      if(params.get('autostart')==='1') focusMode();

      // Events
      document.addEventListener('keydown', (e)=>{
        if(e.key==='ArrowRight') nextQuote();
        if(e.key==='ArrowLeft') prevQuote();
        if(e.key==='f' || e.key==='F') (state.fullscreen ? exitFs() : enterFs());
        if(e.key==='t' || e.key==='T') (state.timer ? stopTimer() : startTimer());
        if(e.key==='m' || e.key==='M') (state.music ? pauseAudio() : playAudio());
        if(e.key==='Escape'){ if(coverModal.classList.contains('active')) closeCoverModal(); else exitFs(); }
      });
      focusBtn.addEventListener('click', focusMode);
      timerBtn.addEventListener('click', ()=> state.timer ? stopTimer() : startTimer());
      fsBtn.addEventListener('click', ()=> state.fullscreen ? exitFs() : enterFs());
      audioBtn.addEventListener('click', ()=> state.music ? pauseAudio() : playAudio());
      exitFsBtn.addEventListener('click', exitFs);
      lbBackdrop.addEventListener('click', closeCoverModal);
      lbClose.addEventListener('click', closeCoverModal);
    })();
  </script>

  </body>
</html>
