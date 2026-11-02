/**
 * Route Matcher & Compatibility Scoring Utility
 * Project: CampusCarpool (Student ID: 2102508522 - AKASH M R)
 *
 * Implements intelligent approximate route matching, waypoint inspection,
 * time window proximity, and seat availability weighting.
 */

// Common campus and transit abbreviation synonyms
const SYNONYMS = {
  campus: ['college', 'university', 'campus gate', 'main gate', 'academic block', 'hostel'],
  metro: ['station', 'metro station', 'railway', 'terminal'],
  bus: ['bus stop', 'stand', 'depot', 'terminal'],
  junction: ['circle', 'cross', 'signal', 'intersection'],
  park: ['tech park', 'it park', 'sez'],
};

function normalizeText(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculates Bigram Dice Coefficient for approximate string similarity (0 to 1)
 */
function diceSimilarity(s1, s2) {
  const str1 = normalizeText(s1);
  const str2 = normalizeText(s2);

  if (str1 === str2) return 1.0;
  if (!str1 || !str2) return 0.0;
  if (str1.includes(str2) || str2.includes(str1)) {
    const minLen = Math.min(str1.length, str2.length);
    const maxLen = Math.max(str1.length, str2.length);
    return 0.75 + 0.25 * (minLen / maxLen);
  }

  const getBigrams = (str) => {
    const bigrams = new Set();
    for (let i = 0; i < str.length - 1; i++) {
      bigrams.add(str.substring(i, i + 2));
    }
    return bigrams;
  };

  const b1 = getBigrams(str1);
  const b2 = getBigrams(str2);

  if (b1.size === 0 || b2.size === 0) return 0.0;

  let intersection = 0;
  for (const item of b1) {
    if (b2.has(item)) intersection++;
  }

  return (2.0 * intersection) / (b1.size + b2.size);
}

/**
 * Token overlap similarity
 */
function tokenSimilarity(s1, s2) {
  const t1 = normalizeText(s1).split(' ').filter(Boolean);
  const t2 = normalizeText(s2).split(' ').filter(Boolean);

  if (t1.length === 0 || t2.length === 0) return 0;

  let commonTokens = 0;
  for (const token of t1) {
    if (t2.includes(token)) {
      commonTokens++;
    } else {
      // Check for synonym expansion
      for (const [key, synList] of Object.entries(SYNONYMS)) {
        if ((token === key || synList.includes(token)) &&
            t2.some((w) => w === key || synList.includes(w))) {
          commonTokens += 0.85;
          break;
        }
      }
    }
  }

  return (2.0 * commonTokens) / (t1.length + t2.length);
}

/**
 * Combined textual similarity for locations
 */
function locationMatchScore(locA, locB) {
  const dice = diceSimilarity(locA, locB);
  const token = tokenSimilarity(locA, locB);
  return Math.min(1.0, Math.max(dice, token, (dice + token) / 2));
}

/**
 * Converts HH:MM string to total minutes from midnight
 */
function timeToMinutes(timeStr) {
  if (!timeStr) return null;
  const parts = timeStr.split(':');
  if (parts.length < 2) return null;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes)) return null;
  return hours * 60 + minutes;
}

/**
 * Calculates compatibility score between a rider's search query and a posted ride
 *
 * @param {Object} query - { source, destination, date, time, seats }
 * @param {Object} ride - Ride document with source, destination, waypoints, date, time, availableSeats
 * @returns {Object} { score: number (0-100), level: string, reasons: Array<string>, details: Object }
 */
