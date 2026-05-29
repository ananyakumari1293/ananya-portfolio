import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Coordinates for the snaking candy cane level path
interface PathNode {
  id: string;
  x: number;
  y: number;
  emoji: string;
  label: string;
  themeColor: string;
  stars: number; // Completion milestones (1, 2, or 3 stars)
  gradient: string;
  ringGlow: string;
}
interface CandyParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  emoji: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  alpha: number;
}
interface DecorativeCandy {
  id: number;
  x: number;
  y: number;
  emoji: string;
  delay: number;
  duration: number;
  size: number;
}
export default function CandyCrush() {
  const navigate = useNavigate();
  const [activeLevel, setActiveLevel] = useState("profile");
  const [particles, setParticles] = useState<CandyParticle[]>([]);
  const [bgCandies, setBgCandies] = useState<DecorativeCandy[]>([]);
  // Candy path nodes mapped to a beautiful curvy S-snake track
  const nodes: PathNode[] = [
    {
      id: "profile",
      x: 190,
      y: 65,
      emoji: "🍓",
      label: "Level 1: Profile",
      themeColor: "text-pink-500",
      stars: 3,
      gradient: "from-pink-400 to-rose-600",
      ringGlow: "rgba(244, 114, 182, 0.4)",
    },
    {
      id: "education",
      x: 70,
      y: 195,
      emoji: "🍬",
      label: "Level 2: Education",
      themeColor: "text-purple-600",
      stars: 3,
      gradient: "from-purple-400 to-indigo-600",
      ringGlow: "rgba(168, 85, 247, 0.4)",
    },
    {
      id: "skills",
      x: 180,
      y: 325,
      emoji: "🍋",
      label: "Level 3: Skills",
      themeColor: "text-amber-500",
      stars: 3,
      gradient: "from-yellow-350 to-amber-500",
      ringGlow: "rgba(245, 158, 11, 0.4)",
    },
    {
      id: "achievements",
      x: 270,
      y: 455,
      emoji: "🍏",
      label: "Level 4: Badges",
      themeColor: "text-emerald-600",
      stars: 2,
      gradient: "from-lime-400 to-emerald-600",
      ringGlow: "rgba(34, 197, 94, 0.4)",
    },
    {
      id: "projects",
      x: 130,
      y: 585,
      emoji: "🍒",
      label: "Level 5: Slices",
      themeColor: "text-red-500",
      stars: 3,
      gradient: "from-red-400 to-rose-650",
      ringGlow: "rgba(239, 68, 68, 0.4)",
    },
    {
      id: "goal",
      x: 200,
      y: 715,
      emoji: "👑",
      label: "Level 6: Objective",
      themeColor: "text-blue-500",
      stars: 3,
      gradient: "from-blue-400 to-blue-650",
      ringGlow: "rgba(59, 130, 246, 0.4)",
    },
  ];
  // Set up decorative candies floating in background
  useEffect(() => {
    const candyEmojis = ["🍬", "🍭", "🍩", "🍪", "🧁", "🍫", "🍒", "🍋", "🍓", "🍉", "✨"];
    const decorative: DecorativeCandy[] = [];
    for (let i = 0; i < 20; i++) {
      decorative.push({
        id: i,
        x: Math.random() * 90, // % left
        y: Math.random() * 90, // % top
        emoji: candyEmojis[Math.floor(Math.random() * candyEmojis.length)],
        delay: Math.random() * 6,
        duration: 12 + Math.random() * 15,
        size: 16 + Math.random() * 20,
      });
    }
    setBgCandies(decorative);
  }, []);
  // Update sugar particle splatters over time
  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.35, // Simulated gravity
            rotation: p.rotation + p.rotationSpeed,
            alpha: p.alpha - 0.025,
          }))
          .filter((p) => p.alpha > 0)
      );
    }, 16);
    return () => clearInterval(interval);
  }, [particles]);
  // Trigger sweet candy confetti pop when clicking nodes
  const triggerCandyPop = (x: number, y: number) => {
    const popEmojis = ["🍬", "🍭", "🍫", "🍩", "✨", "🌟", "💖", "🍓", "🍒", "🍋"];
    const newParticles: CandyParticle[] = [];
    const count = 12 + Math.floor(Math.random() * 8);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 6;
      newParticles.push({
        id: Math.random() + i,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5, // Slight pop upward
        emoji: popEmojis[Math.floor(Math.random() * popEmojis.length)],
        size: 14 + Math.random() * 16,
        rotation: Math.random() * 360,
        rotationSpeed: -8 + Math.random() * 16,
        alpha: 1,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
  };
  const handleNodeClick = (node: PathNode, e: React.MouseEvent) => {
    setActiveLevel(node.id);
    triggerCandyPop(e.clientX, e.clientY);
  };
  // Helper to dynamically theme details card highlights
  const getThemeStyles = () => {
    switch (activeLevel) {
      case "education":
        return {
          headerBg: "bg-purple-100 border-purple-200 text-purple-700",
          cardBorder: "border-purple-200/50",
          buttonColor: "bg-purple-500 hover:bg-purple-600 shadow-purple-300",
          badgeColor: "bg-purple-50 text-purple-950 border-purple-200",
        };
      case "skills":
        return {
          headerBg: "bg-amber-100 border-amber-200 text-amber-700",
          cardBorder: "border-amber-200/50",
          buttonColor: "bg-amber-500 hover:bg-amber-600 shadow-amber-300",
          badgeColor: "bg-amber-50 text-amber-950 border-amber-200",
        };
      case "achievements":
        return {
          headerBg: "bg-emerald-100 border-emerald-200 text-emerald-700",
          cardBorder: "border-emerald-200/50",
          buttonColor: "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-300",
          badgeColor: "bg-emerald-50 text-emerald-950 border-emerald-200",
        };
      case "projects":
        return {
          headerBg: "bg-red-100 border-red-200 text-red-700",
          cardBorder: "border-red-200/50",
          buttonColor: "bg-red-500 hover:bg-red-600 shadow-red-300",
          badgeColor: "bg-red-50 text-red-950 border-red-200",
        };
      case "goal":
        return {
          headerBg: "bg-blue-100 border-blue-200 text-blue-700",
          cardBorder: "border-blue-200/50",
          buttonColor: "bg-blue-500 hover:bg-blue-600 shadow-blue-300",
          badgeColor: "bg-blue-50 text-blue-950 border-blue-200",
        };
      default:
        return {
          headerBg: "bg-pink-100 border-pink-200 text-pink-700",
          cardBorder: "border-pink-200/50",
          buttonColor: "bg-pink-500 hover:bg-pink-600 shadow-pink-300",
          badgeColor: "bg-pink-50 text-pink-950 border-pink-200",
        };
    }
  };
  const currentTheme = getThemeStyles();
  return (
    <div
      className="min-h-screen relative overflow-hidden select-none"
      style={{
        fontFamily: "'Outfit', sans-serif",
        backgroundImage: "radial-gradient(circle, #fff3f5 0%, #ffe5eb 100%)",
      }}
    >
      {/* 1. Animated Floating Background Candies */}
      {bgCandies.map((c) => (
        <div
          key={c.id}
          className="absolute pointer-events-none select-none select-none opacity-[0.14] animate-float-slow text-center"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            fontSize: `${c.size}px`,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
          }}
        >
          {c.emoji}
        </div>
      ))}
      {/* 2. Interactive Candy Confetti Layer */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="fixed pointer-events-none z-50 text-center select-none"
          style={{
            left: p.x - p.size / 2,
            top: p.y - p.size / 2,
            fontSize: `${p.size}px`,
            opacity: p.alpha,
            transform: `rotate(${p.rotation}deg)`,
            textShadow: "0 4px 8px rgba(0,0,0,0.15)",
          }}
        >
          {p.emoji}
        </div>
      ))}
      {/* 3. Header Panel */}
      <div className="max-w-7xl mx-auto px-6 pt-10 select-none z-10 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          {/* Back button wrapper as a glossy candy shell */}
          <button
            onClick={() => navigate("/")}
            className="bg-white hover:bg-pink-50 text-pink-600 font-extrabold px-6 py-3.5 rounded-full shadow-[0_6px_0_#fda4af,0_10px_20px_rgba(0,0,0,0.1)] border-2 border-pink-200 flex items-center gap-2 transform active:translate-y-0.5 hover:-translate-y-0.5 transition-all text-sm w-fit"
          >
            ← Back Home
          </button>
          <div className="text-center md:text-right shrink-0">
            <h1
              className="text-6xl md:text-7xl text-pink-500 font-black drop-shadow-[0_2px_4px_rgba(244,63,94,0.15)] select-none leading-none flex items-center justify-center md:justify-end gap-2"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              🍭 Candy Crush Career Journey
            </h1>
            <p className="text-slate-500 text-lg font-bold mt-2">
              Pop a level candy to unlock milestones of my professional path!
            </p>
          </div>
        </div>
        {/* 4. Board Arena Layout */}
        <div className="grid lg:grid-cols-[380px_1fr] gap-12 items-start relative pb-20">
          
          {/* LEFT PANEL: SVG SNAPPING SNAKE ROAD */}
          <div className="relative w-full max-w-[340px] mx-auto h-[780px] select-none shrink-0 bg-white/20 backdrop-blur-sm rounded-[40px] border-4 border-white/40 shadow-2xl p-4 overflow-hidden">
            {/* Curving SVG Candy cane lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 320 780"
              fill="none"
            >
              {/* Outer pink shadow tracks */}
              <path
                d="M 190 65 C 190 130, 70 130, 70 195 C 70 260, 180 260, 180 325 C 180 390, 270 390, 270 455 C 270 525, 130 525, 130 585 C 130 655, 200 655, 200 715"
                stroke="rgba(244, 114, 182, 0.25)"
                strokeWidth="24"
                strokeLinecap="round"
              />
              {/* Core Pink candy track */}
              <path
                d="M 190 65 C 190 130, 70 130, 70 195 C 70 260, 180 260, 180 325 C 180 390, 270 390, 270 455 C 270 525, 130 525, 130 585 C 130 655, 200 655, 200 715"
                stroke="#f472b6"
                strokeWidth="12"
                strokeLinecap="round"
              />
              {/* White Dashed Stripe candy overlay */}
              <path
                d="M 190 65 C 190 130, 70 130, 70 195 C 70 260, 180 260, 180 325 C 180 390, 270 390, 270 455 C 270 525, 130 525, 130 585 C 130 655, 200 655, 200 715"
                stroke="#ffffff"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="14 14"
              />
            </svg>
            {/* Level Candies positioned accurately along the track */}
            {nodes.map((node) => {
              const active = activeLevel === node.id;
              return (
                <div
                  key={node.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 select-none group"
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                  }}
                >
                  {/* Glowing 3D Candy Button Pin */}
                  <button
                    onClick={(e) => handleNodeClick(node, e)}
                    className={`relative w-20 h-20 rounded-full text-4xl shadow-[0_8px_16px_rgba(0,0,0,0.25)] flex items-center justify-center border-[4px] border-white/60 bg-gradient-to-br transition-all duration-300 transform select-none hover:scale-115 active:scale-95 ${
                      node.gradient
                    } ${active ? "ring-[6px] ring-white scale-110" : ""}`}
                    style={{
                      boxShadow: active
                        ? `0 0 30px ${node.ringGlow}, inset 0 -6px 0 rgba(0,0,0,0.2), 0 8px 16px rgba(0,0,0,0.3)`
                        : "inset 0 -6px 0 rgba(0,0,0,0.2), 0 8px 16px rgba(0,0,0,0.25)",
                    }}
                  >
                    {/* Candy shine reflection overlay */}
                    <div className="absolute inset-1 rounded-full bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
                    <span className="transform group-hover:scale-110 transition-transform">{node.emoji}</span>
                    {/* Level Number tag Badge */}
                    <div className="absolute -top-3 -right-2 bg-yellow-400 border-[3px] border-white text-amber-950 font-black text-xs px-2 py-0.5 rounded-full shadow select-none">
                      {nodes.findIndex((n) => n.id === node.id) + 1}
                    </div>
                  </button>
                  {/* Gold Milestone stars below */}
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex gap-0.5 scale-90 select-none">
                    {Array.from({ length: 3 }).map((_, sIdx) => (
                      <span
                        key={sIdx}
                        className={`text-sm leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] ${
                          sIdx < node.stars ? "text-yellow-400" : "text-stone-300"
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
          {/* RIGHT PANEL: IMMERSIVE CANDY JAR CARD */}
          <div
            className="w-full bg-[#fdfaf5] border-[14px] border-[#e8d2bd] rounded-[48px] shadow-[0_20px_45px_rgba(0,0,0,0.15)] p-8 md:p-10 select-text z-10 transition-all duration-300 transform scale-100 hover:shadow-[0_25px_50px_rgba(0,0,0,0.2)] overflow-hidden"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(245,235,220,0.15) 100%)",
              borderRadius: "40px 48px 36px 44px / 44px 38px 48px 40px",
            }}
          >
            {/* Details Profile Content */}
            {activeLevel === "profile" && (
              <div className="animate-fade-in space-y-6">
                <div className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-3xl border-2 ${currentTheme.cardBorder} ${currentTheme.headerBg}`}>
                  <div className="text-7xl leading-none select-none">🍓</div>
                  <div>
                    <h2
                      className="text-6xl text-pink-500 font-black leading-tight tracking-wide"
                      style={{ fontFamily: "'Caveat', cursive" }}
                    >
                      Hi, I'm Ananya
                    </h2>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mt-0.5">
                      Level 1 Milestone: The Sweet Beginning
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-lg leading-relaxed text-slate-700 font-medium italic">
                    I'm Ananya Kumari, a Computer Science Engineering student at Vellore Institute of Technology with a passion for creating digital products that seamlessly blend technology, creativity, and meaningful user experiences.
                  </p>
                  <p className="text-lg leading-relaxed text-slate-700 font-medium italic">
                    My journey started with a deep curiosity about how websites and applications function, which eventually grew into a strong specialization in Full Stack Development, System Design, Cloud Infrastructures, and Artificial Intelligence.
                  </p>
                  <p className="text-lg leading-relaxed text-slate-700 font-medium italic">
                    Today I construct highly scalable web solutions using React.js, Next.js, Node.js, TypeScript, MongoDB, and Firebase while continuously refining my competitive problem-solving capabilities through Data Structures & Algorithms.
                  </p>
                </div>
                {/* snapshot block */}
                <div className="bg-white rounded-3xl p-6 shadow-md border border-[#e8d2bd]/40">
                  <h3 className="font-extrabold text-2xl mb-4 text-slate-900 flex items-center gap-2">
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
                        <span className="text-pink-500 text-lg">🍬</span>
                        <span>{snap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Social wraps */}
                <div className="mt-8 flex flex-wrap gap-4 pt-2 border-t border-[#e8d2bd]/30 select-none">
                  <a
                    href="https://github.com/ananyakumari1293"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-black hover:scale-105 text-white px-7 py-3.5 rounded-full font-black shadow-lg transform active:translate-y-0.5 transition-all text-sm flex items-center gap-2"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/ananya-kumari-362906373/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:scale-105 text-white px-7 py-3.5 rounded-full font-black shadow-lg transform active:translate-y-0.5 transition-all text-sm flex items-center gap-2"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://www.instagram.com/_ananyaaaa__.__"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-pink-500 to-red-500 hover:scale-105 text-white px-7 py-3.5 rounded-full font-black shadow-lg transform active:translate-y-0.5 transition-all text-sm flex items-center gap-2"
                  >
                    Instagram
                  </a>
                </div>
              </div>
            )}
            {/* Details Education Content */}
            {activeLevel === "education" && (
              <div className="animate-fade-in space-y-6">
                <div className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-3xl border-2 ${currentTheme.cardBorder} ${currentTheme.headerBg}`}>
                  <div className="text-7xl leading-none select-none">🍬</div>
                  <div>
                    <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">
                      Education
                    </h2>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mt-0.5">
                      Level 2 Milestone: Academic Achievements
                    </p>
                  </div>
                </div>
                <div className="space-y-6 max-h-[440px] overflow-y-auto pr-2 custom-scrollbar select-text">
                  <div className="bg-white p-6 rounded-3xl shadow-md border border-purple-100 flex flex-col gap-2">
                    <div className="flex justify-between items-start gap-4 flex-wrap">
                      <h3 className="text-2xl font-black text-slate-900">
                        Vellore Institute of Technology
                      </h3>
                      <span className="text-purple-600 font-black text-sm uppercase bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                        B.Tech CSE
                      </span>
                    </div>
                    <p className="text-purple-600 font-extrabold text-base">
                      Bachelor of Technology — Computer Science & Engineering
                    </p>
                    <p className="text-slate-500 text-sm font-bold">2023 – 2027 (Expected)</p>
                    <div className="mt-2 inline-block bg-purple-100/60 border border-purple-300 text-purple-900 px-4 py-1.5 rounded-full font-black w-fit text-sm">
                      ✨ GPA: 8.76
                    </div>
                    <p className="mt-2 leading-relaxed text-slate-700 font-medium italic text-sm">
                      Building exceptionally strong foundations in Data Structures & Algorithms, Object-Oriented Programming (OOP), Database Management Systems (DBMS), Operating Systems, Computer Networks, and Software Engineering while actively developing real-world full stack applications.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-md border border-purple-100 flex flex-col gap-2">
                    <h3 className="text-2xl font-black text-slate-900">
                      Central Board of Secondary Education
                    </h3>
                    <p className="text-purple-600 font-extrabold text-base">Class XII</p>
                    <p className="text-slate-500 text-sm font-bold mt-1">Percentage: 75%+</p>
                    <p className="mt-2 leading-relaxed text-slate-700 font-medium italic text-sm">
                      Developed analytical thinking, quantitative reasoning, and scientific problem-solving skills while strengthening interest in computer engineering and tech disciplines.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-md border border-purple-100 flex flex-col gap-2">
                    <h3 className="text-2xl font-black text-slate-900">
                      Central Board of Secondary Education
                    </h3>
                    <p className="text-purple-600 font-extrabold text-base">Class X</p>
                    <p className="text-slate-500 text-sm font-bold mt-1">Percentage: 90%+</p>
                    <p className="mt-2 leading-relaxed text-slate-700 font-medium italic text-sm">
                      Demonstrated outstanding academic excellence with honors in Mathematics, Science, and logical reasoning, establishing a highly analytical baseline.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {/* Details Skills Content */}
            {activeLevel === "skills" && (
              <div className="animate-fade-in space-y-6">
                <div className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-3xl border-2 ${currentTheme.cardBorder} ${currentTheme.headerBg}`}>
                  <div className="text-7xl leading-none select-none">🍋</div>
                  <div>
                    <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">
                      Technical Expertise
                    </h2>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mt-0.5">
                      Level 3 Milestone: Developer Toolkit
                    </p>
                  </div>
                </div>
                <p className="text-slate-700 text-base font-semibold leading-relaxed italic p-2 border-l-4 border-amber-400">
                  Experienced in modern frontend engineering architectures, backend microservice deployment, responsive layouts, API designs, and scalable cloud-based full stack application construction.
                </p>
                <div className="bg-white rounded-3xl p-6 shadow-md border border-amber-100">
                  <h3 className="font-extrabold text-xl mb-4 text-amber-900">
                    My Candy Bag of Skills 🍬
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
                        className="bg-amber-100/50 text-amber-950 px-4 py-2.5 rounded-full text-sm font-black border border-amber-200/50 shadow-sm transform hover:scale-105 transition-all select-none cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {/* Details Achievements Content */}
            {activeLevel === "achievements" && (
              <div className="animate-fade-in space-y-6">
                <div className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-3xl border-2 ${currentTheme.cardBorder} ${currentTheme.headerBg}`}>
                  <div className="text-7xl leading-none select-none">🍏</div>
                  <div>
                    <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">
                      Achievements & Badges
                    </h2>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mt-0.5">
                      Level 4 Milestone: Completed Triumphs
                    </p>
                  </div>
                </div>
                <div className="space-y-4 max-h-[440px] overflow-y-auto pr-2 custom-scrollbar">
                  {[
                    {
                      title: "🏆 200+ Competitive DSA Problems Solved",
                      desc: "Strengthened core algorithmic thinking, data structure optimization strategies, and complex problem-solving capabilities.",
                      accent: "border-emerald-200 text-emerald-950 bg-emerald-50/20",
                    },
                    {
                      title: "💼 JPMorgan Chase Software Experience",
                      desc: "Gained hands-on experience in REST APIs, Kafka messaging, backend integration architectures, and enterprise engineering workflows.",
                      accent: "border-purple-200 text-purple-950 bg-purple-50/20",
                    },
                    {
                      title: "🚀 Deloitte Technology Simulation",
                      desc: "Consulted on network topology designs, enterprise cybersecurity setups, scalable cloud pipelines, and big data analysis.",
                      accent: "border-blue-200 text-blue-950 bg-blue-50/20",
                    },
                    {
                      title: "☁️ AWS Certified Cloud Practitioner",
                      desc: "Validated deep theoretical and practical understanding of scalable cloud micro-architectures, security configurations, and deployment networks.",
                      accent: "border-pink-200 text-pink-950 bg-pink-50/20",
                    },
                  ].map((ach, idx) => (
                    <div
                      key={idx}
                      className={`p-5 rounded-3xl border-2 shadow-sm flex flex-col gap-1.5 ${ach.accent}`}
                    >
                      <h3 className="font-extrabold text-lg leading-snug">{ach.title}</h3>
                      <p className="text-stone-700 text-sm font-medium leading-relaxed">{ach.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Details Projects Content */}
            {activeLevel === "projects" && (
              <div className="animate-fade-in space-y-6">
                <div className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-3xl border-2 ${currentTheme.cardBorder} ${currentTheme.headerBg}`}>
                  <div className="text-7xl leading-none select-none">🍒</div>
                  <div>
                    <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">
                      Featured Projects
                    </h2>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mt-0.5">
                      Level 5 Milestone: Sweet Deployments
                    </p>
                  </div>
                </div>
                <div className="space-y-5 max-h-[440px] overflow-y-auto pr-2 custom-scrollbar">
                  {[
                    {
                      title: "🎓 ScoloraX",
                      desc: "A scholarship discovery platform designed to simplify academic funding searches. Integrated dynamic degree filters, and feature cards into a student-first responsive dashboard.",
                      tech: "React.js • Node.js • MongoDB • Firebase • Tailwind CSS",
                      accent: "border-pink-200",
                    },
                    {
                      title: "🌆 CITY404",
                      desc: "Immersive analog cyberpunk horror room escape game. Users challenge friends to solve puzzle environments, crack coded locks, and retrieve signals in 90 seconds.",
                      tech: "Next.js • TypeScript • Firebase • Tailwind CSS",
                      accent: "border-red-200",
                    },
                    {
                      title: "✈️ TripTales",
                      desc: "Travel log memory storytelling website incorporating Firebase User profiles, Cloudinary media storage APIs, and high-fidelity feed scrolling feeds.",
                      tech: "React.js • Node.js • Express.js • MongoDB",
                      accent: "border-yellow-200",
                    },
                  ].map((proj, idx) => (
                    <div
                      key={idx}
                      className={`bg-white p-5 rounded-3xl shadow-sm border-2 flex flex-col gap-2 ${proj.accent}`}
                    >
                      <h3 className="text-xl font-extrabold text-slate-900 flex items-center justify-between">
                        <span>{proj.title}</span>
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full uppercase">Deployed</span>
                      </h3>
                      <p className="text-slate-650 text-sm font-medium leading-relaxed">{proj.desc}</p>
                      <p className="text-xs font-black text-pink-600 bg-pink-50 border border-pink-200/40 px-3 py-1.5 rounded-full w-fit">
                        {proj.tech}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Details Career Goal Content */}
            {activeLevel === "goal" && (
              <div className="animate-fade-in space-y-6">
                <div className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-3xl border-2 ${currentTheme.cardBorder} ${currentTheme.headerBg}`}>
                  <div className="text-7xl leading-none select-none">👑</div>
                  <div>
                    <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">
                      Career Objective
                    </h2>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mt-0.5">
                      Level 6 Milestone: King Candy Goal
                    </p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-md border-2 border-blue-200 flex flex-col gap-4">
                  <p className="text-xl leading-relaxed text-slate-700 italic font-medium border-l-4 border-blue-500 pl-4">
                    To construct scalable, highly impactful, and user-centric digital products that combine software engineering excellence, thoughtful design patterns, and modern cloud deployment networks while continuously researching Artificial Intelligence, NLP models, and emergent technologies.
                  </p>
                  <p className="text-slate-550 text-sm font-semibold italic text-center text-blue-600 bg-blue-50 py-2.5 rounded-2xl select-none">
                    ✨ “Sugarcoat your code with robust architecture and excellent UI.”
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
