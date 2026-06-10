import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
// Interfaces for skill categories
interface PinData {
  id: number;
  title: string;
  skills: string[];
  description: string;
  links?: { [key: string]: string };
  color: string;
  glowColor: string;
  // Position coordinates in 3D perspective space (relative % coordinates on pin deck)
  // Pin deck is located in the upper portion of the lane
  x: number; // 0 to 100
  y: number; // 0 to 100 relative to pin deck height
}
export default function BowlingZone() {
  // Score & Pin States
  const [score, setScore] = useState(0);
  const [knockedPins, setKnockedPins] = useState<{ [key: number]: boolean }>({});
  const [activePin, setActivePin] = useState<PinData | null>(null);
  const [discoveredCount, setDiscoveredCount] = useState(0);
  const [strikeTriggered, setStrikeTriggered] = useState(false);
  // Ball Throw/Drag Physics Engine States
  const laneRef = useRef<HTMLDivElement | null>(null);
  const ballRef = useRef<HTMLDivElement | null>(null);
  const [ballPos, setBallPos] = useState({ x: 50, y: 88 }); // % coords relative to lane container
  const [ballScale, setBallScale] = useState(1);
  const [ballSpin, setBallSpin] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [aimLine, setAimLine] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  // Sparkles & Action Particle States
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; vx: number; vy: number; color: string; size: number; opacity: number }[]>([]);
  // Web Audio Context for Procedural Audio Synthesis
  const audioCtxRef = useRef<AudioContext | null>(null);
  // Seven custom pins representing professional core strengths
  const pins: PinData[] = [
    {
      id: 1,
      title: "Programming Languages",
      skills: ["C++", "Java", "Python", "JavaScript", "TypeScript", "SQL", "HTML", "CSS"],
      description: "Strong foundation in object-oriented programming, problem solving, algorithms, database querying and modern web technologies.",
      color: "#ff007f",
      glowColor: "rgba(255, 0, 127, 0.8)",
      x: 50, // Row 1: Center Front
      y: 75,
    },
    {
      id: 2,
      title: "Frontend Engineering",
      skills: ["React.js", "Next.js", "Tailwind CSS", "Responsive Design", "Interactive UI/UX", "TypeScript"],
      description: "Experienced in building scalable, responsive and performance-focused web applications with modern frontend architectures.",
      color: "#00f2fe",
      glowColor: "rgba(0, 242, 254, 0.8)",
      x: 38, // Row 2: Middle Left
      y: 50,
    },
    {
      id: 3,
      title: "Backend Development",
      skills: ["Node.js", "Express.js", "REST APIs", "Authentication Systems", "MongoDB", "Firebase"],
      description: "Skilled in designing secure backend systems, API architectures, authentication workflows and scalable data management solutions.",
      color: "#00f2ad",
      glowColor: "rgba(0, 242, 173, 0.8)",
      x: 62, // Row 2: Middle Right
      y: 50,
    },
    {
      id: 4,
      title: "Cloud & Deployment",
      skills: ["AWS", "Firebase", "MongoDB Atlas", "Render", "Vercel", "Cloudinary", "Linux", "Git", "GitHub"],
      description: "Experience deploying cloud-native applications and managing modern development workflows.",
      color: "#a855f7",
      glowColor: "rgba(168, 85, 247, 0.8)",
      x: 23, // Row 3: Back Left
      y: 25,
    },
    {
      id: 5,
      title: "Computer Science Core",
      skills: ["Data Structures & Algorithms", "DBMS", "OOPs", "Operating Systems", "Computer Networks", "System Design"],
      description: "Strong understanding of software engineering principles, system architecture and computational problem solving.",
      color: "#facc15",
      glowColor: "rgba(250, 204, 21, 0.8)",
      x: 41, // Row 3: Back Center-Left
      y: 25,
    },
    {
      id: 6,
      title: "Certifications & Virtual Experiences",
      skills: ["AWS Cloud Certified", "JPMorgan Chase Software Engineering", "Deloitte Technology Simulation"],
      description: "Industry-focused simulations covering backend engineering, enterprise architecture, networking, consulting workflows and software development practices.",
      links: {
        "JPMorgan Experience": "https://www.theforage.com/simulations/jpmorgan/advanced-software-engineering-r0fm/completed",
        "Deloitte Simulation": "https://www.theforage.com/simulations/deloitte-au/technology-fz0w/completed",
      },
      color: "#f97316",
      glowColor: "rgba(249, 115, 22, 0.8)",
      x: 59, // Row 3: Back Center-Right
      y: 25,
    },
    {
      id: 7,
      title: "Achievements",
      skills: ["200+ DSA Problems Solved", "GPA: 8.76", "Built: ScoloraX, CITY404, CupidOS, TripTales"],
      description: "Consistently focused on practical engineering, algorithmic problem solving and real-world product development.",
      color: "#fbbf24",
      glowColor: "rgba(251, 191, 36, 0.8)",
      x: 77, // Row 3: Back Right
      y: 25,
    },
  ];
  // Dynamic Typography & Styles Injection on Mount
  useEffect(() => {
    const fontLink = document.createElement("link");
    fontLink.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800;900&family=Bungee+Shade&family=Monoton&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);
    // CSS Keyframe styles for retro neon blink and wood boards
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      @keyframes neonPulse {
        0%, 100% { opacity: 0.9; box-shadow: 0 0 15px var(--glow), inset 0 0 5px var(--glow); }
        50% { opacity: 0.6; box-shadow: 0 0 8px var(--glow), inset 0 0 2px var(--glow); }
      }
      @keyframes laneGutterCyan {
        0%, 100% { box-shadow: 0 0 20px #00f2fe, inset 0 0 10px #00f2fe; }
        50% { box-shadow: 0 0 35px #00f2fe, inset 0 0 15px #00f2fe; }
      }
      @keyframes laneGutterPink {
        0%, 100% { box-shadow: 0 0 20px #ff007f, inset 0 0 10px #ff007f; }
        50% { box-shadow: 0 0 35px #ff007f, inset 0 0 15px #ff007f; }
      }
      @keyframes arrowFloat {
        0%, 100% { transform: translateY(0) scale(1); opacity: 0.8; }
        50% { transform: translateY(-8px) scale(1.05); opacity: 1; }
      }
      @keyframes strikeFlash {
        0%, 100% { background-color: rgba(255,255,255,0); }
        50% { background-color: rgba(255,255,255,0.18); }
      }
      @keyframes confettiFloat {
        0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }
      .perspective-lane {
        perspective: 900px;
        perspective-origin: 50% 25%;
      }
      .wood-plank {
        background: linear-gradient(90deg, 
          #40220d 0%, #40220d 2%, 
          #593119 2.5%, #593119 23%, 
          #40220d 23.5%, #40220d 25.5%,
          #6e3e21 26%, #6e3e21 47%,
          #40220d 47.5%, #40220d 49.5%,
          #532d16 50%, #532d16 73%,
          #40220d 73.5%, #40220d 75.5%,
          #63371d 76%, #63371d 97%,
          #40220d 97.5%, #40220d 100%
        );
        background-size: 14% 100%;
      }
      .glassmorphism {
        background: rgba(15, 10, 25, 0.45);
        backdrop-filter: blur(16px) saturate(140%);
        -webkit-backdrop-filter: blur(16px) saturate(140%);
        border: 1px solid rgba(255, 255, 255, 0.08);
      }
      .glassmorphism-card {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(25px) saturate(160%);
        -webkit-backdrop-filter: blur(25px) saturate(160%);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
      }
      .pin-tilt-1 { transform: rotate(15deg) translate(8px, 12px) scale(0.9); opacity: 0.7; filter: blur(0.5px); }
      .pin-tilt-2 { transform: rotate(-35deg) translate(-15px, 8px) scale(0.85); opacity: 0.5; filter: blur(1px); }
      .pin-tilt-3 { transform: rotate(45deg) translate(20px, 15px) scale(0.8); opacity: 0.4; filter: blur(1px); }
      .pin-tilt-4 { transform: rotate(-65deg) translate(-25px, 20px) scale(0.75); opacity: 0.3; filter: blur(1.5px); }
      
      /* Pure custom neon text glows */
      .neon-text-cyan {
        text-shadow: 0 0 5px #fff, 0 0 10px #00f2fe, 0 0 20px #00f2fe, 0 0 30px #00f2fe;
      }
      .neon-text-pink {
        text-shadow: 0 0 5px #fff, 0 0 10px #ff007f, 0 0 20px #ff007f, 0 0 30px #ff007f;
      }
      .neon-text-gold {
        text-shadow: 0 0 5px #fff, 0 0 10px #fbbf24, 0 0 25px #fbbf24, 0 0 40px #fbbf24;
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
    // Resume if suspended (browser security rules)
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };
  // Noise Buffer Generator for roll & strike rumble
  const createNoiseBuffer = () => {
    if (!audioCtxRef.current) return null;
    const bufferSize = audioCtxRef.current.sampleRate * 2; // 2 seconds
    const buffer = audioCtxRef.current.createBuffer(1, bufferSize, audioCtxRef.current.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  };
  // Synthesize Bowling Ball Roll (Low-frequency filtered rumble)
  const playRollSound = (duration: number) => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const noise = ctx.createBufferSource();
    const noiseBuffer = createNoiseBuffer();
    if (!noiseBuffer) return;
    noise.buffer = noiseBuffer;
    noise.loop = true;
    // Create a low pass filter to convert noise into a heavy rolling rumble
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(60, ctx.currentTime);
    // Modulate filter frequency slightly over time to sound like rotating core
    filter.frequency.linearRampToValueAtTime(140, ctx.currentTime + duration);
    // Gain control for fade in/out
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.45, ctx.currentTime + 0.15); // Quick fade in
    gainNode.gain.setValueAtTime(0.45, ctx.currentTime + duration - 0.2);
    gainNode.gain.linearRampToValueAtTime(0.01, ctx.currentTime + duration); // Fade out prior to crash
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    noise.start();
    noise.stop(ctx.currentTime + duration);
  };
  // Synthesize Pin Strike Impact (Impact burst + wooden/hollow plastic resonance)
  const playStrikeSound = () => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const now = ctx.currentTime;
    // 1. Solid Impact Crack (High frequency high-pass noise pulse)
    const noise = ctx.createBufferSource();
    const noiseBuffer = createNoiseBuffer();
    if (noiseBuffer) {
      noise.buffer = noiseBuffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(1000, now);
      noiseFilter.Q.setValueAtTime(3.0, now);
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.8, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.4);
    }
    // 2. Wooden Pin Clatters (Procedural wooden cylinders colliding)
    // Synthesized by blending multiple bandpass filtered ringing oscillators
    const pinFrequencies = [240, 380, 520, 680, 850];
    pinFrequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      // Triangle waves have beautiful wooden woodblock-like resonance
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now);
      // Add pitch drift upon hit
      osc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + 0.3 + (idx * 0.05));
      const oscGain = ctx.createGain();
      // Staggered trigger offsets simulating consecutive pin-to-pin clatters
      const delay = idx * 0.04;
      const decay = 0.25 + Math.random() * 0.3;
      oscGain.gain.setValueAtTime(0, now);
      oscGain.gain.setValueAtTime(0.45, now + delay);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + delay + decay);
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + decay + 0.1);
    });
  };
  // Synthesize Success Cheering Fanfare (Dynamic arpeggiated retro chiptune melody)
  const playFanfareSound = () => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const now = ctx.currentTime;
    // C Major Arpeggio celebrating achievements
    const melody = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    
    melody.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      // Beautiful chime-like sine/square wave
      osc.type = idx % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.setValueAtTime(0.25, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.45);
      // Add subtle vibrato
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 8; // 8Hz vibrato
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 5; // Pitch variation depth
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      lfo.start(now + idx * 0.08);
      osc.start(now + idx * 0.08);
      lfo.stop(now + idx * 0.08 + 0.5);
      osc.stop(now + idx * 0.08 + 0.5);
    });
  };
  // Dynamic Sparkles & Splatter Particles Physics Update Loop
  useEffect(() => {
    if (particles.length === 0) return;
    const frame = requestAnimationFrame(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.15, // Smooth gravity drop
            opacity: p.opacity - 0.02,
          }))
          .filter((p) => p.opacity > 0)
      );
    });
    return () => cancelAnimationFrame(frame);
  }, [particles]);
  // Generate Neon Sparks on collision or strike
  const spawnSparkles = (x: number, y: number, color: string, count = 12) => {
    const newSparks: {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  opacity: number;
}[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      newSparks.push({
        id: Math.random() + i,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3, // Initial upward lift
        color,
        size: 4 + Math.random() * 8,
        opacity: 1,
      });
    }
    setParticles((prev) => [...prev, ...newSparks]);
  };
  // Ball Drag Interaction Handlers (Flick Mechanics)
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isRolling) return;
    initAudio();
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX, y: clientY });
  };
  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || isRolling) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    // Calculate displacement delta
    const dx = clientX - dragStart.x;
    const dy = clientY - dragStart.y;
    // Pullback limit bounds to prevent ball flying off container before flick
    const pullX = Math.max(-100, Math.min(100, dx));
    const pullY = Math.max(0, Math.min(120, dy)); // Can only drag backwards
    // Map pull displacements to relative percentage offsets
    const newBallX = 50 + (pullX / 8);
    const newBallY = 88 + (pullY / 8);
    setBallPos({ x: newBallX, y: newBallY });
    // Aim Line Trajectory Points
    // Extrapolate flick path forward onto the pin deck
    const aimPower = Math.sqrt(pullX * pullX + pullY * pullY);
    if (aimPower > 15) {
      // Calculate target aiming projection coordinates on upper lane
      const angle = Math.atan2(-pullY, -pullX);
      const targetLength = Math.max(100, aimPower * 3.5);
      const endX = newBallX + (Math.cos(angle) * (targetLength / 6));
      // Point aiming toward upper deck (y: 20-30%)
      const endY = Math.max(20, newBallY - (Math.sin(-angle) * (targetLength / 5)));
      setAimLine({ x1: newBallX, y1: newBallY, x2: endX, y2: endY });
    } else {
      setAimLine(null);
    }
  };
  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (aimLine) {
      // Calculate throw vectors based on aimLine coordinates
      const dx = aimLine.x2 - aimLine.x1;
      const dy = aimLine.y2 - aimLine.y1;
      const velocityX = dx * 0.12;
      const velocityY = dy * 0.14; // Forward rolling speed
      setAimLine(null);
      executeThrow(velocityX, velocityY);
    } else {
      // Snap ball back to launch pad center
      setBallPos({ x: 50, y: 88 });
    }
  };
  // Automatic Targeted Throw when clicking a pin directly (Accessible assist mode)
  const handlePinClick = (pin: PinData) => {
    if (isRolling) return;
    initAudio();
    // Reset card highlight temporarily to focus on roll animation
    setActivePin(null);
    // Calculate exact target delta from launching pad (50%, 88%)
    // The target pin is at (pin.x, pin.y) in pin deck
    // Pin deck height maps to visual lane vertical region of y: 22% - 38%
    const targetY = 22 + (pin.y * 0.16); // Precise relative Y
    const targetX = 18 + (pin.x * 0.64); // Precise relative X inside lane perspective boundaries
    const dx = targetX - 50;
    const dy = targetY - 88;
    executeThrow(dx * 0.12, dy * 0.12, pin);
  };
  // Launch Ball Animation & Collision Evaluator
  const executeThrow = (vx: number, vy: number, targetPin?: PinData) => {
    setIsRolling(true);
    const duration = 1200; // 1.2 second roll animation
    playRollSound(duration / 1000);
    let startX = ballPos.x;
    let startY = ballPos.y;
    let startTime: number | null = null;
    const animateRoll = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const t = Math.min(progress / duration, 1);
      // 1. Update ball position coordinates
      // Let the ball glide up toward the pins with deceleration or continuous motion
      const currentX = startX + vx * t * 7;
      const currentY = startY + vy * t * 7.5;
      
      // 2. Adjust perspective scaling (ball shrinks to represent distance)
      const scale = 1 - (t * 0.64); // From 1.0 down to ~0.36
      const rotation = t * 1080 * (vx >= 0 ? 1 : -1);
      setBallPos({ x: currentX, y: currentY });
      setBallScale(scale);
      setBallSpin(rotation);
      if (t < 1) {
        requestAnimationFrame(animateRoll);
      } else {
        // Roll animation complete! Trigger Strike Collisions!
        handleImpact(currentX, targetPin);
      }
    };
    requestAnimationFrame(animateRoll);
  };
  // Process Collision Impacts on the Pin Deck
  const handleImpact = (finalBallX: number, targetPin?: PinData) => {
    playStrikeSound();
    let hitPins: PinData[] = [];
    if (targetPin) {
      // Guided Throw Guarantee: If a target pin was selected, hit it
      hitPins.push(targetPin);
      
      // 30% chance to also knock down neighboring pins if hit hard (based on target proximity)
      pins.forEach((p) => {
        if (p.id !== targetPin.id && !knockedPins[p.id]) {
          const dist = Math.sqrt(Math.pow(p.x - targetPin.x, 2) + Math.pow(p.y - targetPin.y, 2));
          if (dist < 28 && Math.random() < 0.65) {
            hitPins.push(p);
          }
        }
      });
    } else {
      // Flick Throw Collision Math:
      // Map ball final horizontal coordinate back into the 0-100 pin deck space
      // Lane center is at x: 50%, boundaries narrow on pin deck to roughly x: 18% - 82%
      const relativeX = ((finalBallX - 18) / 64) * 100;
      // Locate pins within critical collision width of the ball (approx 16% coordinate radius)
      pins.forEach((pin) => {
        if (!knockedPins[pin.id]) {
          const distanceX = Math.abs(pin.x - relativeX);
          if (distanceX < 14) {
            hitPins.push(pin);
          }
        }
      });
      // Chain reaction: If we hit a core central pin, sweep neighboring rows
      if (hitPins.length > 0) {
        pins.forEach((pin) => {
          if (!knockedPins[pin.id] && !hitPins.some((hp) => hp.id === pin.id)) {
            // Check if it is extremely close to any directly hit pin
            const isNear = hitPins.some((hp) => {
              const d = Math.sqrt(Math.pow(pin.x - hp.x, 2) + Math.pow(pin.y - hp.y, 2));
              return d < 22;
            });
            if (isNear && Math.random() < 0.8) {
              hitPins.push(pin);
            }
          }
        });
      }
    }
    // Process all hit pins
    if (hitPins.length > 0) {
      const newKnocked = { ...knockedPins };
      let pointsEarned = 0;
      let lastHitPin: PinData | null = null;
      hitPins.forEach((pin) => {
        if (!newKnocked[pin.id]) {
          newKnocked[pin.id] = true;
          pointsEarned += 100;
          lastHitPin = pin;
          // Spawn gorgeous customized color sparkles at the pin location
          // Translate 0-100 pin coordinates to viewport values
          const visualX = 18 + (pin.x * 0.64);
          const visualY = 22 + (pin.y * 0.16);
          spawnSparkles(visualX, visualY, pin.color, 16);
        }
      });
      setKnockedPins(newKnocked);
      setScore((prev) => prev + pointsEarned);

      if (targetPin) {
        lastHitPin = targetPin;
      }

      // Set newly hit pin as the active details display card
      if (lastHitPin) {
        setActivePin(lastHitPin);
        
        // Auto-scroll on mobile viewports
        if (window.innerWidth < 1024) {
          setTimeout(() => {
            const detailsElement = document.getElementById("pin-details-card");
            if (detailsElement) {
              detailsElement.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }, 100);
        }
      }
      // Re-evaluate discovered unique pins counter
      const newlyDiscovered = Object.keys(newKnocked).length;
      setDiscoveredCount(newlyDiscovered);
      // Check if all 7 pins are cleared
      if (newlyDiscovered === 7) {
        setTimeout(() => {
          setStrikeTriggered(true);
          playFanfareSound();
        }, 600);
      }
    } else {
      // Gutter Ball! Spawn generic gray sparks
      spawnSparkles(finalBallX, 22, "#71717a", 6);
    }
    // Reset ball back to launch pad with smooth fade-in
    setTimeout(() => {
      setBallPos({ x: 50, y: 88 });
      setBallScale(1);
      setBallSpin(0);
      setIsRolling(false);
    }, 400);
  };
  // Reset Skills Arena Game Board
  const handleReset = () => {
    setKnockedPins({});
    setActivePin(null);
    setScore(0);
    setDiscoveredCount(0);
    setStrikeTriggered(false);
    setBallPos({ x: 50, y: 88 });
    setBallScale(1);
    setBallSpin(0);
    setIsRolling(false);
    setParticles([]);
  };
  // Quick Clear Cheat/Helper (For review testing)
  const triggerInstantStrike = () => {
    const allKnocked: { [key: number]: boolean } = {};
    pins.forEach((p) => { allKnocked[p.id] = true; });
    setKnockedPins(allKnocked);
    setScore(700);
    setDiscoveredCount(7);
    setActivePin(pins[6]); // Open achievements
    setStrikeTriggered(true);
    playFanfareSound();
  };
  return (
    <div
      className="min-h-screen relative overflow-hidden select-none bg-[#090514] text-white flex flex-col font-sans"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {/* Cinematic dark glowing mesh background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,#1c0e35_0%,#090514_90%)] pointer-events-none z-0" />
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 0)",
          backgroundSize: "24px 24px"
        }}
      />
      {/* Sparks particles rendering layer */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none z-20 blur-[0.5px]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: p.opacity,
            transform: "translate(-50%, -50%)",
            boxShadow: `0 0 12px ${p.color}, 0 0 4px #fff`,
          }}
        />
      ))}
      {/* Reusable Navbar */}
      <Navbar theme="dark" />

      {/* Game controls header */}
      <div className="relative z-30 flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-4 max-w-7xl mx-auto w-full gap-4 select-none">
        <div className="flex gap-4">
          <button
            onClick={handleReset}
            className="group relative bg-[#0e071e]/75 border border-purple-500/30 hover:border-[#ff007f] px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_4px_12px_rgba(168,85,247,0.15)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            🔄 Reset Pins
          </button>
          <div 
            onClick={triggerInstantStrike}
            className="flex bg-[#ff007f]/10 border border-[#ff007f]/30 hover:border-[#ff007f]/80 text-[#ff007f] px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-wider cursor-pointer transition-all active:scale-95 items-center justify-center"
            title="Knock all pins instantly for testing"
          >
            ⚡ Test Strike
          </div>
        </div>

        {/* Discovered Counter and Score */}
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2 bg-[#0e071e]/80 border border-purple-500/40 px-5 py-2.5 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
            <span className="text-stone-400 font-bold text-xs uppercase tracking-wider">Discovered:</span>
            <span className="font-extrabold text-cyan-400 text-lg tracking-tight">{discoveredCount}/7</span>
          </div>
          <div className="bg-[#0e071e]/80 border border-purple-500/40 px-5 py-2.5 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.5)] flex items-center gap-2">
            <span className="text-stone-400 font-bold text-xs uppercase tracking-wider">🏆 Score:</span>
            <span className="font-black text-pink-500 text-lg tracking-tight">{score}</span>
          </div>
        </div>
      </div>
      {/* Title & Subtitle Banner */}
      <section className="relative z-10 text-center pt-2 select-none">
        <h1 
          className="text-4xl md:text-5xl font-black tracking-tight leading-none bg-gradient-to-r from-[#00f2fe] via-purple-400 to-[#ff007f] bg-clip-text text-transparent flex items-center justify-center gap-3 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          🎳 Skill Strike Arena
        </h1>
        <p className="text-stone-400 text-sm md:text-base font-semibold mt-2.5 max-w-xl mx-auto px-4">
          Knock down a pin using <span className="text-cyan-400 font-black">flick gestures (drag & release ball)</span> or click on any pin to discover my core technical skills and achievements.
        </p>
      </section>
      {/* 2. MAIN SKILLS BOARD / ARENA LAYOUT */}
      <main className="relative flex-1 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-center px-4 md:px-12 py-4 z-10 select-none overflow-hidden min-h-[620px]">
        
        {/* LEFT COMPONENT: 3D perspective bowling lane */}
        <div 
          ref={laneRef}
          className="relative w-full lg:w-[60%] h-[580px] perspective-lane flex flex-col justify-end items-center select-none"
          onMouseMove={handleDragMove}
          onTouchMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onTouchEnd={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          {/* Neon Top arch lights */}
          <div className="absolute top-[8%] left-[18%] right-[18%] h-[2.5px] bg-[#00f2fe] blur-[1px] shadow-[0_0_12px_#00f2fe] rounded-full z-0 opacity-80" />
          <div className="absolute top-[8.5%] left-[20%] right-[20%] h-[1.5px] bg-[#ff007f] blur-[1.5px] shadow-[0_0_10px_#ff007f] rounded-full z-0 opacity-60" />
          {/* Perspective Polished Wood Bowling Lane */}
          <div 
            className="absolute top-[10%] bottom-0 left-[18%] right-[18%] wood-plank shadow-[0_-15px_30px_rgba(255,255,255,0.03)] border-t border-purple-500/10 rounded-t-[10px] overflow-hidden z-0 flex flex-col justify-between"
            style={{
              clipPath: "polygon(22% 0%, 78% 0%, 100% 100%, 0% 100%)",
              boxShadow: "inset 0 100px 100px rgba(0,0,0,0.85), inset 0 -20px 40px rgba(0,0,0,0.6)",
            }}
          >
            {/* Glossy reflection shimmer */}
            <div className="w-full h-[35%] bg-gradient-to-b from-black/80 via-black/45 to-transparent pointer-events-none" />
            <div className="w-full h-[65%] bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>
          {/* Glowing Neon Gutter Rails */}
          {/* Left Gutter */}
          <div 
            className="absolute top-[10%] bottom-0 left-[12%] w-[7%] z-10 origin-bottom-right"
            style={{
              clipPath: "polygon(95% 0%, 100% 0%, 55% 100%, 0% 100%)",
              background: "linear-gradient(to right, #090514, #120925)",
              borderRight: "2px solid #00f2fe",
              animation: "laneGutterCyan 3.5s ease-in-out infinite",
            }}
          />
          {/* Right Gutter */}
          <div 
            className="absolute top-[10%] bottom-0 right-[12%] w-[7%] z-10 origin-bottom-left"
            style={{
              clipPath: "polygon(0% 0%, 5% 0%, 100% 100%, 45% 100%)",
              background: "linear-gradient(to left, #090514, #120925)",
              borderLeft: "2px solid #ff007f",
              animation: "laneGutterPink 3.5s ease-in-out infinite alternate",
            }}
          />
          {/* Lane Board Arrows (Traditional bowling targets) */}
          <div className="absolute bottom-[28%] left-1/2 -translate-x-1/2 flex gap-8 z-10 opacity-30 select-none pointer-events-none">
            {[-3, -1.5, 0, 1.5, 3].map((off, idx) => (
              <svg 
                key={idx}
                viewBox="0 0 100 100" 
                className="w-3.5 h-3.5 fill-cyan-400 rotate-180 transform scale-75"
                style={{
                  transform: `translateX(${off * 15}px) scale(0.6)`
                }}
              >
                <polygon points="50,10 90,90 50,70 10,90" />
              </svg>
            ))}
          </div>
          {/* PIN DECK LAYOUT AREA (y: 22% to 38%) */}
          <div className="absolute top-[22%] left-[24%] right-[24%] h-[16%] z-10 select-none">
            {pins.map((pin) => {
              const isKnocked = knockedPins[pin.id];
              // Determine tilt physics class based on ID
              let tiltClass = "";
              if (isKnocked) {
                const tilts = ["pin-tilt-1", "pin-tilt-2", "pin-tilt-3", "pin-tilt-4"];
                tiltClass = tilts[(pin.id - 1) % tilts.length];
              }
              // Check if currently active/hovered
              const isActive = activePin?.id === pin.id;
              return (
                <div
                  key={pin.id}
                  onClick={() => handlePinClick(pin)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500 z-10 group`}
                  style={{
                    left: `${pin.x}%`,
                    top: `${pin.y}%`,
                    // Reduce scaling of rear pins to exaggerate 3D depth perception
                    transform: `translate(-50%, -50%) scale(${0.72 + pin.y * 0.002})`,
                  }}
                >
                  {/* Glowing neon halo behind active pins */}
                  <div
                    className={`absolute inset-[-14px] rounded-full filter blur-xl transition-all duration-500 -z-10 ${
                      isActive ? "opacity-100 scale-125" : isKnocked ? "opacity-0" : "opacity-40 group-hover:opacity-90"
                    }`}
                    style={{
                      backgroundColor: pin.color,
                      boxShadow: `0 0 35px ${pin.color}, 0 0 15px ${pin.color}`,
                      "--glow": pin.glowColor,
                      animation: isKnocked ? "none" : "neonPulse 2s ease-in-out infinite",
                    } as React.CSSProperties}
                  />
                  {/* Core Bowling Pin Graphic structure */}
                  <div 
                    className={`relative w-12 h-20 transition-all duration-700 flex flex-col items-center ${tiltClass}`}
                  >
                    {/* SVG Bowling Pin */}
                    <svg
                      viewBox="0 0 100 200"
                      className="w-full h-full drop-shadow-[0_6px_10px_rgba(0,0,0,0.65)]"
                    >
                      <defs>
                        {/* Shading/Depth gradients */}
                        <linearGradient id={`grad-${pin.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#ffffff" />
                          <stop offset="25%" stopColor="#f3f4f6" />
                          <stop offset="70%" stopColor="#d1d5db" />
                          <stop offset="100%" stopColor="#9ca3af" />
                        </linearGradient>
                      </defs>
                      {/* White bowling pin body */}
                      <path
                        d="M 50,15 
                           C 62,15 68,22 68,32 
                           C 68,45 56,58 56,70 
                           C 56,76 60,82 65,88 
                           C 76,102 82,120 82,145 
                           C 82,175 68,185 50,185 
                           C 32,185 18,175 18,145 
                           C 18,120 24,102 35,88 
                           C 40,82 44,76 44,70 
                           C 44,58 32,45 32,32 
                           C 32,22 38,15 50,15 Z"
                        fill={isKnocked ? "#6b7280" : `url(#grad-${pin.id})`}
                        stroke={isKnocked ? "#4b5563" : pin.color}
                        strokeWidth="5"
                      />
                      {/* Iconic Red/Colored Double Neck Stripes */}
                      {!isKnocked && (
                        <>
                          <path
                            d="M 43.5,45 Q 50,49 56.5,45"
                            stroke={pin.color}
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                          />
                          <path
                            d="M 43,55 Q 50,59 57,55"
                            stroke={pin.color}
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                          />
                        </>
                      )}
                      {/* Glowing category star on center base */}
                      {!isKnocked && (
                        <circle cx="50" cy="140" r="11" fill={pin.color} opacity="0.85" />
                      )}
                    </svg>
                    {/* Miniature Index Tag label floating above pin */}
                    {!isKnocked && (
                      <div 
                        className="absolute -top-6 bg-black/85 border px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest pointer-events-none whitespace-nowrap shadow-md group-hover:scale-105 transition-transform"
                        style={{ borderColor: pin.color, color: pin.color }}
                      >
                        {pin.title.split(" ")[0]}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Dotted Aiming Trajectory Line */}
          {aimLine && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
              <line
                x1={`${aimLine.x1}%`}
                y1={`${aimLine.y1}%`}
                x2={`${aimLine.x2}%`}
                y2={`${aimLine.y2}%`}
                stroke="#00f2fe"
                strokeWidth="4"
                strokeDasharray="8,8"
                className="opacity-75 blur-[0.5px]"
              />
              <circle
                cx={`${aimLine.x2}%`}
                cy={`${aimLine.y2}%`}
                r="7"
                fill="#00f2fe"
                className="animate-ping opacity-75"
              />
            </svg>
          )}
          {/* Draggable/Rolling Bowling Ball */}
          <div
            ref={ballRef}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            className={`absolute z-30 transition-all select-none cursor-grab active:cursor-grabbing rounded-full ${
              isDragging ? "scale-105 shadow-[0_0_30px_#ff5e62]" : ""
            }`}
            style={{
              left: `${ballPos.x}%`,
              top: `${ballPos.y}%`,
              width: `${75 * ballScale}px`,
              height: `${75 * ballScale}px`,
              transform: `translate(-50%, -50%) rotate(${ballSpin}deg)`,
              // Transition handles snapping back. Rolling is manually frame-animated
              transition: isRolling ? "none" : "left 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), top 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
          >
            {/* Bowling ball visual style */}
            <div 
              className="w-full h-full rounded-full relative flex items-center justify-center overflow-hidden border-[2.5px] border-[#ff7b80]/30 shadow-[0_12px_24px_rgba(0,0,0,0.8),inset_-10px_-10px_25px_rgba(0,0,0,0.9),inset_6px_6px_15px_rgba(255,255,255,0.45)]"
              style={{
                background: "radial-gradient(circle at 35% 35%, #ff7b80 0%, #ff4b50 35%, #9f1239 90%)",
              }}
            >
              {/* Retro glossy lens reflection */}
              <div className="absolute top-[8%] left-[20%] w-[35%] h-[20%] bg-white/35 rounded-full rotate-[-30deg] blur-[1px]" />
              
              {/* Three finger holes (Bowling grip) */}
              <div className="absolute top-[32%] left-[42%] w-[12%] h-[12%] bg-black/95 rounded-full border border-stone-800/40 shadow-inner" />
              <div className="absolute top-[48%] left-[34%] w-[12%] h-[12%] bg-black/95 rounded-full border border-stone-800/40 shadow-inner" />
              <div className="absolute top-[48%] left-[54%] w-[12%] h-[12%] bg-black/95 rounded-full border border-stone-800/40 shadow-inner" />
            </div>
          </div>
          {/* Interactive Bouncing Arrow pointing to ball when idle */}
          {!isRolling && !isDragging && score === 0 && (
            <div 
              className="absolute bottom-[20%] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center select-none pointer-events-none"
              style={{ animation: "arrowFloat 2.2s ease-in-out infinite" }}
            >
              <span className="text-[36px] filter drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]">👆</span>
              <span className="bg-black/90 border border-cyan-500/40 text-cyan-400 font-extrabold text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                Flick Me Forward!
              </span>
            </div>
          )}
        </div>
        {/* RIGHT COMPONENT: Info Slides & Glassmorphism Detail Card */}
        <div className="relative w-full lg:w-[40%] flex items-center justify-center p-2 min-h-[300px] select-text z-20">
          {activePin ? (
            <div 
              id="pin-details-card"
              className="w-full max-w-[450px] glassmorphism-card rounded-[32px] p-8 border border-white/10 text-left relative z-20 shadow-[0_20px_50px_rgba(0,0,0,0.55)] transition-all duration-500 hover:border-white/20 select-text overflow-hidden scroll-mt-6"
              style={{
                borderRadius: "24px 36px 20px 32px / 28px 20px 30px 24px" // Slick custom profile cut
              }}
            >
              {/* Glowing internal backing lights */}
              <div 
                className="absolute top-[-30px] right-[-30px] w-48 h-48 rounded-full filter blur-[60px] opacity-25 -z-10 transition-colors"
                style={{ backgroundColor: activePin.color }}
              />
              {/* Pin Header */}
              <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-4">
                <div>
                  <div 
                    className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-2 shadow-inner border border-white/5"
                    style={{ backgroundColor: `${activePin.color}25`, color: activePin.color, borderColor: `${activePin.color}45` }}
                  >
                    🎳 Pin Hit Discovered
                  </div>
                  <h2 
                    className="text-2xl md:text-3xl font-black leading-tight tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
                  >
                    {activePin.title}
                  </h2>
                </div>
                
                {/* Close Button */}
                <button
                  onClick={() => setActivePin(null)}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white font-extrabold w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow"
                >
                  ✕
                </button>
              </div>
              {/* Description */}
              <p className="text-stone-300 text-sm font-semibold leading-relaxed mb-6">
                {activePin.description}
              </p>
              {/* Skill Tech Badges */}
              <div className="mb-6">
                <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">🛠️ Skill Badges ({activePin.skills.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {activePin.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-white/5 hover:bg-white/10 text-stone-200 border border-white/10 hover:border-cyan-500/40 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 shadow-sm cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              {/* Links Sector (Exclusive to Pin 6 Certifications) */}
              {activePin.links && (
                <div className="border-t border-white/10 pt-4">
                  <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">🔗 Experience Links</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(activePin.links).map(([name, url]) => (
                      <a
                        key={name}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/50 px-4 py-2.5 rounded-xl text-xs font-black text-[#f97316] hover:text-white transition-all duration-300 shadow"
                      >
                        <span>{name}</span>
                        <span>↗</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {/* Subtle Quote Footing */}
              <div className="border-t border-white/10 mt-6 pt-3 text-center opacity-65">
                <span className="text-[10px] font-semibold text-stone-400 italic">🎳 Strike down remaining pins for total clearing!</span>
              </div>
            </div>
          ) : (
            // Idle Pitch Showcase Placeholder
            <div className="text-center max-w-[360px] flex flex-col items-center bg-[#0e071e]/45 border border-purple-500/10 p-8 rounded-[28px] backdrop-blur-sm">
              <span className="text-6xl mb-4 transform hover:rotate-12 transition-transform">🎳</span>
              <h3 className="text-xl font-bold text-white mb-2">Pin Deck Terminal</h3>
              <p className="text-stone-400 text-xs font-semibold leading-relaxed mb-5">
                Each bowling pin represents a structured discipline of my engineering experience. Strike down all seven pins to achieve a <span className="text-pink-500 font-extrabold">Strike Celebration</span>!
              </p>
              <div className="flex gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff007f] animate-ping" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#00f2fe] animate-pulse" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#00f2ad] animate-ping" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#a855f7] animate-pulse" />
              </div>
            </div>
          )}
        </div>
      </main>
      {/* 3. FINAL STRIKE CELEBRATION OVERLAY */}
      {strikeTriggered && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-6 backdrop-blur-md text-center select-text overflow-y-auto"
          style={{ animation: "strikeFlash 0.5s ease" }}
        >
          {/* Confetti falling animations */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 45 }).map((_, idx) => {
              const left = Math.random() * 100;
              const delay = Math.random() * 5;
              const size = 6 + Math.random() * 12;
              const color = ["#ff007f", "#00f2fe", "#00f2ad", "#a855f7", "#fbbf24"][idx % 5];
              return (
                <div
                  key={idx}
                  className="absolute rounded-sm pointer-events-none opacity-80"
                  style={{
                    left: `${left}%`,
                    top: `-20px`,
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: color,
                    animation: `confettiFloat 4.5s linear infinite`,
                    animationDelay: `${delay}s`,
                  }}
                />
              );
            })}
          </div>
          <div className="relative max-w-lg w-full bg-[#0e071e]/85 border-2 border-purple-500/30 p-8 md:p-10 rounded-[36px] shadow-[0_0_80px_rgba(168,85,247,0.35)] select-text glassmorphism-card z-20">
            {/* Strike Trophy Icon */}
            <span className="text-7xl md:text-8xl drop-shadow-[0_0_20px_#fbbf24] animate-bounce inline-block mb-4 select-none">🏆</span>
            
            {/* Neon Strike Title */}
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white neon-text-cyan animate-pulse select-none" style={{ fontFamily: "'Bungee Shade', cursive" }}>
              STRIKE!
            </h1>
            <h2 className="text-xl md:text-2xl font-black mt-4 text-[#fbbf24] tracking-tight">
              All Skills Discovered • Perfect Score 700
            </h2>
            {/* Developer Titles */}
            <div className="my-6 space-y-1 select-text border-t border-b border-white/10 py-4 max-w-sm mx-auto">
              <p className="text-stone-300 font-extrabold text-sm uppercase tracking-widest">Full Stack Developer</p>
              <p className="text-cyan-400 font-black text-sm uppercase tracking-widest">Computer Science Engineer</p>
              <p className="text-[#ff007f] font-bold text-xs uppercase tracking-widest">Builder of Interactive Digital Experiences</p>
            </div>
            {/* Social Icons with custom SVG links */}
            <div className="flex justify-center gap-6 mb-8 select-none">
              {/* GitHub */}
              <a
                href="https://github.com/ananyakumari1293"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border border-white/20 hover:border-cyan-400 bg-white/5 hover:bg-cyan-500/10 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow"
                title="GitHub Portfolio"
              >
                <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                  <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/ananya-kumari-362906373/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border border-white/20 hover:border-cyan-400 bg-white/5 hover:bg-cyan-500/10 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow"
                title="LinkedIn Profile"
              >
                <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="https://www.instagram.com/_ananyaaaa__.__?igsh=M2FkNTB6cGhidmp5"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border border-white/20 hover:border-cyan-400 bg-white/5 hover:bg-cyan-500/10 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow"
                title="Instagram Profile"
              >
                <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </a>
            </div>
            {/* Restart Play Button */}
            <button
              onClick={handleReset}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold px-8 py-4 rounded-full shadow-[0_6px_0_#9f1239,0_10px_20px_rgba(0,0,0,0.4)] transition-all transform hover:-translate-y-1 active:translate-y-0.5"
            >
              🎳 Roll Again
            </button>
          </div>
        </div>
      )}
      {/* 4. FOOTER */}
      <footer className="relative z-10 w-full text-center py-6 text-stone-500 font-extrabold text-[10px] uppercase tracking-widest select-none border-t border-purple-500/5 mt-auto">
        Skill Strike Arena © 2026 • Design by Ananya Kumari
      </footer>
    </div>
  );
}
