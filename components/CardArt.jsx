import React from "react";
import { HUE_PAIRS } from "../data/content";

export default function CardArt({ seed }) {
  const [a, b] = HUE_PAIRS[seed % HUE_PAIRS.length];
  const gid = `g${seed}`;
  return (
    <svg viewBox="0 0 200 140" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={a} />
          <stop offset="100%" stopColor={b} />
        </linearGradient>
      </defs>
      <rect width="200" height="140" fill={`url(#${gid})`} />
      <polygon
        points={`${60 + seed * 7},30 ${140 - seed * 4},50 120,110 70,115`}
        fill="rgba(10,10,12,0.22)"
      />
      <circle cx={100 + (seed % 3) * 10} cy="60" r="26" fill="rgba(10,10,12,0.18)" />
    </svg>
  );
}
