import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FeedPulse - Product Feedback Platform",
  description: "Submit and track product feedback with AI-powered analysis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}