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
      className="mini-card"
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <div
        className="mini-art"
        style={{ position: "relative", overflow: "hidden" }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              top: 0,
              left: 0,
            }}
            loading="lazy"
          />
        ) : (
          <CardArt seed={seed} />
        )}
      </div>

      <div
        style={{
          padding: "12px 0 0",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <h4 style={{ margin: "0 0 8px", fontSize: "16px", lineHeight: "1.4" }}>
          {name}
        </h4>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div className="tag" style={{ margin: 0 }}>
            {tag}
          </div>
          {price && (
            <div
              className="price"
              style={{ fontSize: "14px", fontWeight: "600", color: "#c4e94c" }}
            >
              {price}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
