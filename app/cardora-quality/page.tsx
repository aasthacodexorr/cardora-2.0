"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import img1 from "@/assets/cars/car-featured-2.jpg";
import q1 from "@/assets/cars/quality-1.webp";
import q2 from "@/assets/cars/quality-2.webp";
import q3 from "@/assets/cars/quality-3.webp";

const SCENES = [
  { id: 1, name: "SCENE 01 // SHOWROOM QUALITY STANDARD" },
  { id: 2, name: "SCENE 02 // AERODYNAMIC CHASSIS & AIRFLOW" },
  { id: 3, name: "SCENE 03 // COCKPIT TELEMETRY & INTERIOR" },
  { id: 4, name: "SCENE 04 // POWERTRAIN & MECHANICAL" },
  { id: 5, name: "SCENE 05 // VELOCITY DYNAMICS & STABILITY" },
  { id: 6, name: "SCENE 06 // TITANIUM EXHAUST & ACCELERATION" },
];

const TOTAL_FRAMES = 750;

function getFrameUrl(index: number) {
  // Frames exist up to seq_00749.jpg on CDN, safely clamp so frame 750 resolves without 404
  const frameNumber = Math.min(749, Math.max(1, index + 1));
  const seqNum = String(frameNumber).padStart(5, "0");
  return `https://img.carma.com.au/ui-assets/CarQualityAnimation/landscape/seq_${seqNum}.jpg?tr=f-auto,w-1920,q-50`;
}

const CONTENT_BREAKPOINTS = [
  { id: 0, label: "A Tailored Process", displayPct: 0, targetFrame: 1, scrollPct: 0 },
  { id: 1, label: "Handpicked Quality", displayPct: 20, targetFrame: 98, scrollPct: (98 / 750) * 100 },
  { id: 2, label: "Pro Test Drivers", displayPct: 40, targetFrame: 181, scrollPct: (181 / 750) * 100 },
  { id: 3, label: "Forensic Inspection", displayPct: 60, targetFrame: 365, scrollPct: (365 / 750) * 100 },
  { id: 4, label: "Reconditioned Specialists", displayPct: 80, targetFrame: 446, scrollPct: (446 / 750) * 100 },
  { id: 5, label: "Showroom Finishing Touches", displayPct: 100, targetFrame: 707, scrollPct: (707 / 750) * 100 },
];

const BREAKPOINT_WAYPOINTS = [
  { rawProgress: 0, uiProgress: 0 },
  { rawProgress: 98 / 750, uiProgress: 0.2 },
  { rawProgress: 181 / 750, uiProgress: 0.4 },
  { rawProgress: 365 / 750, uiProgress: 0.6 },
  { rawProgress: 446 / 750, uiProgress: 0.8 },
  { rawProgress: 1.0, uiProgress: 1.0 },
];

function getUiProgress(rawProgress: number): number {
  if (rawProgress <= 0) return 0;
  if (rawProgress >= 1) return 1;

  for (let i = 0; i < BREAKPOINT_WAYPOINTS.length - 1; i++) {
    const p1 = BREAKPOINT_WAYPOINTS[i];
    const p2 = BREAKPOINT_WAYPOINTS[i + 1];
    if (rawProgress >= p1.rawProgress && rawProgress <= p2.rawProgress) {
      const segmentRatio = (rawProgress - p1.rawProgress) / (p2.rawProgress - p1.rawProgress);
      return p1.uiProgress + segmentRatio * (p2.uiProgress - p1.uiProgress);
    }
  }
  return rawProgress;
}

function Star90Badge() {
  return (
    <div className="relative w-8 h-8 flex-shrink-0 flex items-center justify-center">
      <svg className="w-8 h-8 drop-shadow-sm" viewBox="0 0 32 32" fill="none">
        <defs>
          <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <path
          d="M16 2l3.4 3.9 5.2-.8 1.4 5 4.8 2.1-1.6 4.9 3.2 4.2-4.2 3.2-1.6 4.9-5-1.4-3.6 3.8-3.6-3.8-5 1.4-1.6-4.9-4.2-3.2 3.2-4.2-1.6-4.9 4.8-2.1 1.4-5 5.2.8L16 2z"
          fill="url(#starGrad)"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white tracking-tighter">
        90
      </span>
    </div>
  );
}

