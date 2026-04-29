import { GoogleGenAI, Type } from "@google/genai";

export interface StoryboardScene {
  title: string;
  timeRange: string;
  visual: string;
  camera: string;
  motion: string;
  dialogue: string;
  speaker: string;
  tone: string;
  audio: string;
  transition: string;
}

export interface StoryboardResult {
  f1ImagePrompt: string;
  f2ImagePrompt: string;
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
- Visual: Detailed scene description including character poses, environmental interaction, and lighting details. MANDATORY: You must explicitly mention key visual features of the fighters in every scene (outfit details, glowing eyes, specific weapon) to ensure visual consistency for image generation.
- Camera: Specific camera angle or movement (e.g., Extreme close-up with shallow depth of field, Low angle tracking with motion blur, Handheld shake).
- Motion: Specific choreography and physics-based movement.
- Dialogue (Dialog): Exactly ONE powerful line of dialogue.
- Speaker: The name or alias of the character speaking (F1 or F2).
- Tone: The specific psychological mood (Indonesia).
- Audio: Layered sound effects (SFX) and specific musical cues or atmospheric drones.
- Transition: Cinematic transition type (e.g., HARD CUT, WHIP PAN, GLITCH EFFECT, ZOOM TRANSITION).

Also provide 2 specific character image prompts for Google Veo (f1ImagePrompt and f2ImagePrompt).`;

  const prompt = `Generate a detailed 8-scene cinematic storyboard and 2 character image prompts in Indonesian based on this comprehensive battle data:

CORE BATTLE:
- Battle ID: ${data.battleId}
- Result: ${data.battleResult}
- Arena: ${data.arena}
- World Type: ${data.f1WorldType}
- Environment: ${data.f1Weather} with ${data.f1LightingSetup}
- Color Palette: ${data.f1ColorPalette}
- Outcome Summary: ${data.outcome}

FIGHTER 1 (${data.f1Name}):
- Alias: ${data.f1Alias}
- Profile: ${data.f1Gender}, ${data.f1AgeRange}, ${data.f1Height}, ${data.f1BodyType}
- Appearance: Eyes [${data.f1EyeColor}], Hair [${data.f1HairStyle}], Face [${data.f1FaceDetails}]
- Outfit: ${data.f1OutfitDetails} (${data.f1MaterialType})
- Combat: Role [${data.f1CombatRole}], Pattern [${data.f1CombatPattern}], Pacing [${data.f1FightPacing}]
- Equipment: Weapon [${data.f1PrimaryWeapon}] - ${data.f1WeaponDetails}
- Abilities: Secondary [${data.f1SecondaryAbility}], Ultimate [${data.f1UltimateAbility}]
- Visuals: Ability Visual [${data.f1AbilityVisual}], Ultimate Visual [${data.f1UltimateVisual}]
- Physics: Movement [${data.f1MovementStyle}], Speed [${data.f1AttackSpeed}], Power [${data.f1AttackPower}]
- Psychology: Personality [${data.f1Personality}], Quote [${data.f1SignatureQuote}], Backstory [${data.f1Backstory}]
- Cinematic Style: Camera [${data.f1CameraStyle}], Impact [${data.f1ImpactStyle}], Sound [${data.f1SoundStyle}]

FIGHTER 2 (${data.f2Name}):
- Alias: ${data.f2Alias}
- Profile: ${data.f2Gender}, ${data.f2AgeRange}, ${data.f2Height}, ${data.f2BodyType}
- Appearance: Eyes [${data.f2EyeColor}], Hair [${data.f2HairStyle}], Face [${data.f2FaceDetails}]
- Outfit: ${data.f2OutfitDetails} (${data.f2MaterialType})
- Combat: Role [${data.f2CombatRole}], Pattern [${data.f2CombatPattern}], Pacing [${data.f2FightPacing}]
- Equipment: Weapon [${data.f2PrimaryWeapon}] - ${data.f2WeaponDetails}
- Abilities: Secondary [${data.f2SecondaryAbility}], Ultimate [${data.f2UltimateAbility}]
- Visuals: Ability Visual [${data.f2AbilityVisual}], Ultimate Visual [${data.f2UltimateVisual}]
- Physics: Movement [${data.f2MovementStyle}], Speed [${data.f2AttackSpeed}], Power [${data.f2AttackPower}]
- Psychology: Personality [${data.f2Personality}], Quote [${data.f2SignatureQuote}], Backstory [${data.f2Backstory}]
- Cinematic Style: Camera [${data.f2CameraStyle}], Impact [${data.f2ImpactStyle}], Sound [${data.f2SoundStyle}]

DIRECTOR'S CUT DIRECTIVES:
${data.sceneDirectives?.map((d: any, i: number) => `Scene ${i + 1}:
- Angle: [${d.cameraAngle}]
- Movement: [${d.cameraMovement}]
- Transition: [${d.transition}]
- Motion/Choreography: [${d.motion}]
- Scene Description: [${d.description}]`).join('\n\n')}

STRICT VISUAL CONSISTENCY REQUIREMENT: 
1. Maintain exactly the same appearance for both fighters (outfit, hair, face, weapons) in every single scene.
2. In the "visual" field of every scene, you MUST explicitly re-describe the character's clothing and weapon to maintain consistency for downstream image generation.
3. Treat the character descriptions provided above as the "source of truth". The visual integrity of the fighters must be 100% consistent across all 8 scenes.
4. Integrate all character details and stylistic directives (impact style, camera style) into the visual descriptions and narration for each scene.

FOR CHARACTER IMAGE PROMPTS (f1ImagePrompt and f2ImagePrompt):
Create a highly detailed, extremely high-quality prompt for generating a character portrait.
- Style: Cinematic, Ultra-realistic, 8k, Masterpiece.
- Composition: Full body shot from head to toe, ensuring the entire character is visible within the frame. Portrait aspect ratio (9:16).
- Subject: The specific fighter with all their visual details.
- Background: PURE VOID BLACK BACKGROUND or PURE EMPTY STUDIO BACKGROUND. No environment.
- Lighting: Heroic cinematic studio lighting, dramatic rim light.
- Aspect Ratio: 9:16 mandated.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          f1ImagePrompt: {
            type: Type.STRING,
            description: "Cinematic portrait prompt for Fighter 1 (9:16 aspect ratio, black background)."
          },
          f2ImagePrompt: {
            type: Type.STRING,
            description: "Cinematic portrait prompt for Fighter 2 (9:16 aspect ratio, black background)."
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
                dialogue: { type: Type.STRING },
                speaker: { type: Type.STRING, description: "Name/Alias of the character speaking." },
                tone: { type: Type.STRING },
                audio: { type: Type.STRING },
                transition: { type: Type.STRING }
              },
              required: ["title", "timeRange", "visual", "camera", "motion", "dialogue", "speaker", "tone", "audio", "transition"]
            }
          }
        },
        required: ["f1ImagePrompt", "f2ImagePrompt", "scenes"]
      }
    }
  });

  return JSON.parse(response.text);
}
