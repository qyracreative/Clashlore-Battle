/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Copy, 
  Check, 
  Terminal,
  Sparkles,
  Wand2,
  Loader2,
  Clapperboard,
  Music,
  Volume2,
  VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateStoryboard, StoryboardResult, StoryboardScene } from './services/geminiService.ts';

interface SceneDirective {
  cameraAngle: string;
  cameraMovement: string;
  transition: string;
  motion: string;
  description: string;
}

interface BattleData {
  // Core
  battleId: string;
  f1Name: string;
  f2Name: string;
  arena: string;
  outcome: string;
  notes: string;
  battleResult: string;

  // F1 Profile
  f1Alias: string;
  f1Gender: string;
  f1AgeRange: string;
  f1Height: string;
  f1BodyType: string;
  f1FaceDetails: string;
  f1EyeColor: string;
  f1HairStyle: string;
  f1OutfitDetails: string;
  f1MaterialType: string;
  f1PrimaryWeapon: string;
  f1WeaponDetails: string;
  f1SecondaryAbility: string;
  f1AbilityVisual: string;
  f1UltimateAbility: string;
  f1UltimateVisual: string;
  f1MovementStyle: string;
  f1CombatPattern: string;
  f1Weakness: string;
  f1Personality: string;
  f1EmotionTrigger: string;
  f1DefaultExpression: string;
  f1AttackExpression: string;
  f1ArenaType: string;
  f1ArenaDetails: string;
  f1LightingSetup: string;
  f1Weather: string;
  f1WorldType: string;
  f1ColorPalette: string;
  f1Backstory: string;
  f1SignatureQuote: string;
  f1CombatRole: string;
  f1AttackSpeed: string;
  f1AttackPower: string;
  f1DefenseLevel: string;
  f1ComboLimit: string;
  f1FightPacing: string;
  f1CameraStyle: string;
  f1SoundStyle: string;
  f1ImpactStyle: string;
  f1FinisherStyle: string;
  f1SignatureMove1: string;
  f1SignatureMove2: string;
  f1CounterCharacter: string;
  f1WeakAgainst: string;
  powerF1: string;

  // F2 Profile
  f2Alias: string;
  f2Gender: string;
  f2AgeRange: string;
  f2Height: string;
  f2BodyType: string;
  f2FaceDetails: string;
  f2EyeColor: string;
  f2HairStyle: string;
  f2OutfitDetails: string;
  f2MaterialType: string;
  f2PrimaryWeapon: string;
  f2WeaponDetails: string;
  f2SecondaryAbility: string;
  f2AbilityVisual: string;
  f2UltimateAbility: string;
  f2UltimateVisual: string;
  f2MovementStyle: string;
  f2CombatPattern: string;
  f2Weakness: string;
  f2Personality: string;
  f2EmotionTrigger: string;
  f2DefaultExpression: string;
  f2AttackExpression: string;
  f2ArenaType: string;
  f2ArenaDetails: string;
  f2LightingSetup: string;
  f2Weather: string;
  f2WorldType: string;
  f2ColorPalette: string;
  f2Backstory: string;
  f2SignatureQuote: string;
  f2CombatRole: string;
  f2AttackSpeed: string;
  f2AttackPower: string;
  f2DefenseLevel: string;
  f2ComboLimit: string;
  f2FightPacing: string;
  f2CameraStyle: string;
  f2SoundStyle: string;
  f2ImpactStyle: string;
  f2FinisherStyle: string;
  f2SignatureMove1: string;
  f2SignatureMove2: string;
  f2CounterCharacter: string;
  f2WeakAgainst: string;
  powerF2: string;

  sceneDirectives: SceneDirective[];
}

