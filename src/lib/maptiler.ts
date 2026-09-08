import * as maptilerClient from "@maptiler/client";

maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY || "";

/**
 * Forward-geocode a free-text location string (e.g. "Bandung, Indonesia")
 * into GeoJSON Point geometry, same as the original Express controller.
 */
export async function geocodeLocation(location: string) {
  const geoData = await maptilerClient.geocoding.forward(location, { limit: 1 });

  if (!geoData.features || geoData.features.length === 0) {
    return null;
  }

  return geoData.features[0].geometry as { type: "Point"; coordinates: [number, number] };
}
