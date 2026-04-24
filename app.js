const toggle = document.getElementById("sidebarToggle");
const dashboardImage = document.getElementById("dashboardImage");

const imageStates = {
  closed: "./assets/home-default.png",
  open: "./assets/auto-feature.png",
};

const setSidebar = (open) => {
  dashboardImage.src = open ? imageStates.open : imageStates.closed;
  toggle.setAttribute("aria-expanded", String(open));
};

toggle.addEventListener("click", () => {
  const isOpen = toggle.getAttribute("aria-expanded") === "true";
  setSidebar(!isOpen);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setSidebar(false);
  }
});
