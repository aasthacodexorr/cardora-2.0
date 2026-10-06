"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import q1 from "@/assets/cars/quality-1.png";
import q2 from "@/assets/cars/quality-2.png";
import q3 from "@/assets/cars/quality-3.png";
import q1Mobile from "@/assets/cars/quality-mobile.png";

const SCENES = [
  { id: 1, name: "SCENE 01 // SHOWROOM QUALITY STANDARD" },
  { id: 2, name: "SCENE 02 // AERODYNAMIC CHASSIS & AIRFLOW" },
  { id: 3, name: "SCENE 03 // COCKPIT TELEMETRY & INTERIOR" },
  { id: 4, name: "SCENE 04 // POWERTRAIN & MECHANICAL" },
  { id: 5, name: "SCENE 05 // VELOCITY DYNAMICS & STABILITY" },
  { id: 6, name: "SCENE 06 // TITANIUM EXHAUST & ACCELERATION" },
];

const TOTAL_FRAMES = 750;
// Fraction of viewport height to push portrait (mobile) frames upward, on the hero screen only
const PORTRAIT_SHIFT_UP = 0.06;
// Shift is held in full until this frame, then eases to 0 by the end frame (next scene starts at 74)
const PORTRAIT_SHIFT_HOLD_FRAME = 25;
const PORTRAIT_SHIFT_END_FRAME = 45;
// How softly the frame sequence follows the scroll position (seconds to close ~63% of the gap);
// higher = smoother/floatier, lower = snappier
const SCROLL_EASE_SECONDS = 0.12;
// Colour of the empty space under the lifted frame on the hero screen (match the floor)
const PORTRAIT_FILL_COLOR = "#ffffff";

// Media CDN. ImageKit holds the complete final frame sets (number plate, wall logo and shirt prints
// removed): desktop frames in desktop_media/, portrait (mobile) frames in Portrait_Media/.
// Set USE_BUNNY_CDN to true to serve all media from Bunny CDN instead (same final set uploaded there).
const USE_BUNNY_CDN = false;
const BUNNY_CDN = "https://zweb-local.b-cdn.net/cardora";
const IMAGEKIT = "https://ik.imagekit.io/c1dpz1c7j";

// The final frames overwrote files ImageKit had already cached, so a version query makes the CDN fetch
// the new files without purging every URL. Bump it whenever frames are re-uploaded over existing ones.
const FRAME_VERSION = "final2";

// Hero badge icons
const ICON_BASE = USE_BUNNY_CDN ? `${BUNNY_CDN}/icons` : "/icons";

// 1920x1080 file with the picture letterboxed to 1920x820: every video box uses aspect-[16/12] lg:aspect-[16/9]
// with object-cover, so exactly the black bars are cropped and none of the picture
const CARDORA_VIDEO_CDN = USE_BUNNY_CDN
  ? `${BUNNY_CDN}/video/video_asset_cardora.mp4`
  : `${IMAGEKIT}/Video_assets/video_asset_cardora.mp4`;