const DEFAULT_SCENE_DIRECTIVES: SceneDirective[] = [
  { 
    cameraAngle: 'Extreme Close-up', 
    cameraMovement: 'Static focus on eyes', 
    transition: 'HARD CUT', 
    motion: 'Intense micro-expressions, facial muscle tension', 
    description: 'Fokus tajam pada detail wajah dan emosi mendalam karakter pertama saat berbicara.' 
  },
  { 
    cameraAngle: 'Mid Close-up', 
    cameraMovement: 'Handheld subtle shake', 
    transition: 'GLITCH EFFECT', 
    motion: 'Cold resolve, steady breathing, subtle smirk', 
    description: 'Menunjukkan respon dingin dan kesiapan mental karakter kedua melalui transisi glitch.' 
  },
  { 
    cameraAngle: 'High-angle Canted Shot', 
    cameraMovement: 'Slow Crane down', 
    transition: 'WHIP PAN', 
    motion: 'Wind blowing clothes and hair, characters locked in a gaze', 
    description: 'Pemandangan luas arena pertarungan yang miring (canted) untuk menambah rasa tidak stabil dan tegang.' 
  },
  { 
    cameraAngle: 'Low Angle Tracking', 
    cameraMovement: 'Fast Dolly In', 
    transition: 'HARD CUT', 
    motion: 'Explosive dash towards center, sparks flying upon blade impact', 
    description: 'Awal benturan pertama yang dahsyat, kamera mengikuti gerakan agresif ke arah lawan.' 
  },
  { 
    cameraAngle: 'Dynamic Orbit Shot', 
    cameraMovement: '360 degree rapid rotation', 
    transition: 'WHIP PAN', 
    motion: 'Complex parries, counters, and high-speed martial arts exchange', 
    description: 'Urutan pertarungan koreografi tingkat tinggi yang menunjukkan kecepatan dan presisi kedua petarung.' 
  },
  { 
    cameraAngle: 'Bird\'s Eye to Close-up', 
    cameraMovement: 'Crash Zoom', 
    transition: 'ZOOM TRANSITION', 
    motion: 'Execution of ultimate move, massive energy shockwave release', 
    description: 'Puncak pertarungan di mana teknik pamungkas digunakan, menciptakan efek visual yang menghancurkan sekitarnya.' 
  },
  { 
    cameraAngle: 'Eye Level Close-up', 
    cameraMovement: 'Slow Tracking Slider', 
    transition: 'HARD CUT', 
    motion: 'Kneeling in defeat, heavy breathing, environmental debris settling', 
    description: 'Momen kekalahan yang menunjukkan kerapuhan fisik dan emosional karakter yang kalah.' 
  },
  { 
    cameraAngle: 'Low Angle Hero Shot', 
    cameraMovement: 'Slow Tilt Up followed by tracking away', 
    transition: 'WHIP PAN', 
    motion: 'Sheathing weapon with a click, walking away into the sunset', 
    description: 'Pemenang berjalan meninggalkan medan laga, memberikan kesan kemenangan yang ikonik dan tenang.' 
  }
];

