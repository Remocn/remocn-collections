# frame.md — sponsor-21st brand register

Design facts for the **21st.dev** sponsor spot, verified from the live site
(21st.dev homepage markup + rendered gallery). Sibling of `sponsor-reui` and
`sponsor-reactbits` — same sponsor arc, 21st's register.

## Meaning (what 21st.dev is)

- **Tagline / thesis:** "The living library of interfaces."
- **What it is:** a community registry of **10,000+ hand-crafted React & Tailwind
  CSS components and templates**, "built by real design engineers."
- **The loop:** *"Preview live, install with one command — for you and your AI agent."*
- **Scale / proof:** 727,000 builders — "from indie makers to the world's largest
  product teams" (Google, Meta, NVIDIA, Vercel, Lovable). Collections curated by
  author (shadcn/ui, Aceternity UI, Magic UI …).
- **The product IS the gallery.** The value is the sheer breadth + craft of the
  interfaces, best shown as a stream of gorgeous, distinct components flowing past
  — exactly the reference clip's gallery language.

## Palette (verified hex from the live site)

21st is **monochrome-forward near-black chrome** with one signature accent — a
periwinkle-indigo — and the *component thumbnails* carry the color (a warm rainbow),
mirroring how the real site looks: dark shell, colorful library.

| token        | value       | role                                            |
| ------------ | ----------- | ----------------------------------------------- |
| `BG`         | `#0b0b0c`   | page near-black                                 |
| `BG2`        | `#0f1011`   | deeper wells                                    |
| `CARD`       | `#141516`   | card / surface                                  |
| `INK`        | `#f7f8f8`   | foreground (near-white)                          |
| `MUTED`      | `#8a8f98`   | the signature Geist gray (secondary text)        |
| `ACCENT`     | `#4B73FF`   | 21st periwinkle-indigo (glows, one link, focus) |
| `ACCENT_SOFT`| `#828fff`   | lighter indigo for the ambient shader glow      |
| `BORDER`     | `rgba(255,255,255,0.10)` | hairline chrome                     |

Thumbnail rainbow (only inside gallery interface cards, never on chrome):
`#FF8E63` `#FF7EB0` `#e879f9` `#34d399` `#fbbf24` `#c86a50`.

## Type

- **Geist Sans** — everything (headings + body). Weight 400 primary, 500 for the
  one or two emphasis lines. `@remotion/google-fonts/Geist`.
- **Geist Mono** — the single install command only. `@remotion/google-fonts/GeistMono`.
- Sentence case throughout. **No letter-spacing, no uppercase, no eyebrow.**

## The shader "in 21st style" (background, whole video)

Near-black `#0b0b0c` canvas carrying faint, very-low-opacity blurred radial glows
in the periwinkle-indigo (`#4B73FF → #828fff`), drifting slowly, pushed back by a
vignette — the site's own `blur-3xl opacity-[0.06]` ambient blobs, rebuilt as a
frame-driven shader field. Restrained and monochrome-forward; the color is a
whisper, not a wash. Candidate: `shader-mesh-gradient` tuned dark/indigo/low-contrast
(Step 4 confirms). **Not swirl, not ripple.**

## Logo animation (required)

21st's mark is the **"21st.dev" wordmark** ("21st" core, no separate symbol). Rebuild
it from the live site and animate it: the numerals **2 · 1** assemble / draw on out
of depth, "st" settles, then `.dev` completes the lockup — resolving on the held
wordmark under the tagline. Reused again in the outro lockup (Remocn ✕ 21st.dev).

## Constraints honored

No letter-spacing · no uppercase · no installation pill · no badges · no pulsing ·
no eyebrow · no swirl / ripple transitions. Install shown as a **typed Geist Mono
terminal line**, never a pill.

## Build mapping (remocn / Remotion)

Build in `src/demos/sponsor-21st/index.tsx`, mirroring `sponsor-reui`. Transitions
map storyboard registry → remocn factories: `zoom-through → pushThrough` (section
boundaries), `blur-crossfade → focusPull` (gallery beats), `crossfade → crossfade`.
Gallery cards + proof logos are **rebuilt in-composition** (like reui's mini-previews);
partner logos via `/media-use resolve --type logo`. No captured asset files.
