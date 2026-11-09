import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { ActivityCard } from '@/components/ActivityCard';
import QuestMap from '@/components/QuestMap';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSurfaceColor } from '@/hooks/useThemeColor';
import { useActivities } from '@/lib/store';
import { CATEGORIES, type ActivityCategory } from '@/models/Activity';

export default function HomeScreen() {
  const { activities, joinedIds, isJoined } = useActivities();
  const [filter, setFilter] = useState<ActivityCategory | 'All'>('All');
  const surface = useSurfaceColor();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const upcoming = useMemo(
    () => activities.filter((a) => joinedIds.includes(a.id)),
    [activities, joinedIds],
  );

  const visible = useMemo(
    () => (filter === 'All' ? activities : activities.filter((a) => a.category === filter)),
    [activities, filter],
  );

  const openActivity = (id: string) =>
    router.push({ pathname: '/navigation/[activity]', params: { activity: id } });

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ThemedText type="title">Find your people</ThemedText>
        <ThemedText style={styles.subtitle}>
          Side quests, pickup games, and people to do them with. No job required.
        </ThemedText>

        <Pressable
          style={({ pressed }) => [styles.createButton, pressed && { opacity: 0.88 }]}
          onPress={() => router.push('/activity/create')}>
          <ThemedText style={styles.createButtonText}>+ Start a new quest</ThemedText>
        </Pressable>

        {/* Hero: the board on a real map. List-first stays the identity —
            this strip is the visual, not the navigation. Tap a pin to open it. */}
        <View style={styles.heroMap}>
          <QuestMap
            activities={activities}
            selectedId={selectedId}
            preview
            onSelect={(id) => {
              setSelectedId(id);
              openActivity(id);
            }}
            joinedIds={joinedIds}
          />
          <View style={styles.heroMapLabel} pointerEvents="none">
            <ThemedText style={styles.heroMapLabelText}>
              {activities.length} quests on the map · tap a pin
            </ThemedText>
          </View>
        </View>

        {upcoming.length > 0 && (
          <View style={styles.section}>
            <ThemedText type="subtitle">Up next for you</ThemedText>
            {upcoming.map((a) => (
              <ActivityCard
                key={a.id}
                activity={a}
                joined
                onPress={() =>
                  router.push({ pathname: '/navigation/[activity]', params: { activity: a.id } })
                }
              />
            ))}
          </View>
        )}

        <View style={styles.section}>
          <ThemedText type="subtitle">All quests</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
            {(['All', ...CATEGORIES] as const).map((c) => (
              <Pressable
                key={c}
                onPress={() => setFilter(c)}
                style={[styles.chip, { backgroundColor: surface }, filter === c && styles.chipActive]}>
                <ThemedText style={[styles.chipText, filter === c && styles.chipTextActive]}>
                  {c}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>
          {visible.map((a) => (
            <ActivityCard
              key={a.id}
              activity={a}
              joined={isJoined(a.id)}
              onPress={() =>
                router.push({ pathname: '/navigation/[activity]', params: { activity: a.id } })
              }
            />
          ))}
          {visible.length === 0 && (
            <ThemedText style={styles.empty}>Nothing in this category yet. Start one!</ThemedText>
          )}
        </View>

        <ThemedText style={styles.footnote}>
          Sample board for now — quests and crews are listed examples. Joins are
          saved on this device only until accounts arrive.
        </ThemedText>
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
  subtitle: {
    marginTop: 6,
    marginBottom: 16,
    opacity: 0.8,
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
    marginTop: 8,
    gap: 14,
  },
  chips: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#191919',
    borderColor: '#191919',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#fff',
  },
  empty: {
    opacity: 0.7,
    marginTop: 8,
  },
  heroMap: {
    height: 190,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  heroMapLabel: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  heroMapLabelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  footnote: {
    fontSize: 13,
    lineHeight: 19,
    opacity: 0.55,
    marginTop: 24,
  },
});
