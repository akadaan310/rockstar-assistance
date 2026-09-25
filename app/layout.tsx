import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import VoiceCounterpart from "@/components/VoiceCounterpart";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});
const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rockstar Assistance — A boutique studio for executive leverage",
  description:
    "A small, senior studio of seven to ten operators delivering virtual assistant, executive assistant, and personal assistant support — virtually and on site.",
};

const SITE_MAP = [
  { label: "Services", href: "#services" },
  { label: "How it works", href: "#how-it-works" },
  { label: "The studio", href: "#studio" },
  { label: "Founder", href: "#founder" },
  { label: "Book a call", href: "#contact" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body bg-noir-950">
        {children}
        <VoiceCounterpart
          apiBase={process.env.NEXT_PUBLIC_API_URL}
          clientId="sarah"
          personaName="Sarah"
          greeting="Hey Sarah — I'm here."
          siteMap={SITE_MAP}
        />
      </body>
    </html>
  );
}
