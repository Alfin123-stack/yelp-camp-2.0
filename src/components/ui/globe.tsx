"use client";

import createGlobe, { type COBEOptions } from "cobe";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Forest/gold themed globe — soft sage base, gold markers/glow to match
// the site's forest-950 / gold-300 palette instead of cobe's default
// white-and-orange look.
const GLOBE_CONFIG = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [0.84, 0.91, 0.87], // forest-100
  markerColor: [0.8, 0.64, 0.34], // gold-400
  glowColor: [0.93, 0.85, 0.67], // gold-200
  markers: [
    { location: [14.5995, 120.9842], size: 0.03 },
    { location: [19.076, 72.8777], size: 0.1 },
    { location: [23.8103, 90.4125], size: 0.05 },
    { location: [30.0444, 31.2357], size: 0.07 },
    { location: [39.9042, 116.4074], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 },
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [41.0082, 28.9784], size: 0.06 },
  ],
} as COBEOptions;

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string;
  config?: COBEOptions;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0);
  const widthRef = useRef(0);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [r, setR] = useState(0);

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      setR(delta / 200);
    }
  };

  const onRender = useCallback(
    (state: Record<string, any>) => {
      if (pointerInteracting.current === null) {
        phiRef.current += 0.005;
      }
      state.phi = phiRef.current + r;
      state.width = widthRef.current * 2;
      state.height = widthRef.current * 2;
    },
    [r]
  );

  useEffect(() => {
    if (!canvasRef.current) return;

    let globe: ReturnType<typeof createGlobe> | null = null;

    const start = (initialWidth: number) => {
      widthRef.current = initialWidth;
      if (!canvasRef.current || initialWidth === 0) return;

      globe = createGlobe(canvasRef.current, {
        ...config,
        width: initialWidth * 2,
        height: initialWidth * 2,
        onRender,
      } as COBEOptions);

      requestAnimationFrame(() => {
        if (canvasRef.current) canvasRef.current.style.opacity = "1";
      });
    };

    // Measure the parent (offsetParent), not the canvas itself — the
    // canvas has no intrinsic size before cobe draws to it, so reading
    // canvasRef.current.offsetWidth here would always be 0.
    const container = canvasRef.current.parentElement;
    if (container) {
      start(container.offsetWidth);
    }

    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      widthRef.current = w;
      if (!globe && w > 0 && container) {
        start(w);
      }
    });
    if (container) ro.observe(container);

    return () => {
      ro.disconnect();
      globe?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={cn(
        "relative mx-auto aspect-[1/1] w-full max-w-[600px]",
        className
      )}
    >
      <canvas
        className="size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]"
        ref={canvasRef}
        onPointerDown={(e) =>
          updatePointerInteraction(
            e.clientX - pointerInteractionMovement.current
          )
        }
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  );
}