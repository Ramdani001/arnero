import React, { useRef } from "react";
import CardArt from "./CardArt";

export default function MiniCard({ name, tag, seed, imageUrl, price }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateX(${y * -14}deg) rotateY(${x * 16}deg) translateY(-4px)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "none";
  };

  return (
    <div
      className="bg-[#16264a] border border-[#bbe150]/18 rounded-[14px] p-4 transition-all duration-300 ease-out shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] [transform-style:preserve-3d] cursor-pointer flex flex-col h-full"
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="h-[150px] rounded-[9px] mb-3.5 relative overflow-hidden border border-white/10 shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover absolute top-0 left-0"
            loading="lazy"
          />
        ) : (
          <CardArt seed={seed} />
        )}
      </div>

      <div className="pt-3 flex-grow flex flex-col justify-between">
        <h4 className="font-['Bebas_Neue',sans-serif] font-normal text-[17px] text-[#f5f5f0] mb-1 tracking-[0.02em] leading-[1.4] line-clamp-1">
          {name}
        </h4>

        <div className="flex justify-between items-end mt-2">
          <div className="text-[11px] text-[#dcf0a3] tracking-[0.08em] uppercase m-0">
            {tag}
          </div>
          {price && (
            <div className="text-[14px] font-semibold text-[#c4e94c] m-0">
              {price}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
