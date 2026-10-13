/* JSL Cell Imports · interações */
(() => {
  const WA = "5547988081723";
  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Reveal ---------- */
  const revealEls = $$("[data-reveal]");
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Header + menu ---------- */
  const header = $(".header");
  const burger = $(".burger");
  const nav = $("#nav");
  const closeMenu = () => {
    nav.classList.remove("is-open");
    header.classList.remove("menu-open");
    burger.setAttribute("aria-expanded", "false");
  };
  burger.addEventListener("click", () => {
    const open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    header.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", String(open));
  });
  $$("a", nav).forEach((a) => a.addEventListener("click", closeMenu));

  // link ativo
  const links = $$('.nav a[href^="#"]');
  const sections = links.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const navIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => navIO.observe(s));
  }

  /* ---------- Cenas guiadas por scroll ---------- */
  const hero = $("#hero");
  const phone = $("#phone");
  const maskRect = $("#crackMaskRect");
  const scan = $("#scan");
  const osCard = $("#osCard");
  const hint = $(".hero__hint");
  const layers = $("#layers");
  const steps = $("#steps");
  const stepItems = steps ? $$(".step", steps) : [];
  const fab = $(".fab");

  const SCREEN_TOP = 16;
  const SCREEN_H = 578;
  let osDone = null;

  function setOsCard(done) {
    if (osDone === done) return;
    osDone = done;
    osCard.classList.toggle("is-done", done);
    $$("[data-done]", osCard).forEach((el) => {
      if (!el.dataset.orig) el.dataset.orig = el.textContent;
      el.textContent = done ? el.dataset.done : el.dataset.orig;
    });
  }

  function heroScene(vh) {
    if (!hero || !phone) return;
    // no desktop o reparo acompanha o scroll da página; no mobile o celular fica abaixo
    // do texto, então o reparo começa quando ele entra na tela
    const stacked = window.innerWidth <= 920;
    let p;
    if (reduce) p = 1;
    else if (stacked) {
      const pr = phone.getBoundingClientRect();
      p = clamp((vh * 0.78 - pr.top) / (pr.height * 0.85));
    } else p = clamp(window.scrollY / (hero.offsetHeight * 0.55));

    const y = SCREEN_TOP + p * (SCREEN_H + 70);
    maskRect.setAttribute("y", y.toFixed(1));
    scan.setAttribute("transform", `translate(0 ${y.toFixed(1)})`);
    phone.style.setProperty("--scan-on", p > 0.005 && p < 0.995 ? 1 : 0);
    phone.style.setProperty("--heal", clamp((p - 0.7) / 0.3).toFixed(3));
    setOsCard(p > 0.92);
    if (hint) hint.classList.toggle("is-hidden", window.scrollY > 40);
  }

  function layersScene(vh) {
    if (!layers) return;
    const r = layers.getBoundingClientRect();
    const p = reduce ? 1 : clamp((vh * 0.9 - r.top) / (r.height * 0.85));
    layers.style.setProperty("--p", p.toFixed(3));
    layers.style.setProperty("--swap", p > 0.88 ? 1 : 0);
  }

  function stepsScene(vh) {
    if (!steps) return;
    const r = steps.getBoundingClientRect();
    const f = reduce ? 1 : clamp((vh * 0.75 - r.top) / r.height);
    steps.style.setProperty("--fill", f.toFixed(3));
    const vertical = window.innerWidth <= 920;
    stepItems.forEach((s, i) => {
      const at = vertical ? (s.offsetTop + 28) / r.height : i / (stepItems.length - 1 || 1);
      s.classList.toggle("is-lit", f >= at - 0.02);
    });
  }

  function fabScene() {
    if (!fab) return;
    const limit = hero ? hero.offsetHeight * 0.6 : 320;
    fab.classList.toggle("is-on", window.scrollY > limit);
  }

  let ticking = false;
  function frame() {
    ticking = false;
    const vh = window.innerHeight;
    header.classList.toggle("is-scrolled", window.scrollY > 10);
    heroScene(vh);
    layersScene(vh);
    stepsScene(vh);
    fabScene();
  }
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(frame);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  frame();

  /* ---------- Tilt do celular ---------- */
  if (!reduce && hero && phone && window.matchMedia("(hover: hover)").matches) {
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      phone.style.setProperty("--ry", `${(-10 + x * 14).toFixed(2)}deg`);
      phone.style.setProperty("--rx", `${(4 - y * 10).toFixed(2)}deg`);
    });
    hero.addEventListener("pointerleave", () => {
      phone.style.removeProperty("--ry");
      phone.style.removeProperty("--rx");
    });
  }

  /* ---------- Lanterna nos cards ---------- */
  $$(".card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  /* ---------- Contadores ---------- */
  const fmt = (n, d) => n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });
  const counters = $$("[data-count]");
  const runCount = (el) => {
    const end = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || "0", 10);
    if (reduce) { el.textContent = fmt(end, dec); return; }
    const dur = 1400;
    const t0 = performance.now();
    const tick = (t) => {
      const k = clamp((t - t0) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(end * eased, dec);
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window) {
    const cIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            runCount(e.target);
            cIO.unobserve(e.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((c) => cIO.observe(c));
  }

  /* ---------- Aberto agora (horário de Itajaí) ---------- */
  const openNow = $("#openNow");
  if (openNow) {
    try {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Sao_Paulo",
        weekday: "short",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      }).formatToParts(new Date());
      const get = (t) => parts.find((p) => p.type === t)?.value;
      const day = get("weekday");
      const mins = (parseInt(get("hour"), 10) % 24) * 60 + parseInt(get("minute"), 10);
      const weekday = ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(day);
      const open =
        (weekday && ((mins >= 540 && mins < 720) || (mins >= 810 && mins < 1140))) ||
        (day === "Sat" && mins >= 540 && mins < 720);
      openNow.classList.add(open ? "is-open" : "is-closed");
      const t = $(".open-now__t", openNow);
      t.innerHTML = open
        ? "<b>Aberto agora</b> · Seg a sex 9h–12h e 13h30–19h · Sáb 9h–12h"
        : "<b>Fechado agora</b> · Chama no WhatsApp que a gente responde na abertura";
    } catch (_) { /* mantém o texto padrão */ }
  }

  /* ---------- Formulário → WhatsApp ---------- */
  const form = $("#quoteForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const modelo = (data.get("modelo") || "").toString().trim();
      const input = form.elements.modelo;
      if (!modelo) {
        input.classList.add("is-invalid");
        input.focus();
        return;
      }
      input.classList.remove("is-invalid");
      const detalhe = (data.get("detalhe") || "").toString().trim();
      const lines = [
        "Oi! Vim pelo site e quero um orçamento.",
        `Aparelho: ${data.get("marca")} ${modelo}`,
        `Problema: ${data.get("problema")}`,
      ];
      if (detalhe) lines.push(`Detalhes: ${detalhe}`);
      track("wa_form");
      window.open(`https://wa.me/${WA}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
    });
    form.elements.modelo.addEventListener("input", (e) => e.target.classList.remove("is-invalid"));
  }

  /* ---------- Eventos de conversão (GA4/GTM, se instalado) ---------- */
  function track(name) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "lead_click", lead_source: name });
    if (typeof window.gtag === "function") window.gtag("event", "generate_lead", { method: name });
  }
  $$("[data-track]").forEach((el) => {
    if (el.tagName === "A") el.addEventListener("click", () => track(el.dataset.track));
  });

  /* ---------- Ano ---------- */
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
})();
