import { useEffect, useState } from "react";

export default function Marquee() {
  // State default sementara saat loading
  const [items, setItems] = useState(["MEMUAT DATA...", "MEMUAT DATA..."]);

  useEffect(() => {
    const fetchCategoriesForMarquee = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL_API}/categories?limit=20`,
        );
        const result = await response.json();

        if (result.success && result.data && result.data.length > 0) {
          const categoryNames = result.data.map((cat) =>
            cat.name.toUpperCase(),
          );
          setItems(categoryNames);
        }
      } catch (error) {
        console.error("Gagal memuat kategori untuk marquee:", error);
        setItems(["TRADING CARD GAME", "COLLECTION", "OFFICIAL PARTNER"]);
      }
    };

    fetchCategoriesForMarquee();
  }, []);

  return (
    <div className="marquee">
      <div className="marquee-track">
        {items.map((t, i) => (
          <span key={i} className={i % 3 === 0 ? "hi" : ""}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
