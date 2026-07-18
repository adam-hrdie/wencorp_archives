# WENCORP Archives — Style Guide

A DJ mix archive site styled as a classified corporate data vault. Think **Blade Runner 2049's Wallace Corp** crossed with a cyberpunk terminal — mysterious, institutional, faux-restricted access, but ultimately playful/satirical underneath the seriousness. It should never feel like a generic music player.

## Tech stack
- React 19 + TypeScript (Create React App, react-scripts)
- Three.js / @react-three/fiber / @react-three/drei for 3D scenes (glass cubes, dust particles)
- Framer Motion for animation
- Plain CSS per-component (`Component.tsx` + `Component.css`), no Tailwind/styled-components
- SoundCloud iframe embeds + Web Audio API for ambient drone sound

## Visual language
- **Palette**: near-black background (`#0a0a0a`/`#000`) with warm amber/gold accents (`#d4a574`, `#e8b86d`, rust `#cc7722`), occasional green (`#4ade80`) for "active" status.
- **Effects**: volumetric light beams, radial glows, glass morphism (blur + transparency), scanline overlays, perspective grids, text glow/shadow — layered depth over flat design.
- **Fonts**: `Orbitron` for titles/display, `Rajdhani` for labels/body/UI, `Courier New` for system/status text. Heavy letter-spacing, ALL CAPS for labels and headings.
- **Motion**: slow pulsing/breathing loops, staggered reveals, hover glows, occasional glitch/flicker — cinematic and unhurried, never snappy or bouncy.

## Voice & copy
Write like a classified internal system, not a consumer app.
- ALL CAPS for headings, labels, and status text.
- Borrow military/corporate/sci-fi vocabulary: *archive, vault, transmission, clearance, classified, system, drone, access, records*.
- Status/state language over casual copy: `STANDBY`, `ACTIVE`, `LOADING...`, `TRANSMITTING`, `READY TO ACCESS`.
- Use diamond glyphs (◆/◇) instead of checkmarks/bullets for status indicators.
- Treat mixes as classified transmissions, users as "authorized personnel."
- Avoid: exclamation marks, casual/friendly tone, generic SaaS/tech buzzwords, lowercase headings, emoji.

Example phrases in the existing UI: `VAULT ACCESS DIRECTORY`, `CLASSIFIED TRANSMISSIONS`, `SEC: LEVEL_5_CLEARANCE`, `FOR THE CONTINUITY OF SOUND`, `ALL RECORDINGS PROPERTY OF WENCORP / UNAUTHORIZED REPLICATION IS A CRIME`.

## When adding features
- New pages/sections should keep the amber-on-black palette and Orbitron/Rajdhani pairing — don't introduce new fonts or bright/saturated colors.
- New UI copy should read like a system/terminal message, not marketing copy.
- Prefer subtle, slow, cinematic motion (Framer Motion) over fast/playful transitions.
- Keep the CSS-per-component pattern (`Foo.tsx` + `Foo.css`) rather than introducing a new styling system.
