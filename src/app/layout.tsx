import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import "../styles/animations.css";
import Navbar from "../components/Navbar";
import { ToastProvider } from "../components/Toast";
import CustomCursor from "../components/effects/CustomCursor";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });

export const metadata: Metadata = {
  title: "Splinter — AI Content Repurposer",
  description:
    "Turn one piece of content into 10+ platform-optimized formats in seconds. Paste a YouTube URL, blog post, or raw text — Splinter breaks it into tweets, LinkedIn posts, newsletters, SEO articles, video scripts, and more.",
  keywords: [
    "AI content repurposer",
    "content marketing",
    "social media tools",
    "AI writing assistant",
    "content creation",
  ],
  icons: {
    icon: "/favicon.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "Splinter — AI Content Repurposer",
    description:
      "Turn one piece of content into 10+ platform-optimized formats in seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@200,400,700,500,600,300&display=swap" rel="stylesheet" />
      </head>
      <body className={sora.variable}>
        <CustomCursor />
        <ToastProvider>
          <Navbar />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
