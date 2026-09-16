"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import img1 from "@/assets/cars/car-featured-2.jpg";

// ─── Scene manifest ─────────────────────────────────────────────────────────
const SCENES = [
  { id: 1, name: "SCENE 01 // HIGHWAY LAUNCH - PT 1", src: "/cut_1.mp4" },
  { id: 2, name: "SCENE 02 // HIGHWAY LAUNCH - PT 2", src: "/cut_2.mp4" },
  { id: 3, name: "SCENE 03 // AERODYNAMIC CHASSIS", src: "/scene_2.mp4" },
  { id: 4, name: "SCENE 04 // COCKPIT TELEMETRY", src: "/scene_3.mp4" },
  { id: 5, name: "SCENE 05 // MAXIMUM VELOCITY", src: "/scene_4.mp4" },
  { id: 6, name: "SCENE 06 // EXHAUST SOUND & ACCELERATION", src: "/scene_5.mp4" },
];

const TOTAL_VIDEO_SECONDS = 60.0;
 
type PopupIndex = 1 | 2 | 3 | 4 | 5;

const INTRO_DURATION = 1.0; // seconds of scroll for the popup-0 intro card
const PAUSE_DURATION = 2.0; // how long the video freezes for each feature popup

const FEATURE_WAYPOINTS: { popup: PopupIndex; videoTime: number; label: string }[] = [
  { popup: 1, videoTime: 10, label: "Certified Inspection" },
  { popup: 2, videoTime: 20, label: "Active Spoiler" },
  { popup: 3, videoTime: 30, label: "Digital Cockpit" },
  { popup: 4, videoTime: 40, label: "Torque Vectoring" },
  { popup: 5, videoTime: 50, label: "Titanium Exhaust" },
];

// Total scroll = full video length + one pause-worth of "dead scroll" per waypoint
const TOTAL_SCROLL_TIMELINE_SECONDS =
  TOTAL_VIDEO_SECONDS + FEATURE_WAYPOINTS.length * PAUSE_DURATION;

function computeTimelineState(scrollTime: number): {
  videoTime: number;
  activePopup: 0 | PopupIndex | null;
  isVideoPaused: boolean;
} {
  // Intro title card
  if (scrollTime <= INTRO_DURATION) {
    return { videoTime: scrollTime, activePopup: 0, isVideoPaused: false };
  }

  let cumulativePauseOffset = 0;

  for (const wp of FEATURE_WAYPOINTS) {
    const pauseStart = wp.videoTime + cumulativePauseOffset;
    const pauseEnd = pauseStart + PAUSE_DURATION;

    if (scrollTime < pauseStart) {
      // Still playing footage on the way to this waypoint
      return {
        videoTime: scrollTime - cumulativePauseOffset,
        activePopup: null,
        isVideoPaused: false,
      };
    }

    if (scrollTime < pauseEnd) {
      // Frozen on this waypoint's frame — show its popup
      return { videoTime: wp.videoTime, activePopup: wp.popup, isVideoPaused: true };
    }

    // This waypoint's pause has fully passed — its dead-scroll counts going forward
    cumulativePauseOffset += PAUSE_DURATION;
  }

  // Past the last waypoint — play out the remainder of the video
  const videoTime = Math.min(TOTAL_VIDEO_SECONDS, scrollTime - cumulativePauseOffset);
  return { videoTime, activePopup: null, isVideoPaused: false };
}

// Scroll-bar dots — generated from the exact same waypoints/offsets used above,
// so a dot's vertical position always matches when its popup actually fires,
// and the 5 dots land evenly spaced (equal 10s video gaps + equal 2s pauses).
const CONTENT_BREAKPOINTS = FEATURE_WAYPOINTS.map((wp, i) => {
  const pauseStart = wp.videoTime + i * PAUSE_DURATION;
  return {
    id: wp.popup,
    label: wp.label,
    matchPopup: wp.popup,
    time: pauseStart,
    pct: (pauseStart / TOTAL_SCROLL_TIMELINE_SECONDS) * 100,
  };
});

// ─── Per-scene video element wrapper ────────────────────────────────────────
// Each scene covers an equal slice of TOTAL_VIDEO_SECONDS
const PER_SCENE_SECONDS = TOTAL_VIDEO_SECONDS / SCENES.length; // 10 s each

