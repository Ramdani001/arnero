import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Header({ navOpen, setNavOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [logoUrl, setLogoUrl] = useState(
    "https://is3.cloudhost.id/tokokartu/Production/toko-kartu-logo.png",
  );
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

  const contactMenuUrl =
    navLinks.find((item) => item.label.toLowerCase() === "kontak")?.url ||
    "/#kontak";

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-[#0c1730]/80 backdrop-blur-md border-b border-[#bbe150]/20 text-[#f5f5f0] font-sans">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div
          onClick={() => {
            navigate("/");
            setNavOpen(false);
          }}
          className="flex items-center gap-3 font-bold text-xl tracking-wide uppercase cursor-pointer group"
        >
          <div className="w-10 h-10 overflow-hidden shrink-0 transition-transform group-hover:scale-105">
            <img
              src={logoUrl}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_LOGO;
              }}
            />
          </div>
          <span
            className="group-hover:text-[#dcf0a3] transition-colors"
            dangerouslySetInnerHTML={{
              __html: headerTitle || "dr.Arnero Card Shop",
            }}
          ></span>
        </div>

        <div className="hidden md:flex gap-8 text-sm font-semibold text-[#94a3c4]">
          {!loadingMenus &&
            navLinks.map((menu) => (
              <button
                key={menu.id}
                onClick={() => handleNavClick(menu.url)}
                className="hover:text-[#dcf0a3] transition-colors bg-transparent border-0 cursor-pointer text-sm font-semibold text-[#94a3c4]"
              >
                {menu.label}
              </button>
            ))}
        </div>

        <button
          onClick={() => handleNavClick(contactMenuUrl)}
          className="hidden md:inline-flex px-5 py-2.5 rounded-full text-sm font-bold bg-[#bbe150] text-[#12220a] tracking-wide shadow-[0_6px_20px_rgba(187,225,80,0.28)] hover:-translate-y-0.5 transition-transform cursor-pointer"
        >
          Hubungi Kami
        </button>

        <button
          className="md:hidden flex items-center justify-center w-10 h-10 border border-[#bbe150]/30 rounded-lg text-white hover:bg-white/10 transition-colors"
          aria-label={navOpen ? "Tutup menu" : "Buka menu"}
          onClick={() => setNavOpen((v) => !v)}
        >
          {navOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </nav>

      <div
        className={`absolute top-full left-0 w-full bg-[#0c1730]/95 backdrop-blur-xl border-b border-[#bbe150]/20 flex flex-col overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          navOpen ? "max-h-screen opacity-100 py-4" : "max-h-0 opacity-0 py-0"
        }`}
      >
        <div className="flex flex-col px-6 gap-2">
          {!loadingMenus &&
            navLinks.map((menu) => (
              <button
                key={menu.id}
                onClick={() => handleNavClick(menu.url)}
                className="text-left px-2 py-3 text-[#94a3c4] font-semibold text-base border-b border-[#bbe150]/10 hover:text-[#dcf0a3] transition-colors bg-transparent border-x-0 border-t-0 cursor-pointer"
              >
                {menu.label}
              </button>
            ))}

          <button
            onClick={() => handleNavClick(contactMenuUrl)}
            className="mt-4 text-center px-5 py-3 rounded-xl text-base font-bold bg-[#bbe150] text-[#12220a] shadow-[0_6px_20px_rgba(187,225,80,0.28)] active:scale-95 transition-transform cursor-pointer"
          >
            Hubungi Kami
          </button>
        </div>
      </div>
    </header>
  );
}
