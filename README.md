# Semantic OS × Knowledge Map AI — Promo MVP v2

An interactive promo that tells one story: **how scattered trade-show records
become an actionable intelligence map.**

> Your second brain should not just store notes. It should reveal relationships.
> **Semantic OS remembers. Knowledge Map AI makes it visible.**

Styled after [map.clawshow.ai](https://map.clawshow.ai): a calm, light, enterprise
SaaS interface with soft blue / purple accents, a subtle grid + floating dots, and
a "second brain" feeling. Built with plain **HTML + CSS + JavaScript + GSAP** —
no React, no framework, no backend, no build step.

## Product positioning

- **Semantic OS is the memory layer.** It stores **content, relationships,
  context, causality** and **action feedback** — not a dead knowledge base.
- **Knowledge Map AI is the visualization layer.** It reveals those relationships
  in **2D and 3D**.
- **Together**, they turn scattered work into an actionable intelligence map and
  generate the next action.

## The journey (6 scenes)

A trade-show case study, advanced via the buttons (or the top stepper):

| # | Scene | What happens |
|---|-------|--------------|
| 1 | **Trade show chaos** | Floating documents (Visitor List, Partner Email, Booth Plan, Campaign Notes, Follow-up Notes, WhatsApp, Business Cards, Pricing Request…) drift, scattered. |
| 2 | **Semantic OS** | Files fly into 6 source groups: Exhibitor Files · Visitor Lists · Campaign Notes · Partner Emails · Booth Plans · Follow-up Notes. A left sidebar appears. |
| 3 | **Relationships** | *Marie Chen* is detected across three records; lines connect them — *same person → context linked → relationship created*. |
| 4 | **Knowledge Map AI** | The relationship graph: round colored nodes, curved edges, **2D Map / 3D Space** toggle, left panel with **Information Sources** + **Entity Filters**, mini-map. Nodes appear sequentially, edges draw in. |
| 5 | **Hidden opportunity** | Marie Chen's sub-graph lights up; an opportunity panel shows her footprint, a **confidence** ring, **Opportunity Score 87%**, and **€12,000** revenue potential. |
| 6 | **Action** | A glowing action card: contact within 48h, send pricing, schedule follow-up — **63% conversion**, **€12,000** expected revenue. |

A final **comparison section** contrasts a Traditional Knowledge Base with
Semantic OS + Knowledge Map AI, and closes with the two CTAs.

## Project structure

```
index.html    Markup: stepper, sidebar, scene widgets, comparison
styles.css    Light SaaS theme, responsive
app.js        Scene controller + all GSAP animations + graph engine
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

1. Push this repo to GitHub (see below).
2. On GitHub: **Settings → Pages**.
3. Under **Build and deployment**, set **Source = Deploy from a branch**.
4. Choose **Branch: `main`** and **Folder: `/ (root)`**, then **Save**.
5. After a minute, your site is live at:

   ```
   https://<your-username>.github.io/<repo-name>/
   ```

No `.nojekyll` file is needed (there are no underscore-prefixed paths). To use a
custom domain later, add a `CNAME` file at the root.

## Notes

- The CTAs link out: **Build Your Semantic OS** → `#contact` (placeholder anchor),
  **Explore Knowledge Map AI** → <https://map.clawshow.ai> (opens in a new tab).
- Everything is responsive; the sidebar stacks under the stage on small screens.
- `prefers-reduced-motion` disables idle floating and the action-card glow.
- Uses CSS `color-mix()` for soft node halos (supported by current Chrome / Edge /
  Firefox / Safari).
