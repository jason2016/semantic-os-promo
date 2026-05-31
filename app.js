/* ============================================================
   Semantic OS — Promo v3
   One product. 5 simple steps:
   chaos → organize → relationships → opportunity → action
   Knowledge Map AI appears only at the final CTA.
   Pure HTML/CSS/JS + GSAP (CDN). No framework, no backend.
   ============================================================ */

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============================================================
     DATA
     ============================================================ */

  // Scattered trade-show files (Step 1)
  const FILES = [
    { name: "Visitor List.xlsx", ico: "📊", color: "#8b5cf6" },
    { name: "Partner Email.msg", ico: "✉️", color: "#34d399" },
    { name: "Booth Plan.pdf", ico: "📐", color: "#fb7185" },
    { name: "Campaign Notes.md", ico: "📝", color: "#a855f7" },
    { name: "Follow-up Notes.docx", ico: "📄", color: "#0ea5e9" },
    { name: "WhatsApp Messages", ico: "💬", color: "#34d399" },
    { name: "Business Cards", ico: "🪪", color: "#6366f1" },
    { name: "Meeting Notes", ico: "🗒️", color: "#0ea5e9" },
    { name: "Pricing Request", ico: "💶", color: "#0ea5e9" },
    { name: "Badge Scans.csv", ico: "📋", color: "#8b5cf6" }
  ];

  // Structured information sources (Step 2) — CSS Grid, each with a clean doc list
  const SOURCES = [
    { name: "Exhibitor Files", ico: "📁", color: "#6366f1", docs: ["Exhibitor Pack.pdf", "Business Cards", "Stand Contract.pdf"] },
    { name: "Visitor Lists", ico: "📋", color: "#8b5cf6", docs: ["Visitor List.xlsx", "Visitor Spreadsheet", "Badge Scans.csv"] },
    { name: "Campaign Notes", ico: "📣", color: "#a855f7", docs: ["Campaign Notes.md", "Spring 2026 Brief", "Ad Copy.md"] },
    { name: "Partner Emails", ico: "✉️", color: "#34d399", docs: ["Partner Email.msg", "BizMedia Thread", "WhatsApp Messages"] },
    { name: "Booth Plans", ico: "🏗️", color: "#fb7185", docs: ["Booth Plan.pdf", "Floor Map.pdf", "Setup Checklist"] },
    { name: "Follow-up Notes", ico: "🗂️", color: "#0ea5e9", docs: ["Follow-up Notes.docx", "Meeting Notes", "Pricing Request"] }
  ];

  // Records where Marie Chen appears (Step 3)
  const REL_ITEMS = [
    { name: "Visitor List", meta: "Row 42 · Marie Chen", ico: "📋", color: "#8b5cf6", x: 0.16, y: 0.32 },
    { name: "Partner Email", meta: "From: Marie Chen", ico: "✉️", color: "#34d399", x: 0.84, y: 0.32 },
    { name: "Pricing Request", meta: "Submitted by M. Chen", ico: "💶", color: "#0ea5e9", x: 0.16, y: 0.66 },
    { name: "Meeting Notes", meta: "Re: Marie Chen", ico: "🗒️", color: "#fb7185", x: 0.84, y: 0.66 }
  ];

  const REL_CHIPS = ["Same person detected", "Relationship created"];

  // Marie Chen's footprint (Step 4)
  const FOOTPRINT = [
    "Visited Booth B12",
    "Opened Campaign Email",
    "Requested Pricing",
    "Budget Mentioned",
    "Follow-up Pending"
  ];

  /* ============================================================
     SCENES
     ============================================================ */
  const STEPS = ["Chaos", "Organize", "Relationships", "Opportunity", "Action"];

  const SCENES = [
    {
      eyebrow: "Step 1 · The problem",
      title: "Too Much Information. Not Enough Understanding.",
      sub: "Trade shows generate emails, visitor lists, notes, documents and conversations. Most teams lose track of the relationships.",
      msg: "",
      widget: "scatter",
      primary: { label: "Organize with Semantic OS →", go: 2 }
    },
    {
      eyebrow: "Step 2 · Semantic OS",
      title: "Semantic OS Organizes Information.",
      sub: "Files are grouped into structured memory.",
      msg: "Semantic OS does not simply store files. It builds structured memory.",
      widget: "sources",
      primary: { label: "Discover Relationships →", go: 3 }
    },
    {
      eyebrow: "Step 3 · Relationships",
      title: "Relationships Matter More Than Documents.",
      sub: "Marie Chen appears across a visitor list, an email, a pricing request and meeting notes.",
      msg: "Traditional knowledge bases store documents. Semantic OS stores documents and relationships.",
      widget: "relations",
      primary: { label: "Reveal Opportunity →", go: 4 }
    },
    {
      eyebrow: "Step 4 · Opportunity",
      title: "Hidden Opportunities Become Visible.",
      sub: "Semantic OS connects Marie Chen's activity into one high-value signal.",
      msg: "When relationships become visible, opportunities emerge.",
      widget: "opportunity",
      primary: { label: "Generate Action →", go: 5 }
    },
    {
      eyebrow: "Step 5 · Action",
      title: "Turn Knowledge Into Action.",
      sub: "Every record becomes a clear, recommended next step.",
      msg: "Semantic OS turns memory into action.",
      widget: "action",
      primary: { label: "Explore the relationships ↓", scrollTo: "#explore" }
    }
  ];

  let current = 0;

  /* ============================================================
     DOM REFS
     ============================================================ */
  const $ = (s) => document.querySelector(s);
  const stepperEl = $("[data-stepper]");
  const eyebrow = $("[data-eyebrow]");
  const titleEl = $("[data-title]");
  const subEl = $("[data-sub]");
  const msgEl = $("[data-msg]");

  const widgets = {};
  document.querySelectorAll(".widget").forEach((w) => (widgets[w.dataset.w] = w));

  const field = $("[data-field]");
  const sourcesGrid = $("[data-sources]");
  const relEdges = $("[data-rel-edges]");
  const relNodes = $("[data-rel-nodes]");
  const relStatus = $("[data-rel-status]");
  const footprintEl = $("[data-footprint]");

  const ctaPrimary = $("[data-cta-primary]");
  const backBtn = $("[data-back]");
  const replayBtn = $("[data-replay-demo]");
  const modal = $("[data-modal]");
  const copyToast = $("[data-copy-toast]");
  const EMAIL = "jason.lu@futushow.com";

  /* ============================================================
     CONTROLLER
     ============================================================ */
  function buildStepper() {
    stepperEl.innerHTML = "";
    STEPS.forEach((name, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "step";
      b.innerHTML = '<span class="step__dot">' + (i + 1) + "</span><span class=\"step__name\">" + name + "</span>";
      b.addEventListener("click", () => goTo(i));
      stepperEl.appendChild(b);
    });
  }

  function setStepper(idx) {
    stepperEl.querySelectorAll(".step").forEach((el, i) => {
      el.classList.toggle("is-active", i === idx);
      el.classList.toggle("is-done", i < idx);
    });
  }

  function setHeadline(s) {
    const els = [eyebrow, titleEl, subEl, msgEl];
    gsap.to(els, {
      opacity: 0, y: -8, duration: 0.25, stagger: 0.04,
      onComplete: () => {
        eyebrow.textContent = s.eyebrow;
        titleEl.textContent = s.title;
        subEl.textContent = s.sub;
        msgEl.textContent = s.msg || "";
        gsap.fromTo(els, { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" });
      }
    });
  }

  function showWidget(name) {
    Object.entries(widgets).forEach(([k, el]) => {
      if (k === name) {
        el.classList.add("is-active");
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" });
      } else {
        el.classList.remove("is-active");
      }
    });
  }

  function setCTA(s) {
    ctaPrimary.textContent = s.primary.label;
    ctaPrimary.onclick = () => {
      if (s.primary.go) goTo(s.primary.go - 1);
      else if (s.primary.scrollTo) document.querySelector(s.primary.scrollTo).scrollIntoView({ behavior: "smooth" });
    };
    backBtn.hidden = current === 0;
  }

  function goTo(idx) {
    idx = Math.max(0, Math.min(SCENES.length - 1, idx));
    const from = current;
    current = idx;
    const s = SCENES[idx];

    setStepper(idx);
    setHeadline(s);
    showWidget(s.widget);
    setCTA(s);

    if (s.widget === "scatter") enterScatter();
    else if (s.widget === "sources") enterSources();
    else if (s.widget === "relations") enterRelations();
    else if (s.widget === "opportunity") enterOpportunity();
    else if (s.widget === "action") enterAction();
  }

  /* ============================================================
     STEP 1 — scattered files
     ============================================================ */
  let chipEls = [];
  let floatTweens = [];

  function buildChips() {
    field.innerHTML = "";
    chipEls = FILES.map((f) => {
      const el = document.createElement("div");
      el.className = "filechip";
      el.style.setProperty("--chip-color", f.color);
      el.innerHTML =
        '<span class="filechip__ico">' + f.ico + "</span>" +
        '<span class="filechip__name">' + f.name + "</span>";
      field.appendChild(el);
      return el;
    });
  }

  function killFloat() { floatTweens.forEach((t) => t.kill()); floatTweens = []; }

  function enterScatter() {
    if (!chipEls.length) buildChips();
    killFloat();
    const r = field.getBoundingClientRect();
    const sx = Math.min(r.width * 0.4, 430);
    const sy = Math.min(r.height * 0.4, 175);
    chipEls.forEach((el, i) => {
      const x = (Math.random() * 2 - 1) * sx;
      const y = (Math.random() * 2 - 1) * sy;
      const rot = (Math.random() * 2 - 1) * 9;
      gsap.fromTo(el, { x: 0, y: 0, rotation: 0, scale: 0.6, opacity: 0 },
        { x, y, rotation: rot, scale: 1, opacity: 1, duration: 0.8, delay: i * 0.045,
          ease: "back.out(1.4)", onComplete: () => startFloat(el, i) });
    });
  }

  function startFloat(el, i) {
    if (reduceMotion) return;
    floatTweens.push(gsap.to(el, {
      y: "+=" + (9 + Math.random() * 8),
      x: "+=" + (Math.random() * 9 - 4.5),
      rotation: "+=" + (Math.random() * 5 - 2.5),
      duration: 2.3 + Math.random() * 1.6,
      ease: "sine.inOut", yoyo: true, repeat: -1, delay: i * 0.04
    }));
  }

  /* ============================================================
     STEP 2 — information sources (CSS Grid)
     ============================================================ */
  function buildSources() {
    sourcesGrid.innerHTML = "";
    SOURCES.forEach((s) => {
      const card = document.createElement("div");
      card.className = "source-card";
      card.style.setProperty("--src-color", s.color);
      const docs = s.docs.map((d) => "<li>" + d + "</li>").join("");
      card.innerHTML =
        '<div class="source-card__head">' +
        '<span class="source-card__ico">' + s.ico + "</span>" +
        '<span class="source-card__name">' + s.name + "</span>" +
        '<span class="source-card__count">' + s.docs.length + "</span></div>" +
        '<ul class="doclist">' + docs + "</ul>";
      sourcesGrid.appendChild(card);
    });
  }

  function enterSources() {
    killFloat(); // stop step-1 floating
    if (!sourcesGrid.children.length) buildSources();
    const cards = Array.from(sourcesGrid.children);
    const tl = gsap.timeline();
    tl.fromTo(cards, { opacity: 0, y: 22, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.08, ease: "back.out(1.3)" });
    cards.forEach((card, ci) => {
      const items = card.querySelectorAll(".doclist li");
      tl.fromTo(items, { opacity: 0, x: -8 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.06 }, 0.2 + ci * 0.08);
    });
  }

  /* ============================================================
     STEP 3 — relationship discovery
     ============================================================ */
  function enterRelations() {
    relNodes.innerHTML = "";
    relStatus.innerHTML = "";
    relEdges.innerHTML =
      '<defs><linearGradient id="relGrad" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#8b5cf6"/><stop offset="1" stop-color="#5b6cff"/>' +
      "</linearGradient></defs>";

    const rect = widgets.relations.getBoundingClientRect();
    const w = rect.width, h = rect.height;
    const px = w * 0.5, py = h * 0.49;

    const person = document.createElement("div");
    person.className = "rel-person";
    person.innerHTML =
      '<div class="rel-person__avatar">MC</div>' +
      '<div class="rel-person__name">Marie Chen</div>' +
      '<div class="rel-person__role">One linked entity</div>';
    relNodes.appendChild(person);
    gsap.set(person, { left: px, top: py, xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });

    const items = REL_ITEMS.map((it) => {
      const el = document.createElement("div");
      el.className = "rel-item";
      el.style.setProperty("--card-color", it.color);
      el.innerHTML =
        '<span class="rel-item__ico">' + it.ico + "</span>" +
        '<span><span class="rel-item__name">' + it.name + "</span><br>" +
        '<span class="rel-item__meta">' + it.meta + "</span></span>";
      relNodes.appendChild(el);
      const x = w * it.x, y = h * it.y;
      gsap.set(el, { left: x, top: y, xPercent: -50, yPercent: -50, opacity: 0, scale: 0.7 });
      return { el, x, y };
    });

    const paths = items.map((it) => {
      const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const midX = (it.x + px) / 2;
      p.setAttribute("d", "M" + it.x + "," + it.y + " C" + midX + "," + it.y + " " + midX + "," + py + " " + px + "," + py);
      p.style.opacity = "0";
      relEdges.appendChild(p);
      return p;
    });

    const chips = REL_CHIPS.map((txt) => {
      const c = document.createElement("div");
      c.className = "rel-chip";
      c.textContent = txt;
      relStatus.appendChild(c);
      return c;
    });

    const tl = gsap.timeline();
    tl.to(items.map((i) => i.el), { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.5)" });
    tl.to(person, { opacity: 1, scale: 1, duration: 0.55, ease: "back.out(1.6)" }, "-=0.2");
    paths.forEach((p) => {
      const len = p.getTotalLength ? p.getTotalLength() : 320;
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
      tl.to(p, { strokeDashoffset: 0, duration: 0.65, ease: "power2.inOut" }, "-=0.32");
    });
    chips.forEach((c) => tl.to(c, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.35"));
  }

  /* ============================================================
     STEP 4 — opportunity
     ============================================================ */
  function enterOpportunity() {
    footprintEl.innerHTML = "";
    const lis = FOOTPRINT.map((t) => {
      const li = document.createElement("li");
      li.textContent = t;
      footprintEl.appendChild(li);
      return li;
    });
    const card = $("[data-oppcard]");
    gsap.fromTo(card, { opacity: 0, y: 18, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.3)" });
    const tl = gsap.timeline({ delay: 0.25 });
    lis.forEach((li) => tl.fromTo(li, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.3 }, "+=0.07"));
    animateNumber($('[data-num="opp"]'), 87, $('[data-ring="opp"]'));
    animateNumber($('[data-num="rev"]'), 12000, null, true);
  }

  /* ============================================================
     STEP 5 — action
     ============================================================ */
  let glowTween = null;
  function enterAction() {
    const card = $("[data-actioncard]");
    gsap.fromTo(card, { opacity: 0, y: 18, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.4)" });
    animateNumber($('[data-num="conv"]'), 63, null);
    animateNumber($('[data-num="arev"]'), 12000, null, true);
    if (glowTween) glowTween.kill();
    if (!reduceMotion) {
      glowTween = gsap.to(card, {
        boxShadow: "0 24px 60px -16px rgba(20,184,166,0.75), 0 0 0 1px rgba(20,184,166,0.3)",
        duration: 1.6, ease: "sine.inOut", yoyo: true, repeat: -1
      });
    }
  }

  /* ============================================================
     SHARED — animate a number (and optional conic ring)
     ============================================================ */
  function animateNumber(el, to, ring, isMoney) {
    if (!el) return;
    const proxy = { v: 0 };
    gsap.to(proxy, {
      v: to, duration: 1.1, ease: "power2.out",
      onUpdate: () => {
        const val = Math.round(proxy.v);
        el.textContent = isMoney ? val.toLocaleString() : val;
        if (ring) ring.style.setProperty("--p", val);
      }
    });
  }

  /* ============================================================
     REPLAY — restart the whole journey without a refresh
     ============================================================ */
  function replayDemo() {
    if (glowTween) { glowTween.kill(); glowTween = null; }
    killFloat();
    // rebuild step-1 chips so they animate in fresh
    buildChips();
    window.scrollTo({ top: 0, behavior: "smooth" });
    goTo(0); // resets stepper, headline, widget, buttons + replays animations
  }

  /* ============================================================
     MODAL — "Build Your Semantic OS"
     ============================================================ */
  let lastFocus = null;
  function openModal() {
    lastFocus = document.activeElement;
    copyToast.hidden = true;
    modal.hidden = false;
    gsap.fromTo(modal.querySelector(".modal__dialog"),
      { opacity: 0, y: 16, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "back.out(1.4)" });
    gsap.fromTo(modal.querySelector(".modal__overlay"), { opacity: 0 }, { opacity: 1, duration: 0.3 });
    const copyBtn = modal.querySelector("[data-copy-email]");
    if (copyBtn) copyBtn.focus();
  }
  function closeModal() {
    modal.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function copyEmail() {
    const done = () => {
      copyToast.hidden = false;
      gsap.fromTo(copyToast, { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.3 });
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(EMAIL).then(done).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
    function fallbackCopy() {
      const ta = document.createElement("textarea");
      ta.value = EMAIL;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (e) { /* ignore */ }
      document.body.removeChild(ta);
      done();
    }
  }

  /* ============================================================
     INIT + RESIZE
     ============================================================ */
  function init() {
    buildStepper();
    buildChips();
    buildSources();
    backBtn.addEventListener("click", () => goTo(current - 1));
    replayBtn.addEventListener("click", replayDemo);

    // modal wiring
    document.querySelectorAll("[data-open-modal]").forEach((b) => b.addEventListener("click", openModal));
    modal.querySelectorAll("[data-modal-close]").forEach((b) => b.addEventListener("click", closeModal));
    modal.querySelector("[data-copy-email]").addEventListener("click", copyEmail);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) closeModal(); });

    goTo(0);

    let raf;
    window.addEventListener("resize", () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = SCENES[current].widget;
        if (w === "scatter") enterScatter();
        else if (w === "relations") enterRelations();
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
