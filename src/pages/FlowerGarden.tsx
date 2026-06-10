import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";

// Interfaces
interface PathNode {
  id: string;
  x: number; // x coordinate in pixels for desktop panel
  y: number; // y coordinate in pixels for desktop panel
  emoji: string;
  flowerType: "cherry" | "tulip" | "sunflower" | "rose" | "lotus" | "daisy";
  label: string;
  themeColor: string;
  stars: number;
  gradient: string;
  glowColor: string;
}

interface DandelionSeed {
  id: number;
  x: number; // % left
  y: number; // % top
  size: number;
  delay: number;
  duration: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
}

export default function FlowerGarden() {
  const [activeLevel, setActiveLevel] = useState("profile");
  const [bloomedFlowers, setBloomedFlowers] = useState<{ [key: string]: boolean }>({
    profile: true, // Level 1 is open initially
  });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [seeds, setSeeds] = useState<DandelionSeed[]>([]);
  
  // Custom cursor states
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Six flower path nodes scattered organically across the meadow field panel (no connecting path lines)
  const nodes: PathNode[] = [
    {
      id: "profile",
      x: 24, // 24% of container width
      y: 95,
      emoji: "🌸",
      flowerType: "cherry",
      label: "Cherry Blossom: About Me",
      themeColor: "text-pink-600",
      stars: 3,
      gradient: "from-pink-300 to-rose-450",
      glowColor: "rgba(244, 114, 182, 0.45)",
    },
    {
      id: "education",
      x: 69, // 69% of container width
      y: 200,
      emoji: "🌷",
      flowerType: "tulip",
      label: "Tulip: Education",
      themeColor: "text-purple-600",
      stars: 3,
      gradient: "from-purple-300 to-indigo-450",
      glowColor: "rgba(168, 85, 247, 0.45)",
    },
    {
      id: "skills",
      x: 28, // 28% of container width
      y: 325,
      emoji: "🌻",
      flowerType: "sunflower",
      label: "Sunflower: Skills",
      themeColor: "text-amber-600",
      stars: 3,
      gradient: "from-yellow-300 to-amber-500",
      glowColor: "rgba(245, 158, 11, 0.45)",
    },
    {
      id: "achievements",
      x: 71, // 71% of container width
      y: 450,
      emoji: "🌹",
      flowerType: "rose",
      label: "Rose: Badges & Honors",
      themeColor: "text-red-600",
      stars: 3,
      gradient: "from-red-400 to-rose-500",
      glowColor: "rgba(239, 68, 68, 0.45)",
    },
    {
      id: "projects",
      x: 26, // 26% of container width
      y: 575,
      emoji: "🪷",
      flowerType: "lotus",
      label: "Lotus: Projects Feed",
      themeColor: "text-emerald-600",
      stars: 3,
      gradient: "from-emerald-300 to-teal-500",
      glowColor: "rgba(16, 185, 129, 0.45)",
    },
    {
      id: "goal",
      x: 65, // 65% of container width
      y: 700,
      emoji: "🌼",
      flowerType: "daisy",
      label: "Daisy: Future Vision",
      themeColor: "text-yellow-600",
      stars: 3,
      gradient: "from-yellow-200 to-yellow-450",
      glowColor: "rgba(234, 179, 8, 0.45)",
    },
  ];

  // Initialize floating dandelion seeds
  useEffect(() => {
    const list: DandelionSeed[] = [];
    for (let i = 0; i < 20; i++) {
      list.push({
        id: i,
        x: Math.random() * 95,
        y: Math.random() * 95,
        size: 8 + Math.random() * 10,
        delay: Math.random() * 6,
        duration: 10 + Math.random() * 12,
      });
    }
    setSeeds(list);

    setIsTouchDevice(
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0
    );
  }, []);

  // Audio Context lazy initializer
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  // Synthesize magical wind chimes / harp chord
  const playChimeSound = () => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const now = ctx.currentTime;
    
    // Pentatonic scale arpeggio for magical meadow feel
    const frequencies = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
    
    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      
      const volume = 0.12;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.setValueAtTime(volume, now + idx * 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.7);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.8);
    });
  };

  // Update fairy dust particles
  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy - 0.03, // Fairy dust floats upwards gently
            alpha: p.alpha - 0.02,
          }))
          .filter((p) => p.alpha > 0)
      );
    }, 16);
    return () => clearInterval(interval);
  }, [particles]);

  // Spawn magical fairy dust particles
  const spawnFairyDust = (x: number, y: number, color: string) => {
    const newSparks: Particle[] = [];
    const count = 12 + Math.floor(Math.random() * 8);
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.2 + Math.random() * 3.5;
      newSparks.push({
        id: Math.random() + i,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        color,
        size: 5 + Math.random() * 8,
        alpha: 1,
      });
    }
    setParticles((prev) => [...prev, ...newSparks]);
  };

  const handleNodeClick = (node: PathNode, e: React.MouseEvent) => {
    setActiveLevel(node.id);
    
    // Trigger bloom state
    if (!bloomedFlowers[node.id]) {
      setBloomedFlowers((prev) => ({ ...prev, [node.id]: true }));
      playChimeSound();
    }
    
    // Spawn fairy dust particles
    spawnFairyDust(e.clientX, e.clientY, node.glowColor);

    // Auto-scroll on mobile viewports
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        const detailsElement = document.getElementById("garden-details-card");
        if (detailsElement) {
          detailsElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  };

  const getThemeStyles = () => {
    switch (activeLevel) {
      case "education":
        return {
          headerBg: "bg-purple-50/70 border-purple-200 text-purple-800",
          cardBorder: "border-purple-200",
          glowColor: "rgba(168, 85, 247, 0.3)",
          accentText: "text-purple-700",
          badgeColor: "bg-purple-100/50 text-purple-950 border-purple-200",
        };
      case "skills":
        return {
          headerBg: "bg-amber-50/70 border-amber-200 text-amber-800",
          cardBorder: "border-amber-200",
          glowColor: "rgba(245, 158, 11, 0.3)",
          accentText: "text-amber-700",
          badgeColor: "bg-amber-100/50 text-amber-950 border-amber-200",
        };
      case "achievements":
        return {
          headerBg: "bg-red-50/70 border-red-200 text-red-800",
          cardBorder: "border-red-200",
          glowColor: "rgba(239, 68, 68, 0.3)",
          accentText: "text-red-700",
          badgeColor: "bg-red-100/50 text-red-950 border-red-200",
        };
      case "projects":
        return {
          headerBg: "bg-emerald-50/70 border-emerald-200 text-emerald-800",
          cardBorder: "border-emerald-200",
          glowColor: "rgba(16, 185, 129, 0.3)",
          accentText: "text-emerald-700",
          badgeColor: "bg-emerald-100/50 text-emerald-950 border-emerald-200",
        };
      case "goal":
        return {
          headerBg: "bg-yellow-50/70 border-yellow-200 text-yellow-800",
          cardBorder: "border-yellow-200",
          glowColor: "rgba(234, 179, 8, 0.3)",
          accentText: "text-yellow-700",
          badgeColor: "bg-yellow-100/50 text-yellow-950 border-yellow-200",
        };
      default:
        return {
          headerBg: "bg-pink-50/70 border-pink-200 text-pink-850",
          cardBorder: "border-pink-200",
          glowColor: "rgba(244, 114, 182, 0.3)",
          accentText: "text-pink-700",
          badgeColor: "bg-pink-100/50 text-pink-950 border-pink-200",
        };
    }
  };

  const currentTheme = getThemeStyles();

  return (
    <div
      className="min-h-screen relative overflow-hidden select-none flex flex-col font-sans"
      style={{
        fontFamily: "'Outfit', sans-serif",
        backgroundImage: "radial-gradient(circle at 50% 30%, #fef8f6 0%, #edf7f3 100%)",
        cursor: isHovering && !isTouchDevice ? "none" : "auto",
      }}
      onMouseMove={(e) => setCursorPos({ x: e.clientX, y: e.clientY })}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Google Caveat cursive link */}
      <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap" rel="stylesheet" />

      {/* magical styles */}
      <style>{`
        @keyframes seedFloat {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.15; }
          50% { transform: translateY(-30px) translateX(15px) rotate(20deg); opacity: 0.55; }
        }
        .seed-glow {
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.06));
          animation: seedFloat ease-in-out infinite;
        }
        @keyframes magicWand {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>

      {/* Floating Dandelion Seeds background */}
      {seeds.map((s) => (
        <div
          key={s.id}
          className="absolute seed-glow pointer-events-none z-0 text-emerald-800/20"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            fontSize: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        >
          🌾
        </div>
      ))}

      {/* Fairy dust particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="fixed pointer-events-none z-50 rounded-full"
          style={{
            left: p.x - p.size / 2,
            top: p.y - p.size / 2,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: p.alpha,
            transform: "translate(-50%, -50%)",
            boxShadow: `0 0 8px ${p.color}, 0 0 2px #fff`,
          }}
        />
      ))}

      {/* Custom Fairy wand cursor */}
      {isHovering && !isTouchDevice && (
        <div
          className="fixed pointer-events-none z-50 select-none shadow-none text-2xl"
          style={{
            left: cursorPos.x + 5,
            top: cursorPos.y - 25,
            animation: "magicWand 1.5s ease-in-out infinite",
          }}
        >
          🪄
        </div>
      )}

      {/* Navigation */}
      <Navbar theme="light" />

      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-6 pt-6 select-none z-10 relative">
        <div className="text-center mb-10">
          <h1
            className="text-5xl md:text-6xl text-emerald-700 font-black drop-shadow-[0_2px_4px_rgba(4,120,87,0.1)] select-none leading-none flex items-center justify-center gap-2"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            🌸 Fairy Flower Garden
          </h1>
          <p className="text-slate-500 text-sm md:text-base font-bold mt-2">
            Click on a flower bud to let it bloom and uncover my developer story!
          </p>
        </div>

        {/* Board Arena */}
        <div className="grid lg:grid-cols-[380px_1fr] gap-12 items-start relative pb-20">
          
          {/* LEFT PANEL: MEADOW FIELD (Completely disconnected flowers) */}
          <div className="relative w-full max-w-[340px] mx-auto h-[780px] select-none shrink-0 bg-white/50 backdrop-blur-md rounded-[40px] border-4 border-white shadow-2xl p-4 overflow-hidden">
            {/* Soft decorative background grass blade icons */}
            <div className="absolute bottom-4 left-6 text-emerald-800/10 text-6xl pointer-events-none">🌿</div>
            <div className="absolute bottom-10 right-8 text-emerald-800/10 text-5xl pointer-events-none">🌱</div>
            <div className="absolute top-20 right-6 text-emerald-800/10 text-4xl pointer-events-none">🍀</div>
            <div className="absolute top-[40%] left-4 text-emerald-800/10 text-4xl pointer-events-none">🍃</div>

            {/* Flowers scattered across the garden meadow panel */}
            {nodes.map((node, index) => {
              const active = activeLevel === node.id;
              const isBloomed = bloomedFlowers[node.id];
              return (
                <div
                  key={node.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 select-none group"
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}px`,
                  }}
                >
                  <button
                    onClick={(e) => handleNodeClick(node, e)}
                    className="relative w-20 h-20 flex items-center justify-center transition-all duration-300 transform select-none hover:scale-115 active:scale-95"
                  >
                    {/* Glowing aura behind flower */}
                    <div
                      className={`absolute inset-[-5px] rounded-full transition-opacity duration-500 blur-md ${
                        active ? "opacity-100 scale-110" : "opacity-20 group-hover:opacity-60"
                      }`}
                      style={{
                        backgroundColor: node.glowColor,
                        boxShadow: `0 0 20px ${node.glowColor}`,
                      }}
                    />

                    {/* Flower Graphic Container */}
                    <div className="w-16 h-16 relative flex items-center justify-center">
                      <FlowerSvg flowerType={node.flowerType} isBloomed={isBloomed} />
                    </div>

                    {/* Node Index label tag */}
                    <div className="absolute -top-3 -right-2 bg-emerald-600 border-2 border-white text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md select-none">
                      {index + 1}
                    </div>
                  </button>

                  {/* Golden flower stars */}
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex gap-0.5 scale-90 select-none">
                    {Array.from({ length: 3 }).map((_, sIdx) => (
                      <span
                        key={sIdx}
                        className={`text-xs leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] ${
                          sIdx < node.stars ? "text-yellow-500" : "text-stone-300"
                        }`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT PANEL: GLOWING FAIRY LEAF PLACARD (Light-themed) */}
          <div
            id="garden-details-card"
            className="w-full bg-[#fdfbf7]/90 border-4 border-emerald-300/20 rounded-[40px] shadow-[0_20px_45px_rgba(4,120,87,0.08)] p-8 md:p-10 select-text z-10 transition-all duration-300 backdrop-blur-md overflow-hidden scroll-mt-6 border-double text-slate-800"
            style={{
              borderRadius: "40px 32px 48px 36px / 36px 48px 32px 40px",
            }}
          >
            {/* Active Details Content */}
            {activeLevel === "profile" && (
              <div className="animate-fade-in space-y-6">
                <div className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-3xl border-2 ${currentTheme.cardBorder} ${currentTheme.headerBg}`}>
                  <div className="text-6xl leading-none select-none">🌸</div>
                  <div>
                    <h2
                      className="text-5xl text-pink-700 font-black leading-tight tracking-wide"
                      style={{ fontFamily: "'Caveat', cursive" }}
                    >
                      Hi, I'm Ananya Kumari
                    </h2>
                    <p className="text-emerald-700 text-xs font-bold uppercase tracking-wider mt-0.5">
                      Fairy World Level 1: Profile &amp; Passion
                    </p>
                  </div>
                </div>
                <div className="space-y-4 text-slate-700 leading-relaxed font-medium">
                  <p className="text-lg italic text-pink-900 font-semibold">
                    "Deep within the gardens of logic and code, I nurture ideas into digital blooms that represent creative engineering."
                  </p>
                  <p>
                    I'm a Computer Science Engineering student at Vellore Institute of Technology with a strong passion for creating modern web products. I specialize in building robust, interactive, and responsive full stack platforms that deliver memorable user experiences.
                  </p>
                  <p>
                    My technical toolkit revolves around React.js, Next.js, Node.js, Express.js, TypeScript, and MongoDB. I enjoy designing secure REST APIs, system integrations, competitive algorithms, and exploring AI NLP pipelines.
                  </p>
                </div>

                {/* snapshot block */}
                <div className="bg-white rounded-3xl p-6 border border-emerald-500/10 shadow-md">
                  <h3 className="font-extrabold text-2xl mb-4 text-emerald-700 flex items-center gap-2">
                    Quick Snapshot 🚀
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "🎓 B.Tech Computer Science — VIT (2027)",
                      "💻 Full Stack Developer & UI Designer",
                      "🧠 200+ Competitive DSA Problems Solved",
                      "☁️ AWS Cloud Certified Architect Practitioner",
                      "🤖 Proactively Exploring AI Models & Emerging NLP Tech",
                    ].map((snap, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-stone-700 font-semibold text-base">
                        <span className="text-pink-500 text-lg">🌸</span>
                        <span>{snap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resume and Social links */}
                <div className="mt-8 flex flex-wrap gap-4 pt-2 border-t border-emerald-500/10 select-none">
                  <a
                    href="https://drive.google.com/file/d/1QPyVm3m-ZRkm8avgD2d_dS-ehfB_3xMQ/view?usp=drivesdk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 hover:scale-105 text-white px-7 py-3.5 rounded-full font-black shadow-md hover:shadow-lg transform active:translate-y-0.5 transition-all text-sm flex items-center gap-2"
                  >
                    📄 View Resume
                  </a>
                  <a
                    href="https://github.com/ananyakumari1293"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-50 hover:bg-emerald-100 hover:scale-105 text-emerald-800 border border-emerald-200 px-7 py-3.5 rounded-full font-black shadow-md transform active:translate-y-0.5 transition-all text-sm flex items-center gap-2"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/ananya-kumari-362906373/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-50 hover:bg-blue-100 hover:scale-105 text-blue-800 border border-blue-200 px-7 py-3.5 rounded-full font-black shadow-md transform active:translate-y-0.5 transition-all text-sm flex items-center gap-2"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://www.instagram.com/_ananyaaaa__.__"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-pink-50 to-red-50 hover:scale-105 text-pink-700 border border-pink-200 px-7 py-3.5 rounded-full font-black shadow-md transform active:translate-y-0.5 transition-all text-sm flex items-center gap-2"
                  >
                    Instagram
                  </a>
                </div>
              </div>
            )}

            {/* Education Milestone */}
            {activeLevel === "education" && (
              <div className="animate-fade-in space-y-6">
                <div className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-3xl border-2 ${currentTheme.cardBorder} ${currentTheme.headerBg}`}>
                  <div className="text-6xl leading-none select-none">🌷</div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-800">Education</h2>
                    <p className="text-emerald-700 text-xs font-bold uppercase tracking-wider mt-0.5">
                      Fairy World Level 2: Academic Growth
                    </p>
                  </div>
                </div>
                <div className="space-y-6 max-h-[440px] overflow-y-auto pr-2 custom-scrollbar select-text">
                  <div className="bg-white p-6 rounded-3xl border border-purple-200 flex flex-col gap-2 shadow-sm">
                    <div className="flex justify-between items-start gap-4 flex-wrap">
                      <h3 className="text-2xl font-black text-slate-800">Vellore Institute of Technology</h3>
                      <span className="text-purple-700 font-bold text-xs uppercase bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                        B.Tech CSE
                      </span>
                    </div>
                    <p className="text-purple-700 font-extrabold text-base">
                      Bachelor of Technology — Computer Science &amp; Engineering
                    </p>
                    <p className="text-stone-500 text-sm font-semibold">2023 – 2027 (Expected)</p>
                    <div className="mt-2 inline-block bg-purple-100/60 border border-purple-200 text-purple-800 px-4 py-1.5 rounded-full font-black w-fit text-sm">
                      ✨ GPA: 8.76
                    </div>
                    <p className="mt-2 leading-relaxed text-stone-600 text-sm font-medium italic">
                      Strengthening fundamental skills in Data Structures &amp; Algorithms, Object-Oriented Programming (OOP), Database Systems (DBMS), Operating Systems, and computer networking while deploying scalable web apps.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-purple-150 flex flex-col gap-2 shadow-sm">
                    <h3 className="text-2xl font-black text-slate-800">Central Board of Secondary Education</h3>
                    <p className="text-purple-700 font-extrabold text-base">Class XII</p>
                    <p className="text-stone-500 text-sm font-semibold">Percentage: 75%+</p>
                    <p className="mt-1 leading-relaxed text-stone-600 text-sm font-medium italic">
                      Reinforced analytical thinking, science fundamentals, and advanced mathematics.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-purple-150 flex flex-col gap-2 shadow-sm">
                    <h3 className="text-2xl font-black text-slate-800">Central Board of Secondary Education</h3>
                    <p className="text-purple-700 font-extrabold text-base">Class X</p>
                    <p className="text-stone-500 text-sm font-semibold">Percentage: 90%+</p>
                    <p className="mt-1 leading-relaxed text-stone-600 text-sm font-medium italic">
                      Recognized with outstanding honors in logical analysis and mathematics.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Skills Milestone */}
            {activeLevel === "skills" && (
              <div className="animate-fade-in space-y-6">
                <div className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-3xl border-2 ${currentTheme.cardBorder} ${currentTheme.headerBg}`}>
                  <div className="text-6xl leading-none select-none">🌻</div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-800">Developer Toolkit</h2>
                    <p className="text-emerald-700 text-xs font-bold uppercase tracking-wider mt-0.5">
                      Fairy World Level 3: Tech Strengths
                    </p>
                  </div>
                </div>
                <p className="text-slate-650 text-base font-semibold leading-relaxed italic p-2 border-l-4 border-amber-400">
                  Experienced in crafting highly visual user interfaces, structuring REST endpoints, implementing authentication shields, and deploying secure microservices.
                </p>
                <div className="bg-white rounded-3xl p-6 border border-[#e8d2bd]/40 shadow-md">
                  <h3 className="font-extrabold text-xl mb-4 text-amber-700">
                    Magical Bouquet of Skills 🌻
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {[
                      "React.js",
                      "Next.js",
                      "TypeScript",
                      "JavaScript",
                      "Node.js",
                      "Express.js",
                      "MongoDB",
                      "Firebase",
                      "AWS Cloud",
                      "REST APIs",
                      "Tailwind CSS",
                      "Git & GitHub",
                      "System Design",
                      "DBMS",
                      "OOP",
                    ].map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="bg-amber-100/40 text-amber-950 px-4 py-2.5 rounded-full text-sm font-black border border-amber-200/50 shadow-sm transform hover:scale-105 transition-all select-none cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Achievements Milestone */}
            {activeLevel === "achievements" && (
              <div className="animate-fade-in space-y-6">
                <div className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-3xl border-2 ${currentTheme.cardBorder} ${currentTheme.headerBg}`}>
                  <div className="text-6xl leading-none select-none">🌹</div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-800">Achievements &amp; Honors</h2>
                    <p className="text-emerald-700 text-xs font-bold uppercase tracking-wider mt-0.5">
                      Fairy World Level 4: Completed Milestones
                    </p>
                  </div>
                </div>
                <div className="space-y-4 max-h-[440px] overflow-y-auto pr-2 custom-scrollbar">
                  {[
                    {
                      title: "🏆 200+ Competitive DSA Problems Solved",
                      desc: "Strengthened core algorithmic logic, computational complexities, and optimized coding styles.",
                      accent: "border-emerald-200 text-emerald-950 bg-emerald-50/20",
                    },
                    {
                      title: "💼 JPMorgan Chase Software Experience",
                      desc: "Consulted on REST APIs, message processing setups, and advanced backend systems.",
                      accent: "border-purple-200 text-purple-950 bg-purple-50/20",
                    },
                    {
                      title: "🚀 Deloitte Technology Simulation",
                      desc: "Addressed scalable infrastructure layouts, cybersecurity requirements, and data pipes.",
                      accent: "border-blue-200 text-blue-950 bg-blue-50/20",
                    },
                    {
                      title: "☁️ AWS Certified Cloud Practitioner",
                      desc: "Validated deep theoretical understanding of secure cloud pipelines and resource networking.",
                      accent: "border-pink-200 text-pink-950 bg-pink-50/20",
                    },
                  ].map((ach, idx) => (
                    <div
                      key={idx}
                      className={`p-5 rounded-3xl border-2 shadow-sm flex flex-col gap-1.5 ${ach.accent}`}
                    >
                      <h3 className="font-extrabold text-lg leading-snug">{ach.title}</h3>
                      <p className="text-slate-700 text-sm font-medium leading-relaxed">{ach.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Milestone */}
            {activeLevel === "projects" && (
              <div className="animate-fade-in space-y-6">
                <div className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-3xl border-2 ${currentTheme.cardBorder} ${currentTheme.headerBg}`}>
                  <div className="text-6xl leading-none select-none">🪷</div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-800">Featured Deployments</h2>
                    <p className="text-emerald-700 text-xs font-bold uppercase tracking-wider mt-0.5">
                      Fairy World Level 5: Sweet Project Blooms
                    </p>
                  </div>
                </div>
                <div className="space-y-5 max-h-[440px] overflow-y-auto pr-2 custom-scrollbar">
                  {[
                    {
                      title: "🎓 ScoloraX",
                      desc: "A scholarship discovery platform built to help students browse, filter, and track relevant financial opportunities easily.",
                      tech: "React.js • Node.js • MongoDB • Firebase • Tailwind CSS",
                      accent: "border-pink-200",
                    },
                    {
                      title: "🌆 CITY404",
                      desc: "Cyberpunk room puzzle game where players hide secret codes, challenge friends, and solve digital locks within 90 seconds.",
                      tech: "Next.js • TypeScript • Firebase • Tailwind CSS",
                      accent: "border-rose-200",
                    },
                    {
                      title: "✈️ TripTales",
                      desc: "Human-centered travel feed sharing memories, Cloudinary media updates, and Firebase auth shields.",
                      tech: "React.js • Node.js • Express.js • MongoDB",
                      accent: "border-teal-200",
                    },
                  ].map((proj, idx) => (
                    <div
                      key={idx}
                      className={`bg-white p-5 rounded-3xl shadow-sm border-2 flex flex-col gap-2 ${proj.accent}`}
                    >
                      <h3 className="text-xl font-extrabold text-slate-900 flex items-center justify-between">
                        <span>{proj.title}</span>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase">Deployed</span>
                      </h3>
                      <p className="text-slate-600 text-sm font-medium leading-relaxed">{proj.desc}</p>
                      <p className="text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-200/40 px-3 py-1.5 rounded-full w-fit">
                        {proj.tech}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Objective Milestone */}
            {activeLevel === "goal" && (
              <div className="animate-fade-in space-y-6">
                <div className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-3xl border-2 ${currentTheme.cardBorder} ${currentTheme.headerBg}`}>
                  <div className="text-6xl leading-none select-none">🌼</div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-800">Career Objective</h2>
                    <p className="text-emerald-700 text-xs font-bold uppercase tracking-wider mt-0.5">
                      Fairy World Level 6: Golden Garden Objective
                    </p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-yellow-250 flex flex-col gap-4 shadow-sm">
                  <p className="text-xl leading-relaxed text-slate-700 italic font-medium border-l-4 border-yellow-500 pl-4">
                    To construct scalable, highly impactful, and user-centric digital products that combine software engineering excellence, thoughtful design patterns, and modern cloud deployment networks while continuously researching Artificial Intelligence, NLP models, and emergent technologies.
                  </p>
                  <p className="text-emerald-700 text-sm font-semibold italic text-center bg-emerald-50 border border-emerald-200 py-2.5 rounded-2xl select-none">
                    ✨ “Nurture your code like a garden; let robust architecture be the soil and beautiful UI be the bloom!”
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Subcomponent: Beautiful Blooming Flower SVG shapes
function FlowerSvg({
  flowerType,
  isBloomed,
}: {
  flowerType: "cherry" | "tulip" | "sunflower" | "rose" | "lotus" | "daisy";
  isBloomed: boolean;
}) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]">
      {/* 1. Closed Bud Sepals (Visible only when not bloomed) */}
      <g
        style={{
          transform: isBloomed ? "scale(0)" : "scale(1)",
          transformOrigin: "50px 50px",
          transition: "transform 0.4s ease-out",
        }}
      >
        {/* Stem */}
        <path d="M 50,70 L 50,90" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
        {/* Leaves */}
        <path d="M 50,80 Q 35,75 30,65 Q 45,70 50,80" fill="#047857" />
        <path d="M 50,82 Q 65,77 70,67 Q 55,72 50,82" fill="#047857" />
        {/* Closed Green Bud sepals */}
        <ellipse cx="50" cy="55" rx="14" ry="18" fill="#10b981" />
        <path d="M 36,55 C 36,55 42,32 50,30 C 58,32 64,55 64,55 Z" fill="#059669" />
        <path d="M 40,55 C 40,55 46,38 50,35 C 54,38 60,55 60,55 Z" fill="#34d399" />
      </g>

      {/* 2. Bloomed Flowers (Expand into view when isBloomed is true) */}
      <g
        style={{
          transform: isBloomed ? "scale(1.05)" : "scale(0)",
          transformOrigin: "50px 50px",
          transition: "transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {/* Common stem for open flowers */}
        <path d="M 50,72 L 50,90" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />

        {/* CHERRY BLOSSOM */}
        {flowerType === "cherry" && (
          <g>
            {/* Petals */}
            <g fill="url(#cherryPetals)">
              {/* Petal 1 (Top) */}
              <path d="M 50,50 C 40,25 60,25 50,50 Z" transform="rotate(0, 50, 50)" />
              {/* Petal 2 */}
              <path d="M 50,50 C 40,25 60,25 50,50 Z" transform="rotate(72, 50, 50)" />
              {/* Petal 3 */}
              <path d="M 50,50 C 40,25 60,25 50,50 Z" transform="rotate(144, 50, 50)" />
              {/* Petal 4 */}
              <path d="M 50,50 C 40,25 60,25 50,50 Z" transform="rotate(216, 50, 50)" />
              {/* Petal 5 */}
              <path d="M 50,50 C 40,25 60,25 50,50 Z" transform="rotate(288, 50, 50)" />
            </g>
            {/* Yellow stamen dots */}
            <circle cx="50" cy="50" r="7" fill="#facc15" />
            <circle cx="50" cy="50" r="4" fill="#fb923c" />
            <defs>
              <linearGradient id="cherryPetals" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#fbcfe8" />
              </linearGradient>
            </defs>
          </g>
        )}

        {/* TULIP */}
        {flowerType === "tulip" && (
          <g>
            {/* Tulip Chalice petals */}
            <path d="M 30,65 C 25,40 38,32 50,52 C 62,32 75,40 70,65 C 65,75 35,75 30,65 Z" fill="url(#tulipGrad)" />
            {/* Center petal */}
            <path d="M 40,68 C 38,48 50,30 50,30 C 50,30 62,48 60,68 Z" fill="#8b5cf6" opacity="0.9" />
            {/* Front Petal */}
            <path d="M 35,68 C 30,50 42,48 50,62 C 58,48 70,50 65,68 C 58,74 42,74 35,68 Z" fill="#6d28d9" />
            <defs>
              <linearGradient id="tulipGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#4c1d95" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
            </defs>
          </g>
        )}

        {/* SUNFLOWER */}
        {flowerType === "sunflower" && (
          <g>
            {/* Yellow pointed petals */}
            <g fill="#f59e0b">
              {Array.from({ length: 16 }).map((_, i) => (
                <path
                  key={i}
                  d="M 50,50 C 45,20 55,20 50,50 Z"
                  transform={`rotate(${i * 22.5}, 50, 50)`}
                />
              ))}
            </g>
            {/* Seed center */}
            <circle cx="50" cy="50" r="16" fill="#451a03" stroke="#d97706" strokeWidth="1.5" />
            {/* Center texture lines */}
            <circle cx="50" cy="50" r="10" fill="none" stroke="#78350f" strokeWidth="2" strokeDasharray="3,3" />
            <circle cx="50" cy="50" r="5" fill="#1c1917" />
          </g>
        )}

        {/* ROSE */}
        {flowerType === "rose" && (
          <g>
            {/* Red outer sepals */}
            <ellipse cx="50" cy="52" rx="22" ry="18" fill="#991b1b" />
            {/* Outer petals layer */}
            <path d="M 32,50 C 24,35 48,22 50,48 C 52,22 76,35 68,50 C 60,58 40,58 32,50 Z" fill="#dc2626" />
            {/* Mid petals swirl */}
            <circle cx="50" cy="46" r="12" fill="#ef4444" />
            <path d="M 42,46 C 42,38 58,38 58,46 C 58,52 42,52 42,46 Z" fill="#f87171" />
            <circle cx="50" cy="46" r="5" fill="#b91c1c" />
          </g>
        )}

        {/* LOTUS */}
        {flowerType === "lotus" && (
          <g>
            {/* Base Lily Pad */}
            <path d="M 20,72 C 20,72 50,82 80,72 C 80,72 85,82 50,82 C 15,82 20,72 20,72 Z" fill="#047857" />
            {/* Lotus Petals radiating upwards */}
            <g fill="url(#lotusGrad)">
              {/* Outer wings */}
              <path d="M 50,70 Q 20,62 30,42 Q 45,55 50,70" />
              <path d="M 50,70 Q 80,62 70,42 Q 55,55 50,70" />
              {/* Mid petals */}
              <path d="M 50,70 Q 28,52 40,32 Q 48,50 50,70" />
              <path d="M 50,70 Q 72,52 60,32 Q 52,50 50,70" />
              {/* Center hot core petal */}
              <path d="M 50,70 C 42,45 50,22 50,22 C 50,22 58,45 50,70 Z" fill="#e2e8f0" />
            </g>
            <defs>
              <linearGradient id="lotusGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#e0f7fa" />
              </linearGradient>
            </defs>
          </g>
        )}

        {/* DAISY */}
        {flowerType === "daisy" && (
          <g>
            {/* White petals */}
            <g fill="#ffffff">
              {Array.from({ length: 12 }).map((_, i) => (
                <ellipse
                  key={i}
                  cx="50"
                  cy="26"
                  rx="6"
                  ry="18"
                  transform={`rotate(${i * 30}, 50, 50)`}
                />
              ))}
            </g>
            {/* Center disk */}
            <circle cx="50" cy="50" r="13" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
            <circle cx="50" cy="50" r="7" fill="#eab308" />
          </g>
        )}
      </g>
    </svg>
  );
}
