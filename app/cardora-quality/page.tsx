"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Footer } from "@/components/layout";
import img1 from "@/assets/cars/car-featured-2.jpg";

const SCENES = [
  { id: 1, name: "SCENE 01 // HIGHWAY LAUNCH", src: "/scene_1.mp4", frames: 100 },
  { id: 2, name: "SCENE 02 // AERODYNAMIC CHASSIS", src: "/scene_2.mp4", frames: 100 },
  { id: 3, name: "SCENE 03 // COCKPIT TELEMETRY", src: "/scene_3.mp4", frames: 100 },
  { id: 4, name: "SCENE 04 // MAXIMUM Cardora", src: "/scene_4.mp4", frames: 100 },
  { id: 5, name: "SCENE 05 // EXHAUST SOUND & ACCELERATION", src: "/scene_5.mp4", frames: 100 },
];

const TOTAL_VIDEO_SECONDS = 50.0;
const TOTAL_SCROLL_TIMELINE_SECONDS = 58.0;

function computeTimelineState(scrollTime: number) {
  let videoTime = 0;
  let activePopup: 0 | 1 | 2 | 3 | 4 | 5 | null = null;
  let isVideoPaused = false;

  if (scrollTime <= 1.0) {
    videoTime = scrollTime;
    activePopup = 0;
  } else if (scrollTime > 1.0 && scrollTime < 3.3) {
    videoTime = scrollTime;
    activePopup = null;
  } else if (scrollTime >= 3.3 && scrollTime < 10.3) {
    videoTime = 3.3;
    activePopup = 1;
    isVideoPaused = true;
  } else if (scrollTime >= 10.3 && scrollTime < 11.3) {
    videoTime = scrollTime;
    activePopup = null;
  } else if (scrollTime >= 11.3 && scrollTime < 13.3) {
    videoTime = 11.3;
    activePopup = 2;
    isVideoPaused = true;
  } else if (scrollTime >= 13.3 && scrollTime < 22.0) {
    videoTime = scrollTime - 2.0;
    activePopup = null;
  } else if (scrollTime >= 22.0 && scrollTime < 24.0) {
    videoTime = 20.0;
    activePopup = 3;
    isVideoPaused = true;
  } else if (scrollTime >= 24.0 && scrollTime < 32.5) {
    videoTime = scrollTime - 4.0;
    activePopup = null;
  } else if (scrollTime >= 32.5 && scrollTime < 34.5) {
    videoTime = 28.5;
    activePopup = 4;
    isVideoPaused = true;
  } else if (scrollTime >= 34.5 && scrollTime < 56.0) {
    videoTime = scrollTime - 6.0;
    activePopup = null;
  } else if (scrollTime >= 56.0 && scrollTime <= 58.0) {
    videoTime = 50.0;
    activePopup = 5;
    isVideoPaused = true;
  } else {
    videoTime = 50.0;
    activePopup = null;
  }

  return { videoTime, activePopup, isVideoPaused };
}

const CONTENT_BREAKPOINTS = [
  { id: 1, label: "Inspection",       time: 3.3,  matchPopup: 1 },
  { id: 2, label: "Active Spoiler",   time: 11.3, matchPopup: 2 },
  { id: 3, label: "Digital Cockpit",  time: 22.0, matchPopup: 3 },
  { id: 4, label: "Torque Vectoring", time: 32.5, matchPopup: 4 },
  { id: 5, label: "Titanium Exhaust", time: 56.0, matchPopup: 5 },
].map((bp) => ({ ...bp, pct: (bp.time / TOTAL_SCROLL_TIMELINE_SECONDS) * 100 }));

