import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MiniCard from "./MiniCard";

export default function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sectionContent, setSectionContent] = useState({
    name: "",
    content: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL_API}/cards?page=1&limit=4&sortBy=price&sortOrder=desc`,
        );
        const result = await response.json();

        if (result.success) {
          setProducts(result.data || []);
        }
      } catch (error) {
        console.error("Gagal memuat produk andalan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  useEffect(() => {
    const fetchSectionContent = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL_API}/compro/contents/by-category/PRODUK_ANDALAN`,
        );
        const result = await response.json();

        if (result.success && result.data) {
          setSectionContent({
            name: result.data.name || "Koleksi Trading Card Game",
            content: result.data.content || "",
          });
        }
      } catch (error) {
        console.error("Gagal memuat konten teks section:", error);
      }
    };

    fetchSectionContent();
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
            <p className="text-center w-full col-span-full text-[#9aa5bd] py-8">
              Memuat produk andalan...
            </p>
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
            <p className="text-center w-full col-span-full text-[#9aa5bd] py-8">
              Belum ada produk.
            </p>
          )}
        </div>

        <div className="text-center mt-8">
          <button
            className="bg-[#c4e94c] text-[#132000] border-none rounded-full px-7 py-3 font-bold text-[13px] tracking-[0.5px] cursor-pointer hover:bg-[#bbe150] transition-transform active:scale-95 shadow-[0_6px_20px_rgba(187,225,80,0.25)]"
            onClick={() => navigate("/products")}
          >
            LIHAT SEMUA PRODUK
          </button>
        </div>
      </div>
    </section>
  );
}
