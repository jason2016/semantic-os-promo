# Semantic OS — Promo MVP v3

An interactive promo for **Semantic OS** — the product that turns scattered
trade-show records into structured, actionable memory.

> Your second brain should not just store notes. It should reveal relationships.

**Semantic OS is the product.** Knowledge Map AI is *only its visualization layer*
and appears once, at the final call-to-action. The homepage focuses entirely on
Semantic OS.

Styled after [map.clawshow.ai](https://map.clawshow.ai): a calm, light, enterprise
SaaS interface with soft blue / purple accents and a subtle grid + floating dots.
Built with plain **HTML + CSS + JavaScript + GSAP** — no React, no framework, no
backend, no build step.

## The story — 5 steps

A new visitor should understand the value in ~30 seconds:

| # | Step | Message |
|---|------|---------|
| 1 | **Too Much Information** | Trade shows generate emails, lists, notes and conversations — scattered files drift on screen. |
| 2 | **Semantic OS Organizes Information** | Files snap into a clean **CSS-Grid** of 6 information sources (Exhibitor Files, Visitor Lists, Campaign Notes, Partner Emails, Booth Plans, Follow-up Notes), each listing its documents. *No overlap, no floating cards.* |
| 3 | **Relationships Matter More Than Documents** | *Marie Chen* is detected across a visitor list, email, pricing request and meeting notes; lines connect them — *same person → relationship created*. |
| 4 | **Hidden Opportunities Become Visible** | Marie's footprint resolves into one signal: **Opportunity Score 87%**, **€12,000** revenue potential. |
| 5 | **Turn Knowledge Into Action** | A recommended-action card: contact within 48h, send pricing, schedule a call — **63% conversion**, **€12,000** expected revenue. |

**Final CTA** — *"Want to See Your Relationships? Semantic OS stores content,
relationships, context, causality and action feedback. Explore them visually in 2D
and 3D."*

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
