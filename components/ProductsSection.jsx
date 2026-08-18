import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MiniCard from "./MiniCard";

export default function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <section id="produk">
      <div className="wrap">
        <div className="head">
          <div className="eyebrow">PRODUK ANDALAN</div>
          <h2>Koleksi Trading Card Game</h2>
          <p>
            Dari duel monster klasik hingga strategi elemen — jelajahi lini
            produk yang kami distribusikan secara resmi.
          </p>
        </div>

        <div className="tab-panel">
          {loading ? (
            <p style={{ textAlign: "center", width: "100%", color: "#9aa5bd" }}>
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
            <p style={{ textAlign: "center", width: "100%", color: "#9aa5bd" }}>
              Belum ada produk.
            </p>
          )}
        </div>

        <div className="see-all-wrap">
          <button className="see-all-btn" onClick={() => navigate("/products")}>
            LIHAT SEMUA PRODUK
          </button>
        </div>
      </div>
    </section>
  );
}
