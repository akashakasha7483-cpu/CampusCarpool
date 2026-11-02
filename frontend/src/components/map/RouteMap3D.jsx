import React, { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  MapPin,
  Navigation,
  Eye,
  AlertCircle,
  Compass,
  RefreshCw,
  Car,
  Clock,
  Users,
  ShieldCheck,
} from '../Icons';

// Known landmark coordinate lookup (WGS-84 [lng, lat])
const KNOWN_COORDS = {
  'silk board': [77.6229, 12.9177],
  'silk board junction': [77.6229, 12.9177],
  'campus main gate': [77.6848, 12.9237],
  'campus academic block': [77.6860, 12.9245],
  'campus engineering block': [77.6855, 12.9240],
  'campus': [77.6848, 12.9237],
  'hsr layout': [77.6385, 12.9121],
  'hsr layout 5th sector': [77.6385, 12.9121],
  'koramangala': [77.6271, 12.9352],
  'koramangala sony world': [77.6271, 12.9352],
  'whitefield': [77.7499, 12.9698],
  'whitefield ttmc': [77.7499, 12.9698],
  'marathahalli': [77.7011, 12.9569],
  'marathahalli bridge': [77.7011, 12.9569],
  'indiranagar': [77.6408, 12.9784],
  'indiranagar 100ft road': [77.6408, 12.9784],
  'electronic city': [77.6649, 12.8399],
  'bellandur': [77.6784, 12.9304],
  'domlur': [77.6377, 12.9609],
  'majestic': [77.5736, 12.9781],
  'hebbal': [77.5913, 13.0358],
  'hal': [77.6700, 12.9550],
};

function resolveLocationCoord(locName, fallback) {
  if (!locName || typeof locName !== 'string') return fallback;
  const clean = locName.toLowerCase().replace(/[^\w\s]/gi, ' ').replace(/\s+/g, ' ').trim();
  if (KNOWN_COORDS[clean]) return KNOWN_COORDS[clean];
  for (const [key, coords] of Object.entries(KNOWN_COORDS)) {
    if (clean.includes(key) || key.includes(clean)) return coords;
  }
  return fallback;
}

