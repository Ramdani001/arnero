import React from "react";

export default function ContactSection() {
  return (
    <section id="kontak">
      <div className="wrap">
        <div className="contact-card">
          <div className="contact-info">
            <span className="spike-tag" style={{ marginBottom: 16 }}>
              MULAI DUEL
            </span>
            <h3 style={{ marginTop: 16 }}>Hubungi Tim Kami</h3>
            <p>
              Tertarik jadi Official Tournament Store atau ingin bertanya soal distribusi
              produk? Kirim pesan, tim kami akan merespons secepat serangan langsung.
            </p>
            <div className="line">📍 Slipi City, Central Park, Jakarta Barat</div>
            <div className="line">📞 +62 856-2443-2695</div>
            <div className="line">✉️ indo@drarnero.com</div>
          </div>
          <div className="contact-form">
            <input type="text" placeholder="Nama Depan" />
            <input type="text" placeholder="Nama Belakang" />
            <input type="email" placeholder="Email" />
            <textarea rows={4} placeholder="Pesan"></textarea>
            <button className="btn btn-primary">Kirim Pesan</button>
          </div>
        </div>
      </div>
    </section>
  );
}
