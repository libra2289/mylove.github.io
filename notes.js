(function () {
  const STORAGE_KEY = "loveNotes";

  // Чтобы записки ещё и присылались тебе на почту (и были видны на твоём ПК
  // независимо от устройства, с которого их написали), заведи бесплатный
  // аккаунт на https://formspree.io, создай форму и вставь её ссылку сюда:
  const EMAIL_ENDPOINT = "https://formspree.io/f/xvkgpnko"; // например: "https://formspree.io/f/xxxxxxxx"

  const toggle = document.getElementById("notesToggle");
  const panel = document.getElementById("notesPanel");
  const closeBtn = document.getElementById("notesClose");
  const textarea = document.getElementById("notesTextarea");
  const saveBtn = document.getElementById("notesSave");
  const list = document.getElementById("notesList");

  if (!toggle || !panel || !textarea || !saveBtn || !list) return;

  function loadNotes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveNotes(notes) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      /* localStorage недоступен — записки сохранятся только на время сессии */
    }
  }

  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function render() {
    const notes = loadNotes().slice().reverse();
    list.innerHTML = "";

    notes.forEach((note) => {
      const item = document.createElement("div");
      item.className = "note-item";
      item.dataset.id = note.id;

      const del = document.createElement("button");
      del.className = "note-delete";
      del.type = "button";
      del.setAttribute("aria-label", "Удалить");
      del.textContent = "✕";

      const time = document.createElement("time");
      time.textContent = formatDate(note.date);

      const p = document.createElement("p");
      p.textContent = note.text;

      item.appendChild(del);
      item.appendChild(time);
      item.appendChild(p);
      list.appendChild(item);
    });
  }

  function openPanel() {
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    textarea.focus();
  }

  function closePanel() {
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
  }

  toggle.addEventListener("click", () => {
    if (panel.classList.contains("is-open")) {
      closePanel();
    } else {
      openPanel();
    }
  });

  if (closeBtn) closeBtn.addEventListener("click", closePanel);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePanel();
  });

  saveBtn.addEventListener("click", () => {
    const text = textarea.value.trim();
    if (!text) return;

    const note = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      text: text,
      date: new Date().toISOString(),
    };

    const notes = loadNotes();
    notes.push(note);
    saveNotes(notes);
    render();
    textarea.value = "";

    if (EMAIL_ENDPOINT) {
      fetch(EMAIL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ message: text, date: formatDate(note.date) }),
      }).catch(function () {
        /* тихо игнорируем ошибки сети, запись всё равно сохранена локально */
      });
    }
  });

  list.addEventListener("click", (e) => {
    const btn = e.target.closest(".note-delete");
    if (!btn) return;
    const item = btn.closest(".note-item");
    if (!item) return;
    const id = item.dataset.id;
    const notes = loadNotes().filter((n) => n.id !== id);
    saveNotes(notes);
    render();
  });

  render();
})();
