# StudioRich Playground

The **Playground** is a horizontally scrolling, full-screen carousel system for StudioRich.
It integrates music, shopping, and interactive features like sticker pins.

---

## Features

- **Horizontal Slides**: Snap-scrolling with arrow key / button navigation.
- **Overlay Text**: Titles, descriptions, and CTAs positioned over images.
- **Interactive Tags**: Pins placed via front matter (`tags:`) with hover tooltips and links.
- **Edit Mode**: Press `E` to toggle. Drag pins or double-click to add new ones.
  - Export pins as YAML front matter (`tags:` block).
- **Pagination Dots**: Clickable navigation at the bottom of the screen.
- **Audio Player**: Floating play/pause button with progress bar and shared `<audio>` element.
- **SEO & Sharing**:
  - Each slide can be addressed via hash or query (e.g., `/playground/#slide-5` or `?slide=slug`).
  - Optional redirect pages can map clean URLs (`/playground/music/`).

---

## File Structure

```
/_assets
  /js
    carousel-playground.js   # Slide navigation + snapping
    playground-tags.js       # Marker positioning
    playground-edit.js       # Edit mode logic
    player-playground.js     # Audio playlist player
    player-fab.js            # Minimal floating play/pause
/_layouts
  playground.html            # Main layout
/_sass
  _playground.scss           # Scoped styles
/_includes
  /components
    playground-dock.html     # Legacy dock (optional)
```

---

## Front Matter Example

```yaml
title: Playground
description: Shop + lookbook carousel for StudioRich.
og_type: website
image: /assets/img/og/playground.webp
seo_title: StudioRich Playground
append_site_title: true
tags:
  - x: 10
    y: 60
    href: https://example.com/item1
    label: Item One
  - x: 50
    y: 60
    href: https://example.com/item2
    label: Item Two
text_style: overlay   # overlay | below | cap
text_pos: left        # left | right | center
```

---

## Usage

- **Navigation**
  - Arrows: left/right keyboard keys or edge buttons.
  - Scroll: mouse wheel (horizontal).
  - Dots: click to jump.
- **Edit Mode**
  - `E` key toggles edit mode.
  - Drag pins to reposition.
  - Double-click to add a new pin.
  - Exports YAML block to clipboard.
- **Audio**
  - Click play button to load playlist.
  - Progress bar updates in real time.

---

## Notes

- Best used for **music showcases**, **lookbooks**, or **timelines**.
- Vertical pages (blogs, posts) remain separate.
- Future upgrades: user-sticker uploads, hybrid vertical+horizontal layouts.
