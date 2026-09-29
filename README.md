<div align="center">

<img src="https://img.shields.io/badge/LANDSYNC%20AI-3D%20Property%20Intelligence-00b4a0?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAgMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwIDJMMyA4aDE0TDEwIDJ6IiBmaWxsPSJ3aGl0ZSIvPjxyZWN0IHg9IjUiIHk9IjgiIHdpZHRoPSIxMCIgaGVpZ2h0PSI5IiByeD0iMSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxLjMiIGZpbGw9Im5vbmUiLz48L3N2Zz4=" alt="LANDSYNC AI" />

# LANDSYNC AI — 3D Property Intelligence

**A next-generation geospatial frontend for digital land records, 3D property modelling and boundary conflict detection.**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Three.js](https://img.shields.io/badge/Three.js-r128-black?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active%20Development-00b4a0?style=flat-square)](.)

</div>

---

## 📋 Overview

LANDSYNC AI is a high-fidelity **single-page geospatial web application** designed to simulate a national-scale digital land records and boundary verification platform. It combines a premium dark GIS interface with an interactive WebGL 3D property viewer built on **Three.js**.

The application covers the complete property analysis lifecycle:

```
Upload Data → AI Processing → 3D Reconstruction → Boundary Alignment → Conflict Detection → Human Verification
```

This project was built as a **frontend prototype / design reference** for a government-grade GIS product — showcasing what a modern digital land registry system could look like with immersive 3D visualization at its core.

---

## ✨ Key Features

### 🏗️ Interactive 3D Property Engine
- **Fully rotatable 3D building models** — drag to orbit, scroll to zoom, right-click to pan
- **PBR materials** (MeshStandardMaterial) with procedurally generated textures:
  - Stone/brick wall texture (mortar lines, colour variation)
  - Slate tile roof (staggered rows with shadow detail)
  - Grass ground with variation patches
  - Asphalt road with aggregate noise and white lane markings
  - Realistic window glass with sky reflection highlights
- **ACES Filmic tone mapping** for cinematic lighting
- **Exponential atmospheric fog** — neighbours fade into the misty distance
- **Multi-source lighting**: warm sun + hemisphere sky + ground bounce + rim light
- **4096×4096 shadow maps** — high-resolution soft shadows

### 🗺️ GIS Boundary System
- **Glowing teal parcel boundary** — additive-blended multi-layer glow with vertex markers
- **Dashed setback line** overlay
- **2D cadastral plan view** — hand-drawn canvas with legal parcel, footprint, conflict zones, measurement lines and scale bar
- Camera presets: **Perspective / Top / North / West**

### ⚠️ Conflict Detection Visualization
- **Red translucent conflict zone** volume with glowing wireframe edges
- Animated measurement lines to parcel boundary
- Before/current overlap comparison panel
- 3D evidence view + 2D plan evidence side-by-side

### 📁 Data Ingestion Pipeline
- **6-category drag-and-drop upload zones** (PDF, GeoJSON, SHP, DXF, TIFF, CSV)
- Live file table with validation status badges
- Visual **AI processing pipeline** tracker (7 deterministic stages)
- Live audit trail with SHA-256 event chain verification
- Coordinate system confirmation panel (EPSG:32643)

### 🖥️ 5 Fully Connected Screens
| Screen | Description |
|---|---|
| **Project Dashboard** | 3D property hero + stats + recent activity |
| **Data Sources** | Upload zones + validated file table |
| **Analysis** | Pipeline tracker + top-down 2D map + extracted fields |
| **Verification** | Full 3D viewer + move-building controls + conflict assessment |
| **Conflict Review** | Split 3D + 2D evidence + official finding + disposition |

---

## 🖼️ Screenshots

> *Open in browser for full interactive 3D experience*

| Dashboard | Data Sources |
|---|---|
| Large 3D property viewport with teal parcel boundary, glowing vertices, surrounding terrain, neighbour houses and atmospheric fog | 6 drag-and-drop upload zones with live file table, CRS confirmation and processing pipeline |

| Analysis | Verification | Conflict Review |
|---|---|---|
| Top-down 2D map with building footprint overlay, AI pipeline stages and extracted legal fields | 3D model with red conflict zone, move-building transform controls, geometry assessment | Split 3D+2D evidence, conflict issue list, defensibility checks, official finding |

---

## 🗂️ Project Structure

```
landsync/
├── index.html              # Single-page application entry point (5 screens)
├── README.md               # This file
│
├── styles/
│   ├── global.css          # Design system — tokens, nav, typography, animations
│   ├── screens.css         # Per-screen layout rules (all 5 screens)
│   └── components.css      # Shared component overrides
│
└── js/
    ├── three-scene.js      # Three.js 3D engine — all scenes, textures, lighting
    └── app.js              # Application controller — navigation, upload, UI state
```

### Key files at a glance

| File | Purpose | Lines |
|---|---|---|
| [`index.html`](index.html) | All 5 screen HTML, shared nav, canvas elements | ~680 |
| [`js/three-scene.js`](js/three-scene.js) | PBR scenes, procedural texture generators, orbit controls | ~1316 |
| [`js/app.js`](js/app.js) | Screen routing, upload logic, file table, transform controls | ~270 |
| [`styles/global.css`](styles/global.css) | CSS custom properties, nav, badges, buttons, animations | ~260 |
| [`styles/screens.css`](styles/screens.css) | All screen-specific layout CSS | ~580 |

---

## 🚀 Getting Started

### Prerequisites

- Any modern browser with **WebGL 2.0** support (Chrome 80+, Firefox 79+, Edge 80+, Safari 15+)
- A local HTTP server (required because Three.js uses ES modules and canvas API)

### Option 1 — Python (quickest)

```bash
git clone https://github.com/your-username/landsync.git
cd landsync
python3 -m http.server 3000
```
Then open **http://localhost:3000**

### Option 2 — Node.js / npx

```bash
cd landsync
npx serve . -p 3000
# or
npx http-server . -p 3000
```

### Option 3 — VS Code Live Server

Install the **Live Server** extension, right-click `index.html` → **Open with Live Server**.

### Option 4 — Direct file open *(limited)*

You can open `index.html` directly in some browsers, but Three.js texture loading may be blocked by CORS. Use a local server for full functionality.

---

## 🎮 Controls & Navigation

### 3D Viewport (all screens with a canvas)

| Action | Control |
|---|---|
| **Orbit / Rotate** | Left-click + drag |
| **Pan** | Right-click + drag |
| **Zoom** | Scroll wheel |
| **Reset view** | Click the ↺ button |
| **Zoom in/out** | Click + / − buttons |
| **Camera presets** | Perspective / Top / North / West buttons (Verification screen) |

### Screen Navigation

| Nav Tab | Screen |
|---|---|
| **Project** | Dashboard with 3D property hero |
| **Data Sources** | Upload & file management |
| **Analysis** | AI processing pipeline & 2D map |
| **Verification** | 3D verify with conflict detection |
| **Reports** | Spatial evidence & conflict disposition |

---

## 🏛️ Architecture

### Technology Stack

| Layer | Technology | Why |
|---|---|---|
| Markup | HTML5 semantic | Structure + accessibility |
| Styling | Vanilla CSS3 (custom properties) | Zero build step, full control |
| 3D Engine | [Three.js r128](https://threejs.org/) | WebGL abstraction, wide support |
| Fonts | [Inter](https://rsms.me/inter/) (Google Fonts) | Clean, technical readability |
| Mono font | [JetBrains Mono](https://www.jetbrains.com/liguatures/) | Coordinate / ID display |
| Server | Python `http.server` / any static server | Dev only, no build required |

### Design System

```css
/* Core palette */
--bg-base:       #0d1117   /* Page background */
--bg-surface:    #161b22   /* Panel / nav surface */
--teal-500:      #00b4a0   /* Primary accent — parcel boundary, CTAs */
--green-500:     #10b981   /* Verified / compliant state */
--red-500:       #ef4444   /* Conflict / danger */
--amber-500:     #f59e0b   /* Warning / medium severity */
--text-primary:  #e6edf3   /* Main body text on dark */
```

### 3D Scene Architecture

Each screen that contains a 3D viewport has its own isolated Three.js scene:

```
ThreeScenes
├── initDashboard(canvas)      → Full property scene, all elements
├── initAnalysis(canvas)       → Top-down orthographic-ish view
├── initVerification(canvas)   → 3D with conflict zones highlighted
├── initConflict3D(canvas)     → Isolated close-up conflict view
└── drawConflict2D(canvas)     → Canvas 2D cadastral plan (not Three.js)
```

**Shared scene building blocks:**

```
makeGround()         → Procedural grass texture, PlaneGeometry
makeRoads()          → Asphalt texture, dashed centre lines, curbs
makeParcel()         → Additive-blended glow lines, vertex markers, fill
makeSetback()        → Dashed teal inner boundary
makeHouse()          → Full PBR house: body + bay + wing + dormers + chimneys + fence
makeNeighborHouses() → Translucent background context buildings
makeTrees()          → Layered cone foliage, textured trunks
makeConflictZone()   → Red translucent volume + glow wireframe + measurement lines
makeGableRoof()      → Custom BufferGeometry gable roof shape
setupLighting()      → Hemisphere + directional sun + fill + bounce + rim
createOrbitControls()→ Mouse drag orbit, right-drag pan, scroll zoom
```

**Procedural texture generators** (all on `<canvas>`, converted to `THREE.CanvasTexture`):

| Generator | Output |
|---|---|
| `createStoneTexture()` | Beige stone blocks with mortar lines and surface noise |
| `createSlateTexture()` | Dark staggered slate roof tiles with sheen gradient |
| `createGrassTexture()` | Green variation patches with fine grass blade detail |
| `createRoadTexture()` | Dark asphalt with aggregate speckle |
| `createWindowTexture()` | Tinted glass with sky reflection glint and frame lines |
| `createBrickTexture()` | Warm brick with mortar joints and colour variation |

---

## 🔧 Customisation

### Changing the property data (sample data)

Edit the `populateSampleFiles()` function in [`js/app.js`](js/app.js):

```javascript
const samples = [
  {
    name: 'your_deed.pdf',
    size: 4.8 * 1024 * 1024,
    type: 'documents',
    typeLabel: 'Property document',
    icon: 'pdf',
    crs: 'Document',
    status: 'VALIDATED',
    progress: 100,
  },
  // ...
];
```

### Changing the 3D scene geometry

Adjust house dimensions in `makeHouse()` inside [`js/three-scene.js`](js/three-scene.js):

```javascript
makeHouse(scene, {
  x: 0.5,    // East offset from parcel centre (metres)
  z: 0,      // North offset from parcel centre (metres)
});
```

Adjust the parcel dimensions in each `initXxx()` function:

```javascript
makeParcel(scene, {
  w: 21,          // Width in metres
  d: 23,          // Depth in metres
  glowColor: 0x00c4a8,
});
```

### Adding a new screen

1. Add a `<div id="screen-yourname" class="screen">` block in `index.html`
2. Add a `<button class="nav-link" data-screen="yourname">` to the nav
3. Add a case in `initScreenScene()` in `app.js`
4. Add an `initYourname(canvas)` function in `three-scene.js`

### Changing the colour theme

All tokens live in `styles/global.css` under `:root`. The primary teal can be changed in one place:

```css
:root {
  --teal-500: #00b4a0;  /* Change this to rebrand */
  --teal-600: #009688;
  --teal-400: #26c6b0;
}
```

---

## 🗺️ Workflow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    ANALYSIS PIPELINE                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📤 Upload    →  ✅ Validate  →  🌐 Georeference        │
│                                                         │
│  🔍 Extract   →  🏗️ Reconstruct 3D  →  ⚠️ Analyze      │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                      SCREENS                            │
├──────────┬──────────┬──────────┬──────────┬────────────┤
│Dashboard │  Upload  │ Analysis │  Verify  │  Conflict  │
│  (3D)    │  (files) │ (2D map) │ (3D+UI)  │  (review)  │
└──────────┴──────────┴──────────┴──────────┴────────────┘
```

---

## 🐛 Known Limitations

| Issue | Detail |
|---|---|
| **No backend** | This is a frontend-only prototype. All data is hardcoded sample data. |
| **Three.js r128** | Using CDN version r128 (2021). Some newer Three.js APIs (`outputColorSpace`, `WebGLRenderTarget` changes) may differ. |
| **Mobile support** | Designed for desktop (1280px+ viewport). Mobile layout is not optimised. |
| **File upload** | The upload UI is functional (drag-and-drop, file listing) but files are not actually processed. |
| **2D conflict map** | The conflict 2D view is rendered with Canvas 2D API (not a real GIS tile layer). |
| **Font loading** | Requires internet connection for Google Fonts. Falls back to `system-ui` if offline. |

---

## 🔮 Roadmap / Future Work

- [ ] **Backend integration** — FastAPI or Node.js endpoint for real GeoJSON processing
- [ ] **Real tile basemap** — MapLibre GL or Leaflet satellite tile layer underneath the 3D scene
- [ ] **glTF model import** — Load actual surveyed building models (`.glb`) instead of procedural geometry
- [ ] **WebWorker AI extraction** — Simulated ML pipeline for document OCR in-browser
- [ ] **Touch controls** — Pinch-to-zoom and two-finger pan for tablet support
- [ ] **Export** — PDF certificate generation, GeoJSON boundary export
- [ ] **Authentication** — Role-based access (Officer / Reviewer / Admin)
- [ ] **Offline PWA** — Service worker for offline GIS review

---

## 📄 License

```
MIT License

Copyright (c) 2026 LANDSYNC AI Project

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 🙏 Acknowledgements

- **[Three.js](https://threejs.org/)** — WebGL 3D library (Mr.doob & contributors)
- **[Inter Typeface](https://rsms.me/inter/)** — Rasmus Andersson
- **[JetBrains Mono](https://www.jetbrains.com/liguatures/)** — JetBrains
- Design inspiration from **ESRI ArcGIS**, **Mapbox Studio**, **Cesium ion** and the **Indian DILRMP** (Digital India Land Records Modernisation Programme)

---

<div align="center">

Built with ❤️ for the future of digital land governance

**[Open App](http://localhost:3000)** · **[Report Issue](../../issues)** · **[Request Feature](../../issues)**

</div>
