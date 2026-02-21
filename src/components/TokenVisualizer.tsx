import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface ModelData {
  name: string;
  year: string;
  tokens: number; // in Billions
  description: string;
  color: string;
  tokensEstimated: boolean;
  dataSource: string;
  computeBase: string; // e.g. "~1", "3.14", "~2"
  computeExp: number;  // power of 10
  computeEstimated: boolean;
  gpuDaysLow: number;
  gpuDaysHigh: number;
}

const models: ModelData[] = [
  {
    name: 'GPT-1',
    year: '2018',
    tokens: 1,
    description: '~1 Billion Tokens',
    color: '#64748b', // slate-500
    tokensEstimated: true,
    dataSource: 'BookCorpus (~7K books)',
    computeBase: '~1',
    computeExp: 19,
    computeEstimated: true,
    gpuDaysLow: 0.7,
    gpuDaysHigh: 1.2,
  },
  {
    name: 'GPT-2',
    year: '2019',
    tokens: 10,
    description: '~10 Billion Tokens',
    color: '#475569', // slate-600
    tokensEstimated: true,
    dataSource: 'WebText (~40 GB)',
    computeBase: '~1',
    computeExp: 21,
    computeEstimated: true,
    gpuDaysLow: 74,
    gpuDaysHigh: 124,
  },
  {
    name: 'GPT-3',
    year: '2020',
    tokens: 300,
    description: '300 Billion Tokens',
    color: '#334155', // slate-700
    tokensEstimated: false,
    dataSource: 'Common Crawl + WebText + books',
    computeBase: '3.14',
    computeExp: 23,
    computeEstimated: false,
    gpuDaysLow: 23297,
    gpuDaysHigh: 38828,
  },
  {
    name: 'GPT-4',
    year: '2023',
    tokens: 10000,
    description: '~10 Trillion Tokens',
    color: '#1e293b', // slate-800
    tokensEstimated: true,
    dataSource: 'Public + licensed + human data',
    computeBase: '~2',
    computeExp: 25,
    computeEstimated: true,
    gpuDaysLow: 1483856,
    gpuDaysHigh: 2473093,
  },
  {
    name: 'GPT-5',
    year: '2025',
    tokens: 70000,
    description: '~70 Trillion Tokens',
    color: '#0f172a', // slate-900
    tokensEstimated: true,
    dataSource: 'Internet + 3rd party + human data',
    computeBase: '~6',
    computeExp: 25,
    computeEstimated: true,
    gpuDaysLow: 4451567,
    gpuDaysHigh: 7419278,
  },
];

function formatGPUDays(days: number): string {
  if (days >= 1_000_000) return `${(days / 1_000_000).toFixed(1)}M`;
  if (days >= 1_000) return `${Math.round(days / 1_000)}K`;
  return days % 1 === 0 ? String(days) : days.toFixed(1);
}

const SQUARE_SIZE = 3; // px
const GAP = 1; // px
const TOTAL_CELL_SIZE = SQUARE_SIZE + GAP;
const PORTRAIT_RATIO = 4; // height:width ratio for each grid
const LABEL_MIN_WIDTH = 144; // px — matches w-36

function getColumnWidth(tokens: number): number {
  const cols = Math.max(1, Math.ceil(Math.sqrt(tokens / PORTRAIT_RATIO)));
  const canvasWidth = cols * TOTAL_CELL_SIZE;
  return Math.max(canvasWidth, LABEL_MIN_WIDTH);
}

const GridCanvas = ({ tokens, color }: { tokens: number; color: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate grid dimensions with portrait aspect ratio
    const cols = Math.max(1, Math.ceil(Math.sqrt(tokens / PORTRAIT_RATIO)));
    const rows = Math.ceil(tokens / cols);

    const width = cols * TOTAL_CELL_SIZE;
    const height = rows * TOTAL_CELL_SIZE;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);
    ctx.fillStyle = color;

    for (let i = 0; i < tokens; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = col * TOTAL_CELL_SIZE;
      const y = row * TOTAL_CELL_SIZE;

      ctx.fillRect(x, y, SQUARE_SIZE, SQUARE_SIZE);
    }
  }, [tokens, color]);

  return <canvas ref={canvasRef} className="block" />;
};

export default function TokenVisualizer() {
  return (
    <div className="min-h-screen bg-[#F5F5F0] text-slate-900 font-sans selection:bg-orange-200 flex flex-col">
      <header className="px-6 md:px-12 pt-8 md:pt-12 pb-6 md:pb-10">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-3 md:mb-4 font-display">
          The Scale of LLM Training Data
        </h1>
        <p className="text-base md:text-xl text-slate-600 max-w-2xl font-light">
          Visualizing the exponential growth of training tokens from GPT-1 to GPT-5.
          Each square represents <span className="font-bold text-slate-900">1 Billion Tokens</span>.
        </p>
        <p className="text-xs md:text-sm text-slate-400 mt-3 md:mt-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          Scroll horizontally to explore
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
        </p>
      </header>

      <div className="overflow-x-auto pb-10 md:pb-16 w-full">
        <div className="w-max mx-auto px-6 md:px-12">

          {/* Canvas row — bottoms aligned (bar chart effect) */}
          <div className="flex flex-row gap-2 items-end">
            {models.map((model, index) => (
              <motion.div
                key={`canvas-${model.name}`}
                style={{ width: getColumnWidth(model.tokens), marginLeft: index === 4 ? '2rem' : undefined }}
                className="flex-shrink-0 flex justify-center"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200">
                  <GridCanvas tokens={model.tokens} color={model.color} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Label row — tops aligned */}
          <div className="flex flex-row gap-2 mt-4">
            {models.map((model, index) => (
              <motion.div
                key={`label-${model.name}`}
                style={{ width: getColumnWidth(model.tokens), marginLeft: index === 4 ? '2rem' : undefined }}
                className="flex-shrink-0"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-36 mx-auto text-center">
                  <h2 className="text-xl font-bold mb-1">{model.name}</h2>
                  <div className="text-sm font-semibold mb-4">{model.description}</div>

                  <div className="border-t border-slate-200 pt-3 space-y-3 text-left">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-0.5">Training data</div>
                      <div className="text-xs text-slate-600">{model.dataSource}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-0.5">Compute</div>
                      <div className="text-xs text-slate-600 font-mono">
                        {model.computeBase}×10<sup>{model.computeExp}</sup> FLOPs
                        {model.computeEstimated && <span className="text-slate-400"> est.</span>}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-0.5">A100-days equiv.</div>
                      <div className="text-xs text-slate-600 font-mono">
                        {formatGPUDays(model.gpuDaysLow)} – {formatGPUDays(model.gpuDaysHigh)}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>

      <footer className="px-6 md:px-12 mt-6 md:mt-8 pt-6 md:pt-8 pb-8 border-t border-slate-300 text-slate-500 text-xs space-y-1">
        <p>
          Token counts: official where available (GPT-3), otherwise estimated from data size using OpenAI's tokenizer rules (~4 chars/token).
          Compute: official for GPT-3 (3.14×10<sup>23</sup> FLOPs); estimated via Epoch AI for others.
          GPU-days converted from FLOPs using NVIDIA A100 80GB at 312 TFLOPS with 30–50% MFU.
          OpenAI has not publicly disclosed architecture, compute, or dataset details for GPT-4 or GPT-5.
        </p>
        <p className="text-slate-400">
          Sources: OpenAI papers · Epoch AI scaling analysis · NVIDIA A100 specs · Microsoft Azure OpenAI supercomputer announcement (2020)
        </p>
      </footer>
    </div>
  );
}
