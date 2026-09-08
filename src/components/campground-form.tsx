"use client";

import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { X,  UploadCloud, Search, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { CampgroundFormState } from "@/lib/actions/campgrounds";
import type { CampgroundData } from "@/types/campground";

const initialState: CampgroundFormState = {};

// Kept in sync with MAX_IMAGE_BYTES in lib/cloudinary.ts. This client check
// is just a fast UX nicety (fail before uploading); the server enforces the
// real limit since a request can always skip the browser.
const MAX_IMAGE_MB = 5;
const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024;
const MAX_DESCRIPTION_LENGTH = 500;

// Shared field styling so every input/textarea gets the same forest border
// + gold focus ring instead of shadcn's default neutral theme.
const fieldClassName =
  "border-forest-100 bg-cream-50/60 text-forest-950 placeholder:text-forest-700/40 focus-visible:border-gold-400 focus-visible:ring-gold-300/40";

const DEFAULT_CENTER: [number, number] = [-103.5918, 40.67];
const DEFAULT_ZOOM = 3;

// Same tent-pin mark used by ClusterMap's unclustered points and
// show-map.tsx's single marker — reproduced here as a full DOM element
// (rather than a map "icon-image") because this is one plain
// maptilersdk.Marker dropped by the user, not a symbol layer over many
// points. The `.campground-form-pin` class (see globals.css) adds the
// drop-in animation; it can't be a Tailwind utility since this element is
// injected straight into the map's DOM, outside Next.js's render tree.
const PIN_MARKER_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="26" fill="#0f2b20" stroke="#cba458" stroke-width="4"/>
  <g transform="translate(20,20)" stroke="#fdfbf6" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3.5 21 14 3l3 6.5" />
    <path d="M20.5 21 14 3" />
    <path d="M4 21 12 8l3.5 5.5" />
    <path d="M4 21h17" />
  </g>
</svg>`;

function createPinElement(): HTMLDivElement {
  const el = document.createElement("div");
  el.className = "campground-form-pin";
  el.innerHTML = PIN_MARKER_SVG;
  return el;
}

interface GeocodeSuggestion {
  id: string;
  placeName: string;
  center: [number, number];
}

interface CampgroundFormProps {
  action: (state: CampgroundFormState, formData: FormData) => Promise<CampgroundFormState>;
  campground?: CampgroundData;
  submitLabel: string;
}

export default function CampgroundForm({ action, campground, submitLabel }: CampgroundFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [markedForDelete, setMarkedForDelete] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [descriptionLength, setDescriptionLength] = useState(campground?.description?.length ?? 0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Location picker state ---
  const [locationValue, setLocationValue] = useState(campground?.location ?? "");
  const [suggestions, setSuggestions] = useState<GeocodeSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  // Drives the shared `.map-loading` shimmer (globals.css) until the
  // picker map's own tiles are ready, instead of a blank div flashing in.
  const [isMapLoading, setIsMapLoading] = useState(true);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maptilersdk.Map | null>(null);
  const markerRef = useRef<maptilersdk.Marker | null>(null);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Object URLs created by URL.createObjectURL() are only released
  // automatically when the document unloads, so without an explicit
  // revoke() each time the user swaps their file selection leaks the
  // previous preview's memory for the rest of the session.
  useEffect(() => {
    return () => {
      previews.forEach((src) => URL.revokeObjectURL(src));
    };
  }, [previews]);

  const placeMarker = useCallback((coords: [number, number]) => {
    const map = mapRef.current;
    if (!map) return;
    if (markerRef.current) {
      markerRef.current.setLngLat(coords);
    } else {
      markerRef.current = new maptilersdk.Marker({ element: createPinElement(), anchor: "bottom" })
        .setLngLat(coords)
        .addTo(map);
    }
    map.flyTo({ center: coords, zoom: Math.max(map.getZoom(), 9) });
  }, []);

  // Initialize the map once.
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
    if (!apiKey) return;

    maptilersdk.config.apiKey = apiKey;

    const map = new maptilersdk.Map({
      container: mapContainerRef.current,
      style: maptilersdk.MapStyle.OUTDOOR,
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
    });
    mapRef.current = map;

    map.on("load", () => setIsMapLoading(false));

    map.on("click", async (e) => {
      const coords: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      placeMarker(coords);
      await reverseGeocode(coords);
    });

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function reverseGeocode(coords: [number, number]) {
    const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
    if (!apiKey) return;
    setIsLocating(true);
    try {
      const res = await fetch(
        `https://api.maptiler.com/geocoding/${coords[0]},${coords[1]}.json?key=${apiKey}`
      );
      const data = await res.json();
      const placeName = data?.features?.[0]?.place_name as string | undefined;
      if (placeName) {
        setLocationValue(placeName);
        setShowSuggestions(false);
      }
    } catch {
      // Silently ignore — the user can still type the location manually.
    } finally {
      setIsLocating(false);
    }
  }

  function handleLocationInputChange(value: string) {
    setLocationValue(value);
    setShowSuggestions(true);

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    if (value.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    searchDebounceRef.current = setTimeout(async () => {
      const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
      if (!apiKey) return;
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://api.maptiler.com/geocoding/${encodeURIComponent(value)}.json?key=${apiKey}&limit=5`
        );
        const data = await res.json();
        const results: GeocodeSuggestion[] = (data?.features ?? []).map((f: any) => ({
          id: f.id,
          placeName: f.place_name,
          center: f.center as [number, number],
        }));
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);
  }

  function selectSuggestion(s: GeocodeSuggestion) {
    setLocationValue(s.placeName);
    setSuggestions([]);
    setShowSuggestions(false);
    placeMarker(s.center);
  }

  // --- Image upload logic ---

  // The real <input type="file"> is what actually submits with the form,
  // but we want per-file remove buttons on the previews below — plain
  // FileLists are read-only, so DataTransfer is the standard way to build
  // a new FileList and hand it back to the input after add/remove.
  function syncFileInput(files: File[]) {
    if (!fileInputRef.current) return;
    const dt = new DataTransfer();
    files.forEach((f) => dt.items.add(f));
    fileInputRef.current.files = dt.files;
  }

  function applyFiles(files: File[]) {
    const tooLarge = files.find((f) => f.size > MAX_IMAGE_BYTES);
    if (tooLarge) {
      setFileError(`"${tooLarge.name}" is larger than ${MAX_IMAGE_MB}MB — please choose a smaller file.`);
      return;
    }
    setFileError(null);
    setSelectedFiles(files);
    setPreviews((prev) => {
      prev.forEach((src) => URL.revokeObjectURL(src));
      return files.map((f) => URL.createObjectURL(f));
    });
    syncFileInput(files);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    applyFiles(Array.from(e.target.files ?? []));
  }

  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setIsDragging(false);
    applyFiles(Array.from(e.dataTransfer.files));
  }

  function removeSelectedFile(index: number) {
    setSelectedFiles((prevFiles) => {
      const nextFiles = prevFiles.filter((_, i) => i !== index);
      syncFileInput(nextFiles);
      return nextFiles;
    });
    setPreviews((prevPreviews) => {
      URL.revokeObjectURL(prevPreviews[index]);
      return prevPreviews.filter((_, i) => i !== index);
    });
  }

  function toggleDelete(filename: string) {
    setMarkedForDelete((prev) =>
      prev.includes(filename) ? prev.filter((f) => f !== filename) : [...prev, filename]
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="title" className="text-forest-800">
          Title
        </Label>
        <Input
          id="title"
          name="title"
          required
          placeholder="e.g. Cedar Hollow Ridge"
          defaultValue={campground?.title}
          className={fieldClassName}
        />
      </div>

      {/* Location — search box + click-to-pick map, instead of a plain
          text field. Selecting a suggestion or clicking the map fills the
          same `location` text input via reverse geocoding, so the server
          action still just receives a plain string like before. */}
      <div className="space-y-1.5">
        <Label htmlFor="location" className="text-forest-800">
          Location
        </Label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-500" />
          <Input
            id="location"
            name="location"
            required
            placeholder="Search a city, or click the map below"
            value={locationValue}
            onChange={(e) => handleLocationInputChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            autoComplete="off"
            className={`${fieldClassName} pl-9`}
          />
          {(isSearching || isLocating) && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-forest-400" />
          )}

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-forest-100 bg-white shadow-lg shadow-forest-900/10">
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => selectSuggestion(s)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-forest-800 hover:bg-gold-100/40"
                >
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-forest-500" />
                  <span className="truncate">{s.placeName}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* `map-picker` scopes the crosshair cursor (globals.css) to this
            map only — unlike the browse map, a click here drops a pin
            rather than zooming into a cluster, so it needs its own
            affordance. `map-loading` drives the shimmer skeleton until the
            `load` event above fires. */}
        <div
          className={`overflow-hidden rounded-2xl border border-forest-100 shadow-sm map-picker ${
            isMapLoading ? "map-loading" : ""
          }`}
        >
          <div ref={mapContainerRef} className="h-64 w-full" />
        </div>
        <p className="text-xs text-forest-700/50">
          Click anywhere on the map to drop a pin, or search above — either fills in the address
          for you.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="price" className="text-forest-800">
          Price per night ($)
        </Label>
        <Input
          id="price"
          name="price"
          type="number"
          min={0}
          step="0.01"
          required
          placeholder="e.g. 45"
          defaultValue={campground?.price}
          className={fieldClassName}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between">
          <Label htmlFor="description" className="text-forest-800">
            Description
          </Label>
          <span
            className={`text-xs ${
              descriptionLength > MAX_DESCRIPTION_LENGTH ? "text-red-600" : "text-forest-700/40"
            }`}
          >
            {descriptionLength}/{MAX_DESCRIPTION_LENGTH}
          </span>
        </div>
        <Textarea
          id="description"
          name="description"
          required
          rows={5}
          maxLength={MAX_DESCRIPTION_LENGTH}
          placeholder="What makes this spot worth the drive? Mention the view, the terrain, nearby trails, and anything campers should know before booking."
          defaultValue={campground?.description}
          onChange={(e) => setDescriptionLength(e.target.value.length)}
          className={fieldClassName}
        />
      </div>

      {campground && campground.images.length > 0 && (
        <div className="space-y-1.5">
          <Label className="text-forest-800">Current images (check to remove)</Label>
          <div className="grid grid-cols-3 gap-3">
            {campground.images.map((img) => (
              <label key={img.filename} className="relative block cursor-pointer">
                <input
                  type="checkbox"
                  name="deleteImages"
                  value={img.filename}
                  className="peer sr-only"
                  onChange={() => toggleDelete(img.filename)}
                />
                <div className="relative h-24 w-full overflow-hidden rounded-lg border border-forest-100">
                  <Image src={img.url} alt="" fill sizes="150px" className="object-cover" />
                </div>
                <span
                  className={`absolute inset-0 flex items-center justify-center rounded-lg bg-forest-950/60 text-cream-50 transition-opacity ${
                    markedForDelete.includes(img.filename) ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <X className="h-6 w-6" />
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Image upload — its own larger, separated section rather than a
          plain file input, with a big dropzone and large previews so a
          just-selected photo is immediately obvious, not a tiny thumbnail. */}
      <div className="space-y-3 border-t border-forest-100 pt-6">
        <div>
          <Label htmlFor="images" className="text-forest-800">
            {campground ? "Add more images" : "Images"}
          </Label>
          <p className="mt-0.5 text-xs text-forest-700/50">
            Max {MAX_IMAGE_MB}MB per image. The first photo becomes the cover image.
          </p>
        </div>

        <label
          htmlFor="images"
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex min-h-48 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
            isDragging
              ? "border-gold-400 bg-gold-100/40"
              : "border-forest-200 bg-cream-50/60 hover:border-gold-400 hover:bg-gold-100/30"
          }`}
        >
          <UploadCloud className="h-8 w-8 text-forest-500" />
          <span className="text-sm font-medium text-forest-800">
            Drag photos here, or click to browse
          </span>
          <span className="text-xs text-forest-700/50">PNG or JPG, up to {MAX_IMAGE_MB}MB each</span>
          <Input
            id="images"
            name="images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="sr-only"
          />
        </label>

        {fileError && (
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {fileError}
          </p>
        )}

        {previews.length > 0 && (
          <div className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-2">
            {previews.map((src, i) => (
              <div
                key={src}
                className="group relative h-56 w-full overflow-hidden rounded-2xl border border-forest-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
                {i === 0 && (
                  <span className="absolute left-3 top-3 rounded-full bg-forest-950/80 px-2.5 py-0.5 text-xs font-medium text-cream-50">
                    Cover
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeSelectedFile(i)}
                  aria-label={`Remove ${selectedFiles[i]?.name ?? "image"}`}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-forest-950/70 text-cream-50 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-gold-300 py-6 text-base font-semibold text-forest-950 hover:bg-gold-200"
      >
        {pending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}