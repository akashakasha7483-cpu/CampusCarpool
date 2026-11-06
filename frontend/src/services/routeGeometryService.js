/**
 * Route Geometry & Navigation Service
 * Project: CampusCarpool - Smart Mobility Platform
 * 
 * Provides:
 * - OSRM OpenStreetMap road network geometry fetching with timeout guards
 * - Client-side in-memory & session caching to minimize external API hits
 * - Geodesic cumulative distance calculation (Haversine formula)
 * - Spherical forward azimuth / bearing math for realistic vehicle orientation
 * - Transparent fallback state labeling (Verified OSRM vs. Direct Corridor)
 */

export const KNOWN_COORDINATES = {
  'silk board': [77.6229, 12.9177],
  'silk board junction': [77.6229, 12.9177],
  'silk board skywalk': [77.6229, 12.9177],
  'campus main gate': [77.6848, 12.9237],
  'campus academic block': [77.6860, 12.9245],
  'campus engineering block': [77.6855, 12.9240],
  'campus': [77.6848, 12.9237],
  'hsr layout': [77.6385, 12.9121],
  'hsr layout 5th sector': [77.6385, 12.9121],
  'hsr bda complex': [77.6432, 12.9115],
  'koramangala': [77.6271, 12.9352],
  'koramangala sony world': [77.6271, 12.9352],
  'koramangala water tank': [77.6201, 12.9275],
  'whitefield': [77.7499, 12.9698],
  'whitefield ttmc': [77.7499, 12.9698],
  'marathahalli': [77.7011, 12.9569],
  'marathahalli bridge': [77.7011, 12.9569],
  'indiranagar': [77.6408, 12.9784],
  'indiranagar 100ft road': [77.6408, 12.9784],
  'indiranagar metro': [77.6408, 12.9784],
  'electronic city': [77.6649, 12.8399],
  'electronic city phase 1': [77.6649, 12.8399],
  'bellandur': [77.6784, 12.9304],
  'domlur': [77.6377, 12.9609],
  'domlur flyover': [77.6377, 12.9609],
  'majestic': [77.5736, 12.9781],
  'hebbal': [77.5913, 13.0358],
  'hal': [77.6700, 12.9550],
  'hal main gate': [77.6700, 12.9550],
};

const OSRM_PUBLIC_API = 'https://router.project-osrm.org/route/v1/driving';
const REQUEST_TIMEOUT_MS = 4000;
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

// In-memory cache for fast tab and corridor switching
const memoryCache = new Map();

/**
 * Validates whether a coordinate is a valid [lng, lat] pair.
 */
export function isValidLngLat(coord) {
  return (
    Array.isArray(coord) &&
    coord.length >= 2 &&
    typeof coord[0] === 'number' &&
    typeof coord[1] === 'number' &&
    !isNaN(coord[0]) &&
    !isNaN(coord[1]) &&
    coord[0] >= -180 &&
    coord[0] <= 180 &&
    coord[1] >= -90 &&
    coord[1] <= 90
  );
}

/**
 * Resolves a landmark or stop name to known coordinates with fuzzy fallback.
 */
export function resolveLocationCoords(locName, fallback = null) {
  if (!locName || typeof locName !== 'string') return fallback;
  const clean = locName.toLowerCase().replace(/[^\w\s]/gi, ' ').replace(/\s+/g, ' ').trim();
  if (KNOWN_COORDINATES[clean]) return KNOWN_COORDINATES[clean];
  for (const [key, coords] of Object.entries(KNOWN_COORDINATES)) {
    if (clean.includes(key) || key.includes(clean)) return coords;
  }
  return fallback;
}

/**
 * Calculates geodesic distance between two points in meters using the Haversine formula.
 */
export function haversineDistance(p1, p2) {
  if (!p1 || !p2) return 0;
  const [lng1, lat1] = p1;
  const [lng2, lat2] = p2;
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Calculates cumulative distances along a polyline coordinate array.
 * Returns array of distances in meters starting at 0.
 */
export function calculateCumulativeDistances(coords) {
  if (!Array.isArray(coords) || coords.length === 0) return [0];
  const distances = [0];
  let total = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    const d = haversineDistance(coords[i], coords[i + 1]);
    total += d;
    distances.push(total);
  }
  return distances;
}

/**
 * Calculates accurate spherical forward azimuth (bearing) from p1 to p2 in degrees [0, 360).
 */
export function calculateGeographicBearing(p1, p2) {
  if (!p1 || !p2) return 0;
  const [lng1, lat1] = p1;
  const [lng2, lat2] = p2;

  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaLambda = ((lng2 - lng1) * Math.PI) / 180;

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  const theta = Math.atan2(y, x);
  const bearing = ((theta * 180) / Math.PI + 360) % 360;
  return bearing;
}

/**
 * Interpolates point and heading bearing at progress t in [0, 1] using cumulative geodesic distance.
 */
