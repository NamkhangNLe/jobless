import { Suspense, lazy } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import type { QuestMapProps } from '@/components/QuestMap';

// Leaflet touches `window` at import time and expo-router statically renders
// routes in Node during `expo export`, so the real map is code-split behind
// React.lazy: the static render (and first paint) gets this placeholder and
// the browser loads the interactive map on the client.
const LeafletQuestMap = lazy(() => import('@/components/LeafletQuestMap.web'));

function MapPlaceholder() {
  return (
    <View style={[StyleSheet.absoluteFill, styles.placeholder]}>
      <ThemedText style={styles.placeholderText}>Loading map…</ThemedText>
    </View>
  );
}

/**
 * Web map: interactive Leaflet + OpenStreetMap. Pan, zoom, and tap pins —
 * the old build was a static tile picture with a fixed zoom and center.
 * react-native-maps cannot bundle for web, so this file is the web
 * counterpart to QuestMap.tsx (same props).
 */
export default function QuestMap(props: QuestMapProps) {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Suspense fallback={<MapPlaceholder />}>
        <LeafletQuestMap {...props} />
      </Suspense>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: '#e8e4de',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    opacity: 0.6,
    fontSize: 14,
  },
});
