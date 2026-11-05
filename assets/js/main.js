const currentYear = new Date().getFullYear();
const footer = document.querySelector(".site-footer p");

if (footer) {
  const siteName = document.body.classList.contains("filter-page") ? "Ricardo" : "卡豆作品集";
  footer.textContent = `© ${currentYear} ${siteName}`;
}

const filterButtons = document.querySelectorAll("[data-filter]");
const gearCards = document.querySelectorAll(".gear-card[data-category]");

const pageKey = document.body.dataset.pageKey || "home";
const discountCode = "KARDO";

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
  const currentUrl = new URL(link.href);
  if (currentUrl.pathname.startsWith(`/discount/${discountCode}`)) {
    const redirectPath = currentUrl.searchParams.get("redirect");
    if (redirectPath) {
      const redirectUrl = new URL(redirectPath, currentUrl.origin);
      if (!redirectUrl.searchParams.has("utm_source")) {
        redirectUrl.searchParams.set("utm_source", "filters.songmatin.com");
        redirectUrl.searchParams.set("utm_medium", "referral");
        redirectUrl.searchParams.set("utm_campaign", pageKey);
        currentUrl.searchParams.set("redirect", `${redirectUrl.pathname}${redirectUrl.search}`);
        link.href = currentUrl.toString();
      }
    }
  } else {
    const redirectUrl = new URL(currentUrl.pathname, currentUrl.origin);
    for (const [key, value] of currentUrl.searchParams) {
      redirectUrl.searchParams.set(key, value);
    }
    redirectUrl.searchParams.set("utm_source", "filters.songmatin.com");
    redirectUrl.searchParams.set("utm_medium", "referral");
    redirectUrl.searchParams.set("utm_campaign", pageKey);

    const discountUrl = new URL(`https://${currentUrl.hostname}/discount/${discountCode}`);
    discountUrl.searchParams.set("redirect", `${redirectUrl.pathname}${redirectUrl.search}`);
    link.href = discountUrl.toString();
  }

  link.addEventListener("click", () => {
    trackEvent("click_stc_link", {
      button_position: link.dataset.buttonPosition || link.textContent.trim(),
      link_url: link.href,
    });
  });
});

document.querySelectorAll("[data-video-id]").forEach((frame) => {
  const playButton = frame.querySelector(".filter-video-play");
  const videoId = frame.dataset.videoId;

  if (!playButton || !videoId) return;

  playButton.addEventListener("click", () => {
    const iframe = document.createElement("iframe");
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.title = "STC 濾鏡拍攝現場影片";
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&rel=0`;

    frame.replaceChildren(iframe);
    trackEvent("video_play", { video_id: videoId });
  }, { once: true });
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
