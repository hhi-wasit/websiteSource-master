(() => {
  const start = () => {
    const root = document.getElementById("assistant-widget");
    if (!root) return;

    const launcher = document.getElementById("assistant-launcher");
    const panel = document.getElementById("assistant-panel");
    const close = document.getElementById("assistant-close");
    const form = document.getElementById("assistant-form");
    const input = document.getElementById("assistant-input");
    const send = document.getElementById("assistant-send");
    const clear = document.getElementById("assistant-clear");
    const messages = document.getElementById("assistant-messages");
    const status = document.getElementById("assistant-status");

    const copy = {
      loading: root.dataset.loading || "Loading the browser-based assistant…",
      generating: root.dataset.generating || "Preparing an answer…",
      fallback: root.dataset.fallback || "The local model is not available in this browser.",
      error: root.dataset.error || "The browser model could not be loaded.",
      noMatch: root.dataset.noMatch || "I could not find that topic in the academic knowledge base."
    };

    let knowledge = null;
    let engine = null;
    let enginePromise = null;
    let engineUnavailable = false;
    let busy = false;

    const setStatus = (text, hidden = false) => {
      status.textContent = text || "";
      status.hidden = hidden || !text;
    };

    const appendMessage = (text, role) => {
      const element = document.createElement("div");
      element.className = `assistant-message assistant-message-${role}`;
      element.textContent = text;
      messages.appendChild(element);
      messages.scrollTop = messages.scrollHeight;
      return element;
    };

    const clearMessages = () => {
      messages.innerHTML = "";
      appendMessage(messages.dataset.welcome || "", "assistant");
      setStatus("", true);
    };

    const loadKnowledge = async () => {
      if (knowledge) return knowledge;
      const response = await fetch(root.dataset.knowledgeUrl, { cache: "force-cache" });
      if (!response.ok) throw new Error("Knowledge base unavailable");
      knowledge = await response.json();
      return knowledge;
    };

    const terms = (text) => (text || "")
      .toLocaleLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((term) => term.length > 2);

    const relevantSections = (question, profile) => {
      const queryTerms = terms(question);
      const sections = Object.entries(profile).filter(([key]) => key !== "posts").map(([key, value]) => ({ key, value }));
      const postSections = (profile.posts || []).map((value, index) => ({ key: `post-${index}`, value }));
      const ranked = [...sections, ...postSections].map((section) => {
        const haystack = `${section.key} ${section.value}`.toLocaleLowerCase();
        const score = queryTerms.reduce((sum, term) => sum + (haystack.includes(term) ? 1 : 0), 0);
        return { ...section, score };
      }).sort((a, b) => b.score - a.score);
      return ranked.filter((section) => section.score > 0).slice(0, 4);
    };

    const fallbackAnswer = (question, profile) => {
      const relevant = relevantSections(question, profile);
      if (!relevant.length) return copy.noMatch;
      return relevant.map((section) => section.value).join("\n\n");
    };

    const loadEngine = async () => {
      if (engine) return engine;
      if (engineUnavailable) throw new Error("Browser model unavailable");
      if (!navigator.gpu) {
        engineUnavailable = true;
        throw new Error("WebGPU unavailable");
      }
      if (!enginePromise) {
        enginePromise = (async () => {
          setStatus(copy.loading);
          const webllm = await import("https://esm.run/@mlc-ai/web-llm");
          const instance = await webllm.CreateMLCEngine(root.dataset.model, {
            initProgressCallback: (progress) => {
              if (progress && progress.text) setStatus(progress.text);
            }
          });
          engine = instance;
          setStatus("", true);
          return instance;
        })().catch((error) => {
          engineUnavailable = true;
          enginePromise = null;
          throw error;
        });
      }
      return enginePromise;
    };

    const answerQuestion = async (question) => {
      const allKnowledge = await loadKnowledge();
      const language = root.dataset.language === "ar" ? "ar" : "en";
      const profile = allKnowledge[language] || allKnowledge.en;
      const contextSections = relevantSections(question, profile);
      const context = contextSections.length
        ? contextSections.map((section) => section.value).join("\n\n")
        : JSON.stringify(profile);

      if (engineUnavailable) {
        setStatus(copy.fallback);
        return fallbackAnswer(question, profile);
      }

      try {
        const activeEngine = await loadEngine();
        setStatus(copy.generating);
        const languageName = language === "ar" ? "Arabic" : "English";
        const response = await activeEngine.chat.completions.create({
          messages: [
            {
              role: "system",
              content: `You are the public academic assistant for Ahmed Azeez's website. Answer in ${languageName}. Use only the supplied website knowledge. Do not invent qualifications, dates, publications, employers, links, or personal information. If the knowledge does not answer the question, say so clearly and direct the visitor to the About page or CV. Keep the response concise and understandable.\n\nWebsite knowledge:\n${context}`
            },
            { role: "user", content: question }
          ],
          temperature: 0.2,
          max_tokens: 320
        });
        const reply = response && response.choices && response.choices[0] && response.choices[0].message && response.choices[0].message.content;
        setStatus("", true);
        return reply || fallbackAnswer(question, profile);
      } catch (error) {
        engineUnavailable = true;
        setStatus(copy.fallback);
        return fallbackAnswer(question, profile);
      }
    };

    const setOpen = (open) => {
      panel.hidden = !open;
      launcher.setAttribute("aria-expanded", String(open));
      if (open) window.setTimeout(() => input.focus(), 0);
    };

    launcher.addEventListener("click", () => setOpen(panel.hidden));
    close.addEventListener("click", () => setOpen(false));
    clear.addEventListener("click", clearMessages);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const question = input.value.trim();
      if (!question || busy) return;
      busy = true;
      send.disabled = true;
      input.disabled = true;
      appendMessage(question, "user");
      input.value = "";
      try {
        const reply = await answerQuestion(question);
        appendMessage(reply, "assistant");
      } catch (error) {
        appendMessage(copy.error, "assistant");
      } finally {
        busy = false;
        send.disabled = false;
        input.disabled = false;
        input.focus();
      }
    });

    messages.dataset.welcome = messages.querySelector(".assistant-message-assistant")?.textContent || "";
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