function calculateRideCompatibility(query, ride) {
  const qSource = query.source ? normalizeText(query.source) : '';
  const qDest = query.destination ? normalizeText(query.destination) : '';
  const qDate = query.date ? query.date.trim() : '';
  const qTime = query.time ? query.time.trim() : '';
  const qSeats = query.seats ? parseInt(query.seats, 10) : 1;

  // 1. Check seat availability hard limit
  if (ride.availableSeats < qSeats) {
    return {
      score: 0,
      level: 'Full / Insufficient Seats',
      reasons: ['Not enough seats remaining for your group.'],
      details: { seatEligible: false },
    };
  }

  // 2. Source matching: check direct source and waypoints
  let bestSourceScore = 1.0;
  let matchedSourceWaypoint = null;
  if (qSource) {
    bestSourceScore = locationMatchScore(qSource, ride.source);

    // Also check waypoints
    if (Array.isArray(ride.waypoints)) {
      for (const wp of ride.waypoints) {
        const wpScore = locationMatchScore(qSource, wp);
        // Waypoint pickup gets 92% of direct score value
        const adjustedWpScore = wpScore * 0.92;
        if (adjustedWpScore > bestSourceScore) {
          bestSourceScore = adjustedWpScore;
          matchedSourceWaypoint = wp;
        }
      }
    }
  }

  // 3. Destination matching: check direct destination and waypoints
  let bestDestScore = 1.0;
  let matchedDestWaypoint = null;
  if (qDest) {
    bestDestScore = locationMatchScore(qDest, ride.destination);

    if (Array.isArray(ride.waypoints)) {
      for (const wp of ride.waypoints) {
        const wpScore = locationMatchScore(qDest, wp);
        const adjustedWpScore = wpScore * 0.92;
        if (adjustedWpScore > bestDestScore) {
          bestDestScore = adjustedWpScore;
          matchedDestWaypoint = wp;
        }
      }
    }
  }

  // Combine route score
  const routeScore = (bestSourceScore + bestDestScore) / 2;

  // 4. Date matching
  let dateScore = 1.0;
  if (qDate && ride.date) {
    if (qDate === ride.date) {
      dateScore = 1.0;
    } else {
      // Different date penalty
      dateScore = 0.2;
    }
  }

  // 5. Time proximity matching
  let timeScore = 1.0;
  let timeDiffMins = 0;
  if (qTime && ride.time) {
    const qMins = timeToMinutes(qTime);
    const rideMins = timeToMinutes(ride.time);
    if (qMins !== null && rideMins !== null) {
      timeDiffMins = Math.abs(qMins - rideMins);
      if (timeDiffMins <= 15) {
        timeScore = 1.0;
      } else if (timeDiffMins <= 30) {
        timeScore = 0.9;
      } else if (timeDiffMins <= 60) {
        timeScore = 0.75;
      } else if (timeDiffMins <= 120) {
        timeScore = 0.5;
      } else {
        timeScore = 0.25;
      }
    }
  }

  // 6. Driver rating factor (default 4.8 / 5)
  const driverRating = (ride.driver && ride.driver.rating) ? ride.driver.rating : 4.8;
  const driverScore = Math.min(1.0, driverRating / 5.0);

  // 7. Weighted Composite Score
  // Weights: Route = 50%, Time = 25%, Date = 15%, Driver/Seats = 10%
  let totalScoreRaw =
    routeScore * 0.50 +
    timeScore * 0.25 +
    dateScore * 0.15 +
    driverScore * 0.10;

  // Convert to clean percentage
  const score = Math.round(Math.min(100, Math.max(10, totalScoreRaw * 100)));

  // Generate human-friendly explanations
  const reasons = [];
  if (bestSourceScore >= 0.8) {
    reasons.push(matchedSourceWaypoint ? `Pickup at intermediate stop: ${matchedSourceWaypoint}` : 'Direct pickup match');
  } else if (bestSourceScore >= 0.5) {
    reasons.push('Approximate pickup proximity');
  }

  if (bestDestScore >= 0.8) {
    reasons.push(matchedDestWaypoint ? `Drop-off at intermediate stop: ${matchedDestWaypoint}` : 'Direct drop-off match');
  } else if (bestDestScore >= 0.5) {
    reasons.push('Approximate drop-off proximity');
  }

  if (qTime && timeDiffMins <= 30) {
    reasons.push(`Leaves within ${timeDiffMins} mins of desired time`);
  } else if (qTime && timeDiffMins <= 60) {
    reasons.push(`Departure within 1 hour window`);
  }

  if (ride.availableSeats >= qSeats) {
    reasons.push(`${ride.availableSeats} seats ready`);
  }

  let level = 'Moderate Match';
  let badgeColor = 'blue';
  if (score >= 85) {
    level = 'Excellent Match';
    badgeColor = 'green';
  } else if (score >= 70) {
    level = 'Good Match';
    badgeColor = 'emerald';
  } else if (score >= 50) {
    level = 'Moderate Match';
    badgeColor = 'amber';
  } else {
    level = 'Low Compatibility';
    badgeColor = 'gray';
  }

  return {
    score,
    level,
    badgeColor,
    reasons,
    details: {
      routeScore: Math.round(routeScore * 100),
      timeScore: Math.round(timeScore * 100),
      timeDiffMins,
      matchedSourceWaypoint,
      matchedDestWaypoint,
    },
  };
}

module.exports = {
  calculateRideCompatibility,
  locationMatchScore,
  timeToMinutes,
};

