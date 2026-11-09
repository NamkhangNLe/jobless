import MapView, { Marker } from 'react-native-maps';

import type { Activity } from '@/models/Activity';
import { pinOffsetFor } from '@/lib/activityUtils';

export interface QuestMapProps {
  activities: Activity[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  center?: { latitude: number; longitude: number };
  showUserLocation?: boolean;
  joinedIds?: string[];
  /** Preview strip (e.g. the Home hero): fits pins but disables pan/zoom. */
  preview?: boolean;
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
      {activities.map((a) => {
        // Deterministic per-activity jitter so two quests at the exact same
        // coordinate never stack invisibly on top of each other.
        const { dLat, dLng } = pinOffsetFor(a.id);
        return (
          <Marker
            key={a.id}
            coordinate={{ latitude: a.latitude + dLat, longitude: a.longitude + dLng }}
            title={a.title}
            description={`${a.place} · ${a.time}`}
            pinColor={
              selectedId === a.id || joinedIds?.includes(a.id) ? '#FF4D2E' : '#8E8E93'
            }
            onPress={() => onSelect(a.id)}
          />
        );
      })}
    </MapView>
  );
}
