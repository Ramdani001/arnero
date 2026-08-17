import React from "react";
import { MARQUEE_ITEMS } from "../data/content";

export default function Marquee() {
  const marqueeDouble = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="marquee">
      <div className="marquee-track">
        {marqueeDouble.map((t, i) => (
          <span key={i} className={i % 3 === 0 ? "hi" : ""}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
