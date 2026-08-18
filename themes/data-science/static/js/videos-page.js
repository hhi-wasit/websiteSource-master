(() => {
  const start = () => {
    document.querySelectorAll("[data-videos-catalog]").forEach((catalog) => {
      if (catalog.dataset.initialized === "true") return;
      catalog.dataset.initialized = "true";

      const grid = catalog.querySelector("[data-video-grid]");
      const empty = catalog.querySelector("[data-video-empty]");
      const columns = [0, 1].map(() => {
        const column = document.createElement("div");
        column.className = "videos-column";
        return column;
      });
      grid.append(...columns);
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
        return { id, type };
      };

      const addText = (element, text) => {
        element.textContent = String(text || "").trim();
        return element;
      };

      const getLocalizedValue = (entry, key) => {
        if (isArabic) return entry[`${key}Ar`] || entry[key] || entry[`${key}En`] || "";
        return entry[`${key}En`] || entry[key] || entry[`${key}Ar`] || "";
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

        const heading = document.createElement("h2");
        heading.className = "video-card__title";
        addText(heading, title);
        details.appendChild(heading);

        const description = getLocalizedValue(entry, "description");
        if (description) {
          const summary = document.createElement("p");
          summary.className = "video-card__description";
          addText(summary, description);
          details.appendChild(summary);
        }

        card.appendChild(details);
        return card;
      };

      let rendered = 0;
      entries.forEach((entry) => {
        const card = createCard(entry || {});
        if (!card) return;
        card.style.order = String(rendered);
        columns[rendered % columns.length].appendChild(card);
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
