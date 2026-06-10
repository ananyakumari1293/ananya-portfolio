import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ theme = "light" }: { theme?: "light" | "dark" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isDark = theme === "dark";

  const navLinks = [
    { name: "Home", path: "/", hash: "", matchPaths: ["/"] },
    { name: "About", path: "/", hash: "#card-flower-garden", matchPaths: ["/flower-garden"] },
    { name: "Projects", path: "/", hash: "#card-fruit-ninja", matchPaths: ["/fruit-ninja"] },
    { name: "Skills", path: "/", hash: "#card-skill-strike", matchPaths: ["/bowling-zone"] },
    { name: "Contact", path: "/", hash: "#card-cooking-mama", matchPaths: ["/cooking-mama"] },
  ];

  const resumeLink = "https://drive.google.com/file/d/1QPyVm3m-ZRkm8avgD2d_dS-ehfB_3xMQ/view?usp=drivesdk";

  return (
    <nav
      className={`
        mx-6 mt-5 rounded-[40px] px-8 py-4 flex items-center justify-between border z-40 relative select-none transition-all duration-300
        ${
          isDark
            ? "bg-black/40 backdrop-blur-md border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
            : "bg-white/80 backdrop-blur-md border-pink-100 shadow-[0_4px_24px_rgba(255,130,180,0.15)] hover:shadow-[0_4px_32px_rgba(255,130,180,0.25)]"
        }
      `}
    >
      <h1
        onClick={() => navigate("/")}
        className={`text-4xl font-black tracking-tight cursor-pointer ${
          isDark ? "text-white" : "text-slate-900"
        }`}
      >
        AK<span className="text-pink-500">.</span>
      </h1>
      
      <div className="hidden md:flex gap-8 font-extrabold text-[15px]">
        {navLinks.map((link) => {
          const isActive = link.matchPaths.includes(location.pathname) && (link.name !== "Home" || !location.hash);
          return (
            <a
              key={link.name}
              href={link.hash ? `/${link.hash}` : "/"}
              onClick={(e) => {
                e.preventDefault();
                if (location.pathname === "/") {
                  if (link.hash) {
                    const element = document.getElementById(link.hash.substring(1));
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                  } else {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                } else {
                  navigate(link.hash ? `/${link.hash}` : "/");
                }
              }}
              className={`
                relative transition-all duration-300 hover:text-pink-500
                ${isActive ? "text-pink-500 font-black" : isDark ? "text-stone-300" : "text-slate-700"}
                after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:bg-gradient-to-r after:from-pink-500 after:to-purple-500 after:rounded-full after:transition-all after:duration-300
                ${isActive ? "after:w-full after:height-[2.5px]" : "after:w-0 after:height-[2px] hover:after:w-full"}
              `}
            >
              {link.name}
            </a>
          );
        })}
      </div>

      <a
        href={resumeLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`
          hidden md:inline-flex px-7 py-3 rounded-full font-extrabold border shadow-md hover:scale-105 transition-all duration-300 items-center gap-2
          ${
            isDark
              ? "bg-gradient-to-r from-purple-900/40 to-pink-900/40 text-pink-300 border-pink-500/30 hover:from-purple-800/50 hover:to-pink-800/50"
              : "bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 border-pink-200 hover:from-pink-200 hover:to-purple-200"
          }
        `}
      >
        📄 Resume
      </a>

      {/* Mobile Menu Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`md:hidden p-2 rounded-full transition-colors ${
          isDark ? "text-white hover:bg-white/10" : "text-slate-700 hover:bg-slate-100"
        }`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Drawer Dropdown */}
      {isOpen && (
        <div
          className={`
            absolute top-[75px] left-0 right-0 mx-6 rounded-[28px] border p-6 flex flex-col gap-4 z-50 md:hidden shadow-xl
            ${
              isDark
                ? "bg-[#090514]/95 border-white/10 text-white"
                : "bg-white/95 border-pink-100 text-slate-800"
            }
          `}
        >
          {navLinks.map((link) => {
            const isActive = link.matchPaths.includes(location.pathname) && (link.name !== "Home" || !location.hash);
            return (
              <a
                key={link.name}
                href={link.hash ? `/${link.hash}` : "/"}
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen(false);
                  if (location.pathname === "/") {
                    if (link.hash) {
                      const element = document.getElementById(link.hash.substring(1));
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "center" });
                      }
                    } else {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  } else {
                    navigate(link.hash ? `/${link.hash}` : "/");
                  }
                }}
                className={`
                  text-lg font-extrabold py-2 border-b border-dashed transition-colors
                  ${isDark ? "border-white/5" : "border-pink-50"}
                  ${isActive ? "text-pink-500" : isDark ? "text-stone-300 hover:text-white" : "text-slate-700 hover:text-pink-500"}
                `}
              >
                {link.name}
              </a>
            );
          })}
          
          <a
            href={resumeLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className={`
              mt-2 w-full text-center py-3.5 rounded-full font-extrabold border shadow-md inline-flex items-center justify-center gap-2
              ${
                isDark
                  ? "bg-gradient-to-r from-purple-900/40 to-pink-900/40 text-pink-300 border-pink-500/30"
                  : "bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 border-pink-200"
              }
            `}
          >
            📄 Resume
          </a>
        </div>
      )}
    </nav>
  );
}
