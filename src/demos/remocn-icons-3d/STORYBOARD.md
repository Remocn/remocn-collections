# STORYBOARD — Introducing remocn icons (3D gallery cut)

The third cut of the remocn icons announcement. Everything is inherited from the
main cut (`../remocn-icons/STORYBOARD.md`) — same eight scenes, same copy, same
transition grammar, same neuro-noise field — except Frame 5, which is opened
into real depth with `@remotion/three`.

- **Length:** ~42s @ 30fps, 1280×720 (the gallery runs 36 frames longer than
  the flat cut to give the dolly room)
- **The one rule of the 3D beat:** the icons must stay made of *stroke*. No
  extrusions, no cards, no textures — each icon is its registry path sampled
  along its length and swept into a `TubeGeometry`, the same material as every
  other stroke in the video, given volume.

## Frame 5 — The gallery, in depth (replaces the flat gallery)

- scene: the whip-pan lands INSIDE the set — on a detonation. All 24 icons
  burst out of the center like shards: each leaves the blast on its own beat,
  tumbling on all three axes, and traces its stroke on MID-FLIGHT — fast and
  front-loaded, so the shards leave the blast already recognizable
  (`setDrawRange` walks each tube exactly like a dashoffset walks an SVG
  stroke, subpaths sharing one draw clock proportionally to their length).
  Every shard decelerates into its grid slot with a hair of overshoot, the
  spin unwinding into a resting tilt, and the debris resolves into a
  three-layer parallax field — each slot scaled by its distance to the
  settled camera so every depth layer projects back onto the same clean
  grid, no overlaps. The camera takes the blast as recoil: pushed back from
  z≈12.1 to ≈13.2 with a decaying shake riding the first beats, then a
  whisper of drift keeps the layers sliding against each other. A white key
  light from front-top and one lime rim light from behind-left shade the ink
  tubes — the accent lives in the light, never on the strokes. The exit
  echoes the blast: the caption fades, then the camera accelerates THROUGH
  the wall over the last ~0.8s — the front layer rushing past the lens into
  a near-dark frame — and the hard cut into the morph run lands mid-dive,
  so the cut inherits the speed. "Every icon draws itself on" holds beneath
  the settled field.
- voiceover: "Every icon draws itself on."
- duration: 5.6s
- transition_in: whip-pan (enumeration travels sideways — into space this time)
- status: locked
- src: RemocnIcons3DDemo → Gallery3DScene (`./gallery-3d.tsx`)
- type: feature_showcase
- persuasion: Value stacking by demonstration — breadth as literal space

narrativeRole: proves breadth AND the draw-on gesture in one shot, and gives
the video its single dimensional surprise without breaking the stroke grammar.
keyMessage: the whole set animates — and it has depth you didn't expect.

## Everything else

Frames 1–4 and 6–8 are byte-identical to the main cut: the hook pair, the bell
reveal, the kinetic positioning, the ten-icon morph run, the rolodex install,
and the rebrand lockup. See `../remocn-icons/STORYBOARD.md`.
