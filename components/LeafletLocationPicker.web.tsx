import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';

const pinIcon = new L.DivIcon({
  className: 'jobless-pin',
  html: `<div style="
      width: 34px; height: 34px; border-radius: 50%;
      background: #FF4D2E; border: 2px solid #fff;
      box-shadow: 0 3px 10px rgba(0,0,0,0.35);
      color: #fff; font-size: 18px; font-weight: 800;
      display: flex; align-items: center; justify-content: center;
    ">✦</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

function ClickToPlace({
  onChange,
}: {
  onChange: (latitude: number, longitude: number) => void;
}) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

/**
 * The real tap-to-place Leaflet map. Imported lazily (client-only) by
 * LocationPicker.web.tsx: Leaflet touches `window` at import time, and
 * expo-router's static render runs in Node.
 */
export default function LeafletLocationPicker({
  latitude,
  longitude,
  onChange,
}: {
  latitude: number;
  longitude: number;
  onChange: (latitude: number, longitude: number) => void;
}) {
  return (
    <View>
      <View style={styles.mapBox}>
        <style>{`
          .leaflet-container { height: 100%; width: 100%; z-index: 1; }
          .jobless-pin { background: none; border: none; }
        `}</style>
        <MapContainer
          center={[latitude, longitude]}
          zoom={14}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickToPlace onChange={onChange} />
          <Marker
            position={[latitude, longitude]}
            icon={pinIcon}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const ll = (e.target as L.Marker).getLatLng();
                onChange(ll.lat, ll.lng);
              },
            }}
          />
        </MapContainer>
      </View>
      <ThemedText style={styles.hint}>
        Tap the map to move the pin to the exact meeting spot. Drag the pin to nudge it.
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  mapBox: {
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 6,
  },
  hint: {
    fontSize: 13,
    opacity: 0.65,
    marginTop: 8,
  },
});
