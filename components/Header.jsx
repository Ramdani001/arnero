import React from "react";
import { LOGO } from "../assets/logo";
import { NAV_LINKS } from "../data/content";

export default function Header({ navOpen, setNavOpen }) {
  return (
    <header>
      <nav>
        <div className="brand">
          <div className="mark">
            <img src={LOGO} alt="dr.Arnero Card Shop" />
          </div>
          dr.Arnero <span className="shop">CARD&nbsp;SHOP</span>
        </div>
        <div className="navlinks">
          {NAV_LINKS.map(([href, label]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </div>
        <a className="navcta" href="#kontak">
          Hubungi Kami
        </a>
        <button
          className="navburger"
          aria-label="Buka menu"
          onClick={() => setNavOpen((v) => !v)}
        >
          {navOpen ? "✕" : "☰"}
        </button>
      </nav>
      <div className={`navmobile${navOpen ? " open" : ""}`}>
        {NAV_LINKS.map(([href, label]) => (
          <a key={href} href={href} onClick={() => setNavOpen(false)}>
            {label}
          </a>
        ))}
      </div>
    </header>
  );
}
