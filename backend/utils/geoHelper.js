/**
 * Geographic Coordinate Resolution Helper
 * Project: CampusCarpool - Smart Mobility Platform
 *
 * Provides accurate WGS-84 decimal coordinates [longitude, latitude] for common
 * college hubs, metro stations, transit junctions, and campus gates.
 * All coordinates are standard GeoJSON [lng, lat] pairs.
 */

const KNOWN_COORDINATES = {
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
  'koramangala sony world signal': [77.6271, 12.9352],
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

function normalizeName(str) {
  if (!str) return '';
  return str.toLowerCase().replace(/[^\w\s]/gi, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Resolves approximate coordinate for a landmark name string.
 * Returns [lng, lat] or null if unknown.
 */
function resolveCoords(locationName) {
  if (!locationName) return null;
  const normalized = normalizeName(locationName);

  if (KNOWN_COORDINATES[normalized]) {
    return KNOWN_COORDINATES[normalized];
  }

  // Substring match
  for (const [key, coords] of Object.entries(KNOWN_COORDINATES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return coords;
    }
  }

  return null;
}

module.exports = {
  KNOWN_COORDINATES,
  resolveCoords,
};

