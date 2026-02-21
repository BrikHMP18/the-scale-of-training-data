# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server with HMR
npm run build      # TypeScript compile + Vite production build
npm run lint       # Run ESLint
npm run preview    # Preview production build locally
```

No test suite is configured.

## Architecture

Single-page React app with two visualization modes, switchable via a tab nav in `App`. Each visualizer renders an HTML5 Canvas grid where each square represents one unit of data.

**Component hierarchy:** `App` (tab switcher) → `TokenVisualizer` | `RobotVisualizer` → local `GridCanvas`

**Two visualizers:**
- `TokenVisualizer` — GPT-1 through GPT-5 LLM training data; each square = 1 billion tokens; per-model colors (slate palette, darkening with scale); metadata: compute FLOPs, A100-day equivalents
- `RobotVisualizer` — robotics datasets (BridgeData V2 → GEN-0); each square = 1 hour of demo data; single dark color for all grids; metadata: data category, objective, trajectories, institution

**Canvas rendering (shared pattern, duplicated in each file):** `GridCanvas` is a local component inside each visualizer — it is not a shared component. Layout uses `PORTRAIT_RATIO = 4` (height:width ≈ 4:1) so grids grow tall. Column count = `ceil(√(units / 4))`, rows = `ceil(units / cols)`. Canvas scales for device pixel ratio (high-DPI support). Square size is 3×3px with 1px gaps (`TOTAL_CELL_SIZE = 4`).

**Key files:**
- `src/components/TokenVisualizer.tsx` — LLM visualization, `ModelData` interface, `models` array, `GridCanvas`
- `src/components/RobotVisualizer.tsx` — robotics visualization, `RobotDataset` interface, `datasets` array, `GridCanvas`
- `src/App.tsx` — tab nav (`View` type: `'llm' | 'robot'`), renders one visualizer at a time

**Tech stack:** React 19, TypeScript (ES2022, bundler module resolution), Vite 6, Tailwind CSS v4, Motion (animations from `motion/react`), Lucide React (icons).

**Google AI Studio compatibility:** The app is deployed via Google AI Studio (`metadata.json` present). HMR can be disabled with `DISABLE_HMR=true`. The `@google/genai` package is installed for potential Gemini API use; set `GEMINI_API_KEY` in environment if needed.

**Adding a new dataset:** Add an entry to the `models` or `datasets` array in the respective visualizer file — no other changes needed. The canvas and label layout is driven entirely by the data array.