function ShieldCheckBadge() {
  return (
    <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
      <svg className="w-8 h-8 drop-shadow-sm" viewBox="0 0 32 32" fill="none">
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        <path
          d="M16 3L26 7v8c0 6.5-4.2 12.6-10 14-5.8-1.4-10-7.5-10-14V7l10-4z"
          fill="url(#shieldGrad)"
        />
        <path
          d="M12 16l3 3 5-6"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function CardoraCertifiedBadge() {
  return (
    <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
      <svg className="w-8 h-8 drop-shadow-sm" viewBox="0 0 32 32" fill="none">
        <defs>
          <linearGradient id="cardoraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
        <path
          d="M16 2l2.6 2.4 3.5-.7 1.8 3.1 3.5.8.8 3.5 3.1 1.8-.7 3.5 2.4 2.6-2.4 2.6.7 3.5-3.1 1.8-.8 3.5-3.5.8-1.8 3.1-3.5-.7L16 30l-2.6-2.4-3.5.7-1.8-3.1-3.5-.8-.8-3.5-3.1-1.8.7-3.5-2.4-2.6 2.4-2.6-.7-3.5 3.1-1.8.8-3.5 3.5-.8 1.8-3.1 3.5.7L16 2z"
          fill="url(#cardoraGrad)"
        />
        <path
          d="M11 16.5l3.5 3.5L21 13"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function CardoraQualityPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Imperative refs for 0 React re-render scroll performance
  const scrollBarRef = useRef<HTMLDivElement | null>(null);
  const timelineHudRef = useRef<HTMLDivElement | null>(null);

  const [, setActiveSceneIndex] = useState(0);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [showFirstFrameHero, setShowFirstFrameHero] = useState(true);
  const [showCanadaHandpick, setShowCanadaHandpick] = useState(false);
  const [showProTestDrivers, setShowProTestDrivers] = useState(false);
  const [showForensicInspection, setShowForensicInspection] = useState(false);
  const [showReconditioned, setShowReconditioned] = useState(false);
  const [showFinishingTouches, setShowFinishingTouches] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Master frame cache & dynamic top boundary colors
  const framesRef = useRef<(HTMLImageElement | null)[]>([]);
  const topColorsRef = useRef<(string | null)[]>([]);

  // Disable browser auto-scroll restoration on reload & reset to top (0,0)
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }
  }, []);

  // PARALLEL HIGH-PRECISION 750-FRAME PRELOADER & BACKGROUND STREAMER
  useEffect(() => {
    let isMounted = true;
    const frames: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);
    const topColors: (string | null)[] = new Array(TOTAL_FRAMES).fill(null);
    framesRef.current = frames;
    topColorsRef.current = topColors;

    const sampleCanvas = document.createElement("canvas");
    sampleCanvas.width = 1;
    sampleCanvas.height = 1;
    const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });

    const loadSingleFrame = (idx: number): Promise<boolean> => {
      return new Promise((resolve) => {
        if (frames[idx]) {
          resolve(true);
          return;
        }
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = getFrameUrl(idx);

        img.onload = () => {
          if (!isMounted) {
            resolve(false);
            return;
          }
          frames[idx] = img;
          try {
            if (sampleCtx) {
              sampleCtx.drawImage(img, Math.floor((img.naturalWidth || 1920) / 2), 4, 1, 1, 0, 0, 1, 1);
              const pData = sampleCtx.getImageData(0, 0, 1, 1).data;
              topColors[idx] = `rgb(${pData[0]}, ${pData[1]}, ${pData[2]})`;
            }
          } catch {
            topColors[idx] = "#000000";
          }
          resolve(true);
        };

        img.onerror = () => {
          resolve(false);
        };
      });
    };

    // High-performance streaming: Load first frames immediately, keyframes next, then remaining sequence
    async function loadAllFrames() {
      try {
        const runQueue = async (indices: number[], concurrency: number) => {
          let currentIndex = 0;
          const workers = Array.from({ length: concurrency }, async () => {
            while (currentIndex < indices.length && isMounted) {
              const idx = indices[currentIndex++];
              await loadSingleFrame(idx);
            }
          });
          await Promise.all(workers);
        };

        // Phase 1: Critical start frames (0..24) loaded first so initial scene is razor sharp immediately
        const criticalIndices: number[] = [];
        for (let i = 0; i < 25; i++) criticalIndices.push(i);
        await runQueue(criticalIndices, 8);
        if (!isMounted) return;

        // Phase 2: Keyframe milestones distributed across the 750 timeline (every 6 frames)
        const keyframeIndices: number[] = [];
        for (let i = 25; i < TOTAL_FRAMES; i += 6) keyframeIndices.push(i);
        keyframeIndices.push(TOTAL_FRAMES - 1);
        await runQueue(keyframeIndices, 10);
        if (!isMounted) return;

        // Phase 3: Seamlessly fill all remaining frames in the background
        const remainingIndices: number[] = [];
        const loadedSet = new Set([...criticalIndices, ...keyframeIndices]);
        for (let i = 0; i < TOTAL_FRAMES; i++) {
          if (!loadedSet.has(i)) remainingIndices.push(i);
        }
        runQueue(remainingIndices, 8);
      } catch (err) {
        console.error("Frame sequence loader error", err);
      }
    }

    loadAllFrames();

    return () => {
      isMounted = false;
    };
  }, []);

  // Canvas resize handler
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const dpr = window.devicePixelRatio || 1;
        const w = window.innerWidth;
        const h = window.innerHeight;
        canvasRef.current.width = Math.round(w * dpr);
        canvasRef.current.height = Math.round(h * dpr);
        canvasRef.current.style.width = `${w}px`;
        canvasRef.current.style.height = `${h}px`;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // LIQUID-SMOOTH IMPERATIVE SCROLL ENGINE WITH TIMESTAMP TRIGGERS
  useEffect(() => {
    let animFrameId: number;
    let targetProgress = 0;
    let smoothProgress = 0;
    let lastSceneIndex = 0;
    let lastShowHero = true;
    let lastShowHandpick = false;
    let lastShowProTestDrivers = false;
    let lastShowForensicInspection = false;
    let lastShowReconditioned = false;
    let lastShowFinishingTouches = false;
    let lastStep = 0;

    const renderLoop = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");

      // Calculate scroll progress relative to the animation track
      const track = trackRef.current;
      const scrollDistance = track ? Math.max(1, track.offsetHeight - window.innerHeight) : window.innerHeight * 8;
      const currentScroll = Math.max(0, window.scrollY);
      targetProgress = Math.min(1, Math.max(0, currentScroll / scrollDistance));

      const diff = targetProgress - smoothProgress;
      if (Math.abs(diff) > 0.0001) {
        smoothProgress += diff * 0.22;
      } else {
        smoothProgress = targetProgress;
      }

      // Direct linear continuous frame mapping (never pauses, never stops!)
      const targetFrameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.floor(smoothProgress * (TOTAL_FRAMES - 1)))
      );
      const currentFrameNumber = targetFrameIndex + 1;

      // Determine active scene index based on continuous scroll progress
      const sceneIdx = Math.min(SCENES.length - 1, Math.floor(smoothProgress * SCENES.length));
      if (sceneIdx !== lastSceneIndex) {
        lastSceneIndex = sceneIdx;
        setActiveSceneIndex(sceneIdx);
      }

      if (scrollBarRef.current) {
        const uiProgress = getUiProgress(smoothProgress);
        scrollBarRef.current.style.height = `${uiProgress * 100}%`;
      }

      const isHeroActive = currentFrameNumber <= 45;
      const isHandpickActive = currentFrameNumber >= 74 && currentFrameNumber <= 123;
      const isProTestDriversActive = currentFrameNumber >= 150 && currentFrameNumber <= 212;
      const isForensicInspectionActive = currentFrameNumber >= 342 && currentFrameNumber <= 388;
      const isReconditionedActive = currentFrameNumber >= 418 && currentFrameNumber <= 475;
      const isFinishingTouchesActive = currentFrameNumber >= 665 && currentFrameNumber <= 750;

      let step = 0;
      if (currentFrameNumber >= 74 && currentFrameNumber < 150) step = 1;
      else if (currentFrameNumber >= 150 && currentFrameNumber < 342) step = 2;
      else if (currentFrameNumber >= 342 && currentFrameNumber < 418) step = 3;
      else if (currentFrameNumber >= 418 && currentFrameNumber < 665) step = 4;
      else if (currentFrameNumber >= 665) step = 5;

      if (step !== lastStep) {
        lastStep = step;
        setCurrentStep(step);
      }

      if (isHeroActive !== lastShowHero) {
        lastShowHero = isHeroActive;
        setShowFirstFrameHero(isHeroActive);
      }

      if (isHandpickActive !== lastShowHandpick) {
        lastShowHandpick = isHandpickActive;
        setShowCanadaHandpick(isHandpickActive);
      }

      if (isProTestDriversActive !== lastShowProTestDrivers) {
        lastShowProTestDrivers = isProTestDriversActive;
        setShowProTestDrivers(isProTestDriversActive);
      }

      if (isForensicInspectionActive !== lastShowForensicInspection) {
        lastShowForensicInspection = isForensicInspectionActive;
        setShowForensicInspection(isForensicInspectionActive);
      }

      if (isReconditionedActive !== lastShowReconditioned) {
        lastShowReconditioned = isReconditionedActive;
        setShowReconditioned(isReconditionedActive);
      }

      if (isFinishingTouchesActive !== lastShowFinishingTouches) {
        lastShowFinishingTouches = isFinishingTouchesActive;
        setShowFinishingTouches(isFinishingTouchesActive);
      }

      if (canvas && ctx) {
        const frames = framesRef.current;
        let img = frames[targetFrameIndex];

        // Nearest loaded frame fallback
        if (!img) {
          for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
            const prev = targetFrameIndex - offset;
            const next = targetFrameIndex + offset;
            if (prev >= 0 && frames[prev]) {
              img = frames[prev];
              break;
            }
            if (next < TOTAL_FRAMES && frames[next]) {
              img = frames[next];
              break;
            }
          }
        }

        // Top color fallback
        let topColor = topColorsRef.current[targetFrameIndex];
        if (!topColor) {
          for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
            const prev = targetFrameIndex - offset;
            const next = targetFrameIndex + offset;
            if (prev >= 0 && topColorsRef.current[prev]) {
              topColor = topColorsRef.current[prev];
              break;
            }
            if (next < TOTAL_FRAMES && topColorsRef.current[next]) {
              topColor = topColorsRef.current[next];
              break;
            }
          }
        }
        if (!topColor) topColor = "#000000";

        if (img) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.filter = "none";
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const vWidth = img.naturalWidth || 1920;
          const vHeight = img.naturalHeight || 1080;
          const cWidth = canvas.width;
          const cHeight = canvas.height;

          const vAspect = vWidth / vHeight;
          const cAspect = cWidth / cHeight;

          let drawW = cWidth;
          let drawH = cHeight;
          let drawX = 0;
          let drawY = 0;

          if (cAspect > 1.0) {
            // Desktop view (landscape / widescreen) -> 100% full screen cover scaling
            if (cAspect > vAspect) {
              drawW = cWidth;
              drawH = cWidth / vAspect;
              drawX = 0;
              drawY = (cHeight - drawH) / 2;
            } else {
              drawH = cHeight;
              drawW = cHeight * vAspect;
              drawX = (cWidth - drawW) / 2;
              drawY = 0;
            }
          } else {
            // Responsive / Mobile view (cAspect <= 1.0)
            // Video takes 75% height at bottom, top 25% height is filled with frame's dynamic topColor
            const videoAreaH = cHeight * 0.75;
            const videoAreaY = cHeight * 0.25;

            ctx.fillStyle = topColor;
            ctx.fillRect(0, 0, cWidth, videoAreaY + 4);

            drawH = videoAreaH;
            drawW = videoAreaH * vAspect;
            drawX = (cWidth - drawW) / 2;
            drawY = videoAreaY;

            if (drawW < cWidth) {
              drawW = cWidth;
              drawH = cWidth / vAspect;
              drawX = 0;
              drawY = videoAreaY + (videoAreaH - drawH) / 2;
            }
          }

          ctx.drawImage(img, drawX, drawY, drawW, drawH);
        }
      }

      animFrameId = requestAnimationFrame(renderLoop);
    };

    animFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative bg-black text-white font-sans selection:bg-[#ff2a5f] selection:text-white"
    >
      {/* STICKY CANVAS HERO WRAPPER FOR VIDEO TIMELINE */}
      <div ref={trackRef} className="relative h-[850vh]">
        {/* STICKY VIEWPORT CONTAINER */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* GPU CANVAS DISPLAY */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-0 pointer-events-none"
            style={{ imageRendering: "auto" }}
          />

          {/* RIGHT SIDE SCROLL PROGRESS BAR WITH CONTENT BREAKPOINTS */}
          <div
            ref={timelineHudRef}
            className="absolute right-5 sm:right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center hidden md:flex transition-opacity duration-300"
          >
            <div className="w-[4.5px] sm:w-[5px] h-64 bg-white/40 rounded-full relative shadow-sm">
              {/* Active progress fill */}
              <div
                ref={scrollBarRef}
                className="w-full bg-[#ff2a5f] rounded-full transition-all duration-75 shadow-[0_0_10px_rgba(255,42,95,0.7)]"
                style={{ height: "0%" }}
              />

              {/* Content Breakpoint Markers */}
              {CONTENT_BREAKPOINTS.map((bp) => {
                const isActive =
                  bp.id === 0
                    ? showFirstFrameHero
                    : bp.id === 1
                      ? showCanadaHandpick
                      : bp.id === 2
                        ? showProTestDrivers
                        : bp.id === 3
                          ? showForensicInspection
                          : bp.id === 4
                            ? showReconditioned
                            : bp.id === 5
                              ? showFinishingTouches
                              : false;

                const isCompleted =
                  currentStep > bp.id ||
                  (!isActive &&
                    currentStep === bp.id &&
                    ((bp.id === 0 && !showFirstFrameHero) ||
                      (bp.id === 1 && !showCanadaHandpick) ||
                      (bp.id === 2 && !showProTestDrivers) ||
                      (bp.id === 3 && !showForensicInspection) ||
                      (bp.id === 4 && !showReconditioned)));

                return (
                  <div
                    key={bp.id}
                    onClick={() => {
                      const track = trackRef.current;
                      const scrollDistance = track ? track.offsetHeight - window.innerHeight : window.innerHeight * 8;
                      const targetScroll = (bp.scrollPct / 100) * scrollDistance;
                      window.scrollTo({ top: targetScroll, behavior: "smooth" });
                    }}
                    className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 group flex items-center justify-center cursor-pointer pointer-events-auto"
                    style={{ top: `${bp.displayPct}%` }}
                  >
                    {/* Breakpoint Dot */}
                    {isActive ? (
                      <div className="w-4 h-4 rounded-full bg-[#ff2a5f] border-[2.5px] border-white shadow-[0_0_10px_rgba(255,42,95,0.8)] flex items-center justify-center transition-all duration-300 ring-2 ring-[#ff2a5f]/40" />
                    ) : isCompleted ? (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ff2a5f] shadow-sm transition-all duration-300" />
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-white/20 border-2 border-white/80 transition-all duration-300" />
                    )}

                    {/* Hover/Active Label Badge */}
                    <div className="absolute right-6 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap bg-black/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20 text-[11px] font-medium text-white shadow-lg">
                      {bp.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ---------------- FIRST FRAME HERO & EDITORIAL BREAKPOINTS ---------------- */}
          <AnimatePresence mode="wait">
            {showFirstFrameHero && (
              <motion.div
                key="cardora-first-frame"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-24 sm:top-28 md:top-44 left-6 sm:left-10 md:left-14 lg:left-20 right-6 sm:right-10 md:right-14 lg:right-20 z-30 pointer-events-none"
              >
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-start justify-between lg:justify-center gap-6 md:gap-7">
                  {/* LEFT COLUMN: TITLE + BADGES */}
                  <div className="space-y-6 text-left pointer-events-auto">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-black tracking-tight leading-[1.04] text-neutral-950">
                      A tailored process
                      <br />
                      like no other.
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1">
                      <div className="flex items-center gap-2.5">
                        <Star90Badge />
                        <span className="text-xs sm:text-sm font-bold text-neutral-900 whitespace-nowrap">
                          90-minute inspections
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <ShieldCheckBadge />
                        <span className="text-xs sm:text-sm font-bold text-neutral-900 whitespace-nowrap">
                          10+ inspection experts
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <CardoraCertifiedBadge />
                        <span className="text-xs sm:text-sm font-bold text-neutral-900 whitespace-nowrap">
                          Cardora Certified
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: VIDEO CARD */}
                  <div className="pointer-events-auto flex-shrink-0 self-start lg:self-center">
                    <div className="relative rounded-2xl md:rounded-3xl border-[3px] border-white shadow-2xl shadow-neutral-900/15 overflow-hidden w-full max-w-[340px] sm:max-w-[390px] md:max-w-[430px] aspect-[16/10] bg-neutral-900 group">
                      <video
                        src="/intro.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => setIsTourModalOpen(true)}
                        className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-[#ff2a5f] hover:bg-[#ff144f] text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full flex items-center gap-2 shadow-lg shadow-pink-600/35 transition-all hover:scale-105 active:scale-95 cursor-pointer pointer-events-auto"
                      >
                        <span className="w-0 h-0 border-y-[4.5px] border-y-transparent border-l-[7.5px] border-l-white inline-block ml-0.5" />
                        Take the Cardora tour
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ---------------- SECTION 2: HANDPICKED QUALITY (FRAMES 74 - 123) ---------------- */}
          <AnimatePresence>
            {showCanadaHandpick && (
              <motion.div
                key="canada-handpick-overlay"
                initial={{ opacity: 0, x: 40, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute z-30 pointer-events-none select-none text-left top-32 md:top-1/2 md:-translate-y-1/2 right-6 sm:right-10 md:right-16 lg:right-24 xl:right-32 max-w-[320px] sm:max-w-md md:max-w-lg lg:max-w-xl"
              >
                <div className="space-y-3 md:space-y-4">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.06] text-neutral-950">
                    We handpick the
                    <br />
                    highest quality
                    <br />
                    cars in Canada.
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base font-medium leading-relaxed text-neutral-700 max-w-md">
                    Our team is meticulous, and only the best make it to our website.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ---------------- SECTION 3: PRO TEST DRIVERS (FRAMES 150 - 212) ---------------- */}
          <AnimatePresence>
            {showProTestDrivers && (
              <motion.div
                key="pro-test-drivers-overlay"
                initial={{ opacity: 0, x: -40, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -40, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute z-30 pointer-events-none select-none text-left top-28 md:top-1/2 md:-translate-y-1/2 left-6 sm:left-10 md:left-14 lg:left-20 xl:left-24 max-w-[320px] sm:max-w-md md:max-w-lg space-y-4 md:space-y-5"
              >
                <div className="space-y-2 md:space-y-3">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.06] text-neutral-950">
                    Your personal
                    <br />
                    pro test drivers.
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base font-medium leading-relaxed text-neutral-700 max-w-sm sm:max-w-md">
                    We get behind the wheel to road test every aspect of the driver experience.
                  </p>
                </div>

                {/* Video Card playing car.mp4 */}
                <div className="pointer-events-auto w-[240px] sm:w-[280px] md:w-[320px] aspect-[16/10] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border-[3px] border-white bg-neutral-900">
                  <video
                    src="/car.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ---------------- SECTION 4: FORENSIC INSPECTION (FRAMES 342 - 388) ---------------- */}
          <AnimatePresence>
            {showForensicInspection && (
              <motion.div
                key="forensic-inspection-overlay"
                initial={{ opacity: 0, x: 40, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute z-30 pointer-events-none select-none text-left top-1/2 -translate-y-1/2 right-6 sm:right-10 md:right-14 lg:right-20 xl:right-28 max-w-[320px] sm:max-w-md md:max-w-[440px] space-y-4 md:space-y-5"
              >
                <div className="space-y-2 md:space-y-3">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.05] text-white">
                    90+ minutes,
                    <br />
                    10 experts and
                    <br />
                    a mechanical
                    <br />
                    hoist.
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base font-normal leading-relaxed text-white/90 max-w-sm sm:max-w-md">
                    Nothing escapes our forensic inspection process.
                  </p>
                </div>

                {/* Video Card playing car.mp4 */}
                <div className="pointer-events-auto w-[260px] sm:w-[320px] md:w-[380px] lg:w-[420px] aspect-[16/10] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-neutral-900 border border-white/10">
                  <video
                    src="/car.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ---------------- SECTION 5: RECONDITIONED SPECIALISTS (FRAMES 418 - 475) ---------------- */}
          <AnimatePresence>
            {showReconditioned && (
              <motion.div
                key="reconditioned-specialists-overlay"
                initial={{ opacity: 0, x: -40, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -40, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute z-30 pointer-events-none select-none text-left top-1/2 -translate-y-1/2 left-6 sm:left-10 md:left-14 lg:left-20 xl:left-28 max-w-[320px] sm:max-w-md md:max-w-[460px] space-y-4 md:space-y-6"
              >
                <div className="space-y-2 md:space-y-3">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.05] text-neutral-950">
                    Reconditioned
                    <br />
                    by our team of
                    <br />
                    specialists.
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base font-normal leading-relaxed text-neutral-800 max-w-sm sm:max-w-md">
                    From testing to fine-tuning, we get it done to our exacting standards.
                  </p>
                </div>

                {/* Video Card playing car.mp4 */}
                <div className="pointer-events-auto w-[260px] sm:w-[320px] md:w-[380px] lg:w-[420px] aspect-[16/10] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-neutral-900 border border-neutral-200/60">
                  <video
                    src="/car.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ---------------- SECTION 6: SHOWROOM FINISHING TOUCHES (FRAMES 665 - 749) ---------------- */}
          <AnimatePresence>
            {showFinishingTouches && (
              <motion.div
                key="finishing-touches-overlay"
                initial={{ opacity: 0, x: 40, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute z-30 pointer-events-none select-none text-left top-1/2 -translate-y-1/2 right-6 sm:right-10 md:right-14 lg:right-20 xl:right-28 max-w-[320px] sm:max-w-md md:max-w-[460px] space-y-4 md:space-y-6"
              >
                <div className="space-y-2 md:space-y-3">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.05] text-neutral-950">
                    The finishing
                    <br />
                    touches to
                    <br />
                    showroom-
                    <br />
                    standard.
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base font-normal leading-relaxed text-neutral-800 max-w-sm sm:max-w-md">
                    Deodorising, vacuuming, washing, waxing and buffing. So every car feels like new.
                  </p>
                </div>

                {/* Video Card playing car.mp4 */}
                <div className="pointer-events-auto w-[260px] sm:w-[320px] md:w-[380px] lg:w-[420px] aspect-[16/10] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-neutral-900 border border-neutral-200/60">
                  <video
                    src="/car.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* FULLSCREEN CARDORA TOUR VIDEO MODAL */}
      <AnimatePresence>
        {isTourModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-8"
            onClick={() => setIsTourModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden border border-white/20 shadow-2xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsTourModalOpen(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center text-lg font-bold transition-all cursor-pointer"
              >
                ✕
              </button>
              <video
                src="/intro.mp4"
                autoPlay
                controls
                playsInline
                className="w-full h-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CARDORA QUALITY SECTION (FINAL SECTION BEFORE SITE FOOTER) ── */}
      <section className="relative z-30 bg-[#FAFAF8] text-[#161616] py-10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Top Left: Video / Large Hero Card */}
            <div className="relative rounded-3xl overflow-hidden min-h-[560px] bg-neutral-900 flex flex-col justify-end p-8 md:p-10">
              <div className="pointer-events-auto flex-shrink-0 self-start lg:self-center">
                <video
                  src="/intro.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover absolute inset-0 rounded-3xl"
                />
              </div>
              <div className="relative z-10 flex flex-col items-start gap-4">
                <h1 className="text-3xl md:text-5xl font-bold text-white leading-[1.1] max-w-sm">
                  From our experts to your driveway
                </h1>
                <button
                  onClick={() => setIsTourModalOpen(true)}
                  className="bg-[#ff2a5f] hover:bg-[#ff144f] text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full flex items-center gap-2 shadow-lg shadow-pink-600/35 transition-all hover:scale-105 active:scale-95 cursor-pointer pointer-events-auto mt-1"
                >
                  <span className="w-0 h-0 border-y-[4.5px] border-y-transparent border-l-[7.5px] border-l-white inline-block ml-0.5" />
                  Take the Cardora tour
                </button>
              </div>
            </div>

            {/* Top Right: Diagonal Cut Image Card */}
            <div className="relative rounded-3xl overflow-hidden bg-white border border-black/[0.06] flex flex-col">
              {/* Angled Image Header */}
              <div className="relative h-64 md:h-72 overflow-hidden [clip-path:polygon(0_0,_100%_0,_100%_78%,_0_100%)]">
                <img
                  src={q3?.src}
                  alt="Dealership"
                  className="w-full h-full object-cover"
                />
                {/* Badge */}
                <div className="absolute top-5 left-5 w-16 h-16 rounded-full bg-white shadow-md flex flex-col items-center justify-center text-center text-[8px] font-bold tracking-tight text-[#161616] border border-black/5 leading-tight">
                  <span>CERTIFIED</span>
                  <span className="text-[10px] text-blue-600">DEALER</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 pt-4 flex-1 flex flex-col justify-center">
                <h3 className="text-xl md:text-2xl font-bold mb-3 leading-snug">
                  Cardora is the exclusive certified dealer for every model we carry
                </h3>
                <p className="text-xs md:text-sm text-[#161616]/70 leading-relaxed">
                  Every step of our process is measured against the highest industry benchmarks — from inspection and reconditioning to final quality assurance.
                </p>
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
            {/* Card 1: Find your own Cardora car */}
            <div className="relative rounded-[28px] overflow-hidden min-h-[340px] md:min-h-[380px] flex items-center p-3 md:p-4">
              {/* Full Background Image */}
              <img
                src={q1?.src}
                alt="Find your own Cardora car"
                className="absolute inset-0 w-full h-full"
              />

              {/* Floating Angled White Card */}
              <div className="relative z-10 bg-white/95 rounded-2xl h-full w-full sm:w-[75%] md:w-[65%] lg:w-[68%] p-6 md:p-8 flex flex-col justify-between [clip-path:polygon(0_0,_100%_0,_84%_100%,_0_100%)] pr-12 md:pr-16 shadow-sm">
                <div className="max-w-[280px]">
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[#161616] mb-2 leading-tight">
                    Find your own<br />Cardora car
                  </h3>
                  <p className="text-xs md:text-sm text-[#161616]/75 leading-relaxed font-normal">
                    With unbeatable quality and the peace of mind of 7-day returns, there’s simply no better way to buy a used car. Start your search today.
                  </p>
                </div>

                <div className="pt-6">
                  <a
                    href="/inventory"
                    className="inline-block px-5 py-2.5 rounded-xl border border-brand text-xs font-semibold text-brand hover:bg-brand hover:text-white transition-all duration-200"
                  >
                    Browse all cars
                  </a>
                </div>
              </div>
            </div>

            {/* Card 2: Our quality standards */}
            <div className="relative rounded-[28px] overflow-hidden min-h-[340px] md:min-h-[380px] flex items-center p-3 md:p-4 bg-[#EDE8E4]">
              {/* Full Background Image */}
              <img
                src={q2?.src}
                alt="Our quality standards"
                className="absolute inset-0 w-full h-full"
              />

              {/* Floating Angled Warm-White Card */}
              <div className="relative z-10 bg-[#FAF8F5]/95 rounded-2xl h-full w-full sm:w-[75%] md:w-[65%] lg:w-[68%] p-6 md:p-8 flex flex-col justify-between [clip-path:polygon(0_0,_100%_0,_84%_100%,_0_100%)] pr-12 md:pr-16 shadow-sm">
                <div className="max-w-[280px]">
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[#161616] mb-2 leading-tight">
                    Our quality standards
                  </h3>
                  <p className="text-xs md:text-sm text-[#161616]/75 leading-relaxed font-normal">
                    See how our verified inspection and reconditioning processes prepare every car to a higher standard.
                  </p>
                </div>

                <div className="pt-6">
                  <a
                    href="/service"
                    className="inline-block px-5 py-2.5 rounded-xl border border-brand text-xs font-semibold text-brand hover:bg-brand hover:text-white transition-all duration-200"
                  >
                    Find out more
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
