import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ROI Calculator | Pivot",
  description:
    "See how much your organization can save with Pivot's Source-to-Pay platform. Enter your procurement metrics and get instant ROI projections.",
  icons: {
    icon: "https://cdn.prod.website-files.com/6570f57491b201376af7c05a/6579054da6ee3f5c135cfbf7_Favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen flex flex-col font-sans">{children}</body>
    </html>
  );
}
