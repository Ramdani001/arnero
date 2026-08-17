import React from "react";
import { ABOUT_CARDS } from "../data/content";

export default function AboutSection() {
  return (
    <section id="kegiatan">
      <div className="wrap">
        <div className="head">
          <div className="eyebrow">SIAPA KAMI</div>
          <h2>Promise Made, Promise Kept</h2>
          <p>
            Berdiri sejak 2016, dr.Arnero Card Shop fokus mendistribusikan trading card game
            dan koleksi resmi dari Jepang dan Eropa ke seluruh komunitas duelist Indonesia.
          </p>
        </div>
        <div className="grid4">
          {ABOUT_CARDS.map(([ic, title, back]) => (
            <div className="flip" key={title}>
              <div className="flip-inner">
                <div className="flip-face flip-front">
                  <div className="ic">{ic}</div>
                  <h3>{title}</h3>
                </div>
                <div className="flip-face flip-back">
                  <p>{back}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
