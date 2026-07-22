"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import "./landing.css";
import ScrollReveal from "../components/effects/ScrollReveal";
import MagneticButton from "../components/effects/MagneticButton";
import ScrambleText from "../components/effects/ScrambleText";
import InteractiveCard from "../components/effects/InteractiveCard";
import SpotlightCard from "../components/effects/SpotlightCard";
import ParticleBackground from "../components/effects/ParticleBackground";
import TypewriterText from "../components/effects/TypewriterText";

const formats = [
  {
    id: "twitter",
    name: "Twitter Thread",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    preview: "🧵 1/ Just discovered the secret to 10x content output...\n\nI used to spend 5 hours a week repurposing my blog posts.\n\nNow it takes me 5 seconds.\n\nHere is how I do it 👇"
  },
  {
    id: "linkedin",
    name: "LinkedIn Post",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>,
    preview: "Stop wasting time writing the same content 5 times.\n\nYesterday, I took one blog post and turned it into:\n• A Twitter thread\n• A LinkedIn post\n• A newsletter\n• A YouTube script\n\nThe secret? AI content repurposing.\n\nWork smarter, not harder. 🚀"
  },
  {
    id: "newsletter",
    name: "Newsletter",
    icon: "✉️",
    preview: "Subject: How I scaled my content output 🚀\n\nHey friends,\n\nHave you ever spent hours writing a great article, only for it to get 10 views?\n\nThe solution isn't writing better. It's distributing better.\n\nIn today's issue, I'll show you how to take one core idea and multiply it..."
  },
  {
    id: "seo",
    name: "SEO Blog",
    icon: "📝",
    preview: "# The Ultimate Guide to Content Repurposing\n\n## Introduction\nIn today's fast-paced digital world, content is king. But creating original content for every single platform is a fast track to burnout.\n\n## Why Repurpose?\nRepurposing allows you to reach different audiences where they hang out..."
  },
  {
    id: "video",
    name: "Video Script",
    icon: "🎬",
    preview: "[SCENE START]\n\nHOOK: Ever feel like you're on an endless content hamster wheel? \n\n[Cut to: Frustrated creator staring at screen]\n\nINTRO: What if I told you that one video could be your entire week's worth of content? \n\n[Text on screen: The 1-to-10 Strategy]"
  },
  {
    id: "instagram",
    name: "IG Caption",
    icon: "📸",
    preview: "Work smarter, not harder 🧠✨\n\nTurning one piece of content into 10 formats changed the game for me.\n\nDrop a 🚀 in the comments if you're ready to scale your content!\n\n#ContentCreator #MarketingTips #Productivity"
  }
];

