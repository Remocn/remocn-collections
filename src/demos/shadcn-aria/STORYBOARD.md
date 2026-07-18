# STORYBOARD — shadcn/ui × React Aria (choose-your-foundation cut)

The announcement cut for shadcn/ui's July 2026 changelog entry: React Aria is now a
first-class component base. The viewer is a React dev who already uses (or watches)
shadcn/ui; after ~30 seconds they should know: **the base under your components is now
a choice, one of the choices is React Aria, and picking it costs one flag.**

- **Arc:** Demo Loop (product intro → mechanism → real-component demo cycle → CTA)
- **Length:** ~28s @ 30fps, 1280×720
- **Register:** sampled LIVE from ui.shadcn.com dark tokens (fetched 2026-07-17):
  canvas `#0a0a0a`, ink `#fafafa`, card `#171717`, muted `#a1a1a1`, hairline
  `rgba(255,255,255,.10)`, input `rgba(255,255,255,.15)`, radius 10px, Geist 400/500 +
  Geist Mono. Guest brand React Aria: exact header mark (single path, two subpaths,
  viewBox `200 206 800 790`), fill `#7F57FF` (their own dark-theme value from
  `light-dark(#6733FF, #7F57FF)`), Source Sans 3 standing in for Adobe Clean (Typekit,
  proprietary) — used only where React Aria itself "speaks" (its wordmark).
- **Backdrop:** NEW registry component `shader-caustics` — a custom raw-WebGL field of
  refracted light: a slow caustic web crawling on near-black, like light through a
  surface landing on the floor beneath (the base, rendered literally). Very dim,
  vignetted, never competing with type. Its `accentAmount` rises the moment the aria
  base is chosen and never comes back down — the violet stays in the light.
- **Motion law (one camera, never reversing):** beats inside a scene enter from
  below and exit upward (spring physics); section changes dive FORWARD along z
  (remocn `push-through`); there is no lateral travel anywhere. Text lands via remocn
  `soft-blur-in`, in-place phrase swaps via the shared-axis-y / shared-axis-z grammar.
- **Discipline:** no letter-spacing added, no uppercase, no badges, no install pills,
  no pulsing, no swirl, no ripple. Every spacing on the 8px grid. Numbers plain.

---

## Frame 1 — The news, named (opener)

- scene: on the caustic field, the two exact marks assemble as the very first thing on screen: the shadcn mark draws its two round-cap diagonals stroke by stroke, the aria mark traces its outline and fills bottom-up beside it, and the field takes its violet undertone exactly as the aria mark completes (React Aria arrives → the light goes violet). Beneath them the headline resolves via soft-blur-in, then a muted subline rises from below.
- voiceover: "React Aria — now a base in shadcn/ui."
- duration: 5.3s
- transition_in: cut (opening frame — the marks drawing on ARE the visual hook, no text opens)
- status: locked
- src: ShadcnAriaDemo → IntroScene
- type: product_intro
- persuasion: Authority by association — Adobe's a11y layer joins the system
- beat: clarity + excitement
- blueprint: logo-assemble-lockup — the marks assemble, the name lands
- asset_candidates: (both logos exact: shadcn icons.tsx 256-viewBox lines, aria header path)

narrativeRole: opens on motion, not type — the two exact marks meeting name the news.
keyMessage: React Aria is now a first-class base, alongside Base UI and Radix.

## Frame 2 — One flag

- scene: alone on the field, a mono shell line types itself with no caret: `pnpm dlx shadcn@latest init --base aria`. As `aria` completes, the violet focus ring — React Aria's own signature — springs once around the word and holds still. A muted line rises beneath: "Or pick it in shadcn/create."
- voiceover: "pnpm dlx shadcn init --base aria — that's the whole switch."
- duration: 5.0s
- transition_in: zoom-through (remocn push-through)
- status: locked
- src: ShadcnAriaDemo → CommandScene
- type: feature_showcase
- persuasion: Friction reduction — the mechanism is one flag
- beat: control + ease
- blueprint: typewriter-reveal — someone is typing this (caretless)
- asset_candidates: (mono command, verbatim from the changelog)

narrativeRole: the mechanism made concrete — the entire choice is one typed flag; the
ring landing on `aria` sets up the same ring that will walk the real components next.
keyMessage: `--base aria`.

