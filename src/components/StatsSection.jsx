import { useEffect, useState } from "react";
import StatCounter from "./StatCounter";

export default function StatsSection() {
  const [statsData, setStatsData] = useState([
    { target: 0, label: "Card Shops" },
    { target: 0, label: "Events" },
  ]);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        const baseUrl = import.meta.env.VITE_BASE_URL_API;

        const [shopsRes, eventsRes] = await Promise.all([
          fetch(`${baseUrl}/shops?page=1&limit=1`),
          fetch(`${baseUrl}/events?page=1&limit=1`),
        ]);

        const shopsResult = await shopsRes.json();
        const eventsResult = await eventsRes.json();

        const totalShops = Number(shopsResult.metadata?.total ?? 3);
        const totalEvents = Number(eventsResult.metadata?.total ?? 5);

        if (isMounted) {
          setStatsData([
            { target: totalShops, label: "Card Shops" },
            { target: totalEvents, label: "Events" },
          ]);
        }
      } catch (error) {
        console.error("Gagal memuat statistik dari API:", error);
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-[84px]">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="bg-[#16264a] border border-[#bbe150]/18 rounded-[20px] grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-lg">
          {statsData.map((s, index, arr) => {
            const isLast = index === arr.length - 1;

            return (
              <div
                key={`${s.label}-${s.target}`}
                className={`py-[44px] px-5 text-center transition-colors ${
                  !isLast
                    ? "border-b md:border-b-0 md:border-r border-[#bbe150]/18"
                    : ""
                }`}
              >
                <StatCounter target={s.target} label={s.label} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
