(function () {
  const toggle = document.getElementById("letterToggle");
  const panel = document.getElementById("letterPanel");
  const closeBtn = document.getElementById("letterClose");

  if (!toggle || !panel) return;

  function openPanel() {
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
  }

  function closePanel() {
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
  }

  toggle.addEventListener("click", openPanel);
  if (closeBtn) closeBtn.addEventListener("click", closePanel);

  panel.addEventListener("click", (e) => {
    if (e.target === panel) closePanel();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePanel();
  });
})();
