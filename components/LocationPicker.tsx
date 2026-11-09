import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';

/**
 * Native location picker: tap the map to drop the pin at the exact meeting
 * spot. The quest's coordinates are the spot the host chose — never a
 * hardcoded neighborhood centroid.
 */
export function LocationPicker({
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
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          onPress={(e) => {
            const c = e.nativeEvent.coordinate;
            onChange(c.latitude, c.longitude);
          }}>
          <Marker
            coordinate={{ latitude, longitude }}
            pinColor="#FF4D2E"
            draggable
            onDragEnd={(e) => {
              const c = e.nativeEvent.coordinate;
              onChange(c.latitude, c.longitude);
            }}
          />
        </MapView>
      </View>
      <ThemedText style={styles.hint}>
        Tap the map to move the pin to the exact meeting spot.
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