export default function CarmaQualityPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneHudRef = useRef<HTMLSpanElement | null>(null);
  const percentHudRef = useRef<HTMLSpanElement | null>(null);
  const scrollBarRef = useRef<HTMLDivElement | null>(null);

  // Loading state — shown until all frames are extracted
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState("Fetching 5 scenes...");

  const [activePopup, setActivePopup] = useState<0 | 1 | 2 | 3 | 4 | 5 | null>(0);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isPastVideo, setIsPastVideo] = useState(false);
  const isPastVideoRef = useRef(false);

  const masterFramesRef = useRef<ImageBitmap[]>([]);
  const topColorsRef = useRef<string[]>([]);
  const isFrameCachedRef = useRef(false);

  // Reset scroll to top on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }
  }, []);

  // Lock body scroll while loading frames
  useEffect(() => {
    document.body.style.overflow = isLoading ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isLoading]);

  // Helper: wait for video metadata — guards against already-loaded race
  function waitForMetadata(video: HTMLVideoElement): Promise<void> {
    return new Promise<void>((resolve) => {
      if (video.readyState >= 1) { resolve(); return; }
      const handler = () => { video.removeEventListener("loadedmetadata", handler); resolve(); };
      video.addEventListener("loadedmetadata", handler);
    });
  }

  // Helper: seek to time — guards against stuck seeked event with 500ms fallback
  function seekTo(video: HTMLVideoElement, time: number): Promise<void> {
    return new Promise<void>((resolve) => {
      let settled = false;
      const done = () => { if (!settled) { settled = true; resolve(); } };
      const onSeeked = () => { video.removeEventListener("seeked", onSeeked); done(); };
      video.addEventListener("seeked", onSeeked);
      video.currentTime = time;
      setTimeout(done, 500);
    });
  }

  // Frame extraction — runs on mount, blocks UI via loader until done
  useEffect(() => {
    let isMounted = true;
    const objectUrls: string[] = [];

    async function loadAllScenesParallel() {
      try {
        setLoadingStatus("Fetching all 5 scenes in parallel...");

        const fetchPromises = SCENES.map(async (scene) => {
          const res = await fetch(scene.src);
          if (!res.ok) throw new Error(`Failed to fetch ${scene.src}`);
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          objectUrls.push(url);
          return { ...scene, objectUrl: url };
        });

        const loadedSceneData = await Promise.all(fetchPromises);
        if (!isMounted) return;

        setLoadProgress(20);
        setLoadingStatus("Extracting 500 GPU frames...");

        const allMasterFrames: ImageBitmap[] = [];
        const allTopColors: string[] = [];
        const totalFrames = SCENES.reduce((a, s) => a + s.frames, 0);
        let extracted = 0;

        for (let sIdx = 0; sIdx < loadedSceneData.length; sIdx++) {
          if (!isMounted) break;
          const sceneData = loadedSceneData[sIdx];

          const hiddenVideo = document.createElement("video");
          hiddenVideo.muted = true;
          hiddenVideo.playsInline = true;
          hiddenVideo.preload = "auto";
          hiddenVideo.src = sceneData.objectUrl;

          await waitForMetadata(hiddenVideo);

          const duration = hiddenVideo.duration || 5;
          const frameCount = sceneData.frames;
          const offCanvas = document.createElement("canvas");
          offCanvas.width = hiddenVideo.videoWidth || 1280;
          offCanvas.height = hiddenVideo.videoHeight || 720;
          const offCtx = offCanvas.getContext("2d");

          for (let f = 0; f < frameCount; f++) {
            if (!isMounted) break;
            await seekTo(hiddenVideo, (f / (frameCount - 1)) * duration);

            if (offCtx) {
              offCtx.drawImage(hiddenVideo, 0, 0, offCanvas.width, offCanvas.height);
              const pData = offCtx.getImageData(Math.floor(offCanvas.width / 2), 4, 1, 1).data;
              allTopColors.push(`rgb(${pData[0]}, ${pData[1]}, ${pData[2]})`);
              allMasterFrames.push(await createImageBitmap(offCanvas));
            }

            extracted++;
            if (isMounted) setLoadProgress(20 + Math.round((extracted / totalFrames) * 80));
          }
        }

        if (isMounted && allMasterFrames.length > 0) {
          masterFramesRef.current = allMasterFrames;
          topColorsRef.current = allTopColors;
          isFrameCachedRef.current = true;
          setLoadProgress(100);
          setTimeout(() => {
            if (isMounted) {
              setIsLoading(false);
              window.scrollTo(0, 0);
            }
          }, 400);
        }
      } catch (err) {
        console.error("Frame preloader error:", err);
        if (isMounted) setIsLoading(false);
      }
    }

    loadAllScenesParallel();
    return () => {
      isMounted = false;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // Canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth * window.devicePixelRatio;
        canvasRef.current.height = window.innerHeight * window.devicePixelRatio;
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll engine — only active after loading is done
  useEffect(() => {
    if (isLoading) return;

    let animFrameId: number;
    let targetProgress = 0;
    let smoothProgress = 0;
    let lastPopupState: 0 | 1 | 2 | 3 | 4 | 5 | null = null;
    let lastSceneIndex = 0;

    const renderLoop = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");

      const videoSectionHeight = window.innerHeight * 10;
      const currentScroll = Math.max(0, window.scrollY);
      targetProgress = Math.min(1, Math.max(0, currentScroll / videoSectionHeight));

      // Hide all fixed canvas/overlay elements once user scrolls past video section
      const nowPast = currentScroll >= videoSectionHeight;
      if (nowPast !== isPastVideoRef.current) {
        isPastVideoRef.current = nowPast;
        setIsPastVideo(nowPast);
        if (nowPast) setActivePopup(null);
      }

      const diff = targetProgress - smoothProgress;
      if (Math.abs(diff) > 0.0001) smoothProgress += diff * 0.35;
      else smoothProgress = targetProgress;

      const rawScrollTime = smoothProgress * TOTAL_SCROLL_TIMELINE_SECONDS;
      const { videoTime, activePopup: currentPopup } = computeTimelineState(rawScrollTime);

      const masterFrames = masterFramesRef.current;
      const totalMasterCount = masterFrames.length;
      const videoProgress = Math.min(1, Math.max(0, videoTime / TOTAL_VIDEO_SECONDS));

      const sceneIdx = Math.min(SCENES.length - 1, Math.floor(videoProgress * SCENES.length));
      if (sceneIdx !== lastSceneIndex) { lastSceneIndex = sceneIdx; setActiveSceneIndex(sceneIdx); }

      if (sceneHudRef.current) sceneHudRef.current.textContent = SCENES[sceneIdx].name;
      if (percentHudRef.current) percentHudRef.current.textContent = `${Math.round(smoothProgress * 100)}%`;
      if (scrollBarRef.current) scrollBarRef.current.style.height = `${smoothProgress * 100}%`;

      if (totalMasterCount > 0 && isFrameCachedRef.current && canvas && ctx) {
        const masterFrameIndex = Math.min(totalMasterCount - 1, Math.max(0, Math.floor(videoProgress * totalMasterCount)));
        const bitmap = masterFrames[masterFrameIndex];
        const topColor = topColorsRef.current[masterFrameIndex] || "#000000";

        if (bitmap) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const vAspect = bitmap.width / bitmap.height;
          const cAspect = canvas.width / canvas.height;
          let drawW = canvas.width, drawH = canvas.height, drawX = 0, drawY = 0;

          if (cAspect > 1.0) {
            if (cAspect > vAspect) { drawH = canvas.width / vAspect; drawY = (canvas.height - drawH) / 2; }
            else { drawW = canvas.height * vAspect; drawX = (canvas.width - drawW) / 2; }
          } else {
            const vAreaH = canvas.height * 0.75;
            const vAreaY = canvas.height * 0.25;
            ctx.fillStyle = topColor;
            ctx.fillRect(0, 0, canvas.width, vAreaY + 4);
            drawH = vAreaH; drawW = vAreaH * vAspect;
            drawX = (canvas.width - drawW) / 2; drawY = vAreaY;
            if (drawW < canvas.width) { drawW = canvas.width; drawH = canvas.width / vAspect; drawX = 0; drawY = vAreaY + (vAreaH - drawH) / 2; }
          }
          ctx.drawImage(bitmap, drawX, drawY, drawW, drawH);
        }
      }

      if (currentPopup !== lastPopupState) { lastPopupState = currentPopup; setActivePopup(currentPopup); }
      animFrameId = requestAnimationFrame(renderLoop);
    };

    animFrameId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animFrameId);
  }, [isLoading]);

  return (
    <div ref={containerRef} className="relative bg-black text-white font-sans selection:bg-cyan-500 selection:text-black">

      {/* ── LOADING SCREEN ── */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-white"
          >
            <div className="flex flex-col items-center space-y-6 max-w-sm w-full px-6">
              {/* Spinner */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping" />
                <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-cyan-400 animate-spin" />
                <span className="text-sm font-mono font-bold tracking-widest text-cyan-400">{loadProgress}%</span>
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">
                  Rendering 3D Telemetry Canvas
                </h2>
                <p className="text-xs text-gray-400 font-mono tracking-wider">{loadingStatus}</p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden border border-gray-800">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"
                  initial={{ width: "0%" }}
                  animate={{ width: `${Math.max(5, loadProgress)}%` }}
                  transition={{ duration: 0.15 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── VIDEO SCROLL SECTION (1000vh) ── */}
      <div className="relative h-[1000vh]">
        <canvas
          ref={canvasRef}
          className={`fixed inset-0 w-full h-full z-0 pointer-events-none object-cover brightness-95 contrast-105 ${isPastVideo ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        />
        <div className={`fixed inset-0 z-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/60 ${isPastVideo ? "hidden" : ""}`} />
        <div className={`fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/10 to-black/70 ${isPastVideo ? "hidden" : ""}`} />

        {/* Header */}
        <header className={`fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-black/40 border-b border-white/10 ${isPastVideo ? "hidden" : ""}`}>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_12px_#22d3ee]" />
            <span className="font-mono text-sm tracking-widest font-bold uppercase text-white/90">Cardora MOTORS</span>
          </div>
          <div className="font-mono text-xs text-cyan-300 bg-cyan-950/50 px-4 py-1.5 rounded-full border border-cyan-500/30 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span ref={sceneHudRef} className="font-bold tracking-wider text-cyan-400 uppercase">3D TELEMETRY CANVAS</span>
          </div>
        </header>

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

        {/* POPUP 0: Intro (0s – 1s) */}
        <AnimatePresence>
          {activePopup === 0 && (
            <motion.div
              initial={{ opacity: 0, x: -50, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -40, scale: 0.9, filter: "blur(8px)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="fixed top-28 md:top-32 left-4 md:left-8 z-30 max-w-[calc(100vw-2rem)] md:max-w-lg w-full rounded-xl p-4 md:p-5"
            >
              <h4 className="text-4xl md:text-7xl font-bold text-white mb-1 leading-tight">
                A tailored process like no other.
              </h4>
            </motion.div>
          )}
        </AnimatePresence>

        {/* POPUP 1: Certified Inspection (3.3s – 10.3s) */}
        <AnimatePresence>
          {activePopup === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 40, scale: 0.9, filter: "blur(8px)" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="fixed top-28 md:top-32 right-4 md:right-8 z-30 max-w-[calc(100vw-2rem)] md:max-w-sm w-full rounded-xl p-4 md:p-5 bg-black/85 backdrop-blur-2xl border border-cyan-500/40 shadow-[0_0_40px_rgba(34,211,238,0.25)]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-400/30">FEATURE 01 // CERTIFIED INSPECTION</span>
                <span className="text-[10px] font-mono text-white/40">NODE 01</span>
              </div>
              <h4 className="text-base md:text-lg font-bold text-white mb-1">150-Point Certified Inspection</h4>
              <p className="text-xs text-gray-300 leading-relaxed">Every Cardora vehicle passes a rigorous 150-point inspection covering safety, performance, and cosmetics before it reaches your driveway.</p>
              <div className="mt-3 pt-2 border-t border-white/10 flex justify-between text-[11px] font-mono text-cyan-400">
                <span>INSPECTION: 150 POINTS</span><span>STATUS: CERTIFIED</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* POPUP 2: Active Spoiler (11.3s – 13.3s) */}
        <AnimatePresence>
          {activePopup === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 40, scale: 0.9, filter: "blur(8px)" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="fixed top-28 md:top-32 right-4 md:right-8 z-30 max-w-[calc(100vw-2rem)] md:max-w-sm w-full rounded-xl p-4 md:p-5 bg-black/85 backdrop-blur-2xl border border-cyan-500/40 shadow-[0_0_40px_rgba(34,211,238,0.25)]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-400/30">FEATURE 02 // ACTIVE SPOILER</span>
                <span className="text-[10px] font-mono text-white/40">NODE 02</span>
              </div>
              <h4 className="text-base md:text-lg font-bold text-white mb-1">Active Carbon Airflow Spoiler</h4>
              <p className="text-xs text-gray-300 leading-relaxed">Dynamically adjusts angle of attack at high speeds to generate over 450 kg of downforce for ultimate high-speed stability.</p>
              <div className="mt-3 pt-2 border-t border-white/10 flex justify-between text-[11px] font-mono text-cyan-400">
                <span>DOWNFORCE: 450 KG</span><span>STATUS: TELEMETRY ACTIVE</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* POPUP 3: Digital Cockpit (22.0s – 24.0s) */}
        <AnimatePresence>
          {activePopup === 3 && (
            <motion.div
              initial={{ opacity: 0, x: -50, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -40, scale: 0.9, filter: "blur(8px)" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="fixed bottom-12 left-4 md:left-8 z-30 max-w-[calc(100vw-2rem)] md:max-w-sm w-full rounded-xl p-4 md:p-5 bg-black/85 backdrop-blur-2xl border border-cyan-500/40 shadow-[0_0_40px_rgba(34,211,238,0.25)]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-400/30">FEATURE 03 // DIGITAL COCKPIT</span>
                <span className="text-[10px] font-mono text-white/40">NODE 03</span>
              </div>
              <h4 className="text-base md:text-lg font-bold text-white mb-1">Digital Cockpit &amp; Telemetry HUD</h4>
              <p className="text-xs text-gray-300 leading-relaxed">Dual holographic HUD projections with real-time G-force telemetry, tire thermal mapping, and predictive lap dynamics.</p>
              <div className="mt-3 pt-2 border-t border-white/10 flex justify-between text-[11px] font-mono text-cyan-400">
                <span>G-FORCE: 1.85 G</span><span>STATUS: TELEMETRY ACTIVE</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* POPUP 4: Torque Vectoring (32.5s – 34.5s) */}
        <AnimatePresence>
          {activePopup === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 40, scale: 0.9, filter: "blur(8px)" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="fixed top-28 md:top-32 right-4 md:right-8 z-30 max-w-[calc(100vw-2rem)] md:max-w-sm w-full rounded-xl p-4 md:p-5 bg-black/85 backdrop-blur-2xl border border-cyan-500/40 shadow-[0_0_40px_rgba(34,211,238,0.25)]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-400/30">FEATURE 04 // TORQUE VECTORING</span>
                <span className="text-[10px] font-mono text-white/40">NODE 04</span>
              </div>
              <h4 className="text-base md:text-lg font-bold text-white mb-1">Quad-Motor Torque Vectoring</h4>
              <p className="text-xs text-gray-300 leading-relaxed">Independent electric motors at each wheel deliver 1,020 HP with 0-60 mph launch in 1.95 seconds and instant cornering vector control.</p>
              <div className="mt-3 pt-2 border-t border-white/10 flex justify-between text-[11px] font-mono text-cyan-400">
                <span>OUTPUT: 1,020 HP</span><span>STATUS: TELEMETRY ACTIVE</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* POPUP 5: Titanium Exhaust (56.0s – 58.0s) */}
        <AnimatePresence>
          {activePopup === 5 && (
            <motion.div
              initial={{ opacity: 0, x: 50, y: 20, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 40, y: 20, scale: 0.9, filter: "blur(8px)" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="fixed bottom-12 right-4 md:right-8 z-30 max-w-[calc(100vw-2rem)] md:max-w-sm w-full rounded-xl p-4 md:p-5 bg-black/85 backdrop-blur-2xl border border-cyan-500/40 shadow-[0_0_40px_rgba(34,211,238,0.25)]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-400/30">FEATURE 05 // TITANIUM EXHAUST</span>
                <span className="text-[10px] font-mono text-white/40">NODE 05</span>
              </div>
              <h4 className="text-base md:text-lg font-bold text-white mb-1">Titanium Performance &amp; Exhaust</h4>
              <p className="text-xs text-gray-300 leading-relaxed">Active titanium acoustic bypass valves and lightweight race chassis engineering ready for ultimate track dominance.</p>
              <div className="mt-3 pt-2 border-t border-white/10 flex justify-between text-[11px] font-mono text-cyan-400">
                <span>EXHAUST: TITANIUM R</span><span>STATUS: READY TO DRIVE</span>
              </div>
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


