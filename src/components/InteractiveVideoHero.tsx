import React, { useEffect, useRef, useState, useCallback } from 'react';
import './InteractiveVideoHero.css';

interface InteractiveVideoHeroProps {
  onPhaseChange?: (phase: 'intro' | 'interactive') => void;
  videoSrc?: string;
}

const TOTAL_FRAMES = 240;
const START_FRAME_INDEX = 90; // 3.0 seconds @ 30 FPS = frame 90
const END_FRAME_INDEX = 240;

const getFrameUrl = (frameNum: number): string => {
  const padded = String(Math.max(1, Math.min(TOTAL_FRAMES, frameNum))).padStart(3, '0');
  return `/frames/ezgif-frame-${padded}.png`;
};

export const InteractiveVideoHero: React.FC<InteractiveVideoHeroProps> = ({
  onPhaseChange,
  videoSrc = '/Woman_moving_head_slowly_1080p_20261004013426.mp4'
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // High-level UI states
  const [phase, setPhase] = useState<'intro' | 'interactive'>('intro');
  const [isInteractiveReady, setIsInteractiveReady] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  // In-memory cache of decoded frames (ImageBitmap or HTMLImageElement)
  const frameCacheRef = useRef<(ImageBitmap | HTMLImageElement | null)[]>(
    new Array(TOTAL_FRAMES + 1).fill(null)
  );

  // Mutable animation and tracking state in ref for 60FPS loop with NO React re-renders
  const animStateRef = useRef({
    phase: 'intro' as 'intro' | 'interactive',
    startFrame: START_FRAME_INDEX,
    endFrame: END_FRAME_INDEX,
    targetNormX: 0.5,      // 0 = left (frame 90), 0.5 = center (~frame 165), 1 = right (frame 240)
    currentNormX: 0.5,     // interpolated via lerp
    isHovered: false,
    lastDrawnFrame: -1,
    canvasWidth: 0,
    canvasHeight: 0,
    dpr: 1,
    rafId: 0,
    reducedMotion: false,
    hasSwitchedToCanvas: false
  });

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    animStateRef.current.reducedMotion = mediaQuery.matches;

    const handler = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
      animStateRef.current.reducedMotion = e.matches;
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Soft luxury curve with center deadzone
  // Near center (0.44 to 0.56): subtle/damped motion to maintain facial stability
  // Further out: luxurious smooth acceleration
  const calculateLuxuryNormX = useCallback((rawNormX: number): number => {
    const clamped = Math.max(0, Math.min(1, rawNormX));
    const delta = clamped - 0.5; // -0.5 to +0.5
    const absDelta = Math.abs(delta);
    const sign = Math.sign(delta);

    const deadzoneRadius = 0.06; // 6% center deadzone

    if (absDelta <= deadzoneRadius) {
      // Inside deadzone: subtle cubic damping for stable facial contact
      const t = absDelta / deadzoneRadius;
      return 0.5 + sign * (t * t * 0.012);
    }

    // Outside deadzone: continuous smooth power curve for silky head turning
    const span = 0.5 - deadzoneRadius;
    const progress = (absDelta - deadzoneRadius) / span; // 0 to 1
    const easedProgress = Math.pow(progress, 1.25);
    const mappedOffset = 0.012 + easedProgress * (0.5 - 0.012);

    return 0.5 + sign * mappedOffset;
  }, []);

  // Helper: Draw frame on canvas with object-fit: cover
  const drawFrameToCanvas = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const cache = frameCacheRef.current;
    let imgObj = cache[frameIndex];

    // If target frame not ready yet, search outward for closest loaded frame
    if (!imgObj) {
      for (let offset = 1; offset < 30; offset++) {
        if (frameIndex - offset >= 1 && cache[frameIndex - offset]) {
          imgObj = cache[frameIndex - offset];
          break;
        }
        if (frameIndex + offset <= TOTAL_FRAMES && cache[frameIndex + offset]) {
          imgObj = cache[frameIndex + offset];
          break;
        }
      }
    }

    if (!imgObj) return;

    const canvasW = canvas.width;
    const canvasH = canvas.height;
    const imgAspect = 1920 / 1080;
    const canvasAspect = canvasW / canvasH;

    let renderW: number;
    let renderH: number;
    let offsetX: number;
    let offsetY: number;

    if (canvasAspect > imgAspect) {
      // Screen is wider than 16:9
      renderW = canvasW;
      renderH = canvasW / imgAspect;
      offsetX = 0;
      offsetY = (canvasH - renderH) * 0.3; // align with video center 30%
    } else {
      // Screen is taller than 16:9
      renderH = canvasH;
      renderW = canvasH * imgAspect;
      offsetX = (canvasW - renderW) * 0.5;
      offsetY = 0;
    }

    ctx.drawImage(imgObj, offsetX, offsetY, renderW, renderH);
    animStateRef.current.lastDrawnFrame = frameIndex;
  }, []);

  // Resize canvas according to viewport dimensions & DPR
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap DPR at 2 for performance

    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      animStateRef.current.canvasWidth = w;
      animStateRef.current.canvasHeight = h;
      animStateRef.current.dpr = dpr;

      // Redraw current frame if in interactive phase
      if (animStateRef.current.phase === 'interactive' && animStateRef.current.lastDrawnFrame > 0) {
        drawFrameToCanvas(animStateRef.current.lastDrawnFrame);
      }
    }
  }, [drawFrameToCanvas]);

  // Priority Frame Preloading Pipeline
  useEffect(() => {
    let isCancelled = false;

    const loadSingleFrame = async (frameNum: number): Promise<void> => {
      if (frameCacheRef.current[frameNum] || isCancelled) return;

      const url = getFrameUrl(frameNum);
      try {
        if ('createImageBitmap' in window) {
          const res = await fetch(url);
          const blob = await res.blob();
          if (isCancelled) return;
          const bitmap = await createImageBitmap(blob);
          if (!isCancelled) {
            frameCacheRef.current[frameNum] = bitmap;
          }
        } else {
          await new Promise<void>((resolve) => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
              if (!isCancelled) {
                frameCacheRef.current[frameNum] = img;
              }
              resolve();
            };
            img.onerror = () => resolve();
          });
        }
      } catch {
        // Ignore single frame load error (fallback logic handles nearest frame)
      }
    };

    // 1. Critical Phase: Load initial transition frames (frames 85 to 105) immediately
    const preloadCriticalFrames = async () => {
      const criticalPromises: Promise<void>[] = [];
      for (let i = START_FRAME_INDEX - 5; i <= START_FRAME_INDEX + 15; i++) {
        if (i >= 1 && i <= TOTAL_FRAMES) {
          criticalPromises.push(loadSingleFrame(i));
        }
      }
      await Promise.all(criticalPromises);

      // 2. Secondary Phase: Progressively load remaining frames across interactive range
      if (isCancelled) return;

      // Preload frames in chunks to keep network/GPU smooth
      const remainingFrames: number[] = [];
      for (let i = START_FRAME_INDEX + 16; i <= END_FRAME_INDEX; i++) {
        remainingFrames.push(i);
      }
      for (let i = START_FRAME_INDEX - 6; i >= 1; i--) {
        remainingFrames.push(i);
      }

      const CHUNK_SIZE = 8;
      for (let idx = 0; idx < remainingFrames.length; idx += CHUNK_SIZE) {
        if (isCancelled) break;
        const chunk = remainingFrames.slice(idx, idx + CHUNK_SIZE);
        await Promise.all(chunk.map(num => loadSingleFrame(num)));
        // small pause between chunks to let main thread & network breathe
        await new Promise(r => setTimeout(r, 20));
      }
    };

    preloadCriticalFrames();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Resize listener
  useEffect(() => {
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize, { passive: true });
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [updateCanvasSize]);

  // Video Intro Setup & Autoplay
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.muted = true;
    video.playsInline = true;

    const playIntro = async () => {
      try {
        await video.play();
      } catch (err) {
        console.warn('Autoplay prevented by browser policy:', err);
      }
    };

    playIntro();
  }, [videoSrc]);

  // Monitor 3.0s Intro & Seamless Switch to Frame Sequence
  useEffect(() => {
    let introCheckRaf = 0;

    const checkIntro = () => {
      const video = videoRef.current;
      if (!video) return;

      if (animStateRef.current.phase === 'intro') {
        // Transition exactly when video reaches 3.0 seconds
        if (video.currentTime >= 3.0) {
          video.pause();

          // Calculate exact start frame based on actual video duration
          const videoDur = video.duration || 8.0;
          const calculatedFrame = Math.min(
            TOTAL_FRAMES,
            Math.max(1, Math.round((video.currentTime / videoDur) * (TOTAL_FRAMES - 1)) + 1)
          );

          animStateRef.current.startFrame = calculatedFrame;
          animStateRef.current.phase = 'interactive';
          animStateRef.current.targetNormX = 0.5;
          animStateRef.current.currentNormX = 0.5;
          animStateRef.current.hasSwitchedToCanvas = true;

          // Prepare canvas and draw exact start frame
          updateCanvasSize();
          drawFrameToCanvas(calculatedFrame);

          setPhase('interactive');
          setIsInteractiveReady(true);
          onPhaseChange?.('interactive');
          return;
        }

        introCheckRaf = requestAnimationFrame(checkIntro);
      }
    };

    if (phase === 'intro') {
      introCheckRaf = requestAnimationFrame(checkIntro);
    }

    return () => {
      if (introCheckRaf) cancelAnimationFrame(introCheckRaf);
    };
  }, [phase, onPhaseChange, drawFrameToCanvas, updateCanvasSize]);

  // 60FPS Dedicated Canvas Rendering & Lerp Interpolation Loop
  useEffect(() => {
    if (phase !== 'interactive') return;

    let isRunning = true;

    const renderLoop = () => {
      if (!isRunning) return;

      const state = animStateRef.current;

      if (!state.reducedMotion) {
        // Responsiveness: 0.09 on active hover, 0.045 on mouse leave return
        const lerpFactor = state.isHovered ? 0.088 : 0.045;
        state.currentNormX += (state.targetNormX - state.currentNormX) * lerpFactor;

        // Map interpolated 0..1 progress to frame range [startFrame..endFrame]
        const frameRange = state.endFrame - state.startFrame;
        const targetFrame = Math.round(state.startFrame + state.currentNormX * frameRange);
        const clampedFrame = Math.max(state.startFrame, Math.min(state.endFrame, targetFrame));

        if (clampedFrame !== state.lastDrawnFrame) {
          drawFrameToCanvas(clampedFrame);
        }
      }

      state.rafId = requestAnimationFrame(renderLoop);
    };

    animStateRef.current.rafId = requestAnimationFrame(renderLoop);

    return () => {
      isRunning = false;
      if (animStateRef.current.rafId) {
        cancelAnimationFrame(animStateRef.current.rafId);
      }
    };
  }, [phase, drawFrameToCanvas]);

  // Pointer Movement Handlers
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (animStateRef.current.phase !== 'interactive' || animStateRef.current.reducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const rawX = (e.clientX - rect.left) / rect.width;
    const luxuryX = calculateLuxuryNormX(rawX);

    animStateRef.current.isHovered = true;
    animStateRef.current.targetNormX = luxuryX;

    if (!hasInteracted) {
      setHasInteracted(true);
    }
  }, [calculateLuxuryNormX, hasInteracted]);

  const handlePointerEnter = useCallback(() => {
    if (animStateRef.current.phase !== 'interactive') return;
    animStateRef.current.isHovered = true;
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (animStateRef.current.phase !== 'interactive') return;
    animStateRef.current.isHovered = false;
    // Smooth return to center frame (0.5)
    animStateRef.current.targetNormX = 0.5;
  }, []);

  // Touch Handlers for Mobile
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (animStateRef.current.phase !== 'interactive' || animStateRef.current.reducedMotion) return;
    if (e.touches.length === 0) return;

    const container = containerRef.current;
    if (!container) return;

    const touch = e.touches[0];
    const rect = container.getBoundingClientRect();
    const rawX = (touch.clientX - rect.left) / rect.width;
    const luxuryX = calculateLuxuryNormX(rawX);

    animStateRef.current.isHovered = true;
    animStateRef.current.targetNormX = luxuryX;

    if (!hasInteracted) {
      setHasInteracted(true);
    }
  }, [calculateLuxuryNormX, hasInteracted]);

  const handleTouchEnd = useCallback(() => {
    if (animStateRef.current.phase !== 'interactive') return;
    animStateRef.current.isHovered = false;
    animStateRef.current.targetNormX = 0.5;
  }, []);

  return (
    <div
      ref={containerRef}
      className={`interactive-hero-viewport ${phase === 'interactive' ? 'is-interactive' : 'is-intro'}`}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Interactive 360-degree face light reflection campaign hero"
    >
      {/* 1. Pristine Original 1080p MP4 Video - Used ONLY for the initial 3-second cinematic intro */}
      <video
        ref={videoRef}
        className={`hero-pristine-video ${phase === 'interactive' ? 'video-hidden' : 'video-visible'}`}
        src={videoSrc}
        playsInline
        muted
        autoPlay
        preload="auto"
        controls={false}
      />

      {/* 2. Single High-Performance HTML5 Canvas - Used for ALL interactive cursor face control */}
      <canvas
        ref={canvasRef}
        className={`hero-interactive-canvas ${phase === 'interactive' ? 'canvas-visible' : 'canvas-hidden'}`}
        aria-hidden={phase !== 'interactive'}
      />

      {/* 3. Subtle Luxury Interactive Status Indicator Badge */}
      {isInteractiveReady && (
        <div
          className={`interactive-mode-badge ${hasInteracted ? 'interacted' : ''}`}
          aria-live="polite"
        >
          <div className="badge-pulse-dot" />
          <span className="badge-text">
            {reducedMotion ? 'Perspective Fixed (Reduced Motion)' : 'Face Control Active • Drag Horizontally'}
          </span>
          <div className="badge-arrows">
            <span>←</span>
            <span>→</span>
          </div>
        </div>
      )}
    </div>
  );
};
