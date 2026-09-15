const START_DATE = new Date(2025, 6, 3, 0, 0, 0);

const events = [
  {
    date: "03.07.2025",
    title: "Начало нашей истории",
    text: "До сих пор стыдно за то как я предложил тебе все начать)",
  },
  {
    date: "03.08.2025",
    title: "Первый поцелуй",
    text: "На лавочке в зеленограде",
  },
  {
    date: "30.10.2025",
    title: "Первый концерт вместе",
    text: "Я не дождался тебя и напился в очереди, и так же совсем другая квартира)",
  },
  {
    date: "01.01.2026",
    title: "Новый год вместе",
    text: "На квартире больше 12 человек, как она вообще осталась жива?",
  },
  {
    date: "03.07.2026",
    title: "Год нашей истории",
    text: "У тебя выпускной я не поехал на шашлыки, чтобы подготовить все к твоему приходу)",
  },
];

const forms = {
  years: ["год", "года", "лет"],
  months: ["месяц", "месяца", "месяцев"],
  days: ["день", "дня", "дней"],
  hours: ["час", "часа", "часов"],
  minutes: ["минута", "минуты", "минут"],
  seconds: ["секунда", "секунды", "секунд"],
};

function plural(n, [one, few, many]) {
  const abs = Math.abs(n) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (last === 1) return one;
  if (last >= 2 && last <= 4) return few;
  return many;
}

function elapsedSince(from, to) {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();
  let hours = to.getHours() - from.getHours();
  let minutes = to.getMinutes() - from.getMinutes();
  let seconds = to.getSeconds() - from.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }
  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }
  if (hours < 0) {
    hours += 24;
    days -= 1;
  }
  if (days < 0) {
    const previous = new Date(to.getFullYear(), to.getMonth(), 0);
    days += previous.getDate();
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return { years, months, days, hours, minutes, seconds };
}

function renderTimer() {
  const now = new Date();
  const parts = elapsedSince(START_DATE, now);

  Object.entries(parts).forEach(([key, value]) => {
    const number = document.querySelector(`[data-unit="${key}"]`);
    const label = document.querySelector(`[data-label="${key}"]`);
    if (number) number.textContent = String(value);
    if (label) label.textContent = plural(value, forms[key]);
  });
}

function toIsoDate(ruDate) {
  const [day, month, year] = ruDate.split(".");
  return `${year}-${month}-${day}`;
}

function renderTimeline() {
  const list = document.getElementById("timeline");
  list.innerHTML = events
    .map(
      (event) => `
        <li class="event">
          <time datetime="${toIsoDate(event.date)}">${event.date}</time>
          <h3>${event.title}</h3>
          <p>${event.text}</p>
        </li>
      `
    )
    .join("");
}

function setupSongPlayers() {
  const cards = document.querySelectorAll(".song-card");
  let current = null;

  cards.forEach((card) => {
    const audio = card.querySelector("audio");
    const button = card.querySelector(".play-btn");
    if (!audio || !button) return;

    button.addEventListener("click", () => {
      if (audio.paused) {
        if (current && current !== audio) {
          current.pause();
        }
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    });

    audio.addEventListener("play", () => {
      current = audio;
      card.classList.add("playing");
    });

    audio.addEventListener("pause", () => {
      card.classList.remove("playing");
    });

    audio.addEventListener("ended", () => {
      card.classList.remove("playing");
    });
  });
}

function setupRevealButton() {
  const button = document.getElementById("revealBtn");
  const message = document.getElementById("revealMessage");
  if (!button || !message) return;

  button.addEventListener("click", () => {
    message.classList.add("visible");
  });
}

function setupLightbox() {
  const photos = Array.from(document.querySelectorAll(".photos .photo-slot img"));
  if (!photos.length) return;

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const closeBtn = document.getElementById("lightboxClose");
  const prevBtn = document.getElementById("lightboxPrev");
  const nextBtn = document.getElementById("lightboxNext");

  let currentIndex = 0;

  function show(index) {
    currentIndex = (index + photos.length) % photos.length;
    lightboxImg.src = photos[currentIndex].src;
    lightboxImg.alt = photos[currentIndex].alt || "";
  }

  function open(index) {
    show(index);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  }

  function close() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
  }

  photos.forEach((img, index) => {
    img.addEventListener("click", () => open(index));
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => show(currentIndex - 1));
  nextBtn.addEventListener("click", () => show(currentIndex + 1));

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("open")) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") show(currentIndex - 1);
    if (event.key === "ArrowRight") show(currentIndex + 1);
  });
}

renderTimeline();
renderTimer();
setInterval(renderTimer, 1000);
setupSongPlayers();
setupRevealButton();
setupLightbox();
