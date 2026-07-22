'use client';

import React, { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { Activity } from '@/lib/types';
import SpotlightCard from '@/components/effects/SpotlightCard';

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const token = await user.getIdToken();
        const res = await fetch('/api/activities', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setActivities(data.activities || []);
        }
      } catch (err) {
        console.error('Failed to fetch activities', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'generate': return '✨';
      case 'edit': return '✏️';
      case 'delete': return '🗑️';
      case 'extract': return '🔍';
      default: return '📄';
    }
  };

  if (loading) {
    return (
      <div className="activity-feed-container">
        <h3 className="activity-feed-title">System Activity</h3>
        <div className="activity-list skeleton">Loading...</div>
      </div>
    );
  }

  if (activities.length === 0) return null;

  return (
    <div className="activity-feed-container">
      <h3 className="activity-feed-title">System Activity</h3>
      <div className="activity-list">
        {activities.map((act) => (
          <SpotlightCard key={act.id} className="activity-item">
            <span className="activity-icon">{getIcon(act.type)}</span>
            <div className="activity-details">
              <p className="activity-desc">{act.description}</p>
              <span className="activity-time">
                {new Date(act.created_at).toLocaleString()}
              </span>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
}
