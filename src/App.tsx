/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { 
  Swords, 
  Zap, 
  Cloud, 
  MapPin, 
  User, 
  Copy, 
  Check, 
  Share2, 
  Terminal,
  ChevronRight,
  Info,
  Clapperboard,
  Sparkles,
  Flame,
  Wand2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BattleData {
  fighter1: string;
  fighter2: string;
  arena: string;
  outcome: string;
  f1CombatPattern: string;
  f2CombatPattern: string;
  f1Weapon: string;
  f2Weapon: string;
  f1Ultimate: string;
  f2Ultimate: string;
  lighting: string;
  weather: string;
  worldType: string;
}

const DEFAULT_DATA: BattleData = {
  fighter1: 'Shadow Blade',
  fighter2: 'Iron Vanguard',
  arena: 'Neon Rooftops',
  outcome: 'Shadow Blade strikes a decisive blow with a hidden twin blade.',
  f1CombatPattern: 'Acrobatic and stealthy',
  f2CombatPattern: 'Heavy and methodical',
  f1Weapon: 'Twin Katanas',
  f2Weapon: 'Greatshield and Mace',
  f1Ultimate: 'Midnight Execution',
  f2Ultimate: 'Shield Wall Crash',
  lighting: 'High-contrast flickering neon',
  weather: 'Driving rain and mist',
  worldType: 'Cyberpunk Dystopia'
};

export default function App() {
  const [data, setData] = useState<BattleData>(DEFAULT_DATA);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isGenerated, setIsGenerated] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const newData: Partial<BattleData> = {};
    
    (Object.keys(DEFAULT_DATA) as Array<keyof BattleData>).forEach(key => {
      const val = params.get(key);
      if (val) newData[key] = val;
    });

    if (Object.keys(newData).length > 0) {
      setData(prev => ({ ...prev, ...newData }));
      setIsGenerated(true);
    }
  }, []);

  const scenes = useMemo(() => {
    const { 
      fighter1: f1, fighter2: f2, arena, outcome, 
      f1CombatPattern: f1CP, f2CombatPattern: f2CP,
      f1Weapon: f1W, f2Weapon: f2W,
      lighting, weather, worldType
    } = data;

    return [
      {
        title: "SCENE 01 / INTRO",
        prompt: `Cinematic 8s video: Dramatic close-up of ${f1} showing intense expression, ${lighting} lighting highlighting their face and ${f1W}. Gripping weapon tightly, battle aura rising. ${weather} in the background. Sudden glitch transition to mirror-style cinematic close-up of ${f2}, showing their ${f2W} and ${f2CP} stance. High tension, high-detail textures, 4k cinematic style.`
      },
      {
        title: "SCENE 02 / DIALOGUE",
        prompt: `Cinematic 8s video: Medium wide shot in ${arena}. ${f1} and ${f2} standing 20 feet apart, facing each other. ${worldType} atmosphere. They exchange cold dialogue/taunts, camera slowly pushes in between them. Intense ${lighting}, atmospheric ${weather}. Focus on the emotional confrontation and the silence before the storm.`
      },
      {
        title: "SCENE 03 / INITIATION",
        prompt: `Cinematic 8s video: Action sequence. ${f1} initiates with ${f1CP} movement, rushing toward ${f2}. ${f2} reacts with ${f2CP} defense. The first violent clash of ${f1W} against ${f2W}. Impact produces sparks and energy ripples. Dynamic tracking camera, fast-paced choreography in the heart of ${arena}.`
      },
      {
        title: "SCENE 04 / ADVANTAGE",
        prompt: `Cinematic 8s video: Mid-battle. Both fighters exchange rapid strikes. ${f1} manages to find an opening, landing a significant hit. ${f2} is thrown backward into ${arena} environment features. Cinematic hit reaction, debris flying, ${lighting} flickering from the impact force. One fighter now has the clear advantage.`
      },
      {
        title: "SCENE 05 / CLASH",
        prompt: `Cinematic 8s video: Climax. ${f2} attempts a desperate last stand with ${data.f2Ultimate}, but ${f1} counters with their ultimate: ${data.f1Ultimate}. Explosive energy clash, dramatic slow-motion as the final decisive strike connects. ${outcome} The loser is critically overwhelmed. High-stakes cinematic resolution.`
      },
      {
        title: "SCENE 06 / AFTERMATH",
        prompt: `Cinematic 8s video: Victory and defeat. The battlefield in ${arena} is quiet. ${f2} is on the ground, defeated and in pain. ${f1} stands over them in a triumphant cinematic victory pose, ${f1W} glowing or dripping with energy. Emotional payoff, fading ${lighting}, character-focused exit shot. Cinematic ending.`
      }
    ];
  }, [data]);

  const combinedPrompt = useMemo(() => {
    return `VEOCINEMATIC STORYBOARD: [${data.fighter1} vs ${data.fighter2}]\n\n` + 
      scenes.map((s, i) => `[SCENE ${i+1} - 8s]: ${s.prompt}`).join('\n\n') +
      `\n\nOVERALL STYLE: ${data.worldType}, ${data.lighting}, ${data.weather}.`;
  }, [scenes, data]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0b] text-[#e2e8f0] font-['Helvetica_Neue',Arial,sans-serif] overflow-hidden">
      {/* Header */}
      <header className="bg-[#111114] border-b border-[#2d2d33] px-6 py-3 flex justify-between items-center z-10">
        <div className="text-[#f59e0b] font-extrabold tracking-[1px] text-sm uppercase">
          VEO STORYBOARD GEN // V1.0
        </div>
        <button 
          onClick={() => setIsGenerated(true)}
          className="bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold text-[12px] px-4 py-2 rounded shadow transition-all active:scale-[0.98] uppercase tracking-[1px]"
        >
          Regenerate Scenes
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[300px] bg-[#0e0e11] border-r border-[#2d2d33] p-5 overflow-y-auto shrink-0 custom-scrollbar">
          <span className="text-[10px] text-[#64748b] uppercase tracking-[2px] mb-4 block font-bold border-b border-[#2d2d33] pb-2">Battle Intelligence</span>
          
          <div className="space-y-5 mb-8">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Fighter 1', value: data.fighter1, key: 'fighter1' },
                { label: 'Fighter 2', value: data.fighter2, key: 'fighter2' },
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
          <div className="space-y-5">
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

          <div className="mt-8 bg-[#f59e0b] bg-opacity-[0.03] border border-[#f59e0b] border-opacity-10 p-4 rounded">
            <p className="text-[10px] text-[#f59e0b] leading-relaxed m-0 opacity-70 italic">
              SCENE LOGIC: All prompts are optimized for Google Veo cinematic 8s video generation.
            </p>
          </div>
        </aside>

        {/* Main Bento Grid */}
        <main className="flex-1 overflow-y-auto bg-[#0a0a0b] p-6 lg:p-8">
          {!isGenerated ? (
            <div className="h-full flex flex-col items-center justify-center text-[#64748b] border-2 border-dashed border-[#2d2d33] rounded-lg">
              <Sparkles size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-bold tracking-widest uppercase mb-4">Awaiting Signal</p>
              <button 
                onClick={() => setIsGenerated(true)}
                className="btn-primary px-8 py-3 bg-[#f59e0b] text-black font-bold rounded"
              >
                Ignite Generator
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scenes.map((scene, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-[#16161a] border border-[#2d2d33] rounded-lg p-4 flex flex-col min-h-[180px] group hover:border-[#f59e0b/30] transition-all"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[#f59e0b] text-[11px] font-bold tracking-wider">{scene.title}</span>
                    <button 
                      onClick={() => copyToClipboard(scene.prompt, idx)}
                      className="text-[9px] text-[#64748b] border border-[#2d2d33] px-2 py-0.5 rounded hover:bg-[#2d2d33] hover:text-white transition-colors uppercase font-bold"
                    >
                      {copiedIndex === idx ? 'COPIED' : 'COPY'}
                    </button>
                  </div>
                  <div className="bg-[#0a0a0b]/50 p-3 rounded border border-white/[0.02] flex-1">
                    <p className="font-mono text-[11px] leading-relaxed text-[#cbd5e1] line-clamp-6 group-hover:text-white transition-colors">
                      {scene.prompt}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Footer Panel */}
      <footer className="h-[150px] bg-[#111114] border-t border-[#2d2d33] p-4 flex flex-col shrink-0">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] text-[#64748b] uppercase tracking-[2px] font-bold">Final Combined Storyboard Prompt</span>
          <button 
            onClick={() => copyToClipboard(combinedPrompt, 99)}
            className="bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold text-[10px] px-3 py-1 rounded shadow uppercase transition-all"
          >
            {copiedIndex === 99 ? 'COPIED FULL SCRIPT' : 'Copy Full Prompt'}
          </button>
        </div>
        <div className="flex-1 bg-[#0a0a0b] border border-[#334155] rounded p-3 font-mono text-[11px] text-[#f59e0b] overflow-y-auto whitespace-pre-wrap selection:bg-[#f59e0b] selection:text-black">
          {combinedPrompt}
        </div>
      </footer>
    </div>
  );
}

