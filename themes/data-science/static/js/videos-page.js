(() => {
  const start = () => {
    document.querySelectorAll("[data-videos-catalog]").forEach((catalog) => {
      if (catalog.dataset.initialized === "true") return;
      catalog.dataset.initialized = "true";

      const grid = catalog.querySelector("[data-video-grid]");
      const empty = catalog.querySelector("[data-video-empty]");
      const entries = Array.isArray(window.AhmedVideos) ? window.AhmedVideos : [];
      const isArabic = document.documentElement.lang.toLowerCase().startsWith("ar");

      const parseYouTubeUrl = (value, requestedType) => {
        let parsed;
        try {
          parsed = new URL(String(value || "").trim());
        } catch (error) {
          return null;
        }

        const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
        if (!["youtube.com", "m.youtube.com", "youtu.be", "youtube-nocookie.com"].includes(host)) {
          return null;
        }

        const parts = parsed.pathname.split("/").filter(Boolean);
        let id = "";
        let type = requestedType === "short" || requestedType === "regular" ? requestedType : "regular";

        if (host === "youtu.be") {
          id = parts[0] || "";
        } else if (parts[0] === "shorts") {
          id = parts[1] || "";
          type = "short";
        } else if (parts[0] === "embed") {
          id = parts[1] || "";
        } else {
          id = parsed.searchParams.get("v") || "";
        }

        if (!/^[A-Za-z0-9_-]{6,}$/.test(id)) return null;
        return { id, type, watchUrl: `https://www.youtube.com/watch?v=${id}` };
      };

      const addText = (element, text) => {
        element.textContent = String(text || "").trim();
        return element;
      };

      const getLocalizedValue = (entry, key) => {
        if (isArabic) return entry[`${key}Ar`] || entry[key] || entry[`${key}En`] || "";
        return entry[`${key}En`] || entry[key] || entry[`${key}Ar`] || "";
      };

      const formatDate = (value) => {
        if (!value) return "";
        const date = new Date(`${value}T00:00:00Z`);
        if (Number.isNaN(date.getTime())) return String(value);
        return new Intl.DateTimeFormat(isArabic ? "ar" : "en", {
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone: "UTC"
        }).format(date);
      };

      const createCard = (entry) => {
        const video = parseYouTubeUrl(entry.url, entry.type);
        const title = getLocalizedValue(entry, "title");
        if (!video || !title) return null;

        const card = document.createElement("article");
        card.className = "video-card";

        const media = document.createElement("div");
        media.className = `video-card__media video-card__media--${video.type}`;
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube-nocookie.com/embed/${video.id}?rel=0`;
        iframe.title = title;
        iframe.loading = "lazy";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;
        media.appendChild(iframe);
        card.appendChild(media);

        const details = document.createElement("div");
        details.className = "video-card__details";

        const type = document.createElement("p");
        type.className = "item__meta-category";
        addText(type, video.type === "short" ? catalog.dataset.shortLabel : catalog.dataset.regularLabel);
        details.appendChild(type);

        const heading = document.createElement("h2");
        heading.className = "video-card__title";
        addText(heading, title);
        details.appendChild(heading);

        const dateText = formatDate(entry.date);
        if (dateText) {
          const date = document.createElement("p");
          date.className = "video-card__date";
          addText(date, dateText);
          details.appendChild(date);
        }

        const description = getLocalizedValue(entry, "description");
        if (description) {
          const summary = document.createElement("p");
          summary.className = "video-card__description";
          addText(summary, description);
          details.appendChild(summary);
        }

        const watch = document.createElement("a");
        watch.className = "video-card__watch item__meta-link";
        watch.href = video.watchUrl;
        watch.target = "_blank";
        watch.rel = "noopener noreferrer";
        addText(watch, catalog.dataset.watchLabel);
        details.appendChild(watch);

        card.appendChild(details);
        return card;
      };

      let rendered = 0;
      entries.forEach((entry) => {
        const card = createCard(entry || {});
        if (!card) return;
        grid.appendChild(card);
        rendered += 1;
      });

      if (rendered === 0) {
        addText(empty, catalog.dataset.empty);
        empty.hidden = false;
      }
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
