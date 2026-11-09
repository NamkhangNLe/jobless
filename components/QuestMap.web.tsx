import { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import type { Activity } from '@/models/Activity';
import type { QuestMapProps } from '@/components/QuestMap';

const TILE = 256;
const ZOOM = 12;
const DEFAULT_CENTER = { latitude: 40.7484, longitude: -73.9775 };

/** Float tile coordinates for a lon/lat at the given zoom. */
function lonLatToTile(lon: number, lat: number, zoom: number) {
  const n = Math.pow(2, zoom);
  const x = ((lon + 180) / 360) * n;
  const latRad = (lat * Math.PI) / 180;
  const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;
  return { x, y };
}

/**
 * Web map: OpenStreetMap tiles with activity pins projected from lat/lng.
 * react-native-maps cannot bundle for web (it imports native-only modules),
 * so the web build uses this tile map instead. Same props as QuestMap.
 */
export default function QuestMap({ activities, selectedId, onSelect, center, joinedIds }: QuestMapProps) {
  const [size, setSize] = useState({ width: 800, height: 480 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) setSize({ width, height });
  };

  const c = center ?? DEFAULT_CENTER;
  const centerTile = useMemo(() => lonLatToTile(c.longitude, c.latitude, ZOOM), [c]);

  const tiles = useMemo(() => {
    const cols = Math.ceil(size.width / TILE) + 2;
    const rows = Math.ceil(size.height / TILE) + 2;
    const x0 = Math.floor(centerTile.x - cols / 2);
    const y0 = Math.floor(centerTile.y - rows / 2);
    const list: { x: number; y: number; left: number; top: number }[] = [];
    for (let dx = 0; dx < cols; dx++) {
      for (let dy = 0; dy < rows; dy++) {
        list.push({
          x: x0 + dx,
          y: y0 + dy,
          left: size.width / 2 + (x0 + dx - centerTile.x) * TILE,
          top: size.height / 2 + (y0 + dy - centerTile.y) * TILE,
        });
      }
    }
    return list;
  }, [size, centerTile]);

  const pins = useMemo(
    () =>
      activities.map((a) => {
        const t = lonLatToTile(a.longitude, a.latitude, ZOOM);
        return {
          activity: a,
          left: size.width / 2 + (t.x - centerTile.x) * TILE,
          top: size.height / 2 + (t.y - centerTile.y) * TILE,
        };
      }),
    [activities, size, centerTile],
  );

  return (
    <View style={styles.container} onLayout={onLayout}>
      {tiles.map((t) => (
        <Image
          key={`${t.x}-${t.y}`}
          source={{ uri: `https://tile.openstreetmap.org/${ZOOM}/${t.x}/${t.y}.png` }}
          style={[styles.tile, { left: t.left, top: t.top }]}
        />
      ))}
      {pins.map(({ activity, left, top }) => {
        const isSelected = activity.id === selectedId;
        const isJoined = joinedIds?.includes(activity.id);
        return (
          <Pressable
            key={activity.id}
            onPress={() => onSelect(activity.id)}
            style={[
              styles.pin,
              { left: left - 16, top: top - 16 },
              (isSelected || isJoined) && styles.pinSelected,
            ]}>
            <ThemedText style={styles.pinText}>{activity.title.charAt(0)}</ThemedText>
          </Pressable>
        );
      })}
      <View style={styles.attribution}>
        <ThemedText style={styles.attributionText}>© OpenStreetMap contributors</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#e8e4de',
    position: 'relative',
  },
  tile: {
    position: 'absolute',
    width: TILE,
    height: TILE,
  },
  pin: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#191919',
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  pinSelected: {
    backgroundColor: '#FF4D2E',
    transform: [{ scale: 1.25 }],
  },
  pinText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
  attribution: {
    position: 'absolute',
    bottom: 6,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  attributionText: {
    fontSize: 10,
    color: '#555',
  },
});
