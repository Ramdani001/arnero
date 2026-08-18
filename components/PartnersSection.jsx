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
    <section id="partner">
      <div className="wrap">
        <div className="head">
          <div className="eyebrow">PARTNER / CABANG RESMI</div>
          <h2>Dipercaya Studio Global</h2>
        </div>

        <div className="partners">
          {loading ? (
            <div className="partner-chip">Memuat data...</div>
          ) : shops.length > 0 ? (
            shops.map((shop) => (
              <div key={shop.id} className="partner-chip">
                {shop.name.toUpperCase()}
              </div>
            ))
          ) : (
            <div className="partner-chip">Tidak ada data</div>
          )}
        </div>
      </div>
    </section>
  );
}
