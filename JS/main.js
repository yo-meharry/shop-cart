let menuBtn = document.querySelector("#menu-toggle");

let menuSidebar = document.getElementById("menuSidebar");
const overlay = document.querySelector("#menuOverlay");

menuBtn.addEventListener("click", function () {
  menuSidebar.classList.toggle("open");
  overlay.classList.toggle("show");
});

overlay.addEventListener("click", function () {
  menuSidebar.classList.remove("open");
  overlay.classList.remove("show");
});
