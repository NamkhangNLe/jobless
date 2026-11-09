import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { StyleSheet, View } from 'react-native';

import type { Activity } from '@/models/Activity';
import type { QuestMapProps } from '@/components/QuestMap';
import { pinOffsetFor } from '@/lib/activityUtils';

const DEFAULT_CENTER = { latitude: 40.7484, longitude: -73.9775 };

/**
 * Editorial pin: an ink disc with the quest's first letter in mono type.
 * Joined or selected quests go coral and grow — the map stays list-first
 * Jobless, not Vamanos's emoji pins.
 */
function pinIcon(activity: Activity, active: boolean) {
  const letter = (activity.title.charAt(0) || '?').toUpperCase();
  const size = active ? 38 : 32;
  return new L.DivIcon({
    className: 'jobless-pin',
    html: `<div style="
        width: ${size}px; height: ${size}px; border-radius: 50%;
        background: ${active ? '#FF4D2E' : '#191919'};
        border: 2px solid #fff;
        box-shadow: 0 3px 10px rgba(0,0,0,0.35);
        color: #fff; font-family: ui-monospace, Menlo, monospace;
        font-weight: 800; font-size: 14px;
        display: flex; align-items: center; justify-content: center;
      ">${letter}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

/** Positions after the deterministic per-activity jitter (pins never stack). */
function pinPosition(a: Activity): [number, number] {
  const { dLat, dLng } = pinOffsetFor(a.id);
  return [a.latitude + dLat, a.longitude + dLng];
}

// Leaflet sizes itself once at mount; re-measure shortly after mount and on
// resize so tiles land in the settled container instead of rendering grey.
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const t1 = setTimeout(() => map.invalidateSize(), 100);
    const t2 = setTimeout(() => map.invalidateSize(), 600);
    const onResize = () => map.invalidateSize();
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', onResize);
    };
  }, [map]);
  return null;
}

// Fit the view to every pin on mount and whenever the pins move, so markers
// are on screen on load instead of miles off-screen. Capped at zoom 14 so a
// tight cluster doesn't zoom all the way in.
function MapFitter({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  const key = positions.map((p) => p.join(',')).join('|');
  useEffect(() => {
    if (positions.length === 0) return;
    const bounds = L.latLngBounds(positions);
    const fit = () => {
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 14 });
    };
    const t1 = setTimeout(fit, 150);
    const t2 = setTimeout(fit, 650);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [map, key]);
  return null;
}

/**
 * The real Leaflet map. Imported lazily (client-only) by QuestMap.web.tsx:
 * Leaflet touches `window` at import time, and expo-router's static render
 * runs in Node, so a top-level import here would crash the export.
 */
export default function LeafletQuestMap({ activities, selectedId, onSelect, center, joinedIds, preview }: QuestMapProps) {
  const c = center ?? DEFAULT_CENTER;
  const positions = useMemo(() => activities.map(pinPosition), [activities]);

  return (
    <View style={StyleSheet.absoluteFill}>
      <style>{`
        .leaflet-container { height: 100%; width: 100%; z-index: 1; font-family: inherit; }
        .jobless-pin { background: none; border: none; }
        .leaflet-control-zoom a { color: #191919 !important; }
      `}</style>
      <MapContainer
        center={[c.latitude, c.longitude]}
        zoom={12}
        scrollWheelZoom={!preview}
        dragging={!preview}
        doubleClickZoom={!preview}
        zoomControl={!preview}
        style={{ height: '100%', width: '100%' }}>
        <MapResizer />
        <MapFitter positions={positions} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {activities.map((a) => {
          const active = a.id === selectedId || joinedIds?.includes(a.id);
          return (
            <Marker
              key={a.id}
              position={pinPosition(a)}
              icon={pinIcon(a, !!active)}
              eventHandlers={{ click: () => onSelect(a.id) }}
            />
          );
        })}
      </MapContainer>
    </View>
  );
}
