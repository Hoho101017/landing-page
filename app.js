const dashboardImage = document.getElementById("dashboardImage");
const hotspotsLayer = document.getElementById("hotspots");
const hint = document.getElementById("hint");

const screens = {
  home: {
    image: "./assets/home-default.png",
    hint: "Home | Menu, map, voice, music, camera",
    hotspots: [
      { label: "Open sidebar", target: "menu", top: 3.2, left: 2.2, width: 4.8, height: 7.0 },
      { label: "Maps navigation", target: "maps", top: 5.2, left: 87.0, width: 5.2, height: 7.5 },
      { label: "Voice command", target: "voice", top: 5.2, left: 80.7, width: 5.2, height: 7.5 },
      { label: "Music control", target: "music", top: 78.0, left: 39.0, width: 23.0, height: 17.0 },
      { label: "Reverse camera", target: "camera", top: 27.0, left: 64.0, width: 33.0, height: 44.0 },
    ],
  },
  menu: {
    image: "./assets/auto-feature.png",
    hint: "Sidebar opened | Tap menu again to return",
    hotspots: [
      { label: "Close sidebar", target: "home", top: 3.2, left: 2.2, width: 4.8, height: 7.0 },
      { label: "Maps navigation", target: "maps", top: 5.2, left: 87.0, width: 5.2, height: 7.5 },
      { label: "Voice command", target: "voice", top: 5.2, left: 80.7, width: 5.2, height: 7.5 },
    ],
  },
  maps: {
    image: "./assets/maps-navigation.png",
    hint: "Maps | Tap menu icon to go Home",
    hotspots: [{ label: "Back to home", target: "home", top: 3.2, left: 2.2, width: 4.8, height: 7.0 }],
  },
  voice: {
    image: "./assets/voice-command.png",
    hint: "Voice | Tap menu icon to go Home",
    hotspots: [{ label: "Back to home", target: "home", top: 3.2, left: 2.2, width: 4.8, height: 7.0 }],
  },
  music: {
    image: "./assets/music-control.png",
    hint: "Music | Tap menu icon to go Home",
    hotspots: [{ label: "Back to home", target: "home", top: 3.2, left: 2.2, width: 4.8, height: 7.0 }],
  },
  camera: {
    image: "./assets/reverse-cam.png",
    hint: "Reverse camera | Tap menu icon to go Home",
    hotspots: [{ label: "Back to home", target: "home", top: 3.2, left: 2.2, width: 4.8, height: 7.0 }],
  },
};

const missingImages = new Set();
let currentScreen = "home";

const navigateTo = (screenKey) => {
  const screen = screens[screenKey];
  if (!screen) {
    return;
  }

  currentScreen = screenKey;
  dashboardImage.src = screen.image;
  dashboardImage.alt = `EV dashboard ${screenKey} screen`;
  hint.textContent = screen.hint;
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
    button.addEventListener("click", () => navigateTo(spot.target));
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
  };

  const nextScreen = keyToScreen[event.key];
  if (nextScreen) {
    navigateTo(nextScreen);
  }
});

navigateTo("home");
