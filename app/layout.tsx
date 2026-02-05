import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Angi - Your AI Agent Army Awaits",
  description: "100+ specialized AI agents working 24/7 for your success. Command your personal team of AI specialists.",
  keywords: ["AI", "agents", "productivity", "automation", "team", "Jarvis", "AI assistants"],
  openGraph: {
    title: "Angi - Your AI Agent Army Awaits",
    description: "100+ specialized AI agents working 24/7 for your success.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
