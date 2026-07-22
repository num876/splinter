import React from 'react';
import '../legal.css';
import ScrambleText from '@/components/effects/ScrambleText';

export const metadata = {
  title: 'Privacy Policy | Splinter',
  description: 'Privacy Policy for Splinter AI Content Repurposer.',
};

export default function PrivacyPage() {
  return (
    <div className="legal-page">
      <div className="legal-content glass p-8 md:p-12">
        <h1 className="gradient-text"><ScrambleText text="Privacy Policy" /></h1>
        <span className="last-updated">Last Updated: October 24, 2023</span>

        <p>
          At Splinter, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our AI content repurposing services.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We collect information that you provide directly to us when you register for an account, use our services, or communicate with us. This may include:
        </p>
        <ul>
          <li><strong>Personal Information:</strong> Name, email address, and authentication data via Supabase.</li>
          <li><strong>Content Data:</strong> The URLs, transcripts, or raw text you input into Splinter for repurposing.</li>
          <li><strong>Usage Data:</strong> Information about how you interact with our application, including generation history and format preferences.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>
          We use the information we collect primarily to provide, maintain, and improve our services. Specifically, we use it to:
        </p>
        <ul>
          <li>Process and generate AI content based on your inputs.</li>
          <li>Manage your account and subscription tier.</li>
          <li>Send administrative information, such as updates, security alerts, and support messages.</li>
          <li>Improve our AI models and prompt engineering (Note: We do not use your private content to train public foundational models).</li>
        </ul>

        <h2>3. Data Sharing & Third Parties</h2>
        <p>
          We do not sell your personal information. We may share your data with third-party service providers that perform services for us or on our behalf:
        </p>
        <ul>
          <li><strong>Google Gemini:</strong> We use Google's Gemini API to process your text. Data sent via the API is subject to Google's enterprise privacy terms and is not used to train their public models.</li>
          <li><strong>Supabase:</strong> Used for secure user authentication and database hosting.</li>
        </ul>

        <h2>4. Data Security</h2>
        <p>
          We implement commercially reasonable technical and organizational measures to protect your personal information against accidental or unlawful destruction, loss, change, or unauthorized disclosure.
        </p>

        <h2>5. Your Rights</h2>
        <p>
          Depending on your location, you may have the right to access, correct, or delete your personal data. You can manage your data directly from your account settings or contact us at privacy@splinter.ai.
        </p>
      </div>
    </div>
  );
}
