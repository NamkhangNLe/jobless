import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';

import QuestMap from '@/components/QuestMap';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

/**
 * Fallback screen for unknown routes. Shows your location on the map
 * (the "journey" view) with a way back home.
 */
export default function NotFoundScreen() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const current = await Location.getCurrentPositionAsync({});
      setLocation(current.coords);
    })();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.mapWrap}>
        <QuestMap
          activities={[]}
          selectedId={null}
          onSelect={() => {}}
          center={
            location
              ? { latitude: location.latitude, longitude: location.longitude }
              : undefined
          }
          showUserLocation
        />
      </View>
      <View style={styles.body}>
        <ThemedText type="title">You&apos;re off the map</ThemedText>
        <ThemedText style={styles.sub}>
          This screen doesn&apos;t exist. Your location is above, head back to find a quest.
        </ThemedText>
        <Pressable style={styles.button} onPress={() => router.replace('/')}>
          <ThemedText style={styles.buttonText}>Back home</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapWrap: {
    height: '50%',
  },
  body: {
    padding: 20,
    gap: 10,
  },
  sub: {
    opacity: 0.8,
  },
  button: {
    backgroundColor: '#FF4D2E',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#FF4D2E',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
