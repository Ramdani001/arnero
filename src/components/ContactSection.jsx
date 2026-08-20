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
          recipient: "halo@toko-kartu.com",
        }),
      });

      if (res.ok) {
        setStatusMessage({
          type: "success",
          text: "Pesan berhasil terkirim ke halo@toko-kartu.com!",
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

      window.location.href = `mailto:halo@toko-kartu.com?subject=${subject}&body=${body}`;

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
          <div className="p-8 sm:p-[44px] bg-gradient-to-br from-[#345799]/30 to-[#bbe150]/[0.06] flex flex-col">
            <h3 className="font-['Bebas_Neue',sans-serif] font-normal text-[26px] sm:text-[30px] text-[#dcf0a3] tracking-[0.03em] mb-3.5 mt-4">
              {sectionContent.name}
            </h3>

            <div
              className="text-[#94a3c4] leading-[1.7] text-[14px] mb-6"
              dangerouslySetInnerHTML={{ __html: sectionContent.content }}
            />

            <div className="mt-auto pt-2 border-t border-[#bbe150]/10">
              <a
                href="mailto:halo@toko-kartu.com"
                className="text-[#bbe150] font-semibold hover:underline text-[16px]"
              >
                halo@toko-kartu.com
              </a>
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
