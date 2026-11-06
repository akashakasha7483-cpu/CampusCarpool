import React, { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  MapPin,
  Navigation,
  Compass,
  RefreshCw,
  Clock,
  Users,
  ShieldCheck,
  Zap,
  Play,
  Pause,
  Maximize2,
  Eye,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
} from '../Icons';
import {
  fetchRoadRoute,
  resolveLocationCoords,
  getPointAndBearingAtProgress,
  isValidLngLat,
} from '../../services/routeGeometryService';

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
        '&copy; <a href="https://carto.com/" target="_blank" rel="noopener noreferrer" style="color:#60a5fa;">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" style="color:#60a5fa;">OpenStreetMap</a>',
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

export const RouteMap3D = ({ selectedRide, onSelectLocation, focusedWaypointIndex = null }) => {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const vehicleMarkerRef = useRef(null);
  const vehicleElRef = useRef(null);
  const animFrameRef = useRef(null);

  // Map & Route State
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [routeData, setRouteData] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(false);

  // Interactive Playback State
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [animProgress, setAnimProgress] = useState(0);
  const [cameraMode, setCameraMode] = useState('overview'); // 'overview' | 'follow' | 'tour'

  // Refs for animation loop access without stale closures
  const isPlayingRef = useRef(isPlaying);
  const speedRef = useRef(speedMultiplier);
  const progressRef = useRef(0);
  const cameraModeRef = useRef(cameraMode);
  const routeDataRef = useRef(null);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    speedRef.current = speedMultiplier;
  }, [speedMultiplier]);

  useEffect(() => {
    cameraModeRef.current = cameraMode;
  }, [cameraMode]);

  useEffect(() => {
    routeDataRef.current = routeData;
  }, [routeData]);

  // 1. Initialize MapLibre GL
  useEffect(() => {
    if (!mapContainer.current) return;

    let map;
    try {
      map = new maplibregl.Map({
        container: mapContainer.current,
        style: CYBER_DARK_STYLE,
        center: [77.65, 12.925],
        zoom: 12,
        pitch: 48,
        bearing: -12,
        attributionControl: false,
      });

      // Custom Navigation Controls with Compass & Pitch
      map.addControl(
        new maplibregl.NavigationControl({
          visualizePitch: true,
          showCompass: true,
          showZoom: true,
        }),
        'top-right'
      );

      // Attribution Control
      map.addControl(
        new maplibregl.AttributionControl({
          compact: true,
        }),
        'bottom-right'
      );

      map.on('load', () => {
        setMapLoaded(true);
        setTimeout(() => {
          if (map) map.resize();
        }, 120);
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

  // 2. Fetch Real Road Geometry via OSRM when selectedRide changes
  useEffect(() => {
    let isCancelled = false;

    const loadCorridorRoute = async () => {
      if (!selectedRide) return;
      setLoadingRoute(true);

      const defaultSrc = [77.6229, 12.9177]; // Silk Board
      const defaultDest = [77.6848, 12.9237]; // Campus Main Gate

      const src = isValidLngLat(selectedRide.sourceCoords)
        ? selectedRide.sourceCoords
        : resolveLocationCoords(selectedRide.source, defaultSrc);

      const dest = isValidLngLat(selectedRide.destinationCoords)
        ? selectedRide.destinationCoords
        : resolveLocationCoords(selectedRide.destination, defaultDest);

      const rawWaypoints = selectedRide.waypoints || [];
      const rawWpCoords = selectedRide.waypointsCoords || [];
      const validWaypoints = [];

      rawWaypoints.forEach((wpText, idx) => {
        let coord = rawWpCoords[idx];
        if (!isValidLngLat(coord)) {
          coord = resolveLocationCoords(wpText, null);
        }
        if (isValidLngLat(coord)) {
          validWaypoints.push({ text: wpText, coord, index: idx + 1 });
        }
      });

      const fullRoutePoints = [src, ...validWaypoints.map((w) => w.coord), dest];

      try {
        const roadResult = await fetchRoadRoute(fullRoutePoints);
        if (!isCancelled) {
          setRouteData({
            ...roadResult,
            src,
            dest,
            validWaypoints,
          });
          // Reset animation to beginning
          progressRef.current = 0;
          setAnimProgress(0);
        }
      } catch (e) {
        console.error('Error fetching road route:', e);
      } finally {
        if (!isCancelled) setLoadingRoute(false);
      }
    };

    loadCorridorRoute();

    return () => {
      isCancelled = true;
    };
  }, [selectedRide]);

  // 3. Render Glowing Route Layers & Markers onto MapLibre
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !mapLoaded || !routeData) return;

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

    const { coordinates, src, dest, validWaypoints } = routeData;

    // A. Add or Update GeoJSON Source
    const routeGeoJSON = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates,
      },
    };

    if (map.getSource('cyber-route-data')) {
      map.getSource('cyber-route-data').setData(routeGeoJSON);
    } else {
      map.addSource('cyber-route-data', {
        type: 'geojson',
        data: routeGeoJSON,
      });

      // Layer 1: Outer Neon Violet Ambient Aura Glow
      map.addLayer({
        id: 'route-glow-outer',
        type: 'line',
        source: 'cyber-route-data',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#8b5cf6',
          'line-width': 14,
          'line-opacity': 0.45,
          'line-blur': 8,
        },
      });

      // Layer 2: Inner Electric Blue Corridor Glow
      map.addLayer({
        id: 'route-glow-inner',
        type: 'line',
        source: 'cyber-route-data',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#3b82f6',
          'line-width': 6,
          'line-opacity': 0.85,
          'line-blur': 3,
        },
      });

      // Layer 3: High-Intensity Cyan Core Beam
      map.addLayer({
        id: 'route-core',
        type: 'line',
        source: 'cyber-route-data',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#38bdf8',
          'line-width': 3,
          'line-opacity': 0.95,
        },
      });

      // Layer 4: Animated Dashed Pulse Line
      map.addLayer({
        id: 'route-pulse-dash',
        type: 'line',
        source: 'cyber-route-data',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#ffffff',
          'line-width': 1.8,
          'line-opacity': 0.75,
          'line-dasharray': [1, 3],
        },
      });
    }

    // B. Create Cyber Marker Helper
    const createCyberMarkerEl = (color, tag, label, iconHtml) => {
      const el = document.createElement('div');
      el.className = 'cyber-map-pin';
      el.style.display = 'inline-flex';
      el.style.alignItems = 'center';
      el.style.gap = '6px';
      el.style.background = 'rgba(7, 11, 20, 0.92)';
      el.style.border = `1.5px solid ${color}`;
      el.style.boxShadow = `0 0 16px ${color}66, 0 8px 24px rgba(0,0,0,0.7)`;
      el.style.padding = '5px 12px';
      el.style.borderRadius = '999px';
      el.style.cursor = 'pointer';
      el.style.backdropFilter = 'blur(10px)';
      el.style.color = '#ffffff';
      el.style.fontSize = '11px';
      el.style.fontWeight = '800';
      el.style.transition = 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)';
      el.innerHTML = `
        <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${color}; box-shadow:0 0 8px ${color};"></span>
        <span style="color:#94a3b8; font-size:10px; font-weight:700;">${tag}</span>
        <span style="color:#f8fafc; font-weight:700;">${label}</span>
      `;
      el.onmouseenter = () => {
        el.style.transform = 'scale(1.08)';
      };
      el.onmouseleave = () => {
        el.style.transform = 'scale(1.0)';
      };
      return el;
    };

    // 1. Pickup Origin Marker (Neon Emerald)
    const srcEl = createCyberMarkerEl('#10b981', 'PICKUP', selectedRide?.source || 'Origin', '📍');
    const srcMarker = new maplibregl.Marker({ element: srcEl, anchor: 'bottom' })
      .setLngLat(src)
      .setPopup(
        new maplibregl.Popup({ offset: 25, closeButton: false }).setHTML(`
          <div style="background:#070b14; color:#f8fafc; padding:10px 14px; border-radius:12px; border:1px solid #10b981; font-family:sans-serif; min-width:180px; box-shadow:0 10px 30px rgba(0,0,0,0.8);">
            <div style="color:#10b981; font-size:10px; font-weight:800; letter-spacing:0.05em; text-transform:uppercase;">Corridor Origin</div>
            <div style="font-size:13px; font-weight:800; margin-top:2px;">${selectedRide?.source || 'Origin Point'}</div>
            <div style="color:#94a3b8; font-size:11px; margin-top:4px;">Scheduled: ${selectedRide?.time || '08:30'} &bull; ${selectedRide?.date || 'Today'}</div>
          </div>
        `)
      )
      .addTo(map);
    markersRef.current.push(srcMarker);

    // 2. Intermediate Waypoint Markers (Neon Amber)
    validWaypoints.forEach((wp) => {
      const wpEl = createCyberMarkerEl('#f59e0b', `STOP ${wp.index}`, wp.text, '🟡');
      const wpMarker = new maplibregl.Marker({ element: wpEl, anchor: 'bottom' })
        .setLngLat(wp.coord)
        .setPopup(
          new maplibregl.Popup({ offset: 25, closeButton: false }).setHTML(`
            <div style="background:#070b14; color:#f8fafc; padding:10px 14px; border-radius:12px; border:1px solid #f59e0b; font-family:sans-serif; min-width:180px; box-shadow:0 10px 30px rgba(0,0,0,0.8);">
              <div style="color:#f59e0b; font-size:10px; font-weight:800; letter-spacing:0.05em; text-transform:uppercase;">Transit Stop #${wp.index}</div>
              <div style="font-size:13px; font-weight:800; margin-top:2px;">${wp.text}</div>
              <div style="color:#94a3b8; font-size:11px; margin-top:4px;">Intermediate passenger boarding station</div>
            </div>
          `)
        )
        .addTo(map);
      markersRef.current.push(wpMarker);
    });

    // 3. Drop-off Destination Marker (Electric Blue)
    const destEl = createCyberMarkerEl('#38bdf8', 'DESTINATION', selectedRide?.destination || 'Campus', '🏁');
    const destMarker = new maplibregl.Marker({ element: destEl, anchor: 'bottom' })
      .setLngLat(dest)
      .setPopup(
        new maplibregl.Popup({ offset: 25, closeButton: false }).setHTML(`
          <div style="background:#070b14; color:#f8fafc; padding:10px 14px; border-radius:12px; border:1px solid #38bdf8; font-family:sans-serif; min-width:180px; box-shadow:0 10px 30px rgba(0,0,0,0.8);">
            <div style="color:#38bdf8; font-size:10px; font-weight:800; letter-spacing:0.05em; text-transform:uppercase;">Campus Drop-off</div>
            <div style="font-size:13px; font-weight:800; margin-top:2px;">${selectedRide?.destination || 'Campus Gate'}</div>
            <div style="color:#94a3b8; font-size:11px; margin-top:4px;">Contribution: ₹${selectedRide?.pricePerSeat || 30} &bull; ${selectedRide?.availableSeats || 1} seats open</div>
          </div>
        `)
      )
      .addTo(map);
    markersRef.current.push(destMarker);

    // C. Animated 3D Vehicle Marker Element
    const vehicleDiv = document.createElement('div');
    vehicleDiv.className = 'cyber-animated-vehicle';
    vehicleDiv.style.width = '38px';
    vehicleDiv.style.height = '38px';
    vehicleDiv.style.borderRadius = '50%';
    vehicleDiv.style.background = '#070b14';
    vehicleDiv.style.border = '2px solid #38bdf8';
    vehicleDiv.style.boxShadow = '0 0 24px #3b82f6, 0 0 40px rgba(139, 92, 246, 0.5)';
    vehicleDiv.style.display = 'flex';
    vehicleDiv.style.alignItems = 'center';
    vehicleDiv.style.justifyContent = 'center';
    vehicleDiv.style.cursor = 'pointer';
    vehicleDiv.style.transformOrigin = 'center center';
    vehicleDiv.style.transition = 'transform 0.08s linear';
    vehicleDiv.innerHTML = `
      <div style="position:relative; width:100%; height:100%; display:flex; align-items:center; justify-content:center;">
        <!-- Forward Direction Indicator Arrow -->
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style="transform: rotate(90deg);">
          <path d="M12 2L19 21L12 17L5 21L12 2Z" fill="#38bdf8" stroke="#ffffff" stroke-width="1.5" stroke-linejoin="round"/>
        </svg>
        <!-- Pulse ring -->
        <span style="position:absolute; width:100%; height:100%; border-radius:50%; border:1px solid #8b5cf6; animation:pulse 2s infinite;"></span>
      </div>
    `;

    vehicleElRef.current = vehicleDiv;

    const vehicleMarker = new maplibregl.Marker({ element: vehicleDiv, anchor: 'center' })
      .setLngLat(coordinates[0])
      .addTo(map);
    vehicleMarkerRef.current = vehicleMarker;

    // D. Continuous Gliding Animation Loop with Tangent Bearing
    let lastTimestamp = performance.now();

    const animateLoop = (timestamp) => {
      const dt = Math.min(100, timestamp - lastTimestamp);
      lastTimestamp = timestamp;

      const currentRoute = routeDataRef.current;
      if (currentRoute && currentRoute.coordinates && isPlayingRef.current) {
        // Base pace: 1 full corridor run in ~30 seconds at 1x
        const step = (dt / 30000) * speedRef.current;
        let nextProgress = progressRef.current + step;
        if (nextProgress > 1) {
          nextProgress = 0; // Loop seamlessly
        }
        progressRef.current = nextProgress;
        setAnimProgress(nextProgress);

        const { point, bearing } = getPointAndBearingAtProgress(
          currentRoute.coordinates,
          currentRoute.cumulativeDistances,
          nextProgress
        );

        if (vehicleMarkerRef.current) {
          vehicleMarkerRef.current.setLngLat(point);
        }

        // Apply smooth geographic orientation rotation
        if (vehicleElRef.current) {
          vehicleElRef.current.style.transform = `rotate(${bearing - 90}deg)`;
        }

        // If Chase Cam mode is active, smoothly center map on vehicle
        if (cameraModeRef.current === 'follow' && mapInstance.current) {
          mapInstance.current.easeTo({
            center: point,
            bearing: bearing,
            pitch: 62,
            zoom: 15.2,
            duration: 80,
            easing: (t) => t,
          });
        }
      }

      animFrameRef.current = requestAnimationFrame(animateLoop);
    };

    animFrameRef.current = requestAnimationFrame(animateLoop);

    // Initial Camera Fit Bounds
    if (cameraMode === 'overview') {
      try {
        const bounds = new maplibregl.LngLatBounds();
        coordinates.forEach((coord) => bounds.extend(coord));
        map.fitBounds(bounds, {
          padding: { top: 80, bottom: 80, left: 80, right: 80 },
          pitch: 48,
          bearing: -12,
          duration: 1200,
          maxZoom: 14.5,
        });
      } catch (e) {
        console.warn('fitBounds error:', e);
      }
    }
  }, [routeData, mapLoaded]);

  // 4. Handle Focused Waypoint from Parent Page
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !routeData || focusedWaypointIndex === null) return;

    if (focusedWaypointIndex === 0 && routeData.src) {
      map.flyTo({ center: routeData.src, zoom: 15, pitch: 55, duration: 1200 });
    } else if (focusedWaypointIndex === -1 && routeData.dest) {
      map.flyTo({ center: routeData.dest, zoom: 15, pitch: 55, duration: 1200 });
    } else if (routeData.validWaypoints && routeData.validWaypoints[focusedWaypointIndex - 1]) {
      const wp = routeData.validWaypoints[focusedWaypointIndex - 1];
      map.flyTo({ center: wp.coord, zoom: 15, pitch: 55, duration: 1200 });
    }
  }, [focusedWaypointIndex, routeData]);

  // 5. Interactive Camera Controls
  const handleSetCameraOverview = useCallback(() => {
    setCameraMode('overview');
    const map = mapInstance.current;
    if (!map || !routeData) return;
    const bounds = new maplibregl.LngLatBounds();
    routeData.coordinates.forEach((c) => bounds.extend(c));
    map.fitBounds(bounds, {
      padding: { top: 80, bottom: 80, left: 80, right: 80 },
      pitch: 48,
      bearing: -12,
      duration: 1200,
    });
  }, [routeData]);

  const handleSetCameraFollow = useCallback(() => {
    setCameraMode('follow');
    const map = mapInstance.current;
    if (!map || !routeData) return;
    const { point, bearing } = getPointAndBearingAtProgress(
      routeData.coordinates,
      routeData.cumulativeDistances,
      progressRef.current
    );
    map.flyTo({
      center: point,
      pitch: 62,
      bearing: bearing,
      zoom: 15.2,
      duration: 1000,
    });
  }, [routeData]);

  const handleTourWaypoints = useCallback(() => {
    setCameraMode('tour');
    const map = mapInstance.current;
    if (!map || !routeData) return;

    const stops = [
      routeData.src,
      ...routeData.validWaypoints.map((w) => w.coord),
      routeData.dest,
    ];

    let currentIdx = 0;
    const flyNext = () => {
      if (currentIdx >= stops.length || cameraModeRef.current !== 'tour') return;
      map.flyTo({
        center: stops[currentIdx],
        zoom: 14.8,
        pitch: 56,
        bearing: currentIdx * 35,
        duration: 2200,
      });
      currentIdx++;
      setTimeout(flyNext, 2600);
    };

    flyNext();
  }, [routeData]);

  const handleScrubChange = (e) => {
    const val = parseFloat(e.target.value);
    progressRef.current = val;
    setAnimProgress(val);
    if (routeData && vehicleMarkerRef.current) {
      const { point, bearing } = getPointAndBearingAtProgress(
        routeData.coordinates,
        routeData.cumulativeDistances,
        val
      );
      vehicleMarkerRef.current.setLngLat(point);
      if (vehicleElRef.current) {
        vehicleElRef.current.style.transform = `rotate(${bearing - 90}deg)`;
      }
      if (cameraMode === 'follow' && mapInstance.current) {
        mapInstance.current.setCenter(point);
      }
    }
  };

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
          background: 'rgba(7, 11, 20, 0.95)',
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
          WebGL rendering could not be initialized on this display context. Route information remains accessible.
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
        minHeight: '520px',
        borderRadius: '24px',
        overflow: 'hidden',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(59, 130, 246, 0.15)',
        background: '#070b14',
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

      {/* Floating Status Badge (Top-Left) */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          background: 'rgba(7, 11, 20, 0.88)',
          backdropFilter: 'blur(14px)',
          border: routeData?.isFallback
            ? '1px solid rgba(245, 158, 11, 0.4)'
            : '1px solid rgba(59, 130, 246, 0.4)',
          borderRadius: '999px',
          padding: '6px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.75rem',
          color: routeData?.isFallback ? '#f59e0b' : '#38bdf8',
          fontWeight: 800,
          boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
          zIndex: 10,
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: routeData?.isFallback ? '#f59e0b' : '#38bdf8',
            boxShadow: `0 0 10px ${routeData?.isFallback ? '#f59e0b' : '#38bdf8'}`,
          }}
        />
        {loadingRoute ? (
          'CALCULATING ROAD GEOMETRY...'
        ) : routeData?.isFallback ? (
          'DIRECT CORRIDOR TRAJECTORY (ROAD DATA OFFLINE)'
        ) : (
          'VERIFIED OSRM ROAD CORRIDOR &bull; 3D FLIGHT DECK'
        )}
      </div>

      {/* Camera Mode Selectors (Top-Center / Right) */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '56px',
          display: 'flex',
          gap: '6px',
          background: 'rgba(7, 11, 20, 0.88)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '999px',
          padding: '4px',
          zIndex: 10,
        }}
      >
        <button
          onClick={handleSetCameraOverview}
          style={{
            background: cameraMode === 'overview' ? 'rgba(59, 130, 246, 0.3)' : 'transparent',
            border: cameraMode === 'overview' ? '1px solid #3b82f6' : '1px solid transparent',
            color: cameraMode === 'overview' ? '#60a5fa' : '#94a3b8',
            borderRadius: '999px',
            padding: '4px 10px',
            fontSize: '0.72rem',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          Overview
        </button>
        <button
          onClick={handleSetCameraFollow}
          style={{
            background: cameraMode === 'follow' ? 'rgba(139, 92, 246, 0.3)' : 'transparent',
            border: cameraMode === 'follow' ? '1px solid #8b5cf6' : '1px solid transparent',
            color: cameraMode === 'follow' ? '#c084fc' : '#94a3b8',
            borderRadius: '999px',
            padding: '4px 10px',
            fontSize: '0.72rem',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          Chase Cam
        </button>
        <button
          onClick={handleTourWaypoints}
          style={{
            background: cameraMode === 'tour' ? 'rgba(16, 185, 129, 0.3)' : 'transparent',
            border: cameraMode === 'tour' ? '1px solid #10b981' : '1px solid transparent',
            color: cameraMode === 'tour' ? '#34d399' : '#94a3b8',
            borderRadius: '999px',
            padding: '4px 10px',
            fontSize: '0.72rem',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          Tour Stops
        </button>
      </div>

      {/* Floating Real-Time Telemetry HUD (Bottom-Left) */}
      {selectedRide && routeData && (
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '20px',
            background: 'rgba(7, 11, 20, 0.94)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(59, 130, 246, 0.35)',
            borderRadius: '18px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            boxShadow: '0 12px 36px rgba(0,0,0,0.7)',
            zIndex: 10,
          }}
        >
          <div>
            <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
              Road Distance
            </span>
            <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em' }}>
              {routeData.totalDistanceKm} km
            </div>
          </div>
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '16px' }}>
            <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
              Transit Time
            </span>
            <div style={{ color: '#38bdf8', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em' }}>
              ~{routeData.totalDurationMins} mins
            </div>
          </div>
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '16px' }}>
            <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
              Waypoints
            </span>
            <div style={{ color: '#f59e0b', fontWeight: 800, fontSize: '1.05rem' }}>
              {routeData.validWaypoints.length} Stops
            </div>
          </div>
        </div>
      )}

      {/* Playback & Scrubber Controls (Bottom-Right) */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          right: '20px',
          background: 'rgba(7, 11, 20, 0.94)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(139, 92, 246, 0.35)',
          borderRadius: '18px',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.7)',
          zIndex: 10,
        }}
      >
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          style={{
            background: isPlaying ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.5)',
            color: '#38bdf8',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          title={isPlaying ? 'Pause Vehicle Travel' : 'Start Vehicle Travel'}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>

        {/* Speed multiplier toggle */}
        <button
          onClick={() => {
            const next = speedMultiplier === 1 ? 2 : speedMultiplier === 2 ? 4 : 1;
            setSpeedMultiplier(next);
          }}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#c084fc',
            borderRadius: '999px',
            padding: '3px 8px',
            fontSize: '0.72rem',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          {speedMultiplier}x
        </button>

        {/* Interactive Scrub Slider */}
        <input
          type="range"
          min="0"
          max="1"
          step="0.001"
          value={animProgress}
          onChange={handleScrubChange}
          style={{
            width: '100px',
            accentColor: '#38bdf8',
            cursor: 'pointer',
          }}
          title={`Corridor Progress: ${(animProgress * 100).toFixed(0)}%`}
        />

        <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, minWidth: '32px' }}>
          {(animProgress * 100).toFixed(0)}%
        </span>
      </div>
    </div>
  );
};

export default RouteMap3D;