## Frame 3 — React Aria's DatePicker (accessibility)

- scene: React Aria's own DatePicker demo (the site's Vanilla CSS example), rebuilt on the pinned dark tokens: a "Date Planted" field, then its Calendar popover doing React Aria's actual entering animation (fade + scale-up from 0.96) — a real July 2026 month grid, the 15th filled violet (data-selected), and the violet focus ring WALKING the cells 13 → 14 → 15 on arrow-key beats, exactly the keyboard behavior React Aria ships. Caption rises: "Top-tier accessibility."
- voiceover: "Keyboard, focus, and screen-reader support — every component, for free."
- duration: 5.6s
- transition_in: zoom-through (remocn push-through)
- status: locked
- src: ShadcnAriaDemo → CalendarScene
- type: feature_showcase
- persuasion: Show-don't-tell proof — the accessibility is demonstrated, not claimed
- beat: trust + confidence
- blueprint: device-surface-showcase — a feature shown being USED inside its real surface
- asset_candidates: (Calendar rebuilt from the react-aria.adobe.com DatePicker example; label "Date Planted" verbatim)

narrativeRole: the first real payoff — React Aria's most iconic accessible component,
its keyboard behavior visible on screen.
keyMessage: the base brings accessibility no one has to wire up.

## Frame 4 — React Aria's ComboBox (built-in behavior)

- scene: React Aria's ComboBox demo (the site's Tailwind example), "Assignee" label, input focused, and the ListBox popover doing the entering animation the site itself advertises ("built-in entry and exit animation states") — people rows (avatar + name) fade-and-slide in staggered; the violet focus highlight glides down to Casey Kim and a checkmark draws on the selected row. Caption: "Built-in behavior."
- voiceover: "Open, highlight, select — the behavior's done. You just bring the styles."
- duration: 6.1s
- transition_in: zoom-through (remocn push-through)
- status: locked
- src: ShadcnAriaDemo → ComboBoxScene
- type: feature_showcase
- persuasion: Feature-to-benefit translation — interaction logic you don't write
- beat: ease + confidence
- blueprint: device-surface-showcase — the component used inside its real surface
- asset_candidates: (ComboBox rebuilt from the react-aria.adobe.com Tailwind example; label "Assignee" verbatim)

narrativeRole: the behavior payoff — the exact entering animation React Aria brags
about, plus the open→highlight→select loop, all shipped.
keyMessage: the base brings the interaction logic; you own the look.

## Frame 5 — React Aria's Slider (adaptive interactions)

- scene: React Aria's Slider demo (the site's Styled Components example), "Opacity" label with a live output, defaultValue 30 — the thumb drags from 30 to 72 on a spring (data-dragging → the thumb fills violet mid-drag), the track fills violet behind it, and the output number rolls 30 → 72 in step. Caption: "Adaptive interactions."
- voiceover: "One interaction model — pointer, touch, keyboard."
- duration: 4.4s
- transition_in: zoom-through (remocn push-through)
- status: locked
- src: ShadcnAriaDemo → SliderScene
- type: feature_showcase
- persuasion: Value stacking — a third capability, shown not listed
- beat: control
- blueprint: device-surface-showcase — the component used inside its real surface
- asset_candidates: (Slider rebuilt from the react-aria.adobe.com Styled Components example; label "Opacity", defaultValue 30 verbatim)

narrativeRole: the third real payoff — one behavior model across every input device.
keyMessage: the base handles pointer, touch, and keyboard the same way.

## Frame 6 — Choose your foundation

- scene: the two marks return small and settle side by side — shadcn mark ✕ aria mark — as the closing line resolves via soft-blur-in: "Choose your foundation." A faint mono `ui.shadcn.com` rests beneath. Hold.
- voiceover: "Choose your foundation — at ui.shadcn.com."
- duration: 5.2s
- transition_in: zoom-through (remocn push-through)
- status: locked
- src: ShadcnAriaDemo → OutroScene
- type: cta
- persuasion: Future pacing on the site's own words ("The Foundation for your Design System")
- beat: inevitability
- blueprint: logo-assemble-lockup — elements clear, the lockup draws itself in
- asset_candidates: (both marks exact, reprise of Frame 2)

narrativeRole: the stamp — the announcement compressed to two marks and one verb.
keyMessage: the foundation is now a choice.