function isValidLngLat(coord) {
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

// Resilient, high-contrast dark cyber map style using Carto Dark Matter raster tiles
const CYBER_DARK_STYLE = {
  version: 8,
  name: 'CampusCarpool Cyber Dark',
  sources: {
    'carto-dark-matter': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
  },
  layers: [
    {
      id: 'carto-dark-base',
      type: 'raster',
      source: 'carto-dark-matter',
      minzoom: 0,
      maxzoom: 20,
      paint: {
        'raster-opacity': 0.95,
      },
    },
  ],
};

export const RouteMap3D = ({ selectedRide, onSelectLocation }) => {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const animFrameRef = useRef(null);
  const vehicleMarkerRef = useRef(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [routeStats, setRouteStats] = useState(null);

  // Initialize MapLibre GL
  useEffect(() => {
    if (!mapContainer.current) return;

    let map;
    try {
      map = new maplibregl.Map({
        container: mapContainer.current,
        style: CYBER_DARK_STYLE,
        center: [77.65, 12.925],
        zoom: 12,
        pitch: 52,
        bearing: -18,
        attributionControl: false,
      });

      // 3D Navigation Controls with Compass & Pitch control
      map.addControl(
        new maplibregl.NavigationControl({
          visualizePitch: true,
          showCompass: true,
          showZoom: true,
        }),
        'top-right'
      );

      map.on('load', () => {
        setMapLoaded(true);
        // Ensure proper layout dimension calculation
        setTimeout(() => {
          if (map) map.resize();
        }, 100);
      });

      map.on('error', (err) => {
        console.warn('MapLibre GL Notice:', err);
      });

      map.on('click', (e) => {
        if (onSelectLocation) {
          onSelectLocation([e.lngLat.lng, e.lngLat.lat]);
        }
      });

      mapInstance.current = map;
    } catch (err) {
      console.error('Failed to initialize 3D Map:', err);
      setMapError(true);
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      if (vehicleMarkerRef.current) vehicleMarkerRef.current.remove();
      if (map) map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      if (mapInstance.current) mapInstance.current.resize();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update Route and Markers when selectedRide or mapLoaded changes
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !mapLoaded) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    if (vehicleMarkerRef.current) {
      vehicleMarkerRef.current.remove();
      vehicleMarkerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    // Determine reliable coordinates
    const defaultSrc = [77.6229, 12.9177];
    const defaultDest = [77.6848, 12.9237];

    let src = isValidLngLat(selectedRide?.sourceCoords)
      ? selectedRide.sourceCoords
      : resolveLocationCoord(selectedRide?.source, defaultSrc);

    let dest = isValidLngLat(selectedRide?.destinationCoords)
      ? selectedRide.destinationCoords
      : resolveLocationCoord(selectedRide?.destination, defaultDest);

    // Resolve waypoints
    const rawWaypoints = selectedRide?.waypoints || [];
    const rawWpCoords = selectedRide?.waypointsCoords || [];
    const validWaypoints = [];

    rawWaypoints.forEach((wpText, idx) => {
      let coord = rawWpCoords[idx];
      if (!isValidLngLat(coord)) {
        coord = resolveLocationCoord(wpText, null);
      }
      if (isValidLngLat(coord)) {
        validWaypoints.push({ text: wpText, coord, index: idx + 1 });
      }
    });

    // Assemble full route coordinates array
    const routeCoords = [src, ...validWaypoints.map((w) => w.coord), dest];

    // Helper: Create HTML marker with cyber glow styling
    const createCyberMarkerEl = (color, title, subtitle, icon) => {
      const el = document.createElement('div');
      el.className = 'cyber-3d-marker';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.gap = '6px';
      el.style.background = 'rgba(8, 13, 24, 0.94)';
      el.style.border = `2px solid ${color}`;
      el.style.boxShadow = `0 0 16px ${color}, 0 4px 14px rgba(0,0,0,0.6)`;
      el.style.color = '#ffffff';
      el.style.fontSize = '11px';
      el.style.fontWeight = '800';
      el.style.padding = '5px 12px';
      el.style.borderRadius = '999px';
      el.style.cursor = 'pointer';
      el.style.whiteSpace = 'nowrap';
      el.style.backdropFilter = 'blur(8px)';
      el.innerHTML = `
        <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${color}; box-shadow:0 0 8px ${color};"></span>
        <span>${title}: <span style="color:#f8fafc; font-weight:700;">${subtitle}</span></span>
      `;
      return el;
    };

    // 1. Pickup Marker (Neon Emerald)
    const srcEl = createCyberMarkerEl(
      '#10b981',
      'PICKUP',
      selectedRide?.source || 'Origin Point',
      '🟢'
    );
    const srcMarker = new maplibregl.Marker({ element: srcEl, anchor: 'bottom' })
      .setLngLat(src)
      .setPopup(
        new maplibregl.Popup({ offset: 25, closeButton: false }).setHTML(`
          <div style="background:#080d18; color:#f8fafc; padding:8px 12px; border-radius:10px; border:1px solid #10b981; font-family:sans-serif; font-size:12px;">
            <div style="color:#10b981; font-weight:800; text-transform:uppercase; font-size:10px; letter-spacing:0.05em;">Pickup Origin</div>
            <div style="font-weight:700; margin-top:2px;">${selectedRide?.source || 'Origin Point'}</div>
            <div style="color:#94a3b8; font-size:11px; margin-top:4px;">Departure: ${selectedRide?.time || '08:30'} &bull; ${selectedRide?.date || 'Today'}</div>
          </div>
        `)
      )
      .addTo(map);
    markersRef.current.push(srcMarker);

    // 2. Waypoint Markers (Neon Amber)
    validWaypoints.forEach((wp) => {
      const wpEl = createCyberMarkerEl(
        '#f59e0b',
        `STOP ${wp.index}`,
        wp.text,
        '🟡'
      );
      const wpMarker = new maplibregl.Marker({ element: wpEl, anchor: 'bottom' })
        .setLngLat(wp.coord)
        .setPopup(
          new maplibregl.Popup({ offset: 25, closeButton: false }).setHTML(`
            <div style="background:#080d18; color:#f8fafc; padding:8px 12px; border-radius:10px; border:1px solid #f59e0b; font-family:sans-serif; font-size:12px;">
              <div style="color:#f59e0b; font-weight:800; text-transform:uppercase; font-size:10px; letter-spacing:0.05em;">Intermediate Waypoint #${wp.index}</div>
              <div style="font-weight:700; margin-top:2px;">${wp.text}</div>
              <div style="color:#94a3b8; font-size:11px; margin-top:4px;">Scheduled passenger pickup / drop stop</div>
            </div>
          `)
        )
        .addTo(map);
      markersRef.current.push(wpMarker);
    });

    // 3. Drop-off Marker (Neon Cyan)
    const destEl = createCyberMarkerEl(
      '#38bdf8',
      'DROP-OFF',
      selectedRide?.destination || 'Destination Point',
      '🔵'
    );
    const destMarker = new maplibregl.Marker({ element: destEl, anchor: 'bottom' })
      .setLngLat(dest)
      .setPopup(
        new maplibregl.Popup({ offset: 25, closeButton: false }).setHTML(`
          <div style="background:#080d18; color:#f8fafc; padding:8px 12px; border-radius:10px; border:1px solid #38bdf8; font-family:sans-serif; font-size:12px;">
            <div style="color:#38bdf8; font-weight:800; text-transform:uppercase; font-size:10px; letter-spacing:0.05em;">Destination Drop-off</div>
            <div style="font-weight:700; margin-top:2px;">${selectedRide?.destination || 'Destination Point'}</div>
            <div style="color:#94a3b8; font-size:11px; margin-top:4px;">Available Seats: ${selectedRide?.availableSeats || 1} &bull; ₹${selectedRide?.pricePerSeat || 30}</div>
          </div>
        `)
      )
      .addTo(map);
    markersRef.current.push(destMarker);

    // Update or add GeoJSON route data
    const routeGeoJSON = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: routeCoords,
      },
    };

    if (map.getSource('cyber-route-data')) {
      map.getSource('cyber-route-data').setData(routeGeoJSON);
    } else {
      map.addSource('cyber-route-data', {
        type: 'geojson',
        data: routeGeoJSON,
      });

      // Wide cyber neon green glow blur
      map.addLayer({
        id: 'cyber-route-glow',
        type: 'line',
        source: 'cyber-route-data',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#00ff88',
          'line-width': 12,
          'line-opacity': 0.45,
          'line-blur': 6,
        },
      });

      // Sharp neon core line
      map.addLayer({
        id: 'cyber-route-core',
        type: 'line',
        source: 'cyber-route-data',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#34d399',
          'line-width': 4.5,
          'line-opacity': 0.95,
        },
      });

      // Dashed animated pulse center
      map.addLayer({
        id: 'cyber-route-dash',
        type: 'line',
        source: 'cyber-route-data',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#ffffff',
          'line-width': 2,
          'line-opacity': 0.8,
          'line-dasharray': [1, 3],
        },
      });
    }

    // 4. Live Gliding 3D Vehicle Marker along route
    const vehicleEl = document.createElement('div');
    vehicleEl.style.width = '34px';
    vehicleEl.style.height = '34px';
    vehicleEl.style.borderRadius = '50%';
    vehicleEl.style.background = '#080d18';
    vehicleEl.style.border = '2px solid #00ff88';
    vehicleEl.style.boxShadow = '0 0 20px #00ff88, 0 0 40px rgba(0, 255, 136, 0.4)';
    vehicleEl.style.display = 'flex';
    vehicleEl.style.alignItems = 'center';
    vehicleEl.style.justifyContent = 'center';
    vehicleEl.style.color = '#00ff88';
    vehicleEl.style.fontSize = '16px';
    vehicleEl.innerHTML = '⚡';

    const vehicleMarker = new maplibregl.Marker({ element: vehicleEl, anchor: 'center' })
      .setLngLat(src)
      .addTo(map);
    vehicleMarkerRef.current = vehicleMarker;

    // Vehicle gliding animation
    let progress = 0;
    const animateVehicle = () => {
      progress += 0.0025;
      if (progress > 1) progress = 0;

      // Linear interpolation across segments
      const totalSegments = routeCoords.length - 1;
      const segmentFraction = 1 / totalSegments;
      const segmentIndex = Math.min(Math.floor(progress / segmentFraction), totalSegments - 1);
      const localProgress = (progress - segmentIndex * segmentFraction) / segmentFraction;

      const p0 = routeCoords[segmentIndex];
      const p1 = routeCoords[segmentIndex + 1];

      if (p0 && p1) {
        const currentLng = p0[0] + (p1[0] - p0[0]) * localProgress;
        const currentLat = p0[1] + (p1[1] - p0[1]) * localProgress;
        vehicleMarker.setLngLat([currentLng, currentLat]);
      }

      animFrameRef.current = requestAnimationFrame(animateVehicle);
    };

    animFrameRef.current = requestAnimationFrame(animateVehicle);

    // Approximate distance calculation
    let totalDistKm = 0;
    for (let i = 0; i < routeCoords.length - 1; i++) {
      const [lng1, lat1] = routeCoords[i];
      const [lng2, lat2] = routeCoords[i + 1];
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLng = ((lng2 - lng1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      totalDistKm += 6371 * c;
    }
    const distClean = Math.max(2.5, totalDistKm).toFixed(1);
    const estTimeMin = Math.round(distClean * 3.2);
    setRouteStats({
      distance: `${distClean} km`,
      duration: `${estTimeMin} mins`,
      stops: validWaypoints.length,
    });

    // Smooth camera fly-to fit route bounds
    try {
      const bounds = new maplibregl.LngLatBounds();
      routeCoords.forEach((coord) => bounds.extend(coord));
      map.fitBounds(bounds, {
        padding: { top: 90, bottom: 90, left: 90, right: 90 },
        pitch: 52,
        bearing: -18,
        duration: 1400,
        maxZoom: 14.5,
      });
    } catch (e) {
      console.warn('fitBounds fallback:', e);
    }
  }, [selectedRide, mapLoaded]);

  if (mapError) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          minHeight: '480px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(15, 23, 42, 0.9)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <AlertCircle size={44} color="#f59e0b" style={{ marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
          3D Vector Map Offline
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', maxWidth: '360px', marginBottom: '1rem' }}>
          WebGL vector tile rendering could not be initialized. Route and coordinate data remain accessible.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-secondary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={14} /> Retry 3D Map Engine
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '480px',
        borderRadius: '24px',
        overflow: 'hidden',
        border: '1px solid rgba(16, 185, 129, 0.28)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(16, 185, 129, 0.12)',
        background: '#080d18',
      }}
    >
      {/* MapLibre GL Canvas Container */}
      <div
        ref={mapContainer}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
        }}
      />

      {/* Floating 3D Map Header Badge */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          background: 'rgba(8, 13, 24, 0.88)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(52, 211, 153, 0.35)',
          borderRadius: '999px',
          padding: '6px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.78rem',
          color: '#34d399',
          fontWeight: 800,
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#00ff88',
            boxShadow: '0 0 10px #00ff88',
          }}
        />
        3D GEOSPATIAL SMART MOBILITY &bull; MAPLIBRE GL
      </div>

      {/* Floating Interactive Route Telemetry HUD */}
      {selectedRide && routeStats && (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            background: 'rgba(8, 13, 24, 0.92)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            borderRadius: '16px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <div>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              Est. Distance
            </span>
            <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: '1.05rem' }}>
              {routeStats.distance}
            </div>
          </div>
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '16px' }}>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              Travel Time
            </span>
            <div style={{ color: '#00ff88', fontWeight: 800, fontSize: '1.05rem' }}>
              {routeStats.duration}
            </div>
          </div>
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '16px' }}>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              Intermediate Stops
            </span>
            <div style={{ color: '#f59e0b', fontWeight: 800, fontSize: '1.05rem' }}>
              {routeStats.stops} Stops
            </div>
          </div>
        </div>
      )}

      {/* Interactive Drag & Compass Tip */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          background: 'rgba(8, 13, 24, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '999px',
          padding: '4px 12px',
          fontSize: '0.72rem',
          color: '#94a3b8',
          fontWeight: 700,
          backdropFilter: 'blur(8px)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        RIGHT CLICK / TWO FINGERS TO TILT & ROTATE IN 3D
      </div>
    </div>
  );
};

export default RouteMap3D;
