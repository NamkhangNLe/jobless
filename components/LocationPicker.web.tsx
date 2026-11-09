import { Suspense, lazy } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';

// Leaflet touches `window` at import time and expo-router statically renders
// routes in Node during `expo export`, so the real picker map is code-split
// behind React.lazy; the static render gets this placeholder instead.
const LeafletLocationPicker = lazy(() => import('@/components/LeafletLocationPicker.web'));

export type LocationPickerProps = {
  latitude: number;
  longitude: number;
  onChange: (latitude: number, longitude: number) => void;
};

/**
 * Web location picker: a real Leaflet map. Tap anywhere to drop the pin;
 * drag the pin to nudge it. The quest's coordinates are the exact spot the
 * host chose — never a hardcoded neighborhood centroid.
 */
export function LocationPicker(props: LocationPickerProps) {
  return (
    <Suspense
      fallback={
        <View style={styles.mapBox}>
          <ThemedText style={styles.placeholderText}>Loading map…</ThemedText>
        </View>
      }>
      <LeafletLocationPicker {...props} />
    </Suspense>
  );
}

const styles = StyleSheet.create({
  mapBox: {
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 6,
    backgroundColor: '#e8e4de',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    opacity: 0.6,
    fontSize: 14,
  },
});
