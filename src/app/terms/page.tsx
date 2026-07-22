import React from 'react';
import '../legal.css';
import ScrambleText from '@/components/effects/ScrambleText';

export const metadata = {
  title: 'Terms of Service | Splinter',
  description: 'Terms of Service for Splinter AI Content Repurposer.',
};

export default function TermsPage() {
  return (
    <div className="legal-page">
      <div className="legal-content glass p-8 md:p-12">
        <h1 className="gradient-text"><ScrambleText text="Terms of Service" /></h1>
        <span className="last-updated">Last Updated: October 24, 2023</span>

        <p>
          Welcome to Splinter! These Terms of Service ("Terms") govern your use of the Splinter website, software, and services (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms.
        </p>

        <h2>1. Account Registration</h2>
        <p>
          To use certain features of the Service, you must register for an account. You agree to provide accurate and complete information and to keep this information updated. You are responsible for maintaining the confidentiality of your account credentials.
        </p>

        <h2>2. Usage Restrictions</h2>
        <p>
          You agree not to use the Service to:
        </p>
        <ul>
          <li>Generate content that is illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable.</li>
          <li>Infringe upon any patent, trademark, trade secret, copyright, or other proprietary rights of any party.</li>
          <li>Attempt to reverse engineer, decompile, hack, or otherwise interfere with the underlying technology of the Service.</li>
          <li>Exceed the rate limits or fair usage policies associated with your subscription tier.</li>
        </ul>

        <h2>3. Intellectual Property</h2>
        <p>
          We claim no ownership rights over the original content you submit to Splinter. You retain all rights to your input data. By using the Service, you grant us a temporary license to process your content solely for the purpose of generating the repurposed outputs you request.
        </p>
        <p>
          You own the rights to the AI-generated outputs created through your account, subject to any third-party rights in the input material you provided.
        </p>

        <h2>4. Subscriptions and Payments</h2>
        <p>
          Some features of the Service are billed on a subscription basis. You will be billed in advance on a recurring, periodic basis (e.g., monthly). You may cancel your subscription at any time, but we do not provide refunds for partial months of service.
        </p>

        <h2>5. Disclaimer of Warranties</h2>
        <p>
          The Service is provided "as is" and "as available" without any warranties of any kind. While we strive for high-quality AI generation, we do not guarantee the accuracy, completeness, or suitability of the generated content for any specific purpose. You are solely responsible for reviewing and editing the generated content before publication.
        </p>

        <h2>6. Limitation of Liability</h2>
        <p>
          In no event shall Splinter, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
        </p>

      </div>
    </div>
  );
}
