const currentYear = new Date().getFullYear();
const footer = document.querySelector(".site-footer p");

if (footer) {
  const siteName = document.body.classList.contains("filter-page") ? "Ricardo" : "卡豆作品集";
  footer.textContent = `© ${currentYear} ${siteName}`;
}

const filterButtons = document.querySelectorAll("[data-filter]");
const gearCards = document.querySelectorAll(".gear-card[data-category]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const activeFilter = button.dataset.filter;

    filterButtons.forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });

    gearCards.forEach((card) => {
      const shouldShow = activeFilter === "all" || card.dataset.category === activeFilter;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});
