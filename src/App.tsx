/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Copy, 
  Check, 
  Terminal,
  Sparkles,
  Wand2,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateStoryboard, StoryboardResult, StoryboardScene } from './services/geminiService.ts';

interface SceneDirective {
  cameraAngle: string;
  cameraMovement: string;
  transition: string;
}

interface BattleData {
  f1Name: string;
  f2Name: string;
  arena: string;
  outcome: string;
  f1Weapon: string;
  f2Weapon: string;
  f1Ultimate: string;
  f2Ultimate: string;
  lighting: string;
  weather: string;
  worldType: string;
  sceneDirectives: SceneDirective[];
}

const DEFAULT_DATA: BattleData = {
  f1Name: '',
  f2Name: '',
  arena: '',
  outcome: '',
  f1Weapon: '',
  f2Weapon: '',
  f1Ultimate: '',
  f2Ultimate: '',
  lighting: '',
  weather: '',
  worldType: '',
  sceneDirectives: Array(8).fill(null).map(() => ({ cameraAngle: '', cameraMovement: '', transition: '' }))
};

const TRANSITIONS = ["HARD CUT", "WHIP PAN", "GLITCH EFFECT", "ZOOM TRANSITION"];

export default function App() {
  const [data, setData] = useState<BattleData>(DEFAULT_DATA);
  const [result, setResult] = useState<StoryboardResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const newData: Partial<BattleData> = {};
    
    (Object.keys(DEFAULT_DATA) as Array<keyof BattleData>).forEach(key => {
      const val = params.get(key);
      if (val) newData[key] = val;
    });

    // Backward compatibility for legacy keys
    if (!newData.f1Name && params.get('fighter1')) newData.f1Name = params.get('fighter1')!;
    if (!newData.f2Name && params.get('fighter2')) newData.f2Name = params.get('fighter2')!;

    if (Object.keys(newData).length > 0) {
      setData(prev => ({ ...prev, ...newData }));
    }
  }, []);

  const handleGenerate = async () => {
    if (!data.f1Name || !data.f2Name) {
      alert("Harap isi nama karakter!");
      return;
    }
    setResult(null); // Clear previous results
    setIsGenerating(true);
    try {
      const generated = await generateStoryboard(data);
      setResult(generated);
    } catch (error) {
      console.error("Error generating storyboard:", error);
      alert("Gagal membuat storyboard. Pastikan API Key sudah benar.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0b] text-[#e2e8f0] font-sans overflow-hidden selection:bg-[#f59e0b] selection:text-black">
      {/* Header */}
      <header className="bg-[#111114] border-b border-[#2d2d33] px-6 py-3 flex justify-between items-center z-10 shrink-0">
        <div className="text-[#f59e0b] font-extrabold tracking-[1px] text-sm uppercase">
          VEO CINEMATIC STORYBOARD GEN // V2.0
        </div>
        <button 
          disabled={isGenerating}
          onClick={handleGenerate}
          className="bg-[#f59e0b] hover:bg-[#d97706] disabled:opacity-50 text-black font-bold text-[12px] px-6 py-2 rounded shadow transition-all active:scale-[0.98] uppercase tracking-[1px] flex items-center gap-2"
        >
          {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
          {isGenerating ? 'GENERATING...' : 'GENERATE STORYBOARD'}
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[300px] bg-[#0e0e11] border-r border-[#2d2d33] p-5 overflow-y-auto shrink-0 custom-scrollbar">
          <span className="text-[10px] text-[#64748b] uppercase tracking-[2px] mb-4 block font-bold border-b border-[#2d2d33] pb-2">Battle Intelligence</span>
          
          <div className="space-y-5 mb-8">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Nama Karakter 1', value: data.f1Name, key: 'f1Name' },
                { label: 'Nama Karakter 2', value: data.f2Name, key: 'f2Name' },
              ].map(item => (
                <div key={item.label}>
                  <label className="text-[10px] text-[#94a3b8] block mb-1 uppercase tracking-wider">{item.label}</label>
                  <input 
                    value={item.value as string}
                    onChange={e => setData({...data, [item.key]: e.target.value})}
                    className="w-full bg-[#16161a] border border-[#2d2d33] rounded p-2 text-[#f8fafc] text-[11px] font-medium outline-none focus:border-[#f59e0b] focus:text-[#f59e0b] transition-all"
                  />
                </div>
              ))}
            </div>

            {[
              { label: 'Arena', value: data.arena, key: 'arena' },
              { label: 'World Type', value: data.worldType, key: 'worldType' },
              { label: 'Weather', value: data.weather, key: 'weather' },
              { label: 'Lighting', value: data.lighting, key: 'lighting' },
            ].map(item => (
              <div key={item.label}>
                <label className="text-[10px] text-[#94a3b8] block mb-1 uppercase tracking-wider">{item.label}</label>
                <input 
                  value={item.value as string}
                  onChange={e => setData({...data, [item.key]: e.target.value})}
                  className="w-full bg-[#16161a] border border-[#2d2d33] rounded p-2 text-[#f8fafc] text-[11px] font-medium outline-none focus:border-[#f59e0b] focus:text-[#f59e0b] transition-all"
                />
              </div>
            ))}

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'F1 Weapon', value: data.f1Weapon, key: 'f1Weapon' },
                { label: 'F2 Weapon', value: data.f2Weapon, key: 'f2Weapon' },
                { label: 'F1 Ultimate', value: data.f1Ultimate, key: 'f1Ultimate' },
                { label: 'F2 Ultimate', value: data.f2Ultimate, key: 'f2Ultimate' },
              ].map(item => (
                <div key={item.label}>
                  <label className="text-[10px] text-[#94a3b8] block mb-1 uppercase tracking-wider">{item.label}</label>
                  <input 
                    value={item.value as string}
                    onChange={e => setData({...data, [item.key]: e.target.value})}
                    className="w-full bg-[#16161a] border border-[#2d2d33] rounded p-2 text-[#f8fafc] text-[11px] font-medium outline-none focus:border-[#f59e0b] focus:text-[#f59e0b] transition-all"
                  />
                </div>
              ))}
            </div>
          </div>

          <span className="text-[10px] text-[#64748b] uppercase tracking-[2px] mb-4 block font-bold border-b border-[#2d2d33] pb-2">Combat Logic</span>
          <div className="space-y-5 mb-8">
             <div>
                <label className="text-[10px] text-[#94a3b8] block mb-1 uppercase tracking-wider">Battle Outcome</label>
                <textarea 
                  value={data.outcome}
                  onChange={e => setData({...data, outcome: e.target.value})}
                  rows={3}
                  className="w-full bg-[#16161a] border border-[#2d2d33] rounded p-2 text-[#f8fafc] text-[11px] font-medium outline-none focus:border-[#f59e0b] focus:text-[#f59e0b] transition-all resize-none"
                />
              </div>
          </div>

          <span className="text-[10px] text-[#64748b] uppercase tracking-[2px] mb-4 block font-bold border-b border-[#2d2d33] pb-2">Director's Cut (Camera)</span>
          <div className="space-y-4">
            {data.sceneDirectives.map((directive, idx) => (
              <div key={idx} className="p-3 bg-[#16161a] border border-[#2d2d33] rounded-lg">
                <span className="text-[9px] text-[#f59e0b] font-black uppercase mb-2 block tracking-widest">SCENE {idx + 1}</span>
                <div className="space-y-2">
                  <div>
                    <label className="text-[8px] text-[#64748b] uppercase block mb-1">Angle</label>
                    <input 
                      placeholder="e.g. Low Angle"
                      value={directive.cameraAngle}
                      onChange={e => {
                        const newDirectives = [...data.sceneDirectives];
                        newDirectives[idx].cameraAngle = e.target.value;
                        setData({ ...data, sceneDirectives: newDirectives });
                      }}
                      className="w-full bg-[#0a0a0b] border border-[#2d2d33] rounded p-1.5 text-[10px] text-zinc-300 outline-none focus:border-[#f59e0b] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[8px] text-[#64748b] uppercase block mb-1">Movement</label>
                    <input 
                      placeholder="e.g. Slow Push-in"
                      value={directive.cameraMovement}
                      onChange={e => {
                        const newDirectives = [...data.sceneDirectives];
                        newDirectives[idx].cameraMovement = e.target.value;
                        setData({ ...data, sceneDirectives: newDirectives });
                      }}
                      className="w-full bg-[#0a0a0b] border border-[#2d2d33] rounded p-1.5 text-[10px] text-zinc-300 outline-none focus:border-[#f59e0b] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[8px] text-[#64748b] uppercase block mb-1">Transition</label>
                    <select 
                      value={directive.transition}
                      onChange={e => {
                        const newDirectives = [...data.sceneDirectives];
                        newDirectives[idx].transition = e.target.value;
                        setData({ ...data, sceneDirectives: newDirectives });
                      }}
                      className="w-full bg-[#0a0a0b] border border-[#2d2d33] rounded p-1.5 text-[10px] text-zinc-300 outline-none focus:border-[#f59e0b] transition-all"
                    >
                      <option value="">AI Decide</option>
                      {TRANSITIONS.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Billboard Grid */}
        <main className="flex-1 overflow-y-auto bg-[#0a0a0b] p-6 lg:p-8 custom-scrollbar">
          {!result && !isGenerating && (
            <div className="h-full flex flex-col items-center justify-center text-[#64748b] border-2 border-dashed border-[#2d2d33] rounded-lg">
              <Sparkles size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-bold tracking-widest uppercase mb-4">Awaiting Signal</p>
              <button 
                onClick={handleGenerate}
                className="px-8 py-3 bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold rounded uppercase tracking-wider transition-all"
              >
                Ignite Generator
              </button>
            </div>
          )}

          {isGenerating && (
            <div className="h-full flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <Loader2 size={64} className="text-[#f59e0b] animate-spin" />
                <Sparkles size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#f59e0b]" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-[#f59e0b] uppercase tracking-widest mb-2">Generating Cinematic Assets</h3>
                <p className="text-sm text-[#64748b] italic">Analyzing combat patterns and narrative arcs...</p>
              </div>
            </div>
          )}

          {result && !isGenerating && (
            <AnimatePresence>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8 max-w-7xl mx-auto"
              >
                {/* Character Arc Seeds */}
                <div className="p-8 border border-[#f59e0b]/20 bg-[#16110a] rounded-xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#f59e0b]" />
                  <h3 className="text-[14px] font-black text-[#f59e0b] uppercase tracking-[2px] mb-6 flex items-center gap-2">
                    <Terminal size={18} /> CHARACTER ARC SEEDS
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    {result.arcSeeds.map((seed, idx) => (
                      <div key={idx} className="flex gap-4">
                        <span className="text-[#f59e0b] font-black text-sm">{idx + 1}.</span>
                        <p className="text-[13px] text-[#cbd5e1] italic leading-relaxed">{seed}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grid of Scenes */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {result.scenes.map((scene, idx) => (
                    <SceneCard 
                      key={idx} 
                      scene={scene} 
                      idx={idx} 
                      onCopy={copyToClipboard}
                      isCopied={copiedKey === `scene-${idx}`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>

      {/* Footer Panel */}
      {result && (
        <footer className="h-[150px] bg-[#111114] border-t border-[#2d2d33] p-4 flex flex-col shrink-0">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-[#64748b] uppercase tracking-[2px] font-bold">Final Master Storyboard Prompt</span>
            <button 
              onClick={() => copyToClipboard(JSON.stringify(result, null, 2), 'full')}
              className="bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold text-[10px] px-4 py-1.5 rounded uppercase flex items-center gap-2 transition-all shadow"
            >
              {copiedKey === 'full' ? <Check size={14} /> : <Copy size={14} />}
              {copiedKey === 'full' ? 'COPIED FULL SCRIPT' : 'Copy Full Prompt'}
            </button>
          </div>
          <div className="flex-1 bg-[#0a0a0b] border border-[#334155] rounded p-3 font-mono text-[11px] text-[#f59e0b] overflow-y-auto whitespace-pre-wrap custom-scrollbar">
            {JSON.stringify(result, null, 2)}
          </div>
        </footer>
      )}
    </div>
  );
}

function SceneCard({ 
  scene, 
  idx, 
  onCopy, 
  isCopied 
}: { 
  scene: StoryboardScene; 
  idx: number; 
  onCopy: (t: string, k: string) => void;
  isCopied: boolean;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      className="bg-[#111114] border border-[#2d2d33] rounded-xl overflow-hidden flex flex-col hover:border-[#f59e0b/30] transition-colors"
    >
      {/* Card Header */}
      <div className="px-6 py-4 border-b border-[#2d2d33] flex justify-between items-center bg-[#16161a]">
        <div className="flex items-center gap-3">
          <span className="text-white font-black text-sm uppercase tracking-wider">{scene.title}</span>
          <span className="text-[#64748b] text-[11px] font-mono">[{scene.timeRange}]</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onCopy(JSON.stringify(scene, null, 2), `scene-${idx}`)}
            className="flex items-center gap-1.5 text-[10px] text-[#64748b] hover:text-white border border-[#2d2d33] px-3 py-1 rounded transition-all uppercase font-bold"
          >
            {isCopied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
            {isCopied ? 'COPIED' : 'COPY'}
          </button>
          <span className="bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
            {scene.transition}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-[80px_1fr] gap-4">
          <span className="text-[10px] text-[#64748b] font-bold uppercase py-1">VISUAL</span>
          <p className="text-[13px] text-[#cbd5e1] leading-relaxed">{scene.visual}</p>
        </div>

        <div className="grid grid-cols-[80px_1fr] gap-4">
          <span className="text-[10px] text-[#64748b] font-bold uppercase py-1">CAMERA</span>
          <p className="text-[13px] text-zinc-400">{scene.camera}</p>
        </div>

        <div className="grid grid-cols-[80px_1fr] gap-4">
          <span className="text-[10px] text-[#64748b] font-bold uppercase py-1">MOTION</span>
          <p className="text-[13px] text-zinc-400 italic">{scene.motion}</p>
        </div>

        {/* Narasi Block */}
        <div className="bg-[#0a0a0b] p-4 rounded border border-white/5 relative group min-h-[80px] flex items-center">
          <div className="absolute top-4 left-4 text-[10px] text-red-500 font-extrabold uppercase tracking-widest bg-red-500/10 px-2 py-0.5 rounded">NARASI</div>
          <p className="text-[14px] md:text-[15px] text-[#f8fafc] font-medium pl-20 italic">"{scene.narration}"</p>
        </div>

        {/* Footer info */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#2d2d33]">
          <div>
            <span className="text-[10px] text-[#64748b] font-bold uppercase block mb-1">TONE</span>
            <span className="text-[12px] text-zinc-300">{scene.tone}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#64748b] font-bold uppercase block mb-1">AUDIO</span>
            <span className="text-[12px] text-zinc-300 italic">{scene.audio}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


