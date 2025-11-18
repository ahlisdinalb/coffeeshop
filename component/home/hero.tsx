// components/home/hero.tsx
"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent } from "react";

type Pose = "center" | "left" | "right";

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [charX, setCharX] = useState(0);
  const [pose, setPose] = useState<Pose>("center");

  const lastMouseXRef = useRef<number | null>(null);
  const idleTimeoutRef = useRef<number | null>(null);

  // Ukuran karakter (silakan sesuaikan dengan PNG-mu)
  const CHAR_WIDTH = 720;
  const CHAR_HEIGHT = 1150;

  // Posisi awal karakter: tengah layar
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const initialX = (rect.width - CHAR_WIDTH) / 2;
    setCharX(initialX);
  }, []);

  // Bersihin timeout kalau komponen di-unmount
  useEffect(() => {
    return () => {
      if (idleTimeoutRef.current !== null) {
        window.clearTimeout(idleTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const relativeX = event.clientX - rect.left;

    // Posisikan karakter mengikuti cursor (tapi tetap di-clamp)
    const centeredX = relativeX - CHAR_WIDTH / 2;
    const minX = 0;
    const maxX = rect.width - CHAR_WIDTH;
    const clampedX = Math.min(Math.max(centeredX, minX), maxX);
    setCharX(clampedX);

    // Deteksi arah gerak cursor
    const currentX = event.clientX;
    const lastX = lastMouseXRef.current;
    const threshold = 4; // biar nggak terlalu sensitif

    if (lastX !== null) {
      const delta = currentX - lastX;
      if (Math.abs(delta) > threshold) {
        if (delta > 0) {
          setPose("right"); // gerak ke kanan
        } else {
          setPose("left"); // gerak ke kiri
        }
      }
    }
    lastMouseXRef.current = currentX;

    // Kalau berhenti gerak → balik ke tengah setelah 0.5s
    if (idleTimeoutRef.current !== null) {
      window.clearTimeout(idleTimeoutRef.current);
    }
    idleTimeoutRef.current = window.setTimeout(() => {
      setPose("center");
    }, 500);
  };

  const handleMouseLeave = () => {
    setPose("center");
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background dinding */}
      <Image
        src="/home/hero/dinding1.png"
        alt="Ritual Café wall"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* Karakter — di belakang meja (z-10), nempel bawah, ikut cursor */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 z-10 will-change-transform transition-transform duration-150 ease-out"
        style={{ transform: `translateX(${charX}px)` }}
      >
        <div
          className="relative"
          style={{ width: CHAR_WIDTH, height: CHAR_HEIGHT }}
        >
          {/* Pose DIAM (tengah) */}
          <Image
            src="/home/hero/orangtengah.png"
            alt="Kasir Ritual Café (tengah)"
            fill
            priority
            draggable={false}
            className={`select-none object-contain absolute inset-0 ${
              pose === "center" ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Pose menghadap KANAN */}
          <Image
            src="/home/hero/orangkanan.png"
            alt="Kasir Ritual Café (menghadap kanan)"
            fill
            priority
            draggable={false}
            className={`select-none object-contain absolute inset-0 ${
              pose === "right" ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Pose menghadap KIRI */}
          <Image
            src="/home/hero/orangkiri.png"
            alt="Kasir Ritual Café (menghadap kiri)"
            fill
            priority
            draggable={false}
            className={`select-none object-contain absolute inset-0 ${
              pose === "left" ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </div>

      {/* Meja paling depan, mentok bawah section */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-20 w-full">
        <Image
          src="/home/hero/meja10.png"
          alt="Meja kasir Ritual Café"
          width={1920}     // ⚠️ sesuaikan dengan ukuran asli PNG kalau perlu
          height={500}
          priority
          draggable={false}
          className="w-full h-auto object-cover"
        />
      </div>
    </section>
  );
}
