import { StyleSheet, Image, Platform } from 'react-native';

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
      <Collapsible title="Food">
        <ThemedText>
          Looking to find people to be{' '}
          <ThemedText style={{ fontFamily: 'SpaceMono' }}>
            big back
          </ThemedText>
          {' '}with? Well you've come to the right place.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Studying">
        <ThemedText>
          Looking to find people to lock in at the{' '}
          <ThemedText type="defaultSemiBold">library</ThemedText> with?
          Well you've come to the right place.
        </ThemedText>
      </Collapsible>
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
  friendsLogo: {
    height: '100%',
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});