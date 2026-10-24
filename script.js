/* ==========================================================
   Lo-fi Late Night — player logic (vanilla JS)
   ========================================================== */

/* ----------------------------------------------------------
   1. PLAYLIST
   Replace any entry below with your own songs.
   - src:      URL to an mp3 file (royalty-free)
   - cover:    URL to a square image
   - duration: shown in the playlist before metadata loads
   ---------------------------------------------------------- */
const songs = [
  {
    title: "Midnight Static",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/lofi-night/300",
    duration: "6:12",
  },
  {
    title: "Rooftop Rain",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/lofi-rain/300",
    duration: "7:05",
  },
  {
    title: "Cassette Dreams",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/lofi-tape/300",
    duration: "5:44",
  },
  {
    title: "Neon Window",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    cover: "https://picsum.photos/seed/lofi-neon/300",
    duration: "5:02",
  },
  {
    title: "Last Train Home",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    cover: "https://picsum.photos/seed/lofi-train/300",
    duration: "5:53",
  },
];

/* ----------------------------------------------------------
   2. DOM REFERENCES
   ---------------------------------------------------------- */
const $ = (id) => document.getElementById(id);
const audio = $("audio");
const vinyl = $("vinyl");
const tonearm = $("tonearm");
const coverEl = $("cover");
const titleEl = $("title");
const artistEl = $("artist");
const currentEl = $("current");
const durationEl = $("duration");
const progress = $("progress");
const progressFill = $("progressFill");
const progressThumb = $("progressThumb");
const playBtn = $("playBtn");
const playIcon = $("playIcon");
const pauseIcon = $("pauseIcon");
const prevBtn = $("prevBtn");
const nextBtn = $("nextBtn");
const shuffleBtn = $("shuffleBtn");
const repeatBtn = $("repeatBtn");
const muteBtn = $("muteBtn");
const volIcon = $("volIcon");
const muteIcon = $("muteIcon");
const volumeSlider = $("volume");
const playlistEl = $("playlist");

/* ----------------------------------------------------------
   3. STATE
   ---------------------------------------------------------- */
let currentIndex = 0;
let isShuffle = false;
let repeatMode = "off";       // "off" | "all" | "one"
let lastVolume = 0.7;         // remembered for unmute

/* ----------------------------------------------------------
   4. HELPERS
   ---------------------------------------------------------- */
