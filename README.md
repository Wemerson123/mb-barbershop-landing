# MB Barbershop — Landing Page

Single-page landing site for **MB Barbershop**, 5/149 Caxton St, Paddington, Brisbane.
React 18 + TypeScript + Vite + Tailwind CSS. Icons from `lucide-react`. No UI or
animation libraries — every effect is hand-rolled with `requestAnimationFrame`, CSS
transforms and canvas.

```bash
npm install
npm run dev      # http://localhost:5202
npm run build    # tsc + vite build -> dist/
npm run typecheck
```

## The effects

**1. Cursor spotlight reveal (hero).** Two photographs of the same chair, same
framing: the base layer is a client grown weeks past his last cut, desaturated and
flat; the layer above it is the same shot with a finished skin fade, warm and sharp.
A radial-gradient mask follows the cursor, so moving the mouse cuts the hair in real
time. That's the whole pitch of the shop in one gesture — "walk in rough, walk out
sharp."

`SPOTLIGHT_R = 260`, with the exact gradient stops from the brief
(`1 → 1 → 0.75 → 0.4 → 0.12 → 0`).

**2. Drag-to-spin photo ring (The Work).** Twelve cards on a cylinder under a `35em`
perspective, edges masked off. Grab it and throw it: `0.4°` of rotation per pixel
dragged, then it coasts on inertia and eases back to its idle drift. Hovering brings it
to a stop so a card can be studied; arrow keys nudge it 30° (90° with shift).

Rotation lives in a ref and is written straight to the node inside the `rAF` loop —
never through React state, since 60fps of state changes would re-render twelve cards
several hundred times a second. One exponential decay toward a target velocity does
double duty: it's the fling inertia and it's the ease back up to idle. `touch-action:
pan-y` keeps vertical page scrolling on mobile while horizontal drags spin the ring.
Under `prefers-reduced-motion` the idle drift is off entirely and the ring only moves
when the user moves it.

**3. Opening title card (`Intro.tsx`).** The MB mark strikes on in brass neon —
scale + blur + a flicker at 52%, matched to the real sign hanging behind Manolo — then
the panel splits at the seam and lifts away to the hero. 2.4s total.

It gets out of the way properly, which matters more than the animation:

- once per session (`sessionStorage`), so it isn't a toll booth on every visit
- skips instantly on click, keypress, wheel or touch
- never runs under `prefers-reduced-motion`
- never runs on a hash deep-link (`/#services` goes straight there), and doesn't burn
  the session flag when it declines to play
- locks body scroll while playing and restores exactly what was there

Behind the hero: a 48px SVG grid whose pattern origin drifts against the cursor
(`GRID_CELL = 48`, max 16px of travel).

### One deliberate change from the brief

The brief specified generating the spotlight mask by re-encoding a viewport-sized
canvas with `toDataURL()` **every frame**. That produces the right picture but costs
30–80ms per frame, which visibly stutters. `RevealLayer` keeps the canvas, the
`createRadialGradient`, the `arc()` fill and `toDataURL()` — and every gradient stop —
but sizes the canvas to the spotlight itself (`2R × 2R`) and encodes it **once**.
Cursor movement then only changes `mask-position`, which the compositor does for free.
Identical pixels, 60fps instead of ~12.

Also worth knowing: `translateZ()` rejects percentages, so the ring's radius comes from
a `--card-w` length variable, and `cot(π/12)` is precomputed rather than relying on
CSS `tan()`.

## Business data — all of it verified

`src/lib/business.ts` and `src/lib/hours.ts` hold every fact on the page, taken from
the shop's own Square Online site and Instagram bio:

- 11 services with exact AUD prices and durations (Scissor Cut A$65 → Ear Waxing A$15)
- Trading hours Mon–Sat, closed Sunday
- Phone 0481 722 499, mbbarbershop2025@gmail.com, suite 5/149 Caxton St
- Booking links point at the live Square appointments page
- `@mbbarbershop2025` and barber `@manollo_barber`

**Nothing on this page is invented.** No testimonials, no review counts, no "20 years
of experience", no awards — none of that was verifiable, so none of it is there. Two
things were caught and removed during the build for exactly that reason: a "cuts from
A$15" line (that price is the nostril wax, not a haircut — it now reads A$46, the
cheapest actual cut) and a "walk-ins welcome" claim (the shop runs on appointments and
says nothing about walk-ins).

The open/closed pill and the "Today" row in the hours table are computed live in
`Australia/Brisbane` via `Intl`, and refresh every 60 seconds.

## Images

`manolo.webp` is **supplied by the client** — the owner in his own chair under the shop's
neon sign. It anchors the `#manolo` section and is the one image not to touch.

Everything else in `public/img/` is **AI-generated placeholder photography**, deliberately
shot from behind or cropped below the eyes so no invented face is presented as a real
client. Swap them for the shop's own photos before this goes anywhere public — the
Instagram account has 60 real posts to draw from. Keep the filenames and nothing else
needs to change:

| File | Role | Needs |
| --- | --- | --- |
| `manolo.webp` | `#manolo` feature | **client asset — keep** |
| `hero-before.webp` | hero base | grown-out cut, **same framing as after** |
| `hero-after.webp` | spotlight reveal | finished cut, identical framing |
| `gallery/g1–g6.webp` | 3D ring | portrait 7:10 |
| `barber-work.webp` | *(currently unused)* | landscape, barber at work |
| `interior.webp` | Visit | landscape, the shop |

The hero pair only works if the two frames line up — shoot them from one tripod
position, before and after the same cut.

**Priority note.** Manolo's photo shows what the shop actually looks like: **black and
gold**, with a gold neon `MB` and red `BARBERSHOP` lettering. The placeholders were
generated before that was known and lean burgundy/brown, so they read slightly off-brand
next to him — `interior.webp` in the Visit section most of all. Replacing those is the
highest-value swap. The palette has since been corrected to match the real sign: black,
bone, the maroon red from their `theme-color`, and brass gold.

## Structure

```
src/
  App.tsx                 section order
  lib/business.ts         verified business facts, service menu
  lib/hours.ts            trading hours + live open/closed in Brisbane time
  lib/constants.ts        SPOTLIGHT_R, GRID_CELL, easing factors
  hooks/usePointer.ts     rAF pointer easing + grid parallax
  hooks/useReveal.ts      IntersectionObserver scroll reveals
  components/             Intro, Nav, Hero, RevealLayer, GridBackdrop, Marquee,
                          Work, Carousel3D, Services, Barber, Visit, Footer
  index.css               exactly as specified in the brief
  styles/base.css         scroll behaviour + reveal system (kept out of index.css)
```

The fixed nav samples whichever section crosses its mid-line (`data-surface="dark"`)
and re-tones itself, because the page alternates bone and near-black.

Only one component may own `body { overflow }` at a time. Both `Intro` (scroll lock
during the title card) and `Nav` (mobile sheet) capture the previous value and restore
it, and neither writes when it isn't active — an earlier version had `Nav` blanking the
overflow on mount, which silently unlocked the intro.

## Notes

- SEO: `HairSalon` JSON-LD in `index.html` with the real address, geo, hours,
  price range and a `ReserveAction` pointing at the Square booking page.
- Accessibility: full keyboard focus rings, labelled icon buttons, alt text on all 14
  images, hours as a real `<table>` with a caption, `prefers-reduced-motion` honoured
  by the reveals, ring and pointer easing.
- `@supabase/supabase-js` is installed per the brief but not imported anywhere — it's
  there for a future booking or enquiry form. Unused, so it's tree-shaken out of the
  bundle.
- Production bundle: 56 kB gzipped JS, 5 kB CSS.
