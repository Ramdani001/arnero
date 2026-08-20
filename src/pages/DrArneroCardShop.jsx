import { useEffect, useState } from "react";

import AboutSection from "../components/AboutSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import PartnersSection from "../components/PartnersSection";
import ProductsSection from "../components/ProductsSection";
import StatsSection from "../components/StatsSection";
import { useLocation } from "react-router-dom";

export default function DrArneroCardShop() {
  const [navOpen, setNavOpen] = useState(false);
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");

      const timer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [hash]);

  return (
    <div className="min-h-screen relative bg-[#0c1730] text-[#f5f5f0] font-['Manrope',sans-serif] overflow-x-hidden selection:bg-[#bbe150] selection:text-[#12220a]">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(1100px_620px_at_84%_-8%,rgba(187,225,80,0.16),transparent_60%),radial-gradient(900px_560px_at_6%_6%,rgba(52,87,153,0.35),transparent_55%),linear-gradient(180deg,#0c1730_0%,#0a1226_40%,#0c1730_100%]" />
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30 bg-[linear-gradient(to_right,rgba(187,225,80,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(187,225,80,0.06)_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:radial-gradient(circle_at_50%_0%,black,transparent_75%)]" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header navOpen={navOpen} setNavOpen={setNavOpen} />

        <main className="flex-grow">
          <Hero />
          <Marquee />
          <AboutSection />
          <ProductsSection />
          <StatsSection />
          <PartnersSection />
          <ContactSection />
        </main>

        <Footer />
      </div>
    </div>
  );
}
