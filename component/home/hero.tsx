// components/home/hero.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";

type Pose = "center" | "left" | "right";

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [charX, setCharX] = useState(0);
  const [pose, setPose] = useState<Pose>("center");
  const [showCourier, setShowCourier] = useState(false);

  const lastMouseXRef = useRef<number | null>(null);
  const idleTimeoutRef = useRef<number | null>(null);

  // Ukuran karakter yang lebih kecil dan proporsional
  const CHAR_WIDTH = 380;
  const CHAR_HEIGHT = 600;

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
    const threshold = 4;

    if (lastX !== null) {
      const delta = currentX - lastX;
      if (Math.abs(delta) > threshold) {
        if (delta > 0) {
          setPose("right");
        } else {
          setPose("left");
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

  // Function untuk scroll smooth ke section produk
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden leading-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background dinding */}
      <Image
        src="/home/hero/backdrop.png"
        alt="Ritual Café wall"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* PAPAN MENU - Clickable area */}
      <button
        onClick={scrollToProducts}
        className="absolute left-[15.4%] top-[11.2%] z-30 cursor-pointer transition-transform hover:scale-105 active:scale-95"
        aria-label="Lihat menu produk"
      >
        {/* Ini adalah area papan menu - sesuaikan posisi dengan papan menu asli */}
        <div className="relative h-[115px] w-[410px]">
          {/* Border putih dengan overlay subtle saat hover */}
          <div className="absolute inset-0 rounded-lg border-2 border-white/0 bg-white/0 transition-all hover:border-white/80 hover:bg-white/10" />
        </div>
      </button>

      {/* PAPAN ORDER NOW - Clickable area */}
      <button
        onClick={scrollToProducts}
        onMouseEnter={() => setShowCourier(true)}
        onMouseLeave={() => setShowCourier(false)}
        className="absolute right-[6.7%] top-[26%] z-30 cursor-pointer transition-transform hover:scale-105 active:scale-95"
        aria-label="Order sekarang"
      >
        {/* Area papan ORDER NOW */}
        <div className="relative h-[80px] w-[140px]">
          {/* Border putih dengan overlay subtle saat hover */}
          <div className="absolute inset-0 rounded-lg border-2 border-white/0 bg-white/0 transition-all hover:border-white/80 hover:bg-white/10" />
        </div>
      </button>

      {/* Kurir - muncul dari kanan bawah saat hover ORDER NOW */}
      <div
        className={`pointer-events-none absolute bottom-[-85px] right-[-100] z-30 transition-all duration-500 ease-out ${
          showCourier ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
        style={{ 
          width: 380,
          height: 600
        }}
      >
        <div className="relative h-full w-full">
          <Image
            src="/home/hero/kurir.png"
            alt="Kurir Ritual Café"
            fill
            draggable={false}
            className="select-none object-contain"
          />
        </div>
      </div>

      {/* Karakter — di belakang meja (z-10), nempel bawah, ikut cursor */}
      <div
        className="pointer-events-none absolute bottom-[40px] left-0 z-10 transition-transform duration-150 ease-out"
        style={{ 
          transform: `translateX(${charX}px)`,
          width: CHAR_WIDTH,
          height: CHAR_HEIGHT
        }}
      >
        <div className="relative h-full w-full">
          {/* Pose DIAM (tengah) */}
          <Image
            src="/home/hero/orangtengah.png"
            alt="Kasir Ritual Café (tengah)"
            fill
            priority
            draggable={false}
            className={`select-none object-contain transition-opacity duration-200 ${
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
            className={`select-none object-contain absolute inset-0 transition-opacity duration-200 ${
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
            className={`select-none object-contain absolute inset-0 transition-opacity duration-200 ${
              pose === "left" ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </div>

      {/* Meja paling depan, mentok bawah section */}
      <div className="pointer-events-none absolute bottom-[-85px] left-0 z-20 w-full leading-none">
        <Image
          src="/home/hero/mejafix.png"
          alt="Meja kasir Ritual Café"
          width={1920}
          height={700}
          priority
          draggable={false}
          className="w-full h-auto block align-bottom"
          style={{ display: 'block', margin: 0, padding: 0, verticalAlign: 'bottom' }}
        />
      </div>
    </section>
  );
}