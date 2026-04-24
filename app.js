// ════════════════════════════════════════════════
//  EV Dashboard — Interactive Prototype
//  Screens mapped from Figma HCI Prototype Page 3
// ════════════════════════════════════════════════

// ─── DOM refs ───
const dashboardImage   = document.getElementById("dashboardImage");
const hotspotsLayer    = document.getElementById("hotspots");
const hint             = document.getElementById("hint");
const clockTimeEl      = document.getElementById("clockTime");
const clockDateEl      = document.getElementById("clockDate");
const gearOverlay      = document.getElementById("gearOverlay");
const volumeOverlay    = document.getElementById("volumeOverlay");
const volFill          = document.getElementById("volFill");
const volPct           = document.getElementById("volPct");
const modeOverlay      = document.getElementById("modeOverlay");
const modeValue        = document.getElementById("modeValue");
const brightOverlay    = document.getElementById("brightOverlay");
const brightFill       = document.getElementById("brightFill");
const brightPct        = document.getElementById("brightPct");

// ─── State ───
let currentScreen  = "home";
let volumeLevel    = 50;   // 0-100
let brightness     = 70;   // 0-100
let drivingMode    = "NORMAL";
let currentGear    = "D";
let debugHotspots  = false;

// ─── Screen definitions ─────────────────────────────────────────────
// Hotspot coords are % of image width/height.
// Positions for auto-feature screen derived from Figma Page 3 (1565×1080 frame).
// ────────────────────────────────────────────────────────────────────
const screens = {

  // ── Home default ──────────────────────────────────────────────────
  home: {
    image: "./assets/home-default.png",
    hint: "Home  •  Tap any control to navigate",
    overlays: ["gear"],
    hotspots: [
      { label: "Open Menu",        target: "menu",         top:  2.8, left:  1.8, w:  6.0, h:  8.6 },
      { label: "Settings",         target: "settingsDark", top: 10.8, left:  1.8, w:  6.0, h:  8.6 },
      { label: "Search",           target: "search",       top: 14.4, left: 44.0, w: 33.0, h:  9.0 },
      { label: "Bluetooth",        target: "bluetooth",    top:  4.6, left: 72.8, w:  6.2, h:  9.0 },
      { label: "Voice Command",    target: "voice",        top:  4.6, left: 79.0, w:  7.0, h:  9.0 },
      { label: "Maps",             target: "maps",         top:  4.6, left: 86.0, w:  7.0, h:  9.0 },
      { label: "Reverse Camera",   target: "camera",       top: 27.0, left: 64.0, w: 33.0, h: 44.0 },
      { label: "Music Control",    target: "music",        top: 78.0, left: 39.0, w: 23.0, h: 17.0 },
      { label: "Nearby Charging",  target: "charging",     top: 72.0, left: 62.0, w: 16.0, h: 20.0 },
      { label: "Safety Alert",     target: "safety",       top: 72.0, left: 78.0, w: 16.0, h: 20.0 },
    ],
  },

  // ── Menu (home-menu.png — sidebar beginning to slide in) ──────────
  menu: {
    image: "./assets/home-menu.png",
    hint: "Menu open  •  Choose a feature",
    overlays: [],
    hotspots: [
      { label: "Close Menu",       target: "home",         top:  2.8, left:  1.8, w:  6.0, h:  8.6 },
      { label: "Auto Features",    target: "autoFeature",  top:  2.8, left:  8.0, w: 14.0, h:  8.6 },
      { label: "Settings",         target: "settingsDark", top: 10.8, left:  1.8, w:  6.0, h:  8.6 },
      { label: "Bluetooth",        target: "bluetooth",    top:  4.6, left: 72.8, w:  6.2, h:  9.0 },
      { label: "Voice Command",    target: "voice",        top:  4.6, left: 79.0, w:  7.0, h:  9.0 },
      { label: "Maps",             target: "maps",         top:  4.6, left: 86.0, w:  7.0, h:  9.0 },
    ],
  },

  // ── Auto-feature selection (Figma Page 3 — frame 187:516, 1565×1080)
  autoFeature: {
    image: "./assets/auto-feature.png",
    hint: "Auto Feature  •  Choose driving mode or control brightness",
    overlays: ["mode", "brightness"],
    hotspots: [
      // ── Sidebar nav (left 0-8.9%)
      { label: "Close / Home",     target: "home",         top:  2.2, left:  1.5, w:  6.0, h:  8.7 },
      { label: "Settings",         target: "settingsDark", top: 18.6, left:  2.3, w:  4.8, h:  6.9 },
      { label: "Maps",             target: "maps",         top: 33.1, left:  2.4, w:  4.5, h:  6.9 },
      { label: "Voice / Mic",      target: "voice",        top: 48.4, left:  2.2, w:  4.8, h:  6.9 },
      { label: "Bluetooth",        target: "bluetooth",    top: 65.1, left:  2.2, w:  4.5, h:  5.6 },
      { label: "Vehicle Status",   target: "home",         top: 78.6, left:  1.9, w:  5.0, h:  7.3 },

      // ── Driving modes (bottom-left panel: x=170-620, y=753-1035 / 1565×1080)
      { label: "ECO mode",         action: "modeEco",      top: 69.7, left: 10.9, w:  9.4, h: 25.9 },
      { label: "NORMAL mode",      action: "modeNormal",   top: 69.9, left: 20.6, w:  9.4, h: 25.9 },
      { label: "SPORT mode",       action: "modeSport",    top: 69.9, left: 30.3, w:  9.4, h: 25.9 },

      // ── Brightness control (frame x=643, y=870, w=455, h=189)
      { label: "Brightness +",     action: "brightUp",     top: 85.1, left: 61.6, w:  6.4, h:  8.5 },
      { label: "Brightness –",     action: "brightDown",   top: 85.1, left: 49.7, w:  8.7, h:  8.5 },

      // ── Right panel
      { label: "Search",           target: "search",       top:  2.1, left: 70.8, w: 28.2, h:  8.8 },
      { label: "Battery / Charging", target: "charging",  top: 80.6, left: 71.5, w: 27.3, h: 17.5 },
    ],
  },

  // ── Maps ──────────────────────────────────────────────────────────
  maps: {
    image: "./assets/maps-navigation.png",
    hint: "Maps Navigation  •  Tap home to go back",
    overlays: [],
    hotspots: [
      { label: "Back to Home",     target: "home",         top:  2.8, left:  1.8, w:  6.0, h:  8.6 },
      { label: "Voice Command",    target: "voice",        top:  4.6, left: 79.0, w:  7.0, h:  9.0 },
    ],
  },

  // ── Voice command ─────────────────────────────────────────────────
  voice: {
    image: "./assets/voice-command.png",
    hint: "Voice Command  •  Speak now",
    overlays: [],
    hotspots: [
      { label: "Back to Home",     target: "home",         top:  2.8, left:  1.8, w:  6.0, h:  8.6 },
      { label: "Maps",             target: "maps",         top:  4.6, left: 86.0, w:  7.0, h:  9.0 },
    ],
  },

  // ── Music control ─────────────────────────────────────────────────
  music: {
    image: "./assets/music-control.png",
    hint: "Music  •  Use +/– to adjust volume",
    overlays: ["volume"],
    hotspots: [
      { label: "Back to Home",     target: "home",         top:  2.8, left:  1.8, w:  6.0, h:  8.6 },
      { label: "Volume +",         action: "volUp",        top: 62.0, left: 56.5, w: 10.0, h: 11.5 },
      { label: "Volume –",         action: "volDown",      top: 73.0, left: 56.5, w: 10.0, h: 11.5 },
    ],
  },

  // ── Reverse camera ────────────────────────────────────────────────
  camera: {
    image: "./assets/reverse-cam.png",
    hint: "Reverse Camera  •  Gear set to R",
    overlays: [],
    hotspots: [
      { label: "Back to Home",     target: "home",         top:  2.8, left:  1.8, w:  6.0, h:  8.6 },
    ],
  },

  // ── Settings – dark theme ─────────────────────────────────────────
  settingsDark: {
    image: "./assets/home-dark.png",
    hint: "Settings  •  Dark theme active",
    overlays: ["gear"],
    hotspots: [
      { label: "Back to Home",     target: "home",         top:  2.8, left:  1.8, w:  6.0, h:  8.6 },
      { label: "Purple Theme",     target: "settingsPurple", top: 10.8, left: 1.8, w:  6.0, h:  8.6 },
    ],
  },

  // ── Settings – purple theme ───────────────────────────────────────
  settingsPurple: {
    image: "./assets/home-purple.png",
    hint: "Settings  •  Purple theme active",
    overlays: ["gear"],
    hotspots: [
      { label: "Back to Home",     target: "home",         top:  2.8, left:  1.8, w:  6.0, h:  8.6 },
      { label: "Dark Theme",       target: "settingsDark", top: 10.8, left:  1.8, w:  6.0, h:  8.6 },
    ],
  },

  // ── Search ────────────────────────────────────────────────────────
  search: {
    image: "./assets/search-function.png",
    hint: "Search",
    overlays: [],
    hotspots: [
      { label: "Back to Home",     target: "home",         top:  2.8, left:  1.8, w:  6.0, h:  8.6 },
    ],
  },

  // ── Safety alert ──────────────────────────────────────────────────
  safety: {
    image: "./assets/safety-alert.png",
    hint: "Safety Alert  •  Please review",
    overlays: [],
    hotspots: [
      { label: "Back to Home",     target: "home",         top:  2.8, left:  1.8, w:  6.0, h:  8.6 },
    ],
  },

  // ── Nearby charging ───────────────────────────────────────────────
  charging: {
    image: "./assets/nearby-charging.png",
    hint: "Nearby Charging Stations",
    overlays: [],
    hotspots: [
      { label: "Back to Home",     target: "home",         top:  2.8, left:  1.8, w:  6.0, h:  8.6 },
    ],
  },

  // ── Bluetooth ─────────────────────────────────────────────────────
  bluetooth: {
    image: "./assets/bluetooth-connect.png",
    hint: "Bluetooth Connect",
    overlays: [],
    hotspots: [
      { label: "Back to Home",     target: "home",         top:  2.8, left:  1.8, w:  6.0, h:  8.6 },
    ],
  },
};

