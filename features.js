(function () {
  const EMAIL_ENDPOINT = "https://formspree.io/f/xvkgpnko";

  // Вход по слову. Оставь пустым, чтобы вход был свободным.
  // Регистр и лишние пробелы не важны.
  const PASSCODE = "Люблю тебя";

  const START_DATE = new Date(2025, 6, 3);

  const REASONS = [
    "Ты самая у меня красивая",
    "Заботливая",
    "Умная, и не пиздеть мне тут",
    "Всегда поможешь",
    "Не бросишь в беде",
    "И ещё куча-куча разных причин, которые трудно описать словами",
    "Ты идеальна",
  ];

  const GOALS = [
    "Съехаться",
    "Слетать в любую страну",
    "Завести собачку или кошечку",
    "Накачаться (мне)",
    "Пойти на остров мечты",
    "Сходить на квест",
    "Сдать сессии и ЕГЭ",
  ];

  // Капсула времени: поменяй тексты на свои.
  const CAPSULES = [
    {
      date: "2027-01-01",
      title: "1 января — наш второй Новый год",
      text: "Это 2 Новый год который мы празднуем вместе, и блять как же я надеюсь что так будет и дальше на всю жизнь ахахаха) Я крайне надеюсь что ты сдала сессию, я сдал сочинение и егкр хотя бы на балов 50.За все время что я с тобой встречаюсь я понял что без тебя я бы себе места не нашел,ты буквально единственный человек от которого я жду сообщение каждую минуту,жду каждую нашу встречу. Клянусь никогда в жизни никого не любил так сильно как тебя. Мое желание на этот год вообще видеться с тобой гораздо чаще съехаться, и в будущем вообще жениться).Я почему то уверен что ты будешь читать это рядом со мной и мне чуть чуть стыдно будет за это. Но знай я по тебе очень сильно скучаю в будни. Даже сейчас я пишу это письмо пока тебя рядом нету и как будто бы какая то боль в груди, не знаю наверное из за того что ты не рядом. Хочу чтоб этот текст тебя порадовал, хотя скорее всего нам будет плохо на утро но это похуй. Я очень сильно тебя люблю зайка моя. Следующее такое письмо жди на 2 год отношений))",
    },
    {
      date: "2027-07-03",
      title: "3 июля — 2 года вместе",
      text: "Вот и 2 год нашим отношениям. Слава богу мы пережили этот ебучий год который для меня кажется сейчас максимально убогим куча стресса загонов и всего такого. Надеюсь ты на 2 курс, а егэ я сдал и мы кайфуем максимально двоем без всяких Саш и Никит. Честно я так заебался от них на данный момент. Хотя сейчас только Ноябрь( Я хочу чтоб мы провели этот день так какого никогда не проводили, полюбому у меня для тебя какой то будет подарок) БЯЛлiahjdsahjkdh Я все свои мысли написал в письме на нг, интересно помнишь ты ли его? и заходим ли мы вообще на этот сайт. О а пускай будет такой вопрос, что было в письме на нг? Короче в общем скажу что крайне надеюсь на то что в этот день и вообще это лето от нас все отьебались мы съездили в Дагестан или в этот месяце,ну август крайний, у нас есть много денег и мы любим друг друга так же сильно. Как же я жду этого дня, хоть еще месяцев 8 хуй знает даже считать не хочу,мб чет еще сюда допишу пока не знаю) столько хочется сказать а вроде слов и нету",
    },
  ];

  const MOODS = [
    { icon: "😊", label: "Всё хорошо" },
    { icon: "🥰", label: "Счастлива" },
    { icon: "😴", label: "Устала" },
    { icon: "😔", label: "Грустно" },
    { icon: "😤", label: "Злюсь" },
  ];

  const MILESTONES = [
    { title: "30 дней", date: addDays(START_DATE, 30) },
    { title: "100 дней", date: addDays(START_DATE, 100) },
    { title: "200 дней", date: addDays(START_DATE, 200) },
    { title: "Полгода", date: new Date(2026, 0, 3) },
    { title: "300 дней", date: addDays(START_DATE, 300) },
    { title: "Год вместе", date: new Date(2026, 6, 3) },
    { title: "500 дней", date: addDays(START_DATE, 500) },
    { title: "Два года", date: new Date(2027, 6, 3) },
  ];

  // ---------- утилиты ----------
  function addDays(d, n) {
    const r = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    r.setDate(r.getDate() + n);
    return r;
  }

  function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function plural(n, forms) {
    const abs = Math.abs(n) % 100;
    const last = abs % 10;
    if (abs > 10 && abs < 20) return forms[2];
    if (last === 1) return forms[0];
    if (last >= 2 && last <= 4) return forms[1];
    return forms[2];
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function fmt(d) {
    return pad(d.getDate()) + "." + pad(d.getMonth() + 1) + "." + d.getFullYear();
  }

  function todayKey() {
    const n = new Date();
    return n.getFullYear() + "-" + pad(n.getMonth() + 1) + "-" + pad(n.getDate());
  }

  function lsGet(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function lsSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* хранилище недоступно */
    }
  }

  function send(subject, message) {
    if (!EMAIL_ENDPOINT) return Promise.resolve();
    return fetch(EMAIL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: subject,
        message: message,
        date: new Date().toLocaleString("ru-RU"),
      }),
    }).catch(function () {});
  }

  function $(id) {
    return document.getElementById(id);
  }

  // ---------- вход по слову ----------
  function setupGate() {
    if (!PASSCODE) return;
    try {
      if (localStorage.getItem("gateOK") === PASSCODE) return;
    } catch (e) {}

    const gate = document.createElement("div");
    gate.className = "gate";
    gate.innerHTML =
      '<div class="gate-box">' +
      "<p>Это только для нас двоих ♡</p>" +
      '<input type="text" id="gateInput" autocapitalize="off" spellcheck="false" placeholder="Введи слово" autocomplete="off" />' +
      '<button type="button" id="gateBtn">Войти</button>' +
      '<p class="gate-error" id="gateError"></p>' +
      "</div>";
    document.body.appendChild(gate);
    document.body.classList.add("gate-lock");

    const input = $("gateInput");
    const error = $("gateError");

    function check() {
      if (input.value.trim().replace(/\s+/g, " ").toLowerCase() === PASSCODE.toLowerCase()) {
        try {
          localStorage.setItem("gateOK", PASSCODE);
        } catch (e) {}
        gate.remove();
        document.body.classList.remove("gate-lock");
      } else {
        error.textContent = "Не то слово, попробуй ещё";
      }
    }

    $("gateBtn").addEventListener("click", check);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") check();
    });
  }

  // ---------- счётчики ----------
  function renderCounters() {
    const meet = $("meetValue");
    const anniv = $("annivValue");
    const annivNote = $("annivNote");
    const now = new Date();
    const today = startOfDay(now);

    if (meet) {
      const diff = (5 - today.getDay() + 7) % 7;
      if (diff === 0) {
        meet.textContent = "Сегодня встречаемся ♡";
      } else {
        const target = addDays(today, diff);
        const ms = target - now;
        const days = Math.floor(ms / 86400000);
        const hours = Math.floor((ms % 86400000) / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        let text = "";
        if (days > 0) text += days + " " + plural(days, ["день", "дня", "дней"]) + " ";
        text += hours + " ч " + minutes + " мин";
        meet.textContent = text;
      }
    }

    if (anniv) {
      let target = new Date(today.getFullYear(), 6, 3);
      if (target < today) target = new Date(today.getFullYear() + 1, 6, 3);
      const years = target.getFullYear() - START_DATE.getFullYear();
      if (target.getTime() === today.getTime()) {
        anniv.textContent = "Сегодня наша годовщина ♡";
        if (annivNote) annivNote.textContent = "";
      } else {
        const days = Math.round((target - today) / 86400000);
        anniv.textContent = days + " " + plural(days, ["день", "дня", "дней"]);
        if (annivNote) {
          annivNote.textContent =
            "3 июля " + target.getFullYear() + " — " + years + " " + plural(years, ["год", "года", "лет"]) + " вместе";
        }
      }
    }
  }

  // ---------- цели ----------
  function renderGoals() {
    const list = $("goalsList");
    if (!list) return;
    const done = lsGet("ourGoals", {});
    list.innerHTML = "";

    GOALS.forEach(function (goal, i) {
      const li = document.createElement("li");
      li.className = "goal" + (done[i] ? " is-done" : "");

      const label = document.createElement("label");
      const box = document.createElement("input");
      box.type = "checkbox";
      box.checked = !!done[i];

      const num = document.createElement("span");
      num.className = "goal-num";
      num.textContent = i + 1 + ")";

      const text = document.createElement("span");
      text.className = "goal-text";
      text.textContent = goal;

      box.addEventListener("change", function () {
        const state = lsGet("ourGoals", {});
        if (box.checked) {
          state[i] = true;
          send("Цель выполнена ♡", "Отмечена цель: " + goal);
        } else {
          delete state[i];
        }
        lsSet("ourGoals", state);
        li.classList.toggle("is-done", box.checked);
      });

      label.appendChild(box);
      label.appendChild(num);
      label.appendChild(text);
      li.appendChild(label);
      list.appendChild(li);
    });
  }

  // ---------- достижения ----------
  function renderAchievements() {
    const grid = $("achGrid");
    if (!grid) return;
    const now = new Date();
    grid.innerHTML = "";

    MILESTONES.forEach(function (m) {
      const unlocked = now >= m.date;
      const card = document.createElement("div");
      card.className = "ach" + (unlocked ? " is-unlocked" : "");

      const icon = document.createElement("span");
      icon.className = "ach-icon";
      icon.textContent = unlocked ? "♥" : "🔒";

      const title = document.createElement("p");
      title.className = "ach-title";
      title.textContent = m.title;

      const date = document.createElement("p");
      date.className = "ach-date";
      date.textContent = unlocked ? "открыто " + fmt(m.date) : "откроется " + fmt(m.date);

      card.appendChild(icon);
      card.appendChild(title);
      card.appendChild(date);
      grid.appendChild(card);
    });
  }

  // ---------- причины ----------
  function setupReasons() {
    const btn = $("reasonBtn");
    const text = $("reasonText");
    if (!btn || !text) return;
    let bag = [];

    function refill() {
      bag = REASONS.slice();
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = bag[i];
        bag[i] = bag[j];
        bag[j] = t;
      }
    }

    btn.addEventListener("click", function () {
      if (!bag.length) refill();
      text.textContent = bag.pop();
      text.classList.remove("pop");
      void text.offsetWidth;
      text.classList.add("pop");
      btn.textContent = "Ещё одну причину";
    });
  }

  // ---------- настроение и «скучаю» ----------
  function setupMood() {
    const row = $("moodRow");
    const status = $("moodStatus");
    const miss = $("missBtn");
    if (!row) return;

    const saved = lsGet("moodToday", null);
    const current = saved && saved.date === todayKey() ? saved.label : null;

    MOODS.forEach(function (m) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "mood-btn" + (current === m.label ? " is-active" : "");
      b.innerHTML = '<span class="mood-icon">' + m.icon + '</span><span class="mood-label">' + m.label + "</span>";
      b.addEventListener("click", function () {
        row.querySelectorAll(".mood-btn").forEach(function (x) {
          x.classList.remove("is-active");
        });
        b.classList.add("is-active");
        lsSet("moodToday", { date: todayKey(), label: m.label });
        send("Настроение дня", "Настроение: " + m.icon + " " + m.label);
        if (status) status.textContent = "Я узнал ♡";
      });
      row.appendChild(b);
    });

    if (miss) {
      miss.addEventListener("click", function () {
        const last = lsGet("missLast", 0);
        const now = Date.now();
        if (now - last < 30 * 60 * 1000) {
          if (status) status.textContent = "Я уже знаю, что ты скучаешь ♡";
          return;
        }
        lsSet("missLast", now);
        send("Скучаю ♡", "Она скучает по тебе ♡");
        if (status) status.textContent = "Отправлено. Я тоже скучаю ♡";
      });
    }
  }

  // ---------- капсула времени ----------
  function renderCapsules() {
    const list = $("capsuleList");
    if (!list) return;
    const now = new Date();
    list.innerHTML = "";

    CAPSULES.forEach(function (c) {
      const parts = c.date.split("-");
      const open = new Date(+parts[0], +parts[1] - 1, +parts[2]);
      const unlocked = now >= open;

      const card = document.createElement("div");
      card.className = "capsule-card" + (unlocked ? " is-open" : "");

      const title = document.createElement("h3");
      title.textContent = (unlocked ? "✉ " : "🔒 ") + c.title;

      const body = document.createElement("p");
      body.textContent = unlocked ? c.text : "Откроется " + fmt(open);

      card.appendChild(title);
      card.appendChild(body);
      list.appendChild(card);
    });
  }

  // ---------- атмосфера ----------
  function setupHearts() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.addEventListener("click", function (e) {
      const h = document.createElement("span");
      h.className = "fx-heart";
      h.textContent = "♥";
      h.style.left = e.clientX + "px";
      h.style.top = e.clientY + "px";
      document.body.appendChild(h);
      setTimeout(function () {
        h.remove();
      }, 1100);
    });
  }

  function setupReveal() {
    if (!("IntersectionObserver" in window)) return;
    const targets = document.querySelectorAll(".story, .songs, .games, .block");
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("fx-in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    targets.forEach(function (t) {
      t.classList.add("fx");
      io.observe(t);
    });
  }

  function setupToTop() {
    const btn = $("toTop");
    if (!btn) return;
    window.addEventListener(
      "scroll",
      function () {
        btn.classList.toggle("is-visible", window.scrollY > 600);
      },
      { passive: true }
    );
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Песни играют подряд: когда одна закончилась, включается следующая.
  function setupPlaylist() {
    const cards = Array.prototype.slice.call(document.querySelectorAll(".song-card"));
    const audios = cards.map(function (c) {
      return c.querySelector("audio");
    });
    audios.forEach(function (a, i) {
      if (!a) return;
      a.addEventListener("ended", function () {
        setTimeout(function () {
          const playing = audios.some(function (x) {
            return x && !x.paused;
          });
          if (playing) return;
          const nextCard = cards[i + 1];
          const btn = nextCard && nextCard.querySelector(".play-btn");
          if (btn) btn.click();
        }, 80);
      });
    });
  }

  function init() {
    setupGate();
    renderCounters();
    setInterval(renderCounters, 30000);
    renderGoals();
    renderAchievements();
    setupReasons();
    setupMood();
    renderCapsules();
    setupHearts();
    setupReveal();
    setupToTop();
    setupPlaylist();
  }

  init();
})();
