/* ============================================================
   Semantic OS × Knowledge Map AI — Promo v2
   A guided 6-scene journey:
   chaos → memory → relationships → map → opportunity → action
   Pure HTML/CSS/JS + GSAP (CDN). No framework, no backend.
   ============================================================ */

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const MAP_URL = "https://map.clawshow.ai";

  /* ============================================================
     DATA
     ============================================================ */

  // Source categories (Scene 2 sidebar + grouping)
  const CATS = [
    { id: "exhibitor", name: "Exhibitor Files", color: "#6366f1", ico: "📁" },
    { id: "visitor", name: "Visitor Lists", color: "#8b5cf6", ico: "📋" },
    { id: "campaign", name: "Campaign Notes", color: "#a855f7", ico: "📣" },
    { id: "partner", name: "Partner Emails", color: "#34d399", ico: "✉️" },
    { id: "booth", name: "Booth Plans", color: "#fb7185", ico: "🏗️" },
    { id: "followup", name: "Follow-up Notes", color: "#0ea5e9", ico: "🗂️" }
  ];
  const CAT_COLOR = {};
  CATS.forEach((c) => (CAT_COLOR[c.id] = c.color));

  // Scattered trade-show documents (Scenes 1–2)
  const DOCS = [
    { title: "Visitor List.xlsx", kind: "Spreadsheet", ico: "📊", cat: "visitor" },
    { title: "Visitor Spreadsheet", kind: "Spreadsheet", ico: "📋", cat: "visitor" },
    { title: "Partner Email.msg", kind: "Email", ico: "✉️", cat: "partner" },
    { title: "WhatsApp Messages", kind: "Chat", ico: "💬", cat: "partner" },
    { title: "Booth Plan.pdf", kind: "Document", ico: "📄", cat: "booth" },
    { title: "Campaign Notes.md", kind: "Note", ico: "📝", cat: "campaign" },
    { title: "Follow-up Notes.docx", kind: "Document", ico: "📄", cat: "followup" },
    { title: "Meeting Notes", kind: "Note", ico: "🗒️", cat: "followup" },
    { title: "Pricing Request", kind: "Request", ico: "💶", cat: "followup" },
    { title: "Business Cards", kind: "Contacts", ico: "🪪", cat: "exhibitor" }
  ];

  // Knowledge Map entity types (Scene 4 entity filters)
  const TYPES = [
    { id: "event", name: "Events", color: "#6366f1" },
    { id: "partner", name: "Partners", color: "#34d399" },
    { id: "booth", name: "Booths", color: "#fb7185" },
    { id: "campaign", name: "Campaigns", color: "#a855f7" },
    { id: "visitor", name: "Visitors", color: "#8b5cf6" },
    { id: "lead", name: "Leads", color: "#0ea5e9" },
    { id: "opportunity", name: "Opportunities", color: "#f59e0b" },
    { id: "action", name: "Actions", color: "#14b8a6" }
  ];
  const TYPE_COLOR = {};
  TYPES.forEach((t) => (TYPE_COLOR[t.id] = t.color));

  // Graph nodes (positions are fractions of the canvas for 2D layout)
  const NODES = [
    { id: "expo", type: "event", label: "Paris Business Expo", x: 0.17, y: 0.5, size: 42 },
    { id: "partner", type: "partner", label: "Partner BizMedia", x: 0.17, y: 0.17, size: 30 },
    { id: "booth", type: "booth", label: "Booth B12", x: 0.37, y: 0.28, size: 30 },
    { id: "campaign", type: "campaign", label: "Campaign Spring 2026", x: 0.37, y: 0.75, size: 30 },
    { id: "marie", type: "visitor", label: "Visitor Marie Chen", x: 0.56, y: 0.5, size: 38 },
    { id: "lead", type: "lead", label: "Lead #L-204", x: 0.74, y: 0.31, size: 30 },
    { id: "opp", type: "opportunity", label: "Opportunity", x: 0.88, y: 0.53, size: 36 },
    { id: "action", type: "action", label: "Follow-up Action", x: 0.73, y: 0.73, size: 30 }
  ];
  const NODE_BY_ID = {};
  NODES.forEach((n) => (NODE_BY_ID[n.id] = n));

  const EDGES = [
    ["expo", "partner"], ["expo", "booth"], ["expo", "campaign"],
    ["partner", "booth"],
    ["booth", "marie"], ["campaign", "marie"],
    ["marie", "lead"], ["lead", "opp"], ["opp", "action"], ["marie", "opp"]
  ];

  // Marie Chen's footprint (Scene 5)
  const OPP_CHECKS = [
    "Visited Booth B12",
    "Opened Campaign Email",
    "Requested Pricing",
    "Mentioned Budget",
    "Follow-up Pending"
  ];

  /* ============================================================
     DOM REFS
     ============================================================ */
  const $ = (sel) => document.querySelector(sel);
  const stepperEl = $("[data-stepper]");
  const sidebar = $("[data-sidebar]");
  const sbSources = $("[data-sb-sources]");
  const sbFilters = $("[data-sb-filters]");
  const sbFiltersTitle = $("[data-sb-filters-title]");

  const eyebrow = $("[data-eyebrow]");
  const titleEl = $("[data-title]");
  const subEl = $("[data-sub]");
  const msgEl = $("[data-msg]");

  const viewport = $("[data-viewport]");
  const widgets = {};
  document.querySelectorAll(".widget").forEach((w) => (widgets[w.dataset.w] = w));

  const field = $("[data-field]");
  const groupsLayer = $("[data-groups]");
  const relEdges = $("[data-rel-edges]");
  const relNodes = $("[data-rel-nodes]");
  const relStatus = $("[data-rel-status]");
  const edgesSvg = $("[data-edges]");
  const nodesLayer = $("[data-nodes]");
  const minimapWrap = $("[data-minimap]");
  const oppPanel = $("[data-opp]");
  const oppChecks = $("[data-opp-checks]");

  const ctaPrimary = $("[data-cta-primary]");
  const ctaSecondary = $("[data-cta-secondary]");
  const backBtn = $("[data-back]");

  /* ============================================================
     SCENE DEFINITIONS
     ============================================================ */
  const STEPS = ["Chaos", "Memory", "Relationships", "Map", "Opportunity", "Action"];

  const SCENES = [
    {
      eyebrow: "Scene 01 — Trade show chaos",
      title: "A Trade Show Creates Hundreds of Records.",
      sub: "Visitor lists, emails, campaign notes, booth plans, follow-up documents and conversations quickly become impossible to manage.",
      msg: "",
      widget: "cardfield",
      sidebar: "none",
      primary: { label: "Organize with Semantic OS →", go: 2 }
    },
    {
      eyebrow: "Scene 02 — Semantic OS",
      title: "Semantic OS Organizes Information Into Structured Memory.",
      sub: "Every scattered file flows into the source it belongs to — automatically.",
      msg: "Semantic OS does not simply store files. It builds structured memory.",
      widget: "cardfield",
      sidebar: "sources",
      primary: { label: "Discover Relationships →", go: 3 }
    },
    {
      eyebrow: "Scene 03 — Relationships",
      title: "Relationships Matter More Than Documents.",
      sub: "Marie Chen appears across a visitor list, follow-up notes and a partner email.",
      msg: "Traditional knowledge bases store information. Semantic OS stores information and relationships.",
      widget: "relations",
      sidebar: "sources",
      primary: { label: "Open Knowledge Map AI →", go: 4 }
    },
    {
      eyebrow: "Scene 04 — Knowledge Map AI",
      title: "Knowledge Map AI Makes Relationships Visible.",
      sub: "Every entity connected — switch between a 2D map and 3D space.",
      msg: "",
      widget: "graph",
      sidebar: "map",
      primary: { label: "Reveal Hidden Opportunities →", go: 5 }
    },
    {
      eyebrow: "Scene 05 — Hidden opportunity",
      title: "Hidden Opportunities Become Visible.",
      sub: "Knowledge Map AI surfaces a high-value lead from the web of relationships.",
      msg: "Knowledge emerges from relationships.",
      widget: "graph",
      sidebar: "map",
      primary: { label: "Generate Action →", go: 6 }
    },
    {
      eyebrow: "Scene 06 — Action",
      title: "Turn Knowledge Into Action.",
      sub: "Semantic OS closes the loop — every record becomes a recommended next step.",
      msg: "",
      widget: "action",
      sidebar: "map",
      primary: { label: "Build Your Semantic OS", scrollTo: "#compare" },
      secondary: { label: "Explore Knowledge Map AI", href: MAP_URL }
    }
  ];

  let current = 0; // 0-based scene index

  /* ============================================================
     BUILD: stepper + sidebar
     ============================================================ */
  function buildStepper() {
    stepperEl.innerHTML = "";
    STEPS.forEach((name, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "step";
      b.dataset.step = i;
      b.innerHTML =
        '<span class="step__dot">' + (i + 1) + "</span>" +
        '<span class="step__name">' + name + "</span>";
      b.addEventListener("click", () => goTo(i));
      stepperEl.appendChild(b);
    });
  }

  function buildSidebar() {
    sbSources.innerHTML = "";
    CATS.forEach((c) => {
      const count = DOCS.filter((d) => d.cat === c.id).length;
      const li = document.createElement("li");
      li.style.setProperty("--src-color", c.color);
      li.innerHTML =
        '<span class="srclist__ico">' + c.ico + "</span>" + c.name +
        '<span class="srclist__n">' + count + "</span>";
      sbSources.appendChild(li);
    });

    sbFilters.innerHTML = "";
    TYPES.forEach((t) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "filter";
      b.style.setProperty("--f-color", t.color);
      b.textContent = t.name;
      b.dataset.type = t.id;
      b.addEventListener("click", () => toggleType(t.id, b));
      sbFilters.appendChild(b);
    });
  }

  function setSidebar(mode) {
    const show = mode !== "none";
    sidebar.setAttribute("aria-hidden", show ? "false" : "true");
    const map = mode === "map";
    sbFilters.hidden = !map;
    sbFiltersTitle.hidden = !map;
  }

  /* ============================================================
     SCENE CONTROLLER
     ============================================================ */
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

  function setStepper(idx) {
    stepperEl.querySelectorAll(".step").forEach((el, i) => {
      el.classList.toggle("is-active", i === idx);
      el.classList.toggle("is-done", i < idx);
    });
  }

  function showWidget(name) {
    Object.entries(widgets).forEach(([k, el]) => {
      const active = k === name;
      if (active) {
        el.classList.add("is-active");
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "power2.out" });
      } else {
        el.classList.remove("is-active");
      }
    });
  }

  function setCTAs(s) {
    ctaPrimary.textContent = s.primary.label;
    ctaPrimary.onclick = () => {
      if (s.primary.go) goTo(s.primary.go - 1);
      else if (s.primary.scrollTo) document.querySelector(s.primary.scrollTo).scrollIntoView({ behavior: "smooth" });
    };
    if (s.secondary) {
      ctaSecondary.hidden = false;
      ctaSecondary.textContent = s.secondary.label;
      ctaSecondary.onclick = () => {
        if (s.secondary.href) window.open(s.secondary.href, "_blank", "noopener");
        else if (s.secondary.go) goTo(s.secondary.go - 1);
      };
    } else {
      ctaSecondary.hidden = true;
    }
    backBtn.hidden = current === 0;
  }

  function goTo(idx) {
    idx = Math.max(0, Math.min(SCENES.length - 1, idx));
    const from = current;
    current = idx;
    const s = SCENES[idx];

    setStepper(idx);
    setHeadline(s);
    setSidebar(s.sidebar);

    // leaving the graph? stop its ticker
    if (s.widget !== "graph") stopEdgeTicker();

    showWidget(s.widget);
    setCTAs(s);

    if (s.widget === "cardfield") enterCardfield(idx, from);
    else if (s.widget === "relations") enterRelations();
    else if (s.widget === "graph") enterGraph(idx, from);
    else if (s.widget === "action") enterAction();
  }

  /* ============================================================
     PART A — DOCUMENT CARDS (Scenes 1–2)
     ============================================================ */
  let cardEls = [];
  let groupEls = {};
  let floatTweens = [];

  function buildCards() {
    field.innerHTML = "";
    cardEls = DOCS.map((d) => {
      const el = document.createElement("div");
      el.className = "card";
      el.style.setProperty("--card-color", CAT_COLOR[d.cat]);
      el.dataset.cat = d.cat;
      el.innerHTML =
        '<div class="card__top">' +
        '<span class="card__ico">' + d.ico + "</span>" +
        '<span class="card__kind">' + d.kind + "</span></div>" +
        '<div class="card__title">' + d.title + "</div>";
      field.appendChild(el);
      return el;
    });
    buildGroupLabels();
  }

  function buildGroupLabels() {
    groupsLayer.innerHTML = "";
    groupEls = {};
    CATS.forEach((c) => {
      const count = DOCS.filter((d) => d.cat === c.id).length;
      const el = document.createElement("div");
      el.className = "group-label";
      el.style.setProperty("--g-color", c.color);
      el.innerHTML =
        '<div class="group-label__name">' + c.name + "</div>" +
        '<div class="group-label__count">' + count + " records</div>";
      groupsLayer.appendChild(el);
      groupEls[c.id] = el;
    });
  }

  function fieldSize() {
    const r = field.getBoundingClientRect();
    return { w: r.width, h: r.height };
  }

  function killFloat() {
    floatTweens.forEach((t) => t.kill());
    floatTweens = [];
  }

  function scatter(animate) {
    killFloat();
    groupsLayer.setAttribute("aria-hidden", "true");
    gsap.set(Object.values(groupEls), { opacity: 0 });
    const { w, h } = fieldSize();
    const sx = Math.min(w * 0.4, 430);
    const sy = Math.min(h * 0.38, 165);
    cardEls.forEach((el, i) => {
      el.classList.remove("is-grouped");
      el.style.setProperty("--card-color", CAT_COLOR[DOCS[i].cat]);
      const x = (Math.random() * 2 - 1) * sx;
      const y = (Math.random() * 2 - 1) * sy;
      const r = (Math.random() * 2 - 1) * 10;
      if (animate) {
        gsap.fromTo(el, { x: 0, y: 0, rotation: 0, scale: 0.6, opacity: 0 },
          { x, y, rotation: r, scale: 1, opacity: 1, duration: 0.8, delay: i * 0.04,
            ease: "back.out(1.4)", onComplete: () => startFloat(el, i) });
      } else {
        gsap.set(el, { x, y, rotation: r, scale: 1, opacity: 1 });
        startFloat(el, i);
      }
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

  function organize(animate) {
    killFloat();
    const { w, h } = fieldSize();
    const n = CATS.length;
    const colW = w / n;
    const slot = {};
    CATS.forEach((c) => (slot[c.id] = 0));
    const cardH = window.innerWidth <= 900 ? 70 : 80;
    const startY = -h / 2 + 74;

    const tl = gsap.timeline();
    cardEls.forEach((el, i) => {
      const cat = DOCS[i].cat;
      const ci = CATS.findIndex((c) => c.id === cat);
      const colX = -w / 2 + colW * (ci + 0.5);
      const idx = slot[cat]++;
      el.classList.add("is-grouped");
      el.style.setProperty("--card-color", CAT_COLOR[cat]);
      const tx = colX, ty = startY + idx * cardH;
      if (animate) {
        tl.to(el, { x: tx, y: ty, rotation: 0, scale: 1, duration: 1.0, ease: "power3.inOut" }, i * 0.035);
      } else {
        gsap.set(el, { x: tx, y: ty, rotation: 0, scale: 1, opacity: 1 });
      }
    });

    groupsLayer.setAttribute("aria-hidden", "false");
    CATS.forEach((c, i) => {
      const colX = -w / 2 + colW * (i + 0.5);
      gsap.set(groupEls[c.id], { left: "50%", top: "50%", x: colX, y: -h / 2 + 28 });
      if (animate) tl.to(groupEls[c.id], { opacity: 1, duration: 0.5 }, 0.45);
      else gsap.set(groupEls[c.id], { opacity: 1 });
    });
  }

  function enterCardfield(scene, from) {
    if (scene === 0) {
      buildCards();
      scatter(true);
    } else {
      // scene 2 (index 1)
      if (from === 0) {
        organize(true); // morph from existing scattered cards
      } else {
        buildCards();
        organize(false);
      }
    }
  }

  /* ============================================================
     PART B — RELATIONSHIP DISCOVERY (Scene 3)
     ============================================================ */
  const REL_ITEMS = [
    { title: "Visitor List.xlsx", kind: "Spreadsheet", ico: "📊", cat: "visitor", x: 0.2, y: 0.34 },
    { title: "Partner Email.msg", kind: "Email", ico: "✉️", cat: "partner", x: 0.5, y: 0.16 },
    { title: "Follow-up Notes.docx", kind: "Document", ico: "📄", cat: "followup", x: 0.8, y: 0.34 }
  ];

  function enterRelations() {
    relNodes.innerHTML = "";
    relStatus.innerHTML = "";
    relEdges.innerHTML =
      '<defs><linearGradient id="relGrad" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#8b5cf6"/><stop offset="1" stop-color="#5b6cff"/>' +
      "</linearGradient></defs>";

    const rect = widgets.relations.getBoundingClientRect();
    const w = rect.width, h = rect.height;

    // person (center)
    const person = document.createElement("div");
    person.className = "rel-person";
    person.innerHTML =
      '<div class="rel-person__avatar">MC</div>' +
      '<div class="rel-person__name">Marie Chen</div>' +
      '<div class="rel-person__role">Visitor · linked entity</div>';
    relNodes.appendChild(person);
    const px = w * 0.5, py = h * 0.56;
    gsap.set(person, { left: px, top: py, xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });

    // record items
    const items = REL_ITEMS.map((it) => {
      const el = document.createElement("div");
      el.className = "rel-item";
      el.style.setProperty("--card-color", CAT_COLOR[it.cat]);
      el.innerHTML =
        '<div class="card__top"><span class="card__ico">' + it.ico + "</span>" +
        '<span class="card__kind">' + it.kind + "</span></div>" +
        '<div class="card__title">' + it.title + "</div>";
      relNodes.appendChild(el);
      const x = w * it.x, y = h * it.y;
      gsap.set(el, { left: x, top: y, xPercent: -50, yPercent: -50, opacity: 0, scale: 0.7 });
      return { el, x, y };
    });

    // edges (record → person)
    const paths = items.map((it) => {
      const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const c1x = it.x + (px - it.x) * 0.4;
      const d = "M" + it.x + "," + it.y + " C" + c1x + "," + it.y + " " + c1x + "," + py + " " + px + "," + py;
      p.setAttribute("d", d);
      p.style.opacity = "0";
      relEdges.appendChild(p);
      return p;
    });

    // status chips
    const chips = ["Same person detected", "Context linked", "Relationship created"].map((txt) => {
      const c = document.createElement("div");
      c.className = "rel-chip";
      c.textContent = txt;
      relStatus.appendChild(c);
      return c;
    });

    // animate
    const tl = gsap.timeline();
    tl.to(items.map((i) => i.el), { opacity: 1, scale: 1, duration: 0.5, stagger: 0.12, ease: "back.out(1.5)" });
    tl.to(person, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.6)" }, "-=0.2");
    paths.forEach((p) => {
      const len = p.getTotalLength ? p.getTotalLength() : 300;
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
      tl.to(p, { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" }, "-=0.35");
    });
    chips.forEach((c) => tl.to(c, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.4"));
  }

  /* ============================================================
     PART C — KNOWLEDGE MAP AI GRAPH (Scenes 4–5)
     ============================================================ */
  const nodeEls = {};
  const edgePaths = [];
  const miniDots = {};
  let graphBuilt = false;
  let view = "2d";
  let activeTypes = new Set(TYPES.map((t) => t.id));
  let nodeFloat = [];
  let tickerOn = false;

  function buildGraph() {
    nodesLayer.innerHTML = "";
    edgesSvg.innerHTML = "";
    minimapWrap.innerHTML = "";

    NODES.forEach((n) => {
      const el = document.createElement("div");
      el.className = "node";
      el.style.setProperty("--node-color", TYPE_COLOR[n.type]);
      el.dataset.type = n.type;
      el.dataset.id = n.id;
      el.innerHTML =
        '<span class="node__dot" style="--size:' + n.size + 'px"></span>' +
        '<span class="node__label">' + n.label + "</span>";
      el.addEventListener("mouseenter", () => highlightNeighbors(n.id, true));
      el.addEventListener("mouseleave", () => highlightNeighbors(n.id, false));
      nodesLayer.appendChild(el);
      nodeEls[n.id] = el;

      const md = document.createElement("span");
      md.className = "minimap__dot";
      md.style.background = TYPE_COLOR[n.type];
      minimapWrap.appendChild(md);
      miniDots[n.id] = md;
    });

    EDGES.forEach(() => {
      const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
      edgesSvg.appendChild(p);
      edgePaths.push(p);
    });
    graphBuilt = true;
  }

  function canvasSize() {
    const r = widgets.graph.getBoundingClientRect();
    return { w: r.width, h: r.height };
  }

  function layoutPositions() {
    const { w, h } = canvasSize();
    const pos = {};
    if (view === "2d") {
      NODES.forEach((n) => { pos[n.id] = { x: n.x * w, y: n.y * h, scale: 1 }; });
    } else {
      const cx = w / 2, cy = h / 2;
      const sx = Math.min(w * 0.36, 320);
      const sy = Math.min(h * 0.34, 165);
      NODES.forEach((n, i) => {
        const ang = (i / NODES.length) * Math.PI * 2;
        const dz = 0.72 + ((i * 53) % 100) / 100 * 0.55;
        pos[n.id] = {
          x: cx + Math.cos(ang) * sx * (0.5 + (i % 3) * 0.25),
          y: cy + Math.sin(ang * 1.25) * sy * (0.55 + (i % 2) * 0.45),
          scale: dz
        };
      });
    }
    return pos;
  }

  function applyLayout(animate) {
    const pos = layoutPositions();
    const { w, h } = canvasSize();
    NODES.forEach((n, i) => {
      const p = pos[n.id];
      const el = nodeEls[n.id];
      if (animate) {
        gsap.to(el, { x: p.x, y: p.y, scale: p.scale, duration: 0.9, ease: "power3.inOut", delay: (i % 6) * 0.03 });
      } else {
        gsap.set(el, { x: p.x, y: p.y, scale: p.scale, xPercent: -50, yPercent: -50 });
      }
      gsap.to(miniDots[n.id], { left: (p.x / w) * 100 + "%", top: (p.y / h) * 100 + "%", duration: 0.5 });
    });
  }

  function nodeCenter(id) {
    return { x: gsap.getProperty(nodeEls[id], "x"), y: gsap.getProperty(nodeEls[id], "y") - 12 };
  }

  function redrawEdges() {
    EDGES.forEach((e, i) => {
      const a = nodeCenter(e[0]), b = nodeCenter(e[1]);
      const dx = b.x - a.x;
      const c1x = a.x + dx * 0.45, c2x = b.x - dx * 0.45;
      edgePaths[i].setAttribute("d",
        "M" + a.x + "," + a.y + " C" + c1x + "," + a.y + " " + c2x + "," + b.y + " " + b.x + "," + b.y);
      const off = !activeTypes.has(NODE_BY_ID[e[0]].type) || !activeTypes.has(NODE_BY_ID[e[1]].type);
      edgePaths[i].style.stroke = off ? "rgba(150,165,205,0.12)" : "rgba(120,140,210,0.42)";
    });
  }

  function startEdgeTicker() {
    if (tickerOn) return;
    gsap.ticker.add(redrawEdges);
    tickerOn = true;
  }
  function stopEdgeTicker() {
    if (!tickerOn) return;
    gsap.ticker.remove(redrawEdges);
    tickerOn = false;
  }

  function playIntro() {
    const tl = gsap.timeline();
    NODES.forEach((n, i) => {
      const target = gsap.getProperty(nodeEls[n.id], "scale") || 1;
      gsap.set(nodeEls[n.id], { scale: 0, opacity: 0 });
      tl.to(nodeEls[n.id], { scale: target, opacity: 1, duration: 0.5, ease: "back.out(1.6)" }, 0.05 * i);
    });
    edgePaths.forEach((p) => {
      gsap.set(p, { strokeDasharray: 600, strokeDashoffset: 600, opacity: 1 });
      tl.to(p, { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" }, "-=0.35");
    });
  }

  function setView(v, btns) {
    if (view === v) return;
    view = v;
    btns.forEach((b) => b.classList.toggle("is-active", b.dataset.view === v));
    applyLayout(true);
    if (v === "3d") startNodeFloat();
    else stopNodeFloat();
  }

  function startNodeFloat() {
    if (reduceMotion) return;
    stopNodeFloat();
    NODES.forEach((n, i) => {
      nodeFloat.push(gsap.to(nodeEls[n.id], {
        y: "+=" + (7 + Math.random() * 9), duration: 2 + Math.random() * 1.6,
        ease: "sine.inOut", yoyo: true, repeat: -1, delay: i * 0.05
      }));
    });
  }
  function stopNodeFloat() {
    nodeFloat.forEach((t) => t.kill());
    nodeFloat = [];
  }

  function toggleType(type, btn) {
    if (activeTypes.has(type)) activeTypes.delete(type);
    else activeTypes.add(type);
    btn.classList.toggle("is-off", !activeTypes.has(type));
    NODES.forEach((n) => {
      const on = activeTypes.has(n.type);
      if (nodeEls[n.id]) nodeEls[n.id].classList.toggle("is-dim", !on);
      if (miniDots[n.id]) gsap.to(miniDots[n.id], { opacity: on ? 1 : 0.15, duration: 0.3 });
    });
  }

  function highlightNeighbors(id, on) {
    if (oppActive) return; // don't fight the Scene 5 highlight
    if (!on) {
      NODES.forEach((n) => { if (activeTypes.has(n.type)) nodeEls[n.id].classList.remove("is-dim"); });
      return;
    }
    const linked = new Set([id]);
    EDGES.forEach((e) => {
      if (e[0] === id) linked.add(e[1]);
      if (e[1] === id) linked.add(e[0]);
    });
    NODES.forEach((n) => nodeEls[n.id].classList.toggle("is-dim", !linked.has(n.id)));
  }

  let oppActive = false;
  function highlightOpportunity() {
    oppActive = true;
    const linked = new Set(["marie"]);
    EDGES.forEach((e) => {
      if (e[0] === "marie") linked.add(e[1]);
      if (e[1] === "marie") linked.add(e[0]);
    });
    NODES.forEach((n) => {
      nodeEls[n.id].classList.toggle("is-dim", !linked.has(n.id));
      nodeEls[n.id].classList.toggle("is-hot", n.id === "marie" || n.id === "opp");
    });
  }
  function clearHighlight() {
    oppActive = false;
    NODES.forEach((n) => {
      nodeEls[n.id].classList.remove("is-hot");
      if (activeTypes.has(n.type)) nodeEls[n.id].classList.remove("is-dim");
    });
  }

  function showOppPanel() {
    oppChecks.innerHTML = "";
    const lis = OPP_CHECKS.map((t) => {
      const li = document.createElement("li");
      li.textContent = t;
      oppChecks.appendChild(li);
      return li;
    });
    gsap.fromTo(oppPanel, { opacity: 0, x: 16 }, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" });
    oppPanel.hidden = false;
    const tl = gsap.timeline({ delay: 0.2 });
    lis.forEach((li) => tl.fromTo(li, { opacity: 0, x: 10 }, { opacity: 1, x: 0, duration: 0.3 }, "+=0.08"));
    animateNumber($('[data-num="confidence"]'), 91, $('[data-ring="confidence"]'));
    animateNumber($('[data-num="opp"]'), 87, $('[data-ring="opp"]'));
    animateNumber($('[data-num="rev"]'), 12000, null, true);
  }
  function hideOppPanel() {
    oppPanel.hidden = true;
  }

  function animateNumber(el, to, ring, isMoney) {
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

  function enterGraph(scene, from) {
    if (!graphBuilt) buildGraph();
    applyLayout(false);
    startEdgeTicker();

    const toggleBtns = Array.from(widgets.graph.querySelectorAll(".toggle__pill"));
    toggleBtns.forEach((b) => { b.onclick = () => setView(b.dataset.view, toggleBtns); });

    if (scene === 3) {
      // Scene 4
      hideOppPanel();
      clearHighlight();
      if (from !== 4) playIntro(); // fresh entry → animate in
    } else {
      // Scene 5
      highlightOpportunity();
      showOppPanel();
    }
  }

  /* ============================================================
     PART D — ACTION (Scene 6)
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
     INIT + RESIZE
     ============================================================ */
  function init() {
    buildStepper();
    buildSidebar();
    buildCards();
    backBtn.addEventListener("click", () => goTo(current - 1));
    goTo(0);

    let raf;
    window.addEventListener("resize", () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const s = SCENES[current];
        if (s.widget === "cardfield") {
          if (current === 1) organize(false);
          else { killFloat(); scatter(false); }
        } else if (s.widget === "graph") {
          applyLayout(false);
        } else if (s.widget === "relations") {
          enterRelations();
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
