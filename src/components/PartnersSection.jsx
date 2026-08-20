import { useEffect, useState } from "react";

export default function PartnersSection() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL_API}/shops?page=1&limit=4`,
        );
        const result = await response.json();

        if (result.success) {
          setShops(result.data || []);
        }
      } catch (error) {
        console.error("Gagal memuat data partner/toko:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  return (
    <section id="partner" className="py-[84px]">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="max-w-[640px] mx-auto mb-[46px] text-center">
          <div className="inline-flex items-center gap-2 font-['Bebas_Neue',sans-serif] tracking-[0.16em] text-[14px] text-[#dcf0a3] px-3.5 py-1.5 border border-[#bbe150]/20 rounded-full bg-[#bbe150]/[0.06] mb-3.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#bbe150] shadow-[0_0_8px_#bbe150]"></span>
            PARTNER / CABANG RESMI
          </div>
          <h2 className="text-[clamp(30px,3.8vw,42px)] font-['Bebas_Neue',sans-serif] uppercase tracking-[0.03em] font-normal m-0">
            Dipercaya Studio Global
          </h2>
        </div>

        <div className="flex justify-center gap-5 sm:gap-[60px] flex-wrap items-center opacity-90">
          {loading ? (
            <div className="font-['Bebas_Neue',sans-serif] font-normal text-[20px] tracking-[0.06em] text-[#94a3c4] border border-[#bbe150]/18 py-3.5 px-6 rounded-[10px] bg-[#16264a]/50">
              Memuat data...
            </div>
          ) : shops.length > 0 ? (
            shops.map((shop) => (
              <div
                key={shop.id}
                className="font-['Bebas_Neue',sans-serif] font-normal text-[20px] sm:text-[22px] tracking-[0.06em] text-[#94a3c4] border border-[#bbe150]/18 py-3.5 px-6 rounded-[10px] bg-[#16264a]/50 hover:text-[#dcf0a3] hover:border-[#dcf0a3] transition-all duration-200"
              >
                {shop.name.toUpperCase()}
              </div>
            ))
          ) : (
            <div className="font-['Bebas_Neue',sans-serif] font-normal text-[20px] tracking-[0.06em] text-[#94a3c4] border border-[#bbe150]/18 py-3.5 px-6 rounded-[10px] bg-[#16264a]/50">
              Tidak ada data
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
