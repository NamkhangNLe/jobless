import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function NotFoundScreen() {
  const muted = useThemeColor({}, 'textMuted');
  const tint = useThemeColor({}, 'tint');

  return (
    <>
      <Stack.Screen options={{ title: 'Off the map' }} />
      <ThemedView style={styles.container}>
        <View style={styles.copy}>
          <ThemedText type="kicker" style={{ color: muted }}>
            Error · uncharted territory
          </ThemedText>
          <ThemedText type="display">Off the map.</ThemedText>
          <ThemedText style={{ color: muted }}>
            This side quest does not exist yet. The board knows the way back.
          </ThemedText>
        </View>
        <Link href="/" style={[styles.link, { color: tint }]}>
          <ThemedText type="link" style={{ color: tint }}>
            Back to base camp
          </ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 24,
    gap: 24,
  },
  copy: {
    gap: 14,
  },
  link: {
    paddingVertical: 8,
  },
});
