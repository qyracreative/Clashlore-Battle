import { GoogleGenAI, Type } from "@google/genai";

export interface StoryboardScene {
  title: string;
  timeRange: string;
  visual: string;
  camera: string;
  motion: string;
  narration: string;
  tone: string;
  audio: string;
  transition: string;
}

export interface StoryboardResult {
  arcSeeds: string[];
  scenes: StoryboardScene[];
}

export async function generateStoryboard(data: any): Promise<StoryboardResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const systemInstruction = `You are a professional cinematic storyboard artist for Google Veo. 
Your task is to generate a 6-scene battle storyboard based on high-level battle data. 
Each scene lasts 8 seconds. 
The output MUST be in Indonesian as requested by the user.

Field definitions:
- Visual: Detailed scene description.
- Camera: Specific camera angle or movement (e.g., Extreme close-up, Low angle tracking, Handheld shake).
- Motion: Movement within the scene.
- Narration (Narasi): A single powerful quote or inner monologue.
- Tone: The mood of the scene (e.g., Kebingungan, Kerapuhan, Teror, Dingin).
- Audio: Sound effects and atmospheric cues.
- Transition: Cinematic transition type (e.g., HARD CUT, WHIP PAN, GLITCH EFFECT, ZOOM TRANSITION).

Also provide 4 "Character Arc Seeds" that explore the psychological depth of the fighters.`;

  const prompt = `Generate a detailed 6-scene cinematic storyboard and 4 character arc seeds in Indonesian based on this battle data:
Fighter 1: ${data.fighter1}
Fighter 2: ${data.fighter2}
Arena: ${data.arena}
World Type: ${data.worldType}
Weather: ${data.weather}
Lighting: ${data.lighting}
F1 Weapon: ${data.f1Weapon}
F2 Weapon: ${data.f2Weapon}
F1 Ultimate: ${data.f1Ultimate}
F2 Ultimate: ${data.f2Ultimate}
Outcome: ${data.outcome}

Structure the response as JSON.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          arcSeeds: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "4 character arc seeds in Indonesian."
          },
          scenes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "SCENE 01, SCENE 02, etc." },
                timeRange: { type: Type.STRING, description: "e.g., 00:00-00:08" },
                visual: { type: Type.STRING },
                camera: { type: Type.STRING },
                motion: { type: Type.STRING },
                narration: { type: Type.STRING },
                tone: { type: Type.STRING },
                audio: { type: Type.STRING },
                transition: { type: Type.STRING }
              },
              required: ["title", "timeRange", "visual", "camera", "motion", "narration", "tone", "audio", "transition"]
            }
          }
        },
        required: ["arcSeeds", "scenes"]
      }
    }
  });

  return JSON.parse(response.text);
}
