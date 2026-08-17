import React, { useState, useEffect, useRef, useCallback } from "react";

const LOGO = "data:image/jpeg;base64,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";

const PRODUCTS = {
  ygo: [
    ["Voltguard Dragon", "Attribute Rare"],
    ["Twin Fang Serpent", "Ultra Rare"],
    ["Solar Phoenix Ace", "Secret Rare"],
    ["Iron Duelist Golem", "Common"],
  ],
  dm: [
    ["Verdant Grove Beast", "Nature Civilization"],
    ["Thundersear Wyrm", "Fire Civilization"],
    ["Abyss Tide Kraken", "Water Civilization"],
    ["Nightshroud Reaper", "Darkness Civilization"],
  ],
  lain: [
    ["Sparkfur Companion", "Elemental Pocket TCG"],
    ["Crystal Warden", "Fantasy Realm TCG"],
    ["Storm Sprocket Mech", "Mecha Clash TCG"],
    ["Emberling Cub", "Elemental Pocket TCG"],
  ],
};

const TAB_LABELS = { ygo: "Yu-Gi-Oh!", dm: "Duel Masters", lain: "TCG Lainnya" };

const MARQUEE_ITEMS = [
  "DR.ARNERO CARD SHOP",
  "YU-GI-OH! OFFICIAL CARD GAME",
  "DUEL MASTERS",
  "KONAMI PARTNER",
  "TAKARA TOMY",
  "1600+ ACTIVE DUELIST",
];

const STATS = [
  { target: 82, label: "Card Shops" },
  { target: 25, label: "Events" },
  { target: 1643, label: "Players" },
];

const HUE_PAIRS = [
  ["#bbe150", "#345799"],
  ["#345799", "#bbe150"],
  ["#8fb8ff", "#bbe150"],
  ["#bbe150", "#8fb8ff"],
];

function CardArt({ seed }) {
  const [a, b] = HUE_PAIRS[seed % HUE_PAIRS.length];
  const gid = `g${seed}`;
  return (
    <svg viewBox="0 0 200 140" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={a} />
          <stop offset="100%" stopColor={b} />
        </linearGradient>
      </defs>
      <rect width="200" height="140" fill={`url(#${gid})`} />
      <polygon
        points={`${60 + seed * 7},30 ${140 - seed * 4},50 120,110 70,115`}
        fill="rgba(10,10,12,0.22)"
      />
      <circle cx={100 + (seed % 3) * 10} cy="60" r="26" fill="rgba(10,10,12,0.18)" />
    </svg>
  );
}

function MiniCard({ name, tag, seed }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateX(${y * -14}deg) rotateY(${x * 16}deg) translateY(-4px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "none";
  };
  return (
    <div className="mini-card" ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="mini-art">
        <CardArt seed={seed} />
      </div>
      <h4>{name}</h4>
      <div className="tag">{tag}</div>
    </div>
  );
}

function StatCounter({ target, label }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !done.current) {
            done.current = true;
            const step = Math.max(1, Math.round(target / 60));
            let cur = 0;
            const t = setInterval(() => {
              cur += step;
              if (cur >= target) {
                cur = target;
                clearInterval(t);
              }
              setCount(cur);
            }, 20);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  return (
    <div className="stat">
      <div className="num" ref={ref}>
        {count}
      </div>
      <div className="lbl">{label}</div>
    </div>
  );
}

