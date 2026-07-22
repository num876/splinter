'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import TabGroup from '@/components/TabGroup';
import CopyButton from '@/components/CopyButton';
import { OutputFormat, FORMAT_LABELS, FORMAT_ICONS, Project, Output } from '@/lib/types';
import { auth } from '@/lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import '../splinter.css';

export default function SplinterViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [outputs, setOutputs] = useState<Output[]>([]);
  const [activeOutputTab, setActiveOutputTab] = useState<OutputFormat>('twitter_thread');
  const [loading, setLoading] = useState(true);
  const [editingFormat, setEditingFormat] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    async function loadProject(user: any) {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const token = await user.getIdToken();
        const headers: Record<string, string> = { 'Authorization': `Bearer ${token}` };
        const res = await fetch(`/api/projects/${id}`, { headers });
        
        if (res.ok) {
          const data = await res.json();
          setProject(data);
          setOutputs(data.outputs || []);
          if (data.outputs?.length > 0) {
            setActiveOutputTab(data.outputs[0].format);
          }
        }
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    }
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      loadProject(user);
    });
    
    return () => unsubscribe();
  }, [id]);

  const activeOutput = outputs.find(o => o.format === activeOutputTab);

  const handleEdit = () => {
    if (activeOutput) {
      setEditingFormat(activeOutputTab);
      setEditContent(activeOutput.content);
    }
  };

  const handleSaveEdit = async () => {
    if (editingFormat) {
      try {
        const token = await auth.currentUser?.getIdToken();
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`/api/projects/${id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({
            format: editingFormat,
            content: editContent
          })
        });

        if (res.ok) {
          setOutputs(prev =>
            prev.map(o => o.format === editingFormat ? { ...o, content: editContent, is_edited: true } : o)
          );
          setEditingFormat(null);
        } else {
          console.error("Failed to save edit");
        }
      } catch (err) {
        console.error("Error saving edit", err);
      }
    }
  };

  const handleDelete = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch(`/api/projects/${id}`, { method: 'DELETE', headers });
      router.push('/dashboard');
    } catch {
      // handle error
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  if (loading) {
    return (
      <div className="splinter-page">
        <div className="processing-container">
          <div className="processing-spinner">⚡</div>
          <h2 className="processing-status">Loading Splinter...</h2>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="splinter-page">
        <div className="processing-container">
          <h2 className="processing-status">Splinter not found</h2>
          <button className="primary-btn" onClick={() => router.push('/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const availableFormats = outputs.map(o => o.format);

  return (
    <div className="splinter-page">
      <div className="splinter-step-3">
        <div className="output-header">
          <div>
            <h1 className="splinter-title">{project.title}</h1>
            <p className="meta-info">
              Created {formatDate(project.created_at)} · From {project.source_type}
              {project.source_url && (
                <> · <a href={project.source_url} target="_blank" rel="noopener noreferrer" className="source-link">View source ↗</a></>
              )}
            </p>
          </div>
          <div className="output-actions">
            {showDeleteConfirm ? (
              <>
                <span className="delete-confirm-text">Are you sure?</span>
                <button className="danger-btn" onClick={handleDelete}>Yes, Delete</button>
                <button className="secondary-btn" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              </>
            ) : (
              <button className="danger-btn" onClick={() => setShowDeleteConfirm(true)}>🗑️ Delete</button>
            )}
            <button className="secondary-btn" onClick={() => router.push('/dashboard')}>Back to Dashboard</button>
          </div>
        </div>

        <div className="output-workspace">
          <TabGroup
            tabs={availableFormats.map(f => ({ key: f, label: `${FORMAT_ICONS[f]} ${FORMAT_LABELS[f]}` }))}
            activeTab={activeOutputTab}
            onChange={(k) => setActiveOutputTab(k as OutputFormat)}
          />

          <div className="output-panel">
            <div className="panel-actions">
              <CopyButton text={activeOutput?.content || ''} />
              {editingFormat === activeOutputTab ? (
                <>
                  <button className="icon-btn save-btn" onClick={handleSaveEdit}>💾 Save</button>
                  <button className="icon-btn" onClick={() => setEditingFormat(null)}>✕ Cancel</button>
                </>
              ) : (
                <button className="icon-btn" onClick={handleEdit}>✏️ Edit</button>
              )}
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
                <pre>{activeOutput?.content || 'No content available.'}</pre>
              </div>
            )}

            <div className="output-footer">
              <span className="word-count">
                {(activeOutput?.content || '').split(/\s+/).filter(Boolean).length} words
                {' · '}
                {(activeOutput?.content || '').length} chars
                {activeOutput?.is_edited && ' · Edited'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
