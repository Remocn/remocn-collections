# STORYBOARD — Introducing remocn icons (3D gallery cut)

The third cut of the remocn icons announcement. Everything is inherited from the
main cut (`../remocn-icons/STORYBOARD.md`) — same eight scenes, same copy, same
transition grammar, same neuro-noise field — except Frame 5, which is opened
into real depth with `@remotion/three`, and Frame 8, which is staged entirely
in 3D — the R is an extruded solid from its first stroke to the lockup.

- **Length:** ~43.5s @ 30fps, 1280×720 (the gallery runs 36 frames longer than
  the flat cut, the outro 36 frames longer for the turn)
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

## Frame 8 — The lockup, entirely in 3D (replaces the flat outro)

- scene: the same ritual, one dimension up — the R is a solid from its first
  stroke. A 3D tube traces the letterform on (the gallery's own stroke
  material) while the camera HOLDS a ~28° three-quarter view; the extruded
  body (~17% of cap height deep, beveled) fades in beneath the tracing
  outline with its volume already showing, the lime rim light from
  behind-left resting on the side faces. Then one deliberate arc swings the
  camera into dead face-on — zero velocity at the landing — and exactly
  there "emocn" slides out from behind the mark as the tracing tube fades:
  depth is read by parallax and traveling light, never by a maneuver. The
  canvas is mounted for the whole scene, so nothing ever flashes; the
  face-on front cap is lit to the flat cut's exact ink (no tone mapping,
  calibrated by measured stills). Once the lockup settles, one glossy WHITE
  sheen crosses the whole wordmark — a highlight with subtle dark shoulders,
  shadow–light–shadow, synchronized in screen space across the 3D mark (an
  SVG-masked band) and the DOM tail (background-clip: text) — the metal
  reading of "Remocn" before the destination line lands. The icons got
  volume in the gallery; the mark is BORN with volume to sign off.
- duration: 6.6s (the flat cut's 5.4s + 1.2s for the held view and the sheen)
- src: RemocnIcons3DDemo → OutroScene + ROutro3D (`./outro-r-3d.tsx`)

## Everything else

Frames 1–4 and 6–7 are byte-identical to the main cut: the hook pair, the bell
reveal, the kinetic positioning, the ten-icon morph run, and the rolodex
install. See `../remocn-icons/STORYBOARD.md`.
