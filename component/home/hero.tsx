// components/home/hero.tsx
"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent } from "react";

type Pose = "center" | "left" | "right";

export default function Hero() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [charX, setCharX] = useState(0);
  const [pose, setPose] = useState<Pose>("center");
  const [showCourier, setShowCourier] = useState(false);

  const lastMouseXRef = useRef<number | null>(null);
  const lastScrollLeftRef = useRef<number | null>(null);
  const idleTimeoutRef = useRef<number | null>(null);

  // Dinding 3840x2160 -> 16:9
  const WALL_ASPECT_RATIO = 3840 / 2160;
  // Karakter 380x600 (contoh)
  const CHAR_ASPECT_RATIO = 600 / 380;

  const [sceneHeight, setSceneHeight] = useState(0);
  const [sceneWidth, setSceneWidth] = useState(0);
  const [charWidth, setCharWidth] = useState(0);
  const [charHeight, setCharHeight] = useState(0);
  const [isScrollable, setIsScrollable] = useState(false);

  // Hitung dimensi scene & karakter
  useEffect(() => {
    const updateDimensions = () => {
      if (typeof window === "undefined") return;

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const wallWidthFromHeight = vh * WALL_ASPECT_RATIO;

      // kalau wallWidthFromHeight > vw -> device sempit -> scene lebih lebar dari layar -> scroll
      if (wallWidthFromHeight > vw) {
        setSceneWidth(wallWidthFromHeight);
        setIsScrollable(true);
      } else {
        // device lebar -> scene = lebar viewport, biar nggak ada gap putih
        setSceneWidth(vw);
        setIsScrollable(false);
      }

      setSceneHeight(vh);

      // Karakter ~80% tinggi layar
      const charH = vh * 0.8;
      const charW = charH / CHAR_ASPECT_RATIO;
      setCharHeight(charH);
      setCharWidth(charW);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [WALL_ASPECT_RATIO, CHAR_ASPECT_RATIO]);

  // Posisi awal kasir di tengah viewport (saat scrollLeft = 0)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!charWidth) return;

    const vw = window.innerWidth;
    const initialX = (vw - charWidth) / 2;

    const minX = 0;
    const maxX = Math.max(sceneWidth - charWidth, 0);
    const clamped = Math.min(Math.max(initialX, minX), maxX);

    setCharX(clamped);
  }, [sceneWidth, charWidth]);

  // Bersihkan timeout saat unmount
  useEffect(() => {
    return () => {
      if (idleTimeoutRef.current !== null) {
        window.clearTimeout(idleTimeoutRef.current);
      }
    };
  }, []);

  const setPoseWithAutoReset = (newPose: Pose) => {
    setPose(newPose);

    if (idleTimeoutRef.current !== null) {
      window.clearTimeout(idleTimeoutRef.current);
    }
    idleTimeoutRef.current = window.setTimeout(() => {
      setPose("center");
    }, 500);
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const rect = scrollEl.getBoundingClientRect();
    const scrollLeft = scrollEl.scrollLeft;

    // Posisi X relatif dari awal scene (0 sampai sceneWidth)
    const relativeX = event.clientX - rect.left + scrollLeft;

    const centeredX = relativeX - charWidth / 2;
    const minX = 0;
    const maxX = Math.max(sceneWidth - charWidth, 0);
    const clampedX = Math.min(Math.max(centeredX, minX), maxX);
    setCharX(clampedX);

    // Deteksi arah gerak cursor
    const currentX = event.clientX;
    const lastX = lastMouseXRef.current;
    const threshold = 4;

    if (lastX !== null) {
      const delta = currentX - lastX;
      if (Math.abs(delta) > threshold) {
        setPoseWithAutoReset(delta > 0 ? "right" : "left");
      }
    }
    lastMouseXRef.current = currentX;
  };

  const handleMouseLeave = () => {
    setPose("center");
  };

  // Kasir mengikuti scroll kiri–kanan + ganti arah sesuai arah scroll
  const handleScroll = () => {
    if (typeof window === "undefined") return;
    const scrollEl = scrollRef.current;
    if (!scrollEl || !charWidth) return;

    const scrollLeft = scrollEl.scrollLeft;
    const vw = window.innerWidth;

    // Pusatkan kasir di tengah viewport
    const desiredX = scrollLeft + (vw - charWidth) / 2;
    const minX = 0;
    const maxX = Math.max(sceneWidth - charWidth, 0);
    const clamped = Math.min(Math.max(desiredX, minX), maxX);

    setCharX(clamped);

    // Deteksi arah scroll
    const lastScroll = lastScrollLeftRef.current;
    const threshold = 2; // lebih kecil biar responsif

    if (lastScroll !== null) {
      const delta = scrollLeft - lastScroll;

      if (Math.abs(delta) > threshold) {
        setPoseWithAutoReset(delta > 0 ? "right" : "left");
      }
    }

    lastScrollLeftRef.current = scrollLeft;
  };

  const scrollToProducts = () => {
    const productsSection = document.getElementById("products");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative h-screen w-screen overflow-hidden leading-none">
      {/* Scroll container: hanya aktif horizontal scroll kalau isScrollable = true */}
      <div
        ref={scrollRef}
        className={`h-full w-full ${
          isScrollable ? "overflow-x-auto" : "overflow-x-hidden"
        } overflow-y-hidden`}
        style={{ height: sceneHeight || "100vh" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onScroll={handleScroll}
      >
        {/* Scene: lebar = sceneWidth */}
        <div
          className="relative h-full"
          style={{ width: sceneWidth || "100vw" }}
        >
          {/* BACKGROUND DINDING */}
          <div className="absolute inset-0 h-full w-full">
            <Image
              src="/home/hero/dinding10.jpg"
              alt="Ritual Café wall"
              fill
              priority
              className="h-full w-full object-cover"
              sizes="100vw"
            />
          </div>

          {/* PAPAN MENU GRAFIS (menu.png) – di depan dinding, di belakang kasir */}
          <div
            className="pointer-events-none absolute z-10"
            style={{
              top: sceneHeight * 0.06,
              left: sceneWidth * 0.5,
              width: sceneWidth * 0.38,
              height: sceneHeight * 0.3,
              transform: "translateX(-50%)",
            }}
          >
            <div className="relative h-full w-full">
              <Image
                src="/home/hero/menu.png"
                alt="Papan menu Ritual Café"
                fill
                priority
                draggable={false}
                className="object-contain"
              />
            </div>
          </div>

          {/* PAPAN MENU (area klik besar) */}
          <button
            onClick={scrollToProducts}
            className="absolute z-30 cursor-pointer transition-transform hover:scale-105 active:scale-95"
            style={{
              left: sceneWidth * 0.154,
              top: sceneHeight * 0.112,
              width: sceneWidth * 0.5,
              height: sceneHeight * 0.35,
            }}
            aria-label="Lihat menu produk"
          />

          {/* ORDER (order.png) – kanan atas, trigger kurir, di belakang kasir */}
          <div
            className="absolute z-10 cursor-pointer transition-transform hover:scale-105 active:scale-95"
            style={{
              right: sceneWidth * 0.06,
              top: sceneHeight * 0.04,
              width: sceneWidth * 0.2,
              height: sceneHeight * 0.3,
            }}
            onClick={scrollToProducts}
            onMouseEnter={() => setShowCourier(true)}
            onMouseLeave={() => setShowCourier(false)}
          >
            <div className="relative h-full w-full">
              <Image
                src="/home/hero/order.png"
                alt="Order sekarang di Ritual Café"
                fill
                draggable={false}
                className="object-contain"
              />
            </div>
          </div>

          {/* KURIR – wrapper statis, isi yang geser */}
          <div
            className="pointer-events-none absolute z-30 overflow-hidden"
            style={{
              bottom: sceneHeight * -0.08,
              right: sceneWidth * 0.09,
              width: charWidth,
              height: charHeight,
            }}
          >
            <div
              className={`relative h-full w-full transition-transform duration-500 ease-out ${
                showCourier ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <Image
                src="/home/hero/kurir1.png"
                alt="Kurir Ritual Café"
                fill
                draggable={false}
                className="select-none object-contain"
              />
            </div>
          </div>

          {/* KASIR */}
          <div
            className="pointer-events-none absolute left-0 transition-transform duration-150 ease-out"
            style={{
              bottom: sceneHeight * 0.08,
              transform: `translateX(${charX}px)`,
              width: charWidth,
              height: charHeight,
              zIndex: 15,
            }}
          >
            <div className="relative h-full w-full">
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
              <Image
                src="/home/hero/orangkanan.png"
                alt="Kasir Ritual Café (menghadap kanan)"
                fill
                priority
                draggable={false}
                className={`absolute inset-0 select-none object-contain transition-opacity duration-200 ${
                  pose === "right" ? "opacity-100" : "opacity-0"
                }`}
              />
              <Image
                src="/home/hero/orangkiri.png"
                alt="Kasir Ritual Café (menghadap kiri)"
                fill
                priority
                draggable={false}
                className={`absolute inset-0 select-none object-contain transition-opacity duration-200 ${
                  pose === "left" ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          </div>

          {/* MEJA */}
          <div
            className="pointer-events-none absolute left-0 z-20 leading-none"
            style={{
              bottom: sceneHeight * -0.08,
              width: "100%",
              height: sceneHeight * 0.65,
            }}
          >
            <Image
              src="/home/hero/meja10.png"
              alt="Meja kasir Ritual Café"
              fill
              priority
              draggable={false}
              className="h-full w-full object-cover object-bottom"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
