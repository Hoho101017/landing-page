const dashboardImage = document.getElementById("dashboardImage");
const hotspotsLayer = document.getElementById("hotspots");
const hint = document.getElementById("hint");
let volumeLevel = 50;

const screens = {
  home: {
    image: "./assets/home-default.png",
    hint: "Home | Tap in-screen buttons",
    hotspots: [
      { label: "Open sidebar", target: "menu", top: 2.8, left: 1.8, width: 6.0, height: 8.6 },
      { label: "Maps navigation", target: "maps", top: 4.6, left: 86.0, width: 7.0, height: 9.0 },
      { label: "Voice command", target: "voice", top: 4.6, left: 79.0, width: 7.0, height: 9.0 },
      { label: "Settings", target: "settingsDark", top: 10.8, left: 1.8, width: 6.0, height: 8.6 },
      { label: "Search", target: "search", top: 14.4, left: 44.0, width: 33.0, height: 9.0 },
      { label: "Music control", target: "music", top: 78.0, left: 39.0, width: 23.0, height: 17.0 },
      { label: "Reverse camera", target: "camera", top: 27.0, left: 64.0, width: 33.0, height: 44.0 },
      { label: "Nearby charging", target: "charging", top: 72.0, left: 62.0, width: 16.0, height: 20.0 },
      { label: "Safety alert", target: "safety", top: 72.0, left: 78.0, width: 16.0, height: 20.0 },
      { label: "Bluetooth", target: "bluetooth", top: 4.6, left: 72.8, width: 6.2, height: 9.0 },
    ],
  },
  menu: {
    image: "./assets/auto-feature.png",
    hint: "Menu opened",
    hotspots: [
      // This is updated to use the new 'goBack' action
      { label: "Close sidebar", action: "goBack", top: 2.8, left: 1.8, width: 6.0, height: 8.6 },
      { label: "Maps navigation", target: "maps", top: 4.6, left: 86.0, width: 7.0, height: 9.0 },
      { label: "Voice command", target: "voice", top: 4.6, left: 79.0, width: 7.0, height: 9.0 },
      { label: "Settings", target: "settingsDark", top: 10.8, left: 1.8, width: 6.0, height: 8.6 },
    ],
  },
  maps: {
    image: "./assets/maps-navigation.png",
    hint: "Maps",
    hotspots: [
      { label: "Back to home", target: "home", top: 2.8, left: 1.8, width: 6.0, height: 8.6 },
      { label: "Voice", target: "voice", top: 4.6, left: 79.0, width: 7.0, height: 9.0 },
    ],
  },
  voice: {
    image: "./assets/voice-command.png",
    hint: "Voice Command",
    hotspots: [
      { label: "Back to home", target: "home", top: 2.8, left: 1.8, width: 6.0, height: 8.6 },
      { label: "Map", target: "maps", top: 4.6, left: 86.0, width: 7.0, height: 9.0 },
    ],
  },
  music: {
    image: "./assets/music-control.png",
    hint: "Music Control",
    hotspots: [
      { label: "Back to home", target: "home", top: 2.8, left: 1.8, width: 6.0, height: 8.6 },
      { label: "Volume up", action: "volumeUp", top: 62.0, left: 56.5, width: 10.0, height: 11.5 },
      { label: "Volume down", action: "volumeDown", top: 73.0, left: 56.5, width: 10.0, height: 11.5 },
    ],
  },
  camera: {
    image: "./assets/reverse-cam.png",
    hint: "Reverse Camera",
    hotspots: [{ label: "Back to home", target: "home", top: 2.8, left: 1.8, width: 6.0, height: 8.6 }],
  },
  settingsDark: {
    image: "./assets/home-dark.png",
    hint: "Settings: Dark theme",
    hotspots: [
      { label: "Back to home", target: "home", top: 2.8, left: 1.8, width: 6.0, height: 8.6 },
      { label: "Switch to purple", target: "settingsPurple", top: 10.8, left: 1.8, width: 6.0, height: 8.6 },
    ],
  },
  settingsPurple: {
    image: "./assets/home-purple.png",
    hint: "Settings: Purple theme",
    hotspots: [
      { label: "Back to home", target: "home", top: 2.8, left: 1.8, width: 6.0, height: 8.6 },
      { label: "Switch to dark", target: "settingsDark", top: 10.8, left: 1.8, width: 6.0, height: 8.6 },
    ],
  },
  search: {
    image: "./assets/search-function.png",
    hint: "Search",
    hotspots: [{ label: "Back to home", target: "home", top: 2.8, left: 1.8, width: 6.0, height: 8.6 }],
  },
  safety: {
    image: "./assets/safety-alert.png",
    hint: "Safety Alert",
    hotspots: [{ label: "Back to home", target: "home", top: 2.8, left: 1.8, width: 6.0, height: 8.6 }],
  },
  charging: {
    image: "./assets/nearby-charging.png",
    hint: "Nearby Charging",
    hotspots: [{ label: "Back to home", target: "home", top: 2.8, left: 1.8, width: 6.0, height: 8.6 }],
  },
  bluetooth: {
    image: "./assets/bluetooth-connect.png",
    hint: "Bluetooth",
    hotspots: [{ label: "Back to home", target: "home", top: 2.8, left: 1.8, width: 6.0, height: 8.6 }],
  },
};

const missingImages = new Set();
let currentScreen = "home";
// This new variable remembers where you came from
let previousScreen = "home"; 
let debugHotspots = false;

const navigateTo = (screenKey) => {
  const screen = screens[screenKey];
  if (!screen) {
    return;
  }

  // Record the previous screen right before opening the menu
  if (screenKey === "menu" && currentScreen !== "menu") {
    previousScreen = currentScreen;
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
      // This new block handles the 'goBack' memory action
      if (spot.action === "goBack") {
        navigateTo(previousScreen);
        return;
      }
      
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
