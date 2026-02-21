import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

type DataCategory = 'robot-auto' | 'robot-teleop' | 'human-actions' | 'human-no-actions';

interface RobotDataset {
  name: string;
  year: string;
  hours: number;
  description: string;
  hoursEstimated: boolean;
  dataCategory: DataCategory;
  dataTypeLabel: string;
  objective: string;
  trajectories: string;
  diversity: string;
  institution: string;
  mixNote?: string;
}

const DATA_CATEGORY_STYLE: Record<DataCategory, string> = {
  'robot-auto':       'bg-slate-100 text-slate-600',
  'robot-teleop':     'bg-amber-100 text-amber-800',
  'human-actions':    'bg-violet-100 text-violet-700',
  'human-no-actions': 'bg-indigo-100 text-indigo-700',
};

const SQUARE_COLOR = '#1e293b'; // single dark color for all grids

const datasets: RobotDataset[] = [
  {
    name: 'BridgeData V2',
    year: '2023',
    hours: 130,
    description: '~130 Hours',
    hoursEstimated: true,
    dataCategory: 'robot-teleop',
    dataTypeLabel: 'Robot (w/ actions)',
    objective: 'Policy (IL/VLA)',
    trajectories: '60k traj.',
    diversity: '24 environments',
    institution: 'UC Berkeley et al.',
  },
  {
    name: 'DROID',
    year: '2024',
    hours: 350,
    description: '350 Hours',
    hoursEstimated: false,
    dataCategory: 'robot-teleop',
    dataTypeLabel: 'Robot (w/ actions)',
    objective: 'Policy (IL/VLA)',
    trajectories: '76k traj.',
    diversity: '564 scenes',
    institution: 'Stanford, CMU et al.',
  },
  {
    name: 'RT-1',
    year: '2022',
    hours: 900,
    description: '~900 Hours',
    hoursEstimated: true,
    dataCategory: 'robot-teleop',
    dataTypeLabel: 'Robot (w/ actions)',
    objective: 'Policy (IL/VLA)',
    trajectories: '130k traj.',
    diversity: '700+ tasks',
    institution: 'Robotics at Google',
  },
  {
    name: 'RoboCat',
    year: '2023',
    hours: 4000,
    description: '~4,000 Hours',
    hoursEstimated: true,
    dataCategory: 'robot-auto',
    dataTypeLabel: 'Mixed (RL + self-gen)',
    objective: 'Self-improving policy',
    trajectories: 'millions (self-gen)',
    diversity: '253 task variations',
    institution: 'Google DeepMind',
    mixNote: 'Bulk of data is RL/self-generated; human teleop is only the seed (~100–1k demos/task)',
  },
  {
    name: 'π0',
    year: '2024',
    hours: 10000,
    description: '~10,000 Hours',
    hoursEstimated: true,
    dataCategory: 'robot-teleop',
    dataTypeLabel: 'Robot (w/ actions)',
    objective: 'Policy + foundation',
    trajectories: '903M steps',
    diversity: 'OXE+DROID+Bridge',
    institution: 'Physical Intelligence',
    mixNote: 'Foundation model — mixes OXE, DROID, BridgeData',
  },
  {
    name: 'DreamDojo',
    year: '2026',
    hours: 44711,
    description: '44,711 Hours',
    hoursEstimated: false,
    dataCategory: 'human-no-actions',
    dataTypeLabel: 'Human (no actions)',
    objective: 'World model',
    trajectories: '1.18M traj.',
    diversity: 'Egocentric video',
    institution: 'NVIDIA',
  },
  {
    name: 'GEN-0',
    year: '2025',
    hours: 270000,
    description: '270,000 Hours',
    hoursEstimated: false,
    dataCategory: 'robot-teleop',
    dataTypeLabel: 'Robot (w/ actions)',
    objective: 'Policy + foundation',
    trajectories: 'n/a',
    diversity: 'Homes, warehouses, factories',
    institution: 'Generalist AI',
    mixNote: 'Self-reported blog post (Nov 2025); no peer-reviewed paper. 10k+ new hours/week claimed.',
  },
];

const SQUARE_SIZE = 3; // px
const GAP = 1; // px
const TOTAL_CELL_SIZE = SQUARE_SIZE + GAP;
const PORTRAIT_RATIO = 4;
const LABEL_MIN_WIDTH = 144; // px — matches w-36
const HOURS_PER_SQUARE = 10;

function getColumnWidth(hours: number): number {
  const squares = Math.ceil(hours / HOURS_PER_SQUARE);
  const cols = Math.max(1, Math.ceil(Math.sqrt(squares / PORTRAIT_RATIO)));
  const canvasWidth = cols * TOTAL_CELL_SIZE;
  return Math.max(canvasWidth, LABEL_MIN_WIDTH);
}

const GridCanvas = ({ hours }: { hours: number }) => {
  const color = SQUARE_COLOR;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const squares = Math.ceil(hours / HOURS_PER_SQUARE);
    const cols = Math.max(1, Math.ceil(Math.sqrt(squares / PORTRAIT_RATIO)));
    const rows = Math.ceil(squares / cols);

    const width = cols * TOTAL_CELL_SIZE;
    const height = rows * TOTAL_CELL_SIZE;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);
    ctx.fillStyle = color;

    for (let i = 0; i < squares; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = col * TOTAL_CELL_SIZE;
      const y = row * TOTAL_CELL_SIZE;

      ctx.fillRect(x, y, SQUARE_SIZE, SQUARE_SIZE);
    }
  }, [hours]);

  return <canvas ref={canvasRef} className="block" />;
};

