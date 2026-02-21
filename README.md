# The Scale of Training Data

Interactive visualization comparing the scale of training data across two frontiers: **LLM pretraining** (GPT-1 → GPT-5) and **robot learning** (BridgeData → GEN-0). Each rendered square is one unit of data — tokens for language, hours of demonstration for robotics.

The gap between these two charts is the central argument: language models trained on tens of trillions of tokens; robot policies trained on hundreds of hours. This is the data bottleneck that defines where embodied AI stands today.

---

## Views

### LLM Training Data
Traces the exponential growth of pretraining tokens from GPT-1 (2018) to GPT-5 (2025).

| Model | Year | Tokens | Data source |
|-------|------|--------|-------------|
| GPT-1 | 2018 | ~1B    | BookCorpus |
| GPT-2 | 2019 | ~10B   | WebText (~40 GB) |
| GPT-3 | 2020 | 300B   | Common Crawl + WebText + books |
| GPT-4 | 2023 | ~10T   | Public + licensed + human data |
| GPT-5 | 2025 | ~70T   | Internet + 3rd party + human data |

Each square = **1 Billion Tokens**. Labels include compute (FLOPs) and A100-day equivalents per model.

### Robot Learning Data
Maps the largest robot training datasets available, from early lab collections to web-scale efforts.

| Dataset | Year | Hours | Type | Institution |
|---------|------|-------|------|-------------|
| BridgeData V2 | 2023 | ~130 h | Robot teleop | UC Berkeley et al. |
| DROID | 2024 | 350 h | Robot teleop | Stanford, CMU et al. |
| RT-1 | 2022 | ~900 h | Robot teleop | Robotics at Google |
| RoboCat | 2023 | ~4,000 h | Human w/ actions | DeepMind |
| π0 | 2024 | ~10,000 h | Robot teleop | Physical Intelligence |
| DreamDojo | 2026 | 44,711 h | Human video (no actions) | NVIDIA |
| GEN-0 | 2025 | 270,000 h | Robot teleop | Generalist AI |

Each square = **1 Hour** of demonstration data.

Data categories: robot teleoperation with action labels, human demonstrations, and raw egocentric video with latent-action inference. Not all hours are equivalent in information density.

---

## The Argument

LLMs scaled because text was already on the internet — cheap, abundant, and easy to ingest. Robotics has no equivalent. Every hour of demonstration data requires hardware, operators, and controlled environments. The best-resourced efforts today (GEN-0 at 270K hours, growing at 10K+ hours per week) are still orders of magnitude below what a mid-size LLM consumed.

This scarcity shapes every architectural and algorithmic choice in embodied AI: why foundation models reuse internet video, why latent-action methods try to extract signal from human footage without proprioceptive labels, and why data flywheels — robot fleets that generate their own training data — are a strategic priority.

---

## Run Locally

```bash
npm install
npm run dev
```

**Preview production build:**
```bash
npm run build
npm run preview
```

## Deploy (GitHub Pages)

- Source: `main` branch (configured in `Settings > Pages`).
- Every push to `main` triggers a new GitHub Pages build.
- Public URL: https://brikhmp18.github.io/the-scale-of-training-data/

## Stack

React 19 · TypeScript · Vite 6 · Tailwind CSS v4 · Motion · HTML5 Canvas
