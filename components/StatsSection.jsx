import React from "react";
import StatCounter from "./StatCounter";
import { STATS } from "../data/content";

export default function StatsSection() {
  return (
    <section>
      <div className="wrap">
        <div className="stats-band">
          {STATS.map((s) => (
            <StatCounter key={s.label} target={s.target} label={s.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