// Seconds -> "m:ss"
function formatTime(sec) {
  if (!isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/* ----------------------------------------------------------
   5. PLAYLIST RENDERING
   ---------------------------------------------------------- */
function renderPlaylist() {
  playlistEl.innerHTML = "";
  songs.forEach((song, i) => {
    const li = document.createElement("li");
    li.className = "track";
    li.dataset.index = i;
    li.innerHTML = `
      <img src="${song.cover}" alt="" loading="lazy" />
      <div style="min-width:0">
        <div class="track-title">${song.title}<span class="eq"><i></i><i></i><i></i></span></div>
        <div class="track-artist">${song.artist}</div>
      </div>
      <span class="track-time">${song.duration}</span>`;
    // Click a track to play it
    li.addEventListener("click", () => {
      loadSong(i);
      play();
    });
    playlistEl.appendChild(li);
  });
}

// Highlight the active track in the playlist
function highlightActive() {
  document.querySelectorAll(".track").forEach((el) => {
    el.classList.toggle("active", Number(el.dataset.index) === currentIndex);
  });
}

/* ----------------------------------------------------------
   6. LOADING & PLAYBACK
   ---------------------------------------------------------- */
function loadSong(index) {
  currentIndex = index;
  const song = songs[index];
  audio.src = song.src;
  coverEl.src = song.cover;
  titleEl.textContent = song.title;
  artistEl.textContent = song.artist;
  durationEl.textContent = song.duration;
  currentEl.textContent = "0:00";
  setProgress(0);
  highlightActive();
}

function play() {
  audio.play().catch(() => {}); // ignore autoplay-policy rejections
}

function pause() {
  audio.pause();
}

function togglePlay() {
  audio.paused ? play() : pause();
}

// Sync UI (icon, vinyl spin, tonearm) with real audio state
function updatePlayingUI(playing) {
  playIcon.hidden = playing;
  pauseIcon.hidden = !playing;
  playBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
  vinyl.classList.toggle("playing", playing);
  tonearm.classList.toggle("on", playing);
  document.body.classList.toggle("is-playing", playing);
}

// Pick a random different index for shuffle
function randomIndex() {
  if (songs.length < 2) return 0;
  let i;
  do { i = Math.floor(Math.random() * songs.length); } while (i === currentIndex);
  return i;
}

function next() {
  const i = isShuffle ? randomIndex() : (currentIndex + 1) % songs.length;
  loadSong(i);
  play();
}

function prev() {
  // If more than 3s in, restart the current song (like most players)
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  const i = isShuffle ? randomIndex() : (currentIndex - 1 + songs.length) % songs.length;
  loadSong(i);
  play();
}

// When a song ends: repeat one, autoplay next, or stop at end
function handleEnded() {
  if (repeatMode === "one") {
    audio.currentTime = 0;
    play();
  } else if (!isShuffle && repeatMode === "off" && currentIndex === songs.length - 1) {
    loadSong(0); // back to start, stopped
  } else {
    next();
  }
}

/* ----------------------------------------------------------
   7. PROGRESS BAR (seek)
   ---------------------------------------------------------- */
function setProgress(ratio) {
  const pct = `${Math.min(Math.max(ratio, 0), 1) * 100}%`;
  progressFill.style.width = pct;
  progressThumb.style.left = pct;
}

function seekFromEvent(e) {
  const rect = progress.getBoundingClientRect();
  const ratio = (e.clientX - rect.left) / rect.width;
  if (isFinite(audio.duration)) {
    audio.currentTime = Math.min(Math.max(ratio, 0), 1) * audio.duration;
  }
}

// Click or drag to seek
let dragging = false;
progress.addEventListener("pointerdown", (e) => {
  dragging = true;
  progress.setPointerCapture(e.pointerId);
  seekFromEvent(e);
});
progress.addEventListener("pointermove", (e) => dragging && seekFromEvent(e));
progress.addEventListener("pointerup", () => (dragging = false));

/* ----------------------------------------------------------
   8. VOLUME & MUTE
   ---------------------------------------------------------- */
function setVolume(v) {
  v = Math.min(Math.max(v, 0), 1);
  audio.volume = v;
  audio.muted = v === 0;
  volumeSlider.value = v;
  volumeSlider.style.setProperty("--val", `${v * 100}%`);
  if (v > 0) lastVolume = v;
  updateMuteIcon();
}

function updateMuteIcon() {
  const muted = audio.muted || audio.volume === 0;
  volIcon.hidden = muted;
  muteIcon.hidden = !muted;
}

function toggleMute() {
  if (audio.muted || audio.volume === 0) setVolume(lastVolume || 0.7);
  else {
    audio.muted = true;
    volumeSlider.value = 0;
    volumeSlider.style.setProperty("--val", "0%");
    updateMuteIcon();
  }
}

/* ----------------------------------------------------------
   9. EVENT LISTENERS
   ---------------------------------------------------------- */
playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", next);
prevBtn.addEventListener("click", prev);

shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);
});

// Repeat cycles: off -> all -> one -> off
repeatBtn.addEventListener("click", () => {
  repeatMode = repeatMode === "off" ? "all" : repeatMode === "all" ? "one" : "off";
  repeatBtn.classList.toggle("active", repeatMode !== "off");
  repeatBtn.classList.toggle("one", repeatMode === "one");
  repeatBtn.title = `Repeat: ${repeatMode}`;
});

muteBtn.addEventListener("click", toggleMute);
volumeSlider.addEventListener("input", (e) => setVolume(parseFloat(e.target.value)));

// Audio element events keep the UI in sync
audio.addEventListener("play", () => updatePlayingUI(true));
audio.addEventListener("pause", () => updatePlayingUI(false));
audio.addEventListener("ended", handleEnded);
audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});
audio.addEventListener("timeupdate", () => {
  currentEl.textContent = formatTime(audio.currentTime);
  if (isFinite(audio.duration)) setProgress(audio.currentTime / audio.duration);
});

/* ----------------------------------------------------------
   10. KEYBOARD SHORTCUTS
   Space: play/pause · ←/→: prev/next · ↑/↓: volume
   ---------------------------------------------------------- */
document.addEventListener("keydown", (e) => {
  // Don't hijack keys while typing in inputs (except our range slider)
  const tag = e.target.tagName;
  if (tag === "TEXTAREA" || (tag === "INPUT" && e.target.type !== "range")) return;

  switch (e.code) {
    case "Space":
      e.preventDefault();
      togglePlay();
      break;
    case "ArrowRight":
      e.preventDefault();
      next();
      break;
    case "ArrowLeft":
      e.preventDefault();
      prev();
      break;
    case "ArrowUp":
      e.preventDefault();
      setVolume((audio.muted ? 0 : audio.volume) + 0.05);
      break;
    case "ArrowDown":
      e.preventDefault();
      setVolume((audio.muted ? 0 : audio.volume) - 0.05);
      break;
  }
});

/* ----------------------------------------------------------
   11. INIT
   ---------------------------------------------------------- */
renderPlaylist();
loadSong(0);
setVolume(0.7);