// ─── Clock ──────────────────────────────────────────────────────────
function updateClock() {
  const now    = new Date();
  const h      = String(now.getHours()).padStart(2, "0");
  const m      = String(now.getMinutes()).padStart(2, "0");
  const days   = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  clockTimeEl.textContent = `${h}:${m}`;
  clockDateEl.textContent = `${days[now.getDay()]} | ${now.getDate()} ${months[now.getMonth()]}`;
}
setInterval(updateClock, 1000);
updateClock();

// ─── Overlay visibility ──────────────────────────────────────────────
function syncOverlays(screen) {
  const show = screen.overlays || [];
  gearOverlay.classList.toggle("hidden",    !show.includes("gear"));
  volumeOverlay.classList.toggle("hidden",  !show.includes("volume"));
  modeOverlay.classList.toggle("hidden",    !show.includes("mode"));
  brightOverlay.classList.toggle("hidden",  !show.includes("brightness"));
}

// ─── Volume helpers ───────────────────────────────────────────────────
function syncVolume() {
  volFill.style.width = `${volumeLevel}%`;
  volPct.textContent  = `${volumeLevel}%`;
}

// ─── Brightness helpers ───────────────────────────────────────────────
function syncBrightness() {
  brightFill.style.width = `${brightness}%`;
  brightPct.textContent  = `${brightness}%`;
}

