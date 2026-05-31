# Semantic OS — Promo MVP (Relationship-First)

An interactive promo for **Semantic OS** — the memory layer that stores not just
documents, but **relationships, context, causality and action feedback**.

> Semantic OS does not store files. It stores relationships.

**The relationship is the hero.** Traditional knowledge bases store documents;
knowledge graphs visualize nodes — Semantic OS stores the relationships themselves
(saved, searchable, reusable and connected to future actions). Knowledge Map AI is
*only its visualization layer* and appears once, at the final call-to-action.

Styled after [map.clawshow.ai](https://map.clawshow.ai): a calm, light, enterprise
SaaS interface with soft blue / purple accents and a subtle grid + floating dots.
Built with plain **HTML + CSS + JavaScript + GSAP**, plus **Three.js** (CDN) for the
interactive 3D relationship space — no React, no framework, no backend, no build step.

## The story — 5 steps

A new visitor should leave understanding: Semantic OS stores **relationships**,
relationships are **searchable**, they accumulate **context**, context reveals
**causality**, and causality generates **action**.

| # | Step | What it shows |
|---|------|---------------|
| 1 | **Chaos** | Emails, notes, visitor lists, pricing requests, meeting notes and conversations drift as scattered files. |
| 2 | **Structure** | Files become a clean **CSS-Grid** of information sources (Visitor Lists, Partner Emails, Meeting Notes, Pricing Requests, Campaign Notes, Follow-up Notes) — structured memory, no overlap. |
| 3 | **Relationships** (the hero) | **Relationship records** — each a labeled link between two sources (e.g. *Same Visitor*, *Mentioned Budget*) with **Confidence %** and **Saved · Searchable · Reusable** flags. The relationship itself is the stored object. |
| 4 | **Context + Causality** | Connected relationships accumulate into meaning: evidence → **Context: High Purchase Intent** → **Causality: pricing request received but no response sent**. |
| 5 | **Action** | A recommended-action card driven by the relationships — contact within 48h, **€12,000** expected revenue, **63%** probability. |

**Final CTA — interactive 3D relationship space (miniature Knowledge Map AI).**
A real **Three.js** scene the visitor can **drag to rotate, scroll to zoom**, with the
layers stacked in depth: **Records → Relationships → Context → Actions**. Relationships
are the hero — first-class, clickable objects: click one to open a detail panel with its
**Meaning, Evidence, Confidence, Saved · Searchable · Reusable**. It demonstrates
*records become relationships, relationships become context, context becomes actions.*

- Primary: **Explore Relationships in 2D/3D** → <https://map.clawshow.ai> (opens in a new tab)
- Secondary: **Build Your Semantic OS** → opens a contact modal (see below)

## Project structure

```
index.html    Markup: stepper, 5 step widgets, final CTA
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
