import { Tone } from '../types';

export function getInstagramPrompt(content: string, title: string, tone: Tone, customInstructions?: string): string {
  let prompt = `You are an expert Instagram growth manager. Convert the following content into an engaging Instagram caption.

Title: ${title}

Rules:
- Start with a strong opening line (hook) that will be visible before the 'more' button.
- Write 2-3 paragraphs delivering the main value or story.
- Include a clear call to action (CTA), such as a question to encourage comments or 'link in bio'.
- Add a line break after the content.
- Include a block of 20-30 highly relevant hashtags.
- Total character count must be under 2200 characters.
- Use emojis generously to break up text and add personality.
- The tone should be: ${tone}.

Content:
${content}
`;
  if (tone === 'custom' && customInstructions) {
    prompt += `\n\nCRITICAL INSTRUCTION: Adhere to the following custom tone/style rules: "${customInstructions}"`;
  }
  return prompt;
}