const faqs = [
  { question: "Do I need to know prompt engineering?", answer: "Not at all. Splinter has complex, highly-optimized prompts built into its core engine. Just paste your link, select your tone, and hit generate." },
  { question: "Can I use this for my YouTube videos?", answer: "Yes! Paste any YouTube URL and Splinter will automatically extract the transcript, clean it up, and repurpose the knowledge into any format." },
  { question: "What platforms do you support?", answer: "Currently, we support Twitter Threads, LinkedIn Posts, SEO Blogs, Newsletters, Video Scripts, and Instagram Captions. Custom format definitions are coming soon to the Pro plan." },
  { question: "Is there a free trial?", answer: "Yes, you get 5 free splinters every month on our Free plan. No credit card is required to sign up." }
];

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        {question}
        <span className="faq-icon">▼</span>
      </button>
      <div className="faq-answer">{answer}</div>
    </div>
  );
}

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [isAnnual, setIsAnnual] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % formats.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [timerKey]);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    setTimerKey(prev => prev + 1);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formats[activeTab].preview);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg"></div>
        <ParticleBackground />
        
        {/* Floating Ethereal Mockups */}
        <div className="floating-mockup mockup-twitter glass-strong">
          <div className="mockup-header"><span className="emoji"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></span> Twitter</div>
          <div className="mockup-body">🧵 1/ Just discovered the secret to 10x content output...</div>
        </div>
        <div className="floating-mockup mockup-linkedin glass-strong">
          <div className="mockup-header"><span className="emoji"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></span> LinkedIn</div>
          <div className="mockup-body">Stop wasting time writing the same content 5 times. Yesterday...</div>
        </div>
        <div className="floating-mockup mockup-video glass-strong">
          <div className="mockup-header"><span className="emoji">🎬</span> Video Script</div>
          <div className="mockup-body">[HOOK]: Ever feel like you're on an endless content hamster wheel?</div>
        </div>
        <div className="floating-mockup mockup-newsletter glass-strong">
          <div className="mockup-header"><span className="emoji">✉️</span> Newsletter</div>
          <div className="mockup-body">Subject: How I scaled my content 🚀<br/><br/>Hey friends...</div>
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text animate-fade-in-up" style={{ display: 'inline-block', animationDelay: '0.1s', opacity: 0 }}>
              <ScrambleText text="One Piece of Content." />
            </span>
            <br />
            <span className="animate-fade-in-up" style={{ display: 'inline-block', animationDelay: '0.3s', opacity: 0 }}>
              <ScrambleText text="Every Platform. Instantly." />
            </span>
          </h1>
          <p className="hero-subtitle animate-fade-in-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
            Turn your YouTube videos, blog posts, or raw text into 10+ optimized formats in seconds with AI. Stop rewriting. Start scaling.
          </p>
          <div className="hero-cta animate-fade-in-up" style={{ animationDelay: '0.7s', opacity: 0 }}>
            <div className="email-input-group">
              <input type="email" placeholder="Enter your email" className="email-input" />
              <MagneticButton href="/auth/signup" className="splinter-btn splinter-btn--primary splinter-btn--lg">Start Splintering</MagneticButton>
            </div>
            <p className="hero-note">Join the creators turning 1 idea into 100. · No credit card required.</p>
          </div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <ScrollReveal delay={100}>
        <section className="bento-section">
          <div className="section-header">
            <h2><ScrambleText text="The Ultimate " /><span className="gradient-text"><ScrambleText text="Unfair Advantage" /></span></h2>
            <p>Engineered for scale. Built for speed.</p>
          </div>
          <div className="bento-grid">
            <SpotlightCard className="bento-item large card-brain">
              <h3>Context-Aware AI</h3>
              <p>Splinter doesn't just summarize. It understands the core message, tone, and nuance of your original content and preserves it across every new format.</p>
            </SpotlightCard>
            <SpotlightCard className="bento-item card-prism">
              <h3>10x Faster</h3>
              <p>Turn a 2-hour writing task into a 5-second generation.</p>
            </SpotlightCard>
            <SpotlightCard className="bento-item tall card-waves">
              <h3>Perfect Tone</h3>
              <p>Choose from Professional, Casual, Witty, or Inspirational. Splinter nails the voice every time.</p>
            </SpotlightCard>
            <SpotlightCard className="bento-item card-loop">
              <h3>Infinite Loop</h3>
              <p>Turn 1 blog into a video, turn that video into 5 tweets.</p>
            </SpotlightCard>
          </div>
        </section>
      </ScrollReveal>

      {/* How It Works Section */}
      <ScrollReveal delay={100}>
        <section id="how-it-works" className="how-it-works">
          <div className="section-header">
            <h2><ScrambleText text="How " /><span className="gradient-text"><ScrambleText text="Splinter" /></span><ScrambleText text=" Works" /></h2>
            <p>From one link to a month of content in 3 simple steps.</p>
          </div>
          
          <div className="steps-container">
            <ScrollReveal delay={100} className="step-wrapper">
              <InteractiveCard className="step-card glass-border-glow">
                <div className="step-icon">🔗</div>
                <h3>1. Paste</h3>
                <p>Drop a YouTube URL, blog link, or paste raw text.</p>
              </InteractiveCard>
            </ScrollReveal>
            <div className="step-connector"></div>
            <ScrollReveal delay={300} className="step-wrapper">
              <InteractiveCard className="step-card glass-border-glow">
                <div className="step-icon">✨</div>
                <h3>2. Splinter</h3>
                <p>AI analyzes your content and adapts it for each platform perfectly.</p>
              </InteractiveCard>
            </ScrollReveal>
            <div className="step-connector"></div>
            <ScrollReveal delay={500} className="step-wrapper">
              <InteractiveCard className="step-card glass-border-glow">
                <div className="step-icon">🚀</div>
                <h3>3. Publish</h3>
                <p>Copy your platform-ready content with a single click.</p>
              </InteractiveCard>
            </ScrollReveal>
          </div>
        </section>
      </ScrollReveal>

      {/* Output Format Showcase */}
      <ScrollReveal delay={100}>
        <section className="showcase">
          <div className="section-header">
            <h2><ScrambleText text="Tailored for Every Platform" /></h2>
            <p>Not just copy-paste. Perfectly optimized formats and tones.</p>
          </div>
          
          <div className="showcase-container">
            <div className="tabs-list">
              {formats.map((format, index) => (
                <button
                  key={format.id}
                  className={`tab-btn ${activeTab === index ? "active" : ""}`}
                  onClick={() => handleTabClick(index)}
                >
                  <span className="tab-icon">{format.icon}</span>
                  <span className="tab-name">{format.name}</span>
                  {activeTab === index && <div className="tab-progress"></div>}
                </button>
              ))}
            </div>
            
            <div className="tab-content-wrapper">
              {formats.map((format, index) => (
                <div 
                  key={format.id} 
                  className={`tab-content ${activeTab === index ? "active" : ""}`}
                >
                  <div className="preview-card glass">
                    <div className="preview-header">
                      <span className="preview-icon">{format.icon}</span>
                      <h4>{format.name} Preview</h4>
                    </div>
                    <pre className="preview-text">
                      {activeTab === index ? (
                        <TypewriterText text={format.preview} speed={15} />
                      ) : format.preview}
                    </pre>
                    <button className="copy-btn" onClick={handleCopy}>
                      {copied ? "Copied!" : "Copy to Clipboard"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Pricing Section */}
      <ScrollReveal delay={100}>
        <section id="pricing" className="pricing">
          <div className="section-header">
            <h2><ScrambleText text="Scale Your " /><span className="gradient-text"><ScrambleText text="Empire." /></span></h2>
            <p>Stop trading hours for posts. Pick your plan.</p>
            
            <div className="pricing-toggle-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
              <span style={{ color: !isAnnual ? 'white' : 'rgba(255,255,255,0.5)' }}>Monthly</span>
              <div 
                className={`toggle-switch ${isAnnual ? 'active' : ''}`}
                onClick={() => setIsAnnual(!isAnnual)}
                style={{
                  width: '60px', height: '32px', background: 'rgba(255,255,255,0.1)', borderRadius: '16px', position: 'relative', cursor: 'pointer', transition: '0.3s'
                }}
              >
                <div style={{
                  position: 'absolute', top: '4px', left: isAnnual ? '32px' : '4px', width: '24px', height: '24px', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', borderRadius: '50%', transition: '0.3s'
                }} />
              </div>
              <span style={{ color: isAnnual ? 'white' : 'rgba(255,255,255,0.5)' }}>Annually <span style={{ color: '#22c55e', fontSize: '0.8rem', marginLeft: '4px' }}>Save 20%</span></span>
            </div>
          </div>
          
          <div className="pricing-grid">
            <SpotlightCard className="price-card glass-border-glow">
              <h3>Free</h3>
              <div className="price"><span>$</span>0<span>/mo</span></div>
              <ul className="features-list">
                <li>✔️ 5 splinters/mo</li>
                <li>✔️ 3 platforms</li>
                <li>✔️ Professional tone</li>
                <li>✔️ 7-day history</li>
              </ul>
              <MagneticButton href="/auth/signup" className="splinter-btn splinter-btn--ghost splinter-btn--full">Start Free</MagneticButton>
            </SpotlightCard>
            
            <SpotlightCard className="price-card popular glass-border-glow">
              <div className="popular-badge">POPULAR</div>
              <h3>Starter</h3>
              <div className="price">
                <span>$</span>{isAnnual ? '24' : '29'}<span>/mo</span>
                {isAnnual && <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 'normal', marginTop: '4px' }}>Billed $288 yearly</div>}
              </div>
              <ul className="features-list">
                <li>✔️ 50 splinters/mo</li>
                <li>✔️ All 6 platforms</li>
                <li>✔️ All tones</li>
                <li>✔️ 90-day history</li>
              </ul>
              <MagneticButton href="/auth/signup?plan=starter" className="splinter-btn splinter-btn--primary splinter-btn--full">Get Starter</MagneticButton>
            </SpotlightCard>
            
            <SpotlightCard className="price-card glass-border-glow">
              <h3>Pro</h3>
              <div className="price">
                <span>$</span>{isAnnual ? '64' : '79'}<span>/mo</span>
                {isAnnual && <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 'normal', marginTop: '4px' }}>Billed $768 yearly</div>}
              </div>
              <ul className="features-list">
                <li>✔️ Unlimited splinters</li>
                <li>✔️ Custom platforms & tones</li>
                <li>✔️ Forever history</li>
                <li>✔️ Team access (up to 5)</li>
              </ul>
              <MagneticButton href="/auth/signup?plan=pro" className="splinter-btn splinter-btn--ghost splinter-btn--full">Go Pro</MagneticButton>
            </SpotlightCard>
          </div>
          <p className="pricing-note">Payments coming soon — enjoy free access during beta!</p>
        </section>
      </ScrollReveal>

      {/* About Us Section */}
      <ScrollReveal delay={100}>
        <section id="about" className="about-section">
          <div className="about-container">
            <div className="about-content">
              <h2><ScrambleText text="Built by Creators," /> <br/><span className="gradient-text"><ScrambleText text="For Creators." /></span></h2>
              <p className="about-lead">
                We were exhausted. Every week we spent 20 hours filming a podcast, and another 20 hours manually chopping it up into tweets, articles, and newsletters.
              </p>
              <p>
                We realized that distribution is just as important as creation, but it shouldn't take the same amount of time. Splinter was born out of our own necessity to scale our reach without burning out. Our mission is to give every creator the unfair advantage of an entire content team, powered by a single AI agent.
              </p>
              <div className="about-stats">
                <div className="stat-box">
                  <div className="stat-number">2M+</div>
                  <div className="stat-label">Words Generated</div>
                </div>
                <div className="stat-box">
                  <div className="stat-number">10k+</div>
                  <div className="stat-label">Hours Saved</div>
                </div>
                <div className="stat-box">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">AI Agent Uptime</div>
                </div>
              </div>
            </div>
            <div className="about-visual">
              <SpotlightCard className="about-card glass-strong">
                <div className="about-card-inner">
                  <div className="founder-avatar"></div>
                  <h3>The Splinter Team</h3>
                  <p>Building the future of content distribution.</p>
                  <div className="about-signature">Join the revolution.</div>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* FAQ Section */}
      <ScrollReveal delay={100}>
        <section className="faq-section">
          <div className="section-header">
            <h2><ScrambleText text="Frequently Asked Questions" /></h2>
            <p>Everything you need to know about Splinter.</p>
          </div>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Mega Footer */}
      <footer className="mega-footer">
        <div className="mega-footer-grid">
          <div className="footer-col">
            <div className="logo" style={{ marginBottom: '16px' }}>
              <img src="/logo.jpg" alt="Splinter" style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover' }} />
              <span className="logo-text gradient-text" style={{ fontSize: '1.5rem', fontWeight: 800 }}>Splinter</span>
            </div>
            <p>The AI Content Repurposer.<br/>Turn one piece of content into a month of posts instantly.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Join our newsletter" />
              <MagneticButton className="splinter-btn splinter-btn--primary splinter-btn--sm">Subscribe</MagneticButton>
            </div>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <a href="#">Features</a>
            <a href="#">Pricing</a>
            <a href="#">Changelog</a>
            <a href="#">Integrations</a>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <a href="#">Blog</a>
            <a href="#">Help Center</a>
            <a href="#">API Documentation</a>
            <a href="#">Community</a>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Splinter. Built with Next.js and Gemini 2.0.</p>
        </div>
      </footer>
    </div>
  );
}