// ─── Navigate to screen ───────────────────────────────────────────────
function navigateTo(key) {
  const screen = screens[key];
  if (!screen) return;

  currentScreen = key;

  // Fade out, swap, fade in
  dashboardImage.style.opacity = "0";
  setTimeout(() => {
    dashboardImage.src = screen.image;
    dashboardImage.alt = `EV dashboard — ${key}`;
    dashboardImage.style.opacity = "1";
  }, 80);

  hint.textContent = screen.hint;
  syncOverlays(screen);
  syncVolume();
  syncBrightness();
  renderHotspots(screen.hotspots);
}

// ─── Hotspot renderer ─────────────────────────────────────────────────
function renderHotspots(hotspots) {
  hotspotsLayer.innerHTML = "";

  hotspots.forEach((spot) => {
    const btn = document.createElement("button");
    btn.type      = "button";
    btn.className = "hotspot";
    btn.setAttribute("aria-label", spot.label);
    btn.setAttribute("title",      spot.label);
    btn.style.top    = `${spot.top}%`;
    btn.style.left   = `${spot.left}%`;
    btn.style.width  = `${spot.w}%`;
    btn.style.height = `${spot.h}%`;

    btn.addEventListener("click", () => handleHotspot(spot));
    hotspotsLayer.appendChild(btn);
  });
}

