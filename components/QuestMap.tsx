import MapView, { Marker } from 'react-native-maps';

import type { Activity } from '@/models/Activity';

export interface QuestMapProps {
  activities: Activity[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  center?: { latitude: number; longitude: number };
  showUserLocation?: boolean;
  joinedIds?: string[];
}

const DEFAULT_CENTER = { latitude: 40.7484, longitude: -73.9775 };

/**
 * Native map (iOS/Android) backed by react-native-maps.
 * The web build uses QuestMap.web.tsx instead, so this file is never
 * bundled for web (react-native-maps imports native-only modules).
 */
export default function QuestMap({
  activities,
  selectedId,
  onSelect,
  center,
  showUserLocation,
  joinedIds,
}: QuestMapProps) {
  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: center?.latitude ?? DEFAULT_CENTER.latitude,
        longitude: center?.longitude ?? DEFAULT_CENTER.longitude,
        latitudeDelta: 0.12,
        longitudeDelta: 0.12,
      }}
      showsUserLocation={showUserLocation}>
      {activities.map((a) => (
        <Marker
          key={a.id}
          coordinate={{ latitude: a.latitude, longitude: a.longitude }}
          title={a.title}
          description={`${a.place} · ${a.time}`}
          pinColor={
            selectedId === a.id || joinedIds?.includes(a.id) ? '#FF4D2E' : '#8E8E93'
          }
          onPress={() => onSelect(a.id)}
        />
      ))}
    </MapView>
  );
}
