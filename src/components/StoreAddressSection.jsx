import { useEffect, useState } from "react";

export default function StoreAddressSection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreAddress = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL_API}/compro/contents/by-category/STORE_ADDRESS`,
        );
        const json = await res.json();

        if (json.success && json.data) {
          const targetData = Array.isArray(json.data)
            ? json.data[0]
            : json.data;
          setData(targetData);
        }
      } catch (error) {
        console.error("Failed to fetch store address:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreAddress();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="bg-[#101d3b]/80 backdrop-blur-md rounded-2xl p-8 border border-[#bbe150]/10 animate-pulse h-96" />
      </section>
    );
  }

  if (!data) return null;

  const [lat, lng] = data.content
    ? data.content.split(",")
    : ["-6.200000", "106.816666"];
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${lat},${lng}&hl=id&z=16&output=embed`;

  return (
    <section
      id="location"
      className="py-20 px-4 max-w-7xl mx-auto w-full relative z-10"
    >
      <div className="bg-[#101d3b]/80 backdrop-blur-md rounded-2xl p-8 lg:p-12 border border-[#bbe150]/20 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            <div>
              <span className="text-[#bbe150] text-sm uppercase tracking-widest font-semibold">
                Kunjungi Toko Kami
              </span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white mt-1 font-['Bebas_Neue',sans-serif] tracking-wide">
                LOKASI TOKO
              </h2>
            </div>

            <div className="flex items-start space-x-4 bg-[#0c1730]/60 p-5 rounded-xl border border-white/5">
              <div className="p-3 bg-[#bbe150]/10 text-[#bbe150] rounded-lg shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                  {data.name || "Alamat belum diatur."}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-[#bbe150] text-[#12220a] font-bold rounded-xl hover:bg-[#a3cb38] transition-all duration-200 shadow-lg shadow-[#bbe150]/20 text-sm group"
              >
                <span>Buka di Google Maps</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 h-[360px] lg:h-[420px] rounded-xl overflow-hidden border border-white/10 shadow-2xl relative">
            <iframe
              title="Store Location"
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
