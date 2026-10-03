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

  // Detect mobile / touch device for memory conservation
  const isMobileRef = useRef<boolean>(
    typeof window !== 'undefined' && (window.innerWidth <= 768 || 'ontouchstart' in window)
  );

  // Bounded memory cache: Map of frameIndex -> HTMLImageElement | ImageBitmap
  // Strict size limit to prevent Mobile WebKit memory limit crashes
  const MAX_CACHE_SIZE = isMobileRef.current ? 40 : 80;
  const frameCacheMapRef = useRef<Map<number, ImageBitmap | HTMLImageElement>>(new Map());
  const pendingLoadsRef = useRef<Set<number>>(new Set());

  // Mutable animation state in ref for 60FPS loop with NO React re-renders
  const animStateRef = useRef({
    phase: 'intro' as 'intro' | 'interactive',
    startFrame: START_FRAME_INDEX,
    endFrame: END_FRAME_INDEX,
    targetNormX: 0.5,
    currentNormX: 0.5,
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

  // Safe frame evictor: releases GPU VRAM immediately
  const storeFrameInCache = useCallback((frameNum: number, imgObj: ImageBitmap | HTMLImageElement) => {
    const cache = frameCacheMapRef.current;
    
    // Evict oldest/furthest frame if cache exceeds safe threshold
    if (cache.size >= MAX_CACHE_SIZE) {
      const currentFrame = animStateRef.current.lastDrawnFrame > 0 
        ? animStateRef.current.lastDrawnFrame 
        : START_FRAME_INDEX;
      
      let furthestFrame = -1;
      let maxDist = -1;

      for (const [key] of cache) {
        const dist = Math.abs(key - currentFrame);
        if (dist > maxDist) {
          maxDist = dist;
          furthestFrame = key;
        }
      }

      if (furthestFrame !== -1) {
        const evicted = cache.get(furthestFrame);
        if (evicted && 'close' in evicted && typeof evicted.close === 'function') {
          try {
            evicted.close(); // Instantly frees GPU texture memory in Safari/Chrome
          } catch {
            // ignore
          }
        }
        cache.delete(furthestFrame);
      }
    }

    cache.set(frameNum, imgObj);
  }, [MAX_CACHE_SIZE]);

  // Load a single frame safely with HTMLImageElement or ImageBitmap
  const loadSingleFrame = useCallback(async (frameNum: number): Promise<void> => {
    if (frameCacheMapRef.current.has(frameNum) || pendingLoadsRef.current.has(frameNum)) {
      return;
    }

    pendingLoadsRef.current.add(frameNum);
    const url = getFrameUrl(frameNum);

    try {
      if ('createImageBitmap' in window && !isMobileRef.current) {
        const res = await fetch(url);
        const blob = await res.blob();
        const bitmap = await createImageBitmap(blob);
        storeFrameInCache(frameNum, bitmap);
      } else {
        // HTMLImageElement uses native browser disk caching without bloating VRAM
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.decoding = 'async';
          img.src = url;
          img.onload = () => {
            storeFrameInCache(frameNum, img);
            resolve();
          };
          img.onerror = () => resolve();
        });
      }
    } catch {
      // Fallback handles closest available frame
    } finally {
      pendingLoadsRef.current.delete(frameNum);
    }
  }, [storeFrameInCache]);

  // Soft luxury curve with center deadzone
  const calculateLuxuryNormX = useCallback((rawNormX: number): number => {
    const clamped = Math.max(0, Math.min(1, rawNormX));
    const delta = clamped - 0.5;
    const absDelta = Math.abs(delta);
    const sign = Math.sign(delta);
    const deadzoneRadius = 0.06;

    if (absDelta <= deadzoneRadius) {
      const t = absDelta / deadzoneRadius;
      return 0.5 + sign * (t * t * 0.012);
    }

    const span = 0.5 - deadzoneRadius;
    const progress = (absDelta - deadzoneRadius) / span;
    const easedProgress = Math.pow(progress, 1.25);
    const mappedOffset = 0.012 + easedProgress * (0.5 - 0.012);

    return 0.5 + sign * mappedOffset;
  }, []);

  // Draw frame on canvas with object-fit: cover
  const drawFrameToCanvas = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const cache = frameCacheMapRef.current;
    let imgObj = cache.get(frameIndex);

    // If target frame is not in cache yet, find closest loaded frame
    if (!imgObj) {
      let closestDist = 999;
      let closestKey = -1;

      for (const [key] of cache) {
        const dist = Math.abs(key - frameIndex);
        if (dist < closestDist) {
          closestDist = dist;
          closestKey = key;
        }
      }

      if (closestKey !== -1) {
        imgObj = cache.get(closestKey);
      }

      // Trigger lazy load for requested frame
      loadSingleFrame(frameIndex);
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
      renderW = canvasW;
      renderH = canvasW / imgAspect;
      offsetX = 0;
      offsetY = (canvasH - renderH) * 0.3;
    } else {
      renderH = canvasH;
      renderW = canvasH * imgAspect;
      offsetX = (canvasW - renderW) * 0.5;
      offsetY = 0;
    }

    ctx.drawImage(imgObj, offsetX, offsetY, renderW, renderH);
    animStateRef.current.lastDrawnFrame = frameIndex;
  }, [loadSingleFrame]);

  // Resize canvas according to viewport dimensions & DPR (capped at 2)
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, isMobileRef.current ? 1.5 : 2);

    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      animStateRef.current.canvasWidth = w;
      animStateRef.current.canvasHeight = h;
      animStateRef.current.dpr = dpr;

      if (animStateRef.current.phase === 'interactive' && animStateRef.current.lastDrawnFrame > 0) {
        drawFrameToCanvas(animStateRef.current.lastDrawnFrame);
      }
    }
  }, [drawFrameToCanvas]);

  // Gentle Preloading Pipeline: Prioritize transition frames (85-105) without memory spikes
  useEffect(() => {
    let isCancelled = false;

    const runPreload = async () => {
      // 1. Initial critical transition frames for 3.0s handoff
      const criticalFrames: number[] = [];
      for (let i = START_FRAME_INDEX - 5; i <= START_FRAME_INDEX + 15; i++) {
        if (i >= 1 && i <= TOTAL_FRAMES) {
          criticalFrames.push(i);
        }
      }

      for (const num of criticalFrames) {
        if (isCancelled) return;
        await loadSingleFrame(num);
      }

      // 2. Sampled interactive frames on idle
      if (isCancelled) return;

      const step = isMobileRef.current ? 2 : 1;
      const sampledFrames: number[] = [];
      for (let i = START_FRAME_INDEX + 16; i <= END_FRAME_INDEX; i += step) {
        sampledFrames.push(i);
      }
      for (let i = START_FRAME_INDEX - 6; i >= 1; i -= step) {
        sampledFrames.push(i);
      }

      // Load in small batches with pauses so main thread & mobile memory stay pristine
      const BATCH_SIZE = isMobileRef.current ? 4 : 8;
      for (let i = 0; i < sampledFrames.length; i += BATCH_SIZE) {
        if (isCancelled) break;
        const batch = sampledFrames.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(f => loadSingleFrame(f)));
        await new Promise(r => setTimeout(r, 60));
      }
    };

    runPreload();

    return () => {
      isCancelled = true;
      // Clean up all cached image bitmaps on unmount
      frameCacheMapRef.current.forEach((img) => {
        if (img && 'close' in img && typeof img.close === 'function') {
          try {
            img.close();
          } catch {
            // ignore
          }
        }
      });
      frameCacheMapRef.current.clear();
    };
  }, [loadSingleFrame]);

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
        console.warn('Autoplay handled by browser policy:', err);
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
        if (video.currentTime >= 3.0) {
          video.pause();

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
        const lerpFactor = state.isHovered ? 0.088 : 0.045;
        state.currentNormX += (state.targetNormX - state.currentNormX) * lerpFactor;

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
    animStateRef.current.targetNormX = 0.5;
  }, []);

  // Touch Handlers for Mobile Devices
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
      aria-label="Interactive face light reflection campaign hero"
    >
      {/* 1. Pristine Original MP4 Video - Mobile-safe with webkit-playsinline */}
      <video
        ref={videoRef}
        className={`hero-pristine-video ${phase === 'interactive' ? 'video-hidden' : 'video-visible'}`}
        src={videoSrc}
        playsInline
        webkit-playsinline="true"
        muted
        autoPlay
        preload="auto"
        controls={false}
      />

      {/* 2. Single High-Performance HTML5 Canvas */}
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
