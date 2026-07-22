import { Tone } from '../types';

export function getVideoScriptPrompt(content: string, title: string, tone: Tone, customInstructions?: string): string {
  let prompt = `You are an expert short-form video producer (Reels/TikTok/Shorts). Convert the following content into a high-retention video script.

Title: ${title}

Rules:
- Hook (first 3 seconds): Must be visually and verbally attention-grabbing.
- Setup (5-10 seconds): Introduce the context or problem.
- Main value (20-40 seconds): Deliver the core insights clearly.
- CTA (3-5 seconds): Tell the viewer exactly what to do next.
- Include [VISUAL NOTES] in brackets to suggest on-screen text or actions.
- Keep language conversational, punchy, and easy to speak naturally.
- Total spoken duration should be around 60-90 seconds.
- The tone should be: ${tone}.

Content:
${content}
`;
  if (tone === 'custom' && customInstructions) {
    prompt += `\n\nCRITICAL INSTRUCTION: Adhere to the following custom tone/style rules: "${customInstructions}"`;
  }
  return prompt;
}
