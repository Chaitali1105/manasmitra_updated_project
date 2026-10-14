import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthGate from "@/components/providers/AuthGate";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Manas Mitra - AI-Based Cognitive Assistance Platform",
  description: "An intelligent cognitive gaming and memory assistance platform designed for elderly individuals with dementia and cognitive impairment.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <AuthGate>{children}</AuthGate>
      </body>
    </html>
  );
}
