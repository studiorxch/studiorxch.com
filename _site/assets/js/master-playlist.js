/**
 * StudioRich Master Playlist (v1)
 * - Local, user-controlled playlist that can collect from any slide/playlist.
 * - No login required (localStorage). Future: account sync.
 *
 * Storage keys
 * - sr.masterPlaylist.v1
 * - sr.userPlaylists.v1  (named lists the user creates)
 */

(function () {
  const MASTER_KEY = "sr.masterPlaylist.v1";
  const USER_LISTS_KEY = "sr.userPlaylists.v1";

  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

  function loadMaster() {
    try {
      return JSON.parse(localStorage.getItem(MASTER_KEY)) || {
        name: "Master Playlist",
        tracks: [],
        updatedAt: Date.now(),
        version: 1,
        sources: [] // [{id, title, type}]
      };
    } catch (_) {
      return { name: "Master Playlist", tracks: [], updatedAt: Date.now(), version: 1, sources: [] };
    }
  }

  function saveMaster(state) {
    state.updatedAt = Date.now();
    localStorage.setItem(MASTER_KEY, JSON.stringify(state));
    document.dispatchEvent(new CustomEvent("sr:master:updated", { detail: state }));
    return state;
  }

  // util: deterministic id for a track to avoid dupes
  function trackId(track) {
    return (track.file || track.link || track.title || "").toLowerCase();
  }

  function hasTrack(state, t) {
    const id = trackId(t);
    return state.tracks.some(x => trackId(x) === id);
  }

  function addTracksToMaster(tracks, options={mode:"append"}) {
    const state = loadMaster();
    const incoming = Array.isArray(tracks) ? tracks : [];
    if (options.mode === "replace") state.tracks = [];
    for (const t of incoming) {
      if (!hasTrack(state, t)) state.tracks.push(t);
    }
    return saveMaster(state);
  }

  async function addPlaylistRefToMaster(url, options={mode:"append"}) {
    const res = await fetch(url, { credentials: "same-origin" });
    if (!res.ok) throw new Error("Playlist fetch failed: " + res.status);
    const pl = await res.json();
    const state = loadMaster();
    addTracksToMaster(pl.tracks || [], options);
    // record source
    const s = { id: pl.id || url, title: pl.title || "Untitled", type: (pl.source && pl.source.type) || "capsule" };
    if (!state.sources.some(x => x.id === s.id)) state.sources.push(s);
    saveMaster(state);
    return state;
  }

  // Reordering
  function moveTrack(oldIndex, newIndex) {
    const state = loadMaster();
    if (oldIndex < 0 || newIndex < 0 || oldIndex >= state.tracks.length || newIndex >= state.tracks.length) return state;
    const [item] = state.tracks.splice(oldIndex, 1);
    state.tracks.splice(newIndex, 0, item);
    return saveMaster(state);
  }

  function removeTrack(index) {
    const state = loadMaster();
    state.tracks.splice(index, 1);
    return saveMaster(state);
  }

  // Export / Import (share via URL)
  function exportMasterToParam() {
    const state = loadMaster();
    const payload = btoa(unescape(encodeURIComponent(JSON.stringify(state.tracks))));
    const url = new URL(window.location.href);
    url.pathname = "/playlist/";
    url.searchParams.set("p", payload);
    return url.toString();
  }

  function importFromParam() {
    const url = new URL(window.location.href);
    const p = url.searchParams.get("p");
    if (!p) return null;
    try {
      const json = JSON.parse(decodeURIComponent(escape(atob(p))));
      addTracksToMaster(json, { mode: "append" });
      return json.length;
    } catch (e) {
      console.warn("Import failed", e);
      return null;
    }
  }

  // UI hooks (buttons with data attributes)
  function wireButtons() {
    $$("[data-add-playlist-ref]").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        const ref = btn.getAttribute("data-add-playlist-ref");
        btn.disabled = true;
        try {
          await addPlaylistRefToMaster(ref, { mode: btn.dataset.mode || "append" });
          btn.innerText = "Added ✓";
          setTimeout(() => (btn.innerText = btn.dataset.label || "Add to Master"), 1200);
        } catch (err) {
          console.error(err);
          btn.innerText = "Error";
        } finally {
          btn.disabled = false;
        }
      });
    });

    $$("[data-export-master]").forEach(btn => {
      btn.addEventListener("click", () => {
        const url = exportMasterToParam();
        navigator.clipboard.writeText(url).then(() => {
          btn.innerText = "Link Copied ✓";
          setTimeout(() => (btn.innerText = "Share Master Playlist"), 1200);
        });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    wireButtons();
    // optional auto-import on /playlist/?p=...
    importFromParam();
  });

  // Expose minimal API for the site player UI
  window.SRMaster = {
    load: loadMaster,
    addTracks: addTracksToMaster,
    addPlaylistRef: addPlaylistRefToMaster,
    moveTrack, removeTrack,
    export: exportMasterToParam
  };
})();