export function getPointAndBearingAtProgress(coords, cumulativeDistances, progress) {
  if (!Array.isArray(coords) || coords.length === 0) {
    return { point: [77.65, 12.92], bearing: 0, segmentIndex: 0 };
  }
  if (coords.length === 1) {
    return { point: coords[0], bearing: 0, segmentIndex: 0 };
  }

  const clampedProgress = Math.max(0, Math.min(1, progress));
  const totalDist = cumulativeDistances[cumulativeDistances.length - 1] || 1;
  const targetDist = clampedProgress * totalDist;

  // Binary search or linear search for active segment
  let segIdx = 0;
  for (let i = 0; i < cumulativeDistances.length - 1; i++) {
    if (targetDist >= cumulativeDistances[i] && targetDist <= cumulativeDistances[i + 1]) {
      segIdx = i;
      break;
    }
  }

  const p0 = coords[segIdx];
  const p1 = coords[segIdx + 1] || p0;
  const segStartDist = cumulativeDistances[segIdx];
  const segEndDist = cumulativeDistances[segIdx + 1] || segStartDist + 1;
  const segLength = segEndDist - segStartDist;

  const localFraction = segLength > 0 ? (targetDist - segStartDist) / segLength : 0;

  const currentLng = p0[0] + (p1[0] - p0[0]) * localFraction;
  const currentLat = p0[1] + (p1[1] - p0[1]) * localFraction;
  const bearing = calculateGeographicBearing(p0, p1);

  return {
    point: [currentLng, currentLat],
    bearing,
    segmentIndex: segIdx,
  };
}

/**
 * Generates deterministic cache key for coordinate route.
 */
function makeCacheKey(coords) {
  return coords.map((c) => `${c[0].toFixed(4)},${c[1].toFixed(4)}`).join(';');
}

/**
 * Fetches real road geometry from OSRM driving service with timeout and fallback handling.
 *
 * @param {Array<[number, number]>} waypointsList - Array of [lng, lat] coordinates (origin -> stops -> destination)
 * @returns {Promise<{
 *   success: boolean,
 *   source: 'osrm-verified' | 'fallback-direct',
 *   coordinates: Array<[number, number]>,
 *   cumulativeDistances: Array<number>,
 *   totalDistanceKm: number,
 *   totalDurationMins: number,
 *   isFallback: boolean,
 *   errorReason?: string
 * }>}
 */
export async function fetchRoadRoute(waypointsList) {
  const validPoints = (waypointsList || []).filter(isValidLngLat);

  if (validPoints.length < 2) {
    return {
      success: false,
      source: 'fallback-direct',
      coordinates: validPoints,
      cumulativeDistances: [0],
      totalDistanceKm: 0,
      totalDurationMins: 0,
      isFallback: true,
      errorReason: 'Less than two valid coordinates provided.',
    };
  }

  const cacheKey = makeCacheKey(validPoints);

  // 1. Check in-memory cache
  if (memoryCache.has(cacheKey)) {
    const cached = memoryCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
    memoryCache.delete(cacheKey);
  }

  // 2. Format query coordinate string
  const coordsParam = validPoints.map((c) => `${c[0]},${c[1]}`).join(';');
  const url = `${OSRM_PUBLIC_API}/${coordsParam}?overview=full&geometries=geojson&steps=false`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`OSRM API responded with HTTP status ${response.status}`);
    }

    const data = await response.json();
    if (data.code !== 'Ok' || !data.routes || !data.routes[0]) {
      throw new Error(data.message || 'No valid route returned by OSRM');
    }

    const route = data.routes[0];
    const roadCoordinates = route.geometry.coordinates;
    const distanceMeters = route.distance;
    const durationSeconds = route.duration;

    const cumulativeDistances = calculateCumulativeDistances(roadCoordinates);
    const totalDistanceKm = parseFloat((distanceMeters / 1000).toFixed(1));
    const totalDurationMins = Math.max(1, Math.round(durationSeconds / 60));

    const result = {
      success: true,
      source: 'osrm-verified',
      coordinates: roadCoordinates,
      cumulativeDistances,
      totalDistanceKm,
      totalDurationMins,
      isFallback: false,
    };

    // Cache the verified route
    memoryCache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn('CampusCarpool Routing: OSRM route fetch failed or timed out. Falling back to direct corridor trajectory.', err.message);

    // Compute direct linear trajectory between waypoints as fallback
    const fallbackDistances = calculateCumulativeDistances(validPoints);
    const fallbackMeters = fallbackDistances[fallbackDistances.length - 1] || 0;
    const fallbackKm = parseFloat((fallbackMeters / 1000).toFixed(1));
    const fallbackMins = Math.round(fallbackKm * 3.2); // ~18 km/h typical urban campus transit

    const fallbackResult = {
      success: true,
      source: 'fallback-direct',
      coordinates: validPoints,
      cumulativeDistances: fallbackDistances,
      totalDistanceKm: Math.max(1.5, fallbackKm),
      totalDurationMins: Math.max(5, fallbackMins),
      isFallback: true,
      errorReason: err.name === 'AbortError' ? 'OSRM request timed out (> 4s)' : err.message,
    };

    return fallbackResult;
  }
}

