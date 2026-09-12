// Slide-in menu: one setMenu(open) toggles .is-open, mirrors aria-expanded on
// the opener and moves focus to the close button on open / back on close.
const menu = document.getElementById("menu");
const openBtn = document.getElementById("menu-open");
const closeBtn = document.getElementById("menu-close");
const backdrop = document.getElementById("menu-backdrop");
const links = menu.querySelectorAll(".menu__link");

let isOpen = false;

function setMenu(open) {
  isOpen = open;
  menu.classList.toggle("is-open", open);
  openBtn.setAttribute("aria-expanded", String(open));
  if (open) closeBtn.focus({ preventScroll: true });
  else openBtn.focus({ preventScroll: true });
}

openBtn.addEventListener("click", () => setMenu(true));
closeBtn.addEventListener("click", () => setMenu(false));
backdrop.addEventListener("click", () => setMenu(false));
links.forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && isOpen) setMenu(false);
});
