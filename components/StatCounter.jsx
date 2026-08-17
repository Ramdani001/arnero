import React, { useState, useEffect, useRef } from "react";

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
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  return (
    <div className="stat">
      <div className="num" ref={ref}>
        {count}
      </div>
      <div className="lbl">{label}</div>
    </div>
  );
}
