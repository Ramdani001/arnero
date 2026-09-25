import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MiniCard from "./MiniCard";

const DEFAULT_PRODUCTS_CONTENT = {
  name: "Koleksi Trading Card Game Pilihan",
  content:
    "Dapatkan booster pack, single card incaran, dan structure deck resmi berkualitas dengan penawaran terbaik.",
};

export default function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sectionContent, setSectionContent] = useState(DEFAULT_PRODUCTS_CONTENT);

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchSectionData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_BASE_URL_API;

        const [productsRes, contentRes] = await Promise.allSettled([
          fetch(
            `${baseUrl}/cards?page=1&limit=4&sortBy=price&sortOrder=desc`,
          ),
          fetch(
            `${baseUrl}/compro/contents/by-category/PRODUK_ANDALAN`,
          ),
        ]);

        if (!isMounted) return;

        if (productsRes.status === "fulfilled" && productsRes.value.ok) {
          const result = await productsRes.value.json();
          if (result.success && Array.isArray(result.data) && result.data.length > 0) {
            setProducts(result.data);
          }
        }

        if (contentRes.status === "fulfilled" && contentRes.value.ok) {
          const contentResult = await contentRes.value.json();
          if (contentResult.success && contentResult.data) {
            setSectionContent({
              name: contentResult.data.name || DEFAULT_PRODUCTS_CONTENT.name,
              content: contentResult.data.content || DEFAULT_PRODUCTS_CONTENT.content,
            });
          }
        }
      } catch (error) {
        console.error("Gagal memuat data produk andalan:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSectionData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="produk" className="py-[84px]">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="max-w-[640px] mx-auto mb-[46px] text-center">
          <div className="inline-flex items-center gap-2 font-['Bebas_Neue',sans-serif] tracking-[0.16em] text-[14px] text-[#dcf0a3] px-3.5 py-1.5 border border-[#bbe150]/20 rounded-full bg-[#bbe150]/[0.06] mb-3.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#bbe150] shadow-[0_0_8px_#bbe150]"></span>
            PRODUK ANDALAN
          </div>

          <h2 className="text-[clamp(30px,3.8vw,42px)] font-['Bebas_Neue',sans-serif] uppercase tracking-[0.03em] font-normal m-0">
            {sectionContent.name}
          </h2>

          <div
            className="text-[#94a3c4] mt-3.5 text-[16px] leading-[1.6]"
            dangerouslySetInnerHTML={{ __html: sectionContent.content }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[22px]">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-[#16264a] border border-[#bbe150]/10 rounded-[14px] p-4 animate-pulse flex flex-col h-[280px]"
              >
                <div className="h-[150px] rounded-[9px] mb-3.5 bg-white/5" />
                <div className="h-4 bg-white/5 rounded w-3/4 mb-2" />
                <div className="h-3 bg-white/5 rounded w-1/2 mt-auto" />
              </div>
            ))
          ) : products.length > 0 ? (
            products.map((product, i) => {
              const categoryName =
                product.categories?.[0]?.category?.name || "Lainnya";

              const imageUrl =
                product.images?.find((img) => img.isPrimary)?.url ||
                product.images?.[0]?.url;

              const formattedPrice = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              }).format(Number(product.price || 0));

              return (
                <MiniCard
                  key={product.id}
                  name={product.name}
                  tag={categoryName}
                  imageUrl={imageUrl}
                  price={formattedPrice}
                  seed={i}
                />
              );
            })
          ) : (
            [
              { id: "f1", name: "Voltguard Dragon", tag: "Yu-Gi-Oh!", price: "Rp 150.000" },
              { id: "f2", name: "Thundersear Wyrm", tag: "Duel Masters", price: "Rp 120.000" },
              { id: "f3", name: "Solar Phoenix Ace", tag: "Yu-Gi-Oh!", price: "Rp 250.000" },
              { id: "f4", name: "Crystal Warden", tag: "TCG Lainnya", price: "Rp 95.000" },
            ].map((p, i) => (
              <MiniCard
                key={p.id}
                name={p.name}
                tag={p.tag}
                price={p.price}
                seed={i}
              />
            ))
          )}
        </div>

        <div className="text-center mt-8">
          <button
            className="bg-[#c4e94c] text-[#132000] border-none rounded-full px-7 py-3 font-bold text-[13px] tracking-[0.5px] cursor-pointer hover:bg-[#bbe150] transition-transform active:scale-95 shadow-[0_6px_20px_rgba(187,225,80,0.25)]"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "instant" });
              navigate("/products");
            }}
          >
            LIHAT SEMUA PRODUK
          </button>
        </div>
      </div>
    </section>
  );
}
