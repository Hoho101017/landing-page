const dashboardImage = document.getElementById("dashboardImage");
const hotspotsLayer = document.getElementById("hotspots");
const hint = document.getElementById("hint");
let volumeLevel = 50;

const screens = {
  home: {
    image: "./assets/home-default.png",
    hint: "Home | Tap in-screen buttons",
    hotspots: [
      { label: "Open sidebar", target: "menu", top: 3.2, left: 2.2, width: 4.8, height: 7.0 },
      { label: "Maps navigation", target: "maps", top: 5.2, left: 87.0, width: 5.2, height: 7.5 },
      { label: "Voice command", target: "voice", top: 5.2, left: 80.7, width: 5.2, height: 7.5 },
      { label: "Settings", target: "settingsDark", top: 12.0, left: 2.4, width: 4.8, height: 7.2 },
      { label: "Search", target: "search", top: 15.4, left: 46.0, width: 29.0, height: 7.0 },
      { label: "Music control", target: "music", top: 78.0, left: 39.0, width: 23.0, height: 17.0 },
      { label: "Reverse camera", target: "camera", top: 27.0, left: 64.0, width: 33.0, height: 44.0 },
      { label: "Nearby charging", target: "charging", top: 73.0, left: 63.0, width: 15.0, height: 18.0 },
      { label: "Safety alert", target: "safety", top: 73.0, left: 79.0, width: 15.0, height: 18.0 },
      { label: "Bluetooth", target: "bluetooth", top: 5.0, left: 74.0, width: 5.0, height: 7.5 },
    ],
  },
  menu: {
    image: "./assets/auto-feature.png",
    hint: "Menu opened",
    hotspots: [
      { label: "Close sidebar", target: "home", top: 3.2, left: 2.2, width: 4.8, height: 7.0 },
      { label: "Maps navigation", target: "maps", top: 5.2, left: 87.0, width: 5.2, height: 7.5 },
      { label: "Voice command", target: "voice", top: 5.2, left: 80.7, width: 5.2, height: 7.5 },
      { label: "Settings", target: "settingsDark", top: 12.0, left: 2.4, width: 4.8, height: 7.2 },
    ],
  },
  maps: {
    image: "./assets/maps-navigation.png",
    hint: "Maps",
    hotspots: [
      { label: "Back to home", target: "home", top: 3.2, left: 2.2, width: 4.8, height: 7.0 },
      { label: "Voice", target: "voice", top: 5.2, left: 80.7, width: 5.2, height: 7.5 },
    ],
  },
  voice: {
    image: "./assets/voice-command.png",
    hint: "Voice Command",
    hotspots: [
      { label: "Back to home", target: "home", top: 3.2, left: 2.2, width: 4.8, height: 7.0 },
      { label: "Map", target: "maps", top: 5.2, left: 87.0, width: 5.2, height: 7.5 },
    ],
  },
  music: {
    image: "./assets/music-control.png",
    hint: "Music Control",
    hotspots: [
      { label: "Back to home", target: "home", top: 3.2, left: 2.2, width: 4.8, height: 7.0 },
      { label: "Volume up", action: "volumeUp", top: 63.5, left: 59.0, width: 6.0, height: 9.0 },
      { label: "Volume down", action: "volumeDown", top: 74.0, left: 59.0, width: 6.0, height: 9.0 },
    ],
  },
  camera: {
    image: "./assets/reverse-cam.png",
    hint: "Reverse Camera",
    hotspots: [{ label: "Back to home", target: "home", top: 3.2, left: 2.2, width: 4.8, height: 7.0 }],
  },
  settingsDark: {
    image: "./assets/home-dark.png",
    hint: "Settings: Dark theme",
    hotspots: [
      { label: "Back to home", target: "home", top: 3.2, left: 2.2, width: 4.8, height: 7.0 },
      { label: "Switch to purple", target: "settingsPurple", top: 12.0, left: 2.4, width: 4.8, height: 7.2 },
    ],
  },
  settingsPurple: {
    image: "./assets/home-purple.png",
    hint: "Settings: Purple theme",
    hotspots: [
      { label: "Back to home", target: "home", top: 3.2, left: 2.2, width: 4.8, height: 7.0 },
      { label: "Switch to dark", target: "settingsDark", top: 12.0, left: 2.4, width: 4.8, height: 7.2 },
    ],
  },
  search: {
    image: "./assets/search-function.png",
    hint: "Search",
    hotspots: [{ label: "Back to home", target: "home", top: 3.2, left: 2.2, width: 4.8, height: 7.0 }],
  },
  safety: {
    image: "./assets/safety-alert.png",
    hint: "Safety Alert",
    hotspots: [{ label: "Back to home", target: "home", top: 3.2, left: 2.2, width: 4.8, height: 7.0 }],
  },
  charging: {
    image: "./assets/nearby-charging.png",
    hint: "Nearby Charging",
    hotspots: [{ label: "Back to home", target: "home", top: 3.2, left: 2.2, width: 4.8, height: 7.0 }],
  },
  bluetooth: {
    image: "./assets/bluetooth-connect.png",
    hint: "Bluetooth",
    hotspots: [{ label: "Back to home", target: "home", top: 3.2, left: 2.2, width: 4.8, height: 7.0 }],
  },
};

