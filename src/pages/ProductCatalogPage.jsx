import { useCallback, useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import { ProductCard } from "../components/ProductCard";

export default function ProductCatalogPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const [categoriesList, setCategoriesList] = useState([
    { id: "semua", name: "Semua" },
  ]);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [navOpen, setNavOpen] = useState(false);

  const observer = useRef();
  const categoryScrollRef = useRef(null);

  const scrollCategories = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === "left" ? -240 : 240;
      categoryScrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

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
      setProducts([]);
      setPage(1);
      setHasMore(true);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const handleCategoryChange = (catName) => {
    if (catName === category) return;
    setCategory(catName);
    setProducts([]);
    setPage(1);
    setHasMore(true);
  };

  useEffect(() => {
    const fetchCards = async () => {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
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
          const newData = result.data || [];
          setProducts((prev) => (page === 1 ? newData : [...prev, ...newData]));

          if (result.metadata) {
            setTotalItems(result.metadata.total || 0);
            setHasMore(page < result.metadata.totalPages);
          } else {
            setHasMore(newData.length > 0);
          }
        } else {
          throw new Error(result.message || "Gagal mengambil data");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchCards();
  }, [page, debouncedSearch, category]);

  const lastProductElementRef = useCallback(
    (node) => {
      if (loading || loadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setPage((prevPage) => prevPage + 1);
          }
        },
        { threshold: 0.5 },
      );

      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore],
  );

  return (
    <div className="min-h-screen bg-[#070a12] font-sans pb-24 text-[#e8ecf5] pt-24 selection:bg-[#c4e94c] selection:text-[#0a1018]">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <Header navOpen={navOpen} setNavOpen={setNavOpen} />

      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs tracking-widest font-semibold text-[#c4e94c] border border-[#c4e94c]/30 rounded-full py-1.5 px-4 mb-4 bg-[#c4e94c]/5 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#c4e94c] animate-pulse shadow-[0_0_10px_#c4e94c]" />
            KATALOG RESMI
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-wide mb-3 text-white uppercase font-['Oswald',sans-serif]">
            TRADING CARD GAME
          </h1>
          <p className="text-sm sm:text-base text-[#9aa5bd] max-w-xl mx-auto leading-relaxed">
            Jelajahi seluruh koleksi kartu yang kami distribusikan secara resmi.
          </p>
        </div>

        <div className="relative max-w-xl mx-auto mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#7c869e]">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama kartu..."
            className="w-full bg-[#0d1526]/80 border border-[#23304a] rounded-2xl py-3.5 pl-11 pr-10 text-sm text-[#e8ecf5] placeholder-[#626e87] outline-none focus:border-[#c4e94c] focus:ring-1 focus:ring-[#c4e94c]/50 transition-all shadow-inner"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#7c869e] hover:text-white transition-colors cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        <div className="relative max-w-5xl mx-auto mb-8 group">
          <button
            onClick={() => scrollCategories("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-[#0d1526]/90 border border-[#23304a] text-white shadow-lg hover:bg-[#c4e94c] hover:text-[#0a1018] hover:border-[#c4e94c] transition-all duration-200 -ml-4 opacity-0 group-hover:opacity-100 hidden sm:flex cursor-pointer"
            aria-label="Scroll Kiri"
          >
            &#8249;
          </button>

          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#070a12] to-transparent z-1 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#070a12] to-transparent z-1 pointer-events-none" />

          <div
            ref={categoryScrollRef}
            className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-2 px-4 scroll-smooth"
          >
            {categoriesList.map((cat) => {
              const active = cat.name === category;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.name)}
                  className={`rounded-xl py-2.5 px-5 text-xs font-bold tracking-wider cursor-pointer whitespace-nowrap transition-all duration-200 uppercase shrink-0 ${
                    active
                      ? "bg-[#c4e94c] text-[#0f1700] shadow-[0_4px_16px_rgba(196,233,76,0.25)] scale-105"
                      : "bg-[#0d1526]/80 border border-[#23304a] text-[#9aa5bd] hover:border-[#c4e94c]/50 hover:text-white hover:bg-[#131f38]"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => scrollCategories("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-[#0d1526]/90 border border-[#23304a] text-white shadow-lg hover:bg-[#c4e94c] hover:text-[#0a1018] hover:border-[#c4e94c] transition-all duration-200 -mr-4 opacity-0 group-hover:opacity-100 hidden sm:flex cursor-pointer"
            aria-label="Scroll Kanan"
          >
            &#8250;
          </button>
        </div>

        <div className="flex items-center justify-between text-xs text-[#7c869e] mb-6 font-medium">
          <span>
            Menampilkan{" "}
            <strong className="text-white">{products.length}</strong> dari{" "}
            <strong className="text-white">{totalItems}</strong> produk
          </span>
          {category !== "Semua" && (
            <span className="bg-[#182338] px-2.5 py-1 rounded-md border border-[#23304a] text-[#c4e94c]">
              Kategori: {category}
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-[#0d1526]/40 border border-[#1b263b] rounded-2xl p-4 animate-pulse h-[360px] flex flex-col justify-between"
              >
                <div className="w-full h-48 bg-[#182338] rounded-xl mb-4" />
                <div className="space-y-3">
                  <div className="h-4 bg-[#182338] rounded w-3/4" />
                  <div className="h-3 bg-[#182338] rounded w-1/2" />
                </div>
                <div className="h-8 bg-[#182338] rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 px-6 border border-dashed border-red-500/30 rounded-2xl bg-red-500/5">
            <p className="text-base font-bold text-red-400 mb-1">
              Gagal Memuat Produk
            </p>
            <p className="text-xs text-[#7c869e]">{error}</p>
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product, index) => {
                const isLastElement = products.length === index + 1;
                return (
                  <div
                    key={`${product.id}-${index}`}
                    ref={isLastElement ? lastProductElementRef : null}
                    className="transition-transform duration-200 hover:-translate-y-1"
                  >
                    <ProductCard product={product} />
                  </div>
                );
              })}
            </div>

            <div className="mt-12 text-center flex flex-col items-center justify-center">
              {loadingMore && (
                <div className="inline-flex items-center gap-3 bg-[#0d1526] border border-[#23304a] px-5 py-2.5 rounded-full text-xs font-semibold text-[#c4e94c] shadow-lg">
                  <span className="w-3.5 h-3.5 border-2 border-[#c4e94c] border-t-transparent rounded-full animate-spin" />
                  Memuat kartu tambahan...
                </div>
              )}

              {!hasMore && products.length > 0 && (
                <div className="text-xs text-[#626e87] border-t border-[#1b263b] pt-8 w-full max-w-xs mx-auto">
                  Semua kartu telah ditampilkan
                </div>
              )}

              {hasMore && !loadingMore && (
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  className="mt-2 text-xs font-semibold text-[#9aa5bd] hover:text-[#c4e94c] transition-colors cursor-pointer border border-[#23304a] rounded-full px-6 py-2 bg-[#0d1526]/50 hover:border-[#c4e94c]/40"
                >
                  Muat Lebih Banyak
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20 px-6 border border-dashed border-[#23304a] rounded-3xl bg-[#0d1526]/30 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-[#182338] flex items-center justify-center mx-auto mb-4 text-[#7c869e]">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              Produk Tidak Ditemukan
            </h3>
            <p className="text-xs text-[#7c869e] mb-6">
              Tidak ada kartu yang sesuai dengan kata kunci atau filter pilihan
              Anda.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setCategory("Semua");
              }}
              className="bg-[#c4e94c] text-[#0f1700] rounded-xl py-2.5 px-6 text-xs font-bold hover:bg-[#b0d53c] transition-colors shadow-lg cursor-pointer"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
