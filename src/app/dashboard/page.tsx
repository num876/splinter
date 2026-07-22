'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FormatBadge from '@/components/FormatBadge';
import { Project, Output } from '@/lib/types';
import { auth } from '@/lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import './dashboard.css';
import MagneticButton from '@/components/effects/MagneticButton';
import SpotlightCard from '@/components/effects/SpotlightCard';
import ScrollReveal from '@/components/effects/ScrollReveal';
import AnimatedCounter from '@/components/effects/AnimatedCounter';
import ActivityFeed from '@/components/dashboard/ActivityFeed';

type ProjectWithOutputs = Project & {
  outputs?: Output[];
};

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectWithOutputs[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [usage, setUsage] = useState({ used: 0, limit: 5 });
  const [userName, setUserName] = useState('');

  useEffect(() => {
    async function fetchProjects(user: any) {
      if (!user) {
        setLoading(false);
        return;
      }
      setUserName(user.displayName || user.email?.split('@')[0] || 'there');
      try {
        const token = await user.getIdToken();
        const headers: Record<string, string> = { 'Authorization': `Bearer ${token}` };

        const res = await fetch('/api/projects', { headers });
        if (res.ok) {
          const data = await res.json();
          setProjects(data.projects || []);
          if (data.usage) {
            setUsage(data.usage);
          }
        }
      } catch {
        // Fallback or error handled silently
      } finally {
        setLoading(false);
      }
    }
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      fetchProjects(user);
    });

    return () => unsubscribe();
  }, []);

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const sourceTypeLabel = (type: string) => {
    switch (type) {
      case 'youtube': return '🎬 YouTube';
      case 'blog': return '🔗 Blog';
      case 'text': return '📝 Text';
      default: return '📄 Content';
    }
  };

  // Analytics
  const totalOutputs = projects.reduce((acc, p) => acc + (p.outputs?.length || 0), 0);
  const hoursSaved = totalOutputs * 1.5;

  // Usage ring calculations
  const usagePercent = usage.limit > 0 ? Math.min(usage.used / usage.limit, 1) : 0;
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - usagePercent * circumference;

  return (
    <div className="dashboard-container">
      {/* Floating orb */}
      <div className="dashboard-orb" />

      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-title">{getGreeting()}, {userName}</h1>
          <p className="dashboard-subtitle">Here&apos;s what&apos;s happening with your content.</p>
        </div>
        <MagneticButton href="/splinter/new" className="new-splinter-btn">
          ✨ New Splinter
        </MagneticButton>
      </header>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link href="/splinter/new?source=text" className="quick-action-pill">
          <span className="pill-icon">📋</span> Paste Text
        </Link>
        <Link href="/splinter/new?source=url" className="quick-action-pill">
          <span className="pill-icon">🔗</span> From URL
        </Link>
        <Link href="/splinter/new?source=youtube" className="quick-action-pill">
          <span className="pill-icon">🎬</span> YouTube
        </Link>
      </div>

      {/* Analytics Row */}
      <ScrollReveal delay={100}>
        <div className="analytics-row">
          <SpotlightCard className="metric-card glass-border-glow">
            <div className="metric-icon">🚀</div>
            <div className="metric-info">
              <div className="metric-value">
                <AnimatedCounter value={projects.length} />
              </div>
              <div className="metric-label">Total Splinters</div>
              <div className="metric-trend up">↑ New this week</div>
            </div>
          </SpotlightCard>
          
          <SpotlightCard className="metric-card glass-border-glow">
            <div className="metric-icon">⏱️</div>
            <div className="metric-info">
              <div className="metric-value">
                <AnimatedCounter value={hoursSaved} decimals={1} suffix="h" />
              </div>
              <div className="metric-label">Time Saved</div>
              <div className="metric-trend up">↑ 1.5h per output</div>
            </div>
          </SpotlightCard>

          <SpotlightCard className="metric-card glass-border-glow">
            <div className="metric-icon">📄</div>
            <div className="metric-info">
              <div className="metric-value">
                <AnimatedCounter value={totalOutputs} />
              </div>
              <div className="metric-label">Outputs Generated</div>
              <div className="metric-trend flat">— all time</div>
            </div>
          </SpotlightCard>

          <SpotlightCard className="usage-card glass-border-glow">
            <div className="usage-ring-wrapper">
              <svg width="64" height="64" viewBox="0 0 64 64">
                <defs>
                  <linearGradient id="usageGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                <circle className="usage-ring-bg" cx="32" cy="32" r={radius} />
                <circle
                  className="usage-ring-fill"
                  cx="32" cy="32" r={radius}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
              <div className="usage-ring-center">
                {Math.round(usagePercent * 100)}%
              </div>
            </div>
            <div className="usage-info">
              <div className="usage-title">Monthly Usage</div>
              <div className={`usage-fraction ${usagePercent >= 0.8 ? 'warning' : ''}`}>
                {usage.used} / {usage.limit}
              </div>
              <div className="usage-sublabel">splinters this month</div>
            </div>
          </SpotlightCard>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={200}>
        <div className="section-title-bar">
          <h2>Recent Splinters</h2>
          <div className="search-bar-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </ScrollReveal>

      {loading ? (
        <div className="dashboard-grid">
          {[1, 2, 3].map(i => (
            <div key={i} className="project-card skeleton" />
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="dashboard-grid">
          {filteredProjects.map((project, i) => (
            <ScrollReveal key={project.id} delay={i * 50}>
              <SpotlightCard
                className="project-card interactive"
                onClick={() => router.push(`/splinter/${project.id}`)}
              >
                <div className="project-card-content">
                  <div className="card-header">
                    <span className="source-badge">
                      {sourceTypeLabel(project.source_type)}
                    </span>
                    <span className="date-text">{formatRelativeDate(project.created_at)}</span>
                  </div>
                  <h3 className="card-title">{project.title}</h3>
                  <div className="card-status">
                    <span className={`status-dot ${project.status}`} />
                    <span className="status-text">{project.status}</span>
                  </div>
                  <div className="card-footer-row">
                    {project.outputs && project.outputs.length > 0 ? (
                      <div className="card-formats">
                        {project.outputs.map(o => (
                          <FormatBadge key={o.format} format={o.format} />
                        ))}
                      </div>
                    ) : <div />}
                    {project.outputs && project.outputs.length > 0 && (
                      <span className="output-count-chip">
                        {project.outputs.length} output{project.outputs.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div className="card-hover-bar">
                    <span>View Splinter →</span>
                  </div>
                </div>
              </SpotlightCard>
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <ScrollReveal delay={300}>
          <div className="premium-empty-state">
            <div className="empty-icon-wrapper">
              <div className="empty-icon-pulse"></div>
              <div className="empty-icon">✨</div>
            </div>
            <h2>Your Content Empire Awaits</h2>
            <p>You haven&apos;t created any Splinters yet. Paste a link to a YouTube video or blog post to instantly generate a month&apos;s worth of content.</p>
            <MagneticButton href="/splinter/new" className="splinter-btn splinter-btn--primary">
              Create your first Splinter
            </MagneticButton>
          </div>
        </ScrollReveal>
      )}

      <ScrollReveal delay={400}>
        <ActivityFeed />
      </ScrollReveal>
    </div>
  );
}
