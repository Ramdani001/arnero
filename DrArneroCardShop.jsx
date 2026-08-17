import React, { useState } from "react";
import "./styles/site.css";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import AboutSection from "./components/AboutSection";
import ProductsSection from "./components/ProductsSection";
import StatsSection from "./components/StatsSection";
import PartnersSection from "./components/PartnersSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

export default function DrArneroCardShop() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="site">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <div className="bg-field"></div>
      <div className="bg-grid"></div>

      <Header navOpen={navOpen} setNavOpen={setNavOpen} />
      <Hero />
      <Marquee />
      <AboutSection />
      <ProductsSection />
      <StatsSection />
      <PartnersSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
