import React, { useMemo, useState } from "react";
import Header from "../components/Header";
import "../styles/site.css";

const CATEGORIES = ["Semua", "Yu-Gi-Oh!", "Duel Masters", "TCG Lainnya"];

const RARITIES = [
  "Semua Rarity",
  "Common",
  "Rare",
  "Attribute Rare",
  "Ultra Rare",
  "Secret Rare",
];

const PRODUCTS = [
  { id: 1, name: "Voltguard Dragon", category: "Yu-Gi-Oh!", rarity: "Attribute Rare", price: 185000, gradient: "linear-gradient(135deg,#3b6fd6,#8fce4f)" },
  { id: 2, name: "Twin Fang Serpent", category: "Yu-Gi-Oh!", rarity: "Ultra Rare", price: 225000, gradient: "linear-gradient(135deg,#2f4f8f,#c4e94c)" },
  { id: 3, name: "Solar Phoenix Ace", category: "Yu-Gi-Oh!", rarity: "Secret Rare", price: 349000, gradient: "linear-gradient(135deg,#7fb3e8,#c4e94c)" },
  { id: 4, name: "Iron Duelist Golem", category: "Yu-Gi-Oh!", rarity: "Common", price: 45000, gradient: "linear-gradient(135deg,#c4e94c,#7fb3e8)" },
  { id: 5, name: "Frost Widow Spider", category: "Duel Masters", rarity: "Rare", price: 95000, gradient: "linear-gradient(135deg,#4f8fd6,#3b6fd6)" },
  { id: 6, name: "Ember Colossus", category: "Duel Masters", rarity: "Ultra Rare", price: 260000, gradient: "linear-gradient(135deg,#c4e94c,#4f8fd6)" },
  { id: 7, name: "Verdant Guardian", category: "Duel Masters", rarity: "Attribute Rare", price: 175000, gradient: "linear-gradient(135deg,#8fce4f,#2f4f8f)" },
  { id: 8, name: "Shadow Reaper Knight", category: "Duel Masters", rarity: "Secret Rare", price: 399000, gradient: "linear-gradient(135deg,#3b6fd6,#c4e94c)" },
  { id: 9, name: "Storm Herald", category: "TCG Lainnya", rarity: "Rare", price: 89000, gradient: "linear-gradient(135deg,#7fb3e8,#8fce4f)" },
  { id: 10, name: "Runeblade Sentinel", category: "TCG Lainnya", rarity: "Ultra Rare", price: 210000, gradient: "linear-gradient(135deg,#c4e94c,#3b6fd6)" },
  { id: 11, name: "Abyssal Kraken", category: "TCG Lainnya", rarity: "Secret Rare", price: 420000, gradient: "linear-gradient(135deg,#2f4f8f,#8fce4f)" },
  { id: 12, name: "Copper Automaton", category: "TCG Lainnya", rarity: "Common", price: 39000, gradient: "linear-gradient(135deg,#8fce4f,#3b6fd6)" },
];

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function ProductCard({ product }) {
  return (
    <div style={styles.card}>
      <div style={{ ...styles.cardImage, background: product.gradient }}>
        <div style={styles.cardShapeCircle} />
        <div style={styles.cardShapePoly} />
      </div>
      <div style={styles.cardBody}>
        <h3 style={styles.cardName}>{product.name.toUpperCase()}</h3>
        <div style={styles.cardMetaRow}>
          <span style={styles.cardRarity}>{product.rarity.toUpperCase()}</span>
          <span style={styles.cardPrice}>{formatRupiah(product.price)}</span>
        </div>
      </div>
    </div>
  );
}

