import React, { useRef, useCallback } from "react";
import CardArt from "./CardArt";

export default function Hero() {
  const stageRef = useRef(null);
  const cardRef = useRef(null);

  const handleMove = useCallback((clientX, clientY) => {
    const stage = stageRef.current;
    const card = cardRef.current;
    if (!stage || !card) return;
    const r = stage.getBoundingClientRect();
    const x = (clientX - r.left) / r.width;
    const y = (clientY - r.top) / r.height;
    const rotX = (0.5 - y) * 22;
    const rotY = (x - 0.5) * 26;
    card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
    card.style.setProperty("--holo-x", `${x * 100}%`);
    card.style.setProperty("--holo-y", `${y * 100}%`);
    card.style.setProperty("--holo-o", 0.85);
  }, []);

  const onStageMouseMove = (e) => handleMove(e.clientX, e.clientY);
  const onStageTouchMove = (e) => {
    const t = e.touches[0];
    handleMove(t.clientX, t.clientY);
  };
  const onStageLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
    card.style.setProperty("--holo-o", 0.4);
  };

  return (
    <section className="hero wrap">
      <div>
        <div className="eyebrow">TOKO KARTU RESMI — INDONESIA</div>
        <h1>
          SETIAP KARTU
          <br />
          ADALAH <span className="accent">AWAL DUEL</span> BARU
        </h1>
        <p className="lede">
          dr.Arnero Card Shop menghadirkan Yu-Gi-Oh!, Duel Masters, dan trading card game
          pilihan lainnya ke seluruh penjuru Indonesia — dari booster pack hingga arena
          turnamen.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#produk">
            Jelajahi Produk →
          </a>
          <a className="btn btn-ghost" href="#kontak">
            Jadi Official Store
          </a>
        </div>
      </div>

      <div
        className="hero-stage"
        ref={stageRef}
        onMouseMove={onStageMouseMove}
        onMouseLeave={onStageLeave}
        onTouchMove={onStageTouchMove}
      >
        <div className="stage-back"></div>
        <div className="holo-card" ref={cardRef}>
          <div className="frame">
            <div>
              <div className="name">Fydraulis Harmonia</div>
              <div className="rarity">✦ Ultra Rare · Energy Type</div>
            </div>
            <div className="art">
              <CardArt seed={0} />
            </div>
            <div className="stats">
              <span>PWR 2800</span>
              <span>DEF 2200</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
