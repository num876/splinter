'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import TabGroup from '@/components/TabGroup';
import FormatBadge from '@/components/FormatBadge';
import CopyButton from '@/components/CopyButton';
import { OutputFormat, FORMAT_LABELS, FORMAT_ICONS, Tone, Output } from '@/lib/types';
import { auth } from '@/lib/firebase/config';
import '../splinter.css';

const TONE_OPTIONS: { id: Tone; label: string; emoji: string; desc: string }[] = [
  { id: 'professional', label: 'Professional', emoji: '👔', desc: 'Clean, clear, business-ready' },
  { id: 'casual', label: 'Casual', emoji: '☕', desc: 'Friendly and conversational' },
  { id: 'witty', label: 'Witty', emoji: '🎭', desc: 'Clever, engaging, fun' },
  { id: 'inspirational', label: 'Inspirational', emoji: '✨', desc: 'Motivating and uplifting' },
  { id: 'custom', label: 'Custom', emoji: '✨', desc: 'Your own custom tone' },
];

const ALL_FORMATS: OutputFormat[] = [
  'twitter_thread', 'linkedin', 'newsletter', 'blog_seo', 'video_script', 'instagram'
];

export default function NewSplinterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [inputType, setInputType] = useState<'url' | 'text'>('url');
  const [inputValue, setInputValue] = useState('');
  const [selectedTone, setSelectedTone] = useState<Tone>('professional');
  const [customInstructions, setCustomInstructions] = useState('');
  const [selectedFormats, setSelectedFormats] = useState<OutputFormat[]>([...ALL_FORMATS]);

  // Processing & output state
  const [processingStatus, setProcessingStatus] = useState('Extracting content...');
  const [activeOutputTab, setActiveOutputTab] = useState<OutputFormat>('twitter_thread');
  const [outputs, setOutputs] = useState<Record<string, string>>({});
  const [editingFormat, setEditingFormat] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setStep(2);
    setError(null);
    setProcessingStatus('Extracting content...');

    try {
      // Get Firebase Auth token
      const token = await auth.currentUser?.getIdToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // Step 1: Extract content
      const extractRes = await fetch('/api/extract', {
        method: 'POST',
        headers,
        body: JSON.stringify({ input: inputValue }),
      });

      if (!extractRes.ok) {
        const err = await extractRes.json();
        throw new Error(err.error || 'Failed to extract content');
      }

      const { content, title } = await extractRes.json();
      setProcessingStatus('Generating content for all formats...');

      // Step 2: Generate outputs
      const generateRes = await fetch('/api/generate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          content,
          title,
          formats: selectedFormats,
          tone: selectedTone,
          customInstructions,
        }),
      });

      if (!generateRes.ok) {
        const err = await generateRes.json();
        throw new Error(err.error || 'Failed to generate content');
      }

      const { outputs: generatedOutputs } = await generateRes.json();
      const outputMap: Record<string, string> = {};
      generatedOutputs.forEach((o: Output) => {
        outputMap[o.format] = o.content;
      });

      setOutputs(outputMap);
      setActiveOutputTab(selectedFormats[0]);
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStep(1);
    }
  };

  const toggleFormat = (f: OutputFormat) => {
    setSelectedFormats(prev =>
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    );
  };

  const handleEdit = (format: string) => {
    setEditingFormat(format);
    setEditContent(outputs[format] || '');
  };

  const handleSaveEdit = () => {
    if (editingFormat) {
      setOutputs(prev => ({ ...prev, [editingFormat]: editContent }));
      setEditingFormat(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingFormat(null);
    setEditContent('');
  };

  const handleRegenerate = async (format: OutputFormat) => {
    setProcessingStatus(`Regenerating ${FORMAT_LABELS[format]}...`);
    try {
      const token = await auth.currentUser?.getIdToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const extractRes = await fetch('/api/extract', {
        method: 'POST',
        headers,
        body: JSON.stringify({ input: inputValue }),
      });
      const { content, title } = await extractRes.json();

      const generateRes = await fetch('/api/generate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          content,
          title,
          formats: [format],
          tone: selectedTone,
          customInstructions,
        }),
      });

      if (generateRes.ok) {
        const { outputs: newOutputs } = await generateRes.json();
        if (newOutputs.length > 0) {
          setOutputs(prev => ({ ...prev, [format]: newOutputs[0].content }));
        }
      }
    } catch {
      // silently fail for now
    }
  };

  return (
    <div className="splinter-page">
      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {step === 1 && (
        <div className="splinter-step-1">
          <h1 className="splinter-title">Create New Splinter</h1>
          <p className="splinter-subtitle">Paste a URL or write text, pick your tone and formats, and let AI do the rest.</p>

          <div className="input-section">
            <TabGroup
              tabs={[{ key: 'url', label: '🔗 Paste URL' }, { key: 'text', label: '✏️ Write Text' }]}
              activeTab={inputType}
              onChange={(k) => setInputType(k as 'url' | 'text')}
            />

            <div className="input-area-wrapper">
              {inputType === 'url' ? (
                <input
                  type="text"
                  className="splinter-input url-input"
                  placeholder="Paste a YouTube or blog URL here..."
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                />
              ) : (
                <textarea
                  className="splinter-input text-input"
                  placeholder="Paste or write your content here..."
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  rows={8}
                />
              )}
              {inputType === 'text' && (
                <div className="char-count">{inputValue.length} characters</div>
              )}
            </div>
          </div>

          <div className="options-section">
            <h3 className="section-label">Select Tone</h3>
            <div className="tone-grid">
              {TONE_OPTIONS.map(tone => (
                <div
                  key={tone.id}
                  className={`option-card ${selectedTone === tone.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTone(tone.id)}
                >
                  <div className="option-icon">{tone.emoji}</div>
                  <div className="option-details">
                    <h4>{tone.label}</h4>
                    <p>{tone.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            {selectedTone === 'custom' && (
              <div className="custom-tone-input" style={{ marginTop: '1rem' }}>
                <textarea
                  className="splinter-input text-input"
                  placeholder="E.g., Write like a pirate, keep it under 3 sentences..."
                  value={customInstructions}
                  onChange={e => setCustomInstructions(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </div>

          <div className="options-section">
            <h3 className="section-label">Select Formats</h3>
            <div className="format-grid">
              {ALL_FORMATS.map(format => (
                <div
                  key={format}
                  className={`option-card format-card ${selectedFormats.includes(format) ? 'selected' : ''}`}
                  onClick={() => toggleFormat(format)}
                >
                  <div className="checkbox-indicator">{selectedFormats.includes(format) ? '✓' : ''}</div>
                  <span className="format-emoji">{FORMAT_ICONS[format]}</span>
                  <span className="format-label">{FORMAT_LABELS[format]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="action-row">
            <button
              className="generate-btn"
              onClick={handleGenerate}
              disabled={!inputValue.trim() || selectedFormats.length === 0}
            >
              Generate Splinter ⚡
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="splinter-step-2">
          <div className="processing-container">
            <div className="splinter-core">
              <div className="core-shard shard-1"></div>
              <div className="core-shard shard-2"></div>
              <div className="core-shard shard-3"></div>
            </div>
            <h2 className="processing-status">{processingStatus}</h2>
            <p className="processing-hint">This may take a moment depending on content length...</p>
            <div className="skeleton-grid">
              {selectedFormats.map(f => (
                <div key={f} className="skeleton-card">
                  <span className="skeleton-icon">{FORMAT_ICONS[f]}</span>
                  <span className="skeleton-label">{FORMAT_LABELS[f]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="splinter-step-3">
          <div className="output-header">
            <h1 className="splinter-title">Your Splinter is Ready ✨</h1>
            <div className="output-actions">
              <button className="secondary-btn" onClick={() => router.push('/dashboard')}>Back to Dashboard</button>
              <button className="primary-btn" onClick={() => { setStep(1); setInputValue(''); setOutputs({}); }}>Create Another</button>
            </div>
          </div>

          <div className="output-workspace">
            <TabGroup
              tabs={selectedFormats.map(f => ({ key: f, label: `${FORMAT_ICONS[f]} ${FORMAT_LABELS[f]}` }))}
              activeTab={activeOutputTab}
              onChange={(k) => setActiveOutputTab(k as OutputFormat)}
            />

            <div className="output-panel">
              <div className="panel-actions">
                <CopyButton text={outputs[activeOutputTab] || ''} />
                {editingFormat === activeOutputTab ? (
                  <>
                    <button className="icon-btn save-btn" onClick={handleSaveEdit}>💾 Save</button>
                    <button className="icon-btn" onClick={handleCancelEdit}>✕ Cancel</button>
                  </>
                ) : (
                  <button className="icon-btn" onClick={() => handleEdit(activeOutputTab)}>✏️ Edit</button>
                )}
                <button className="icon-btn" onClick={() => handleRegenerate(activeOutputTab)}>🔄 Regenerate</button>
              </div>

              {editingFormat === activeOutputTab ? (
                <textarea
                  className="output-editor"
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  rows={15}
                />
              ) : (
                <div className="output-content">
                  <pre>{outputs[activeOutputTab] || 'Content generated successfully.'}</pre>
                </div>
              )}

              <div className="output-footer">
                <span className="word-count">
                  {(outputs[activeOutputTab] || '').split(/\s+/).filter(Boolean).length} words
                  {' · '}
                  {(outputs[activeOutputTab] || '').length} chars
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
