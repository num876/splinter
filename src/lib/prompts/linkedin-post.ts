import { Tone } from '../types';

export function getLinkedinPostPrompt(content: string, title: string, tone: Tone, customInstructions?: string): string {
  let prompt = `You are an expert LinkedIn copywriter. Convert the following content into a high-performing LinkedIn post.

Title: ${title}

Rules:
- Start with a strong opening hook line (pattern interrupt).
- Follow up with a short story or insight derived from the content.
- Include key takeaways as a bulleted or numbered list.
- End with a closing call to action (CTA) to encourage comments or engagement.
- Ideal length is 1300-1500 characters.
- Use professional formatting with line breaks for readability.
- Use emojis sparingly and only if they fit the professional context.
- The tone should be: ${tone}.

Content:
${content}
`;
  if (tone === 'custom' && customInstructions) {
    prompt += `\n\nCRITICAL INSTRUCTION: Adhere to the following custom tone/style rules: "${customInstructions}"`;
  }
  return prompt;
}
