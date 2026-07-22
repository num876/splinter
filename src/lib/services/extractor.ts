import * as cheerio from 'cheerio';
import { YoutubeTranscript } from 'youtube-transcript';
import { SourceType } from '../types';

export async function extractContent(input: string): Promise<{ type: SourceType; content: string; title: string; url?: string }> {
  try {
    const urlPattern = /^(https?:\/\/[^\s]+)/i;
    const isUrl = urlPattern.test(input.trim());

    if (!isUrl) {
      return {
        type: 'text',
        content: input.trim(),
        title: 'Raw Text Input'
      };
    }

    const url = input.trim();
    const isYoutube = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]+)/i.test(url);

    if (isYoutube) {
      return await extractFromYoutube(url);
    } else {
      return await extractFromArticle(url);
    }
  } catch (error) {
    throw new Error(`Extraction failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function extractFromYoutube(url: string): Promise<{ type: SourceType; content: string; title: string; url: string }> {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(url);
    const content = transcript.map(t => t.text).join(' ');
    
    // Fallback title, getting actual title might require a different fetch/API
    // Let's try to fetch the page just for the title
    let title = 'YouTube Video';
    try {
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);
      title = $('title').text().replace(' - YouTube', '').trim() || title;
    } catch (e) {
      // ignore
    }

    return { type: 'youtube', content, title, url };
  } catch (error) {
    throw new Error(`Failed to extract YouTube transcript: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function extractFromArticle(url: string): Promise<{ type: SourceType; content: string; title: string; url: string }> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch article: ${response.statusText}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $('title').text().trim() || $('h1').first().text().trim() || 'Article';

    // Remove unwanted elements
    $('nav, footer, header, aside, script, style, noscript, iframe, .ad, .ads, .advertisement, [role="banner"], [role="navigation"], [role="contentinfo"]').remove();

    // Look for main content areas
    let mainContent = $('article').text();
    if (!mainContent) {
      mainContent = $('main').text();
    }
    if (!mainContent) {
      mainContent = $('body').text();
    }

    // Clean whitespace
    const cleanContent = mainContent.replace(/\s+/g, ' ').trim();

    return { type: 'blog', content: cleanContent, title, url };
  } catch (error) {
    throw new Error(`Failed to extract article content: ${error instanceof Error ? error.message : String(error)}`);
  }
}
