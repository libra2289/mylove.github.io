(function () {
  const STORAGE_KEY = "dailyQuestionAnswers";

  // Та же ссылка Formspree, что и для вкладки с записками — чтобы ответы
  // тоже приходили тебе на почту. Если уже вставлял её в notes.js, скопируй
  // сюда то же значение.
  const EMAIL_ENDPOINT = "https://formspree.io/f/xvkgpnko";

  const QUESTIONS = [
    "Какой момент из нашего прошлого ты бы хотела пережить ещё раз?",
    "Каким ты представляешь наш идеальный день через 5 лет?",
    "Что тебе больше всего запомнилось из нашей первой встречи?",
    "Куда бы ты хотела съездить вместе, где мы ещё не были?",
    "Какая мелочь во мне делает тебя счастливее?",
    "О чём ты мечтаешь, но ещё не говорила мне?",
    "Какой наш общий момент ты бы назвала самым смешным?",
    "Каким ты видишь наш дом в будущем?",
    "Что для тебя значит слово \"дом\"?",
    "Какую традицию ты хотела бы, чтобы у нас появилась?",
    "Если бы можно было вернуться в один день нашей истории — какой день ты бы выбрала?",
    "Какая наша будущая поездка тебе снится чаще всего?",
    "Что тебя удивило во мне, когда мы только начали общаться?",
    "Каким ты представляешь наш совместный отпуск мечты?",
    "Какая песня напоминает тебе о нас?",
    "Что из того, что мы ещё не пробовали вместе, тебе хочется попробовать?",
    "Какой подарок от меня ты запомнила больше всего?",
    "Каким было твоё самое первое впечатление обо мне?",
    "Где бы ты хотела встретить закат вместе со мной?",
    "Какую нашу привычку вместе ты бы хотела сохранить навсегда?",
    "Что бы ты сказала себе в день нашей первой встречи, зная всё, что будет дальше?",
    "Каким ты видишь нас через 10 лет?",
    "Какой самый уютный вечер с нами ты помнишь?",
    "Если бы у нас был общий питомец, кто бы это был?",
    "Что из нашего прошлого ты бы хотела показать своим друзьям — как доказательство, что мы классные?",
    "Какая наша совместная цель важна для тебя больше всего?",
    "Какой город ты бы выбрала, чтобы там пожить с нами вдвоём хотя бы месяц?",
    "Что тебе даёт ощущение, что я рядом, даже когда меня физически нет?",
    "Какой был самый спонтанный момент, который мы пережили вместе?",
    "Каким ты представляешь наш следующий совместный праздник?",
  ];

  const toggle = document.getElementById("dqToggle");
  const panel = document.getElementById("dqPanel");
  const closeBtn = document.getElementById("dqClose");
  const questionEl = document.getElementById("dqQuestion");
  const textarea = document.getElementById("dqTextarea");
  const saveBtn = document.getElementById("dqSave");
  const statusEl = document.getElementById("dqStatus");
  const list = document.getElementById("dqList");

  if (!toggle || !panel || !questionEl || !textarea || !saveBtn || !list) return;

  function todayKey() {
    const now = new Date();
    return (
      now.getFullYear() +
      "-" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(now.getDate()).padStart(2, "0")
    );
  }

  function dayIndex() {
    const epoch = new Date(2025, 0, 1).getTime();
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const days = Math.floor((startOfToday - epoch) / 86400000);
    return ((days % QUESTIONS.length) + QUESTIONS.length) % QUESTIONS.length;
  }

  function todaysQuestion() {
    return QUESTIONS[dayIndex()];
  }

  function loadAnswers() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveAnswers(answers) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch (e) {
      /* localStorage недоступен */
    }
  }

  function formatDate(key) {
    const [y, m, d] = key.split("-");
    return `${d}.${m}.${y}`;
  }

  function renderList() {
    const answers = loadAnswers().slice().reverse();
    list.innerHTML = "";
    answers.forEach((entry) => {
      const item = document.createElement("div");
      item.className = "dq-item";

      const time = document.createElement("time");
      time.textContent = formatDate(entry.date);

      const q = document.createElement("p");
      q.className = "dq-item-q";
      q.textContent = entry.question;

      const a = document.createElement("p");
      a.className = "dq-item-a";
      a.textContent = entry.answer;

      item.appendChild(time);
      item.appendChild(q);
      item.appendChild(a);
      list.appendChild(item);
    });
  }

  function loadTodayIntoForm() {
    const question = todaysQuestion();
    questionEl.textContent = question;

    const answers = loadAnswers();
    const existing = answers.find((a) => a.date === todayKey());
    if (existing) {
      textarea.value = existing.answer;
      statusEl.textContent = "Ты уже отвечала сегодня — можно дополнить и отправить снова.";
    } else {
      textarea.value = "";
      statusEl.textContent = "";
    }
  }

  function openPanel() {
    loadTodayIntoForm();
    renderList();
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
    const answer = textarea.value.trim();
    if (!answer) return;

    const question = todaysQuestion();
    const date = todayKey();

    const answers = loadAnswers().filter((a) => a.date !== date);
    answers.push({ date, question, answer });
    saveAnswers(answers);
    renderList();
    statusEl.textContent = "Отправлено ♡";

    if (EMAIL_ENDPOINT) {
      fetch(EMAIL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ question: question, answer: answer, date: formatDate(date) }),
      }).catch(function () {
        /* тихо игнорируем ошибки сети, ответ всё равно сохранён локально */
      });
    }
  });
})();
