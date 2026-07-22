import { Tone } from '../types';

export function getSeoBlogPrompt(content: string, title: string, tone: Tone, customInstructions?: string): string {
  let prompt = `You are an expert SEO content writer. Convert the following content into an SEO-optimized blog article.

Title: ${title}

Rules:
- Generate a Meta Title (max 60 chars).
- Generate a Meta Description (max 155 chars).
- Write an engaging H1 headline.
- Write a strong introduction paragraph.
- Create 3-5 H2 sections with well-developed content.
- End with a conclusion and a clear call to action (CTA).
- Provide a list of suggested SEO keywords.
- Target word count: 800-1200 words.
- The tone should be: ${tone}.

Content:
${content}
`;
  if (tone === 'custom' && customInstructions) {
    prompt += `\n\nCRITICAL INSTRUCTION: Adhere to the following custom tone/style rules: "${customInstructions}"`;
  }
  return prompt;
}
