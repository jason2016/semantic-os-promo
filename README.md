# Semantic OS — Promo MVP

An interactive promo for **Semantic OS**, designed to explain the value in **under 15
seconds**, even to a non-technical (12-year-old) visitor:

> Most systems store information. **Semantic OS connects information.**
> Connected information becomes useful action.

The story is deliberately simple — **Information → Connection → Action**. It explains
the *benefit*, never the architecture: abstract words like *relationship*, *context*
and *causality* are kept out of the story. The full graph exploration is **not** here —
it lives in Knowledge Map AI, which is the *destination* this promo leads to.

A cinematic, **alive** experience (think Apple keynote × Linear × Arc): soft blue /
purple gradients, **floating light dust**, flowing particle streams along curved paths,
glowing motion and dramatic reveals — not a dashboard or graph database. Built with
plain **HTML + CSS + JavaScript + GSAP** (incl. **MotionPathPlugin** for the particle
flow) — no React, no framework, no backend, no build step. (No Three.js, no canvas, no
drag/rotate/zoom — this is a story that sells the value; the real graph lives at
map.clawshow.ai.)

## The story — 4 steps (built around 3 "aha" moments)

**Information → Connection → Understanding → Action.** Storytelling over dashboard:
each step is a small transformation a 12-year-old can follow, ending in the feeling
*"AI suddenly understood something I couldn't see."* No 3D graph, no playground
(that's the destination, Knowledge Map AI).

| # | Step | What it shows |
|---|------|---------------|
| 1 | **Your Information Is Everywhere** | Email, WhatsApp, Meeting Notes, Pricing Request and Visitor List float around — *finding information takes time*. |
| 2 | **AI Finds The Same Person** | **Glowing particles stream along curved paths** (GSAP MotionPath) from Email, WhatsApp, Meeting Notes and Pricing Request **toward Marie Chen** — information flowing, not a static graph. She pulses and a badge pops: **AI FOUND / 1 PERSON**. Tap her → *Found in ✓ Email ✓ WhatsApp ✓ Meeting Notes ✓ Pricing Request.* *(First wow.)* |
| 3 | **AI Finds The Opportunity** | A **bright pulse flows** through the chain — *Pricing Request → Budget Discussed → No Follow-Up → Opportunity Detected* — then a giant **💰 €12,000** bursts in (scale 0 → 1.4 → 1.0, radial glow + particles exploding outward), the largest thing on the page: *AI found a missed opportunity.* *(Strongest moment.)* |
| 4 | **Ask Anything** | A search box **types** *"What should I do next?"*, then the **reasoning lights up step by step (1 → 6)**: Marie Chen → Pricing Request → Budget Discussed → No Follow-Up → €12,000 → Follow Up Today, and the recommendation appears: **Follow up Marie Chen**, **€12,000**. *AI explains why — not random answers.* |

**Step 4 closes with the conversion:**

- Primary: **Explore Relationships in 2D/3D** → <https://map.clawshow.ai> (opens in a new tab)
- Secondary: **Build Your Semantic OS** → opens a contact modal (see below)

Knowledge Map AI is the destination; Semantic OS is the story.

## Project structure

```
index.html    Markup: stepper, 4 step widgets, modal
styles.css    Light SaaS theme, responsive, CSS-Grid source layout
app.js        Scene controller + GSAP animations
README.md     This file
```

## Run locally

No build tools required — just a static file server (the GSAP CDN prefers `http://`).

**Python 3**
```bash
python -m http.server 8000
```

**Node**
```bash
npx serve .
```

**VS Code** — *Live Server* extension → "Go Live".

Then open <http://localhost:8000>.

## Deploy to GitHub Pages

All asset paths are **relative** (`styles.css`, `app.js`) and `index.html` lives at
the repository root, so the site works as a GitHub Pages **project site** with no
build step.

1. Push this repo to GitHub.
2. **Settings → Pages**.
3. **Build and deployment → Source = Deploy from a branch**.
4. **Branch: `main`**, **Folder: `/ (root)`**, then **Save**.
5. The site goes live at `https://<your-username>.github.io/<repo-name>/`.

No `.nojekyll` is needed (no underscore-prefixed paths). For a custom domain, add a
`CNAME` file at the root.

## Notes

- Navigate with the primary button, the top **stepper**, or **Back**.
- **Replay Demo** (top-right) restarts the whole 5-step journey — resetting state,
  progress and animations and scrolling back to the top — without a page refresh.
- **Build Your Semantic OS** opens a modal with the contact email
  (`jason.lu@futushow.com`) and a **Copy Email** button (with an "Email copied"
  confirmation). No backend or contact form — pure HTML/CSS/JS.
- Step 2's source layout uses **CSS Grid** with no absolute positioning — clean and
  non-overlapping by construction.
- Everything is responsive; `prefers-reduced-motion` disables idle floating and the
  action-card glow.
- Uses CSS `color-mix()` for soft tints (supported by current Chrome / Edge /
  Firefox / Safari).
