import { useEffect, useState } from "react";

export default function ContactSection() {
  const [sectionContent, setSectionContent] = useState({
    name: "Hubungi Tim Kami",
    content:
      "Tertarik jadi Official Tournament Store atau ingin bertanya soal distribusi produk? Kirim pesan, tim kami akan merespons secepat serangan langsung.",
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchContactContent = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL_API}/compro/contents/by-category/HUBUNGI_TIM_KAMI`,
        );
        const result = await response.json();

        if (isMounted && result.success && result.data) {
          setSectionContent({
            name: result.data.name || "Hubungi Tim Kami",
            content: result.data.content || "",
          });
        }
      } catch (error) {
        console.error("Gagal memuat konten contact section:", error);
      }
    };

    fetchContactContent();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const { firstName, lastName, email, message } = formData;

    if (!firstName || !email || !message) {
      setStatusMessage({
        type: "error",
        text: "Mohon isi Nama Depan, Email, dan Pesan Anda.",
      });
      setLoading(false);
      return;
    }

    try {
      const baseUrl = import.meta.env.VITE_BASE_URL_API;

      const res = await fetch(`${baseUrl}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          message,
          recipient: "arnerocardgame@gmail.com",
        }),
      });

      if (res.ok) {
        setStatusMessage({
          type: "success",
          text: "Pesan berhasil terkirim ke arnerocardgame@gmail.com!",
        });
        setFormData({ firstName: "", lastName: "", email: "", message: "" });
      } else {
        throw new Error("Gagal mengirim via API");
      }
    } catch (error) {
      console.warn(
        "API contacts belum aktif, mengalihkan ke Mail Client...",
        error,
      );

      const subject = encodeURIComponent(
        `[Pesan Web] Dari ${firstName} ${lastName}`.trim(),
      );
      const body = encodeURIComponent(
        `Nama: ${firstName} ${lastName}\nEmail Pengirim: ${email}\n\nPesan:\n${message}`,
      );

      window.location.href = `mailto:arnerocardgame@gmail.com?subject=${subject}&body=${body}`;

      setStatusMessage({
        type: "success",
        text: "Membuka aplikasi email Anda untuk mengirim pesan...",
      });
      setFormData({ firstName: "", lastName: "", email: "", message: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="kontak" className="py-[84px]">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-[#16264a] to-[#0a1226] border border-[#bbe150]/18 rounded-[22px] overflow-hidden shadow-2xl">
          <div className="flex flex-col bg-gradient-to-br from-[#345799]/30 to-[#bbe150]/[0.06] p-8 sm:p-[44px]">
            <span className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#bbe150]">
              Kontak & Sosial Media
            </span>

            <h3 className="mb-4 font-['Bebas_Neue',sans-serif] text-[32px] font-normal leading-tight tracking-[0.03em] text-[#dcf0a3] sm:text-[38px]">
              {sectionContent.name}
            </h3>

            <div
              className="text-[14px] leading-[1.8] text-[#94a3c4] [&_p]:mb-3 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: sectionContent.content }}
            />

            <div className="mt-auto pt-8 sm:pt-10">
              <a
                href="mailto:arnerocardgame@gmail.com"
                className="group flex items-center gap-4 rounded-2xl border border-[#bbe150]/20 bg-[#bbe150]/[0.05] p-4 transition-colors hover:border-[#bbe150]/40 hover:bg-[#bbe150]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#bbe150]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#bbe150]/10 text-[#bbe150]">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="3" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </span>

                <span className="min-w-0">
                  <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.12em] text-[#94a3c4]">
                    Kirim Email
                  </span>
                  <span className="block break-all text-[14px] font-semibold text-[#dcf0a3] sm:text-[15px]">
                    arnerocardgame@gmail.com
                  </span>
                </span>
              </a>

              <div className="mt-6 border-t border-white/10 pt-6">
                <p className="mb-3 text-[12px] font-medium text-[#94a3c4]">
                  Ikuti aktivitas terbaru kami
                </p>

                <div className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-3">
                  {[
                    {
                      name: "Facebook",
                      href: "https://www.facebook.com/share/19FDDpFg5K/",
                      icon: (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M13.5 22v-9h3l.5-4h-3.5V7c0-1.16.32-2 2-2H17V1.4A20 20 0 0 0 14.5 1C11.5 1 9.5 2.82 9.5 6.2V9h-3v4h3v9h4Z" />
                        </svg>
                      ),
                    },
                    {
                      name: "Instagram",
                      href: "https://www.instagram.com/arnero_tcg?igsi=MXdhdjg4bmthbXJuNQ==",
                      icon: (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          aria-hidden="true"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="5" />
                          <circle cx="12" cy="12" r="4" />
                          <circle
                            cx="17.5"
                            cy="6.5"
                            r="1"
                            fill="currentColor"
                            stroke="none"
                          />
                        </svg>
                      ),
                    },
                    {
                      name: "TikTok",
                      href: "https://www.tiktok.com/@arnero.card.shop?_r=1&_t=ZS-99SCAUuFuYn",
                      icon: (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M16.7 2h-3.4v13.4a3 3 0 1 1-2.6-3V9a6.4 6.4 0 1 0 6 6.4V8.6a8.4 8.4 0 0 0 4.8 1.5V6.7A4.8 4.8 0 0 1 16.7 2Z" />
                        </svg>
                      ),
                    },
                  ].map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Kunjungi ${social.name} Arnero (tab baru)`}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-[12px] font-semibold text-[#94a3c4] transition-colors hover:border-[#bbe150]/30 hover:bg-[#bbe150]/10 hover:text-[#dcf0a3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bbe150]"
                    >
                      <span className="shrink-0">{social.icon}</span>
                      {social.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-8 sm:p-[44px] flex flex-col justify-center"
          >
            {statusMessage && (
              <div
                className={`p-3.5 rounded-[9px] text-[13px] mb-4 ${
                  statusMessage.type === "error"
                    ? "bg-red-500/20 text-red-200 border border-red-500/30"
                    : "bg-[#bbe150]/20 text-[#dcf0a3] border border-[#bbe150]/30"
                }`}
              >
                {statusMessage.text}
              </div>
            )}

            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Nama Depan"
              required
              className="w-full bg-white/[0.04] border border-white/[0.14] rounded-[9px] py-3.5 px-4 text-[#f5f5f0] font-['Manrope',sans-serif] text-[14px] mb-3.5 focus:outline-none focus:border-[#bbe150] transition-colors"
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Nama Belakang"
              className="w-full bg-white/[0.04] border border-white/[0.14] rounded-[9px] py-3.5 px-4 text-[#f5f5f0] font-['Manrope',sans-serif] text-[14px] mb-3.5 focus:outline-none focus:border-[#bbe150] transition-colors"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Anda"
              required
              className="w-full bg-white/[0.04] border border-white/[0.14] rounded-[9px] py-3.5 px-4 text-[#f5f5f0] font-['Manrope',sans-serif] text-[14px] mb-3.5 focus:outline-none focus:border-[#bbe150] transition-colors"
            />
            <textarea
              rows={4}
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Pesan Anda"
              required
              className="w-full bg-white/[0.04] border border-white/[0.14] rounded-[9px] py-3.5 px-4 text-[#f5f5f0] font-['Manrope',sans-serif] text-[14px] mb-3.5 focus:outline-none focus:border-[#bbe150] transition-colors resize-none"
            ></textarea>

            <button
              type="submit"
              disabled={loading}
              className="w-full justify-center mt-1.5 py-3.5 px-6 rounded-[10px] font-bold text-[14px] font-['Bebas_Neue',sans-serif] tracking-[0.05em] uppercase inline-flex items-center gap-2 bg-[#bbe150] text-[#12220a] shadow-[0_8px_24px_rgba(187,225,80,0.3)] hover:-translate-y-0.5 transition-transform duration-200 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Mengirim..." : "Kirim Pesan"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
