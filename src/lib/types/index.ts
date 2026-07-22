// ============================================
// Splinter — Shared TypeScript Types
// ============================================

export type Plan = 'free' | 'starter' | 'pro';
export type SourceType = 'youtube' | 'blog' | 'text';
export type OutputFormat = 'twitter_thread' | 'linkedin' | 'newsletter' | 'blog_seo' | 'video_script' | 'instagram';
export type Tone = 'professional' | 'casual' | 'witty' | 'inspirational' | 'custom';
export type ProjectStatus = 'processing' | 'completed' | 'failed';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  plan: Plan;
  monthly_usage: number;
  usage_limit: number;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  source_type: SourceType;
  source_url: string | null;
  source_content: string;
  status: ProjectStatus;
  tone: Tone;
  custom_instructions?: string;
  created_at: string;
  updated_at: string;
  outputs?: Output[];
}

export interface Output {
  id: string;
  project_id: string;
  format: OutputFormat;
  content: string;
  is_edited: boolean;
  created_at: string;
}

export interface Activity {
  id: string;
  user_id: string;
  type: 'generate' | 'edit' | 'delete' | 'extract';
  description: string;
  created_at: string;
}

export const FORMAT_LABELS: Record<OutputFormat, string> = {
  twitter_thread: 'Twitter Thread',
  linkedin: 'LinkedIn Post',
  newsletter: 'Newsletter',
  blog_seo: 'SEO Blog Article',
  video_script: 'Video Script',
  instagram: 'Instagram Caption',
};

export const FORMAT_ICONS: Record<OutputFormat, string> = {
  twitter_thread: '🐦',
  linkedin: '💼',
  newsletter: '📧',
  blog_seo: '📝',
  video_script: '🎬',
  instagram: '📸',
};

export const TONE_CONFIG: Record<Tone, { label: string; icon: string; description: string }> = {
  professional: { label: 'Professional', icon: '💼', description: 'Clear, authoritative, and polished' },
  casual: { label: 'Casual', icon: '😎', description: 'Friendly, conversational, and relaxed' },
  witty: { label: 'Witty', icon: '⚡', description: 'Clever, humorous, and engaging' },
  inspirational: { label: 'Inspirational', icon: '🔥', description: 'Motivating, uplifting, and powerful' },
  custom: { label: 'Custom', icon: '✨', description: 'Your own custom tone' },
};

export const PLAN_LIMITS: Record<Plan, { splinters: number; formats: OutputFormat[]; tones: Tone[] }> = {
  free: {
    splinters: 5,
    formats: ['twitter_thread', 'linkedin', 'newsletter'],
    tones: ['professional'],
  },
  starter: {
    splinters: 50,
    formats: ['twitter_thread', 'linkedin', 'newsletter', 'blog_seo', 'video_script', 'instagram'],
    tones: ['professional', 'casual', 'witty', 'inspirational'],
  },
  pro: {
    splinters: Infinity,
    formats: ['twitter_thread', 'linkedin', 'newsletter', 'blog_seo', 'video_script', 'instagram'],
    tones: ['professional', 'casual', 'witty', 'inspirational', 'custom'],
  },
};
