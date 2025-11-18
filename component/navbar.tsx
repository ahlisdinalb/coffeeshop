"use client";

import { useEffect, useState } from "react";

const navItems = [
  { label: "Tentang Kami", href: "#tentang-kami" },
  { label: "Produk yang Dijual", href: "#product" },
  { label: "Lokasi Outlet", href: "#lokasi" },
  { label: "Career", href: "#career" },
  { label: "Footer", href: "#footer" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const textColor = scrolled ? "text-[#3b2315]" : "text-[#fbead2]";
  const hoverColor = scrolled ? "hover:text-[#1a1009]" : "hover:text-white";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-center px-6 py-4">
        <ul
          className={`flex flex-wrap items-center justify-center gap-6 text-[11px] font-semibold uppercase tracking-[0.28em] md:text-xs ${textColor}`}
        >
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={`group relative pb-1 ${hoverColor}`}
              >
                <span>{item.label}</span>
                <span
                  className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-px origin-center scale-x-0 bg-current transition-transform duration-200 ease-out group-hover:scale-x-100"
                  aria-hidden="true"
                />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
