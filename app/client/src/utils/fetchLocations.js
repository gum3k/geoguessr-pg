export const fetchLocations = async (count = 5, mapName = '') => {
  try {
    const response = await fetch(
      `/api/locations/random/?count=${count}&mapName=${encodeURIComponent(mapName)}`
    );
    const locations = await response.json();

    // Inject a random pan (heading) in [0, 360) and a constant zoom for Photosphere
    return locations.map((loc) => ({
      ...loc,
      pov: {
        heading: Math.random() * 360,
        pitch: 0,
        zoom: 0,
      },
      // Keep original lat/lng for map centering if needed
      lat: loc.lat,
      lng: loc.lng,
    }));
  } catch (err) {
    console.error('Error fetching locations:', err);
    return [];
  }
};