import { useEffect, useState } from "react";

export default function Marquee() {
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
      }
    };

    fetchCategoriesForMarquee();
  }, []);

  return (
    <div className="border-t border-b border-[#bbe150]/18 py-4 overflow-hidden whitespace-nowrap bg-white/[0.02]">
      <div className="inline-flex gap-14 animate-[scroll_26s_linear_infinite] font-['Bebas_Neue',sans-serif] font-normal tracking-[0.1em] text-[#94a3c4] text-[15px]">
        {items.map((t, i) => (
          <span
            key={`item-${i}`}
            className={`opacity-80 ${i % 3 === 0 ? "text-[#dcf0a3]" : ""}`}
          >
            {t}
          </span>
        ))}
        {items.map((t, i) => (
          <span
            key={`dup-${i}`}
            className={`opacity-80 ${i % 3 === 0 ? "text-[#dcf0a3]" : ""}`}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
