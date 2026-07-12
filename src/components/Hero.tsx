import { motion } from "motion/react";
import { ChevronDown, Trophy, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Image } from "./Image";
import rpuImage from "../image/foto_rpu.png";
import recuerdo1 from "../image/recuerdos/1.jpeg";
import recuerdo2 from "../image/recuerdos/2.jpeg";
import recuerdo3 from "../image/recuerdos/xd.jpeg";
import recuerdo4 from "../image/recuerdos/4.jpg";

export function Hero() {
  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth"
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-6 bg-[var(--color-primary)]">
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Organic wave pattern - Animated */}
        <motion.div
          className="absolute inset-0 opacity-5"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="waves" width="200" height="200" patternUnits="userSpaceOnUse">
                <motion.path
                  d="M0 100 Q 50 80, 100 100 T 200 100"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="1.5"
                  animate={{
                    d: [
                      "M0 100 Q 50 80, 100 100 T 200 100",
                      "M0 100 Q 50 120, 100 100 T 200 100",
                      "M0 100 Q 50 80, 100 100 T 200 100"
                    ]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.path
                  d="M0 120 Q 50 100, 100 120 T 200 120"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="1"
                  animate={{
                    d: [
                      "M0 120 Q 50 100, 100 120 T 200 120",
                      "M0 120 Q 50 140, 100 120 T 200 120",
                      "M0 120 Q 50 100, 100 120 T 200 120"
                    ]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
                <circle cx="50" cy="50" r="3" fill="var(--color-accent)" opacity="0.3"/>
                <circle cx="150" cy="150" r="2" fill="var(--color-accent)" opacity="0.2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#waves)" />
          </svg>
        </motion.div>

        {/* Circular ripple effects */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`ripple-${i}`}
            className="absolute rounded-full border border-[var(--color-accent)]/10"
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 18}%`,
              width: `${150 + i * 50}px`,
              height: `${150 + i * 50}px`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Blob/Organic shapes */}
        <motion.div
          className="absolute top-20 left-10 w-40 h-40"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.15, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path
              d="M 100,20 Q 140,40 160,80 T 180,140 Q 160,180 100,180 T 20,140 Q 20,80 60,40 T 100,20 Z"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2"
              opacity="0.15"
            />
          </svg>
        </motion.div>

        {/* Flowing curves */}
        <motion.div
          className="absolute top-1/4 right-16 w-48 h-48"
          animate={{
            rotate: [0, -360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path
              d="M 50,100 Q 75,50 100,75 T 150,100 Q 125,150 100,125 T 50,100 Z"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="1.5"
              opacity="0.2"
            />
          </svg>
        </motion.div>

        {/* Spiral shape */}
        <motion.div
          className="absolute bottom-24 left-1/4 w-32 h-32"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M 50,50 Q 70,30 80,50 Q 70,70 50,70 Q 30,70 30,50 Q 30,30 50,30"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="1"
              opacity="0.2"
            />
          </svg>
        </motion.div>

        {/* Crescent moon shape */}
        <motion.div
          className="absolute top-1/2 right-1/3 w-24 h-24"
          animate={{
            rotate: [0, -360],
            y: [0, -20, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M 30,50 Q 30,20 50,20 Q 60,20 65,30 Q 50,40 50,50 Q 50,60 65,70 Q 60,80 50,80 Q 30,80 30,50 Z"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="1.5"
              opacity="0.2"
            />
          </svg>
        </motion.div>

        {/* Abstract curved lines */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`curve-${i}`}
            className="absolute"
            style={{
              top: `${30 + i * 20}%`,
              left: `${40 + i * 10}%`,
              width: '120px',
              height: '80px'
            }}
            animate={{
              x: [0, 30, 0],
              opacity: [0.1, 0.25, 0.1]
            }}
            transition={{
              duration: 10 + i * 3,
              repeat: Infinity,
              delay: i * 2,
              ease: "easeInOut"
            }}
          >
            <svg viewBox="0 0 120 80" className="w-full h-full">
              <path
                d={`M 10,40 Q 40,${20 + i * 10} 70,40 T 110,40`}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="1"
                opacity="0.15"
              />
            </svg>
          </motion.div>
        ))}

        {/* Hexagons pattern (iglú style) */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: `${10 + (i % 3) * 30}%`,
              left: `${5 + (i % 4) * 25}%`,
              width: '60px',
              height: '60px'
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon
                points="50,5 90,25 90,75 50,95 10,75 10,25"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="1"
                opacity="0.2"
              />
            </svg>
          </motion.div>
        ))}

        {/* Dots pattern */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`dot-${i}`}
            className="absolute w-1 h-1 rounded-full bg-[var(--color-accent)]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] via-transparent to-[var(--color-primary)]/80" />
      </div>

      {/* Grid Container - 5 divisions */}
      <div
        className="max-w-7xl mx-auto w-full relative z-10 px-4 hero-grid-container"
        style={{
          minHeight: '90vh'
        }}
      >
        <style>{`
          @media (min-width: 768px) {
            .hero-grid-container {
              display: grid;
              grid-template-columns: repeat(5, 1fr);
              grid-template-rows: repeat(5, 1fr);
              gap: 32px;
            }
          }
        `}</style>
        {/* div1 - Central: Título + Imagen + Descripción */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex flex-col items-center justify-center text-center gap-4 md:gap-8 hero-central-content"
        >
          <style>{`
            @media (min-width: 768px) {
              .hero-central-content {
                grid-column: span 3 / span 3;
                grid-row: span 5 / span 5;
                grid-column-start: 2;
                grid-row-start: 1;
                margin: 0 60px;
              }
            }
          `}</style>
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center gap-4"
            >
              <div className="w-20 h-1 bg-[var(--color-accent)]"></div>
              <div className="w-3 h-3 rounded-full bg-[var(--color-accent)]"></div>
              <div className="w-20 h-1 bg-[var(--color-accent)]"></div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-white mb-2 text-3xl md:text-5xl lg:text-6xl font-bold"
            >
              Intercambio Nacional
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-white text-lg md:text-xl lg:text-2xl font-semibold"
            >
              Una Experiencia que Nos Unió
            </motion.p>
          </motion.div>

          {/* Central Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="relative w-full max-w-4xl"
          >

            {/* SVG Decorative Frame - Adjusted to image size */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Corner decorations */}
              <motion.path
                d="M2 2 L15 2 L15 3 L3 3 L3 15 L2 15 Z"
                stroke="var(--color-accent)"
                strokeWidth="0.5"
                fill="var(--color-accent)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.8 }}
              />
              <motion.path
                d="M98 2 L85 2 L85 3 L97 3 L97 15 L98 15 Z"
                stroke="var(--color-accent)"
                strokeWidth="0.5"
                fill="var(--color-accent)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 1 }}
              />
              <motion.path
                d="M2 98 L15 98 L15 97 L3 97 L3 85 L2 85 Z"
                stroke="var(--color-accent)"
                strokeWidth="0.5"
                fill="var(--color-accent)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 1.2 }}
              />
              <motion.path
                d="M98 98 L85 98 L85 97 L97 97 L97 85 L98 85 Z"
                stroke="var(--color-accent)"
                strokeWidth="0.5"
                fill="var(--color-accent)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 1.4 }}
              />

              {/* Decorative lines */}
              <motion.line
                x1="20" y1="2" x2="80" y2="2"
                stroke="var(--color-accent)"
                strokeWidth="0.3"
                strokeDasharray="2,2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 1.6 }}
              />
              <motion.line
                x1="20" y1="98" x2="80" y2="98"
                stroke="var(--color-accent)"
                strokeWidth="0.3"
                strokeDasharray="2,2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 1.6 }}
              />
              <motion.line
                x1="2" y1="20" x2="2" y2="80"
                stroke="var(--color-accent)"
                strokeWidth="0.3"
                strokeDasharray="2,2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 1.8 }}
              />
              <motion.line
                x1="98" y1="20" x2="98" y2="80"
                stroke="var(--color-accent)"
                strokeWidth="0.3"
                strokeDasharray="2,2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 1.8 }}
              />
            </svg>

            {/* Image with transparent background */}
            <motion.div
              className="relative z-10"
              whileHover={{
                scale: 1.05
              }}
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 0.3 }
              }}
            >
              <motion.div
                className="relative"
                whileHover={{
                  filter: "drop-shadow(0 0 50px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 80px rgba(255, 255, 255, 0.6)) drop-shadow(0 20px 60px rgba(0, 0, 0, 0.4))"
                }}
                transition={{ duration: 0.3 }}
                style={{
                  filter: "drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3))",
                  transform: "rotate(0deg)"
                }}
              >
                <Image
                  src={rpuImage}
                  alt="Intercambio Nacional"
                  className="w-full h-auto object-contain relative z-10"
                  style={{ transform: "rotate(0deg)" }}
                />

                {/* White glow effect on hover */}
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: "radial-gradient(circle at center, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 40%, transparent 70%)",
                    filter: "blur(30px)",
                    zIndex: -1
                  }}
                />

                {/* Circular shadow below image */}
                <motion.div
                  className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
                  style={{
                    width: '80%',
                    height: '40px',
                    background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 40%, transparent 70%)',
                    filter: 'blur(15px)',
                    borderRadius: '50%',
                    zIndex: -2
                  }}
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.6, 0.8, 0.6]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </motion.div>

          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="space-y-4"
          >
            <motion.p
              className="text-white/90 text-lg md:text-xl leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.1 }}
            >
              Donde la <span className="text-[var(--color-accent)] font-semibold">felicidad se compartió</span>,
              las <span className="text-[var(--color-accent)] font-semibold">risas resonaron</span> y
              los <span className="text-[var(--color-accent)] font-semibold">lazos se fortalecieron</span>
            </motion.p>

            <motion.p
              className="text-white/80 text-base md:text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.3 }}
            >
              Un momento que nos unió como comunidad y nos llenó de recuerdos que llevaremos por siempre
            </motion.p>

            {/* RPU Awards Button */}
            <Link to="/awards">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.5 }}
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 0 40px rgba(247, 197, 72, 1), 0 0 80px rgba(247, 197, 72, 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 bg-gradient-to-r from-[var(--color-accent)] via-yellow-500 to-[var(--color-accent)] text-[var(--color-primary)] px-8 py-4 rounded-full font-bold text-lg md:text-xl flex items-center gap-3 shadow-2xl border-4 border-white/30 hover:border-white/60 transition-all duration-300 mx-auto"
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                >
                  <Trophy className="w-7 h-7" />
                </motion.div>
                <span>RPU AWARDS</span>
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                >
                  <Sparkles className="w-6 h-6" />
                </motion.div>
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* div2 - Top Left Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -20 }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: -8,
            y: [0, -8, 0]
          }}
          transition={{
            duration: 0.8,
            delay: 2,
            y: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          whileHover={{
            scale: 1.3,
            rotate: 0,
            zIndex: 50,
            transition: { duration: 0.3 }
          }}
          whileTap={{ scale: 0.9 }}
          className="hidden md:flex items-center justify-center cursor-pointer hero-photo-div2"
        >
          <style>{`
            .hero-photo-div2 {
              display: none !important;
            }
            @media (min-width: 768px) {
              .hero-photo-div2 {
                display: flex !important;
                grid-column: span 1 / span 1;
                grid-row: span 3 / span 3;
                grid-column-start: 1;
                grid-row-start: 1;
              }
            }
          `}</style>
          <motion.div
            className="relative rounded-lg border-8 border-white shadow-2xl bg-white p-3"
            style={{ width: 'fit-content', height: 'fit-content', maxWidth: '100%', maxHeight: '100%' }}
            whileHover={{
              boxShadow: "0 0 40px rgba(247, 197, 72, 1), 0 0 80px rgba(247, 197, 72, 0.5)",
              borderColor: "rgb(247, 197, 72)"
            }}
          >
            <img
              src={recuerdo1}
              alt="Recuerdo 1"
              className="rounded-sm"
              style={{
                maxWidth: '220px',
                maxHeight: '220px',
                width: 'auto',
                height: 'auto',
                display: 'block'
              }}
            />
          </motion.div>
        </motion.div>

        {/* div3 - Bottom Left Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: 20 }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: 6,
            y: [0, -10, 0]
          }}
          transition={{
            duration: 0.8,
            delay: 2.4,
            y: {
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          whileHover={{
            scale: 1.3,
            rotate: 0,
            zIndex: 50,
            transition: { duration: 0.3 }
          }}
          whileTap={{ scale: 0.9 }}
          className="hidden md:flex items-center justify-center cursor-pointer hero-photo-div3"
        >
          <style>{`
            .hero-photo-div3 {
              display: none !important;
            }
            @media (min-width: 768px) {
              .hero-photo-div3 {
                display: flex !important;
                grid-column: span 1 / span 1;
                grid-row: span 2 / span 2;
                grid-column-start: 1;
                grid-row-start: 4;
              }
            }
          `}</style>
          <motion.div
            className="relative rounded-lg border-8 border-white shadow-2xl bg-white p-3"
            style={{ width: 'fit-content', height: 'fit-content', maxWidth: '100%', maxHeight: '100%' }}
            whileHover={{
              boxShadow: "0 0 40px rgba(247, 197, 72, 1), 0 0 80px rgba(247, 197, 72, 0.5)",
              borderColor: "rgb(247, 197, 72)"
            }}
          >
            <img
              src={recuerdo3}
              alt="Recuerdo 3"
              className="rounded-sm"
              style={{
                maxWidth: '180px',
                maxHeight: '180px',
                width: 'auto',
                height: 'auto',
                display: 'block'
              }}
            />
          </motion.div>
        </motion.div>

        {/* div4 - Top Right Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: 20 }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: 8,
            y: [0, -7, 0]
          }}
          transition={{
            duration: 0.8,
            delay: 2.2,
            y: {
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          whileHover={{
            scale: 1.3,
            rotate: 0,
            zIndex: 50,
            transition: { duration: 0.3 }
          }}
          whileTap={{ scale: 0.9 }}
          className="hidden md:flex items-center justify-center cursor-pointer hero-photo-div4"
        >
          <style>{`
            .hero-photo-div4 {
              display: none !important;
            }
            @media (min-width: 768px) {
              .hero-photo-div4 {
                display: flex !important;
                grid-column: span 1 / span 1;
                grid-row: span 2 / span 2;
                grid-column-start: 5;
                grid-row-start: 1;
              }
            }
          `}</style>
          <motion.div
            className="relative rounded-lg border-8 border-white shadow-2xl bg-white p-3"
            style={{ width: 'fit-content', height: 'fit-content', maxWidth: '100%', maxHeight: '100%' }}
            whileHover={{
              boxShadow: "0 0 40px rgba(247, 197, 72, 1), 0 0 80px rgba(247, 197, 72, 0.5)",
              borderColor: "rgb(247, 197, 72)"
            }}
          >
            <img
              src={recuerdo2}
              alt="Recuerdo 2"
              className="rounded-sm"
              style={{
                maxWidth: '180px',
                maxHeight: '180px',
                width: 'auto',
                height: 'auto',
                display: 'block'
              }}
            />
          </motion.div>
        </motion.div>

        {/* div5 - Bottom Right Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -20 }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: -6,
            y: [0, -9, 0]
          }}
          transition={{
            duration: 0.8,
            delay: 2.6,
            y: {
              duration: 3.2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          whileHover={{
            scale: 1.3,
            rotate: 0,
            zIndex: 50,
            transition: { duration: 0.3 }
          }}
          whileTap={{ scale: 0.9 }}
          className="hidden md:flex items-center justify-center cursor-pointer hero-photo-div5"
        >
          <style>{`
            .hero-photo-div5 {
              display: none !important;
            }
            @media (min-width: 768px) {
              .hero-photo-div5 {
                display: flex !important;
                grid-column: span 1 / span 1;
                grid-row: span 3 / span 3;
                grid-column-start: 5;
                grid-row-start: 3;
              }
            }
          `}</style>
          <motion.div
            className="relative rounded-lg border-8 border-white shadow-2xl bg-white p-3"
            style={{ width: 'fit-content', height: 'fit-content', maxWidth: '100%', maxHeight: '100%' }}
            whileHover={{
              boxShadow: "0 0 40px rgba(247, 197, 72, 1), 0 0 80px rgba(247, 197, 72, 0.5)",
              borderColor: "rgb(247, 197, 72)"
            }}
          >
            <img
              src={recuerdo4}
              alt="Recuerdo 4"
              className="rounded-sm"
              style={{
                maxWidth: '220px',
                maxHeight: '220px',
                width: 'auto',
                height: 'auto',
                display: 'block'
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        aria-label="Desplazar hacia abajo"
      >
        <ChevronDown size={40} />
      </motion.button>
    </section>
  );
}
