import React, { useRef } from "react";
import CardArt from "./CardArt";

export default function MiniCard({ name, tag, seed }) {
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
    <div className="mini-card" ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="mini-art">
        <CardArt seed={seed} />
      </div>
      <h4>{name}</h4>
      <div className="tag">{tag}</div>
    </div>
  );
}
