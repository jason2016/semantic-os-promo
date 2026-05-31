/* ============================================================
   Semantic OS — Promo (simple 3-step story for first-time visitors)
   Messy info  →  AI connects it  →  AI helps me act
   Knowledge Map AI is the Three.js preview at the final CTA only.
   Pure HTML/CSS/JS + GSAP; Three.js lazy-loaded for the final preview.
   ============================================================ */

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasMotionPath = typeof window.MotionPathPlugin !== "undefined";
  if (hasMotionPath) gsap.registerPlugin(MotionPathPlugin);
  // first-screen optimizations target everything under 768px (phones + small tablets)
  const SMALL_Q = window.matchMedia("(max-width: 768px)");
  const isSmall = () => SMALL_Q.matches;

  /* ============================================================
     DATA
     ============================================================ */

  // Step 1 — scattered everyday information (first 5 shown on mobile)
  const FILES = [
    { name: "Email", ico: "✉️", color: "#34d399" },
    { name: "WhatsApp", ico: "💬", color: "#22c55e" },
    { name: "Meeting Notes", ico: "🗒️", color: "#fb7185" },
    { name: "Pricing Request", ico: "💶", color: "#0ea5e9" },
    { name: "Visitor List", ico: "📋", color: "#8b5cf6" },
    { name: "Invoice.pdf", ico: "📄", color: "#6366f1" },
    { name: "Contract.pdf", ico: "📃", color: "#a855f7" }
  ];

  // Step 2 — AI pulls scattered sources toward one person (magnet)
  const CONNECT = {
    records: [
      { name: "Email", ico: "✉️", color: "#34d399", x: 0.16, y: 0.26 },
      { name: "Meeting Notes", ico: "🗒️", color: "#fb7185", x: 0.84, y: 0.26 },
      { name: "Pricing Request", ico: "💶", color: "#0ea5e9", x: 0.16, y: 0.74 },
      { name: "WhatsApp", ico: "💬", color: "#22c55e", x: 0.84, y: 0.74 }
    ]
  };

  // Step 3 — guided evidence chain. Each node is verified by the visitor.
  const CAUSAL = [
    { title: "Pricing Request", color: "#0ea5e9",
      kind: "Source", src: "Partner Email · May 12",
      body: "“Can you send pricing information?”", confirm: "Evidence Confirmed ✓" },
    { title: "Budget Discussed", color: "#8b5cf6",
      kind: "Source", src: "Meeting Notes · May 14",
      body: "Budget discussed<br><strong>€10,000 – €15,000</strong>", confirm: "Evidence Confirmed ✓" },
    { title: "No Follow-Up", color: "#fb7185", alert: true,
      kind: "Evidence", src: "Last interaction · May 14",
      body: "No email detected<br>No WhatsApp detected<br>No meeting detected<br><strong>for 17 days</strong>", confirm: "Evidence Confirmed ✓" },
    { title: "Opportunity Detected", color: "#f59e0b", risk: true,
      kind: "AI reasoning", src: "",
      body: "Pricing requested ✓<br>Budget discussed ✓<br>No follow-up found ✓<br><br>Potential value<br><strong class=\"evi-pop__big\">€12,000</strong>",
      confirm: "Reveal Opportunity →", reveal: true }
  ];

  /* ============================================================
     SCENES
     ============================================================ */
  const STEPS = ["Information", "Connection", "Understanding", "Action"];

  const SCENES = [
    {
      eyebrow: "Step 1 of 4",
      title: "Your Information Is Everywhere",
      sub: "Emails, notes, messages and files are scattered across different systems.",
      msg: "Finding information takes time.",
      widget: "scatter",
      primary: { label: "Organize My Information →", go: 2 }
    },
    {
      eyebrow: "Step 2 of 4",
      title: "AI Finds The Same Person",
      sub: "Watch AI pull scattered information toward one person.",
      msg: "AI connects information automatically.",
      widget: "connect",
      primary: { label: "Show Me The Evidence →", go: 3 }
    },
    {
      eyebrow: "Step 3 of 4",
      title: "AI Shows The Evidence",
      sub: "AI explains why this opportunity exists.",
      msg: "AI does not guess. AI follows evidence.",
      widget: "understand",
      primary: { label: "What Should I Do Next? →", go: 4 }
    },
    {
      eyebrow: "Step 4 of 4",
      title: "Ask Anything",
      sub: "Ask in plain language — AI finds the answer.",
      msg: "AI does not search documents. AI finds answers.",
      widget: "act",
      primary: { label: "Explore Relationships in 2D/3D ↗", href: "https://map.clawshow.ai" },
      secondary: { label: "Build Your Semantic OS", modal: true }
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
  const cnEdges = $("[data-cn-edges]");
  const cnNodes = $("[data-cn-nodes]");
  const cnPopup = $("[data-cn-popup]");
  const cnHint = $("[data-cn-hint]");
  const cnBadge = $("[data-cn-badge]");
  const causalEl = $("[data-causal]");
  const moneyEl = $("[data-money]");
  const eviPop = $("[data-evi-pop]");
  const eviProgress = $("[data-evi-progress]");

  const ctaPrimary = $("[data-cta-primary]");
  const ctaSecondary = $("[data-cta-secondary]");
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

  let headlineInited = false;
  function setHeadline(s) {
    const els = [eyebrow, titleEl, subEl, msgEl];
    // First render: text is already pre-filled in HTML — show it instantly, no fade.
    if (!headlineInited) {
      headlineInited = true;
      eyebrow.textContent = s.eyebrow;
      titleEl.textContent = s.title;
      subEl.textContent = s.sub;
      msgEl.textContent = s.msg || "";
      gsap.set(els, { opacity: 1, y: 0 });
      return;
    }
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

  function ctaAction(spec) {
    if (!spec) return;
    if (spec.go) goTo(spec.go - 1);
    else if (spec.scrollTo) document.querySelector(spec.scrollTo).scrollIntoView({ behavior: "smooth" });
    else if (spec.href) window.open(spec.href, "_blank", "noopener");
    else if (spec.modal) openModal();
  }

  function setCTA(s) {
    ctaPrimary.textContent = s.primary.label;
    ctaPrimary.onclick = () => ctaAction(s.primary);
    if (s.secondary) {
      ctaSecondary.hidden = false;
      ctaSecondary.textContent = s.secondary.label;
      ctaSecondary.onclick = () => ctaAction(s.secondary);
    } else {
      ctaSecondary.hidden = true;
    }
    backBtn.hidden = current === 0;
  }

  // kill every step-specific (esp. infinite) animation + remove stray particles
  function stopAllStepAnims() {
    killFloat();
    killCnFlow();
    killCausalFlow();
    if (cnHintPulse) { cnHintPulse.kill(); cnHintPulse = null; }
    document.querySelectorAll(".cn-particle, .money__spark").forEach((e) => e.remove());
  }

  function goTo(idx) {
    idx = Math.max(0, Math.min(SCENES.length - 1, idx));
    const from = current;
    current = idx;
    const s = SCENES[idx];

    stopAllStepAnims(); // never leave old loops running behind a new step
    setStepper(idx);
    setHeadline(s);
    showWidget(s.widget);
    setCTA(s);

    if (s.widget === "scatter") enterScatter();
    else if (s.widget === "connect") enterConnect();
    else if (s.widget === "understand") enterUnderstand();
    else if (s.widget === "act") enterAct();
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
    // Fewer floating documents on small screens; keeps Step 1 light and fast.
    const small = isSmall();
    buildChips(small ? 4 : FILES.length);
    const r = field.getBoundingClientRect();
    // Clamp spread to chip size so nothing drifts off the field (no clipping).
    const cw = chipEls[0] ? chipEls[0].offsetWidth : 170;
    const chh = chipEls[0] ? chipEls[0].offsetHeight : 50;
    const sx = Math.max(20, r.width / 2 - cw / 2 - 8);
    const sy = Math.max(20, r.height / 2 - chh / 2 - 8);
    // Mobile: near-instant, minimal stagger so cards are visible within ~0.5s.
    const dur = small ? 0.35 : 0.8;
    const stg = small ? 0.04 : 0.045;
    const ease = small ? "power2.out" : "back.out(1.4)";
    chipEls.forEach((el, i) => {
      const x = (Math.random() * 2 - 1) * sx;
      const y = (Math.random() * 2 - 1) * sy;
      const rot = (Math.random() * 2 - 1) * 9;
      gsap.fromTo(el, { x: 0, y: 0, rotation: 0, scale: small ? 0.85 : 0.6, opacity: 0 },
        { x, y, rotation: rot, scale: 1, opacity: 1, duration: dur, delay: i * stg,
          ease: ease, onComplete: () => startFloat(el, i) });
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
     STEP 2 — AI connects everything (simple graph + popup)
     ============================================================ */
  const SVGNS = "http://www.w3.org/2000/svg";
  let cnFlowTweens = [];
  function killCnFlow() { cnFlowTweens.forEach((t) => t.kill()); cnFlowTweens = []; }

  // a curved path record → Marie, with a soft outward bow
  function curveD(rx, ry, cx, cy, sign) {
    const mx = (rx + cx) / 2, my = (ry + cy) / 2;
    const dx = cx - rx, dy = cy - ry;
    const n = Math.hypot(dx, dy) || 1;
    const off = 0.22 * n * sign;
    const ctrlx = mx + (-dy / n) * off;
    const ctrly = my + (dx / n) * off;
    return "M" + rx + "," + ry + " Q" + ctrlx + "," + ctrly + " " + cx + "," + cy;
  }

  // continuous glowing particles streaming along a curved path (record → Marie)
  function streamParticles(pathEl, color) {
    if (reduceMotion || !hasMotionPath) return;
    const count = isSmall() ? 1 : 3;
    const dur = 1.9;
    for (let k = 0; k < count; k++) {
      const c = document.createElementNS(SVGNS, "circle");
      c.setAttribute("r", "3");
      c.setAttribute("class", "cn-particle");
      if (color) c.style.fill = color;
      c.style.opacity = "0";
      cnEdges.appendChild(c);
      const ptl = gsap.timeline({ repeat: -1, delay: k * (dur / count) });
      ptl.to(c, { duration: dur, ease: "none", motionPath: { path: pathEl, alignOrigin: [0.5, 0.5] } }, 0);
      ptl.fromTo(c, { opacity: 0 }, { opacity: 0.95, duration: 0.3, ease: "none" }, 0);
      ptl.to(c, { opacity: 0, duration: 0.35, ease: "none" }, dur - 0.35);
      cnFlowTweens.push(ptl);
    }
  }

  function enterConnect() {
    killFloat();
    killCnFlow();
    cnNodes.innerHTML = "";
    cnEdges.innerHTML =
      '<defs><linearGradient id="cnGrad" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#5b6cff"/><stop offset="1" stop-color="#8b5cf6"/>' +
      "</linearGradient></defs>";
    cnPopup.hidden = true;
    if (cnHint) gsap.set(cnHint, { opacity: 0 });
    if (cnBadge) { cnBadge.hidden = true; gsap.set(cnBadge, { opacity: 0 }); }

    const rect = widgets.connect.getBoundingClientRect();
    const w = rect.width, h = rect.height;
    const cx = w * 0.5, cy = h * 0.46;

    const cnBloom = $("[data-cn-bloom]");
    if (cnBloom) gsap.set(cnBloom, { left: cx, top: cy, xPercent: -50, yPercent: -50, opacity: 0, scale: 0.4 });

    // record nodes — appear softly in place; the flow comes from the particles
    const recs = CONNECT.records.map((r) => {
      const el = document.createElement("div");
      el.className = "cn-node cn-rec";
      el.style.setProperty("--cn-color", r.color);
      el.innerHTML =
        '<span class="cn-rec__dot">' + r.ico + "</span>" +
        '<span class="cn-node__label">' + r.name + "</span>";
      cnNodes.appendChild(el);
      const x = w * r.x, y = h * r.y;
      gsap.set(el, { left: x, top: y, xPercent: -50, yPercent: -50, opacity: 0, scale: 0.6 });
      return { el, x, y };
    });

    // center node (clickable)
    const center = document.createElement("button");
    center.type = "button";
    center.className = "cn-node cn-center";
    center.innerHTML =
      '<span class="cn-center__avatar">MC</span>' +
      '<span class="cn-node__label cn-center__label">Marie Chen</span>';
    cnNodes.appendChild(center);
    gsap.set(center, { left: cx, top: cy, xPercent: -50, yPercent: -50, opacity: 0, scale: 0.4 });
    center.addEventListener("click", showConnectPopup);

    // soft curved paths (the stream beds)
    const paths = recs.map((r, i) => {
      const p = document.createElementNS(SVGNS, "path");
      p.setAttribute("d", curveD(r.x, r.y, cx, cy, i % 2 ? 1 : -1));
      p.setAttribute("class", "cn-flow");
      p.style.opacity = "0";
      cnEdges.appendChild(p);
      return p;
    });

    const tl = gsap.timeline();
    tl.to(center, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.7)" });
    tl.to(recs.map((r) => r.el), { opacity: 1, scale: 1, duration: 0.45, stagger: 0.07, ease: "back.out(1.5)" }, "-=0.15");
    paths.forEach((p) => {
      const len = p.getTotalLength ? p.getTotalLength() : 240;
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
      tl.to(p, { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" }, "<");
    });
    // start the streams — information flowing toward Marie
    tl.add(() => { paths.forEach((p, i) => streamParticles(p, CONNECT.records[i].color)); }, ">-0.2");

    // ~2s in: all particles converging → background blooms, Marie pulses, badge appears
    if (cnBloom) {
      tl.fromTo(cnBloom, { opacity: 0, scale: 0.4 }, { opacity: 0.85, scale: 1.7, duration: 0.5, ease: "power2.out" }, "+=0.7");
      tl.to(cnBloom, { opacity: 0, scale: 2, duration: 0.7, ease: "power2.out" }, ">-0.1");
    }
    tl.to(center, { scale: 1.22, duration: 0.28, ease: "power2.out" }, cnBloom ? "<" : "+=0.7");
    tl.to(center, { scale: 1, duration: 0.32, ease: "power2.inOut" });
    tl.add(() => { if (cnBadge) cnBadge.hidden = false; }, "<");
    if (cnBadge) {
      tl.fromTo(cnBadge, { opacity: 0, scale: 0.6, y: 8 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.9)" }, "<");
    }

    // mobile: once "1 person" is found, stop the streams (no infinite loops)
    if (isSmall()) {
      tl.add(() => { killCnFlow(); cnEdges.querySelectorAll(".cn-particle").forEach((e) => e.remove()); }, ">+0.3");
    }

    if (cnHint && !reduceMotion) tl.to(cnHint, { opacity: 1, duration: 0.4 }, ">+0.15");
    // gentle invite-to-tap pulse — desktop only (no continuous loop on mobile)
    if (!reduceMotion && !isSmall()) {
      cnHintPulse = gsap.to(center, { scale: 1.06, duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: -1 });
    }
  }

  let cnHintPulse = null;
  function showConnectPopup() {
    if (cnHintPulse) { cnHintPulse.kill(); cnHintPulse = null; }
    if (cnHint) gsap.to(cnHint, { opacity: 0, duration: 0.25 });
    cnPopup.hidden = false;
    gsap.fromTo(cnPopup, { opacity: 0, y: 12, scale: 0.94 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.5)" });
    const items = cnPopup.querySelectorAll(".cn-popup__list li");
    gsap.fromTo(items, { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.1, delay: 0.15 });
  }
  function hideConnectPopup() { cnPopup.hidden = true; }

  /* ============================================================
     STEP 3 — AI shows the evidence (guided investigation → earned €12,000)
     ============================================================ */
  let causalFlow = null;
  function killCausalFlow() { if (causalFlow) { causalFlow.kill(); causalFlow = null; } }

  let eviNodes = [], eviConns = [], eviStep = 0;

  function setProgress(n) {
    if (!eviProgress) return;
    let t = n + " / 4 Verified";
    if (n === 3) t += " · Almost there…";
    eviProgress.textContent = t;
  }

  function setActiveEvi(idx) {
    eviStep = idx;
    eviNodes.forEach((n) => { const h = n.querySelector(".causal__hint"); if (h) h.remove(); });
    eviNodes.forEach((n, i) => {
      const done = n.classList.contains("causal__node--done");
      n.classList.toggle("causal__node--active", i === idx && !done);
      n.classList.toggle("causal__node--locked", i > idx && !done);
    });
    if (idx < eviNodes.length && !eviNodes[idx].classList.contains("causal__node--done")) {
      const h = document.createElement("span");
      h.className = "causal__hint";
      h.textContent = "👆 Tap to verify";
      eviNodes[idx].appendChild(h);
      if (!reduceMotion) gsap.fromTo(h, { opacity: 0, y: -4 }, { opacity: 1, y: 0, duration: 0.3 });
    }
  }

  function openEvidence(i) {
    const c = CAUSAL[i];
    $("[data-evi-kind]").textContent = c.kind;
    const srcEl = $("[data-evi-src]");
    srcEl.innerHTML = c.src || "";
    srcEl.style.display = c.src ? "" : "none";
    $("[data-evi-body]").innerHTML = c.body;
    const confirm = $("[data-evi-confirm]");
    confirm.textContent = c.confirm;
    confirm.onclick = () => confirmEvidence(i);
    eviPop.hidden = false;
    gsap.fromTo(eviPop, { opacity: 0, y: 12, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(1.5)" });
  }
  function closeEvidence() { eviPop.hidden = true; }

  function confirmEvidence(i) {
    closeEvidence();
    const node = eviNodes[i];
    node.classList.remove("causal__node--active");
    node.classList.add("causal__node--done");
    const h = node.querySelector(".causal__hint"); if (h) h.remove();
    // the connector below this node activates (information confirmed → flows on)
    if (eviConns[i]) {
      eviConns[i].classList.add("is-active");
      if (!reduceMotion) {
        const sp = eviConns[i].querySelector(".causal__spark");
        gsap.fromTo(sp, { top: "0%", opacity: 1 }, { top: "100%", opacity: 1, duration: 0.3, ease: "power1.in" });
      }
    }
    setProgress(i + 1);
    if (CAUSAL[i].reveal) revealOpportunity();
    else setActiveEvi(i + 1);
  }

  function enterUnderstand() {
    killFloat();
    killCausalFlow();
    causalEl.innerHTML = "";
    eviNodes = []; eviConns = []; eviStep = 0;
    if (eviPop) eviPop.hidden = true;
    setProgress(0);
    const flashEl = $("[data-understand-flash]");
    if (flashEl) gsap.set(flashEl, { opacity: 0 });
    if (moneyEl) {
      moneyEl.hidden = true;
      gsap.set(moneyEl, { opacity: 0 });
      moneyEl.querySelectorAll(".money__spark").forEach((s) => s.remove());
    }

    CAUSAL.forEach((c, i) => {
      if (i > 0) {
        const f = document.createElement("div");
        f.className = "causal__flow";
        f.innerHTML = '<span class="causal__spark"></span>';
        causalEl.appendChild(f);
        eviConns.push(f);
      }
      const el = document.createElement("div");
      el.className = "causal__node" + (c.risk ? " causal__node--risk" : c.alert ? " causal__node--alert" : "");
      el.style.setProperty("--cz-color", c.color);
      el.innerHTML = '<span class="causal__check" aria-hidden="true">✓</span><span class="causal__title">' + c.title + "</span>";
      el.addEventListener("click", () => {
        if (eviStep === i && !el.classList.contains("causal__node--done")) openEvidence(i);
      });
      causalEl.appendChild(el);
      eviNodes.push(el);
    });

    // chain fades in, then the first node invites a tap
    gsap.fromTo([].concat(eviNodes, eviConns), { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: "power2.out",
        onComplete: () => setActiveEvi(0) });
    gsap.set(eviNodes, { clearProps: "boxShadow" });
  }

  // only fires once the visitor has verified all four pieces of evidence
  function revealOpportunity() {
    const mobile = isSmall();
    const flash = $("[data-understand-flash]");
    const tl = gsap.timeline();
    // a pulse travels through the now-proven chain
    eviNodes.forEach((n, i) => {
      tl.to(n, { boxShadow: "0 0 0 4px rgba(245,158,11,0.25)", duration: 0.14, yoyo: true, repeat: 1, ease: "sine.inOut" },
        i === 0 ? ">" : "+=0.05");
    });
    tl.add(() => { if (moneyEl) moneyEl.hidden = false; }, ">+0.05");
    if (moneyEl) {
      const v = moneyEl.querySelector(".money__value");
      const glow = moneyEl.querySelector(".money__glow");
      if (flash && !mobile) tl.fromTo(flash, { opacity: 0 }, { opacity: 1, duration: 0.16, ease: "power2.out" }, ">");
      tl.fromTo(moneyEl, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1.4, duration: 0.45, ease: "power2.out" }, "<");
      if (glow) tl.fromTo(glow, { opacity: mobile ? 0.7 : 0.95, scale: 0.2 }, { opacity: 0, scale: mobile ? 1.8 : 2.6, duration: 0.7, ease: "power2.out" }, "<");
      if (flash && !mobile) tl.to(flash, { opacity: 0, duration: 0.75, ease: "power2.out" }, "<0.16");
      tl.add(() => burstParticles(moneyEl), "<");
      tl.to(moneyEl, { scale: 1, duration: 0.35, ease: "power2.inOut" });
      tl.add(() => v.classList.add("is-glow"), "<");
      tl.add(() => v.classList.remove("is-glow"), ">+0.6");
      // on small screens the chain pushes the money below the short viewport —
      // bring it fully into view so €12,000 is never clipped
      tl.add(() => {
        const wrap = widgets.understand;
        if (wrap && wrap.scrollHeight > wrap.clientHeight + 2) {
          if (wrap.scrollTo) wrap.scrollTo({ top: wrap.scrollHeight, behavior: "smooth" });
          else wrap.scrollTop = wrap.scrollHeight;
        }
      }, ">");
      if (!reduceMotion && !mobile) {
        causalFlow = gsap.to(v, { scale: 1.04, duration: 0.95, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "center" });
      }
    }
  }

  function burstParticles(host) {
    if (reduceMotion) return;
    const mobile = isSmall();
    const N = mobile ? 4 : 14;
    const reachX = mobile ? 38 : 80, reachY = mobile ? 30 : 64;
    for (let i = 0; i < N; i++) {
      const s = document.createElement("span");
      s.className = "money__spark";
      host.appendChild(s);
      gsap.set(s, { xPercent: -50, yPercent: -50 });
      const ang = (i / N) * Math.PI * 2 + Math.random() * 0.3;
      gsap.fromTo(s, { x: 0, y: 0, opacity: 1, scale: 1.2 },
        { x: Math.cos(ang) * (reachX + Math.random() * reachX * 0.6),
          y: Math.sin(ang) * (reachY + Math.random() * reachY * 0.6),
          opacity: 0, scale: 0.3, duration: 0.85, ease: "power2.out",
          onComplete: () => s.remove() });
    }
  }

  /* ============================================================
     STEP 4 — Ask anything (typed question → reasoning path → answer)
     ============================================================ */
  function enterAct() {
    killFloat();
    const wrap = widgets.act;
    const bar = wrap.querySelector(".ask__bar");
    const qEl = wrap.querySelector(".ask__q");
    const thinking = wrap.querySelector("[data-ask-thinking]");
    const steps = wrap.querySelectorAll(".ask__step");
    const card = wrap.querySelector(".actcard");
    const reasons = wrap.querySelectorAll(".actcard__reasons li");

    steps.forEach((s) => s.classList.remove("is-lit"));
    if (thinking) thinking.hidden = true;
    const Q = "What should I do next?";
    qEl.textContent = "";
    qEl.classList.add("is-typing");
    const typer = { n: 0 };

    const tl = gsap.timeline();
    tl.fromTo(bar, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" });
    // the question types itself
    tl.to(typer, { n: Q.length, duration: 0.8, ease: "none",
      onUpdate: () => { qEl.textContent = Q.slice(0, Math.round(typer.n)); },
      onComplete: () => qEl.classList.remove("is-typing") }, ">");
    // "AI is reasoning…" while the chain lights up
    if (thinking) {
      tl.add(() => { thinking.hidden = false; }, ">");
      tl.fromTo(thinking, { opacity: 0 }, { opacity: 1, duration: 0.25 }, "<");
    }
    // the reasoning lights up one step at a time (1 → 6)
    tl.fromTo(steps, { opacity: 0.35, y: 6 }, { opacity: 1, y: 0, duration: 0.2, stagger: 0.07, ease: "power2.out" }, ">+0.05");
    steps.forEach((s, i) => tl.add(() => s.classList.add("is-lit"), i === 0 ? ">" : "+=0.16"));
    // reasoning done — hide the thinking indicator, reveal the recommendation
    if (thinking) tl.to(thinking, { opacity: 0, duration: 0.25, onComplete: () => { thinking.hidden = true; } }, ">+0.05");
    // then the recommendation, now that the "why" is visible
    tl.fromTo(card, { opacity: 0, y: 16, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.3)" }, ">");
    tl.fromTo(reasons, { opacity: 0, x: -8 },
      { opacity: 1, x: 0, duration: 0.3, stagger: 0.09 }, "-=0.1");
    animateNumber($('[data-num="value"]'), 12000, null, true);
  }

  /* ============================================================
     AMBIENT — floating light dust, keeps the page alive
     ============================================================ */
  function buildAmbient() {
    const host = $("[data-ambient]");
    if (!host || reduceMotion) return;
    const n = isSmall() ? 8 : 26;
    for (let i = 0; i < n; i++) {
      const d = document.createElement("span");
      d.className = "dust";
      const size = 2 + Math.random() * 3.5;
      d.style.width = d.style.height = size.toFixed(1) + "px";
      d.style.left = (Math.random() * 100).toFixed(2) + "%";
      d.style.top = (Math.random() * 100).toFixed(2) + "%";
      host.appendChild(d);
      gsap.to(d, { x: (Math.random() * 2 - 1) * 46, y: (Math.random() * 2 - 1) * 46,
        duration: 7 + Math.random() * 7, ease: "sine.inOut", yoyo: true, repeat: -1, delay: Math.random() * 5 });
      gsap.to(d, { opacity: 0.12 + Math.random() * 0.45,
        duration: 2.5 + Math.random() * 3, ease: "sine.inOut", yoyo: true, repeat: -1, delay: Math.random() * 4 });
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
    if (cnHintPulse) { cnHintPulse.kill(); cnHintPulse = null; }
    killCnFlow();
    killCausalFlow();
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
    buildAmbient();
    backBtn.addEventListener("click", () => goTo(current - 1));
    replayBtn.addEventListener("click", replayDemo);

    // Step 2 + Step 3 popup close buttons
    const cnClose = $("[data-cn-popup-close]");
    if (cnClose) cnClose.addEventListener("click", hideConnectPopup);
    const eviClose = $("[data-evi-pop-close]");
    if (eviClose) eviClose.addEventListener("click", closeEvidence);

    // modal wiring (the Step 4 secondary CTA opens it via setCTA)
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
        else if (w === "connect") enterConnect();
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