const DEFAULT_DATA: BattleData = {
  battleId: 'CLASH-001',
  f1Name: 'Kaelen Shadowstep',
  f2Name: 'Vorgath the Iron Wall',
  arena: 'Cyber-Dystopian Arena',
  outcome: 'Kaelen outmaneuvers Vorgath after a grueling exchange, leaving him paralyzed by shadow blades.',
  notes: 'High stakes match for the obsidian throne.',
  battleResult: 'Fighter 1 Victory',

  // F1
  f1Alias: 'The Nightshade',
  f1Gender: 'Male',
  f1AgeRange: '20-25',
  f1Height: '180cm',
  f1BodyType: 'Athletic/Lean',
  f1FaceDetails: 'Sharp jawline, scar over left eye',
  f1EyeColor: 'Glowing Violet',
  f1HairStyle: 'Short black undercut',
  f1OutfitDetails: 'Stealth tactical weave with glowing accents',
  f1MaterialType: 'Carbon-fiber mesh',
  f1PrimaryWeapon: 'Shadow Twin Blades',
  f1WeaponDetails: 'Retractable phase-shift swords',
  f1SecondaryAbility: 'Shadow Jaunt',
  f1AbilityVisual: 'Purple misty teleportation smoke',
  f1UltimateAbility: 'Nightfall Execution',
  f1UltimateVisual: 'Screen turns black with violet slashes',
  f1MovementStyle: 'Acrobatic/Gliding',
  f1CombatPattern: 'High speed pressure',
  f1Weakness: 'Physical durability',
  f1Personality: 'Stoic and calculating',
  f1EmotionTrigger: 'Betrayal',
  f1DefaultExpression: 'Neutral cold stare',
  f1AttackExpression: 'Intense focus',
  f1ArenaType: 'Cyber-Arena',
  f1ArenaDetails: 'Neon lit floating platforms',
  f1LightingSetup: 'High contrast neon blue and red',
  f1Weather: 'Rain of static',
  f1WorldType: 'Deep Future',
  f1ColorPalette: 'Black, Purple, Cyan',
  f1Backstory: 'Exiled prince of the shadow realm.',
  f1SignatureQuote: 'Darkness is my only ally.',
  f1CombatRole: 'Assassin',
  f1AttackSpeed: 'Ex-Tier',
  f1AttackPower: 'A-Tier',
  f1DefenseLevel: 'C-Tier',
  f1ComboLimit: 'Infinite focus',
  f1FightPacing: 'Hyper-Fast',
  f1CameraStyle: 'SnorriCam / Kinetic',
  f1SoundStyle: 'Glitch-Hop / Bass Heavy',
  f1ImpactStyle: 'Sharp / Precise',
  f1FinisherStyle: 'Cinematic Slow-mo',
  f1SignatureMove1: 'Void Step',
  f1SignatureMove2: 'Eclipse Slice',
  f1CounterCharacter: 'Brawlers',
  f1WeakAgainst: 'Area Control mages',
  powerF1: '9500',

  // F2
  f2Alias: 'The Bulwark',
  f2Gender: 'Male',
  f2AgeRange: '40-45',
  f2Height: '210cm',
  f2BodyType: 'Colossal/Heavy',
  f2FaceDetails: 'Bearded, weathered skin',
  f2EyeColor: 'Steel Grey',
  f2HairStyle: 'Bald with runic tattoos',
  f2OutfitDetails: 'Heavy basalt-infused power armor',
  f2MaterialType: 'Enchanted heavy plate',
  f2PrimaryWeapon: 'Gravity Shield',
  f2WeaponDetails: 'Can shift its mass to crush or deflect',
  f2SecondaryAbility: 'Kinetic Absorption',
  f2AbilityVisual: 'Ripples in the air like heat distortion',
  f2UltimateAbility: 'Cataclysmic Shockwave',
  f2UltimateVisual: 'Ground shatters as he slams the shield',
  f2MovementStyle: 'Stomping/Unstoppable',
  f2CombatPattern: 'Reactive counter-striker',
  f2Weakness: 'Slow mobility',
  f2Personality: 'Honorable and unyielding',
  f2EmotionTrigger: 'Injustice',
  f2DefaultExpression: 'Grim determination',
  f2AttackExpression: 'Primal roar',
  f2ArenaType: 'Industrial Wasteland',
  f2ArenaDetails: 'Rusted factory with molten metal',
  f2LightingSetup: 'Amber warm lighting',
  f2Weather: 'Ash fall',
  f2WorldType: 'Dark Industrial',
  f2ColorPalette: 'Iron, Rust, Amber',
  f2Backstory: 'Last guardian of the foundry gates.',
  f2SignatureQuote: 'I am the wall that never falls.',
  f2CombatRole: 'Tank/Juggernaut',
  f2AttackSpeed: 'D-Tier',
  f2AttackPower: 'S-Tier',
  f2DefenseLevel: 'SSS-Tier',
  f2ComboLimit: 'Heavy single hits',
  f2FightPacing: 'Slow/Impactful',
  f2CameraStyle: 'Low angle grounded',
  f2SoundStyle: 'Metallic clanging / Orchestral',
  f2ImpactStyle: 'Heavy / Earth-shattering',
  f2FinisherStyle: 'Brutal Crushing',
  f2SignatureMove1: 'Mountain Slam',
  f2SignatureMove2: 'Iron Fortress',
  f2CounterCharacter: 'Glass Cannons',
  f2WeakAgainst: 'Agile speedsters',
  powerF2: '9200',

  sceneDirectives: DEFAULT_SCENE_DIRECTIVES
};

const TRANSITIONS = ["HARD CUT", "WHIP PAN", "GLITCH EFFECT", "ZOOM TRANSITION"];

