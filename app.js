const dashboardImage = document.getElementById("dashboardImage");
const hotspotsLayer = document.getElementById("hotspots");
const hint = document.getElementById("hint");

let volumeLevel = 50;
let currentScreen = "home";
let previousScreen = "home"; // 记录上一个页面
let debugHotspots = false;

const screens = {
  home: {
    image: "./assets/home-default.png",
    hint: "Home | Tap in-screen buttons",
    hotspots: [
      // --- 左侧边栏 (按照你的图片重新校对的坐标) ---
      { label: "Settings", target: "settingsDark", top: 18.0, left: 2.0, width: 5.0, height: 8.0 },
      { label: "Maps", target: "maps", top: 33.0, left: 2.0, width: 5.0, height: 8.0 },
      { label: "Voice", target: "voice", top: 48.0, left: 2.0, width: 5.0, height: 8.0 },
      { label: "Bluetooth", target: "bluetooth", top: 63.0, left: 2.0, width: 5.0, height: 8.0 },
      { label: "Menu/Car", target: "menu", top: 78.0, left: 2.0, width: 5.0, height: 8.0 },

      // --- 屏幕内主要功能 ---
      { label: "Search Bar", target: "search", top: 3.0, left: 68.0, width: 28.0, height: 8.0 },
      { label: "Music Center", target: "music", top: 61.0, left: 11.0, width: 28.0, height: 16.0 },
      { label: "Temp Controls", target: "home", top: 79.0, left: 11.0, width: 28.0, height: 16.0 },
      { label: "Main Map View", target: "maps", top: 12.0, left: 40.0, width: 28.0, height: 65.0 },
    ],
  },
  menu: {
    image: "./assets/auto-feature.png",
    hint: "Menu opened",
    hotspots: [
      // 这里的 action: "goBack" 会让你回到刚才的页面
      { label: "Back", action: "goBack", top: 78.0, left: 2.0, width: 5.0, height: 8.0 },
      { label: "Home", target: "home", top: 5.0, left: 2.0, width: 5.0, height: 8.0 },
    ],
  },
  maps: {
    image: "./assets/maps-navigation.png",
    hint: "Maps",
    hotspots: [
       { label: "Back", action: "goBack", top: 33.0, left: 2.0, width: 5.0, height: 8.0 },
       { label: "Home", target: "home", top: 5.0, left: 2.0, width: 5.0, height: 8.0 },
    ],
  },
  voice: {
    image: "./assets/voice-command.png",
    hint: "Voice Command",
    hotspots: [
       { label: "Back", action: "goBack", top: 48.0, left: 2.0, width: 5.0, height: 8.0 },
       { label: "Home", target: "home", top: 5.0, left: 2.0, width: 5.0, height: 8.0 },
    ],
  },
  // ... 其他页面可以参照上面的格式添加 goBack
};

// 核心导航逻辑
const navigateTo = (screenKey) => {
  const screen = screens[screenKey];
  if (!screen) return;

  // 如果是从普通页面去功能页，记录当前页面
  if (screenKey !== "home" && currentScreen !== screenKey) {
    previousScreen = currentScreen;
  }

  currentScreen = screenKey;
  dashboardImage.src = screen.image;
  hint.textContent = screen.hint;
  renderHotspots(screen.hotspots);
};

const renderHotspots = (hotspots) => {
  hotspotsLayer.innerHTML = "";
  hotspots.forEach((spot) => {
    const button = document.createElement("button");
    button.className = "hotspot";
    button.style.top = `${spot.top}%`;
    button.style.left = `${spot.left}%`;
    button.style.width = `${spot.width}%`;
    button.style.height = `${spot.height}%`;

    button.onclick = () => {
      if (spot.action === "goBack") {
        navigateTo(previousScreen);
      } else if (spot.target) {
        navigateTo(spot.target);
      }
    };
    hotspotsLayer.appendChild(button);
  });
};

// 键盘 'D' 键调试模式
document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "d") {
    debugHotspots = !debugHotspots;
    document.body.classList.toggle("show-hotspots", debugHotspots);
  }
});

navigateTo("home");