// ─── Hotspot action handler ───────────────────────────────────────────
function handleHotspot(spot) {
  // Navigation
  if (spot.target) {
    // Switching to R gear triggers camera
    if (spot.target === "camera") setGear("R");
    if (spot.target === "home")   { /* keep gear */ }
    navigateTo(spot.target);
    return;
  }

  // Actions
  switch (spot.action) {
    // Volume
    case "volUp":
      volumeLevel = Math.min(100, volumeLevel + 10);
      syncVolume();
      hint.textContent = `Volume  •  ${volumeLevel}%`;
      break;
    case "volDown":
      volumeLevel = Math.max(0, volumeLevel - 10);
      syncVolume();
      hint.textContent = `Volume  •  ${volumeLevel}%`;
      break;

    // Brightness
    case "brightUp":
      brightness = Math.min(100, brightness + 10);
      syncBrightness();
      hint.textContent = `Brightness  •  ${brightness}%`;
      break;
    case "brightDown":
      brightness = Math.max(10, brightness - 10);
      syncBrightness();
      hint.textContent = `Brightness  •  ${brightness}%`;
      break;

    // Driving modes
    case "modeEco":
      setMode("ECO 🌿");
      break;
    case "modeNormal":
      setMode("NORMAL ⚡");
      break;
    case "modeSport":
      setMode("SPORT 🏎");
      break;
  }
}

// ─── Mode helper ─────────────────────────────────────────────────────
function setMode(mode) {
  drivingMode = mode;
  modeValue.textContent = mode;
  hint.textContent = `Driving mode set to ${mode}`;
}

// ─── Gear selector (overlay buttons) ─────────────────────────────────
function setGear(g) {
  currentGear = g;
  document.querySelectorAll(".gear-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.gear === g);
  });
}

document.querySelectorAll(".gear-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    setGear(btn.dataset.gear);
    hint.textContent = `Gear: ${btn.dataset.gear}`;
    if (btn.dataset.gear === "R") {
      setTimeout(() => navigateTo("camera"), 300);
    }
  });
});

// ─── Image error fallback ─────────────────────────────────────────────
dashboardImage.addEventListener("error", () => {
  hint.textContent = `⚠ Missing image for "${currentScreen}" — check assets folder`;
});

// ─── Keyboard shortcuts ───────────────────────────────────────────────
const keyMap = {
  "1": "home",
  "2": "menu",
  "3": "autoFeature",
  "4": "maps",
  "5": "voice",
  "6": "music",
  "7": "camera",
  "8": "settingsDark",
  "9": "search",
  "0": "bluetooth",
};

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { navigateTo("home"); return; }
  if (keyMap[e.key])      { navigateTo(keyMap[e.key]); return; }
  if (e.key.toLowerCase() === "d") {
    debugHotspots = !debugHotspots;
    document.body.classList.toggle("show-hotspots", debugHotspots);
    hint.textContent = `Debug hotspots ${debugHotspots ? "ON" : "OFF"}`;
  }
  // Volume shortcut on music screen
  if (currentScreen === "music") {
    if (e.key === "ArrowUp")   { volumeLevel = Math.min(100, volumeLevel + 10); syncVolume(); }
    if (e.key === "ArrowDown") { volumeLevel = Math.max(0,   volumeLevel - 10); syncVolume(); }
  }
  // Brightness shortcut on auto-feature screen
  if (currentScreen === "autoFeature") {
    if (e.key === "ArrowUp")   { brightness = Math.min(100, brightness + 10); syncBrightness(); }
    if (e.key === "ArrowDown") { brightness = Math.max(10,  brightness - 10); syncBrightness(); }
  }
});

// ─── Image fade transition ────────────────────────────────────────────
dashboardImage.style.transition = "opacity 0.15s ease";

// ─── Init ─────────────────────────────────────────────────────────────
navigateTo("home");
