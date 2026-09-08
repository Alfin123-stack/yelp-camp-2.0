"use client";

import { useEffect, useRef } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { escapeHtml } from "@/lib/utils";

// Inline styles (not Tailwind classes) throughout this file's DOM-injected
// bits — the marker element and popup HTML are handed straight to MapTiler
// and rendered outside Next.js's tree, so Tailwind's class scanner never
// sees them and would purge arbitrary utilities here in production. The
// `map-pulse` keyframes and `.forest-popup` overrides live in globals.css
// instead, since plain CSS isn't subject to that purge.
export default function ShowMap({
  coordinates,
  title,
  location,
}: {
  coordinates: [number, number];
  title: string;
  location: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maptilersdk.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
    if (!apiKey) return;

    maptilersdk.config.apiKey = apiKey;

    const map = new maptilersdk.Map({
      container: containerRef.current,
      // Same terrain/green basemap as the campgrounds list map
      // (cluster-map.tsx), so the detail page doesn't feel like a
      // different product.
      style: maptilersdk.MapStyle.OUTDOOR,
      center: coordinates,
      zoom: 11,
      pitch: 30,
    });
    mapRef.current = map;

    map.addControl(new maptilersdk.NavigationControl({ showCompass: false }), "top-right");

    // Custom pin: dark-forest circle, gold ring, a small tent glyph, and a
    // soft pulsing halo — instead of MapTiler's default blue teardrop.
    const markerEl = document.createElement("div");
    markerEl.innerHTML = `
      <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
        <span style="position: absolute; inset: 0; border-radius: 9999px; background: #cba458; animation: map-pulse 2.2s ease-out infinite;"></span>
        <div style="position: relative; width: 34px; height: 34px; border-radius: 9999px; background: #0f2b20; border: 3px solid #cba458; box-shadow: 0 4px 10px rgba(15, 43, 32, 0.35); display: flex; align-items: center; justify-content: center;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fdfbf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3.5 21 14 3l3 6.5" />
            <path d="M20.5 21 14 3" />
            <path d="M4 21 12 8l3.5 5.5" />
            <path d="M4 21h17" />
          </svg>
        </div>
      </div>
    `;

    const popup = new maptilersdk.Popup({
      offset: 26,
      closeButton: false,
      maxWidth: "240px",
      className: "forest-popup",
    }).setHTML(
      `<div style="font-family: inherit;">
        <p style="margin: 0; font-weight: 600; font-size: 14px; line-height: 1.3; color: #0f2b20;">
          ${escapeHtml(title)}
        </p>
        <p style="margin: 4px 0 0; font-size: 12px; line-height: 1.4; color: #3c7a61;">
          ${escapeHtml(location)}
        </p>
      </div>`
    );

    new maptilersdk.Marker({ element: markerEl, anchor: "bottom" })
      .setLngLat(coordinates)
      .setPopup(popup)
      .addTo(map)
      .togglePopup();

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates, title, location]);

  return (
    <div
      ref={containerRef}
      className="h-[360px] w-full overflow-hidden rounded-2xl border border-forest-100"
    />
  );
}