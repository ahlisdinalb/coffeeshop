import Hero from "../component/home/hero";

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-[#f5eee6] text-[#24160f]">
      <Hero />

      {/* TENTANG KAMI */}
      <section
        id="tentang-kami"
        className="mx-auto max-w-6xl px-6 py-20 md:py-24"
      >
        <h2 className="text-2xl font-semibold text-[#24160f] md:text-3xl">
          Tentang Kami
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#705041] md:text-base">
          Ritual Café adalah coffee bar yang fokus pada pengalaman duduk di
          depan barista. Interior kayu hangat, pencahayaan lembut, dan detail
          rak kopi kami terinspirasi langsung dari dinding dan meja pada hero
          section di atas.
        </p>
      </section>

      {/* PRODUK YANG DIJUAL */}
      <section
        id="products"
        className="mx-auto max-w-6xl px-6 py-16 md:py-20"
      >
        <h2 className="text-2xl font-semibold text-[#24160f] md:text-3xl">
          Produk yang Dijual
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#705041] md:text-base">
          Di sini nantinya kamu bisa menampilkan list menu kopi, non-kopi,
          dessert, dan pastry. Sekarang masih placeholder agar kamu bebas
          mengisi dengan data menu yang sudah kamu punya.
        </p>
      </section>

      {/* LOKASI OUTLET */}
      <section
        id="lokasi"
        className="mx-auto max-w-6xl px-6 py-16 md:py-20"
      >
        <h2 className="text-2xl font-semibold text-[#24160f] md:text-3xl">
          Lokasi Outlet
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#705041] md:text-base">
          Tampilkan alamat lengkap outlet, jam operasional, dan bisa juga embed
          peta di bagian ini. Navbar akan otomatis scroll ke sini ketika
          pengunjung klik &quot;Lokasi Outlet&quot;.
        </p>
      </section>

      {/* CAREER */}
      <section
        id="career"
        className="mx-auto max-w-6xl px-6 py-16 md:py-20"
      >
        <h2 className="text-2xl font-semibold text-[#24160f] md:text-3xl">
          Career
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#705041] md:text-base">
          Gunakan section ini untuk membuka lowongan: barista, kasir, atau
          posisi lain. Bisa dikembangkan menjadi form lamaran online dengan
          upload CV dan lain-lain.
        </p>
      </section>

      {/* FOOTER */}
      <footer
        id="footer"
        className="border-t border-[#d1bca4]/60 bg-[#f1e1ce] py-10"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
          <div className="text-xs text-[#6f503f]">
            © {year} Ritual Café. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#7a5b49]">
            <span>Instagram</span>
            <span>WhatsApp</span>
            <span>Email</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
