import React, { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Text, View, StyleSheet, TextInput, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const activity = () => {
    const { activity } = useLocalSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [region, setRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [markers, setMarkers] = useState([]);

    const handleSearch = async () => {
        // Replace with your Apple Maps API search request
        const response = await fetch(`https://maps.apple.com/?q=${searchQuery}&key=YOUR_API_KEY`);
        const data = await response.json();
        setMarkers(data.results.map(result => ({
            latitude: result.geometry.location.lat,
            longitude: result.geometry.location.lng,
            title: result.name,
        })));
    };

    return (
        <View style={styles.container}>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">{activity} Search</ThemedText>
            </ThemedView>
            <TextInput
                style={styles.input}
                placeholder="Search for a place"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <Button title="Search" onPress={handleSearch} />
            <MapView style={styles.map} region={region}>
                {markers.map((marker, index) => (
                    <Marker
                        key={index}
                        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                        title={marker.title}
                    />
                ))}
            </MapView>
        </View>
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

export default activity;