export default function App() {
  const [data, setData] = useState<BattleData>(DEFAULT_DATA);
  const [result, setResult] = useState<StoryboardResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [audio] = useState(() => {
    const a = new Audio("https://assets.mixkit.co/music/preview/mixkit-cinematic-ambience-2234.mp3");
    a.loop = true;
    a.volume = 0.15;
    return a;
  });

  useEffect(() => {
    if (!isMuted) {
      audio.play().catch(() => {
        // User interaction required for first play
        console.log("Interaction needed to play audio");
      });
    } else {
      audio.pause();
    }
  }, [isMuted, audio]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const newData: Partial<BattleData> = {};
    
    (Object.keys(DEFAULT_DATA) as Array<keyof BattleData>).forEach(key => {
      const val = params.get(key);
      if (val && key !== 'sceneDirectives') (newData as any)[key] = val;
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

  // Auto-generate after 2 seconds on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      handleGenerate();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0b] text-[#e2e8f0] font-sans overflow-hidden selection:bg-[#f59e0b] selection:text-black">
      {/* Header */}
      <header className="bg-[#111114] border-b border-[#2d2d33] px-6 py-3 flex justify-between items-center z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-[#ef4444] p-2 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/20">
            <Clapperboard size={18} className="text-white" />
          </div>
          <div className="text-[#f59e0b] font-extrabold tracking-[1px] text-sm uppercase">
            Clashlore-Battle
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="text-[#64748b] hover:text-[#f59e0b] transition-colors p-2 rounded-full hover:bg-white/5"
            title={isMuted ? "Unmute Music" : "Mute Music"}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <button 
            disabled={isGenerating}
            onClick={handleGenerate}
            className="bg-[#f59e0b] hover:bg-[#d97706] disabled:opacity-50 text-black font-bold text-[12px] px-6 py-2 rounded shadow transition-all active:scale-[0.98] uppercase tracking-[1px] flex items-center gap-2"
          >
            {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
            {isGenerating ? 'GENERATING...' : 'GENERATE STORYBOARD'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[350px] bg-[#0e0e11] border-r border-[#2d2d33] p-5 overflow-y-auto shrink-0 custom-scrollbar">
          <span className="text-[10px] text-[#64748b] uppercase tracking-[2px] mb-4 block font-bold border-b border-[#2d2d33] pb-2">Core Battle Data</span>
          
          <div className="space-y-4 mb-8">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] text-[#94a3b8] block mb-1 uppercase tracking-wider">Battle ID</label>
                <input 
                  value={data.battleId}
                  onChange={e => setData({...data, battleId: e.target.value})}
                  className="w-full bg-[#16161a] border border-[#2d2d33] rounded p-2 text-[#f8fafc] text-[10px] font-medium outline-none focus:border-[#f59e0b] transition-all"
                />
              </div>
              <div>
                <label className="text-[9px] text-[#94a3b8] block mb-1 uppercase tracking-wider">Result</label>
                <input 
                  value={data.battleResult}
                  onChange={e => setData({...data, battleResult: e.target.value})}
                  className="w-full bg-[#16161a] border border-[#2d2d33] rounded p-2 text-[#f8fafc] text-[10px] font-medium outline-none focus:border-[#f59e0b] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] text-[#94a3b8] block mb-1 uppercase tracking-wider">Fighter 1</label>
                <input 
                  value={data.f1Name}
                  onChange={e => setData({...data, f1Name: e.target.value})}
                  className="w-full bg-[#16161a] border border-[#2d2d33] rounded p-2 text-[#f8fafc] text-[10px] font-medium outline-none focus:border-[#f59e0b] transition-all"
                />
              </div>
              <div>
                <label className="text-[9px] text-[#94a3b8] block mb-1 uppercase tracking-wider">Fighter 2</label>
                <input 
                  value={data.f2Name}
                  onChange={e => setData({...data, f2Name: e.target.value})}
                  className="w-full bg-[#16161a] border border-[#2d2d33] rounded p-2 text-[#f8fafc] text-[10px] font-medium outline-none focus:border-[#f59e0b] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-[9px] text-[#94a3b8] block mb-1 uppercase tracking-wider">Arena Name</label>
              <input 
                value={data.arena}
                onChange={e => setData({...data, arena: e.target.value})}
                className="w-full bg-[#16161a] border border-[#2d2d33] rounded p-2 text-[#f8fafc] text-[10px] font-medium outline-none focus:border-[#f59e0b] transition-all"
              />
            </div>

            <div>
              <label className="text-[9px] text-[#94a3b8] block mb-1 uppercase tracking-wider">Outcome</label>
              <textarea 
                value={data.outcome}
                onChange={e => setData({...data, outcome: e.target.value})}
                rows={2}
                className="w-full bg-[#16161a] border border-[#2d2d33] rounded p-2 text-[#f8fafc] text-[10px] font-medium outline-none focus:border-[#f59e0b] transition-all resize-none"
              />
            </div>
          </div>

          {[1, 2].map(fNum => (
            <div key={fNum} className="mb-8 p-3 border border-white/5 rounded-lg bg-[#111114]">
              <span className="text-[10px] text-[#f59e0b] uppercase tracking-[2px] mb-4 block font-black">Fighter {fNum} Profile</span>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <UIField label="Alias" field={`f${fNum}Alias` as keyof BattleData} data={data} setData={setData} />
                  <UIField label="Gender" field={`f${fNum}Gender` as keyof BattleData} data={data} setData={setData} />
                  <UIField label="Age Range" field={`f${fNum}AgeRange` as keyof BattleData} data={data} setData={setData} />
                  <UIField label="Height" field={`f${fNum}Height` as keyof BattleData} data={data} setData={setData} />
                  <UIField label="Body Type" field={`f${fNum}BodyType` as keyof BattleData} data={data} setData={setData} />
                  <UIField label="Power" field={`powerF${fNum}` as keyof BattleData} data={data} setData={setData} />
                </div>
                <UIField label="Personality" field={`f${fNum}Personality` as keyof BattleData} data={data} setData={setData} />
                <UIField label="Backstory" field={`f${fNum}Backstory` as keyof BattleData} data={data} setData={setData} />
                
                <span className="text-[8px] text-[#64748b] uppercase font-bold pt-2 block border-t border-white/5">Combat Stats</span>
                <div className="grid grid-cols-2 gap-2">
                  <UIField label="Role" field={`f${fNum}CombatRole` as keyof BattleData} data={data} setData={setData} />
                  <UIField label="Pattern" field={`f${fNum}CombatPattern` as keyof BattleData} data={data} setData={setData} />
                  <UIField label="Weapon" field={`f${fNum}PrimaryWeapon` as keyof BattleData} data={data} setData={setData} />
                  <UIField label="Ultimate" field={`f${fNum}UltimateAbility` as keyof BattleData} data={data} setData={setData} />
                  <UIField label="Weakness" field={`f${fNum}Weakness` as keyof BattleData} data={data} setData={setData} />
                  <UIField label="Style" field={`f${fNum}MovementStyle` as keyof BattleData} data={data} setData={setData} />
                </div>
                
                <span className="text-[8px] text-[#64748b] uppercase font-bold pt-2 block border-t border-white/5">Cinematic Style</span>
                <div className="grid grid-cols-2 gap-2">
                  <UIField label="Camera" field={`f${fNum}CameraStyle` as keyof BattleData} data={data} setData={setData} />
                  <UIField label="Impact" field={`f${fNum}ImpactStyle` as keyof BattleData} data={data} setData={setData} />
                  <UIField label="Pacing" field={`f${fNum}FightPacing` as keyof BattleData} data={data} setData={setData} />
                  <UIField label="Finisher" field={`f${fNum}FinisherStyle` as keyof BattleData} data={data} setData={setData} />
                </div>
              </div>
            </div>
          ))}

          <span className="text-[10px] text-[#64748b] uppercase tracking-[2px] mb-4 block font-bold border-b border-[#2d2d33] pb-2">Environment & Atmosphere</span>
          <div className="space-y-4 mb-8">
             <div className="grid grid-cols-2 gap-2">
                <UIField label="World Type" field="f1WorldType" data={data} setData={setData} />
                <UIField label="Weather" field="f1Weather" data={data} setData={setData} />
                <UIField label="Lighting" field="f1LightingSetup" data={data} setData={setData} />
                <UIField label="Palette" field="f1ColorPalette" data={data} setData={setData} />
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
                  <div>
                    <label className="text-[8px] text-[#64748b] uppercase block mb-1">Motion Choreography</label>
                    <input 
                      placeholder="e.g. F1 parries high, F2 counters with kick"
                      value={directive.motion}
                      onChange={e => {
                        const newDirectives = [...data.sceneDirectives];
                        newDirectives[idx].motion = e.target.value;
                        setData({ ...data, sceneDirectives: newDirectives });
                      }}
                      className="w-full bg-[#0a0a0b] border border-[#2d2d33] rounded p-1.5 text-[10px] text-zinc-300 outline-none focus:border-[#f59e0b] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[8px] text-[#64748b] uppercase block mb-1">Detailed Description</label>
                    <textarea 
                      placeholder="Specific character actions, lighting mood, or environmental details..."
                      value={directive.description}
                      onChange={e => {
                        const newDirectives = [...data.sceneDirectives];
                        newDirectives[idx].description = e.target.value;
                        setData({ ...data, sceneDirectives: newDirectives });
                      }}
                      rows={2}
                      className="w-full bg-[#0a0a0b] border border-[#2d2d33] rounded p-1.5 text-[10px] text-zinc-300 outline-none focus:border-[#f59e0b] transition-all resize-none"
                    />
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
                {/* Character Image Prompts */}
                <div className="p-8 border border-[#f59e0b]/20 bg-[#16110a] rounded-xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#f59e0b]" />
                  <h3 className="text-[14px] font-black text-[#f59e0b] uppercase tracking-[2px] mb-6 flex items-center gap-2">
                    <Terminal size={18} /> CHARACTER IMAGE PROMPTS (VEO 9:16)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest">FIGHTER 1: {data.f1Name}</span>
                        <button 
                          onClick={() => copyToClipboard(result.f1ImagePrompt, 'f1Prompt')}
                          className="text-[#64748b] hover:text-[#f59e0b] transition-colors p-1"
                        >
                          {copiedKey === 'f1Prompt' ? <Check size={14} className="text-[#10b981]" /> : <Copy size={14} />}
                        </button>
                      </div>
                      <div className="bg-[#0a0a0b] p-4 rounded-lg border border-[#2d2d33] text-[12px] text-zinc-400 font-mono leading-relaxed">
                        {result.f1ImagePrompt}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest">FIGHTER 2: {data.f2Name}</span>
                        <button 
                          onClick={() => copyToClipboard(result.f2ImagePrompt, 'f2Prompt')}
                          className="text-[#64748b] hover:text-[#f59e0b] transition-colors p-1"
                        >
                          {copiedKey === 'f2Prompt' ? <Check size={14} className="text-[#10b981]" /> : <Copy size={14} />}
                        </button>
                      </div>
                      <div className="bg-[#0a0a0b] p-4 rounded-lg border border-[#2d2d33] text-[12px] text-zinc-400 font-mono leading-relaxed">
                        {result.f2ImagePrompt}
                      </div>
                    </div>
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

function UIField({ label, field, data, setData }: { label: string, field: keyof BattleData, data: BattleData, setData: (d: BattleData) => void }) {
  return (
    <div>
      <label className="text-[8px] text-[#64748b] block mb-1 uppercase tracking-wider font-bold">{label}</label>
      <input 
        value={data[field] as string}
        onChange={e => setData({...data, [field]: e.target.value})}
        className="w-full bg-[#1e1e24] border border-[#2d2d33] rounded p-1.5 text-[#f8fafc] text-[10px] outline-none focus:border-[#f59e0b] transition-all"
      />
    </div>
  );
}

interface SceneCardProps {
  scene: StoryboardScene;
  idx: number;
  onCopy: (t: string, k: string) => void;
  isCopied: boolean;
  key?: React.Key;
}

function SceneCard({ 
  scene, 
  idx, 
  onCopy, 
  isCopied 
}: SceneCardProps) {
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

        {/* Dialogue Block */}
        <div className="bg-[#0a0a0b] p-4 rounded border border-white/5 relative group min-h-[80px] flex items-center">
          <div className="absolute top-4 left-4 flex flex-col gap-1">
            <div className="text-[10px] text-yellow-500 font-extrabold uppercase tracking-widest bg-yellow-500/10 px-2 py-0.5 rounded w-fit">DIALOGUE</div>
            <div className="text-[9px] text-[#f59e0b] font-black uppercase tracking-tight">{scene.speaker}</div>
          </div>
          <p className="text-[14px] md:text-[15px] text-[#f8fafc] font-medium pl-32 italic">"{scene.dialogue}"</p>
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