export default function ProductCatalogPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [rarity, setRarity] = useState("Semua Rarity");
   const [navOpen, setNavOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const matchesSearch = query === "" || p.name.toLowerCase().includes(query);
      const matchesCategory = category === "Semua" || p.category === category;
      const matchesRarity = rarity === "Semua Rarity" || p.rarity === rarity;
      return matchesSearch && matchesCategory && matchesRarity;
    });
  }, [search, category, rarity]);

  return (
    <div style={styles.page}>
      <Header navOpen={navOpen} setNavOpen={setNavOpen} />
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.eyebrow}>
            <span style={styles.eyebrowDot} />
            SEMUA PRODUK
          </div>
          <h1 style={styles.title}>KATALOG TRADING CARD GAME</h1>
          <p style={styles.subtitle}>
            Jelajahi seluruh koleksi kartu yang kami distribusikan secara resmi.
            Gunakan pencarian atau filter untuk menemukan kartu incaranmu.
          </p>
        </div>

        {/* Search bar */}
        <div style={styles.searchWrap}>
          <span style={styles.searchIcon}>&#128269;</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama kartu..."
            style={styles.searchInput}
          />
          {search && (
            <button style={styles.clearButton} onClick={() => setSearch("")}>
              &times;
            </button>
          )}
        </div>

        {/* Category filter pills */}
        <div style={styles.pillRow}>
          {CATEGORIES.map((cat) => {
            const active = cat === category;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  ...styles.pill,
                  ...(active ? styles.pillActive : {}),
                }}
              >
                {cat.toUpperCase()}
              </button>
            );
          })}
        </div>

        {/* Rarity filter */}
        <div style={styles.rarityRow}>
          {RARITIES.map((r) => {
            const active = r === rarity;
            return (
              <button
                key={r}
                onClick={() => setRarity(r)}
                style={{
                  ...styles.rarityChip,
                  ...(active ? styles.rarityChipActive : {}),
                }}
              >
                {r}
              </button>
            );
          })}
        </div>

        {/* Result count */}
        <div style={styles.resultCount}>
          Menampilkan {filteredProducts.length} dari {PRODUCTS.length} produk
        </div>

        {/* Product grid */}
        {filteredProducts.length > 0 ? (
          <div style={styles.grid}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <p style={styles.emptyTitle}>Kartu tidak ditemukan</p>
            <p style={styles.emptyText}>
              Coba ubah kata kunci pencarian atau reset filter kategori dan rarity.
            </p>
            <button
              style={styles.resetButton}
              onClick={() => {
                setSearch("");
                setCategory("Semua");
                setRarity("Semua Rarity");
              }}
            >
              Reset Filter
            </button>
          </div>
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
  container: {
    maxWidth: 1200,
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: 40,
  },
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
  searchWrap: {
    position: "relative",
    maxWidth: 480,
    margin: "0 auto 28px",
  },
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
    lineHeight: 1,
    padding: 4,
  },
  pillRow: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 18,
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
  pillActive: {
    background: ACCENT,
    borderColor: ACCENT,
    color: "#132000",
  },
  rarityRow: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 32,
  },
  rarityChip: {
    background: "transparent",
    border: "1px solid #23304a",
    borderRadius: 8,
    padding: "7px 14px",
    fontSize: 12,
    color: "#7c869e",
    cursor: "pointer",
    fontFamily: "Arial, sans-serif",
  },
  rarityChipActive: {
    borderColor: ACCENT,
    color: ACCENT,
    background: "rgba(196,233,76,0.08)",
  },
  resultCount: {
    fontSize: 13,
    color: "#7c869e",
    marginBottom: 16,
    fontFamily: "Arial, sans-serif",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 24,
  },
  card: {
    background: "#111a2c",
    border: "1px solid #1c2740",
    borderRadius: 14,
    overflow: "hidden",
  },
  cardImage: {
    position: "relative",
    height: 170,
    overflow: "hidden",
  },
  cardShapeCircle: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: "50%",
    background: "rgba(0,0,0,0.18)",
    top: "30%",
    left: "48%",
  },
  cardShapePoly: {
    position: "absolute",
    width: 80,
    height: 110,
    background: "rgba(0,0,0,0.18)",
    clipPath: "polygon(20% 0%, 100% 15%, 80% 100%, 0% 85%)",
    top: "12%",
    left: "35%",
  },
  cardBody: {
    padding: "16px 18px 20px",
  },
  cardName: {
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: "0.5px",
    margin: "0 0 8px",
    color: "#f5f7fb",
  },
  cardMetaRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardRarity: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.5px",
    color: ACCENT,
  },
  cardPrice: {
    fontSize: 13,
    fontWeight: 600,
    color: "#9aa5bd",
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
};
