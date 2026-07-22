import { GoogleGenerativeAI } from '@google/generative-ai';
import { OutputFormat, Tone } from '../types';
import {
  getTwitterThreadPrompt,
  getLinkedinPostPrompt,
  getNewsletterPrompt,
  getSeoBlogPrompt,
  getVideoScriptPrompt,
  getInstagramPrompt
} from '../prompts';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export function getPromptForFormat(format: OutputFormat, content: string, title: string, tone: Tone, customInstructions?: string): string {
  switch (format) {
    case 'twitter_thread':
      return getTwitterThreadPrompt(content, title, tone, customInstructions);
    case 'linkedin':
      return getLinkedinPostPrompt(content, title, tone, customInstructions);
    case 'newsletter':
      return getNewsletterPrompt(content, title, tone, customInstructions);
    case 'blog_seo':
      return getSeoBlogPrompt(content, title, tone, customInstructions);
    case 'video_script':
      return getVideoScriptPrompt(content, title, tone, customInstructions);
    case 'instagram':
      return getInstagramPrompt(content, title, tone, customInstructions);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

export async function generateSingleOutput(content: string, title: string, format: OutputFormat, tone: Tone, customInstructions?: string): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const prompt = getPromptForFormat(format, content, title, tone, customInstructions);
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

export async function* generateOutputs(
  content: string,
  title: string,
  formats: OutputFormat[],
  tone: Tone,
  customInstructions?: string
): AsyncGenerator<{ format: OutputFormat; content: string }> {
  for (const format of formats) {
    try {
      const generatedContent = await generateSingleOutput(content, title, format, tone, customInstructions);
      yield { format, content: generatedContent };
    } catch (error) {
      console.error(`Error generating content for format ${format}:`, error);
      yield { format, content: `Error generating content: ${error instanceof Error ? error.message : String(error)}` };
    }
  }
}