const missingImages = new Set();
let currentScreen = "home";
let debugHotspots = false;

const navigateTo = (screenKey) => {
  const screen = screens[screenKey];
  if (!screen) {
    return;
  }

  currentScreen = screenKey;
  dashboardImage.src = screen.image;
  dashboardImage.alt = `EV dashboard ${screenKey} screen`;
  hint.textContent =
    screenKey === "music" ? `${screen.hint} | Volume ${volumeLevel}%` : screen.hint;
  renderHotspots(screen.hotspots);
};

const renderHotspots = (hotspots) => {
  hotspotsLayer.innerHTML = "";
  hotspots.forEach((spot) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "hotspot";
    button.setAttribute("aria-label", spot.label);
    button.style.top = `${spot.top}%`;
    button.style.left = `${spot.left}%`;
    button.style.width = `${spot.width}%`;
    button.style.height = `${spot.height}%`;
    button.addEventListener("click", () => {
      if (spot.target) {
        navigateTo(spot.target);
        return;
      }
      if (spot.action === "volumeUp") {
        volumeLevel = Math.min(100, volumeLevel + 10);
        hint.textContent = `${screens[currentScreen].hint} | Volume ${volumeLevel}%`;
        return;
      }
      if (spot.action === "volumeDown") {
        volumeLevel = Math.max(0, volumeLevel - 10);
        hint.textContent = `${screens[currentScreen].hint} | Volume ${volumeLevel}%`;
      }
    });
    hotspotsLayer.appendChild(button);
  });
};

dashboardImage.addEventListener("error", () => {
  missingImages.add(currentScreen);
  hint.textContent = `Missing image for ${currentScreen}. Check assets folder.`;
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    navigateTo("home");
  }

  const keyToScreen = {
    "1": "home",
    "2": "menu",
    "3": "maps",
    "4": "voice",
    "5": "music",
    "6": "camera",
    "7": "settingsDark",
    "8": "search",
  };

  const nextScreen = keyToScreen[event.key];
  if (nextScreen) {
    navigateTo(nextScreen);
  }

  if (event.key.toLowerCase() === "d") {
    toggleDebug();
  }
});

const toggleDebug = () => {
  debugHotspots = !debugHotspots;
  document.body.classList.toggle("show-hotspots", debugHotspots);
  hint.textContent = debugHotspots
    ? `${screens[currentScreen].hint} | Debug hotspots ON`
    : screens[currentScreen].hint;
};

navigateTo("home");
