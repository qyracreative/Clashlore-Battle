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
Your task is to generate an 8-scene battle storyboard based on high-level battle data. 
Each scene lasts 8 seconds. 
The output MUST be in Indonesian as requested by the user.

Depth and Detail Requirements:
- Granularity: Provide extremely detailed descriptions. Don't just say "they fight", describe the choreography, the parries, and the weight of the weapons.
- Emotions: Specify micro-expressions, facial muscle tension, and emotional shifts (e.g., from confidence to sheer terror).
- Action Sequences: Describe complex, multi-layered movements within the 8-second window.
- Environment: Include how the weather and lighting interact with the characters (e.g., rain splashing off armor, neon flickering in pupils).

Flow of the 8 scenes:
1. Close-up character 1 speaking dialogue. Focus on intense facial detail and micro-expressions.
2. Glitch transition to close-up character 2 speaking dialogue. Show a contrasting emotion or cold resolve.
3. High-angle canted shot (kamera miring) of both characters facing each other. The camera should capture the scale of the arena and the atmospheric tension as they exchange dialogue.
4. Battle begins: one or both characters charge; initial clash. Describe the momentum, the sparks, and the immediate environmental impact.
5. Combat continues: complex choreography exchange. One character is hit with a specific, powerful strike and forced to retreat/pushed back into the surroundings.
6. The retreating character recovers and charges back with desperate energy for the final clash; a spectacular display of ultimate techniques where the defender is finally defeated and critically injured.
7. The defeated character in visible pain/suffering. Focus on the physical and emotional toll, capturing the moment of total collapse.
8. The winner stands triumphant, leaving the loser. Capture the final words and a unique celebration/exit that sets the tone for the aftermath.

Field definitions:
- Visual: Detailed scene description including character poses, environmental interaction, and lighting details.
- Camera: Specific camera angle or movement (e.g., Extreme close-up with shallow depth of field, Low angle tracking with motion blur, Handheld shake).
- Motion: Specific choreography and physics-based movement.
- Narration (Narasi): A single powerful quote or inner monologue.
- Tone: The specific psychological mood (e.g., Keputusasaan yang mendalam, Keheningan yang mencekam, Kemarahan yang meledak-ledak).
- Audio: Layered sound effects (SFX) and specific musical cues or atmospheric drones.
- Transition: Cinematic transition type (e.g., HARD CUT, WHIP PAN, GLITCH EFFECT, ZOOM TRANSITION).

Also provide 4 "Character Arc Seeds" that explore the psychological depth of the fighters.`;

  const prompt = `Generate a detailed 8-scene cinematic storyboard and 4 character arc seeds in Indonesian based on this battle data:
Character 1 Name: ${data.f1Name}
Character 2 Name: ${data.f2Name}
Arena: ${data.arena}
World Type: ${data.worldType}
Weather: ${data.weather}
Lighting: ${data.lighting}
F1 Weapon: ${data.f1Weapon}
F2 Weapon: ${data.f2Weapon}
F1 Ultimate: ${data.f1Ultimate}
F2 Ultimate: ${data.f2Ultimate}
Outcome: ${data.outcome}

Specific Director Directives (Incorporate these strictly):
${data.sceneDirectives?.map((d: any, i: number) => `Scene ${i + 1}:
- Angle: [${d.cameraAngle || 'AI Decide'}]
- Movement: [${d.cameraMovement || 'AI Decide'}]
- Transition: [${d.transition || 'AI Decide'}]
- Motion/Choreography: [${d.motion || 'AI Decide'}]
- Scene Description: [${d.description || 'AI Decide'}]`).join('\n\n')}

Structure the response as JSON. Follow the requested 8-scene flow exactly.`;

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
