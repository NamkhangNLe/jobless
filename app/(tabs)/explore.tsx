import { TouchableOpacity, StyleSheet, Image, Platform, Animated } from 'react-native';
import { Link, router } from "expo-router";
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <Image
          source={require('@/assets/images/friends.png')}
          style={styles.friendsLogo}
          />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Profile</ThemedText>
      </ThemedView>
      <ThemedText>A list of what activities you have subscribed to and people have subsribed to you for.</ThemedText>
      <TouchableOpacity onPress={() => router.push("/navigation/Volleyball")}>
        <Animated.View style={styles.animatedButton}>
            <ThemedText type="defaultSemiBold">Volleyball</ThemedText>
        </Animated.View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/navigation/Grocery Shopping")}>
        <Animated.View style={styles.animatedButton}>
            <ThemedText type="defaultSemiBold">Grocery Shopping</ThemedText>
        </Animated.View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/navigation/Exploring")}>
        <Animated.View style={styles.animatedButton}>
            <ThemedText type="defaultSemiBold">Exploring</ThemedText>
        </Animated.View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/navigation/Food")}>
        <Animated.View style={styles.animatedButton}>
            <ThemedText type="defaultSemiBold">Food</ThemedText>
        </Animated.View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/navigation/Studying")}>
        <Animated.View style={styles.animatedButton}>
            <ThemedText type="defaultSemiBold">Studying</ThemedText>
        </Animated.View>
      </TouchableOpacity>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  animatedButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  friendsLogo: {
    height: '100%',
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});