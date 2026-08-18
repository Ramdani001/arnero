import { useEffect, useState } from "react";
import Header from "../components/Header";
import "../styles/site.css";

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function ProductCard({ product }) {
  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url;

  const displayCategory = product.categories?.[0]?.category?.name || "Lainnya";

  return (
    <div style={styles.card}>
      <div style={styles.cardImageContainer}>
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product.name}
            style={styles.cardImageElement}
            loading="lazy"
          />
        ) : (
          <div style={styles.noImageFallback}>No Image</div>
        )}
      </div>
      <div style={styles.cardBody}>
        <h3 style={styles.cardName}>{product.name?.toUpperCase()}</h3>
        <div style={styles.cardMetaRow}>
          <span style={styles.cardCategoryText}>
            {displayCategory.toUpperCase()}
          </span>
          <span style={styles.cardPrice}>
            {formatRupiah(product.price || 0)}
          </span>
        </div>
      </div>
    </div>
  );
}

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
    <div style={styles.page}>
      <Header navOpen={navOpen} setNavOpen={setNavOpen} />
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.eyebrow}>
            <span style={styles.eyebrowDot} />
            SEMUA PRODUK
          </div>
          <h1 style={styles.title}>KATALOG TRADING CARD GAME</h1>
          <p style={styles.subtitle}>
            Jelajahi seluruh koleksi kartu yang kami distribusikan secara resmi.
          </p>
        </div>

        <div style={styles.searchWrap}>
          <span style={styles.searchIcon}>&#128269;</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama kartu di seluruh toko..."
            style={styles.searchInput}
          />
          {search && (
            <button style={styles.clearButton} onClick={() => setSearch("")}>
              &times;
            </button>
          )}
        </div>

        {loading ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyTitle}>Memuat data...</p>
            <p style={styles.emptyText}>
              Sedang mengambil data kartu dari server.
            </p>
          </div>
        ) : error ? (
          <div style={styles.emptyState}>
            <p style={{ ...styles.emptyTitle, color: "#ff6b6b" }}>
              Gagal memuat produk
            </p>
            <p style={styles.emptyText}>{error}</p>
          </div>
        ) : (
          <>
            <div style={styles.pillRow}>
              {categoriesList.map((cat) => {
                const active = cat.name === category;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setCategory(cat.name);
                      setPage(1); // Reset halaman ke 1 setiap ganti kategori
                    }}
                    style={{
                      ...styles.pill,
                      ...(active ? styles.pillActive : {}),
                    }}
                  >
                    {cat.name.toUpperCase()}
                  </button>
                );
              })}
            </div>

            <div style={styles.resultCount}>
              Total Produk: {totalItems} (Halaman {page} dari {totalPages})
            </div>

            {products.length > 0 ? (
              <>
                <div style={styles.grid}>
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div style={styles.pagination}>
                    <button
                      onClick={handlePrevPage}
                      disabled={page === 1}
                      style={{
                        ...styles.pageButton,
                        ...(page === 1 ? styles.pageButtonDisabled : {}),
                      }}
                    >
                      &#8592; Sebelumnya
                    </button>
                    <span style={styles.pageText}>
                      Halaman {page} / {totalPages}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={page === totalPages}
                      style={{
                        ...styles.pageButton,
                        ...(page === totalPages
                          ? styles.pageButtonDisabled
                          : {}),
                      }}
                    >
                      Selanjutnya &#8594;
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div style={styles.emptyState}>
                <p style={styles.emptyTitle}>Produk tidak ditemukan</p>
                <p style={styles.emptyText}>
                  Tidak ada kartu yang cocok dengan filter atau pencarian Anda.
                </p>
                <button
                  style={styles.resetButton}
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

const ACCENT = "#c4e94c";

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg,#0a0e1a 0%,#0d1526 50%,#0a1018 100%)",
    fontFamily: "'Oswald','Arial Narrow',sans-serif",
    padding: "48px 24px 96px",
    color: "#e8ecf5",
  },
  container: { maxWidth: 1200, margin: "0 auto" },
  header: { textAlign: "center", marginBottom: 40 },
  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
    letterSpacing: "1.5px",
    fontWeight: 600,
    color: ACCENT,
    border: "1px solid rgba(196,233,76,0.35)",
    borderRadius: 999,
    padding: "8px 18px",
    marginBottom: 20,
  },
  eyebrowDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: ACCENT,
    display: "inline-block",
  },
  title: {
    fontSize: 44,
    fontWeight: 700,
    letterSpacing: "1px",
    margin: "0 0 16px",
    color: "#f5f7fb",
  },
  subtitle: {
    fontSize: 16,
    color: "#9aa5bd",
    maxWidth: 640,
    margin: "0 auto",
    lineHeight: 1.6,
    fontFamily: "Arial, sans-serif",
    fontWeight: 400,
  },
  searchWrap: { position: "relative", maxWidth: 480, margin: "0 auto 28px" },
  searchIcon: {
    position: "absolute",
    left: 16,
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: 15,
    opacity: 0.6,
  },
  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    background: "#111a2c",
    border: "1px solid #23304a",
    borderRadius: 999,
    padding: "13px 44px",
    fontSize: 14,
    color: "#e8ecf5",
    outline: "none",
    fontFamily: "Arial, sans-serif",
  },
  clearButton: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    color: "#9aa5bd",
    fontSize: 20,
    cursor: "pointer",
    padding: 4,
  },
  pillRow: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 32,
  },
  pill: {
    background: "#111a2c",
    border: "1px solid #23304a",
    borderRadius: 999,
    padding: "12px 24px",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.5px",
    color: "#9aa5bd",
    cursor: "pointer",
  },
  pillActive: { background: ACCENT, borderColor: ACCENT, color: "#132000" },
  resultCount: {
    fontSize: 14,
    color: "#9aa5bd",
    marginBottom: 20,
    fontFamily: "Arial, sans-serif",
    fontWeight: 600,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 24,
    marginBottom: 40,
  },
  card: {
    background: "#111a2c",
    border: "1px solid #1c2740",
    borderRadius: 14,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  cardImageContainer: {
    width: "100%",
    height: 220,
    backgroundColor: "#0d1526",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderBottom: "1px solid #1c2740",
  },
  cardImageElement: { width: "100%", height: "100%", objectFit: "cover" },
  noImageFallback: {
    color: "#4a5a7a",
    fontSize: 14,
    fontFamily: "Arial, sans-serif",
  },
  cardBody: {
    padding: "16px 18px 20px",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between",
  },
  cardName: {
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: "0.5px",
    margin: "0 0 16px",
    color: "#f5f7fb",
    lineHeight: 1.4,
  },
  cardMetaRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  cardCategoryText: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.5px",
    color: ACCENT,
    background: "rgba(196,233,76,0.1)",
    padding: "4px 8px",
    borderRadius: 6,
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: 600,
    color: "#fff",
    fontFamily: "Arial, sans-serif",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    border: "1px dashed #23304a",
    borderRadius: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 700,
    margin: "0 0 8px",
    color: "#f5f7fb",
  },
  emptyText: {
    fontSize: 14,
    color: "#7c869e",
    margin: "0 0 20px",
    fontFamily: "Arial, sans-serif",
  },
  resetButton: {
    background: ACCENT,
    border: "none",
    borderRadius: 999,
    padding: "10px 24px",
    fontSize: 13,
    fontWeight: 700,
    color: "#132000",
    cursor: "pointer",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginTop: 40,
  },
  pageButton: {
    background: "#1c2740",
    border: "1px solid #23304a",
    color: "#e8ecf5",
    padding: "10px 20px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "Arial, sans-serif",
    transition: "all 0.2s ease",
  },
  pageButtonDisabled: { opacity: 0.5, cursor: "not-allowed" },
  pageText: { color: "#9aa5bd", fontSize: 15, fontFamily: "Arial, sans-serif" },
};