export default function DrArneroCardShop() {
  const [activeTab, setActiveTab] = useState("ygo");
  const [navOpen, setNavOpen] = useState(false);
  const stageRef = useRef(null);
  const cardRef = useRef(null);

  const handleMove = useCallback((clientX, clientY) => {
    const stage = stageRef.current;
    const card = cardRef.current;
    if (!stage || !card) return;
    const r = stage.getBoundingClientRect();
    const x = (clientX - r.left) / r.width;
    const y = (clientY - r.top) / r.height;
    const rotX = (0.5 - y) * 22;
    const rotY = (x - 0.5) * 26;
    card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
    card.style.setProperty("--holo-x", `${x * 100}%`);
    card.style.setProperty("--holo-y", `${y * 100}%`);
    card.style.setProperty("--holo-o", 0.85);
  }, []);

  const onStageMouseMove = (e) => handleMove(e.clientX, e.clientY);
  const onStageTouchMove = (e) => {
    const t = e.touches[0];
    handleMove(t.clientX, t.clientY);
  };
  const onStageLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
    card.style.setProperty("--holo-o", 0.4);
  };

  const marqueeDouble = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  const navLinks = [
    ["#produk", "Produk"],
    ["#kegiatan", "Kegiatan"],
    ["#partner", "Partner"],
    ["#kontak", "Kontak"],
  ];

  return (
    <div className="site">
      <style>{`
        :root{
          --ink: #0b0b0d;
          --paper: #f5f5f0;
          --navy: #0c1730;
          --navy-2: #142542;
          --panel: #16264a;
          --blue: #345799;
          --blue-bright: #6c93da;
          --lime: #bbe150;
          --lime-soft: #dcf0a3;
          --muted: #94a3c4;
          --line: rgba(187,225,80,0.18);
          --radius: 14px;
        }
        *{box-sizing:border-box;}
        .site{
          background:var(--navy);
          color:var(--paper);
          font-family:'Manrope',sans-serif;
          overflow-x:hidden;
          position:relative;
          min-height:100vh;
        }
        .site h1,.site h2,.site h3,.site .display{
          font-family:'Bebas Neue',sans-serif;
          text-transform:uppercase;
          letter-spacing:0.03em;
          font-weight:400;
          margin:0;
        }
        .site a{color:inherit;text-decoration:none;}
        .wrap{max-width:1180px;margin:0 auto;padding:0 24px;}

        .bg-field{
          position:fixed;inset:0;z-index:0;pointer-events:none;
          background:
            radial-gradient(1100px 620px at 84% -8%, rgba(187,225,80,0.16), transparent 60%),
            radial-gradient(900px 560px at 6% 6%, rgba(52,87,153,0.35), transparent 55%),
            linear-gradient(180deg, var(--navy) 0%, #0a1226 40%, var(--navy) 100%);
        }
        .bg-grid{
          position:fixed;inset:0;z-index:0;opacity:0.3;pointer-events:none;
          background-image:
            linear-gradient(rgba(187,225,80,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(187,225,80,0.06) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: radial-gradient(circle at 50% 0%, black, transparent 75%);
        }
        .site > *:not(.bg-field):not(.bg-grid){position:relative;z-index:1;}

        header{
          position:sticky;top:0;z-index:40;
          background:rgba(12,23,48,0.78);
          backdrop-filter:blur(10px);
          border-bottom:1px solid var(--line);
        }
        nav{
          display:flex;align-items:center;justify-content:space-between;
          padding:14px 24px;max-width:1180px;margin:0 auto;
        }
        .brand{display:flex;align-items:center;gap:10px;font-family:'Bebas Neue',sans-serif;font-weight:400;font-size:22px;letter-spacing:0.04em;}
        .brand .mark{
          width:38px;height:38px;border-radius:10px;overflow:hidden;
          border:2px solid var(--lime);
          box-shadow:0 0 18px rgba(187,225,80,0.35);
          flex-shrink:0;
        }
        .brand .mark img{width:100%;height:100%;object-fit:cover;display:block;}
        .brand .shop{color:var(--lime);}
        .navlinks{display:flex;gap:28px;font-size:14px;color:var(--muted);font-weight:600;}
        .navlinks a:hover{color:var(--lime-soft);}
        .navcta{
          padding:10px 18px;border-radius:999px;font-size:13px;font-weight:700;
          background:var(--lime);color:#12220a;letter-spacing:0.02em;
          box-shadow:0 6px 20px rgba(187,225,80,0.28);
        }
        .navburger{display:none;background:none;border:1px solid var(--line);border-radius:8px;color:var(--paper);width:38px;height:38px;align-items:center;justify-content:center;cursor:pointer;}
        @media (max-width:860px){
          .navlinks{display:none;}
          .navburger{display:flex;}
        }
        .navmobile{display:none;flex-direction:column;gap:2px;padding:0 24px 18px;border-bottom:1px solid var(--line);}
        .navmobile.open{display:flex;}
        .navmobile a{padding:10px 4px;color:var(--muted);font-weight:600;font-size:14px;border-top:1px solid var(--line);}

        .hero{
          padding:88px 0 56px;
          display:grid;grid-template-columns:1.05fr 0.95fr;gap:40px;align-items:center;
        }
        @media (max-width:960px){.hero{grid-template-columns:1fr;padding-top:52px;text-align:center;} .hero-stage{margin:0 auto;}}
        .eyebrow{
          display:inline-flex;align-items:center;gap:8px;
          font-family:'Bebas Neue',sans-serif;font-weight:400;letter-spacing:0.16em;
          font-size:14px;color:var(--lime-soft);
          padding:6px 14px;border:1px solid var(--line);border-radius:999px;
          background:rgba(187,225,80,0.06);
        }
        .eyebrow::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--lime);box-shadow:0 0 8px var(--lime);}
        .hero h1{
          font-size:clamp(40px, 6vw, 68px);
          line-height:0.98; margin:20px 0 18px;
        }
        .hero h1 .accent{
          background:linear-gradient(92deg, var(--lime) 10%, var(--blue-bright) 60%, var(--lime) 100%);
          -webkit-background-clip:text;background-clip:text;color:transparent;
        }
        .hero p.lede{color:var(--muted);font-size:17px;line-height:1.65;max-width:480px;}
        @media (max-width:960px){.hero p.lede{margin:0 auto;}}
        .hero-actions{display:flex;gap:14px;margin-top:32px;flex-wrap:wrap;}
        @media (max-width:960px){.hero-actions{justify-content:center;}}
        .btn{
          padding:14px 26px;border-radius:10px;font-weight:700;font-size:14px;
          font-family:'Bebas Neue',sans-serif;letter-spacing:0.05em;text-transform:uppercase;
          display:inline-flex;align-items:center;gap:8px;cursor:pointer;border:none;
          transition:transform 0.2s ease, box-shadow 0.2s ease;
        }
        .btn:hover{transform:translateY(-2px);}
        .btn-primary{background:var(--lime);color:#12220a;box-shadow:0 8px 24px rgba(187,225,80,0.3);}
        .btn-ghost{background:transparent;color:var(--paper);border:1px solid rgba(255,255,255,0.2);}
        .btn-ghost:hover{border-color:var(--lime-soft);color:var(--lime-soft);}

        .hero-stage{position:relative;width:340px;height:460px;perspective:1200px;}
        .holo-card{
          position:relative;width:100%;height:100%;border-radius:18px;
          background:linear-gradient(160deg,#182a52,#0a1226 60%);
          border:2px solid rgba(187,225,80,0.4);
          box-shadow:0 30px 70px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.02) inset;
          transform-style:preserve-3d;
          transition:transform 0.15s ease-out;
          overflow:hidden;
          cursor:pointer;
        }
        .holo-card .frame{
          position:absolute;inset:14px;border-radius:12px;
          border:1px solid rgba(220,240,163,0.5);
          display:flex;flex-direction:column;justify-content:space-between;
          padding:16px;
        }
        .holo-card .name{font-family:'Bebas Neue',sans-serif;font-weight:400;font-size:21px;color:var(--lime-soft);letter-spacing:0.02em;}
        .holo-card .rarity{font-size:10px;color:var(--muted);letter-spacing:0.14em;text-transform:uppercase;}
        .holo-card .art{
          flex:1;margin:10px 0;border-radius:8px;
          position:relative;overflow:hidden;
          border:1px solid rgba(255,255,255,0.08);
        }
        .holo-card .art svg{position:absolute;inset:0;width:100%;height:100%;}
        .holo-card .stats{display:flex;justify-content:space-between;font-family:'Bebas Neue',sans-serif;font-weight:400;font-size:14px;color:var(--paper);}
        .holo-card .stats span{background:rgba(0,0,0,0.4);padding:4px 10px;border-radius:6px;}
        .holo-card::after{
          content:"";position:absolute;inset:0;pointer-events:none;border-radius:18px;
          background:linear-gradient(115deg,
            transparent 20%,
            rgba(255,255,255,0.32) 36%,
            rgba(187,225,80,0.28) 44%,
            transparent 52%);
          background-position: var(--holo-x,50%) var(--holo-y,50%);
          background-size:250% 250%;
          mix-blend-mode:overlay;
          opacity:var(--holo-o,0.4);
          transition:opacity 0.3s ease;
        }
        .stage-back{
          position:absolute;top:26px;left:-30px;width:100%;height:100%;
          background:linear-gradient(160deg,#182a52,#0a1226 60%);
          border:2px solid rgba(52,87,153,0.5);
          border-radius:18px;z-index:-1;transform:rotate(-8deg);opacity:0.6;
        }
        @media (max-width:960px){.stage-back{display:none;}}

        .marquee{
          border-top:1px solid var(--line);border-bottom:1px solid var(--line);
          padding:16px 0;overflow:hidden;white-space:nowrap;background:rgba(255,255,255,0.02);
        }
        .marquee-track{display:inline-flex;gap:56px;animation:scroll 26s linear infinite;font-family:'Bebas Neue',sans-serif;font-weight:400;letter-spacing:0.1em;color:var(--muted);font-size:15px;}
        .marquee-track span{opacity:0.8;}
        .marquee-track span.hi{color:var(--lime-soft);}
        @keyframes scroll{from{transform:translateX(0);}to{transform:translateX(-50%);}}

        section{padding:84px 0;}
        .head{max-width:640px;margin:0 auto 46px;text-align:center;}
        .head .eyebrow{margin-bottom:14px;}
        .head h2{font-size:clamp(30px,3.8vw,42px);}
        .head p{color:var(--muted);margin-top:14px;font-size:16px;line-height:1.6;}

        .grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;}
        @media (max-width:900px){.grid4{grid-template-columns:repeat(2,1fr);}}
        @media (max-width:520px){.grid4{grid-template-columns:1fr;}}
        .flip{perspective:1000px;height:180px;}
        .flip-inner{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform 0.6s cubic-bezier(.4,.2,.2,1);}
        .flip:hover .flip-inner{transform:rotateY(180deg);}
        .flip-face{position:absolute;inset:0;border-radius:var(--radius);backface-visibility:hidden;padding:22px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;border:1px solid var(--line);}
        .flip-front{background:var(--panel);}
        .flip-front .ic{font-size:30px;margin-bottom:12px;}
        .flip-front h3{font-size:18px;color:var(--lime-soft);}
        .flip-back{background:linear-gradient(160deg,var(--blue),#1c2f57);transform:rotateY(180deg);}
        .flip-back p{font-size:13px;line-height:1.5;color:rgba(255,255,255,0.92);}

        .tabs{display:flex;justify-content:center;gap:10px;margin-bottom:40px;flex-wrap:wrap;}
        .tab-btn{
          padding:10px 20px;border-radius:999px;border:1px solid var(--line);
          background:transparent;color:var(--muted);font-family:'Bebas Neue',sans-serif;
          font-weight:400;letter-spacing:0.04em;font-size:14px;text-transform:uppercase;cursor:pointer;
          transition:all 0.2s ease;
        }
        .tab-btn.active{background:var(--lime);color:#12220a;border-color:var(--lime);}
        .tab-panel{display:grid;grid-template-columns:repeat(4,1fr);gap:22px;}
        @media (max-width:960px){.tab-panel{grid-template-columns:repeat(2,1fr);}}
        @media (max-width:520px){.tab-panel{grid-template-columns:1fr;}}

        .mini-card{
          background:var(--panel);border:1px solid var(--line);border-radius:var(--radius);
          padding:16px;transition:transform 0.35s ease, box-shadow 0.35s ease;
          transform-style:preserve-3d;cursor:pointer;
        }
        .mini-card:hover{box-shadow:0 20px 40px rgba(0,0,0,0.4);}
        .mini-art{
          height:150px;border-radius:9px;margin-bottom:14px;position:relative;overflow:hidden;
          border:1px solid rgba(255,255,255,0.08);
        }
        .mini-art svg{width:100%;height:100%;}
        .mini-card h4{font-family:'Bebas Neue',sans-serif;font-weight:400;font-size:17px;color:var(--paper);margin-bottom:4px;letter-spacing:0.02em;}
        .mini-card .tag{font-size:11px;color:var(--lime-soft);letter-spacing:0.08em;text-transform:uppercase;}

        .stats-band{
          background:var(--panel);border:1px solid var(--line);border-radius:20px;
          display:grid;grid-template-columns:repeat(3,1fr);
        }
        @media (max-width:700px){.stats-band{grid-template-columns:1fr;}}
        .stat{padding:44px 20px;text-align:center;border-right:1px solid var(--line);}
        .stat:last-child{border-right:none;}
        @media (max-width:700px){.stat{border-right:none;border-bottom:1px solid var(--line);} .stat:last-child{border-bottom:none;}}
        .stat .num{font-family:'Bebas Neue',sans-serif;font-weight:400;font-size:54px;
          background:linear-gradient(90deg,var(--lime-soft),var(--lime));-webkit-background-clip:text;background-clip:text;color:transparent;}
        .stat .lbl{color:var(--muted);font-size:13px;letter-spacing:0.1em;text-transform:uppercase;margin-top:6px;}

        .partners{display:flex;justify-content:center;gap:60px;flex-wrap:wrap;align-items:center;opacity:0.9;}
        .partner-chip{font-family:'Bebas Neue',sans-serif;font-weight:400;font-size:22px;letter-spacing:0.06em;color:var(--muted);border:1px solid var(--line);padding:14px 26px;border-radius:10px;}
        .partner-chip:hover{color:var(--lime-soft);border-color:var(--lime-soft);}

        .contact-card{
          display:grid;grid-template-columns:1fr 1fr;
          background:linear-gradient(160deg,var(--panel),#0a1226);
          border:1px solid var(--line);border-radius:22px;overflow:hidden;
        }
        @media (max-width:860px){.contact-card{grid-template-columns:1fr;}}
        .contact-info{padding:44px;background:linear-gradient(160deg, rgba(52,87,153,0.3), rgba(187,225,80,0.06));}
        .contact-info h3{font-size:26px;color:var(--lime-soft);margin-bottom:14px;}
        .contact-info p{color:var(--muted);line-height:1.7;font-size:14px;margin-bottom:20px;}
        .contact-info .line{display:flex;gap:10px;font-size:14px;margin-bottom:10px;color:var(--paper);}
        .contact-form{padding:44px;}
        .contact-form input, .contact-form textarea{
          width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.14);
          border-radius:9px;padding:13px 14px;color:var(--paper);font-family:'Manrope',sans-serif;font-size:14px;
          margin-bottom:14px;transition:border-color 0.2s;
        }
        .contact-form input:focus, .contact-form textarea:focus{outline:none;border-color:var(--lime);}
        .contact-form .btn{width:100%;justify-content:center;margin-top:6px;}

        .spike-tag{
          display:inline-block;background:var(--ink);color:var(--paper);
          font-family:'Bebas Neue',sans-serif;letter-spacing:0.06em;font-size:13px;
          padding:8px 18px;
          clip-path:polygon(4% 0%,100% 0%,96% 100%,0% 100%);
          border:1px solid var(--lime);
        }

        footer{border-top:1px solid var(--line);padding:32px 0;text-align:center;color:var(--muted);font-size:13px;}

        @media (prefers-reduced-motion: reduce){
          .marquee-track{animation:none;}
          .flip-inner{transition:none;}
        }
      `}</style>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <div className="bg-field"></div>
      <div className="bg-grid"></div>

      <header>
        <nav>
          <div className="brand">
            <div className="mark">
              <img src={LOGO} alt="dr.Arnero Card Shop" />
            </div>
            dr.Arnero <span className="shop">CARD&nbsp;SHOP</span>
          </div>
          <div className="navlinks">
            {navLinks.map(([href, label]) => (
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
          {navLinks.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setNavOpen(false)}>
              {label}
            </a>
          ))}
        </div>
      </header>

      <section className="hero wrap">
        <div>
          <div className="eyebrow">TOKO KARTU RESMI — INDONESIA</div>
          <h1>
            SETIAP KARTU
            <br />
            ADALAH <span className="accent">AWAL DUEL</span> BARU
          </h1>
          <p className="lede">
            dr.Arnero Card Shop menghadirkan Yu-Gi-Oh!, Duel Masters, dan trading card game
            pilihan lainnya ke seluruh penjuru Indonesia — dari booster pack hingga arena
            turnamen.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#produk">
              Jelajahi Produk →
            </a>
            <a className="btn btn-ghost" href="#kontak">
              Jadi Official Store
            </a>
          </div>
        </div>

        <div
          className="hero-stage"
          ref={stageRef}
          onMouseMove={onStageMouseMove}
          onMouseLeave={onStageLeave}
          onTouchMove={onStageTouchMove}
        >
          <div className="stage-back"></div>
          <div className="holo-card" ref={cardRef}>
            <div className="frame">
              <div>
                <div className="name">Fydraulis Harmonia</div>
                <div className="rarity">✦ Ultra Rare · Energy Type</div>
              </div>
              <div className="art">
                <CardArt seed={0} />
              </div>
              <div className="stats">
                <span>PWR 2800</span>
                <span>DEF 2200</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="marquee">
        <div className="marquee-track">
          {marqueeDouble.map((t, i) => (
            <span key={i} className={i % 3 === 0 ? "hi" : ""}>
              {t}
            </span>
          ))}
        </div>
      </div>

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
            {[
              ["🎪", "Event Organizing", "Menyelenggarakan turnamen resmi dan komunitas rutin di berbagai kota, dari regional hingga skala nasional."],
              ["📦", "Distribusi Produk", "Menyalurkan booster pack, structure deck, dan aksesori resmi ke toko-toko kartu di seluruh Indonesia."],
              ["🤝", "Bangun Komunitas", "Merawat komunitas duelist lewat kelas, klub, dan program loyalitas untuk pemain baru maupun veteran."],
              ["🏆", "Material Turnamen", "Menyediakan playmat, sleeve, trophy, dan seluruh perlengkapan resmi untuk penyelenggara event."],
            ].map(([ic, title, back]) => (
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

      <section id="produk">
        <div className="wrap">
          <div className="head">
            <div className="eyebrow">PRODUK ANDALAN</div>
            <h2>Koleksi Trading Card Game</h2>
            <p>
              Dari duel monster klasik hingga strategi elemen — jelajahi lini produk yang kami
              distribusikan secara resmi.
            </p>
          </div>

          <div className="tabs">
            {Object.keys(PRODUCTS).map((key) => (
              <button
                key={key}
                className={`tab-btn${activeTab === key ? " active" : ""}`}
                onClick={() => setActiveTab(key)}
              >
                {TAB_LABELS[key]}
              </button>
            ))}
          </div>

          <div className="tab-panel">
            {PRODUCTS[activeTab].map(([name, tag], i) => (
              <MiniCard key={name} name={name} tag={tag} seed={i} />
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="stats-band">
            {STATS.map((s) => (
              <StatCounter key={s.label} target={s.target} label={s.label} />
            ))}
          </div>
        </div>
      </section>

      <section id="partner">
        <div className="wrap">
          <div className="head">
            <div className="eyebrow">PARTNER RESMI</div>
            <h2>Dipercaya Studio Global</h2>
          </div>
          <div className="partners">
            <div className="partner-chip">KONAMI</div>
            <div className="partner-chip">TAKARA TOMY</div>
            <div className="partner-chip">DR.ARNERO GROUP</div>
          </div>
        </div>
      </section>

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

      <footer>© 2026 dr.Arnero Card Shop — Official Distributor</footer>
    </div>
  );
}