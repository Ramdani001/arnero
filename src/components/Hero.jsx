import React, { useRef, useCallback, useEffect, useState } from "react";
import CardArt from "./CardArt";

export default function Hero() {
  const stageRef = useRef(null);
  const cardRef = useRef(null);

  const [topCards, setTopCards] = useState([]);
  const [heroContent, setHeroContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchHeroData = async () => {
      try {
        const [cardsRes, contentRes] = await Promise.all([
          fetch(
            `${import.meta.env.VITE_BASE_URL_API}/cards?page=1&limit=2&sortBy=price&sortOrder=desc`,
          ),
          fetch(
            `${import.meta.env.VITE_BASE_URL_API}/compro/contents/by-category/HERO_TITLE`,
          ),
        ]);

        const cardsResult = await cardsRes.json();
        const contentResult = await contentRes.json();

        if (isMounted) {
          if (cardsResult.success && cardsResult.data) {
            setTopCards(cardsResult.data);
          }
          if (contentResult.success && contentResult.data) {
            setHeroContent(contentResult.data);
          }
        }
      } catch (error) {
        console.error("Gagal memuat data hero:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHeroData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleMove = useCallback((clientX, clientY) => {
    const stage = stageRef.current;
    const card = cardRef.current;
    if (!stage || !card) return;
    const r = stage.getBoundingClientRect();
    const x = (clientX - r.left) / r.width;
    const y = (clientY - r.top) / r.height;
    const rotX = (0.5 - y) * 22;
    const rotY = (x - 0.5) * 26;
    card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
    card.style.setProperty("--holo-x", `${x * 100}%`);
    card.style.setProperty("--holo-y", `${y * 100}%`);
    card.style.setProperty("--holo-o", 0.85);
  }, []);

  const onStageMouseMove = (e) => handleMove(e.clientX, e.clientY);
  const onStageTouchMove = (e) => {
    const t = e.touches[0];
    handleMove(t.clientX, t.clientY);
  };
  const onStageLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
    card.style.setProperty("--holo-o", 0.4);
  };

  const activeCard = topCards[0];
  const primaryImage =
    activeCard?.images?.find((img) => img.isPrimary)?.url ||
    activeCard?.images?.[0]?.url;
  const displayCategory =
    activeCard?.categories?.[0]?.category?.name || "Ultra Rare";
  const formattedPrice = activeCard?.price
    ? new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(Number(activeCard.price))
    : "";

  return (
    <section className="max-w-[1180px] mx-auto px-6 py-[88px] lg:py-[56px] grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center mt-20">
      <div className="text-center lg:text-left">
        {/* Badge / Subtitle Atas */}
        <div className="inline-flex items-center gap-2 font-['Bebas_Neue',sans-serif] tracking-[0.16em] text-[14px] text-[#dcf0a3] px-3.5 py-1.5 border border-[#bbe150]/20 rounded-full bg-[#bbe150]/[0.06] mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#bbe150] shadow-[0_0_8px_#bbe150]"></span>
          {heroContent?.subtitle || "TOKO KARTU RESMI — INDONESIA"}
        </div>

        {/* Judul Utama */}
        {heroContent?.title ? (
          <h1
            className="text-[clamp(40px,6vw,68px)] font-['Bebas_Neue',sans-serif] uppercase tracking-[0.030em] leading-[0.98] font-normal my-5"
            dangerouslySetInnerHTML={{ __html: heroContent.title }}
          />
        ) : (
          <h1 className="text-[clamp(40px,6vw,68px)] font-['Bebas_Neue',sans-serif] uppercase tracking-[0.030em] leading-[0.98] font-normal my-5">
            {heroContent?.name}
          </h1>
        )}

        <p
          className="text-[#94a3c4] text-[17px] leading-[1.65] max-w-[480px] mx-auto lg:mx-0"
          dangerouslySetInnerHTML={{ __html: heroContent?.content }}
        ></p>

        <div className="flex gap-3.5 mt-8 flex-wrap justify-center lg:justify-start">
          <a
            className="px-6.5 py-3.5 rounded-[10px] font-bold text-[14px] font-['Bebas_Neue',sans-serif] tracking-[0.05em] uppercase inline-flex items-center gap-2 bg-[#bbe150] text-[#12220a] shadow-[0_8px_24px_rgba(187,225,80,0.3)] hover:-translate-y-0.5 transition-transform duration-200"
            href="#produk"
          >
            Jelajahi Produk →
          </a>
          <a
            className="px-6.5 py-3.5 rounded-[10px] font-bold text-[14px] font-['Bebas_Neue',sans-serif] tracking-[0.05em] uppercase inline-flex items-center gap-2 bg-transparent text-[#f5f5f0] border border-white/20 hover:border-[#dcf0a3] hover:text-[#dcf0a3] transition-all duration-200"
            href="#kontak"
          >
            Jadi Official Store
          </a>
        </div>
      </div>

      <div
        className="relative w-[340px] h-[460px] mx-auto perspective-[1200px] cursor-pointer"
        ref={stageRef}
        onMouseMove={onStageMouseMove}
        onMouseLeave={onStageLeave}
        onTouchMove={onStageTouchMove}
      >
        {topCards[1] && (
          <div className="absolute top-[26px] -left-[30px] w-full h-full bg-gradient-to-br from-[#182a52] to-[#0a1226] border-2 border-[#345799]/50 rounded-[18px] -z-10 rotate-[-8deg] opacity-60 hidden lg:flex flex-col justify-between p-4 overflow-hidden">
            <div>
              <div className="font-['Bebas_Neue',sans-serif] text-[18px] text-[#dcf0a3] line-clamp-1">
                {topCards[1].name}
              </div>
              <div className="text-[9px] text-[#94a3c4] tracking-[0.14em] uppercase">
                ✦ {topCards[1].categories?.[0]?.category?.name || "Rare"}
              </div>
            </div>
            <div className="h-[180px] rounded-[8px] overflow-hidden relative my-2 border border-white/10">
              {topCards[1].images?.[0]?.url ? (
                <img
                  src={topCards[1].images[0].url}
                  alt={topCards[1].name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <CardArt seed={1} />
              )}
            </div>
            <div className="text-right font-['Bebas_Neue',sans-serif] text-[13px] text-[#bbe150]">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              }).format(Number(topCards[1].price))}
            </div>
          </div>
        )}

        <div
          className="relative w-full h-full rounded-[18px] bg-gradient-to-br from-[#182a52] to-[#0a1226] border-2 border-[#bbe150]/40 shadow-[0_30px_70px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.02)_inset] [transform-style:preserve-3d] transition-[transform] duration-[150ms] ease-out overflow-hidden"
          ref={cardRef}
        >
          <div className="absolute inset-[14px] rounded-[12px] border border-[#dcf0a3]/50 flex flex-col justify-between p-4">
            <div>
              <div className="font-['Bebas_Neue',sans-serif] font-normal text-[21px] text-[#dcf0a3] tracking-[0.02em] line-clamp-1">
                {loading
                  ? "Memuat..."
                  : activeCard?.name || "Fydraulis Harmonia"}
              </div>
              <div className="text-[10px] text-[#94a3c4] tracking-[0.14em] uppercase">
                ✦ {displayCategory}
              </div>
            </div>

            <div className="flex-1 my-2.5 rounded-[9px] relative overflow-hidden border border-white/10 bg-[#0d1526]/50 flex items-center justify-center">
              {primaryImage ? (
                <img
                  src={primaryImage}
                  alt={activeCard?.name}
                  className="w-full h-full object-cover absolute inset-0"
                />
              ) : (
                <CardArt seed={0} />
              )}
            </div>

            <div className="flex justify-between items-center font-['Bebas_Neue',sans-serif] font-normal text-[14px] text-[#f5f5f0]">
              <span className="bg-black/40 px-2.5 py-1 rounded-[6px] text-[#bbe150]">
                {formattedPrice || "HARGA SPESIAL"}
              </span>
              <span className="bg-black/40 px-2.5 py-1 rounded-[6px]">
                OFFICIAL
              </span>
            </div>
          </div>

          <div className="absolute inset-[0] pointer-events-none rounded-[18px] bg-[linear-gradient(115deg,transparent_20%,rgba(255,255,255,0.32)_36%,rgba(187,225,80,0.28)_44%,transparent_52%)] bg-[length:250%_250%] bg-[position:var(--holo-x,50%)_var(--holo-y,50%)] mix-blend-overlay opacity-[var(--holo-o,0.4)] transition-opacity duration-300"></div>
        </div>
      </div>
    </section>
  );
}
