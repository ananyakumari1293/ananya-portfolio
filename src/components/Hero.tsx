import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ananya from "../assets/ananya.jpg";
export default function Hero() {
  const navigate = useNavigate();
  const [hoveredSticky, setHoveredSticky] = useState<string | null>(null);
  const adventureRef = useRef<HTMLDivElement | null>(null);
  // Proactively inject Nunito & Dancing Script Google Fonts, and custom keyframes on mount
  useEffect(() => {
    // 1. Google Font Link
    const fontLink = document.createElement("link");
    fontLink.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Dancing+Script:wght@700&family=Caveat:wght@700&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);
    // 2. CSS Animations stylesheet
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      @keyframes floatY {
        0%, 100% { transform: translateY(0px) rotate(var(--r, 0deg)); }
        50% { transform: translateY(-12px) rotate(var(--r, 0deg)); }
      }
      @keyframes floatSpin {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-10px) rotate(20deg); }
      }
      @keyframes spinPop {
        0% { transform: scale(0) rotate(-180deg); opacity: 0; }
        60% { transform: scale(1.2) rotate(10deg); }
        100% { transform: scale(1) rotate(0); opacity: 1; }
      }
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.07); }
      }
      @keyframes shimmer {
        0% { background-position: 200% center; }
        100% { background-position: -200% center; }
      }
      @keyframes orbitRing {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(22px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes stickyEntrance {
        from { opacity: 0; transform: translateX(30px) rotate(var(--rot, 3deg)); }
        to { opacity: 1; transform: translateX(0) rotate(var(--rot, 3deg)); }
      }
      @keyframes starTwinkle {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.4; transform: scale(0.7); }
      }
      @keyframes navGlow {
        0%, 100% { box-shadow: 0 4px 24px rgba(255, 130, 180, 0.15); }
        50% { box-shadow: 0 4px 32px rgba(255, 130, 180, 0.3); }
      }
      @keyframes glowPulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(236, 72, 153, 0); }
        50% { box-shadow: 0 0 0 10px rgba(236, 72, 153, 0.18); }
      }
      .float-doodle { pointer-events: none; z-index: 15; position: absolute; font-size: 2.2rem; }
      .d1 { top: 8%; left: -4%; animation: floatY 3s ease-in-out infinite; --r: -10deg; }
      .d2 { top: 5%; right: 0%; animation: floatY 2.8s 0.3s ease-in-out infinite; --r: 8deg; }
      .d3 { bottom: 14%; left: -6%; animation: floatSpin 3.5s ease-in-out infinite; }
      .d4 { bottom: 8%; right: -2%; animation: floatY 3.2s 0.6s ease-in-out infinite; --r: 12deg; }
      .d5 { top: 38%; right: -8%; animation: floatY 4s 0.9s ease-in-out infinite; --r: -5deg; }
      .d6 { top: 25%; left: -10%; animation: floatY 2.6s 1.2s ease-in-out infinite; --r: 6deg; font-size: 1.6rem; }
      .star-float { pointer-events: none; z-index: 12; position: absolute; animation: starTwinkle 2s ease-in-out infinite; }
      .sf1 { top: 2%; left: 38%; font-size: 1.4rem; animation-delay: 0.2s; }
      .sf2 { top: 52%; left: -8%; font-size: 1rem; animation-delay: 0.7s; }
      .sf3 { bottom: 20%; right: 22%; font-size: 1.2rem; animation-delay: 1.1s; }
      .animate-fade-up { animation: fadeUp 0.8s ease both; }
      .animate-nav-glow { animation: navGlow 3s ease-in-out infinite; }
      .animate-shimmer-text {
        background: linear-gradient(135deg, #ec4899, #f97316, #a855f7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-size: 200% auto;
        animation: shimmer 4s linear infinite;
      }
      
      /* Webkit scrollbars styling inside page */
      ::-webkit-scrollbar {
        width: 8px;
      }
      ::-webkit-scrollbar-track {
        background: #fff8f4;
      }
      ::-webkit-scrollbar-thumb {
        background: #fbcfe8;
        border-radius: 999px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #f472b6;
      }
    `;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(fontLink);
      document.head.removeChild(styleSheet);
    };
  }, []);
  return (
    <div
      className="min-h-screen bg-[#fff8f4] overflow-x-hidden relative"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      {/* 1. NAVBAR */}
      <nav className="mx-6 mt-5 bg-white rounded-[40px] px-8 py-4 flex items-center justify-between border border-pink-100 shadow-[0_4px_24px_rgba(255,130,180,0.15)] animate-nav-glow z-40 relative select-none">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          AK<span className="text-pink-500">.</span>
        </h1>
        <div className="hidden md:flex gap-8 font-extrabold text-slate-700 text-[15px]">
          {["Home", "About", "Projects", "Skills", "Contact"].map((link) => (
            <a
              key={link}
              href="#"
              className="relative transition-all duration-300 hover:text-pink-500 after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:height-[2.5px] after:bg-gradient-to-r after:from-pink-500 after:to-purple-500 after:rounded-full after:transition-all after:duration-300 hover:after:w-full"
            >
              {link}
            </a>
          ))}
        </div>
        {/* Beautiful Pastel Resume Button */}
        <button
          className="
            bg-gradient-to-r
            from-pink-100
            to-purple-100
            text-pink-700
            px-7
            py-3
            rounded-full
            font-extrabold
            border
            border-pink-200
            shadow-md
            hover:from-pink-200
            hover:to-purple-200
            hover:scale-105
            transition-all
            duration-300
          "
        >
          📄 Resume
        </button>
      </nav>
      {/* 2. HERO GRID */}
      <section className="max-w-7xl mx-auto px-8 py-14 grid lg:grid-cols-2 gap-10 items-center select-none relative z-10">
        
        {/* LEFT COLUMN: HERO INFORMATION */}
        <div className="animate-fade-up text-left">
          <p
            className="text-pink-500 text-5xl mb-4 leading-tight"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            Hey, I'm Ananya 👋
          </p>
          <div className="relative inline-block">
            {/* Playful highlight blob under heading */}
            <div
              className="
                absolute
                left-12
                bottom-3
                w-[290px]
                h-11
                bg-pink-100
                rounded-full
                rotate-[-2.5deg]
                opacity-70
                -z-10
              "
            />
            <h1 className="text-7xl font-black leading-tight text-slate-900">
              Building things
              <br />
              that <span className="animate-shimmer-text">matter.</span>
            </h1>
          </div>
          <p className="mt-8 text-lg font-semibold text-slate-500 leading-relaxed max-w-xl">
            Computer Science Engineering student at VIT Bhopal, passionate
            about coding, designing and turning ideas into products people
            actually enjoy using.
          </p>
          <p
            className="mt-3 text-pink-500 text-3xl font-extrabold"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            code ✦ create ✦ repeat
          </p>
          {/* Core Professional Disciplines (Pastel Badges) */}
          <div className="flex flex-wrap gap-4 mt-10">
            <div
              className="
                bg-pink-100
                text-pink-700
                font-extrabold
                px-8
                py-4
                rounded-full
                border
                border-pink-200
                shadow-sm
                hover:bg-pink-200
                hover:scale-105
                transition-all
                duration-300
                cursor-default
                text-sm
                flex
                items-center
                gap-2
              "
            >
              💻 Web Developer
            </div>
            <div
              className="
                bg-purple-100
                text-purple-700
                font-extrabold
                px-8
                py-4
                rounded-full
                border
                border-purple-200
                shadow-sm
                hover:bg-purple-200
                hover:scale-105
                transition-all
                duration-300
                cursor-default
                text-sm
                flex
                items-center
                gap-2
              "
            >
              📊 Data Enthusiast
            </div>
          </div>
          {/* Bouncing Scroll Down to Adventure Section Button */}
          <button
            onClick={() => adventureRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="mt-10 flex items-center gap-2 bg-white hover:bg-pink-50 border-2 border-pink-200 text-pink-600 font-extrabold px-6 py-4 rounded-full shadow-[0_6px_0_#fda4af,0_10px_20px_rgba(0,0,0,0.08)] transform hover:-translate-y-0.5 active:translate-y-0.5 transition-all text-xs uppercase tracking-wider animate-bounce select-none cursor-pointer"
          >
            <span>👇 Scroll Down to Choose Your Adventure</span>
            <span className="text-base">✨</span>
          </button>
        </div>
        {/* RIGHT COLUMN: INTERACTIVE PHOTO & STICKIES */}
        <div className="relative flex justify-center items-center min-h-[500px] select-none">
          {/* Radial Blob Backdrop */}
          <div className="absolute z-0 w-[480px] h-[480px] rounded-full bg-pink-200 blur-3xl opacity-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          {/* Winding Orbit Rings */}
          <div className="absolute w-[430px] h-[430px] rounded-full border-2 border-dashed border-pink-400/40 animate-spin [animation-duration:22s] pointer-events-none" />
          <div className="absolute w-[360px] h-[360px] rounded-full border-[1.5px] border-dotted border-purple-400/30 animate-spin [animation-duration:15s] [animation-direction:reverse] pointer-events-none" />
          {/* Twinkling Stars */}
          <div className="star-float sf1">⭐</div>
          <div className="star-float sf2">✨</div>
          <div className="star-float sf3">💫</div>
          {/* Floating animated Doodles/Stickers */}
          <div className="float-doodle d1">🎮</div>
          <div className="float-doodle d2">👾</div>
          <div className="float-doodle d3">🍭</div>
          <div className="float-doodle d4">🍓</div>
          <div className="float-doodle d5">🥝</div>
          <div className="float-doodle d6">🍋</div>
          {/* Hero Portrait Wrapper */}
          <div className="relative z-20 group">
            {/* Bouncing Crown Badge directly over her head */}
            <div
              className="absolute -top-12 left-1/2 -translate-x-1/2 text-6xl z-30 select-none pointer-events-none"
              style={{ animation: "floatY 2.5s ease-in-out infinite", "--r": "0deg" } as React.CSSProperties}
            >
              👑
            </div>
            {/* Glossy Photo Circle */}
            <div
              className="relative z-20 w-[320px] h-[320px] rounded-full overflow-hidden border-[6px] border-white shadow-[0_20px_60px_rgba(236,72,153,0.35)] transition-all duration-500 hover:scale-105"
              style={{
                animation: "glowPulse 3s ease-in-out infinite",
              }}
            >
              <img
                src={ananya}
                alt="Ananya"
                className="w-full h-full object-cover object-top"
              />
            </div>
            {/* Lower sticker note overlay */}
            <div
              className="
                absolute
                -bottom-4
                left-1/2
                -translate-x-1/2
                bg-white
                border
                border-pink-100
                px-8
                py-2.5
                rounded-full
                shadow-[0_8px_16px_rgba(0,0,0,0.15)]
                z-30
                rotate-[-2deg]
                font-black
                text-slate-800
                text-sm
                whitespace-nowrap
                transition-all
                group-hover:rotate-0
              "
            >
              building cool things 🚀
            </div>
          </div>
          {/* Interactive Sticky Notes */}
          <div
            onMouseEnter={() => setHoveredSticky("s1")}
            onMouseLeave={() => setHoveredSticky(null)}
            className="absolute top-[5%] right-[-5%] bg-pink-100 border border-pink-200 px-5 py-4 rounded-2xl shadow-xl z-30 max-w-[200px] text-xs font-black text-pink-900 leading-relaxed cursor-default transition-all duration-300"
            style={{
              transform: hoveredSticky === "s1" ? "rotate(0deg) scale(1.08)" : "rotate(4deg) scale(1)",
              animation: "stickyEntrance 0.8s ease both",
              animationDelay: "0.6s",
            }}
          >
            💡 I love turning ideas into products
          </div>
          <div
            onMouseEnter={() => setHoveredSticky("s2")}
            onMouseLeave={() => setHoveredSticky(null)}
            className="absolute top-[48%] right-[-10%] bg-yellow-100 border border-yellow-200 px-5 py-4 rounded-2xl shadow-xl z-30 max-w-[200px] text-xs font-black text-amber-900 leading-relaxed cursor-default transition-all duration-300"
            style={{
              transform: hoveredSticky === "s2" ? "rotate(0deg) scale(1.08)" : "rotate(-3deg) scale(1)",
              animation: "stickyEntrance 0.8s ease both",
              animationDelay: "0.9s",
            }}
          >
            ⚡ Solving problems one bug at a time
          </div>
          <div
            onMouseEnter={() => setHoveredSticky("s3")}
            onMouseLeave={() => setHoveredSticky(null)}
            className="absolute bottom-[6%] right-[-4%] bg-blue-100 border border-blue-200 px-5 py-4 rounded-2xl shadow-xl z-30 max-w-[200px] text-xs font-black text-blue-900 leading-relaxed cursor-default transition-all duration-300"
            style={{
              transform: hoveredSticky === "s3" ? "rotate(0deg) scale(1.08)" : "rotate(3deg) scale(1)",
              animation: "stickyEntrance 0.8s ease both",
              animationDelay: "1.2s",
            }}
          >
            💻 Exploring AI &amp; New Tech
          </div>
        </div>
      </section>
      {/* 3. GAME ADVENTURE WORLDS SECTOR */}
      <section
        ref={adventureRef}
        className="max-w-6xl mx-auto px-8 pb-20 pt-10 select-none relative z-10 scroll-mt-6"
      >
        <h2 className="text-center text-5xl font-black text-slate-900 leading-tight">
          Choose Your Adventure <span className="text-pink-500">✨</span>
        </h2>
        <p className="text-center text-slate-500 text-lg font-bold mt-2 mb-12">
          Four distinct worlds. Four ways to discover my developer story.
        </p>
        {/* Bubbly Game Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Level 01 Card - Candy Crush */}
          <div
            onClick={() => navigate("/candy-crush")}
            className="relative bg-pink-100/50 hover:bg-pink-300/80 border border-pink-200 hover:border-pink-400 text-slate-800 rounded-[28px] p-8 shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-3 hover:rotate-[-1deg] group"
            style={{
              boxShadow: "0 10px 25px rgba(236,72,153,0.06)",
            }}
          >
            <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-[9px] font-black text-pink-700 shadow uppercase tracking-wider select-none border border-pink-100">
              LVL 01
            </div>
            <div className="text-6xl mb-4 transform group-hover:scale-110 group-hover:rotate-[15deg] transition-all duration-300 w-fit select-none">
              🍭
            </div>
            <h3 className="font-black text-xl text-slate-900 leading-tight">
              Candy Crush World
            </h3>
            <p className="text-slate-600 font-bold text-[13px] mt-2 leading-snug">
              About Me &amp; Education
            </p>
          </div>
          {/* Level 02 Card - Fruit Ninja */}
          <div
            onClick={() => navigate("/fruit-ninja")}
            className="relative bg-emerald-100/50 hover:bg-emerald-300/80 border border-emerald-200 hover:border-emerald-400 text-slate-800 rounded-[28px] p-8 shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-3 hover:rotate-[1deg] group"
            style={{
              boxShadow: "0 10px 25px rgba(16,185,129,0.06)",
            }}
          >
            <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-[9px] font-black text-emerald-700 shadow uppercase tracking-wider select-none border border-emerald-100">
              LVL 02
            </div>
            <div className="text-6xl mb-4 transform group-hover:scale-110 group-hover:rotate-[-15deg] transition-all duration-300 w-fit select-none">
              🍉
            </div>
            <h3 className="font-black text-xl text-slate-900 leading-tight">
              Fruit Ninja World
            </h3>
            <p className="text-slate-650 font-bold text-[13px] mt-2 leading-snug">
              Projects Portfolio
            </p>
          </div>
          {/* Level 03 Card - Skill Strike Arena */}
          <div
            onClick={() => navigate("/glitch-zone")}
            className="relative bg-purple-100/50 hover:bg-purple-300/80 border border-purple-200 hover:border-purple-400 text-slate-800 rounded-[28px] p-8 shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-3 hover:rotate-[-1deg] group"
            style={{
              boxShadow: "0 10px 25px rgba(139,92,246,0.06)",
            }}
          >
            <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-[9px] font-black text-purple-700 shadow uppercase tracking-wider select-none border border-purple-100">
              LVL 03
            </div>
            <div className="text-6xl mb-4 transform group-hover:scale-110 group-hover:rotate-[15deg] transition-all duration-300 w-fit select-none">
              🎳
            </div>
            <h3 className="font-black text-xl text-slate-900 leading-tight">
              Skill Strike Arena
            </h3>
            <p className="text-slate-650 font-bold text-[13px] mt-2 leading-snug">
              Technical Skills &amp; Strengths
            </p>
          </div>
          {/* Level 04 Card - Cooking Mama */}
          <div
            onClick={() => navigate("/cooking-mama")}
            className="relative bg-yellow-100/50 hover:bg-yellow-300/80 border border-yellow-250 hover:border-yellow-400 text-slate-800 rounded-[28px] p-8 shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-3 hover:rotate-[1deg] group"
            style={{
              boxShadow: "0 10px 25px rgba(245,158,11,0.06)",
            }}
          >
            <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-[9px] font-black text-amber-700 shadow uppercase tracking-wider select-none border border-yellow-100">
              LVL 04
            </div>
            <div className="text-6xl mb-4 transform group-hover:scale-110 group-hover:rotate-[-15deg] transition-all duration-300 w-fit select-none">
              🍳
            </div>
            <h3 className="font-black text-xl text-slate-900 leading-tight">
              Cooking Mama
            </h3>
            <p className="text-slate-650 font-bold text-[13px] mt-2 leading-snug">
              Contact Me
            </p>
          </div>
        </div>
      </section>
      {/* 3.5 SWEET PERSONAL NOTE SECTOR */}
      <section className="max-w-3xl mx-auto px-8 pb-16 pt-6 select-none relative z-10">
        <div 
          className="bg-[#fffdf9] border-2 border-pink-200/60 rounded-[32px] p-8 md:p-10 shadow-[0_15px_30px_rgba(253,164,186,0.15)] relative overflow-hidden"
          style={{
            borderRadius: "30px 20px 40px 20px / 20px 30px 25px 35px", // Playful organic paper shape
          }}
        >
          {/* Cute pink decorative tape at the top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-pink-100/80 border-b border-pink-200/50 shadow-sm rotate-[-1deg]" />
          {/* Sparkly corner stars */}
          <span className="absolute top-6 left-6 text-2xl text-pink-400 animate-pulse">✨</span>
          <span className="absolute bottom-6 right-6 text-2xl text-purple-400 animate-bounce">💫</span>
          <div className="text-left relative z-10">
            <h3 
              className="text-pink-500 text-3xl font-extrabold mb-4"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              A little note for you... 📝
            </h3>
            <div className="space-y-4 text-slate-700 font-semibold text-base leading-relaxed">
              <p>
                I hope you enjoyed exploring these four interactive levels! From matches in the <strong>Candy Crush World</strong> to slashes in the <strong>Fruit Ninja Projects</strong>, and throwing strikes in the <strong>Skill Arena</strong> to slicing sweet treats in the <strong>Contact Bakery</strong>—I absolutely love blending software engineering with high-fidelity, playful experiences.
              </p>
              <p>
                Underneath these playful visuals lies a deeply creative engineering mind. I have a genuine passion for leveraging modern technologies and AI to turn unique, out-of-the-box ideas into functional digital products. 
              </p>
              <p>
                If you are looking for a developer who doesn't just write code, but builds memorable digital journeys and brings fresh, creative perspectives to the table... <strong>I'm your builder! Let's connect and make something truly outstanding together. ✨</strong>
              </p>
            </div>
            {/* Handwritten Signature */}
            <div className="mt-8 flex items-center justify-between border-t border-pink-100/60 pt-4">
              <div>
                <span className="text-stone-400 text-xs font-bold uppercase tracking-wider block">Yours truly,</span>
                <span 
                  className="text-pink-500 text-3xl font-black block mt-1"
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                >
                  Ananya Kumari 💖
                </span>
              </div>
              {/* Bubbly direct CTA button to the contact section */}
              <button
                onClick={() => adventureRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="bg-pink-100 hover:bg-pink-200 border border-pink-200 text-pink-700 font-extrabold px-6 py-3 rounded-full text-xs uppercase tracking-wider transition-all transform hover:scale-105 active:scale-95 shadow-sm"
              >
                🍳 Slice a cake to connect!
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* 4. FOOTER */}
      <footer className="w-full text-center py-8 text-stone-400 font-black text-xs uppercase tracking-widest select-none relative z-10 border-t border-pink-100/40">
        Made with 💖 by Ananya Kumari | VIT Bhopal | 2026
      </footer>
    </div>
  );
}
