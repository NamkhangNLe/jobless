import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { ActivityCard } from '@/components/ActivityCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useActivities } from '@/lib/store';

export default function ProfileScreen() {
  const { activities, joinedIds, isJoined } = useActivities();

  const joined = useMemo(
    () => activities.filter((a) => joinedIds.includes(a.id)),
    [activities, joinedIds],
  );
  const hosted = useMemo(() => activities.filter((a) => a.createdByMe), [activities]);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <ThemedText style={styles.avatarText}>YO</ThemedText>
          </View>
          <ThemedText type="title">You</ThemedText>
          <ThemedText style={styles.sub}>
            {joined.length} quest{joined.length === 1 ? '' : 's'} joined · {hosted.length} hosted
          </ThemedText>
        </View>

        <Pressable
          style={({ pressed }) => [styles.createButton, pressed && { opacity: 0.88 }]}
          onPress={() => router.push('/activity/create')}>
          <ThemedText style={styles.createButtonText}>+ Start a new quest</ThemedText>
        </Pressable>

        <View style={styles.section}>
          <ThemedText type="subtitle">My quests</ThemedText>
          {joined.length === 0 ? (
            <ThemedText style={styles.empty}>
              You haven&apos;t joined anything yet. Go find a quest on Home or Explore.
            </ThemedText>
          ) : (
            joined.map((a) => (
              <ActivityCard
                key={a.id}
                activity={a}
                joined
                onPress={() =>
                  router.push({ pathname: '/navigation/[activity]', params: { activity: a.id } })
                }
              />
            ))
          )}
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Hosted by me</ThemedText>
          {hosted.length === 0 ? (
            <ThemedText style={styles.empty}>
              You haven&apos;t hosted a quest yet. Start one and people will come.
            </ThemedText>
          ) : (
            hosted.map((a) => (
              <ActivityCard
                key={a.id}
                activity={a}
                joined={isJoined(a.id)}
                onPress={() =>
                  router.push({ pathname: '/navigation/[activity]', params: { activity: a.id } })
                }
              />
            ))
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    paddingTop: 64,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    gap: 4,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FF4D2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#FF4D2E',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  avatarText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
  },
  sub: {
    opacity: 0.65,
    fontSize: 15,
  },
  createButton: {
    backgroundColor: '#FF4D2E',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#FF4D2E',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: -0.2,
  },
  section: {
    gap: 12,
    marginTop: 8,
  },
  empty: {
    opacity: 0.7,
  },
});
