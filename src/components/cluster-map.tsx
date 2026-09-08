"use client";

import { useEffect, useRef } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { escapeHtml } from "@/lib/utils";

interface CampgroundFeature {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: {
    id: string;
    title: string;
    description: string;
    price?: number;
    imageUrl?: string;
  };
}

// Raster pin used for every unclustered point (loaded once via
// map.addImage + a symbol layer, below) — a forest-950 circle, gold-400
// ring and a tent glyph, same visual language as the single-pin marker on
// the campground detail page's map (show-map.tsx), just pre-rendered to an
// image since a symbol layer — not one DOM marker per point — is what
// keeps this map fast as the campground count grows.
const PIN_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="26" fill="#0f2b20" stroke="#cba458" stroke-width="4"/>
  <g transform="translate(20,20)" stroke="#fdfbf6" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3.5 21 14 3l3 6.5" />
    <path d="M20.5 21 14 3" />
    <path d="M4 21 12 8l3.5 5.5" />
    <path d="M4 21h17" />
  </g>
</svg>`;

function loadPinImage(map: maptilersdk.Map): Promise<void> {
  return new Promise((resolve, reject) => {
    if (map.hasImage("campground-pin")) {
      resolve();
      return;
    }
    const img = new Image(64, 64);
    img.onload = () => {
      if (!map.hasImage("campground-pin")) {
        map.addImage("campground-pin", img);
      }
      resolve();
    };
    img.onerror = reject;
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(PIN_SVG)}`;
  });
}

export default function ClusterMap({ campgrounds }: { campgrounds: CampgroundFeature[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maptilersdk.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
    if (!apiKey) return;

    maptilersdk.config.apiKey = apiKey;

    const map = new maptilersdk.Map({
      container: containerRef.current,
      // OUTDOOR reads as terrain/green rather than the generic city-bright
      // basemap, which fits a campground site better.
      style: maptilersdk.MapStyle.OUTDOOR,
      center: [-103.59179687498357, 40.66995747013945],
      zoom: 3,
    });
    mapRef.current = map;

    const geojson = {
      type: "FeatureCollection" as const,
      features: campgrounds,
    };

    map.on("load", async () => {
      await loadPinImage(map);

      map.addSource("campgrounds", {
        type: "geojson",
        data: geojson,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      // Soft glow underneath every cluster circle — a blurred, larger,
      // translucent copy of the same gold steps used below it — instead of
      // a flat filled circle with a hard edge.
      map.addLayer({
        id: "cluster-glow",
        type: "circle",
        source: "campgrounds",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#dfc07d", // gold-300
            10,
            "#cba458", // gold-400
            30,
            "#93702f", // gold-600
          ],
          "circle-radius": ["step", ["get", "point_count"], 24, 10, 30, 30, 36],
          "circle-blur": 1,
          "circle-opacity": 0.45,
        },
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "campgrounds",
        filter: ["has", "point_count"],
        paint: {
          // Gold progression instead of the default cyan/blue/indigo steps —
          // light gold for small clusters, deeper gold/forest as they grow.
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#dfc07d", // gold-300
            10,
            "#cba458", // gold-400
            30,
            "#93702f", // gold-600
          ],
          "circle-radius": ["step", ["get", "point_count"], 16, 10, 21, 30, 26],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fdfbf6", // cream-50
        },
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "campgrounds",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 13,
        },
        paint: {
          "text-color": "#0f2b20", // forest-950, readable on light gold
        },
      });

      // Single campgrounds now render as the tent pin image instead of a
      // plain 6px dot — much easier to spot and tap, and visually matches
      // the detail-page map's marker.
      map.addLayer({
        id: "unclustered-point",
        type: "symbol",
        source: "campgrounds",
        filter: ["!", ["has", "point_count"]],
        layout: {
          "icon-image": "campground-pin",
          "icon-size": 0.6,
          "icon-anchor": "bottom",
          "icon-allow-overlap": true,
        },
      });

      map.on("click", "clusters", async (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
        const clusterId = features[0].properties?.cluster_id;
        const source = map.getSource("campgrounds") as maptilersdk.GeoJSONSource;
        const zoom = await source.getClusterExpansionZoom(clusterId);
        map.easeTo({
          center: (features[0].geometry as GeoJSON.Point).coordinates as [number, number],
          zoom,
        });
      });

      map.on("click", "unclustered-point", (e) => {
        const feature = e.features?.[0];
        if (!feature) return;
        const { title, description, id, price, imageUrl } = feature.properties as {
          title: string;
          description: string;
          id: string;
          price?: number;
          imageUrl?: string;
        };
        const coordinates = (feature.geometry as GeoJSON.Point).coordinates.slice() as [
          number,
          number,
        ];

        // Inline styles (not Tailwind classes) because this HTML is injected
        // directly into the map's popup DOM, outside Next.js's own render
        // tree — Tailwind's build-time class scanner won't see it, so
        // classes here would silently get purged in production. The outer
        // `.forest-popup` className (see globals.css) restyles MapLibre's
        // own white popup chrome to match — same pattern as show-map.tsx.
        new maptilersdk.Popup({ offset: 20, closeButton: false, className: "forest-popup" })
          .setLngLat(coordinates)
          .setHTML(
            `<a href="/campgrounds/${escapeHtml(id)}" style="display: block; font-family: inherit; width: 220px; text-decoration: none;">
              ${
                imageUrl
                  ? `<div style="margin: -12px -14px 10px; height: 110px; overflow: hidden; border-radius: 14px 14px 0 0;">
                      <img src="${escapeHtml(imageUrl)}" alt="" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
                    </div>`
                  : ""
              }
              <div style="display: flex; align-items: start; justify-content: space-between; gap: 8px;">
                <p style="margin: 0; font-weight: 600; font-size: 14px; line-height: 1.3; color: #0f2b20;">
                  ${escapeHtml(title)}
                </p>
                ${
                  price !== undefined
                    ? `<span style="flex-shrink: 0; font-size: 11px; font-weight: 600; color: #93702f; background: #f6ecd4; border-radius: 9999px; padding: 2px 8px;">$${price}/malam</span>`
                    : ""
                }
              </div>
              <p style="margin: 4px 0 10px; font-size: 12px; line-height: 1.4; color: #3c7a61;">
                ${escapeHtml(description)}
              </p>
              <span style="display: inline-block; font-size: 12px; font-weight: 600; color: #0f2b20; background: #dfc07d; border-radius: 9999px; padding: 4px 12px;">
                Lihat detail →
              </span>
            </a>`
          )
          .addTo(map);
      });

      map.on("mouseenter", "clusters", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "clusters", () => {
        map.getCanvas().style.cursor = "";
      });
      map.on("mouseenter", "unclustered-point", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "unclustered-point", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [campgrounds]);

  // No border/rounded here anymore — the parent page now wraps this in its
  // own themed card (rounded-3xl border shadow), so doubling it here would
  // just draw two frames.
  return <div ref={containerRef} className="h-[480px] w-full" />;
}