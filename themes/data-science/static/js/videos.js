(() => {
  const start = () => {
    const root = document.getElementById("video-authoring");
    const toggle = document.getElementById("video-toggle");
    if (!root || !toggle || root.dataset.videoInitialized === "true") return;
    root.dataset.videoInitialized = "true";

    const close = document.getElementById("video-close");
    const cancel = document.getElementById("video-cancel");
    const form = document.getElementById("video-form");
    const titleInput = document.getElementById("video-title");
    const urlInput = document.getElementById("video-url");
    const status = document.getElementById("video-status");
    const preview = document.getElementById("video-preview");
    const typeLabel = document.getElementById("video-type");
    const frameWrap = document.getElementById("video-frame-wrap");
    const exportButton = document.getElementById("video-export");

    let currentVideo = null;

    const setStatus = (text, error = false) => {
      status.textContent = text || "";
      status.hidden = !text;
      status.classList.toggle("video-status--error", error);
    };

    const setOpen = (open) => {
      root.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      if (open) window.setTimeout(() => titleInput.focus(), 0);
    };

    const reset = () => {
      form.reset();
      currentVideo = null;
      preview.hidden = true;
      frameWrap.innerHTML = "";
      frameWrap.className = "video-frame-wrap";
      typeLabel.textContent = "";
      exportButton.disabled = true;
      setStatus("", false);
    };

    const parseYoutubeUrl = (value) => {
      let parsed;
      try {
        parsed = new URL(value.trim());
      } catch (error) {
        return null;
      }
      const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
      const supported = ["youtube.com", "m.youtube.com", "youtu.be", "youtube-nocookie.com"];
      if (!supported.includes(host)) return null;

      let id = "";
      let type = "regular";
      if (host === "youtu.be") {
        id = parsed.pathname.split("/").filter(Boolean)[0] || "";
      } else if (parsed.pathname.startsWith("/shorts/")) {
        type = "short";
        id = parsed.pathname.split("/").filter(Boolean)[1] || "";
      } else if (parsed.pathname.startsWith("/embed/")) {
        id = parsed.pathname.split("/").filter(Boolean)[1] || "";
      } else {
        id = parsed.searchParams.get("v") || "";
      }

      if (!/^[A-Za-z0-9_-]{6,}$/.test(id)) return null;
      return {
        id,
        type,
        url: `https://www.youtube.com/watch?v=${id}`
      };
    };

    const safeText = (value) => (value || "").replace(/[\r\n]+/g, " ").trim();
    const yamlEscape = (value) => safeText(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    const shortcodeEscape = (value) => safeText(value).replace(/"/g, "");
    const slugify = (value, id) => {
      const ascii = safeText(value).normalize("NFKD").replace(/[^\x00-\x7F]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      return (ascii || `youtube-${id}`).slice(0, 70);
    };

    const previewVideo = (event) => {
      event.preventDefault();
      const title = safeText(titleInput.value);
      const video = parseYoutubeUrl(urlInput.value);
      if (!video) {
        currentVideo = null;
        exportButton.disabled = true;
        preview.hidden = true;
        setStatus(root.dataset.invalidUrl, true);
        return;
      }
      if (!title) {
        currentVideo = null;
        exportButton.disabled = true;
        preview.hidden = true;
        setStatus(root.dataset.missingTitle, true);
        return;
      }

      currentVideo = { ...video, title };
      preview.hidden = false;
      frameWrap.className = `video-frame-wrap video-frame-wrap--${video.type}`;
      frameWrap.innerHTML = "";
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube-nocookie.com/embed/${video.id}?rel=0`;
      iframe.title = title;
      iframe.loading = "lazy";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      frameWrap.appendChild(iframe);
      typeLabel.textContent = video.type === "short" ? root.dataset.shortLabel : root.dataset.regularLabel;
      exportButton.disabled = false;
      setStatus(root.dataset.ready, false);
    };

    const writeU16 = (array, offset, value) => {
      array[offset] = value & 255;
      array[offset + 1] = (value >>> 8) & 255;
    };

    const writeU32 = (array, offset, value) => {
      array[offset] = value & 255;
      array[offset + 1] = (value >>> 8) & 255;
      array[offset + 2] = (value >>> 16) & 255;
      array[offset + 3] = (value >>> 24) & 255;
    };

    const crc32 = (bytes) => {
      let crc = 0xffffffff;
      for (const byte of bytes) {
        crc ^= byte;
        for (let bit = 0; bit < 8; bit += 1) {
          crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
        }
      }
      return (crc ^ 0xffffffff) >>> 0;
    };

    const makeZip = (files) => {
      const encoder = new TextEncoder();
      const localParts = [];
      const centralParts = [];
      let localOffset = 0;
      files.forEach((file) => {
        const name = encoder.encode(file.name);
        const data = encoder.encode(file.content);
        const crc = crc32(data);
        const header = new Uint8Array(30);
        writeU32(header, 0, 0x04034b50);
        writeU16(header, 4, 20);
        writeU16(header, 6, 0);
        writeU16(header, 8, 0);
        writeU16(header, 10, 0);
        writeU16(header, 12, 0);
        writeU32(header, 14, crc);
        writeU32(header, 18, data.length);
        writeU32(header, 22, data.length);
        writeU16(header, 26, name.length);
        writeU16(header, 28, 0);
        localParts.push(header, name, data);

        const central = new Uint8Array(46);
        writeU32(central, 0, 0x02014b50);
        writeU16(central, 4, 20);
        writeU16(central, 6, 20);
        writeU16(central, 8, 0);
        writeU16(central, 10, 0);
        writeU16(central, 12, 0);
        writeU16(central, 14, 0);
        writeU32(central, 16, crc);
        writeU32(central, 20, data.length);
        writeU32(central, 24, data.length);
        writeU16(central, 28, name.length);
        writeU16(central, 30, 0);
        writeU16(central, 32, 0);
        writeU16(central, 34, 0);
        writeU16(central, 36, 0);
        writeU32(central, 38, 0);
        writeU32(central, 42, localOffset);
        centralParts.push(central, name);
        localOffset += header.length + name.length + data.length;
      });

      const localSize = localParts.reduce((sum, part) => sum + part.length, 0);
      const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
      const end = new Uint8Array(22);
      writeU32(end, 0, 0x06054b50);
      writeU16(end, 4, 0);
      writeU16(end, 6, 0);
      writeU16(end, 8, files.length);
      writeU16(end, 10, files.length);
      writeU32(end, 12, centralSize);
      writeU32(end, 16, localSize);
      writeU16(end, 20, 0);
      return new Blob([...localParts, ...centralParts, end], { type: "application/zip" });
    };

    const downloadBundle = () => {
      if (!currentVideo) {
        setStatus(root.dataset.invalidUrl, true);
        return;
      }
      const date = new Date().toISOString().slice(0, 10);
      const slug = slugify(currentVideo.title, currentVideo.id);
      const folder = `content/post/${date}-${slug}`;
      const frontMatter = (languageTitle) => `---\ntitle: "${yamlEscape(languageTitle)}"\ndate: ${date}\ntype: post\nslug: "${slug}"\ncategories: ["Videos"]\ntags: ["video", "YouTube"]\ndescription: "YouTube video post: ${yamlEscape(languageTitle)}"\nimage: "https://i.ytimg.com/vi/${currentVideo.id}/hqdefault.jpg"\nimageAlt: "${yamlEscape(languageTitle)}"\nvideoId: "${currentVideo.id}"\nvideoType: "${currentVideo.type}"\n---\n\n{{< youtube-embed id="${currentVideo.id}" type="${currentVideo.type}" title="${shortcodeEscape(languageTitle)}" >}}\n\n[Watch this video on YouTube](${currentVideo.url})\n`;
      const readme = `Hugo video post bundle\n\nFolder: ${folder}\nYouTube URL: ${currentVideo.url}\nVideo type: ${currentVideo.type === "short" ? "Short (9:16)" : "regular video (16:9)"}\n\nCopy the generated folder into your repository under content/post/. The bundle contains Arabic-default and English translation files. Review or translate the English title before committing if needed.\n`;
      const zip = makeZip([
        { name: `${folder}/index.md`, content: frontMatter(currentVideo.title) },
        { name: `${folder}/index.en.md`, content: frontMatter(currentVideo.title) },
        { name: "README.txt", content: readme }
      ]);
      const filename = `${date}-${slug}.zip`;
      const href = URL.createObjectURL(zip);
      const anchor = document.createElement("a");
      anchor.href = href;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(href), 1000);
      setStatus(root.dataset.exported, false);
    };

    toggle.addEventListener("click", () => setOpen(root.hidden));
    close.addEventListener("click", () => setOpen(false));
    cancel.addEventListener("click", reset);
    form.addEventListener("submit", previewVideo);
    exportButton.addEventListener("click", downloadBundle);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
