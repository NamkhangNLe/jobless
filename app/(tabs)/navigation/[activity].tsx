import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Text, View, StyleSheet, TextInput, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as Location from 'expo-location';

export default function activity(): JSX.Element {
    const { activity } = useLocalSearchParams();
    const [markers, setMarkers] = useState([]);
    const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
    
      useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.error('Permission to access location was denied');
            return;
          }
    
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location.coords);
        })();
      }, []);
    
      return (
        location ? (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              showsUserLocation={true}
            />
          ) : (
            <View style={styles.container}>
              <Text>Loading...</Text>
            </View>
          )
      );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: "15%", // Add padding to the top
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 10, // Add margin to the bottom
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 8,
    },
    map: {
        flex: 1,
    },
});