function getSceneAndLocalTime(globalTime: number): { sceneIdx: number; localTime: number } {
  const idx = Math.min(SCENES.length - 1, Math.floor(globalTime / PER_SCENE_SECONDS));
  const localTime = globalTime - idx * PER_SCENE_SECONDS;
  return { sceneIdx: idx, localTime };
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function CarmaQualityPage() {
  const canvasRef      = useRef<HTMLCanvasElement | null>(null);
  const containerRef   = useRef<HTMLDivElement | null>(null);
  const sceneHudRef    = useRef<HTMLSpanElement | null>(null);
  const percentHudRef  = useRef<HTMLSpanElement | null>(null);
  const scrollBarRef   = useRef<HTMLDivElement | null>(null);

  // Hidden video elements – one per scene, preloaded in background
  const videosRef = useRef<HTMLVideoElement[]>([]);
  // Track which videos have enough data to draw
  const videoReadyRef = useRef<boolean[]>(SCENES.map(() => false));
  // Pending seek promise per video (to avoid overlapping seeks)
  const seekingRef = useRef<boolean[]>(SCENES.map(() => false));
  const lastSeekTimeRef = useRef<number[]>(SCENES.map(() => -1));

  const [activePopup, setActivePopup]       = useState<0 | 1 | 2 | 3 | 4 | 5 | null>(0);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isPastVideo, setIsPastVideo]       = useState(false);
  const isPastVideoRef = useRef(false);

  // ── Reset scroll on mount ─────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }
  }, []);

  // ── Canvas resize ─────────────────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width  = window.innerWidth  * window.devicePixelRatio;
        canvasRef.current.height = window.innerHeight * window.devicePixelRatio;
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── Preload all video elements in background ──────────────────────────────
  useEffect(() => {
    const videos: HTMLVideoElement[] = SCENES.map((scene, i) => {
      const v = document.createElement("video");
      v.src         = scene.src;
      v.muted       = true;
      v.playsInline = true;
      v.preload     = "auto";
      v.crossOrigin = "anonymous";

      const markReady = () => { videoReadyRef.current[i] = true; };
      v.addEventListener("loadeddata",  markReady);
      v.addEventListener("canplaythrough", markReady);

      // Start loading
      v.load();
      return v;
    });

    videosRef.current = videos;

    return () => {
      videos.forEach((v) => {
        v.src = "";
        v.load();
      });
      videosRef.current = [];
      videoReadyRef.current = SCENES.map(() => false);
    };
  }, []);

  // ── Scroll + render loop ──────────────────────────────────────────────────
  useEffect(() => {
    let animFrameId: number;
    let targetProgress  = 0;
    let smoothProgress  = 0;
    let lastPopupState: 0 | 1 | 2 | 3 | 4 | 5 | null = null;
    let lastSceneIdx    = 0;

    const renderLoop = () => {
      const canvas = canvasRef.current;
      const ctx    = canvas?.getContext("2d");

      const videoSectionHeight = window.innerHeight * 10;
      const currentScroll      = Math.max(0, window.scrollY);
      targetProgress = Math.min(1, Math.max(0, currentScroll / videoSectionHeight));

      // Hide fixed elements once past video section
      const nowPast = currentScroll >= videoSectionHeight;
      if (nowPast !== isPastVideoRef.current) {
        isPastVideoRef.current = nowPast;
        setIsPastVideo(nowPast);
        if (nowPast) setActivePopup(null);
      }

      // Smooth lerp
      const diff = targetProgress - smoothProgress;
      if (Math.abs(diff) > 0.0001) smoothProgress += diff * 0.35;
      else smoothProgress = targetProgress;

      const rawScrollTime = smoothProgress * TOTAL_SCROLL_TIMELINE_SECONDS;
      const { videoTime, activePopup: currentPopup } = computeTimelineState(rawScrollTime);

      // Derive scene index from videoTime
      const videoProgress = Math.min(1, Math.max(0, videoTime / TOTAL_VIDEO_SECONDS));
      const { sceneIdx, localTime } = getSceneAndLocalTime(videoTime);

      // HUD updates (direct DOM – no re-render)
      if (sceneHudRef.current)   sceneHudRef.current.textContent   = SCENES[sceneIdx].name;
      if (percentHudRef.current) percentHudRef.current.textContent = `${Math.round(smoothProgress * 100)}%`;
      if (scrollBarRef.current)  scrollBarRef.current.style.height = `${smoothProgress * 100}%`;

      if (sceneIdx !== lastSceneIdx) { lastSceneIdx = sceneIdx; setActiveSceneIndex(sceneIdx); }

      // Draw from video element
      const video = videosRef.current[sceneIdx];
      if (video && videoReadyRef.current[sceneIdx] && canvas && ctx) {
        const seekKey = Math.round(localTime * 30) / 30; // quantise to ~30 fps precision

        if (!seekingRef.current[sceneIdx] && Math.abs(lastSeekTimeRef.current[sceneIdx] - seekKey) > 0.01) {
          seekingRef.current[sceneIdx]    = true;
          lastSeekTimeRef.current[sceneIdx] = seekKey;

          // Clamp to video duration
          const target = Math.max(0, Math.min(video.duration || PER_SCENE_SECONDS, localTime));
          video.currentTime = target;

          const onSeeked = () => {
            video.removeEventListener("seeked", onSeeked);
            seekingRef.current[sceneIdx] = false;

            // Draw the sought frame
            const c = canvasRef.current;
            const cx = c?.getContext("2d");
            if (!c || !cx) return;

            cx.clearRect(0, 0, c.width, c.height);
            const vAspect = video.videoWidth  / video.videoHeight;
            const cAspect = c.width / c.height;
            let drawW = c.width, drawH = c.height, drawX = 0, drawY = 0;

            if (cAspect > 1.0) {
              if (cAspect > vAspect) { drawH = c.width / vAspect; drawY = (c.height - drawH) / 2; }
              else { drawW = c.height * vAspect; drawX = (c.width - drawW) / 2; }
            } else {
              // Portrait / mobile: top strip + scaled video
              const topColor = getTopPixelColor(video, cx, c);
              const vAreaH   = c.height * 0.75;
              const vAreaY   = c.height * 0.25;
              cx.fillStyle = topColor;
              cx.fillRect(0, 0, c.width, vAreaY + 4);
              drawH = vAreaH; drawW = vAreaH * vAspect;
              drawX = (c.width - drawW) / 2; drawY = vAreaY;
              if (drawW < c.width) { drawW = c.width; drawH = c.width / vAspect; drawX = 0; drawY = vAreaY + (vAreaH - drawH) / 2; }
            }
            cx.drawImage(video, drawX, drawY, drawW, drawH);
          };

          video.addEventListener("seeked", onSeeked);
        }
      }

      if (currentPopup !== lastPopupState) { lastPopupState = currentPopup; setActivePopup(currentPopup); }
      animFrameId = requestAnimationFrame(renderLoop);
    };

    animFrameId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animFrameId);
  }, []);

  return (
    <div ref={containerRef} className="relative bg-black text-white font-sans selection:bg-cyan-500 selection:text-black">

      {/* ── VIDEO SCROLL SECTION (1000vh) ── */}
      <div className="relative h-[1000vh]">
        <canvas
          ref={canvasRef}
          className={`fixed inset-0 w-full h-full z-0 pointer-events-none object-cover brightness-95 contrast-105 ${isPastVideo ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        />
        <div className={`fixed inset-0 z-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/60 ${isPastVideo ? "hidden" : ""}`} />
        <div className={`fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/10 to-black/70 ${isPastVideo ? "hidden" : ""}`} />

        {/* Header */}
        

        {/* Right scroll progress bar */}
        <div className={`fixed right-6 top-1/2 -translate-y-1/2 z-30 flex-col items-center space-y-4 ${isPastVideo ? "hidden" : "hidden md:flex"}`}>
          <div className="w-2 h-64 bg-white/10 rounded-full relative">
            <div ref={scrollBarRef} className="w-full bg-gradient-to-b from-cyan-400 via-blue-500 to-indigo-600 rounded-full" style={{ height: "0%" }} />
            {CONTENT_BREAKPOINTS.map((bp) => {
              const isActive = activePopup === bp.matchPopup;
              return (
                <div key={bp.id} className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 group flex items-center" style={{ top: `${bp.pct}%` }}>
                  <div className={`rounded-full transition-all duration-300 ${isActive ? "w-4 h-4 bg-cyan-400 border-2 border-white shadow-[0_0_15px_#22d3ee] animate-pulse" : "w-2.5 h-2.5 bg-black border border-cyan-400/60 group-hover:bg-cyan-400 group-hover:scale-125"}`} />
                  <div className="absolute right-6 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap bg-black/90 backdrop-blur-md px-2 py-0.5 rounded border border-cyan-500/40 text-[10px] font-mono text-cyan-300 shadow-lg">
                    {bp.label}
                  </div>
                </div>
              );
            })}
          </div>
          <span ref={percentHudRef} className="font-mono text-xs text-cyan-400 font-bold">0%</span>
        </div>

        {/* POPUP 0: Intro */}
        <AnimatePresence>
          {activePopup === 0 && (
            <motion.div
              initial={{ opacity: 0, x: -50, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -40, scale: 0.9, filter: "blur(8px)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="fixed top-48 md:top-32 left-4 md:left-8 z-30 max-w-[calc(100vw-2rem)] md:max-w-lg w-full rounded-xl p-4 md:p-5"
            >
              <h4 className="text-4xl md:text-7xl font-bold text-white mb-1 leading-tight">
                A tailored process like no other.
              </h4>
            </motion.div>
          )}
        </AnimatePresence>

        {/* POPUP 1: Certified Inspection */}
        <AnimatePresence>
          {activePopup === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 40, scale: 0.9, filter: "blur(8px)" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="fixed top-28 md:top-32 right-4 md:right-8 z-30 max-w-[calc(100vw-2rem)] md:max-w-sm w-full rounded-xl p-4 md:p-5"
            >
              <h4 className="text-2xl md:text-4xl font-bold text-white mb-1">We handpick the highest quality cars in Australia.</h4>
              <p className="text-xl text-gray-200 leading-relaxed">Our team is meticulous, and only the best make it to our website.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* POPUP 2: Active Spoiler */}
        <AnimatePresence>
          {activePopup === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 40, scale: 0.9, filter: "blur(8px)" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="fixed top-14 md:top-32 lg:left-14 left-1 z-30 max-w-[calc(100vw-2rem)] md:max-w-xl w-full rounded-xl p-4 md:p-5"
            >
              <h4 className="text-base md:text-6xl font-bold text-white mb-1">Your personal pro test drivers.</h4>
              <p className="text-2xl text-gray-200 leading-relaxed">We get behind the wheel to road test every aspect of the driver experience.</p>
              <div>
                <video src="/cut_1.mp4" autoPlay className="w-full h-auto rounded-2xl" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* POPUP 3: Digital Cockpit */}
        <AnimatePresence>
          {activePopup === 3 && (
            <motion.div
              initial={{ opacity: 0, x: -50, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -40, scale: 0.9, filter: "blur(8px)" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="fixed top-18 lg:top-24 left-4 md:left-8 z-30 max-w-[calc(100vw-2rem)] md:max-w-sm w-full rounded-xl p-4 md:p-5"
            >
             
              <h4 className="text-2xl md:text-4xl font-bold text-white mb-1">90+ minutes, 10 experts and a mechanical hoist.</h4>
              <p className="text-xl text-gray-200 leading-relaxed">Nothing escapes our forensic inspection process.</p>
             <div>
                <video src="/cut_1.mp4" autoPlay className="w-full h-auto rounded-2xl" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* POPUP 4: Torque Vectoring */}
        <AnimatePresence>
          {activePopup === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 40, scale: 0.9, filter: "blur(8px)" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="fixed top-18 md:top-32 right-4 md:right-8 z-30 max-w-[calc(100vw-2rem)] md:max-w-sm w-full rounded-xl p-4 md:p-5"
            >
        
              <h4 className="text-2xl md:text-4xl font-bold text-white mb-1">Reconditioned by our team of specialists.</h4>
              <p className="text-xl text-gray-300 leading-relaxed">From testing to fine-tuning, we get it done to our exacting standards.</p>
               <div>
                <video src="/cut_1.mp4" autoPlay className="w-full h-auto rounded-2xl" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* POPUP 5: Titanium Exhaust */}
        <AnimatePresence>
          {activePopup === 5 && (
            <motion.div
              initial={{ opacity: 0, x: 50, y: 20, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 40, y: 20, scale: 0.9, filter: "blur(8px)" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="fixed top-36 left-1 lg:left-14 z-30 max-w-[calc(100vw-2rem)] md:max-w-xl w-full rounded-xl p-4 md:p-5"
            >
              <h4 className="text-2xl md:text-5xl font-bold text-white mb-1">The finishing touches to showroom-standard.</h4>
              <p className="text-xl text-gray-200 leading-relaxed">Deodorising, vacuuming, washing, waxing and buffing. So every car feels like new.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── CARDORA QUALITY SECTION + FOOTER (last view) ── */}
      <section className="relative z-30 bg-[#FAFAF8] text-[#161616]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-8 md:pt-12">

          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-6">
            <div className="relative rounded-3xl overflow-hidden min-h-[420px] md:min-h-[480px] bg-gradient-to-br from-[#1c1c1c] via-[#2b2b2b] to-[#3a3a3a]">
              <img src={img1?.src} alt="Showroom" className="absolute inset-0 w-full h-full object-cover opacity-70" />
              <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-10">
                <h1 className="text-3xl md:text-5xl font-bold text-white leading-[1.1] max-w-lg">
                  From our showroom to your driveway
                </h1>
              </div>
            </div>
            <div className="relative rounded-3xl overflow-hidden bg-white border border-black/[0.06] flex flex-col">
              <div className="relative h-48 md:h-56 bg-gradient-to-br from-[#dfe3e6] to-[#c7ccd1] overflow-hidden">
                <img src={img1?.src} alt="Specialist" className="absolute inset-0 w-full h-full object-cover opacity-70" />
                <div className="absolute top-4 left-4 w-16 h-16 rounded-full bg-white shadow-md flex flex-col items-center justify-center text-center text-[9px] font-bold leading-tight text-[#161616] px-2">
                  AUTHORIZED<br />DEALER
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-center">
                <h3 className="text-lg md:text-xl font-bold mb-2 leading-snug">
                  Cardora is the exclusive certified dealer for every model we carry
                </h3>
                <p className="text-sm text-[#161616]/60 leading-relaxed">
                  Every step of our process is measured against the highest industry benchmarks — from inspection and reconditioning to final quality assurance.
                </p>
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="relative rounded-3xl overflow-hidden bg-white border border-black/[0.06] flex flex-col md:flex-row">
              <div className="p-8 flex-1 flex flex-col justify-center">
                <h3 className="text-xl font-bold mb-2">Find your own Cardora car</h3>
                <p className="text-sm text-[#161616]/60 leading-relaxed mb-5">
                  With unbeatable quality and the peace of mind of a 7-day return, there&apos;s simply no better way to buy a performance car.
                </p>
                <a href="/inventory" className="w-fit px-5 py-2.5 rounded-full border border-[#161616]/20 text-sm font-semibold hover:bg-[#161616] hover:text-white transition-colors">
                  Browse all cars
                </a>
              </div>
              <img src={img1?.src} alt="Browse" className="w-full md:w-56 h-40 md:h-auto object-cover" />
            </div>
            <div className="relative rounded-3xl overflow-hidden bg-[#F1EFEA] border border-black/[0.06] flex flex-col md:flex-row">
              <div className="p-8 flex-1 flex flex-col justify-center">
                <h3 className="text-xl font-bold mb-2">Our quality standards</h3>
                <p className="text-sm text-[#161616]/60 leading-relaxed mb-5">
                  See how our certified inspection and reconditioning process prepares every vehicle to a higher standard before it reaches you.
                </p>
                <a href="/service" className="w-fit px-5 py-2.5 rounded-full border border-[#161616]/20 text-sm font-semibold hover:bg-[#161616] hover:text-white transition-colors">
                  Find out more
                </a>
              </div>
              <img src={img1?.src} alt="Quality" className="w-full md:w-56 h-40 md:h-auto object-cover" />
            </div>
          </div>
        </div>

        {/* Footer is the final view — nothing below */}
        {/* <Footer /> */}
      </section>
    </div>
  );
}

// ─── Helper: sample top-centre pixel colour from a video element ─────────────
function getTopPixelColor(
  video: HTMLVideoElement,
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): string {
  try {
    // Draw a tiny 1×1 sample to a temp canvas to avoid clobbering main canvas
    const tmp = document.createElement("canvas");
    tmp.width = 1; tmp.height = 1;
    const tc = tmp.getContext("2d");
    if (!tc) return "#000000";
    tc.drawImage(video, Math.floor(video.videoWidth / 2), 4, 1, 1, 0, 0, 1, 1);
    const d = tc.getImageData(0, 0, 1, 1).data;
    return `rgb(${d[0]}, ${d[1]}, ${d[2]})`;
  } catch {
    return "#000000";
  }
}
