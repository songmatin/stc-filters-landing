const currentYear = new Date().getFullYear();
const footer = document.querySelector(".site-footer p");

if (footer) {
  const siteName = document.body.classList.contains("filter-page") ? "Ricardo" : "卡豆作品集";
  footer.textContent = `© ${currentYear} ${siteName}`;
}

const filterButtons = document.querySelectorAll("[data-filter]");
const gearCards = document.querySelectorAll(".gear-card[data-category]");

const pageKey = document.body.dataset.pageKey || "home";

function trackEvent(name, parameters = {}) {
  if (typeof window.gtag === "function") {
    window.gtag("event", name, {
      page: pageKey,
      page_path: window.location.pathname,
      ...parameters,
    });
  }
}

document.querySelectorAll("a[data-behance-position]").forEach((link) => {
  link.addEventListener("click", () => {
    trackEvent("click_behance", {
      position: link.dataset.behancePosition,
      link_url: link.href,
    });
  });
});

document.querySelectorAll('a[href*="stcoptics.com"]').forEach((link) => {
  const url = new URL(link.href);
  if (!url.searchParams.has("utm_source")) {
    url.searchParams.set("utm_source", "filters.songmatin.com");
    url.searchParams.set("utm_medium", "referral");
    url.searchParams.set("utm_campaign", pageKey);
    link.href = url.toString();
  }

  link.addEventListener("click", () => {
    trackEvent("click_stc_link", {
      button_position: link.dataset.buttonPosition || link.textContent.trim(),
      link_url: link.href,
    });
  });
});

document.querySelectorAll("[data-copy-discount]").forEach((button) => {
  button.addEventListener("click", async () => {
    const code = button.dataset.copyDiscount;
    if (!code) {
      button.textContent = "請先填入折扣碼";
      button.setAttribute("aria-disabled", "true");
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      button.textContent = "已複製折扣碼";
      trackEvent("copy_discount_code", { button_position: "discount_code" });
    } catch {
      button.textContent = "請手動複製折扣碼";
    }
  });
});

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
