import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { MapPin, Navigation, Eye, AlertCircle, Compass, RefreshCw } from '../Icons';

export const RouteMap3D = ({ selectedRide, onSelectLocation }) => {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Default coordinate center (Bangalore Tech & College Corridor)
  const defaultCenter = [77.64, 12.93];

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
        center: defaultCenter,
        zoom: 11.5,
        pitch: 45,
        bearing: -15,
        attributionControl: false,
      });

      // Add navigation controls (Zoom, Pitch, Compass)
      map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');

      map.on('load', () => {
        setMapLoaded(true);
      });

      map.on('error', (e) => {
        console.warn('MapLibre GL Notice:', e);
      });

      // Allow choosing location on click
      map.on('click', (e) => {
        if (onSelectLocation) {
          onSelectLocation([e.lngLat.lng, e.lngLat.lat]);
        }
      });

      mapInstance.current = map;

      return () => {
        markersRef.current.forEach((m) => m.remove());
        map.remove();
      };
    } catch (err) {
      console.error('Failed to initialize MapLibre GL:', err);
      setMapError(true);
    }
  }, []);

  // Update map when selectedRide changes
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !mapLoaded || !selectedRide) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Remove existing route source/layers if present
    if (map.getSource('cyber-route')) {
      if (map.getLayer('cyber-route-line')) map.removeLayer('cyber-route-line');
      if (map.getLayer('cyber-route-glow')) map.removeLayer('cyber-route-glow');
      map.removeSource('cyber-route');
    }

    const src = selectedRide.sourceCoords || [77.6229, 12.9177];
    const dest = selectedRide.destinationCoords || [77.6848, 12.9237];
    const wps = selectedRide.waypointsCoords || [];

    // Assemble full coordinates path: Source -> Waypoint 1..N -> Destination
    const routeCoords = [src, ...wps, dest];

    // Helper: Create custom neon HTML marker
    const createNeonMarker = (color, text, type) => {
      const el = document.createElement('div');
      el.className = 'cyber-map-marker';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.gap = '4px';
      el.style.background = '#080d18';
      el.style.border = `2px solid ${color}`;
      el.style.boxShadow = `0 0 16px ${color}, inset 0 0 8px ${color}`;
      el.style.color = '#ffffff';
      el.style.fontSize = '11px';
      el.style.fontWeight = '800';
      el.style.padding = '4px 10px';
      el.style.borderRadius = '999px';
      el.style.cursor = 'pointer';
      el.style.whiteSpace = 'nowrap';
      el.innerHTML = `<span style="width:6px; height:6px; border-radius:50%; background:${color}; box-shadow:0 0 6px ${color};"></span> ${type}: ${text}`;
      return el;
    };

    // 1. Pickup Marker (Neon Emerald)
    const srcEl = createNeonMarker('#10b981', selectedRide.source, 'Pickup');
    const srcMarker = new maplibregl.Marker({ element: srcEl })
      .setLngLat(src)
      .setPopup(
        new maplibregl.Popup({ offset: 25 }).setHTML(`
          <div style="color:#0f172a; padding:6px; font-family:sans-serif;">
            <strong style="color:#059669;">Pickup Origin</strong><br/>
            ${selectedRide.source}<br/>
            <small>Departure: ${selectedRide.time || '08:30'}</small>
          </div>
        `)
      )
      .addTo(map);
    markersRef.current.push(srcMarker);

    // 2. Waypoint Markers (Neon Amber)
    (selectedRide.waypoints || []).forEach((wpText, idx) => {
      const wpCoord = wps[idx];
      if (wpCoord) {
        const wpEl = createNeonMarker('#f59e0b', wpText, `Stop ${idx + 1}`);
        const wpMarker = new maplibregl.Marker({ element: wpEl })
          .setLngLat(wpCoord)
          .setPopup(
            new maplibregl.Popup({ offset: 25 }).setHTML(`
              <div style="color:#0f172a; padding:6px; font-family:sans-serif;">
                <strong style="color:#d97706;">Intermediate Stop #${idx + 1}</strong><br/>
                ${wpText}
              </div>
            `)
          )
          .addTo(map);
        markersRef.current.push(wpMarker);
      }
    });

    // 3. Drop-off Marker (Neon Cyan)
    const destEl = createNeonMarker('#38bdf8', selectedRide.destination, 'Drop-off');
    const destMarker = new maplibregl.Marker({ element: destEl })
      .setLngLat(dest)
      .setPopup(
        new maplibregl.Popup({ offset: 25 }).setHTML(`
          <div style="color:#0f172a; padding:6px; font-family:sans-serif;">
            <strong style="color:#0284c7;">Destination Drop-off</strong><br/>
            ${selectedRide.destination}<br/>
            <small>Seats: ${selectedRide.availableSeats} open</small>
          </div>
        `)
      )
      .addTo(map);
    markersRef.current.push(destMarker);

    // Add glowing animated Cyber Route Line
    map.addSource('cyber-route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: routeCoords,
        },
      },
    });

    // Glow underlayer
    map.addLayer({
      id: 'cyber-route-glow',
      type: 'line',
      source: 'cyber-route',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color': '#10b981',
        'line-width': 10,
        'line-opacity': 0.35,
        'line-blur': 4,
      },
    });

    // Core sharp neon line
    map.addLayer({
      id: 'cyber-route-line',
      type: 'line',
      source: 'cyber-route',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color': '#34d399',
        'line-width': 4,
        'line-opacity': 0.95,
      },
    });

    // Fit camera to full route bounds
    const bounds = new maplibregl.LngLatBounds();
    routeCoords.forEach((coord) => bounds.extend(coord));
    map.fitBounds(bounds, {
      padding: { top: 90, bottom: 90, left: 90, right: 90 },
      pitch: 50,
      bearing: -20,
      duration: 1600,
    });
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
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <AlertCircle size={40} color="#f59e0b" style={{ marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
          3D Vector Map Offline
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', maxWidth: '360px' }}>
          Vector tile rendering unavailable in this client environment. Route and coordinate data remain accessible.
        </p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '480px', borderRadius: '24px', overflow: 'hidden' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%', minHeight: '480px' }} />

      {/* Floating 3D Map Badge */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          background: 'rgba(8, 13, 24, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(52, 211, 153, 0.3)',
          borderRadius: '12px',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.78rem',
          color: '#34d399',
          fontWeight: 700,
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          pointerEvents: 'none',
        }}
      >
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
        3D CYBER ROUTE ENGINE &bull; MAPLIBRE GL
      </div>
    </div>
  );
};

export default RouteMap3D;
