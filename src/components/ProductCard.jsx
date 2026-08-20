import { formatRupiah } from "../utils/helpers";

export function ProductCard({ product }) {
  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url;

  const displayCategory = product.categories?.[0]?.category?.name || "Lainnya";

  return (
    <div className="bg-[#111a2c] border border-[#1c2740] rounded-[14px] overflow-hidden flex flex-col transition-all duration-300 hover:border-[#c4e94c]/40 hover:-translate-y-1 shadow-md">
      <div className="w-full h-[220px] bg-[#0d1526] flex items-center justify-center overflow-hidden border-b border-[#1c2740] relative">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="text-[#4a5a7a] text-[14px] font-sans">No Image</div>
        )}
      </div>
      <div className="p-[18px] flex flex-col flex-grow justify-between">
        <h3 className="text-[16px] font-bold tracking-[0.5px] mb-4 text-[#f5f7fb] line-clamp-2">
          {product.name?.toUpperCase()}
        </h3>
        <div className="flex justify-between items-end gap-2">
          <span className="text-[11px] font-bold tracking-[0.5px] text-[#c4e94c] bg-[#c4e94c]/10 px-2 py-1 rounded-[6px] uppercase">
            {displayCategory}
          </span>
          <span className="text-[15px] font-semibold text-white font-sans">
            {formatRupiah(product.price || 0)}
          </span>
        </div>
      </div>
    </div>
  );
}
