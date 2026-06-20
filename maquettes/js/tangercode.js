/* ============================================================
   TANGER CODE — Interactions
   ============================================================ */
(function () {
  "use strict";
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  const stored = localStorage.getItem("tc-theme");
  if (stored) root.setAttribute("data-theme", stored);
  function toggleTheme() {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem("tc-theme", next);
    syncThemeIcon();
  }
  function syncThemeIcon() {
    const dark = root.getAttribute("data-theme") !== "light";
    $$("[data-theme-icon]").forEach((el) => {
      el.innerHTML = dark
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8"/></svg>';
    });
  }
  $$("[data-theme-toggle]").forEach((b) => b.addEventListener("click", toggleTheme));
  syncThemeIcon();

  /* ---------- Header scroll ---------- */
  const header = $(".site-header");
  const onScroll = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 24);
    const tt = $(".to-top");
    if (tt) tt.classList.toggle("show", window.scrollY > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile drawer ---------- */
  const drawer = $(".mobile-drawer");
  $$("[data-drawer-open]").forEach((b) => b.addEventListener("click", () => { drawer.classList.add("open"); document.body.style.overflow = "hidden"; }));
  $$("[data-drawer-close]").forEach((b) => b.addEventListener("click", () => { drawer.classList.remove("open"); document.body.style.overflow = ""; }));
  if (drawer) $$("a", drawer).forEach((a) => a.addEventListener("click", () => { drawer.classList.remove("open"); document.body.style.overflow = ""; }));

  /* ---------- Language dropdown ---------- */
  const lang = $(".lang");
  if (lang) {
    $("[data-lang-toggle]", lang).addEventListener("click", (e) => { e.stopPropagation(); lang.classList.toggle("open"); });
    document.addEventListener("click", () => lang.classList.remove("open"));
  }

  /* ---------- Scroll reveal ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const host = e.target;
        if (host.hasAttribute("data-stagger")) {
          [...host.children].forEach((c, i) => { c.style.setProperty("--d", i * 80 + "ms"); c.classList.add("reveal", "in"); });
        }
        host.classList.add("in");
        io.unobserve(host);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  $$(".reveal, [data-stagger]").forEach((el) => io.observe(el));

  /* ---------- Animated counters ---------- */
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      if (reduced) { el.textContent = target + suffix; cio.unobserve(el); return; }
      const dur = 1800, t0 = performance.now();
      const tick = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  }, { threshold: 0.5 });
  $$("[data-count]").forEach((el) => cio.observe(el));

  /* ---------- Generic filter (portfolio) ---------- */
  $$("[data-filter-group]").forEach((group) => {
    const pills = $$("[data-filter]", group);
    const targets = $$("[data-cat]", $("#" + group.dataset.filterGroup) || document);
    pills.forEach((p) => p.addEventListener("click", () => {
      pills.forEach((x) => x.classList.remove("active"));
      p.classList.add("active");
      const f = p.dataset.filter;
      targets.forEach((t) => {
        const show = f === "all" || t.dataset.cat.split(" ").includes(f);
        t.style.display = show ? "" : "none";
      });
    }));
  });

  /* ---------- Tabs (currency, stack) ---------- */
  $$("[data-tabs]").forEach((tabs) => {
    const btns = $$("[data-tab]", tabs);
    btns.forEach((b) => b.addEventListener("click", () => {
      btns.forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      const val = b.dataset.tab;
      tabs.dispatchEvent(new CustomEvent("tabchange", { detail: val }));
    }));
  });

  /* ---------- Currency switch ---------- */
  const currencyTabs = $("[data-currency]");
  if (currencyTabs) {
    const rates = { MAD: 1, EUR: 0.092, USD: 0.10 };
    const symbols = { MAD: " MAD", EUR: " €", USD: " $" };
    currencyTabs.addEventListener("tabchange", (e) => {
      const cur = e.detail;
      $$("[data-mad]").forEach((el) => {
        const base = parseFloat(el.dataset.mad);
        const v = Math.round(base * rates[cur] / (cur === "MAD" ? 1 : 1));
        const conv = Math.round(base * rates[cur]);
        el.textContent = (cur === "MAD" ? base.toLocaleString("fr-FR") : conv.toLocaleString("fr-FR")) + symbols[cur];
      });
    });
  }

  /* ---------- Testimonials carousel ---------- */
  const carousel = $("[data-carousel]");
  if (carousel) {
    const track = $(".tst-track", carousel);
    const slides = $$(".tst-slide", carousel);
    const dotsWrap = $("[data-dots]", carousel);
    let idx = 0;
    const perView = () => (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1);
    let pv = perView();
    const pages = () => Math.max(1, slides.length - pv + 1);
    function buildDots() {
      dotsWrap.innerHTML = "";
      for (let i = 0; i < pages(); i++) {
        const d = document.createElement("button");
        d.className = "tst-dot" + (i === idx ? " active" : "");
        d.setAttribute("aria-label", "Témoignage " + (i + 1));
        d.addEventListener("click", () => { idx = i; update(); });
        dotsWrap.appendChild(d);
      }
    }
    function update() {
      pv = perView();
      idx = Math.min(idx, pages() - 1);
      const slideW = slides[0].getBoundingClientRect().width + 24;
      track.style.transform = `translateX(${-idx * slideW}px)`;
      $$(".tst-dot", dotsWrap).forEach((d, i) => d.classList.toggle("active", i === idx));
    }
    $("[data-prev]", carousel)?.addEventListener("click", () => { idx = (idx - 1 + pages()) % pages(); update(); });
    $("[data-next]", carousel)?.addEventListener("click", () => { idx = (idx + 1) % pages(); update(); });
    buildDots(); update();
    let timer = reduced ? null : setInterval(() => { idx = (idx + 1) % pages(); update(); }, 5500);
    carousel.addEventListener("mouseenter", () => timer && clearInterval(timer));
    window.addEventListener("resize", () => { buildDots(); update(); });
  }

  /* ---------- Accordion ---------- */
  $$("[data-accordion] .acc-item").forEach((item) => {
    $(".acc-head", item).addEventListener("click", () => {
      const open = item.classList.contains("open");
      $$("[data-accordion] .acc-item").forEach((i) => i.classList.remove("open"));
      if (!open) item.classList.add("open");
    });
  });

  /* ---------- Custom cursor ---------- */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduced) {
    const ring = document.createElement("div");
    ring.className = "cursor-ring";
    document.body.appendChild(ring);
    let rx = 0, ry = 0, x = 0, y = 0;
    window.addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; ring.classList.add("active"); });
    const loop = () => { rx += (x - rx) * 0.18; ry += (y - ry) * 0.18; ring.style.left = rx + "px"; ring.style.top = ry + "px"; requestAnimationFrame(loop); };
    loop();
    document.addEventListener("mouseover", (e) => {
      ring.classList.toggle("hover", !!e.target.closest("a, button, .card-grad, .pill"));
    });
  }

  /* ---------- Cookie banner ---------- */
  const cookie = $(".cookie");
  if (cookie && !localStorage.getItem("tc-cookie")) {
    setTimeout(() => cookie.classList.add("show"), 1600);
    $("[data-cookie-accept]", cookie)?.addEventListener("click", () => { localStorage.setItem("tc-cookie", "1"); cookie.classList.remove("show"); });
  }

  /* ---------- Contact form (mock) ---------- */
  $$("[data-mock-form]").forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = $("[type=submit]", f);
    const old = btn.innerHTML;
    btn.innerHTML = "Envoyé ✓"; btn.style.background = "var(--success)";
    setTimeout(() => { btn.innerHTML = old; btn.style.background = ""; f.reset(); }, 2400);
  }));
})();
