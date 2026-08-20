import { useEffect, useRef, useState } from "react";

export default function AboutSection() {
  const [sectionContent, setSectionContent] = useState({
    name: "",
    content: "",
  });
  const [kegiatanImages, setKegiatanImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAboutData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_BASE_URL_API;

        const [contentRes, imagesRes] = await Promise.all([
          fetch(`${baseUrl}/compro/contents/by-category/SIAPA_KAMI`),
          fetch(
            `${baseUrl}/compro/images?page=1&limit=1000000&sortBy=sort&sortOrder=asc&category=KEGIATAN`,
          ),
        ]);

        const contentResult = await contentRes.json();
        const imagesResult = await imagesRes.json();

        if (isMounted) {
          if (contentResult?.success && contentResult?.data) {
            setSectionContent({
              name: contentResult.data.name || "",
              content: contentResult.data.content || "",
            });
          }

          if (imagesResult?.success && Array.isArray(imagesResult.data)) {
            const activeImages = imagesResult.data.filter(
              (img) => img.isActive,
            );
            setKegiatanImages(activeImages);
          }
        }
      } catch (error) {
        console.error("Gagal memuat data about section:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAboutData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="kegiatan" className="py-[84px] overflow-hidden">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="max-w-[640px] mx-auto mb-[36px] text-center">
          <div className="inline-flex items-center gap-2 font-['Bebas_Neue',sans-serif] tracking-[0.16em] text-[14px] text-[#dcf0a3] px-3.5 py-1.5 border border-[#bbe150]/20 rounded-full bg-[#bbe150]/[0.06] mb-3.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#bbe150] shadow-[0_0_8px_#bbe150]"></span>
            SIAPA KAMI
          </div>

          <h2 className="text-[clamp(30px,3.8vw,42px)] font-['Bebas_Neue',sans-serif] uppercase tracking-[0.03em] font-normal m-0">
            {sectionContent.name}
          </h2>

          <div
            className="text-[#94a3c4] mt-3.5 text-[16px] leading-[1.6]"
            dangerouslySetInnerHTML={{ __html: sectionContent.content }}
          />
        </div>

        {!loading && kegiatanImages.length > 0 && (
          <div className="relative group">
            <button
              onClick={() => handleScroll("left")}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#0c1730]/90 border border-[#bbe150]/40 text-[#bbe150] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg hover:bg-[#bbe150] hover:text-[#12220a] cursor-pointer"
              aria-label="Scroll Kiri"
            >
              ❮
            </button>

            <div
              ref={scrollContainerRef}
              className="flex gap-5 overflow-x-auto scrollbar-none scroll-smooth pb-4 pt-1 px-1 -mx-1"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {kegiatanImages.map((item) => (
                <div
                  key={item.id}
                  className="group/card relative min-w-[280px] sm:min-w-[320px] h-[240px] rounded-[16px] overflow-hidden border border-[#bbe150]/20 bg-[#16264a] shadow-lg shrink-0 transition-transform duration-300 hover:-translate-y-1.5 hover:border-[#bbe150]/50"
                >
                  <img
                    src={item.url}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1730]/90 via-[#0c1730]/30 to-transparent opacity-80 group-hover/card:opacity-95 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <span className="text-[#bbe150] text-[11px] font-['Bebas_Neue',sans-serif] tracking-[0.15em] uppercase">
                      KEGIATAN
                    </span>
                    <h3 className="font-['Bebas_Neue',sans-serif] font-normal text-[20px] text-[#f5f5f0] tracking-[0.03em] m-0 uppercase line-clamp-1">
                      {item.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleScroll("kanan")}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#0c1730]/90 border border-[#bbe150]/40 text-[#bbe150] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg hover:bg-[#bbe150] hover:text-[#12220a] cursor-pointer"
              aria-label="Scroll Kanan"
            >
              ❯
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
