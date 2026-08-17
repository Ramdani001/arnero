import React, { useState } from "react";
import MiniCard from "./MiniCard";
import { PRODUCTS, TAB_LABELS } from "../data/content";

export default function ProductsSection() {
  const [activeTab, setActiveTab] = useState("ygo");

  return (
    <section id="produk">
      <div className="wrap">
        <div className="head">
          <div className="eyebrow">PRODUK ANDALAN</div>
          <h2>Koleksi Trading Card Game</h2>
          <p>
            Dari duel monster klasik hingga strategi elemen — jelajahi lini produk yang kami
            distribusikan secara resmi.
          </p>
        </div>

        <div className="tabs">
          {Object.keys(PRODUCTS).map((key) => (
            <button
              key={key}
              className={`tab-btn${activeTab === key ? " active" : ""}`}
              onClick={() => setActiveTab(key)}
            >
              {TAB_LABELS[key]}
            </button>
          ))}
        </div>

        <div className="tab-panel">
          {PRODUCTS[activeTab].map(([name, tag], i) => (
            <MiniCard key={name} name={name} tag={tag} seed={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
