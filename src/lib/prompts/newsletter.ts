import { Tone } from '../types';

export function getNewsletterPrompt(content: string, title: string, tone: Tone, customInstructions?: string): string {
  let prompt = `You are an expert email marketer. Convert the following content into an engaging newsletter section.

Title: ${title}

Rules:
- Provide a compelling subject line (max 50 chars).
- Provide a preview text (max 90 chars).
- Include a friendly greeting.
- Write a captivating opening paragraph.
- Organize the main content with clear subheadings.
- Include a suggestion for CTA button text.
- Provide a polite sign-off.
- The tone should be: ${tone}.

Content:
${content}
`;
  if (tone === 'custom' && customInstructions) {
    prompt += `\n\nCRITICAL INSTRUCTION: Adhere to the following custom tone/style rules: "${customInstructions}"`;
  }
  return prompt;
}
