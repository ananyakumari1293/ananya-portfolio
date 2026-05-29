import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
// Definition for type safety and clean structures
interface Offering {
  title: string;
  desc: string;
}
interface Project {
  id: string;
  fruit: string;
  title: string;
  subtitle: string;
  github: string;
  live: string;
  liveApi?: string; // Optional backend api link
  about: string;
  howItWorks?: string[];
  gameplay?: string[];
  offeringTitle?: string;
  offerings?: Offering[];
  features: string[];
  techStack: {
    [key: string]: string[];
  };
  color: string;
  splashColor: string;
  vision?: string;
  roadmap?: string[];
  quote: string;
}
interface SlicedState {
  [key: string]: {
    isSliced: boolean;
    x: number;
    y: number;
  };
}
interface JuiceParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}
export default function FruitNinja() {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [slicedFruits, setSlicedFruits] = useState<SlicedState>({});
  const [activeSplashes, setActiveSplashes] = useState<JuiceParticle[]>([]);
  const [score, setScore] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHoveringBoard, setIsHoveringBoard] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const trailPoints = useRef<{ x: number; y: number; time: number }[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const projects: Project[] = [
    {
      id: "scolorax",
      fruit: "🍓",
      title: "ScoloraX",
      subtitle: "A modern scholarship discovery platform designed to help students find opportunities without the chaos.",
      github: "https://github.com/ananyakumari1293/scolorax",
      live: "https://scolorax.vercel.app",
      about: "ScoloraX is a modern scholarship discovery platform built to simplify how students explore educational opportunities. Students often spend hours browsing scattered websites, missing deadlines and struggling to find scholarships relevant to their degree or career path. ScoloraX brings everything together into one clean and student-friendly experience.",
      offeringTitle: "🚀 WHAT SCOLORAX OFFERS",
      offerings: [
        { title: "🎯 Curated Opportunities", desc: "Discover scholarships collected and organized in one place." },
        { title: "🎓 Degree-Specific Discovery", desc: "Browse opportunities tailored B.Tech, MBA, MCA, BCA, BBA, BSc and more." },
        { title: "🔖 Save & Revisit", desc: "Bookmark scholarships and revisit important opportunities anytime." },
        { title: "📅 Deadline Awareness", desc: "Track important deadlines and avoid missing valuable applications." },
        { title: "💻 Modern Student Experience", desc: "Built with a responsive and minimal interface focused on clarity and accessibility." }
      ],
      features: [
        "Scholarship discovery platform",
        "Degree-based filtering",
        "Featured opportunities section",
        "Authentication system",
        "Save scholarship functionality",
        "Responsive UI/UX",
        "Modern dashboard experience",
        "Clean and accessible design"
      ],
      techStack: {
        "Frontend": ["React.js", "JavaScript", "CSS3"],
        "Backend": ["Node.js", "Express.js"],
        "Database": ["MongoDB"],
        "Deployment": ["Vercel"]
      },
      color: "#ef4444",
      splashColor: "rgba(239, 68, 68, 0.8)",
      vision: "ScoloraX aims to make scholarship discovery more accessible, organized, and student-friendly by reducing the frustration of scattered information and complicated searches. The goal is simple: help students focus more on opportunities and less on searching for them.",
      quote: "Opportunities should be easier to find — not harder to reach."
    },
    {
      id: "city404",
      fruit: "🍒",
      title: "CITY404",
      subtitle: "An immersive horror-themed web experience where players hide secret messages inside eerie digital rooms and challenge friends to uncover them before time runs out.",
      github: "https://github.com/ananyakumari1293/404-city",
      live: "https://404-city.vercel.app",
      about: "CITY404 is an immersive horror-themed web experience where players hide secret messages inside eerie digital rooms and challenge friends to recover them before time runs out. Choose a disturbing location inside the city, write a hidden message, and generate a mysterious signal link to send to your friend. But there’s a catch: they only get 90 seconds and two attempts to identify the correct room and recover the message before the signal disappears forever.",
      gameplay: [
        "Enter CITY 404 and choose a horror-themed room.",
        "Write a hidden secret message connected to that location.",
        "Generate a signal link and send it to your friend.",
        "Your friend enters the city and has only 90 seconds and just 2 attempts to identify the correct room and recover the hidden message. Fail the challenge... and the signal disappears forever."
      ],
      features: [
        "Cyberpunk horror UI",
        "Interactive room system",
        "Real-time countdown timer",
        "Attempt-based gameplay",
        "Glitch effects & immersive visuals",
        "Shareable game links",
        "Mobile responsive experience",
        "Atmospheric storytelling"
      ],
      techStack: {
        "Core Tech": ["Next.js", "TypeScript", "Firebase", "Tailwind CSS"],
        "Deployment": ["Vercel"]
      },
      color: "#ec4899",
      splashColor: "rgba(236, 72, 153, 0.8)",
      quote: "Some signals were never meant to be found."
    },
    {
      id: "cupidos",
      fruit: "🥝",
      title: "CupidOS",
      subtitle: "An AI-powered relationship analysis experience built around realtime conversations, emotional insights, and dynamic compatibility scoring.",
      github: "https://github.com/ananyakumari1293/CupidOS",
      live: "https://cupid-os-iota.vercel.app",
      liveApi: "https://cupidos-backend-uzi7.onrender.com",
      about: "CupidOS is a realtime AI-inspired relationship analysis platform where two people can privately connect, chat live, and receive emotional compatibility insights based on their conversations. More than just a messaging platform, CupidOS transforms conversations into dynamic emotional observations through realtime interaction analysis and conversational pattern detection. The experience blends realtime communication, emotional intelligence, conversational analytics, immersive UI/UX, and compatibility scoring into one interactive platform.",
      howItWorks: [
        "Create a private room and generate a unique invite link.",
        "Invite your partner or friend to join the session.",
        "Chat together in realtime while the system observes conversational patterns.",
        "CupidOS dynamically analyzes emotional warmth, texting consistency, playful chemistry, emotional reassurance, conversational energy, and generates personalized relationship insights."
      ],
      features: [
        "Realtime private chat system",
        "Live typing indicators",
        "Dynamic compatibility scoring",
        "AI-inspired emotional analysis",
        "Personalized relationship observations",
        "Smart conversation insights",
        "Invite-based room system",
        "Responsive immersive interface",
        "Live session countdown timer"
      ],
      techStack: {
        "Frontend": ["React.js", "React Router", "Axios", "Socket.IO Client"],
        "Backend": ["Node.js", "Express.js", "Socket.IO", "MongoDB Atlas"],
        "Deployment": ["Vercel", "Render"]
      },
      color: "#84cc16",
      splashColor: "rgba(132, 204, 22, 0.8)",
      roadmap: [
        "AI-generated compatibility summaries",
        "Emotion classification models",
        "Voice emotion analysis",
        "Mood timeline visualization",
        "Couple streak systems",
        "Advanced NLP integration"
      ],
      quote: "Every conversation leaves behind an emotional pattern."
    },
    {
      id: "triptales",
      fruit: "🍋",
      title: "TripTales",
      subtitle: "A modern travel storytelling platform built for people who travel with emotions, memories, and experiences — not just itineraries.",
      github: "https://github.com/ananyakumari1293/TripTales",
      live: "https://triptales-frontend.onrender.com",
      about: "TripTales is a modern travel storytelling platform where people can share emotional journeys, hidden places, peaceful stays, dreamy cafés, and unforgettable memories from around the world. Instead of focusing only on crowded tourist attractions, TripTales encourages meaningful exploration through authentic travel experiences shared by real people. Designed with a soft aesthetic and human-centered experience, the platform blends storytelling, discovery, and community into one immersive travel space.",
      offeringTitle: "🌍 WHAT TRIPTALES OFFERS",
      offerings: [
        { title: "📖 Share Travel Stories", desc: "Post memorable travel experiences, hidden gems, and personal adventures." },
        { title: "🗺️ Discover New Places", desc: "Explore destinations through real stories from travelers around the world." },
        { title: "☁️ Upload Beautiful Memories", desc: "Share travel images seamlessly with Cloudinary-powered image uploads." },
        { title: "🔐 Secure Authentication", desc: "Login securely using Email or Google Authentication powered by Firebase." },
        { title: "💫 Modern User Experience", desc: "Built with a clean, responsive, and soft pastel-inspired interface focused on readability and comfort." }
      ],
      features: [
        "Beautiful modern UI",
        "Travel storytelling platform",
        "Email & Google Authentication",
        "Cloudinary image uploads",
        "Responsive design",
        "Personalized travel experiences",
        "Community-driven discovery",
        "Soft aesthetic inspired interface"
      ],
      techStack: {
        "Frontend": ["React.js", "Tailwind CSS", "React Router"],
        "Backend": ["Node.js", "Express.js", "MongoDB"],
        "Authentication": ["Firebase Authentication"],
        "Media Storage": ["Cloudinary"]
      },
      color: "#eab308",
      splashColor: "rgba(234, 179, 8, 0.8)",
      vision: "TripTales was built to make travel feel more personal, emotional, and experience-driven. The platform aims to create a digital space where memories, stories, and human experiences matter more than generic travel checklists.",
      quote: "Some places stay with us long after the journey ends."
    }
  ];
  // Load beautiful typography dynamically on mount
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Outfit:wght@400;500;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);
  // Tracking sword trail drawing onto HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Filter out points older than 180ms
      const now = Date.now();
      trailPoints.current = trailPoints.current.filter((p) => now - p.time < 180);
      // Draw Sword Slash Trail
      if (trailPoints.current.length > 1) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        // Outer glow (cyan/lime tint matching Fruit Ninja theme)
        ctx.beginPath();
        ctx.moveTo(trailPoints.current[0].x, trailPoints.current[0].y);
        for (let i = 1; i < trailPoints.current.length; i++) {
          ctx.lineTo(trailPoints.current[i].x, trailPoints.current[i].y);
        }
        ctx.strokeStyle = "rgba(190, 242, 100, 0.4)"; 
        ctx.lineWidth = 14;
        ctx.stroke();
        // Inner sharp blade (white hot core)
        ctx.beginPath();
        ctx.moveTo(trailPoints.current[0].x, trailPoints.current[0].y);
        for (let i = 1; i < trailPoints.current.length; i++) {
          ctx.lineTo(trailPoints.current[i].x, trailPoints.current[i].y);
        }
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 4;
        ctx.stroke();
        // Reset shadow
        ctx.shadowBlur = 0;
      }
      animationFrameId.current = requestAnimationFrame(render);
    };
    render();
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, []);
  // Track mouse coordinates and append points to the trail
  const handleMouseMove = (e: React.MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    setCursorPos({ x, y });
    // Track movement velocity to trigger slice swiping
    const dx = x - lastMousePos.current.x;
    const dy = y - lastMousePos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Add point to trail
    trailPoints.current.push({ x, y, time: Date.now() });
    
    if (distance > 15) {
      setIsSwiping(true);
    } else {
      setIsSwiping(false);
    }
    
    lastMousePos.current = { x, y };
  };
  // Triggers slicing action with splitting physics and juice particles
  const triggerSlice = (project: Project, clientX: number, clientY: number) => {
    // If clicking an already sliced/active fruit, just open/select it
    if (slicedFruits[project.id]?.isSliced) {
      setSelectedProject(project);
      return;
    }
    // Increment score by 100
    setScore((prev) => prev + 100);
    // Reset previous sliced fruits so only ONE splits at a time
    const newSliced: SlicedState = {};
    projects.forEach((p) => {
      if (p.id === project.id) {
        newSliced[p.id] = {
          isSliced: true,
          x: clientX,
          y: clientY,
        };
      }
    });
    setSlicedFruits(newSliced);
    // Generate color-coordinated juice splatter particles
    const newParticles: JuiceParticle[] = [];
    const count = 15 + Math.floor(Math.random() * 10);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 8;
      newParticles.push({
        id: Math.random() + i,
        x: clientX,
        y: clientY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // Slight upward boost
        size: 8 + Math.random() * 12,
        color: project.color,
        alpha: 1,
      });
    }
    setActiveSplashes((prev) => [...prev, ...newParticles]);
    // Select project card shortly after visual split
    setTimeout(() => {
      setSelectedProject(project);
    }, 350);
  };
  // Update juice particles movement over time
  useEffect(() => {
    if (activeSplashes.length === 0) return;
    const interval = setInterval(() => {
      setActiveSplashes((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.4, // Simulated gravity pulling juice down
            alpha: p.alpha - 0.03, // Slow fade
          }))
          .filter((p) => p.alpha > 0)
      );
    }, 16);
    return () => clearInterval(interval);
  }, [activeSplashes]);
  const handleFruitInteraction = (project: Project, e: React.MouseEvent) => {
    triggerSlice(project, e.clientX, e.clientY);
  };
  const handleCloseProject = () => {
    setSelectedProject(null);
    setSlicedFruits({});
  };
  const handleResetBoard = () => {
    setSlicedFruits({});
    setSelectedProject(null);
    setActiveSplashes([]);
    setScore(0);
  };
  return (
    <div
      className="min-h-screen relative overflow-hidden select-none"
      style={{
        fontFamily: "'Outfit', sans-serif",
        backgroundColor: "#4a2c11",
        backgroundImage: "radial-gradient(circle, #5c3a21 0%, #2d1b0f 100%)",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHoveringBoard(true)}
      onMouseLeave={() => {
        setIsHoveringBoard(false);
        setIsSwiping(false);
      }}
    >
      {/* Knife Trail Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-20"
      />
      {/* Juice Splatter Layer */}
      {activeSplashes.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none z-10 blur-[1px]"
          style={{
            left: p.x - p.size / 2,
            top: p.y - p.size / 2,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: p.alpha,
            transform: "scale(1.2)",
            boxShadow: `0 0 10px ${p.color}`,
          }}
        />
      ))}
      {/* Floating Sparkles & Blade Trail following custom cursor */}
      {isHoveringBoard && (
        <div
          className="fixed pointer-events-none z-30 transition-transform duration-75 ease-out select-none"
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
            transform: "translate(-20px, -45px) rotate(-15deg)",
          }}
        >
          {/* Authentic Metallic Dagger Cursor */}
          <div className="relative w-16 h-16 drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]">
            <svg
              viewBox="0 0 100 100"
              className={`w-full h-full transform transition-transform duration-100 ${
                isSwiping ? "scale-110 -rotate-12" : ""
              }`}
            >
              {/* Dagger Guard */}
              <path d="M 35 65 L 65 35" stroke="#374151" strokeWidth="8" strokeLinecap="round" />
              <path d="M 38 62 L 62 38" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
              {/* Wooden Hilt/Handle */}
              <path d="M 35 65 L 15 85" stroke="#78350f" strokeWidth="7" strokeLinecap="round" />
              {/* Dagger Pommel */}
              <circle cx="15" cy="85" r="5" fill="#f59e0b" stroke="#374151" strokeWidth="2" />
              {/* Shining Metallic Blade */}
              <path
                d="M 50 50 L 85 15 L 65 35 Z"
                fill="url(#bladeGradient)"
                stroke="#4b5563"
                strokeWidth="1.5"
              />
              <path d="M 50 50 L 85 15" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
              <defs>
                <linearGradient id="bladeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#d1d5db" />
                  <stop offset="50%" stopColor="#f3f4f6" />
                  <stop offset="100%" stopColor="#9ca3af" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      )}
      {/* Decorative foliage borders */}
      <div className="absolute -top-10 -left-10 w-48 h-48 opacity-40 bg-[url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=600')] bg-cover rounded-full mix-blend-multiply pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-64 h-64 opacity-30 bg-[url('https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=800')] bg-cover rounded-full mix-blend-multiply pointer-events-none" />
      {/* Home and Reset Buttons */}
      <div className="absolute top-6 left-6 flex gap-4 z-40">
        <button
          onClick={() => navigate("/")}
          className="bg-[#C38A4D] hover:bg-[#b0783d] px-6 py-3 rounded-2xl shadow-[0_6px_0_#8b5a2b,0_10px_20px_rgba(0,0,0,0.4)] text-white font-extrabold flex items-center gap-2 border-2 border-[#dcae78] transition-all transform hover:-translate-y-1 active:translate-y-0.5"
        >
          🏠 Home
        </button>
        <button
          onClick={handleResetBoard}
          className="bg-[#3b82f6] hover:bg-[#2563eb] px-6 py-3 rounded-2xl shadow-[0_6px_0_#1d4ed8,0_10px_20px_rgba(0,0,0,0.4)] text-white font-extrabold flex items-center gap-2 border-2 border-[#93c5fd] transition-all transform hover:-translate-y-1 active:translate-y-0.5"
        >
          🔄 Restart
        </button>
      </div>
      {/* Score Counter */}
      <div className="absolute top-8 right-8 bg-black/70 text-white px-6 py-3 rounded-xl font-black text-2xl z-40">
        🏆 {score}
      </div>
      {/* Header Section */}
      <div className="text-center pt-8 relative z-30 select-none">
        <div className="inline-flex items-center gap-4 justify-center">
          <h1
            className="text-7xl md:text-8xl text-lime-300 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] font-bold tracking-wide select-none cursor-default flex items-center gap-2"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            <span className="transform -rotate-12 inline-block">🍉</span>
            Fruit Ninja Projects
          </h1>
        </div>
        <p className="text-stone-200 text-xl font-medium mt-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] max-w-lg mx-auto">
          Hover or drag over the circular floating fruit icons to split them open and view details!
        </p>
      </div>
      {/* Main Board Arena */}
      <div className="relative max-w-7xl mx-auto h-[780px] mt-2 px-6 flex justify-between items-center z-10">
        {/* Floating Circular Fruits Arena (4 Fruits in a Perfect Circular Ring) */}
        <div className="relative w-full lg:w-2/3 h-full select-none">
          
          {/* Central Hint Dagger Signboard in the exact mathematical center of the circular ring */}
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none select-none animate-pulse z-0"
            style={{
              top: "43%",
              left: "40%"
            }}
          >
            <span className="text-[72px] drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">🔪</span>
            <span className="text-stone-300 font-extrabold text-sm uppercase tracking-widest mt-1 bg-black/35 px-3 py-1 rounded-full backdrop-blur-sm select-none">
              Slice to Open
            </span>
          </div>
          {projects.map((project, index) => {
            const isSliced = slicedFruits[project.id]?.isSliced;
            
            // Mathematically balanced horizontal-vertical ellipse/circle centered at (40%, 43%)
            const positions = [
              { top: "15%", left: "40%" },  // 🍓 ScoloraX (Top-Middle)
              { top: "43%", left: "64%" },  // 🍒 CITY404 (Middle-Right)
              { top: "71%", left: "40%" },  // 🥝 CupidOS (Bottom-Middle)
              { top: "43%", left: "16%" },  // 🍋 TripTales (Middle-Left)
            ];
            const currentPos = positions[index];
            return (
              <div
                key={project.id}
                className="absolute flex flex-col items-center select-none z-10"
                style={{
                  top: currentPos.top,
                  left: currentPos.left,
                }}
              >
                {/* Circular Icon Container that Splits in Half (Reduced to w-32 h-32) */}
                <div
                  className="relative w-32 h-32 cursor-none hover:scale-105 active:scale-95 transition-transform duration-300 select-none fruit-float"
                  style={{
                    animationDelay: `${index * 0.45}s`,
                  }}
                  onMouseEnter={(e) => handleFruitInteraction(project, e)}
                  onMouseMove={(e) => {
                    if (isSwiping) handleFruitInteraction(project, e);
                  }}
                  onClick={(e) => handleFruitInteraction(project, e)}
                >
                  {/* Glowing halo behind the split */}
                  <div
                    className={`absolute inset-3 rounded-full transition-opacity duration-500 blur-xl -z-10 ${
                      isSliced ? "opacity-100 scale-125" : "opacity-0"
                    }`}
                    style={{ backgroundColor: project.color, boxShadow: `0 0 30px ${project.color}` }}
                  />
                  {/* LEFT HALF OF THE SPLIT CIRCLE */}
                  <div
                    className="absolute inset-0 bg-stone-900/35 backdrop-blur-md rounded-full border-[4px] border-[#C38A4D] shadow-[0_8px_16px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden"
                    style={{
                      clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
                      transform: isSliced ? "translateX(-38px) rotate(-15deg)" : "translateX(0) rotate(0)",
                      transition: "transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)",
                    }}
                  >
                    {/* Exact mirrored emoji to prevent alignment breaks (Reduced to 72px) */}
                    <span className="text-[72px] leading-none select-none pr-[4px]">{project.fruit}</span>
                  </div>
                  {/* RIGHT HALF OF THE SPLIT CIRCLE */}
                  <div
                    className="absolute inset-0 bg-stone-900/35 backdrop-blur-md rounded-full border-[4px] border-[#C38A4D] shadow-[0_8px_16px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden"
                    style={{
                      clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)",
                      transform: isSliced ? "translateX(38px) rotate(15deg)" : "translateX(0) rotate(0)",
                      transition: "transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)",
                    }}
                  >
                    <span className="text-[72px] leading-none select-none pl-[4px]">{project.fruit}</span>
                  </div>
                  {/* Golden shining shuriken/star core appearing when split open */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-500 z-10 ${
                      isSliced ? "opacity-100 scale-100 rotate-180" : "opacity-0 scale-50"
                    }`}
                  >
                    <span className="text-3xl text-yellow-300 drop-shadow-[0_0_12px_rgba(253,224,71,0.8)]">✦</span>
                  </div>
                </div>
                {/* Styled Label under the Circle */}
                <span
                  className="mt-3 text-3xl font-extrabold text-stone-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] select-none pointer-events-none"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  {project.title}
                </span>
              </div>
            );
          })}
        </div>
        {/* Parchment Project Details Scroll */}
        {selectedProject ? (
          <div
            className="absolute lg:relative right-4 lg:right-0 top-32 lg:top-0 w-[92%] max-w-[530px] bg-[#f7ecd0] border-[14px] border-[#a0744a] rounded-[36px] shadow-[0_15px_30px_rgba(0,0,0,0.7)] p-8 select-text z-30 transform scale-100 transition-all duration-500 hover:shadow-[0_25px_45px_rgba(0,0,0,0.8)] overflow-hidden"
            style={{
              backgroundImage: "url('https://www.transparenttextures.com/patterns/old-map.png')",
              boxShadow: "inset 0 0 100px rgba(120,70,30,0.15), 0 20px 40px rgba(0,0,0,0.6)",
              borderRadius: "20px 30px 18px 32px / 28px 18px 35px 20px", // Ragged scroll edges
            }}
          >
            {/* Scroll Header */}
            <div className="flex justify-between items-start mb-2 border-b border-amber-900/10 pb-3">
              <div>
                <h2
                  className="text-6xl text-red-950 font-extrabold leading-tight tracking-wide"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  {selectedProject.title}
                </h2>
                <p className="text-stone-700 italic font-semibold text-sm mt-0.5 leading-snug">
                  {selectedProject.subtitle}
                </p>
              </div>
              {/* Wooden rounded Close button */}
              <button
                onClick={handleCloseProject}
                className="bg-[#c29668] hover:bg-[#b07c4d] text-amber-950 font-bold w-10 h-10 rounded-full flex items-center justify-center border-2 border-amber-950 shadow-md transform hover:scale-105 active:scale-95 transition-all select-none"
              >
                ✕
              </button>
            </div>
            {/* Scroll Content Block */}
            <div className="space-y-5 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
              {/* About section */}
              <div>
                <h3 className="text-amber-950 font-black uppercase text-xs tracking-wider flex items-center gap-1.5 mb-1.5 select-none">
                  🌸 About the Project
                </h3>
                <p className="text-stone-850 text-base leading-relaxed font-medium">
                  {selectedProject.about}
                </p>
              </div>
              {/* Step-by-Step guides (Works for CupidOS and CITY404) */}
              {selectedProject.howItWorks && (
                <div>
                  <h3 className="text-amber-950 font-black uppercase text-xs tracking-wider flex items-center gap-1.5 mb-2 select-none">
                    💬 How It Works
                  </h3>
                  <div className="space-y-2">
                    {selectedProject.howItWorks.map((step, idx) => (
                      <div key={idx} className="flex gap-2 items-start bg-amber-950/5 p-2 rounded-xl border border-amber-950/10">
                        <span className="bg-amber-950 text-amber-100 font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center select-none shrink-0">
                          {idx + 1}
                        </span>
                        <p className="text-stone-800 text-sm font-semibold leading-relaxed">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selectedProject.gameplay && (
                <div>
                  <h3 className="text-amber-950 font-black uppercase text-xs tracking-wider flex items-center gap-1.5 mb-2 select-none">
                    🎮 Gameplay Walkthrough
                  </h3>
                  <div className="space-y-2">
                    {selectedProject.gameplay.map((step, idx) => (
                      <div key={idx} className="flex gap-2 items-start bg-amber-950/5 p-2 rounded-xl border border-amber-950/10">
                        <span className="bg-amber-950 text-amber-100 font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center select-none shrink-0">
                          {idx + 1}
                        </span>
                        <p className="text-stone-800 text-sm font-semibold leading-relaxed">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Offerings list (Works for ScoloraX and TripTales) */}
              {selectedProject.offerings && (
                <div>
                  <h3 className="text-amber-950 font-black uppercase text-xs tracking-wider flex items-center gap-1.5 mb-2 select-none">
                    {selectedProject.offeringTitle || "🚀 Offerings"}
                  </h3>
                  <div className="space-y-2">
                    {selectedProject.offerings.map((offering, idx) => (
                      <div key={idx} className="bg-amber-950/5 p-2.5 rounded-xl border border-amber-950/10">
                        <h4 className="font-extrabold text-amber-950 text-sm leading-snug">{offering.title}</h4>
                        <p className="text-stone-850 text-xs font-semibold mt-0.5 leading-relaxed">{offering.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Key Features */}
              <div>
                <h3 className="text-amber-950 font-black uppercase text-xs tracking-wider flex items-center gap-1.5 mb-2 select-none">
                  ✨ Key Features
                </h3>
                <ul className="grid grid-cols-1 gap-2">
                  {selectedProject.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2 text-stone-800 text-sm font-semibold">
                      <span className="text-emerald-800 font-bold select-none">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Future Roadmap (CupidOS exclusive) */}
              {selectedProject.roadmap && (
                <div>
                  <h3 className="text-amber-950 font-black uppercase text-xs tracking-wider flex items-center gap-1.5 mb-2 select-none">
                    🔮 Future Roadmap
                  </h3>
                  <ul className="space-y-1.5">
                    {selectedProject.roadmap.map((goal, rIdx) => (
                      <li key={rIdx} className="flex items-center gap-2 text-stone-850 text-sm font-semibold">
                        <span className="text-yellow-700 select-none">✦</span>
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Detailed Multi-layered Tech Stack */}
              <div>
                <h3 className="text-amber-950 font-black uppercase text-xs tracking-wider flex items-center gap-1.5 mb-2 select-none">
                  ⚙️ Tech Stack
                </h3>
                <div className="space-y-2">
                  {Object.entries(selectedProject.techStack).map(([layer, techs]) => (
                    <div key={layer} className="flex flex-col gap-1">
                      <span className="text-stone-600 font-extrabold text-[10px] uppercase select-none">{layer}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {techs.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="bg-amber-950/10 text-amber-950 px-3 py-1 rounded-full text-xs font-black border border-amber-900/10 shadow-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Project Quote Footer */}
              <div className="border-t border-amber-900/10 pt-3 text-center">
                <p className="text-stone-700 italic font-bold text-base leading-relaxed">
                  ✨ “{selectedProject.quote}”
                </p>
              </div>
            </div>
            {/* Action buttons / Deployment links */}
            <div className="flex flex-col gap-3 mt-4 border-t border-amber-900/10 pt-4 select-none">
              {/* Secondary direct backend link for CupidOS */}
              {selectedProject.liveApi && (
                <a
                  href={selectedProject.liveApi}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-stone-800/10 hover:bg-stone-800/15 text-stone-900 py-2.5 rounded-xl border border-stone-800/25 font-bold text-center text-xs transition-all transform hover:-translate-y-0.5"
                >
                  🌐 Live Backend API: {selectedProject.liveApi}
                </a>
              )}
              <div className="flex gap-4">
                <a
                  href={selectedProject.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-[#1e293b] hover:bg-[#0f172a] text-white py-3.5 rounded-2xl shadow-[0_4px_0_#020617,0_8px_16px_rgba(0,0,0,0.3)] border-2 border-stone-700 font-bold text-center flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0.5 transition-all text-sm animate-pulse"
                >
                  <svg className="w-5 h-5 fill-white animate-spin-slow" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
                  </svg>
                  GitHub
                </a>
                <a
                  href={selectedProject.live}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-[#15803d] hover:bg-[#166534] text-white py-3.5 rounded-2xl shadow-[0_4px_0_#14532d,0_8px_16px_rgba(0,0,0,0.3)] border-2 border-emerald-600 font-bold text-center flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0.5 transition-all text-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Live Demo
                </a>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      {/* Footer Banner */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 select-none z-30 pointer-events-none">
        <div
          className="bg-[#c29668] border-4 border-[#8b5a2b] px-10 py-3 rounded-xl shadow-[0_6px_0_#5a3a1b,0_10px_20px_rgba(0,0,0,0.5)] font-bold text-amber-950 flex items-center gap-3 tracking-wide"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.05) 100%)",
            borderRadius: "6px 12px 6px 14px / 10px 6px 10px 5px",
          }}
        >
          <span>Slicing dynamic circular nodes opens them in half!</span>
          <span className="bg-[#8b5a2b] text-amber-100 px-2 py-0.5 rounded-md text-xs select-none">🥷</span>
        </div>
      </div>
    </div>
  );
}
