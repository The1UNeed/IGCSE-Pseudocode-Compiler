import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IGCSE Pseudocode Compiler Lab",
  description: "Web-based strict IGCSE pseudocode compiler and editor with Python execution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
