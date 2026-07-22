import { Tone } from '../types';

export function getTwitterThreadPrompt(content: string, title: string, tone: Tone, customInstructions?: string): string {
  let prompt = `You are an expert social media manager. Convert the following content into a highly engaging Twitter/X thread (5-10 tweets).

Title: ${title}

Rules:
- Tweet 1 must be an attention-grabbing hook.
- Middle tweets should deliver the key insights and value from the content.
- The last tweet should have a call to action (CTA) and a summary.
- Each tweet must be 280 characters or less.
- Number the tweets (e.g., 1/5, 2/5).
- Use appropriate emojis sparingly to enhance readability.
- The tone should be: ${tone}.

Content:
${content}
`;
  if (tone === 'custom' && customInstructions) {
    prompt += `\n\nCRITICAL INSTRUCTION: Adhere to the following custom tone/style rules: "${customInstructions}"`;
  }
  return prompt;
}
