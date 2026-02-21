import { useState } from 'react';
import TokenVisualizer from './components/TokenVisualizer';
import RobotVisualizer from './components/RobotVisualizer';

type View = 'llm' | 'robot';

export default function App() {
  const [view, setView] = useState<View>('llm');

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F0]">
      <nav className="flex gap-1 px-6 md:px-12 pt-4 border-b border-slate-200">
        <button
          onClick={() => setView('llm')}
          className={`px-4 py-2 text-sm font-medium rounded-t transition-colors ${
            view === 'llm'
              ? 'bg-slate-900 text-white'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          LLM Training Data
        </button>
        <button
          onClick={() => setView('robot')}
          className={`px-4 py-2 text-sm font-medium rounded-t transition-colors ${
            view === 'robot'
              ? 'bg-slate-900 text-white'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Robot Learning Data
        </button>
      </nav>

      {view === 'llm' ? <TokenVisualizer /> : <RobotVisualizer />}
    </div>
  );
}
