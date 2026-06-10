import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
// Definition for Cakes data structure (icon removed to prevent type compile error)
interface CakeData {
  id: "strawberry" | "blueberry" | "chocolate";
  title: string;
  emoji: string;
  recipeName: string;
  value: string;
  label: string;
  description: string;
  color: string;
  frostingColor: string;
  creamColor: string;
  buttonText: string;
  actionType: "copy" | "link";
  linkUrl?: string;
  // Decoration specifics
  sprinkleColors: string[];
}
export default function CookingMama() {
  // Active cake states
  const [slicedCakes, setSlicedCakes] = useState<{ [key: string]: boolean }>({});
  const [everSliced, setEverSliced] = useState<{ [key: string]: boolean }>({});
  const [openCard, setOpenCard] = useState<"strawberry" | "blueberry" | "chocolate" | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  // Custom Chef Knife/Spatula Cursor position
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHoveringBoard, setIsHoveringBoard] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const [isTouchDevice, setIsTouchDevice] = useState(false);
  useEffect(() => {
    setIsTouchDevice(
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0
    );
  }, []);
  // Physics-based cream particle spray states
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; vx: number; vy: number; color: string; size: number; alpha: number }[]>([]);
  // Web Audio Context for authentic kitchen sound synthesis
  const audioCtxRef = useRef<AudioContext | null>(null);
  const cakes: CakeData[] = [
    {
      id: "strawberry",
      title: "Strawberry Cake",
      emoji: "🍓",
      recipeName: "Direct Connection",
      label: "📞 Phone Number",
      value: "9508996699",
      description: "Feel free to reach out regarding internships, full-time opportunities, collaborations, projects or professional discussions.",
      color: "#f472b6", // Pastel Pink
      frostingColor: "#fdf2f8", // Warm creamy pinkish white
      creamColor: "#ec4899", // Vivid strawberry pink
      buttonText: "Copy Number",
      actionType: "copy",
      sprinkleColors: ["#f472b6", "#fb7185", "#fcd34d", "#ffffff"],
    },
    {
      id: "blueberry",
      title: "Blueberry Cake",
      emoji: "🫐",
      recipeName: "Developer Inbox",
      label: "📧 Email",
      value: "ananyap1293@gmail.com",
      description: "The best way to discuss internships, software engineering opportunities, collaborations and project ideas.",
      color: "#6366f1", // Indigo / Blueberry Blue
      frostingColor: "#f5f3ff", // Rich lavender cream
      creamColor: "#4f46e5", // Blueberry jam purple-indigo
      buttonText: "Copy Email",
      actionType: "copy",
      sprinkleColors: ["#818cf8", "#a78bfa", "#fcd34d", "#ffffff"],
    },
    {
      id: "chocolate",
      title: "Chocolate Cake",
      emoji: "🍫",
      recipeName: "Professional Network",
      label: "🔗 LinkedIn",
      value: "https://www.linkedin.com/in/ananya-kumari-362906373/",
      description: "Explore my professional profile, experience, achievements and connect with me.",
      color: "#78350f", // Cocoa brown
      frostingColor: "#fffbeb", // Rich custard cream
      creamColor: "#451a03", // Dark glaze chocolate
      buttonText: "Visit LinkedIn",
      actionType: "link",
      linkUrl: "https://www.linkedin.com/in/ananya-kumari-362906373/",
      sprinkleColors: ["#b45309", "#78350f", "#fcd34d", "#d97706"],
    },
  ];
  // Dynamically load Google cursive/handwritten fonts on mount
  useEffect(() => {
    const fontLink = document.createElement("link");
    fontLink.href = "https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Fredoka+One&family=Outfit:wght@400;600;700;800&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);
    // CSS Keyframes inject
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      @keyframes floatCake {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-8px) rotate(1deg); }
      }
      @keyframes chefSlash {
        0% { transform: translate(-10px, -10px) rotate(0deg) scale(1); }
        30% { transform: translate(5px, -25px) rotate(-35deg) scale(1.2); }
        60% { transform: translate(25px, 20px) rotate(55deg) scale(0.85); }
        100% { transform: translate(-10px, -10px) rotate(0deg) scale(1); }
      }
      @keyframes sparklesFloat {
        0%, 100% { opacity: 0.3; transform: translateY(0) scale(0.8); }
        50% { opacity: 1; transform: translateY(-6px) scale(1.1); }
      }
      .cozy-bakery-bg {
        background-color: #fff9f6;
        background-image: 
          radial-gradient(#fed7aa 11%, transparent 11%), 
          radial-gradient(#fed7aa 11%, transparent 11%);
        background-size: 40px 40px;
        background-position: 0 0, 20px 20px;
      }
      .cake-floating {
        animation: floatCake 4.5s ease-in-out infinite;
      }
      .recipe-handwritten {
        font-family: 'Caveat', cursive;
      }
      .chef-header-font {
        font-family: 'Fredoka One', cursive;
      }
      .recipe-card-border {
        border: 4px dashed #f9a8d4;
      }
    `;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(fontLink);
      document.head.removeChild(styleSheet);
    };
  }, []);
  // Web Audio Context Lazy Initializer
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };
  // Synthesize Cozy Bakery Chop sound (Knife cutting soft pastry + squishy cream pop)
  const playSliceAudio = () => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const now = ctx.currentTime;
    // 1. Sleek metallic slash tone (Highpass noise burst)
    const noise = ctx.createBufferSource();
    const bufferSize = ctx.sampleRate * 0.15; // 150ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    noise.buffer = buffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "highpass";
    noiseFilter.frequency.setValueAtTime(1800, now);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    // 2. Sweet soft "Squish" sound for the cream splitting
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(280, now);
    // Rapid pitch drop to mimic squishing
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.15);
    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.6, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  };
  // Synthesize Bakery Clear Bell Timer Ding ("ding!")
  const playTimerDing = () => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const now = ctx.currentTime;
    const frequencies = [1200, 1800, 2400]; // Multi-harmonic clean bell tone
    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      const gainNode = ctx.createGain();
      // Lead tone is louder
      const volume = idx === 0 ? 0.35 : 0.12;
      gainNode.gain.setValueAtTime(volume, now);
      // Clean long bell ringing decay
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.3);
    });
  };
  // Particles Physics Movement Loop
  useEffect(() => {
    if (particles.length === 0) return;
    const frame = requestAnimationFrame(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.2, // Gravity pulls cream blobs down
            alpha: p.alpha - 0.02,
          }))
          .filter((p) => p.alpha > 0)
      );
    });
    return () => cancelAnimationFrame(frame);
  }, [particles]);
  // Spawn Physics-based Cream Droplets
  const spawnCreamParticles = (x: number, y: number, color: string) => {
    const newCream: {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
}[] = [];
    const count = 18 + Math.floor(Math.random() * 8);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      newCream.push({
        id: Math.random() + i,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4, // Splash upward
        color,
        size: 8 + Math.random() * 15,
        alpha: 1,
      });
    }
    setParticles((prev) => [...prev, ...newCream]);
  };
  // Knife Cursor Movement Tracker
  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  };
  // Chop Slicing Action Trigger
  const handleCakeSlice = (cake: CakeData, event: React.MouseEvent) => {
    if (slicedCakes[cake.id]) {
      // If already sliced, just toggle open card
      setOpenCard(cake.id);
      return;
    }
    // Trigger Slash animation on knife
    setIsClicking(true);
    setTimeout(() => setIsClicking(false), 200);
    playSliceAudio();
    // Spawn cream splash droplets at coordinates
    spawnCreamParticles(event.clientX, event.clientY, cake.creamColor);
    // Slicing splits the active cake, closes the others to keep focus clean
    
    const newEver = { ...everSliced, [cake.id]: true };
    
    // Close other cakes splits so only ONE is split open at a time
    const updatedSliced: { [key: string]: boolean } = {};
    cakes.forEach((c) => {
      updatedSliced[c.id] = c.id === cake.id;
    });
    setSlicedCakes(updatedSliced);
    setEverSliced(newEver);
    setOpenCard(cake.id);
    
    // Auto-scroll on mobile viewports to center focus on active card
    if (window.innerWidth < 768) {
      setTimeout(() => {
        const cakeElement = document.getElementById(`cake-card-${cake.id}`);
        if (cakeElement) {
          cakeElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
    
    // Check if ALL three cakes have been sliced
    const allCleared = Object.keys(newEver).length === 3;
    if (allCleared) {
      setTimeout(() => {
        playTimerDing();
        setShowCompleted(true);
      }, 950);
    }
  };
  // Recipe Card Button Action Handlers
  const handleCardAction = (cake: CakeData) => {
    if (cake.actionType === "copy") {
      navigator.clipboard.writeText(cake.value);
      setCopiedLabel(cake.id);
      setTimeout(() => setCopiedLabel(null), 1800);
    }
  };
  // Close Card and Join Cake Back Together
  const handleCloseCard = (cakeId: "strawberry" | "blueberry" | "chocolate") => {
    setOpenCard(null);
    setSlicedCakes((prev) => ({ ...prev, [cakeId]: false }));
  };
  // Reset Bakery
  const handleResetBakery = () => {
    setSlicedCakes({});
    setEverSliced({});
    setOpenCard(null);
    setShowCompleted(false);
    setParticles([]);
  };
  return (
    <div
      className="min-h-screen relative overflow-hidden cozy-bakery-bg flex flex-col font-sans select-none"
      style={{ 
        fontFamily: "'Outfit', sans-serif",
        cursor: isHoveringBoard && !isTouchDevice ? "none" : "auto" 
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHoveringBoard(true)}
      onMouseLeave={() => {
        setIsHoveringBoard(false);
        setIsClicking(false);
      }}
    >
      {/* Cream Spray rendering layer */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="fixed pointer-events-none z-30 rounded-full"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: p.alpha,
            transform: "translate(-50%, -50%)",
            boxShadow: `inset -2px -2px 6px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.15)`,
          }}
        />
      ))}
      {/* Trailing Cozy Chef Spatula/Knife Cursor */}
      {isHoveringBoard && !isTouchDevice && (
        <div
          className="fixed pointer-events-none z-50 select-none shadow-none"
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
            transform: "translate(-10px, -10px)",
          }}
        >
          <div
            className="w-14 h-14"
            style={{
              animation: isClicking ? "chefSlash 0.22s ease-in-out forwards" : "none",
            }}
          >
            {/* Cute Kitchen Chef Palette Knife Spatula */}
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]">
              {/* Spatula Blade */}
              <path
                d="M 50,30 L 80,5 L 90,15 L 70,40 C 65,45 55,45 50,30 Z"
                fill="url(#knifeGrad)"
                stroke="#64748b"
                strokeWidth="1.5"
              />
              {/* Pastel Pink Rubber/Wood Handle */}
              <path
                d="M 50,30 C 45,25 35,35 25,45 L 5,65 C -2,72 -2,82 5,90 C 13,97 23,97 30,90 L 50,70"
                fill="#f472b6"
                stroke="#db2777"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Wooden handle rivet details */}
              <circle cx="18" cy="77" r="2.5" fill="#fbcfe8" />
              <circle cx="28" cy="67" r="2.5" fill="#fbcfe8" />
              <defs>
                <linearGradient id="knifeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#94a3b8" />
                  <stop offset="50%" stopColor="#f1f5f9" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      )}
      {/* Reusable Navbar */}
      <Navbar theme="light" />

      {/* Cooking Controls Header */}
      <header className="relative z-20 flex items-center justify-between px-6 md:px-12 py-4 max-w-7xl mx-auto w-full select-none">
        <div className="bg-[#fff5f0] border border-pink-200 px-5 py-2.5 rounded-2xl shadow-sm text-stone-500 font-extrabold text-xs tracking-wider">
          🍰 Slices Discovered:{" "}
          <span className="text-pink-600 font-black">
            {Object.keys(everSliced).length}/3
          </span>
        </div>
        <button
          onClick={handleResetBakery}
          className="group bg-pink-100 hover:bg-pink-200 border border-pink-300 px-5 py-2.5 rounded-full text-xs font-black text-pink-700 flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm uppercase tracking-widest cursor-none"
        >
          🔄 Restart Bakery
        </button>
      </header>
      {/* Cooking Title Block */}
      <section className="relative z-10 text-center pt-2 select-none">
        <span className="text-sm bg-pink-100 text-pink-700 font-black px-4 py-1.5 rounded-full border border-pink-200 uppercase tracking-widest">
          Level 04 • Bakery Shop
        </span>
        <h1 
          className="text-4xl md:text-5xl font-black text-pink-900 mt-3 drop-shadow-sm chef-header-font"
        >
          🍳 Cooking Mama Contact Bakery
        </h1>
        <p className="text-stone-500 text-sm md:text-base font-semibold mt-1 px-4 max-w-md mx-auto">
          "Slice a cake to discover a way to connect with me."
        </p>
      </section>
      {/* 2. THREE CAKES HORIZONTAL DISPLAY ARENA */}
      <main className="relative flex-1 max-w-7xl mx-auto w-full flex flex-col items-center justify-center py-6 px-4 z-10 select-none min-h-[500px]">
        {/* Cakes Display Counter Table */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-end justify-items-center max-w-5xl mt-2">
          {cakes.map((cake) => {
            const isSliced = slicedCakes[cake.id];
            const isOpened = openCard === cake.id;
            return (
              <div
                id={`cake-card-${cake.id}`}
                key={cake.id}
                className="flex flex-col items-center justify-end w-full max-w-[280px] h-[340px] relative scroll-mt-6"
              >
                {/* Sparkles floating behind active unsliced cakes */}
                {!isSliced && (
                  <div 
                    className="absolute top-20 pointer-events-none select-none flex gap-6 text-xl text-yellow-400 opacity-60 z-0 animate-pulse"
                    style={{ animation: "sparklesFloat 2s ease-in-out infinite alternate" }}
                  >
                    <span>✨</span>
                    <span>✦</span>
                  </div>
                )}
                {/* Symmetrical split cake wrapper */}
                <div
                  onClick={(e) => handleCakeSlice(cake, e)}
                  className={`w-48 h-48 cursor-none relative cake-floating z-10 transition-transform duration-300 hover:scale-105`}
                  style={{
                    animationDelay: cake.id === "strawberry" ? "0s" : cake.id === "blueberry" ? "0.4s" : "0.8s",
                  }}
                >
                  {/* LEFT HALF OF THE SPLIT CAKE */}
                  <div
                    className="absolute inset-0 transition-transform duration-500 select-none z-10"
                    style={{
                      clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
                      transform: isSliced ? "translateX(-45px) rotate(-14deg)" : "translateX(0) rotate(0)",
                    }}
                  >
                    {/* SVG Cake Left Representation */}
                    <CakeSvg cake={cake} side="left" />
                  </div>
                  {/* RIGHT HALF OF THE SPLIT CAKE */}
                  <div
                    className="absolute inset-0 transition-transform duration-500 select-none z-10"
                    style={{
                      clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)",
                      transform: isSliced ? "translateX(45px) rotate(14deg)" : "translateX(0) rotate(0)",
                    }}
                  >
                    {/* SVG Cake Right Representation */}
                    <CakeSvg cake={cake} side="right" />
                  </div>
                  {/* Sweet Glowing Splitted Cake Core Heart */}
                  {isSliced && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
                      <span 
                        className="text-4xl animate-ping opacity-60 filter blur-[0.5px]"
                        style={{ color: cake.creamColor }}
                      >
                        💖
                      </span>
                    </div>
                  )}
                </div>
                {/* Cake Title Label */}
                <span className="mt-4 chef-header-font text-lg text-pink-950/80 drop-shadow-sm select-none pointer-events-none">
                  {cake.title}
                </span>
                {/* Hand-written paper Recipe Card emerge overlay */}
                {isSliced && isOpened && (
                  <div
                    className="absolute top-[-30px] bottom-8 left-[-15px] right-[-15px] bg-[#fdfaf2] rounded-[24px] shadow-2xl p-6 select-text z-20 flex flex-col justify-between border-2 border-amber-800/10 recipe-card-border overflow-hidden animate-fade-in"
                    style={{
                      borderRadius: "28px 18px 30px 20px / 20px 28px 18px 32px"
                    }}
                  >
                    {/* Card background lines grid */}
                    <div 
                      className="absolute inset-0 opacity-5 pointer-events-none z-0"
                      style={{
                        backgroundImage: "linear-gradient(#451a03 1px, transparent 1px)",
                        backgroundSize: "100% 24px"
                      }}
                    />
                    {/* Card content wrapper */}
                    <div className="relative z-10 text-left flex-1 flex flex-col">
                      {/* Card Header */}
                      <div className="flex justify-between items-start border-b-2 border-pink-200 pb-2 mb-3">
                        <div>
                          <span className="text-[10px] font-bold text-pink-500 uppercase tracking-widest">
                            🍰 Baker Recipe
                          </span>
                          <h3 className="recipe-handwritten text-3xl font-black text-pink-900 leading-tight">
                            {cake.recipeName}
                          </h3>
                        </div>
                        {/* Close button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCloseCard(cake.id);
                          }}
                          className="bg-pink-100 hover:bg-pink-200 border border-pink-200 text-pink-700 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm cursor-none"
                        >
                          ✕
                        </button>
                      </div>
                      {/* Info Value Section */}
                      <div className="bg-pink-50/50 rounded-xl p-3 border border-pink-200/50 mb-3">
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                          {cake.label}
                        </span>
                        <span 
                          className="font-extrabold text-sm md:text-base text-pink-950 select-all leading-snug tracking-tight"
                        >
                          {cake.value}
                        </span>
                      </div>
                      {/* Description */}
                      <p className="text-stone-600 text-xs font-semibold leading-relaxed flex-1 overflow-y-auto pr-1">
                        {cake.description}
                      </p>
                    </div>
                    {/* Action Button */}
                    <div className="mt-4 relative z-10">
                      {cake.actionType === "copy" ? (
                        <button
                          onClick={() => handleCardAction(cake)}
                          className="w-full bg-[#f472b6] hover:bg-[#db2777] text-white font-extrabold py-2.5 rounded-full shadow-[0_4px_0_#be185d] hover:shadow-[0_4px_0_#9d174d] transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 text-xs uppercase tracking-widest cursor-none flex items-center justify-center gap-1.5"
                        >
                          {copiedLabel === cake.id ? (
                            <>
                              <span>Copied!</span>
                              <span>✓</span>
                            </>
                          ) : (
                            <span>{cake.buttonText}</span>
                          )}
                        </button>
                      ) : (
                        <a
                          href={cake.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-[#f472b6] hover:bg-[#db2777] text-white font-extrabold py-2.5 rounded-full shadow-[0_4px_0_#be185d] hover:shadow-[0_4px_0_#9d174d] transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 text-xs uppercase tracking-widest cursor-none flex items-center justify-center gap-1.5"
                        >
                          <span>{cake.buttonText}</span>
                          <span>↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* Cozy Wooden Counter base decoration overlay */}
        <div 
          className="w-full max-w-5xl h-6 bg-gradient-to-r from-[#8b5a2b] via-[#a0744a] to-[#8b5a2b] rounded-full mt-4 shadow-[0_12px_24px_rgba(0,0,0,0.15)] border-b-4 border-stone-800/20"
        />
      </main>
      {/* 3. BAKERY COMPLETED OVERLAY CELEBRATION */}
      {showCompleted && (
        <div 
          className="fixed inset-0 z-50 bg-[#fff5f0]/95 flex flex-col items-center justify-center p-6 text-center select-text overflow-y-auto"
          style={{ animation: "bubble-enter 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}
        >
          {/* Falling Sparkles decoration grid */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-45">
            {Array.from({ length: 25 }).map((_, idx) => (
              <span
                key={idx}
                className="absolute text-3xl text-pink-400 animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              >
                🎂
              </span>
            ))}
          </div>
          <div className="relative max-w-md w-full bg-white border-[6px] border-pink-300 p-8 md:p-10 rounded-[36px] shadow-[0_20px_50px_rgba(219,39,119,0.18)] select-text z-20">
            {/* Bakery Hat Badge */}
            <span className="text-7xl drop-shadow-md animate-bounce inline-block mb-3 select-none">👩‍🍳</span>
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-black text-pink-900 drop-shadow-sm chef-header-font select-none">
              🎉 Bakery Completed!
            </h1>
            <p className="text-stone-600 text-sm font-semibold mt-3 max-w-sm mx-auto leading-relaxed select-text">
              Thank you for visiting my portfolio. Let's build something amazing together! Feel free to reach out to me.
            </p>
            {/* Social channels paste buttons */}
            <div className="my-8 flex flex-col gap-3 select-none">
              {/* GitHub */}
              <a
                href="https://github.com/ananyakumari1293"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#fdf2f8] hover:bg-pink-100 border border-pink-200 text-pink-700 font-extrabold py-3.5 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-none"
              >
                <span>💻 GitHub</span>
                <span className="opacity-60">↗</span>
              </a>
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/ananya-kumari-362906373/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#e0e7ff] hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-extrabold py-3.5 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-none"
              >
                <span>🔗 LinkedIn</span>
                <span className="opacity-60">↗</span>
              </a>
              {/* Instagram */}
              <a
                href="https://www.instagram.com/_ananyaaaa__.__"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#fffbeb] hover:bg-amber-100 border border-amber-200 text-amber-700 font-extrabold py-3.5 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-none"
              >
                <span>📸 Instagram</span>
                <span className="opacity-60">↗</span>
              </a>
            </div>
            {/* Close modal button */}
            <button
              onClick={() => setShowCompleted(false)}
              className="bg-[#f472b6] hover:bg-[#db2777] text-white font-extrabold px-8 py-3.5 rounded-full shadow-[0_4px_0_#be185d] hover:shadow-[0_4px_0_#9d174d] transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 text-xs uppercase tracking-widest cursor-none"
            >
              🍰 Back to Shop
            </button>
          </div>
        </div>
      )}
      {/* 4. FOOTER */}
      <footer className="relative z-10 w-full text-center py-6 text-stone-400 font-extrabold text-[10px] uppercase tracking-widest select-none border-t border-pink-100 mt-auto">
        Cooking Mama Contact Bakery • Design by Ananya Kumari
      </footer>
    </div>
  );
}
// Subcomponent: Beautiful and Detailed SVG Cake Maker
function CakeSvg({ cake, side }: { cake: CakeData; side: "left" | "right" }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_8px_12px_rgba(0,0,0,0.18)]">
      {/* 3D Cake Cylinder Base */}
      {/* Cake Plate base shadow */}
      <ellipse cx="100" cy="148" rx="85" ry="24" fill="#fbcfe8" opacity="0.4" />
      <ellipse cx="100" cy="144" rx="80" ry="20" fill="#ffffff" stroke="#f472b6" strokeWidth="2.5" />
      {/* Cake Bread Layers */}
      {/* Base crust layer */}
      <path
        d="M 24,115 C 24,115 50,135 100,135 C 150,135 176,115 176,115 L 176,140 C 176,140 150,154 100,154 C 50,154 24,140 24,140 Z"
        fill="#fcd34d"
        opacity="0.85"
      />
      {/* Jam/Cream Layer Middle */}
      <path
        d="M 23,100 C 23,100 50,120 100,120 C 150,120 177,100 177,100 L 177,118 C 177,118 150,138 100,138 C 50,138 23,118 23,118 Z"
        fill={cake.creamColor}
      />
      {/* Top Main Frosted Layer */}
      <path
        d="M 22,82 C 22,82 50,102 100,102 C 150,102 178,82 178,82 L 178,103 C 178,103 150,122 100,122 C 50,122 22,103 22,103 Z"
        fill={cake.color}
      />
      {/* Flat Oval Creamy Frosting Cap Top */}
      <ellipse cx="100" cy="82" rx="78" ry="20" fill={cake.frostingColor} stroke={cake.color} strokeWidth="1.5" />
      {/* Thick icing drip decorations */}
      <path
        d="M 22,82 C 22,82 40,94 52,90 C 64,86 72,96 84,94 C 96,92 106,100 118,96 C 130,92 142,98 154,92 C 166,86 178,82 178,82 L 178,87 C 178,87 166,92 154,98 C 142,104 130,98 118,102 C 106,106 96,98 84,100 C 72,102 64,92 52,96 C 40,100 22,87 22,87 Z"
        fill={cake.color}
        opacity="0.9"
      />
      {/* Top Frosted Cream Swirl Stars (Baking frosting swirls) */}
      <circle cx="55" cy="74" r="8" fill={cake.color} opacity="0.8" />
      <circle cx="55" cy="74" r="5" fill="#ffffff" />
      <circle cx="145" cy="74" r="8" fill={cake.color} opacity="0.8" />
      <circle cx="145" cy="74" r="5" fill="#ffffff" />
      <circle cx="100" cy="88" r="9" fill={cake.color} opacity="0.8" />
      <circle cx="100" cy="88" r="5" fill="#ffffff" />
      {/* Cake sprinkles details (Symmetric placement) */}
      {cake.sprinkleColors.map((color, idx) => {
        // Deterministic scatter sprinkle coordinates
        const xCoords = [68, 82, 118, 132, 74, 126, 92, 108];
        const yCoords = [74, 80, 80, 74, 86, 86, 75, 75];
        const rot = [45, -20, 15, -45, 30, -30, 10, -10];
        const cx = xCoords[idx % xCoords.length];
        const cy = yCoords[idx % yCoords.length];
        const angle = rot[idx % rot.length];
        // Symmetrically filter out sprinkles based on the split side to align perfectly
        if (side === "left" && cx > 100) return null;
        if (side === "right" && cx < 100) return null;
        return (
          <rect
            key={idx}
            x={cx}
            y={cy}
            width="6"
            height="2"
            rx="1"
            fill={color}
            transform={`rotate(${angle}, ${cx}, ${cy})`}
          />
        );
      })}
      {/* Cute Main Central Topping Fruit Decoration */}
      {/* Symmetrically split central toppings precisely so left is left and right is right */}
      {cake.id === "strawberry" && (
        <g opacity="0.95">
          {/* Sliced Strawberry centered at (100, 64) */}
          <path
            d="M 100,50 C 114,50 118,72 100,82 C 82,72 86,50 100,50 Z"
            fill="#e11d48"
            stroke="#9f1239"
            strokeWidth="1.5"
          />
          {/* Strawberry seeds */}
          <circle cx="94" cy="62" r="1.5" fill="#fcd34d" />
          <circle cx="106" cy="62" r="1.5" fill="#fcd34d" />
          <circle cx="100" cy="70" r="1.5" fill="#fcd34d" />
          {/* Green leaf cap */}
          <path
            d="M 100,50 C 95,44 105,44 100,50 Z M 92,49 C 94,42 98,47 92,49 Z M 108,49 C 106,42 102,47 108,49 Z"
            fill="#22c55e"
          />
        </g>
      )}
      {cake.id === "blueberry" && (
        <g opacity="0.95">
          {/* Two Cute Blueberries on top centered at (100, 68) */}
          {/* Left berry */}
          {(side === "left" || (side === "right" && false)) && (
            <g transform="translate(-10, 0)">
              <circle cx="100" cy="68" r="10" fill="#4f46e5" stroke="#312e81" strokeWidth="1.5" />
              {/* Crown details */}
              <path d="M 97,63 L 103,63 M 100,60 L 100,66" stroke="#1e1b4b" strokeWidth="1" />
              <circle cx="96" cy="65" r="2" fill="#818cf8" opacity="0.7" />
            </g>
          )}
          {/* Right berry */}
          {(side === "right" || (side === "left" && false)) && (
            <g transform="translate(10, -4)">
              <circle cx="100" cy="68" r="10" fill="#4338ca" stroke="#312e81" strokeWidth="1.5" />
              {/* Crown details */}
              <path d="M 97,63 L 103,63 M 100,60 L 100,66" stroke="#1e1b4b" strokeWidth="1" />
              <circle cx="96" cy="65" r="2" fill="#818cf8" opacity="0.7" />
            </g>
          )}
        </g>
      )}
      {cake.id === "chocolate" && (
        <g opacity="0.95">
          {/* Chocolate Dollop + Curls centered at (100, 66) */}
          {/* Left curl */}
          {side === "left" && (
            <g>
              <ellipse cx="94" cy="68" rx="8" ry="12" fill="#451a03" stroke="#1c1917" strokeWidth="1.5" />
              <path d="M 90,60 C 90,60 96,62 94,68" stroke="#fcd34d" strokeWidth="1.5" fill="none" />
            </g>
          )}
          {/* Right curl */}
          {side === "right" && (
            <g>
              <ellipse cx="106" cy="66" rx="8" ry="12" fill="#451a03" stroke="#1c1917" strokeWidth="1.5" />
              <path d="M 102,58 C 102,58 108,60 106,66" stroke="#fcd34d" strokeWidth="1.5" fill="none" />
            </g>
          )}
        </g>
      )}
    </svg>
  );
}
