import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const FALLBACK_LOGO = "/Logo.jpeg";

export default function Header({ navOpen, setNavOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [headerTitle, setHeaderTitle] = useState("");
  const [navLinks, setNavLinks] = useState([]);
  const [loadingMenus, setLoadingMenus] = useState(true);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = navOpen ? "hidden" : originalStyle;
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [navOpen]);

  useEffect(() => {
    let isMounted = true;

    const fetchHeaderData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_BASE_URL_API;

        const [titleRes, menusRes] = await Promise.all([
          fetch(`${baseUrl}/compro/contents/by-category/HEADER_TITLE`),
          fetch(
            `${baseUrl}/menus?page=1&limit=1000000&sortBy=order&sortOrder=asc&category=COMPANY_PROFILE`,
          ),
        ]);

        const titleResult = await titleRes.json();
        const menusResult = await menusRes.json();

        if (isMounted) {
          if (titleResult?.success && titleResult?.data?.content) {
            setHeaderTitle(titleResult.data.content);
          }

          if (menusResult?.success && Array.isArray(menusResult.data)) {
            const activeMenus = menusResult.data.filter(
              (item) => item.isActive,
            );
            setNavLinks(activeMenus);
          }
        }
      } catch (error) {
        console.error("Gagal memuat data header:", error);
      } finally {
        if (isMounted) setLoadingMenus(false);
      }
    };

    fetchHeaderData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleNavClick = (targetUrl) => {
    setNavOpen(false);
    if (!targetUrl) return;

    const hashIndex = targetUrl.indexOf("#");
    const sectionId =
      hashIndex !== -1 ? targetUrl.substring(hashIndex + 1) : null;

    const isHomePage =
      location.pathname === "/" ||
      location.pathname === "/arnero" ||
      location.pathname === "/arnero/";

    if (isHomePage && sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    if (targetUrl.startsWith("http://") || targetUrl.startsWith("https://")) {
      window.location.href = targetUrl;
    } else {
      navigate(targetUrl);
    }
  };

  const isLinkActive = (url) => {
    if (!url) return false;
    if (url.startsWith("#")) return location.hash === url;
    return location.pathname === url;
  };

  const contactMenuUrl =
    navLinks.find((item) => item.label.toLowerCase() === "kontak")?.url ||
    "/#kontak";

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-[#0c1730]/85 backdrop-blur-md border-b border-[#bbe150]/15 text-[#f5f5f0] font-sans transition-colors duration-300">
      <nav className="flex items-center justify-between px-6 py-3.5 max-w-7xl mx-auto">
        <div
          onClick={() => {
            navigate("/");
            setNavOpen(false);
          }}
          className="flex items-center gap-3 font-bold text-lg md:text-xl tracking-wide uppercase cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-[#bbe150]/20 shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:border-[#bbe150]/50">
            <img
              src="/Logo.jpeg"
              alt="Logo"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_LOGO;
              }}
            />
          </div>
          <span
            className="group-hover:text-[#dcf0a3] transition-colors duration-200 line-clamp-1"
            dangerouslySetInnerHTML={{
              __html: headerTitle || "Arnero Card Game Store",
            }}
          />
        </div>

        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {!loadingMenus &&
            navLinks.map((menu) => {
              const active = isLinkActive(menu.url);
              return (
                <button
                  key={menu.id}
                  onClick={() => handleNavClick(menu.url)}
                  className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                    active
                      ? "text-[#bbe150] bg-[#bbe150]/10"
                      : "text-[#94a3c4] hover:text-[#f5f5f0] hover:bg-white/5"
                  }`}
                >
                  {menu.label}
                  {active && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#bbe150] rounded-full" />
                  )}
                </button>
              );
            })}
        </div>

        <button
          onClick={() => handleNavClick(contactMenuUrl)}
          className="hidden md:inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-bold bg-[#bbe150] text-[#12220a] tracking-wide shadow-[0_4px_14px_rgba(187,225,80,0.25)] hover:shadow-[0_6px_20px_rgba(187,225,80,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
        >
          Hubungi Kami
        </button>

        <button
          className="md:hidden flex items-center justify-center w-10 h-10 border border-[#bbe150]/30 rounded-xl text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
          aria-label={navOpen ? "Tutup menu" : "Buka menu"}
          onClick={() => setNavOpen((v) => !v)}
        >
          <svg
            className="w-6 h-6 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {navOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-[#bbe150]/10 ${
          navOpen
            ? "max-h-[80vh] opacity-100 bg-[#0c1730]/95 backdrop-blur-xl py-4"
            : "max-h-0 opacity-0 py-0 border-transparent"
        }`}
      >
        <div className="flex flex-col px-6 gap-1.5">
          {!loadingMenus &&
            navLinks.map((menu) => {
              const active = isLinkActive(menu.url);
              return (
                <button
                  key={menu.id}
                  onClick={() => handleNavClick(menu.url)}
                  className={`text-left px-4 py-3 rounded-xl font-semibold text-base transition-all duration-200 cursor-pointer ${
                    active
                      ? "text-[#bbe150] bg-[#bbe150]/10 border-l-4 border-[#bbe150]"
                      : "text-[#94a3c4] hover:text-[#f5f5f0] hover:bg-white/5"
                  }`}
                >
                  {menu.label}
                </button>
              );
            })}

          <button
            onClick={() => handleNavClick(contactMenuUrl)}
            className="mt-3 text-center px-5 py-3 rounded-xl text-base font-bold bg-[#bbe150] text-[#12220a] shadow-[0_4px_14px_rgba(187,225,80,0.25)] active:scale-95 transition-all cursor-pointer"
          >
            Hubungi Kami
          </button>
        </div>
      </div>
    </header>
  );
}
