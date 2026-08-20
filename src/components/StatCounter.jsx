import { useEffect, useRef, useState } from "react";

export default function StatCounter({ target, label }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !done.current) {
            done.current = true;
            const step = Math.max(1, Math.round(target / 60));
            let cur = 0;
            const t = setInterval(() => {
              cur += step;
              if (cur >= target) {
                cur = target;
                clearInterval(t);
              }
              setCount(cur);
            }, 20);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="font-['Bebas_Neue',sans-serif] font-normal text-[54px] bg-gradient-to-r from-[#dcf0a3] to-[#bbe150] bg-clip-text text-transparent leading-none"
        ref={ref}
      >
        {count}
      </div>
      <div className="text-[#94a3c4] text-[13px] tracking-[0.1em] uppercase mt-1.5 font-semibold">
        {label}
      </div>
    </div>
  );
}
