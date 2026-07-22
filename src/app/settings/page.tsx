import React from 'react';
import './settings.css';

export default function SettingsPage() {
  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>
      
      <div className="settings-section">
        <h2>Profile</h2>
        <div className="settings-card">
          <div className="field-group">
            <label>Name</label>
            <input type="text" value="Jane Doe" readOnly className="read-only-input" />
          </div>
          <div className="field-group">
            <label>Email</label>
            <input type="text" value="jane@example.com" readOnly className="read-only-input" />
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h2>Subscription</h2>
        <div className="settings-card plan-card">
          <div className="plan-info">
            <h3>Free Plan</h3>
            <p>10 splinters per month</p>
          </div>
          <button className="upgrade-btn">Upgrade to Pro</button>
        </div>
      </div>

      <div className="settings-section danger-zone">
        <h2>Danger Zone</h2>
        <div className="settings-card danger-card">
          <p>Once you delete your account, there is no going back. Please be certain.</p>
          <button className="delete-btn">Delete Account</button>
        </div>
      </div>
    </div>
  );
}
