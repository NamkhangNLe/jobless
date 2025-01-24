import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, StyleSheet, TextInput, TouchableOpacity, Animated, Button } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const Activity = () => {
    const { activity } = useLocalSearchParams();
    const [destination, setDestination] = React.useState('');

    const handleInputChange = (input: string) => {
        setDestination(input);
    }

    const handlePress = () => {
        router.push('/quest/', { destination });
    };

    return (
        <View style={styles.container}>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">{activity} Quest</ThemedText>
            </ThemedView>
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                onChangeText={handleInputChange}
                value={destination}
                placeholder="Enter your destination"
            />
            <Button title="Vamanos!" onPress={handlePress} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        marginBottom: 20,
    },
    animatedButton: {
        backgroundColor: '#FF6347',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
      },
});

export default Activity;