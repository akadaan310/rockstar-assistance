"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { label: "Services", href: "#services" },
  { label: "How it works", href: "#how-it-works" },
  { label: "The studio", href: "#studio" },
  { label: "Founder", href: "#founder" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled ? "bg-noir-950/92 shadow-lg backdrop-blur" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gild-500/60 bg-noir-800 font-display text-sm font-semibold gild-text">
            R
          </span>
          <span className="font-display text-lg tracking-wide text-candle">
            Rockstar <span className="gild-text emboss">Assistance</span>
          </span>
        </a>
        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-candle/75 transition-colors hover:text-gild-300">
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-full bg-gild-500 px-5 py-2.5 text-sm font-semibold text-noir-950 transition-colors hover:bg-gild-400"
          >
            Book a call
          </a>
        </div>
        <a
          href="#contact"
          className="rounded-full bg-gild-500 px-4 py-2 text-sm font-semibold text-noir-950 md:hidden"
        >
          Book a call
        </a>
      </nav>
    </header>
  );
}