export default function RobotVisualizer() {
  return (
    <div className="min-h-screen bg-[#F5F5F0] text-slate-900 font-sans selection:bg-amber-200 flex flex-col">
      <header className="px-6 md:px-12 pt-8 md:pt-12 pb-6 md:pb-10">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-3 md:mb-4 font-display">
          The Scale of Robot Learning Data
        </h1>
        <p className="text-base md:text-xl text-slate-600 max-w-2xl font-light">
          Visualizing the growth of robot training datasets from early lab collections to web-scale human video.
          Each square represents <span className="font-bold text-slate-900">10 Hours</span> of demonstration data.
        </p>
        <p className="text-xs md:text-sm text-slate-400 mt-3 md:mt-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          Scroll horizontally to explore
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
        </p>
      </header>

      <div className="overflow-x-auto pb-10 md:pb-16 w-full">
        <div className="w-max mx-auto px-6 md:px-12">

          {/* Canvas row — bottoms aligned */}
          <div className="flex flex-row gap-2 items-end">
            {datasets.map((dataset, index) => (
              <motion.div
                key={`canvas-${dataset.name}`}
                style={{ width: getColumnWidth(dataset.hours), marginLeft: (index === 4 || index === 5 || index === 6) ? '2rem' : undefined }}
                className="flex-shrink-0 flex justify-center"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200">
                  <GridCanvas hours={dataset.hours} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Label row — tops aligned */}
          <div className="flex flex-row gap-2 mt-4">
            {datasets.map((dataset, index) => (
              <motion.div
                key={`label-${dataset.name}`}
                style={{ width: getColumnWidth(dataset.hours), marginLeft: (index === 4 || index === 5 || index === 6) ? '2rem' : undefined }}
                className="flex-shrink-0"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                  <div className="w-36 mx-auto text-center">
                    <h2 className="text-xl font-bold mb-1">{dataset.name}</h2>
                    <div className="text-sm font-semibold mb-2">{dataset.description}</div>
                    <div className="flex items-center justify-center gap-1.5 mb-4">
                      <span className="text-[10px] text-slate-400">{dataset.year}</span>
                      {dataset.hoursEstimated ? (
                        <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-wide">
                          Est.
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-green-50 text-green-700 border border-green-200 uppercase tracking-wide">
                          Reported
                        </span>
                      )}
                    </div>

                    <div className="border-t border-slate-200 pt-3 space-y-3 text-left">
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-0.5">Data type</div>
                        <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded ${DATA_CATEGORY_STYLE[dataset.dataCategory]}`}>
                          {dataset.dataTypeLabel}
                        </span>
                      </div>
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-0.5">Objective</div>
                        <div className="text-xs text-slate-600">{dataset.objective}</div>
                      </div>
                      {dataset.trajectories !== 'n/a' && (
                        <div>
                          <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-0.5">Scale</div>
                          <div className="text-xs text-slate-600">{dataset.trajectories}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-0.5">Coverage</div>
                        <div className="text-xs text-slate-600">{dataset.diversity}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-0.5">Institution</div>
                        <div className="text-xs text-slate-600">{dataset.institution}</div>
                      </div>
                      {dataset.mixNote && (
                        <div>
                          <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-0.5">Note</div>
                          <div className="text-xs text-slate-500 italic">{dataset.mixNote}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
            ))}
          </div>

        </div>
      </div>

      <footer className="px-6 md:px-12 mt-6 md:mt-8 pt-6 md:pt-8 pb-8 border-t border-slate-300 text-slate-500 text-xs space-y-2">
        <p>
          <span className="font-semibold text-slate-600">Hours sourcing:</span>{' '}
          <span className="font-mono text-green-700 bg-green-50 border border-green-200 px-1 rounded">Reported</span> — figure taken directly from the paper or dataset release.{' '}
          <span className="font-mono bg-slate-100 text-slate-500 px-1 rounded">Est.</span> — estimated from trajectory count × average episode duration (typically 10–30 s); treat as order-of-magnitude.
          π0 mixes OXE, DROID, and BridgeData V2; hours converted from 903M timesteps ("around 10,000 hours" per paper). GEN-0 hours are self-reported by Generalist AI; no peer-reviewed paper.
        </p>
        <p>
          <span className="font-semibold text-slate-600">Data type note:</span>{' '}
          <span className="font-mono text-slate-500">Mixed (RL + self-gen)</span> — RL agent data + self-generated rollouts; human teleop is seed only (RoboCat).{' '}
          <span className="font-mono text-slate-500">Robot (w/ actions)</span> — human teleop with proprioceptive action labels.{' '}
          <span className="font-mono text-slate-500">Human (no actions)</span> — raw video only; latent actions inferred post-hoc. Not directly comparable: 10k h robot ≠ 10k h human video in information density.
        </p>
        <p className="text-slate-400">
          Sources: BridgeData V2 (Walke et al., CoRL 2023) · DROID (Khazatsky et al., RSS 2024) · RT-1 (Brohan et al., arXiv 2022) · RoboCat (Bousmalis et al., TMLR 2023) · π0 (Black et al., arXiv 2024) · DreamDojo (Gao et al., NVIDIA, arXiv 2026) · GEN-0 (Generalist AI, Nov 2025, generalistai.com)
        </p>
      </footer>
    </div>
  );
}
