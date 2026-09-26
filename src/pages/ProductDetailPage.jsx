import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { ProductCard } from "../components/ProductCard";
import { formatRupiah } from "../utils/helpers";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [navOpen, setNavOpen] = useState(false);

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchProductDetail = async () => {
      setLoading(true);
      setError(null);
      setSelectedImageIndex(0);

      try {
        const baseUrl = import.meta.env.VITE_BASE_URL_API;
        const res = await fetch(`${baseUrl}/cards/${id}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Produk tidak ditemukan (status ${res.status})`);
        }

        const json = await res.json();

        if (isMounted && json.success && json.data) {
          setProduct(json.data);

          const primaryCategory = json.data.categories?.[0]?.category?.name;
          fetchRelated(baseUrl, primaryCategory, json.data.id, controller.signal);
        } else {
          throw new Error(json.message || "Gagal memuat detail produk");
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Gagal memuat detail kartu:", err);
          if (isMounted) {
            setError(err.message || "Gagal memuat detail kartu");
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const fetchRelated = async (baseUrl, categoryName, currentId, signal) => {
      setLoadingRelated(true);
      try {
        let url = `${baseUrl}/cards?page=1&limit=5&stock=on`;
        if (categoryName) {
          url += `&categories=${encodeURIComponent(categoryName)}`;
        }
        const res = await fetch(url, { signal });
        if (!res.ok) return;

        const json = await res.json();
        if (isMounted && json.success && Array.isArray(json.data)) {
          const filtered = json.data.filter((item) => item.id !== currentId).slice(0, 4);
          setRelatedProducts(filtered);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Gagal memuat produk terkait:", err);
        }
      } finally {
        if (isMounted) setLoadingRelated(false);
      }
    };

    fetchProductDetail();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id]);

  const images = product?.images && product.images.length > 0 ? product.images : [];
  const activeImage = images[selectedImageIndex]?.url || images[0]?.url || null;

  const categories = product?.categories || [];
  const primaryCategoryName = categories[0]?.category?.name || "Koleksi Kartu";

  const mailtoSubject = encodeURIComponent(`Tanya Produk: ${product?.name || ""}`);
  const mailtoBody = encodeURIComponent(
    `Halo Tim Arnero Card Game,\n\nSaya ingin menanyakan ketersediaan / informasi produk berikut:\nNama: ${product?.name || ""}\nID: ${product?.id || ""}\n\nTerima kasih.`,
  );
  const emailInquiryUrl = `mailto:arnerocardgame@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

  return (
    <div className="min-h-screen bg-[#070a12] font-sans text-[#e8ecf5] pt-20 selection:bg-[#c4e94c] selection:text-[#0a1018] flex flex-col justify-between">
      <Header navOpen={navOpen} setNavOpen={setNavOpen} />

      <main className="max-w-7xl mx-auto px-6 py-8 w-full flex-grow">
        {/* Breadcrumb & Back Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[#1c2740]/80">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#7c869e] overflow-x-auto py-1">
            <Link to="/" className="hover:text-[#c4e94c] transition-colors whitespace-nowrap">
              Beranda
            </Link>
            <span>/</span>
            <Link to="/products" className="hover:text-[#c4e94c] transition-colors whitespace-nowrap">
              Katalog
            </Link>
            {product?.name && (
              <>
                <span>/</span>
                <span className="text-[#c4e94c] font-medium truncate max-w-[200px] sm:max-w-xs">
                  {product.name}
                </span>
              </>
            )}
          </nav>

          <button
            onClick={() => {
              if (window.history.length > 2) {
                navigate(-1);
              } else {
                navigate("/products");
              }
            }}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#9aa5bd] hover:text-[#c4e94c] transition-colors cursor-pointer bg-[#0d1526]/80 hover:bg-[#131f38] border border-[#23304a] rounded-xl px-3.5 py-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Katalog
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 animate-pulse">
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="w-full aspect-[3/4] bg-[#0d1526] border border-[#1c2740] rounded-2xl" />
              <div className="flex gap-3">
                <div className="w-16 h-20 bg-[#0d1526] rounded-xl border border-[#1c2740]" />
                <div className="w-16 h-20 bg-[#0d1526] rounded-xl border border-[#1c2740]" />
              </div>
            </div>
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="w-24 h-6 bg-[#0d1526] rounded-full" />
              <div className="w-3/4 h-10 bg-[#0d1526] rounded-xl" />
              <div className="w-1/3 h-8 bg-[#0d1526] rounded-xl" />
              <div className="w-full h-40 bg-[#0d1526] rounded-2xl mt-4" />
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-20 px-6 border border-dashed border-red-500/30 rounded-3xl bg-red-500/5 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4 text-red-400">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Produk Tidak Ditemukan</h2>
            <p className="text-sm text-[#9aa5bd] mb-6">{error}</p>
            <button
              onClick={() => navigate("/products")}
              className="bg-[#c4e94c] text-[#0f1700] rounded-xl py-2.5 px-6 text-xs font-bold hover:bg-[#b0d53c] transition-colors shadow-lg cursor-pointer"
            >
              Lihat Katalog Lainnya
            </button>
          </div>
        )}

        {/* Product Details Content */}
        {!loading && !error && product && (
          <div className="space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Visual Showcase */}
              <div className="lg:col-span-5">
                <div className="relative group bg-[#0d1526] border border-[#1c2740] rounded-2xl p-4 sm:p-6 overflow-hidden shadow-2xl flex flex-col items-center justify-center">
                  <div className="absolute -top-24 -left-24 w-56 h-56 bg-[#bbe150]/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="w-full aspect-[3/4] max-h-[500px] flex items-center justify-center overflow-hidden rounded-xl bg-[#090d17] relative border border-[#1b263b]">
                    {activeImage ? (
                      <img
                        src={activeImage}
                        alt={product.name}
                        className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-[#4a5a7a] p-6 text-center">
                        <svg className="w-16 h-16 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs font-semibold tracking-wider uppercase">Tidak Ada Gambar</span>
                      </div>
                    )}

                    {product.stock <= 0 && (
                      <div className="absolute top-3 right-3 bg-red-500/90 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                        Stok Habis
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Selector */}
                  {images.length > 1 && (
                    <div className="flex items-center gap-3 mt-4 w-full overflow-x-auto pb-1">
                      {images.map((img, idx) => (
                        <button
                          key={img.id || idx}
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 bg-[#090d17] p-1 ${
                            selectedImageIndex === idx
                              ? "border-[#c4e94c] scale-105 shadow-[0_0_12px_rgba(196,233,76,0.3)]"
                              : "border-[#1c2740] opacity-60 hover:opacity-100 hover:border-[#c4e94c]/40"
                          }`}
                        >
                          <img
                            src={img.url}
                            alt={`${product.name} thumbnail ${idx + 1}`}
                            className="w-full h-full object-contain"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Information & Details */}
              <div className="lg:col-span-7 flex flex-col space-y-6">
                {/* Category Tags */}
                {categories.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    {categories.map((c) => (
                      <span
                        key={c.categoryId || c.category?.id}
                        className="text-[11px] font-bold tracking-wider text-[#c4e94c] bg-[#c4e94c]/10 border border-[#c4e94c]/20 px-3 py-1 rounded-full uppercase"
                      >
                        {c.category?.name || primaryCategoryName}
                      </span>
                    ))}
                  </div>
                )}

                {/* Card Title */}
                <div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white uppercase font-['Oswald',sans-serif] leading-tight">
                    {product.name}
                  </h1>
                </div>

                {/* Price & Stock Container */}
                <div className="bg-[#0d1526]/90 border border-[#1c2740] rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-inner">
                  <div>
                    <span className="text-xs text-[#7c869e] block font-medium mb-1">Harga Resmi</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#c4e94c] tracking-tight">
                      {formatRupiah(product.price || 0)}
                    </span>
                  </div>

                  <div>
                    {product.stock > 0 ? (
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#bbe150]/15 text-[#dcf0a3] border border-[#bbe150]/30">
                        <span className="w-2 h-2 rounded-full bg-[#bbe150] shadow-[0_0_8px_#bbe150]" />
                        Stok Tersedia: {product.stock}
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/5 text-[#9aa5bd] border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-red-400" />
                        Stok Habis
                      </div>
                    )}
                  </div>
                </div>

                {/* Metadata / Specifications (Only render available fields) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {product.sku && (
                    <div className="bg-[#0d1526]/60 border border-[#1b263b] rounded-xl p-3.5">
                      <span className="text-[11px] text-[#7c869e] block uppercase font-medium">SKU</span>
                      <span className="text-xs sm:text-sm font-semibold text-white tracking-wide">{product.sku}</span>
                    </div>
                  )}

                  {product.weight !== null && product.weight !== undefined && (
                    <div className="bg-[#0d1526]/60 border border-[#1b263b] rounded-xl p-3.5">
                      <span className="text-[11px] text-[#7c869e] block uppercase font-medium">Berat</span>
                      <span className="text-xs sm:text-sm font-semibold text-white tracking-wide">{product.weight} kg</span>
                    </div>
                  )}

                  {product.minQtyPurchase && (
                    <div className="bg-[#0d1526]/60 border border-[#1b263b] rounded-xl p-3.5">
                      <span className="text-[11px] text-[#7c869e] block uppercase font-medium">Min. Pembelian</span>
                      <span className="text-xs sm:text-sm font-semibold text-white tracking-wide">{product.minQtyPurchase}</span>
                    </div>
                  )}

                  {product.maxQtyPurchase && (
                    <div className="bg-[#0d1526]/60 border border-[#1b263b] rounded-xl p-3.5">
                      <span className="text-[11px] text-[#7c869e] block uppercase font-medium">Maks. Pembelian</span>
                      <span className="text-xs sm:text-sm font-semibold text-white tracking-wide">{product.maxQtyPurchase}</span>
                    </div>
                  )}
                </div>

                {/* Description Box */}
                {product.description && (
                  <div className="bg-[#0d1526]/80 border border-[#23304a] rounded-2xl p-5 sm:p-6 shadow-sm">
                    <h3 className="text-xs font-bold tracking-widest text-[#c4e94c] uppercase mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c4e94c]" />
                      Deskripsi Produk
                    </h3>
                    <div className="text-sm text-[#cbd5e1] leading-relaxed whitespace-pre-wrap font-sans">
                      {product.description}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                  <a
                    href={emailInquiryUrl}
                    className="inline-flex items-center justify-center gap-2 bg-[#c4e94c] text-[#0f1700] hover:bg-[#b0d53c] font-bold text-sm tracking-wide py-3.5 px-6 rounded-xl transition-all duration-200 shadow-[0_6px_20px_rgba(196,233,76,0.25)] active:scale-98 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Tanya Produk via Email
                  </a>

                  <button
                    onClick={() => navigate("/products")}
                    className="inline-flex items-center justify-center gap-2 bg-[#0d1526] hover:bg-[#131f38] text-[#9aa5bd] hover:text-white border border-[#23304a] hover:border-[#c4e94c]/50 font-semibold text-sm py-3.5 px-6 rounded-xl transition-all duration-200 cursor-pointer"
                  >
                    Lihat Produk Lainnya
                  </button>
                </div>
              </div>
            </div>

            {/* Related Cards Section */}
            {(loadingRelated || relatedProducts.length > 0) && (
              <div className="pt-12 border-t border-[#1c2740]">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <span className="text-xs font-bold tracking-widest text-[#c4e94c] uppercase block mb-1">
                      Koleksi Pilihan
                    </span>
                    <h2 className="text-2xl font-bold uppercase tracking-wide text-white font-['Oswald',sans-serif]">
                      Produk Terkait
                    </h2>
                  </div>

                  <Link
                    to="/products"
                    className="text-xs font-semibold text-[#9aa5bd] hover:text-[#c4e94c] transition-colors"
                  >
                    Lihat Semua →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {loadingRelated
                    ? [...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="bg-[#0d1526]/40 border border-[#1b263b] rounded-2xl p-4 animate-pulse h-[340px] flex flex-col justify-between"
                        >
                          <div className="w-full h-44 bg-[#182338] rounded-xl mb-4" />
                          <div className="space-y-3">
                            <div className="h-4 bg-[#182338] rounded w-3/4" />
                            <div className="h-3 bg-[#182338] rounded w-1/2" />
                          </div>
                          <div className="h-6 bg-[#182338] rounded-lg mt-4" />
                        </div>
                      ))
                    : relatedProducts.map((item) => (
                        <ProductCard key={item.id} product={item} />
                      ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
