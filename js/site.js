(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const drawer = document.getElementById("drawer");
  const layers = document.querySelectorAll("[data-parallax]");

  if (reduce) document.documentElement.classList.add("reduced");

  function setScrolled() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }
  setScrolled();
  window.addEventListener("scroll", setScrolled, { passive: true });

  function closeNav() {
    document.body.classList.remove("nav-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    if (drawer) drawer.hidden = true;
  }

  function openNav() {
    document.body.classList.add("nav-open");
    if (toggle) toggle.setAttribute("aria-expanded", "true");
    if (drawer) drawer.hidden = false;
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      if (document.body.classList.contains("nav-open")) closeNav();
      else openNav();
    });
  }

  document.querySelectorAll(".drawer a, .nav a").forEach(function (a) {
    a.addEventListener("click", closeNav);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  if (reduce || !layers.length) return;

  var ticking = false;
  function update() {
    var vh = window.innerHeight || 1;
    layers.forEach(function (el) {
      var depth = parseFloat(el.getAttribute("data-parallax") || "0");
      if (!depth) return;
      var rect = el.getBoundingClientRect();
      var mid = rect.top + rect.height / 2;
      var delta = (mid - vh / 2) * depth;
      el.style.transform = "translate3d(0," + delta.toFixed(2) + "px,0)";
    });
    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
})();
