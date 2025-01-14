import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Collapsible from '@/components/Collapsible';

export default function ExploreScreen() {
  const navigation = useNavigation();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <MaterialCommunityIcons
          name="bee"
          size={100}
          color="black"
          style={styles.friendsLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Profile</ThemedText>
      </ThemedView>
      <ThemedText>A list of what activities you have subscribed to and people have subsribed to you for.</ThemedText>
      <Collapsible title="Volleyball">
        <ThemedText>
          Looking to find people to play with? Well you've come to the right place.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Grocery Shopping">
        <ThemedText>
          Looking to find people to get groceries with? Need someone with a{' '}
          <ThemedText type="defaultSemiBold">Costco</ThemedText> card?
          Well you've come to the right place.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Exploring">
        <ThemedText>
          Looking to find people to explore Atlanta with?
          Need someone to be{' '}
          <ThemedText type="defaultSemiBold">jobless</ThemedText> with?
          Well you've come to the right place.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Studying">
        <ThemedText>
          Looking to find people to lock in at the{' '}
          <ThemedText type="defaultSemiBold">library</ThemedText> with?
          Well you've come to the right place.
        </ThemedText>
      </Collapsible>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('adventure')}
      >
        <Text style={styles.buttonText}>Begin Adventure</Text>
      </TouchableOpacity>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  friendsLogo: {
    height: '100%',
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  titleContainer: {
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    margin: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});