function getFrameUrl(index: number, portrait = false) {
  // Frames exist up to seq_00749, safely clamp so frame 750 resolves without 404
  const frameNumber = Math.min(749, Math.max(1, index + 1));
  const seqNum = String(frameNumber).padStart(5, "0");
  if (USE_BUNNY_CDN) {
    return `${BUNNY_CDN}/frames/${portrait ? "portrait" : "desktop"}/seq_${seqNum}.webp`;
  }
  // Portrait (mobile) screens use the separately rendered portrait sequence
  const folder = portrait ? "Portrait_Media" : "desktop_media";
  return `${IMAGEKIT}/${folder}/seq_${seqNum}.webp?v=${FRAME_VERSION}`;
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
  const [showQualitySection, setShowQualitySection] = useState(false);

  // Master frame cache & dynamic top boundary colors
  const framesRef = useRef<(HTMLImageElement | null)[]>([]);
  const topColorsRef = useRef<(string | null)[]>([]);
  const isFrameCachedRef = useRef(false);
  // Frame the scroll engine is currently showing, so the loader can stream frames around it first
  const currentFrameRef = useRef(0);

  // Portrait (mobile) frames detection on phone-sized portrait viewport
  const [usePortraitFrames, setUsePortraitFrames] = useState<boolean | null>(null);
  useEffect(() => {
    const decide = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setUsePortraitFrames(w < 768 && h > w);
    };
    decide();
    window.addEventListener("resize", decide);
    window.addEventListener("orientationchange", decide);
    return () => {
      window.removeEventListener("resize", decide);
      window.removeEventListener("orientationchange", decide);
    };
  }, []);

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
    if (usePortraitFrames === null) return;
    let isMounted = true;
    const frames: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);
    const topColors: (string | null)[] = new Array(TOTAL_FRAMES).fill(null);
    framesRef.current = frames;
    topColorsRef.current = topColors;

    const sampleCanvas = document.createElement("canvas");
    sampleCanvas.width = 1;
    sampleCanvas.height = 1;
    const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });

    const usePortrait = usePortraitFrames;

    const loadSingleFrame = (idx: number, priority: "high" | "low" = "high"): Promise<boolean> => {
      return new Promise((resolve) => {
        if (frames[idx]) {
          resolve(true);
          return;
        }
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.decoding = "async";
        img.fetchPriority = priority;
        img.src = getFrameUrl(idx, usePortrait);

        img.onload = async () => {
          // Decode off main thread before frame can be drawn so scrolling remains liquid smooth
          try {
            await img.decode();
          } catch { }
          if (!isMounted) {
            resolve(false);
            return;
          }
          frames[idx] = img;
          try {
            if (sampleCtx) {
              sampleCtx.drawImage(
                img,
                Math.floor((img.naturalWidth || 1920) / 2),
                4,
                1,
                1,
                0,
                0,
                1,
                1
              );
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

    // High-performance streaming: Critical frames first, nearest remaining frames streamed dynamically
    async function loadAllFrames() {
      try {
        const runQueue = async (indices: number[], concurrency: number, priority: "high" | "low") => {
          let currentIndex = 0;
          const workers = Array.from({ length: concurrency }, async () => {
            while (currentIndex < indices.length && isMounted) {
              const idx = indices[currentIndex++];
              await loadSingleFrame(idx, priority);
            }
          });
          await Promise.all(workers);
        };

        // Phase 1: Critical start frames (0..24) loaded first so initial scene is razor sharp immediately
        const criticalIndices: number[] = [];
        for (let i = 0; i < 25; i++) criticalIndices.push(i);
        await runQueue(criticalIndices, 8, "high");
        if (!isMounted) return;

        // Background streaming starts only once document is complete and idle
        await new Promise<void>((resolve) => {
          if (document.readyState === "complete") resolve();
          else window.addEventListener("load", () => resolve(), { once: true });
        });
        await new Promise<void>((resolve) => {
          if ("requestIdleCallback" in window) {
            window.requestIdleCallback(() => resolve(), { timeout: 1000 });
          } else {
            setTimeout(resolve, 200);
          }
        });
        if (!isMounted) return;

        // Phase 2: Stream remaining frames picking nearest to where user is scrolling
        const requested = new Uint8Array(TOTAL_FRAMES);
        for (const i of criticalIndices) requested[i] = 1;
        const nextNearest = (): number => {
          const cur = currentFrameRef.current;
          for (let offset = 0; offset < TOTAL_FRAMES; offset++) {
            const ahead = cur + offset;
            if (ahead < TOTAL_FRAMES && !requested[ahead]) return ahead;
            const behind = cur - Math.ceil(offset / 2);
            if (behind >= 0 && !requested[behind]) return behind;
          }
          return -1;
        };
        const streamWorkers = Array.from({ length: 12 }, async () => {
          while (isMounted) {
            const idx = nextNearest();
            if (idx < 0) break;
            requested[idx] = 1;
            const nearUser = Math.abs(idx - currentFrameRef.current) < 30;
            await loadSingleFrame(idx, nearUser ? "high" : "low");
          }
        });
        await Promise.all(streamWorkers);
        if (!isMounted) return;

        isFrameCachedRef.current = true;
      } catch (err) {
        console.error("Frame sequence loader error", err);
      }
    }

    loadAllFrames();

    return () => {
      isMounted = false;
    };
  }, [usePortraitFrames]);

  // Canvas resize handler with capped DPR to match source resolution
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const portrait = w < 768 && h > w;
        const srcW = portrait ? 1080 : 1920;
        const srcH = portrait ? 1920 : 1080;
        const dpr = Math.min(window.devicePixelRatio || 1, Math.max(1, srcW / w, srcH / h));
        const pw = Math.round(w * dpr);
        const ph = Math.round(h * dpr);
        if (canvasRef.current.width !== pw) canvasRef.current.width = pw;
        if (canvasRef.current.height !== ph) canvasRef.current.height = ph;
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
    let qualityRevealTimer: ReturnType<typeof setTimeout> | null = null;
    let qualityRevealStarted = false;

    // Track previously drawn frame, canvas dimensions and topColor to prevent unnecessary canvas repainting
    let lastDrawnImg: HTMLImageElement | null = null;
    let lastDrawnW = -1;
    let lastDrawnH = -1;
    let lastDrawnTopColor = "";
    let lastDrawnShift = -1;
    let lastTime = performance.now();



    const renderLoop = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");



      // Calculate scroll progress relative to the animation track
      const track = trackRef.current;
      const scrollDistance = track
        ? Math.max(1, track.offsetHeight - window.innerHeight)
        : window.innerHeight * 8;
      const currentScroll = Math.max(0, window.scrollY);
      targetProgress = Math.min(1, Math.max(0, currentScroll / scrollDistance));

      // Time-based exponential easing: glides smoothly across 60Hz and 120Hz screens
      const now = performance.now();
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;
      const diff = targetProgress - smoothProgress;
      if (Math.abs(diff) > 0.00005) {
        smoothProgress += diff * (1 - Math.exp(-dt / SCROLL_EASE_SECONDS));
      } else {
        smoothProgress = targetProgress;
      }

      // Direct linear continuous frame mapping
      const targetFrameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.floor(smoothProgress * (TOTAL_FRAMES - 1)))
      );
      const currentFrameNumber = targetFrameIndex + 1;

      // Update current frame pointer so loader streams upcoming frames first
      currentFrameRef.current = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.floor(targetProgress * (TOTAL_FRAMES - 1)))
      );

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

      // Wait until final breakpoint is reached, then reveal Cardora Quality section smoothly
      if (step >= 5 && !qualityRevealStarted && !qualityRevealTimer) {
        qualityRevealTimer = setTimeout(() => {
          qualityRevealStarted = true;
          setShowQualitySection(true);
          qualityRevealTimer = null;
        }, 1000);
      } else if (step < 5) {
        if (qualityRevealTimer) {
          clearTimeout(qualityRevealTimer);
          qualityRevealTimer = null;
        }

        if (qualityRevealStarted) {
          qualityRevealStarted = false;
          setShowQualitySection(false);
        }
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

        // 1 on the hero screen, easing down to 0 as the next scene begins
        const shiftT =
          currentFrameNumber <= PORTRAIT_SHIFT_HOLD_FRAME
            ? 1
            : currentFrameNumber >= PORTRAIT_SHIFT_END_FRAME
              ? 0
              : 1 -
              (currentFrameNumber - PORTRAIT_SHIFT_HOLD_FRAME) /
              (PORTRAIT_SHIFT_END_FRAME - PORTRAIT_SHIFT_HOLD_FRAME);
        const portraitShiftPx = Math.round(canvas.height * PORTRAIT_SHIFT_UP * shiftT);

        // Avoid repainting canvas every tick if frame, canvas size or top color haven't changed
        const needsDraw =
          img &&
          (img !== lastDrawnImg ||
            canvas.width !== lastDrawnW ||
            canvas.height !== lastDrawnH ||
            topColor !== lastDrawnTopColor ||
            portraitShiftPx !== lastDrawnShift);

        if (img && needsDraw) {
          lastDrawnImg = img;
          lastDrawnW = canvas.width;
          lastDrawnH = canvas.height;
          lastDrawnTopColor = topColor;
          lastDrawnShift = portraitShiftPx;

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
           let portraitFadeTop = -1;

          if (cAspect > 1.0) {
           
            // Desktop view (landscape / widescreen) -> full screen cover scaling
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
          } else if (vAspect < 1 && cAspect <= 1) {
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
           

            // Hero screen only: lift the picture, then fill the strip that opens at the bottom
     // Hero screen only: lift the picture; the gap is covered after drawing
drawY -= portraitShiftPx;
portraitFadeTop = drawY + drawH; // where the frame's bottom edge now sits
          } else {
            // Responsive / Mobile view with landscape frames -> video at bottom, top sampled
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

          if (portraitFadeTop >= 0 && portraitFadeTop < cHeight) {
  // Soft fade of the frame's bottom edge into the fill colour
  const fadeH = Math.min(cHeight * 0.1, portraitFadeTop);
  const g = ctx.createLinearGradient(0, portraitFadeTop - fadeH, 0, portraitFadeTop);
  g.addColorStop(0, "rgba(255,255,255,0)");
  g.addColorStop(1, PORTRAIT_FILL_COLOR);
  ctx.fillStyle = g;
  ctx.fillRect(0, portraitFadeTop - fadeH, cWidth, fadeH);

  // Solid fill below the frame
  ctx.fillStyle = PORTRAIT_FILL_COLOR;
  ctx.fillRect(0, portraitFadeTop, cWidth, cHeight - portraitFadeTop);
}
        }
      }

      animFrameId = requestAnimationFrame(renderLoop);
    };

    animFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animFrameId);
      if (qualityRevealTimer) {
        clearTimeout(qualityRevealTimer);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative bg-black text-white font-sans selection:bg-[#01A969] selection:text-white"
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
            className="absolute right-5 sm:right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center md:flex max-md:right-2! max-md:top-[42%]! max-md:scale-[0.55] max-md:origin-right transition-opacity duration-300"
          >
            <div className="w-[4.5px] sm:w-[5px] h-64 bg-white/40 rounded-full relative shadow-sm">
              {/* Active progress fill */}
              <div
                ref={scrollBarRef}
                className="w-full bg-[#01A969] rounded-full shadow-[0_0_10px_rgba(1,169,105,0.7)]"
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
                      const scrollDistance = track
                        ? track.offsetHeight - window.innerHeight
                        : window.innerHeight * 8;
                      const targetScroll = (bp.scrollPct / 100) * scrollDistance;
                      window.scrollTo({ top: targetScroll, behavior: "smooth" });
                    }}
                    className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 group flex items-center justify-center cursor-pointer pointer-events-auto"
                    style={{ top: `${bp.displayPct}%` }}
                  >
                    {/* Breakpoint Dot matching Cardora design */}
                    {isActive ? (
                      <div className="w-4 h-4 rounded-full bg-[#01A969] border-[2.5px] border-white shadow-[0_0_10px_rgba(1,169,105,0.8)] flex items-center justify-center transition-all duration-300 ring-2 ring-[#01A969]/40" />
                    ) : isCompleted ? (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#01A969] shadow-sm transition-all duration-300" />
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
                className="absolute top-1 sm:top-14 lg:top-[18.5vh] left-6 sm:left-10 lg:left-[10vw] right-6 sm:right-10 lg:right-[7.4vw] z-30 pointer-events-none max-md:left-5! max-md:right-5!"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 max-md:gap-5!">
                  {/* LEFT COLUMN: TITLE + BADGES */}
                  <div className="text-left pointer-events-auto max-md:text-center">
                    <h1 className="text-[clamp(2.5rem,6.05vw,5rem)] font-black leading-[0.95] tracking-[-0.022em] text-[#0e0b1f] max-md:text-[36px]! max-md:leading-[0.98]!">
                      A tailored process
                      <br />
                      like no other.
                    </h1>

                    <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-x-[clamp(1.25rem,2.2vw,2.5rem)] gap-y-3 mt-[clamp(1.5rem,3vw,2.75rem)] max-md:flex-row! max-md:flex-nowrap! max-md:items-start! max-md:justify-between! max-md:gap-x-2! max-md:mt-4!">
                      {[
                        {
                          icon: (
                            <img
                              src={`${ICON_BASE}/illustration-inspections.svg`}
                              alt=""
                              className="w-full h-full"
                            />
                          ),
                          label: "90-minute inspections",
                        },
                        {
                          icon: (
                            <img
                              src={`${ICON_BASE}/illustration-experts.svg`}
                              alt=""
                              className="w-full h-full"
                            />
                          ),
                          label: "10+ inspection experts",
                        },
                        {
                          icon: (
                            <img
                              src={`${ICON_BASE}/illustration-certified.svg`}
                              alt=""
                              className="w-full h-full"
                            />
                          ),
                          label: "Cardora Certified",
                        },
                      ].map(({ icon, label }) => (
                        <div
                          key={label}
                          className="flex items-center gap-[clamp(0.6rem,1vw,1rem)] max-md:flex-1 max-md:flex-col! max-md:gap-2!"
                        >
                          <div className="w-[clamp(2.75rem,3.8vw,3.75rem)] max-md:w-10! aspect-square rounded-full bg-[#0e0b1f]/[0.045] flex items-center justify-center flex-shrink-0">
                            <div className="w-[82%] h-[82%] flex items-center justify-center">
                              {icon}
                            </div>
                          </div>
                          <span className="text-[clamp(0.85rem,1.1vw,1.1rem)] font-normal text-[#1b1a2a] whitespace-nowrap max-md:whitespace-normal! max-md:text-[14px]! max-md:leading-[1.3] max-md:text-center">
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT COLUMN: VIDEO CARD */}
                  <div className="pointer-events-auto flex-shrink-0 self-start lg:mt-[0.5vw] max-md:self-stretch!">
                    <div className="relative rounded-[clamp(1rem,1.5vw,1.5rem)] bg-white p-[clamp(5px,0.5vw,8px)] shadow-[0_2px_14px_rgba(14,11,31,0.08)] ring-1 ring-[#0e0b1f]/[0.06] w-[clamp(280px,27.6vw,520px)] max-md:w-full!">
                      <div className="relative rounded-2xl   md:rounded-3xl overflow-hidden aspect-[16/10] lg:aspect-[16/9] bg-neutral-900 max-md:rounded-2xl!">
                        <video
                          src={CARDORA_VIDEO_CDN}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => setIsTourModalOpen(true)}
                          className="absolute bottom-[6%] right-[3.5%] bg-gradient-to-r from-[#01A969] to-[#018f59] hover:from-[#02b874] hover:to-[#01A969] text-white text-lg lg:text-[clamp(0.7rem,0.85vw,0.95rem)] font-semibold px-[clamp(0.7rem,1vw,1.1rem)] py-2 lg:py-[clamp(0.4rem,0.6vw,0.65rem)] rounded-[clamp(0.5rem,0.7vw,0.75rem)] flex items-center gap-[clamp(0.4rem,0.6vw,0.65rem)] shadow-md shadow-[#01A969]/25 transition-all hover:scale-[1.03] active:scale-95 cursor-pointer pointer-events-auto"
                        >
                          <span className="w-0 h-0 border-y-[0.42em] border-y-transparent border-l-[0.7em] border-l-white inline-block" />
                          Take the Cardora tour
                        </button>
                      </div>
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
                className="absolute z-30 pointer-events-none text-left top-28 sm:top-32 md:top-1/2 md:-translate-y-1/2 right-6 sm:right-10 md:right-16 lg:right-24 xl:right-32 max-w-[320px] sm:max-w-md md:max-w-lg lg:max-w-xl max-md:left-5! max-md:right-5! max-md:translate-y-0! max-md:max-w-none!"
              >
                <div className="space-y-3 md:space-y-4">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.06] text-neutral-950 max-md:text-[32px]! max-md:leading-[1]! max-md:tracking-[-0.02em]!">
                    We handpick the <br className="max-md:hidden" />
                    highest quality <br className="max-md:hidden" />
                    cars in Canada.
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base font-medium leading-relaxed text-neutral-700 max-w-md max-md:text-[15px]! max-md:font-normal! max-md:leading-[1.4]! max-md:max-w-none! max-md:mt-2! max-md:text-[#1b1a2a]!">
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
                className="absolute z-30 pointer-events-none text-left top-28 sm:top-24 md:top-1/2 md:-translate-y-1/2 left-6 sm:left-10 md:left-14 lg:left-20 xl:left-24 max-w-[320px] sm:max-w-md md:max-w-lg space-y-4 md:space-y-5 max-md:left-5! max-md:right-5! max-md:translate-y-0! max-md:max-w-none!"
              >
                <div className="space-y-2 md:space-y-3">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.06] text-neutral-950 max-md:text-[28px]! max-md:leading-[1]! max-md:tracking-[-0.02em]!">
                    Your personal
                    pro test drivers.
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base font-medium leading-relaxed text-neutral-700 max-w-sm sm:max-w-md max-md:text-[15px]! max-md:font-normal! max-md:leading-[1.4]! max-md:max-w-none! max-md:mt-2! max-md:text-[#1b1a2a]!">
                    We get behind the wheel to road test every aspect of the driver experience.
                  </p>
                </div>

                {/* Video Card */}
                <div className="pointer-events-auto w-[240px] sm:w-[280px] md:w-[420px] aspect-[16/7] lg:aspect-[16/9] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border-[3px] border-white bg-white p-1 max-md:w-full! max-md:rounded-2xl! max-md:border-0! max-md:shadow-none! max-md:mt-4!">
                  <video
                    src={CARDORA_VIDEO_CDN}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-2xl md:rounded-3xl"
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
                className="absolute z-30 pointer-events-none text-left top-28 md:top-1/2 -translate-y-1/2 right-6 sm:right-10 md:right-14 lg:right-20 xl:right-28 max-w-[320px] sm:max-w-md md:max-w-[440px] space-y-4 md:space-y-5 max-md:left-5! max-md:right-5! max-md:translate-y-0! max-md:max-w-none!"
              >
                <div className="space-y-2 md:space-y-3 lg:mt-6">
                  <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.05] text-white max-md:text-[28px]! max-md:leading-[1]! max-md:tracking-[-0.02em]!">
                    90+ minutes, <br className="max-md:hidden" />
                    10 experts and <br className="max-md:hidden" />
                    a mechanical <br className="max-md:hidden" />
                    hoist.
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base font-normal leading-relaxed text-white/90 max-w-sm sm:max-w-md max-md:text-[15px]! max-md:font-normal! max-md:leading-[1.4]! max-md:max-w-none! max-md:mt-2!">
                    Nothing escapes our forensic inspection process.
                  </p>
                </div>

                {/* Video Card */}
                <div className="pointer-events-auto bg-white p-1 w-[260px] sm:w-[320px] md:w-[380px] lg:w-[420px] aspect-[16/8] lg:aspect-[16/9] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/10 max-md:w-full! max-md:rounded-2xl! max-md:border-0! max-md:shadow-none! max-md:mt-4!">
                  <video
                    src={CARDORA_VIDEO_CDN}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-2xl md:rounded-3xl"
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
                className="absolute z-30 pointer-events-none text-left top-28 md:top-1/2 -translate-y-1/2 left-6 sm:left-10 md:left-14 lg:left-20 xl:left-28 max-w-[320px] sm:max-w-md md:max-w-[460px] space-y-4 md:space-y-6 max-md:left-5! max-md:right-5! max-md:translate-y-0! max-md:max-w-none!"
              >
                <div className="space-y-2 md:space-y-3 lg:mt-6">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.05] text-neutral-950 max-md:text-[26px]! max-md:leading-[1]! max-md:tracking-[-0.02em]!">
                    Reconditioned <br className="max-md:hidden" />
                    by our team of <br className="max-md:hidden" />
                    specialists.
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base font-normal leading-relaxed text-neutral-800 max-w-sm sm:max-w-md max-md:text-[15px]! max-md:font-normal! max-md:leading-[1.4]! max-md:max-w-none! max-md:mt-2! max-md:text-[#1b1a2a]!">
                    From testing to fine-tuning, we get it done to our exacting standards.
                  </p>
                </div>

                {/* Video Card */}
                <div className="pointer-events-auto w-[260px] sm:w-[320px] md:w-[380px] lg:w-[420px] aspect-[16/7] lg:aspect-[16/9] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-white p-1 border border-neutral-200/60 max-md:w-full! max-md:rounded-2xl! max-md:border-0! max-md:shadow-none! max-md:mt-4!">
                  <video
                    src={CARDORA_VIDEO_CDN}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-2xl md:rounded-3xl"
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
                className="absolute z-30 pointer-events-none text-left top-28 md:top-[370px] -translate-y-1/2 right-6 sm:right-10 md:right-14 lg:right-20 xl:right-28 max-w-[320px] sm:max-w-md md:max-w-[460px] space-y-4 md:space-y-6 max-md:left-5! max-md:right-5! max-md:translate-y-0! max-md:max-w-none!"
              >
                <div className="space-y-2 md:space-y-3">
                  <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.05] text-neutral-950 max-md:text-[28px]! max-md:leading-[1]! max-md:tracking-[-0.02em]!">
                    The finishing <br className="max-md:hidden" />
                    touches to <br className="max-md:hidden" />
                    showroom- <br className="max-md:hidden" />
                    standard.
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base font-normal leading-relaxed text-neutral-800 max-w-sm sm:max-w-md max-md:text-[15px]! max-md:font-normal! max-md:leading-[1.4]! max-md:max-w-none! max-md:mt-2! max-md:text-[#1b1a2a]!">
                    Deodorising, vacuuming, washing, waxing and buffing. So every car feels like new.
                  </p>
                </div>

                {/* Video Card */}
                <div className="pointer-events-auto w-[260px] sm:w-[320px] md:w-[380px] lg:w-[420px] aspect-[16/7] lg:aspect-[16/9] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-white p-1 border border-neutral-200/60 max-md:w-full! max-md:rounded-2xl! max-md:border-0! max-md:shadow-none! max-md:mt-4!">
                  <video
                    src={CARDORA_VIDEO_CDN}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-2xl md:rounded-3xl"
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
              className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden border border-white/20 shadow-2xl aspect-[16/12] lg:aspect-[16/9]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsTourModalOpen(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center text-lg font-bold transition-all cursor-pointer"
              >
                ✕
              </button>
              <video
                src={CARDORA_VIDEO_CDN}
                autoPlay
                controls
                playsInline
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CARDORA QUALITY SECTION (FINAL SECTION BEFORE SITE FOOTER) ── */}
      {/* Reveal only after reaching the final breakpoint and waiting 1 second. */}
      <section
        className={`relative z-40 bg-[#FAFAF8] text-[#161616] py-10 shadow-[0_-18px_50px_rgba(0,0,0,0.12)] transition-[margin] duration-700 ease-out ${showQualitySection ? "-mt-[100vh]" : "mt-0"}`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 ">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Left: Video / Large Hero Card */}
            <div className="relative rounded-3xl overflow-hidden flex flex-col justify-end md:justify-start p-8 md:p-0 md:min-h-full min-h-[500px]">
              <div className="pointer-events-auto flex-shrink-0 self-start lg:self-center aspect-[16/12] lg:aspect-[16/6] w-full ">
                <video
                  src={CARDORA_VIDEO_CDN}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover absolute  inset-0 md:inset-block rounded-3xl"
                />
              </div>
              <div className="absolute z-10 flex flex-col items-start gap-4 bottom-3 lg:left-18 lg:bottom-5">
                <h2 className="text-3xl md:text-5xl font-bold text-white leading-[1.1] max-w-sm">
                  From our experts to your driveway
                </h2>
                <button
                  onClick={() => setIsTourModalOpen(true)}
                  className="bottom-[0%] lg:bottom-[8%] bg-gradient-to-r from-[#01A969] to-[#018f59] hover:from-[#02b874] hover:to-[#01A969] text-white py-1.5 lg:text-[18px] font-semibold px-4 lg:py-3 rounded-[clamp(0.5rem,0.7vw,0.75rem)] flex items-center gap-[clamp(0.4rem,0.6vw,0.65rem)] shadow-md shadow-[#01A969]/25 transition-all hover:scale-[1.03] active:scale-95 cursor-pointer pointer-events-auto"
                >
                  <span className="w-0 h-0 border-y-[0.42em] border-y-transparent border-l-[0.7em] border-l-white inline-block" />
                  Take the Cardora tour
                </button>
              </div>
            </div>

            {/* Top Right: Diagonal Cut Image Card */}
            <div className="relative rounded-3xl overflow-hidden bg-white md:min-h-full border border-black/[0.06] flex flex-col">
              {/* Angled Image Header */}
              <div className="relative h-64 md:h-[500px] overflow-hidden [clip-path:polygon(0_0,_100%_0,_100%_78%,_0_100%)]">
                <Image
                  src={q3}
                  alt="Dealership"
                  fill
                  className="object-right object-cover"
                />
                {/* Badge */}
                {/* <div className="absolute top-5 left-5 w-16 h-16 rounded-full bg-white shadow-md flex flex-col items-center justify-center text-center text-[8px] font-bold tracking-tight text-[#161616] border border-black/5 leading-tight z-10">
                <Image
                  src={"https://images.ctfassets.net/r0of6sld2ads/2RQz1zUSI5oQcI5rqRgV3M/ea278a9f2c38d307427f1b02af12ee9e/Badge_Carma_Preferred_dealership_RGB_White_w-_navy.svg"}
                  alt="Dealership"
                  fill
                  className="object-right object-cover"
                />
                </div> */}
              </div>

              {/* Content */}
              <div className="py-8 pt-4 px-4 flex-1 flex flex-col justify-center">
                <h3 className="text-xl md:text-3xl font-bold mb-3 leading-snug">
                  Cardora is the exclusive certified dealer for every model we carry
                </h3>
                <p className="text-base md:text-xl text-[#161616]/70 leading-relaxed">
                  Every step of our process is measured against the highest industry benchmarks — from inspection and reconditioning to final quality assurance.
                </p>
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6 lg:mt-32">
            {/* Card 1: Find your own Cardora car */}
            <div className="relative rounded-[20px] overflow-hidden min-h-[450px] md:min-h-[380px] flex items-end md:items-stretch p-3 md:p-4">
              {/* Mobile Background Image (q1) */}
              <Image
                src={q1Mobile}
                alt="Find your own Cardora car"
                fill
                priority
                className="object-cover object-right block md:hidden"
                sizes="100vw"
              />

              {/* Desktop Background Image (q2) */}
              <Image
                src={q1}
                alt="Find your own Cardora car"
                fill
                priority
                className="object-cover hidden md:block"
                sizes="(min-width: 768px) 50vw, 100vw"
              />

              {/* Floating White Card */}
              <div className="relative z-10 bg-white/95 rounded-[18px] md:rounded-2xl w-full sm:w-[85%] md:w-[70%] lg:w-[52%] pt-10 pb-6 px-6 md:p-5 flex flex-col justify-between [clip-path:polygon(0_0,_100%_15%,_100%_100%,_0_100%)] md:[clip-path:polygon(0_0,_100%_0,_86%_100%,_0_100%)] pr-6 md:pr-10 shadow-sm">
                <div className="lg:max-w-[290px]">
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[#161616] mb-2 leading-tight">
                    Find your own Cardora car
                  </h3>
                  <p className="text-sm md:text-base text-[#161616]/75 leading-relaxed font-normal">
                    With unbeatable quality and the peace of mind of 7-days exchange, there’s simply no better way to buy a used car. Start your search today.
                  </p>
                </div>

                <div className="pt-4 md:pt-6">
                  <Link
                    href="/inventory"
                    className="inline-block px-5 py-2.5 rounded-xl border border-brand-green text-xs lg:text-base font-semibold text-brand-green hover:bg-brand-green hover:text-white transition-all duration-200"
                  >
                    Browse all cars
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 2: Our quality standards */}
            <div className="relative rounded-[20px] overflow-hidden min-h-[450px] md:min-h-[380px] flex items-end md:items-stretch p-3 md:p-4 bg-[#EDE8E4]">
              {/* Full Background Image */}
              <Image
                src={q2}
                alt="Our quality standards"
                fill
                className="object-cover"
              />

              {/* Floating Warm-White Card */}
              <div className="relative z-10 bg-[#FAF8F5]/95 rounded-[18px] md:rounded-2xl w-full sm:w-[85%] md:w-[70%] lg:w-[50%] pt-10 pb-6 px-6 md:p-5 flex flex-col justify-between [clip-path:polygon(0_0,_100%_15%,_100%_100%,_0_100%)] md:[clip-path:polygon(0_0,_100%_0,_86%_100%,_0_100%)] pr-6 md:pr-10 shadow-sm">
                <div className="w-full">
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[#161616] mb-2 leading-tight">
                    Our quality standards
                  </h3>
                  <p className="text-sm md:text-base text-[#161616]/75 leading-relaxed font-normal">
                    See how our verified inspection and reconditioning processes prepare every car to a higher standard.
                  </p>
                </div>

                <div className="pt-4 md:pt-6">
                  <Link
                    href="/service"
                    className="inline-block px-5 py-2.5 rounded-xl border border-brand-green text-xs lg:text-base font-semibold text-brand-green hover:bg-brand-green hover:text-white transition-all duration-200"
                  >
                    Find out more
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}