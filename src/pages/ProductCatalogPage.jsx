import { useEffect, useState } from "react";
import Header from "../components/Header";
import { ProductCard } from "../components/ProductCard";

export default function ProductCatalogPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [categoriesList, setCategoriesList] = useState([
    { id: "semua", name: "Semua" },
  ]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL_API}/categories?limit=50`,
        );
        const result = await response.json();

        if (result.success) {
          setCategoriesList([
            { id: "semua", name: "Semua" },
            ...(result.data || []),
          ]);
        }
      } catch (err) {
        console.error("Gagal memuat kategori:", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `${import.meta.env.VITE_BASE_URL_API}/cards?page=${page}&limit=8&sortBy=createdAt&sortOrder=desc&stock=on`;

        if (debouncedSearch.trim() !== "") {
          url += `&name=${encodeURIComponent(debouncedSearch.trim())}`;
        }

        if (category !== "Semua") {
          url += `&categories=${encodeURIComponent(category)}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success) {
          setProducts(result.data || []);

          if (result.metadata) {
            setTotalPages(result.metadata.totalPages);
            setTotalItems(result.metadata.total);
          }
        } else {
          throw new Error(result.message || "Gagal mengambil data");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, debouncedSearch, category]);

  const handlePrevPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0d1526] to-[#0a1018] font-['Oswald','Arial_Narrow',sans-serif] pb-24 text-[#e8ecf5] mt-20">
      <Header navOpen={navOpen} setNavOpen={setNavOpen} />

      <div className="max-w-[1200px] mx-auto px-6 pt-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-[12px] tracking-[1.5px] font-semibold text-[#c4e94c] border border-[#c4e94c]/35 rounded-full py-2 px-[18px] mb-5 bg-[#c4e94c]/[0.06]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c4e94c] inline-block shadow-[0_0_8px_#c4e94c]" />
            SEMUA PRODUK
          </div>
          <h1 className="text-[32px] sm:text-[44px] font-bold tracking-[1px] m-0 mb-4 text-[#f5f7fb] uppercase">
            KATALOG TRADING CARD GAME
          </h1>
          <p className="text-[15px] sm:text-[16px] text-[#9aa5bd] max-w-[640px] mx-auto leading-[1.6] font-sans font-normal">
            Jelajahi seluruh koleksi kartu yang kami distribusikan secara resmi.
          </p>
        </div>

        <div className="relative max-w-[480px] mx-auto mb-7">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] opacity-60">
            &#128269;
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama kartu di seluruh toko..."
            className="w-full box-border bg-[#111a2c] border border-[#23304a] rounded-full py-3.5 px-11 text-[14px] text-[#e8ecf5] outline-none font-sans focus:border-[#c4e94c] transition-colors"
          />
          {search && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#9aa5bd] text-[20px] cursor-pointer p-1 hover:text-white"
              onClick={() => setSearch("")}
            >
              &times;
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-16 px-5 border border-dashed border-[#23304a] rounded-2xl">
            <p className="text-[18px] font-bold m-0 mb-2 text-[#f5f7fb]">
              Memuat data...
            </p>
            <p className="text-[14px] text-[#7c869e] m-0 font-sans">
              Sedang mengambil data kartu dari server.
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-16 px-5 border border-dashed border-[#23304a] rounded-2xl">
            <p className="text-[18px] font-bold m-0 mb-2 text-[#ff6b6b]">
              Gagal memuat produk
            </p>
            <p className="text-[14px] text-[#7c869e] m-0 font-sans">{error}</p>
          </div>
        ) : (
          <>
            <div className="flex justify-start sm:justify-center flex-wrap gap-3 mb-8 overflow-x-auto pb-2 scrollbar-none">
              {categoriesList.map((cat) => {
                const active = cat.name === category;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setCategory(cat.name);
                      setPage(1);
                    }}
                    className={`rounded-full py-3 px-6 text-[13px] font-semibold tracking-[0.5px] cursor-pointer whitespace-nowrap transition-all uppercase ${
                      active
                        ? "bg-[#c4e94c] border-transparent text-[#132000] shadow-[0_4px_14px_rgba(196,233,76,0.3)]"
                        : "bg-[#111a2c] border border-[#23304a] text-[#9aa5bd] hover:border-[#c4e94c]/50 hover:text-white"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

            <div className="text-[14px] text-[#9aa5bd] mb-5 font-sans font-semibold">
              Total Produk: {totalItems} (Halaman {page} dari {totalPages})
            </div>

            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-5 mt-10">
                    <button
                      onClick={handlePrevPage}
                      disabled={page === 1}
                      className={`bg-[#1c2740] border border-[#23304a] text-[#e8ecf5] py-2.5 px-5 rounded-lg text-[14px] font-semibold font-sans transition-all ${
                        page === 1
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer hover:bg-[#23304a]"
                      }`}
                    >
                      &#8592; Sebelumnya
                    </button>
                    <span className="text-[#9aa5bd] text-[15px] font-sans">
                      Halaman {page} / {totalPages}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={page === totalPages}
                      className={`bg-[#1c2740] border border-[#23304a] text-[#e8ecf5] py-2.5 px-5 rounded-lg text-[14px] font-semibold font-sans transition-all ${
                        page === totalPages
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer hover:bg-[#23304a]"
                      }`}
                    >
                      Selanjutnya &#8594;
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 px-5 border border-dashed border-[#23304a] rounded-2xl">
                <p className="text-[18px] font-bold m-0 mb-2 text-[#f5f7fb]">
                  Produk tidak ditemukan
                </p>
                <p className="text-[14px] text-[#7c869e] m-0 mb-5 font-sans">
                  Tidak ada kartu yang cocok dengan filter atau pencarian Anda.
                </p>
                <button
                  className="bg-[#c4e94c] border-none rounded-full py-2.5 px-6 text-[13px] font-bold text-[#132000] cursor-pointer hover:bg-[#b0d53c] transition-colors"
                  onClick={() => {
                    setSearch("");
                    setCategory("Semua");
                    setPage(1);
                  }}
                >
                  Reset Filter
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
