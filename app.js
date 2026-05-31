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
  const MOBILE_Q = window.matchMedia("(max-width: 560px)");
  const isMobile = () => MOBILE_Q.matches;

  /* ============================================================
     DATA
     ============================================================ */

  // Scattered information (Step 1)
  const FILES = [
    { name: "Visitor List.xlsx", ico: "📊", color: "#8b5cf6" },
    { name: "Partner Email.msg", ico: "✉️", color: "#34d399" },
    { name: "Pricing Request.pdf", ico: "💶", color: "#0ea5e9" },
    { name: "Meeting Notes.md", ico: "🗒️", color: "#fb7185" },
    { name: "WhatsApp Conversation", ico: "💬", color: "#34d399" },
    { name: "Campaign Notes.md", ico: "📝", color: "#a855f7" },
    { name: "Badge Scans.csv", ico: "📋", color: "#8b5cf6" },
    { name: "Follow-up Notes.docx", ico: "🗂️", color: "#0ea5e9" },
    { name: "Booth Plan.pdf", ico: "📐", color: "#fb7185" },
    { name: "BizMedia Thread", ico: "✉️", color: "#34d399" }
  ];

  // Structured information sources (Step 2) — CSS Grid, each with a clean doc list
  const SOURCES = [
    { name: "Visitor Lists", ico: "📋", color: "#8b5cf6", docs: ["Visitor List.xlsx", "Badge Scans.csv"] },
    { name: "Partner Emails", ico: "✉️", color: "#34d399", docs: ["Partner Email.msg", "BizMedia Thread", "WhatsApp Conversation"] },
    { name: "Meeting Notes", ico: "🗒️", color: "#fb7185", docs: ["Meeting Notes.md", "Booth Recap"] },
    { name: "Pricing Requests", ico: "💶", color: "#0ea5e9", docs: ["Pricing Request.pdf", "Quote Draft"] },
    { name: "Campaign Notes", ico: "📣", color: "#a855f7", docs: ["Campaign Notes.md", "Spring 2026 Brief"] },
    { name: "Follow-up Notes", ico: "🗂️", color: "#6366f1", docs: ["Follow-up Notes.docx", "Open Items"] }
  ];

  // Step 3 — the HERO: stored relationship records.
  // Each relationship is the object: a labeled link between two sources, with metadata.
  const REL_RECORDS = [
    {
      label: "Same Visitor", confidence: 92,
      a: { name: "Visitor List", ico: "📋", color: "#8b5cf6" },
      b: { name: "Partner Email", ico: "✉️", color: "#34d399" },
      meaning: "<b>Marie Chen</b> is the same visitor across both records."
    },
    {
      label: "Interested In Product X", confidence: 88,
      a: { name: "Meeting Notes", ico: "🗒️", color: "#fb7185" },
      b: { name: "Campaign Notes", ico: "📣", color: "#a855f7" },
      meaning: "Marie repeatedly references <b>Product X</b>."
    },
    {
      label: "Mentioned Budget", confidence: 84,
      a: { name: "Meeting Notes", ico: "🗒️", color: "#fb7185" },
      b: { name: "Pricing Request", ico: "💶", color: "#0ea5e9" },
      meaning: "A <b>budget range</b> was discussed and recorded."
    },
    {
      label: "Waiting For Follow-up", confidence: 90,
      a: { name: "Pricing Request", ico: "💶", color: "#0ea5e9" },
      b: { name: "Follow-up Notes", ico: "🗂️", color: "#6366f1" },
      meaning: "A pricing request has <b>no response</b> yet."
    }
  ];

  /* ============================================================
     SCENES
     ============================================================ */
  const STEPS = ["Chaos", "Structure", "Relationships", "Context", "Action"];

  const SCENES = [
    {
      eyebrow: "Step 1 · Chaos",
      title: "You Have Information Everywhere.",
      sub: "Emails, notes, visitor lists, pricing requests, meeting notes and conversations are scattered across systems.",
      msg: "",
      widget: "scatter",
      primary: { label: "Organize Information →", go: 2 }
    },
    {
      eyebrow: "Step 2 · Structure",
      title: "Semantic OS Creates Structured Memory.",
      sub: "Information sources appear — every document finds its place.",
      msg: "Documents are no longer isolated. They become part of a structured memory system.",
      widget: "sources",
      primary: { label: "Discover Relationships →", go: 3 }
    },
    {
      eyebrow: "Step 3 · Relationships",
      title: "The Relationship Is the Stored Object.",
      sub: "Semantic OS saves each relationship — labeled, scored and reusable — not just the documents.",
      msg: "Semantic OS stores relationships, not just documents.",
      widget: "relations",
      primary: { label: "Reveal Context →", go: 4 }
    },
    {
      eyebrow: "Step 4 · Context + Causality",
      title: "Relationships Become Context.",
      sub: "Connected relationships accumulate into meaning — and reveal cause and effect.",
      msg: "Semantic OS connects information into meaning.",
      widget: "context",
      primary: { label: "Generate Action →", go: 5 }
    },
    {
      eyebrow: "Step 5 · Action",
      title: "Turn Relationships Into Action.",
      sub: "Context becomes a clear, recommended next step — with expected revenue and probability.",
      msg: "Relationships create context. Context creates action.",
      widget: "action",
      primary: { label: "Explore Relationships in 2D/3D ↓", scrollTo: "#explore" }
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
  const relrecsEl = $("[data-relrecs]");

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
    else if (s.widget === "context") enterContext();
    else if (s.widget === "action") enterAction();
  }

  /* ============================================================
     STEP 1 — scattered files
     ============================================================ */
  let chipEls = [];
  let floatTweens = [];

  function buildChips(count) {
    field.innerHTML = "";
    const list = count ? FILES.slice(0, count) : FILES;
    chipEls = list.map((f) => {
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
    killFloat();
    // Fewer floating documents on mobile for clarity
    buildChips(isMobile() ? 6 : FILES.length);
    const r = field.getBoundingClientRect();
    // Clamp spread to chip size so nothing drifts off the field (no clipping)
    const cw = chipEls[0] ? chipEls[0].offsetWidth : 170;
    const chh = chipEls[0] ? chipEls[0].offsetHeight : 50;
    const sx = Math.max(20, r.width / 2 - cw / 2 - 8);
    const sy = Math.max(20, r.height / 2 - chh / 2 - 8);
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
     STEP 3 — relationship records (the stored object)
     ============================================================ */
  function relWire(rec) {
    return (
      '<div class="relrec__wire">' +
        '<span class="wirenode" style="--wire-color:' + rec.a.color + '">' +
          '<span class="wirenode__ico">' + rec.a.ico + '</span>' +
          '<span class="wirenode__name">' + rec.a.name + '</span>' +
        '</span>' +
        '<span class="wire"><span class="wire__label">' + rec.label + '</span></span>' +
        '<span class="wirenode" style="--wire-color:' + rec.b.color + '">' +
          '<span class="wirenode__ico">' + rec.b.ico + '</span>' +
          '<span class="wirenode__name">' + rec.b.name + '</span>' +
        '</span>' +
      '</div>'
    );
  }

  function enterRelations() {
    relrecsEl.innerHTML = "";
    const cards = REL_RECORDS.map((rec) => {
      const el = document.createElement("article");
      el.className = "relrec";
      el.innerHTML =
        relWire(rec) +
        '<p class="relrec__meaning">' + rec.meaning + "</p>" +
        '<div class="relrec__meta">' +
          '<span class="relrec__conf">Confidence ' + rec.confidence + "%</span>" +
          '<span class="relrec__flag">Saved</span>' +
          '<span class="relrec__flag">Searchable</span>' +
          '<span class="relrec__flag">Reusable</span>' +
        "</div>";
      relrecsEl.appendChild(el);
      return el;
    });
    const tl = gsap.timeline();
    tl.fromTo(cards, { opacity: 0, y: 20, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.12, ease: "back.out(1.3)" });
    // the relationship label "snaps" onto each connecting line
    cards.forEach((card, i) => {
      const lbl = card.querySelector(".wire__label");
      tl.fromTo(lbl, { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2)" }, 0.25 + i * 0.12);
    });
  }

  /* ============================================================
     STEP 4 — context + causality
     ============================================================ */
  function enterContext() {
    const wrap = widgets.context;
    const chips = wrap.querySelectorAll(".evchip");
    const arrows = wrap.querySelectorAll(".ctx__arrow");
    const ctxCard = wrap.querySelector(".ctxcard--context");
    const causeCard = wrap.querySelector(".ctxcard--causality");
    const tl = gsap.timeline();
    tl.fromTo(wrap.querySelector(".ctx__elabel"), { opacity: 0 }, { opacity: 1, duration: 0.3 });
    tl.fromTo(chips, { opacity: 0, y: 10, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.09, ease: "back.out(1.5)" }, "-=0.1");
    tl.fromTo(arrows[0], { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.3 }, "+=0.05");
    tl.fromTo(ctxCard, { opacity: 0, y: 14, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.4)" });
    tl.fromTo(arrows[1], { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.3 }, "+=0.05");
    tl.fromTo(causeCard, { opacity: 0, y: 14, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.4)" });
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
     KNOWLEDGE MAP AI — interactive 3D relationship space (Three.js)
     Layers: Records → Relationships → Context → Actions.
     Relationships are the hero: first-class, clickable objects.
     ============================================================ */
  const KMAP_RECORDS = [
    { name: "Visitor List" }, { name: "Partner Email" }, { name: "Meeting Notes" },
    { name: "Pricing Request" }, { name: "Campaign Notes" }, { name: "Follow-up Notes" }
  ];
  const KMAP_RELS = [
    { label: "Same Visitor", a: 0, b: 1, conf: 92, meaning: "Marie Chen is the same visitor across both records.", evidence: "Visitor List + Partner Email" },
    { label: "Interested In Product X", a: 2, b: 4, conf: 88, meaning: "Marie repeatedly references Product X.", evidence: "Meeting Notes + Campaign Notes" },
    { label: "Mentioned Budget", a: 2, b: 3, conf: 84, meaning: "A budget range was discussed and recorded.", evidence: "Meeting Notes + Pricing Request" },
    { label: "Waiting For Follow-up", a: 3, b: 5, conf: 90, meaning: "A pricing request has no response yet.", evidence: "Pricing Request + Follow-up Notes" }
  ];
  // Mobile: fewer nodes (4 records, 3 relationships) — indices into the first 4 records
  const KMAP_RELS_MOBILE = [
    { label: "Same Visitor", a: 0, b: 1, conf: 92, meaning: "Marie Chen is the same visitor across both records.", evidence: "Visitor List + Partner Email" },
    { label: "Mentioned Budget", a: 2, b: 3, conf: 84, meaning: "A budget range was discussed and recorded.", evidence: "Meeting Notes + Pricing Request" },
    { label: "Waiting For Follow-up", a: 1, b: 3, conf: 90, meaning: "A pricing request has no response yet.", evidence: "Partner Email + Pricing Request" }
  ];
  const C_RECORD = "#8b5cf6", C_REL = "#5b6cff", C_CTX = "#0ea5e9", C_ACT = "#14b8a6";

  function initKmap() {
    const mount = $("[data-kmap-canvas]");
    const kmapEl = $("[data-kmap]");
    if (!mount) return;
    if (typeof THREE === "undefined") {
      mount.innerHTML = '<div class="kmap__fallback">3D view needs an internet connection to load.</div>';
      return;
    }

    const W0 = kmapEl.clientWidth || 800, H0 = kmapEl.clientHeight || 440;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, W0 / H0, 0.1, 1000);
    // angled, pulled-back view so the layered depth reads clearly (not a flat cluster)
    camera.position.set(26, 16, 62);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (err) {
      mount.innerHTML = '<div class="kmap__fallback">Your browser could not start the 3D view.</div>';
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W0, H0);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.95));
    const dir = new THREE.DirectionalLight(0xffffff, 0.45);
    dir.position.set(18, 40, 28);
    scene.add(dir);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.7;
    controls.minDistance = 44;
    controls.maxDistance = 130;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    controls.target.set(0, -1, 0);

    const hintEl = $("[data-kmap-hint]");
    controls.addEventListener("start", () => {
      controls.autoRotate = false;
      if (hintEl) gsap.to(hintEl, { opacity: 0.35, duration: 0.4 });
    });

    // ----- helpers -----
    function nodeMesh(radius, hex, emissive) {
      return new THREE.Mesh(
        new THREE.SphereGeometry(radius, 32, 32),
        new THREE.MeshStandardMaterial({ color: hex, emissive: hex, emissiveIntensity: emissive, roughness: 0.5, metalness: 0.0 })
      );
    }
    function tube(p1, p2, hex, radius, opacity) {
      const mid = p1.clone().lerp(p2, 0.5);
      mid.x *= 1.12; mid.z *= 1.12; // gentle outward bow
      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const geo = new THREE.TubeGeometry(curve, 24, radius, 8, false);
      const mat = new THREE.MeshBasicMaterial({ color: hex, transparent: true, opacity: opacity });
      return new THREE.Mesh(geo, mat);
    }
    function makeLabel(text, hex, opts) {
      opts = opts || {};
      const dpr = 2, font = 42, padX = 22, padY = 14;
      const c = document.createElement("canvas");
      const ctx = c.getContext("2d");
      ctx.font = "700 " + font + "px Inter, sans-serif";
      const tw = Math.ceil(ctx.measureText(text).width);
      c.width = (tw + padX * 2) * dpr;
      c.height = (font + padY * 2) * dpr;
      ctx.scale(dpr, dpr);
      ctx.font = "700 " + font + "px Inter, sans-serif";
      ctx.textBaseline = "middle";
      const w = tw + padX * 2, h = font + padY * 2, r = h / 2;
      if (opts.pill) {
        ctx.fillStyle = hex;
        ctx.beginPath();
        ctx.moveTo(r, 0); ctx.arcTo(w, 0, w, h, r); ctx.arcTo(w, h, 0, h, r);
        ctx.arcTo(0, h, 0, 0, r); ctx.arcTo(0, 0, w, 0, r); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#ffffff";
      } else {
        ctx.fillStyle = hex;
      }
      ctx.fillText(text, padX, h / 2 + 1);
      const tex = new THREE.CanvasTexture(c);
      tex.minFilter = THREE.LinearFilter; tex.anisotropy = 4;
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
      const sH = opts.scale || 1.5, aspect = c.width / c.height;
      sp.scale.set(sH * aspect, sH, 1);
      sp.renderOrder = 20;
      return sp;
    }

    // ----- layout (vertical layers, widely spaced for clarity) -----
    const Y_REC = 20, Y_REL = 6, Y_CTX = -8, Y_ACT = -20;

    const graph = new THREE.Group();
    scene.add(graph);
    const detail = $("[data-kmap-detail]");
    const dClose = $("[data-kmap-detail-close]");

    let pickables = [];      // objects that select a relationship
    let relGroups = [];      // per-relationship { puck, label, tubes[] }
    let recordNodes = [];    // { mesh, label } — labels shown on hover only
    let curRels = [];
    let builtMobile = null;

    function disposeObj(o) {
      if (o.geometry) o.geometry.dispose();
      if (o.material) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); }
    }
    function clearGraph() {
      while (graph.children.length) { const o = graph.children.pop(); disposeObj(o); }
    }

    function setSelection(idx) {
      relGroups.forEach((g, i) => {
        const on = idx < 0 || i === idx;
        gsap.to(g.puck.scale, { x: i === idx ? 1.35 : 1, y: i === idx ? 1.35 : 1, z: i === idx ? 1.35 : 1, duration: 0.3, ease: "back.out(2)" });
        g.puck.material.emissiveIntensity = i === idx ? 0.85 : (idx < 0 ? 0.6 : 0.28);
        g.label.material.opacity = on ? 1 : 0.22;
        g.tubes.forEach((t) => { t.material.opacity = on ? (i === idx ? 0.9 : 0.5) : 0.1; });
      });
    }

    function build() {
      clearGraph();
      pickables = []; relGroups = []; recordNodes = [];
      const mobile = isMobile();
      builtMobile = mobile;
      const records = mobile ? KMAP_RECORDS.slice(0, 4) : KMAP_RECORDS;
      curRels = mobile ? KMAP_RELS_MOBILE : KMAP_RELS;
      const R = mobile ? 12 : 15;

      const recPos = records.map((_, i) => {
        const a = (i / records.length) * Math.PI * 2 - Math.PI / 2;
        return new THREE.Vector3(Math.cos(a) * R, Y_REC, Math.sin(a) * R);
      });
      const ctxPos = new THREE.Vector3(0, Y_CTX, 0);
      const actPos = new THREE.Vector3(0, Y_ACT, 0);

      // records — small; labels hidden until hover
      recPos.forEach((p, i) => {
        const m = nodeMesh(0.75, C_RECORD, 0.3);
        m.position.copy(p); m.userData.rec = i; graph.add(m);
        const lbl = makeLabel(records[i].name, "#3a2d6b", { scale: 1.25 });
        lbl.position.copy(p); lbl.position.y += 1.9; lbl.visible = false; graph.add(lbl);
        recordNodes.push({ mesh: m, label: lbl });
      });

      // context (medium-small) + action (medium)
      const ctxMesh = nodeMesh(1.05, C_CTX, 0.45); ctxMesh.position.copy(ctxPos); graph.add(ctxMesh);
      const ctxLbl = makeLabel("Context · High Purchase Intent", C_CTX, { pill: true, scale: 1.45 });
      ctxLbl.position.copy(ctxPos); ctxLbl.position.y -= 2.5; graph.add(ctxLbl);

      const actMesh = nodeMesh(1.3, C_ACT, 0.5); actMesh.position.copy(actPos); graph.add(actMesh);
      const actLbl = makeLabel("Action · Contact within 48h", C_ACT, { pill: true, scale: 1.45 });
      actLbl.position.copy(actPos); actLbl.position.y -= 2.8; graph.add(actLbl);

      graph.add(tube(ctxPos, actPos, C_CTX, 0.08, 0.5));

      // relationships — the hero (medium), always labelled
      curRels.forEach((rel, i) => {
        const pa = recPos[rel.a], pb = recPos[rel.b];
        const puckPos = pa.clone().add(pb).multiplyScalar(0.5 * 0.6); // midpoint pulled inward
        puckPos.y = Y_REL;
        const puck = nodeMesh(1.4, C_REL, 0.6);
        puck.position.copy(puckPos); puck.userData.rel = i; graph.add(puck); pickables.push(puck);

        const lbl = makeLabel(rel.label, C_REL, { pill: true, scale: 1.55 });
        lbl.position.copy(puckPos); lbl.position.y += 2.7; graph.add(lbl);

        const tubes = [];
        const t1 = tube(pa, puckPos, C_REL, 0.09, 0.55); t1.userData.rel = i; graph.add(t1); tubes.push(t1); pickables.push(t1);
        const t2 = tube(pb, puckPos, C_REL, 0.09, 0.55); t2.userData.rel = i; graph.add(t2); tubes.push(t2); pickables.push(t2);
        const t3 = tube(puckPos, ctxPos, C_CTX, 0.08, 0.45); t3.userData.rel = i; graph.add(t3); tubes.push(t3);

        relGroups.push({ puck, label: lbl, tubes });
      });

      setSelection(-1);
    }

    // ----- detail panel -----
    function openDetail(idx) {
      const rel = curRels[idx];
      if (!rel) return;
      $("[data-d-label]").textContent = rel.label;
      $("[data-d-meaning]").textContent = rel.meaning;
      $("[data-d-evidence]").textContent = rel.evidence;
      $("[data-d-confidence]").textContent = rel.conf + "%";
      detail.hidden = false;
      gsap.fromTo(detail, { opacity: 0, x: 14 }, { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" });
      setSelection(idx);
    }
    function closeDetail() { detail.hidden = true; setSelection(-1); }
    if (dClose) dClose.addEventListener("click", closeDetail);

    // ----- raycast click + hover -----
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let down = null;
    function pointerNDC(e) {
      const r = renderer.domElement.getBoundingClientRect();
      ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    }
    function pickRel() {
      ray.setFromCamera(ndc, camera);
      const hits = ray.intersectObjects(pickables, false);
      return hits.length ? hits[0].object.userData.rel : -1;
    }
    function pickRecord() {
      ray.setFromCamera(ndc, camera);
      const hits = ray.intersectObjects(recordNodes.map((r) => r.mesh), false);
      return hits.length ? hits[0].object.userData.rec : -1;
    }
    function hoverRecord(idx) { recordNodes.forEach((r, i) => { r.label.visible = i === idx; }); }

    renderer.domElement.addEventListener("pointerdown", (e) => { down = { x: e.clientX, y: e.clientY, t: Date.now() }; });
    renderer.domElement.addEventListener("pointerup", (e) => {
      if (!down) return;
      const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
      const quick = Date.now() - down.t < 450;
      down = null;
      if (moved > 6 || !quick) return; // drag, not click
      pointerNDC(e);
      const idx = pickRel();
      if (idx >= 0) openDetail(idx);
      else closeDetail();
    });
    renderer.domElement.addEventListener("pointermove", (e) => {
      pointerNDC(e);
      const rel = pickRel();
      renderer.domElement.style.cursor = rel >= 0 ? "pointer" : "";
      hoverRecord(rel >= 0 ? -1 : pickRecord()); // record labels only on hover
    });
    renderer.domElement.addEventListener("pointerleave", () => hoverRecord(-1));

    // ----- render loop (paused when offscreen) -----
    let raf = null;
    function loop() { controls.update(); renderer.render(scene, camera); raf = requestAnimationFrame(loop); }
    function startLoop() { if (!raf) loop(); }
    function stopLoop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((ents) => { ents[0].isIntersecting ? startLoop() : stopLoop(); }, { threshold: 0.05 })
        .observe(kmapEl);
    } else { startLoop(); }

    window.addEventListener("resize", () => {
      const w = kmapEl.clientWidth, h = kmapEl.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (isMobile() !== builtMobile) { closeDetail(); build(); } // fewer nodes on mobile
    });

    build();

    // test-only handle (off in production unless explicitly enabled)
    if (window.__KMAP_TEST__) {
      kmapEl._kmap = { camera, controls, renderer, get pucks() { return relGroups.map((g) => g.puck); }, get records() { return recordNodes; }, open: openDetail, close: closeDetail };
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
    initKmap();

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
