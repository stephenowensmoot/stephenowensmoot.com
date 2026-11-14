const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

if (menuButton && siteNav) {
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    siteNav.classList.toggle("open", !open);
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      menuButton.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("open");
    }
  });
}

document.querySelectorAll("[data-current-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

document.querySelector("[data-print]")?.addEventListener("click", () => window.print());

const filterButtons = document.querySelectorAll("[data-filter]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    document.querySelectorAll("[data-category]").forEach((row) => {
      row.hidden = filter !== "all" && row.dataset.category !== filter;
    });
  });
});
