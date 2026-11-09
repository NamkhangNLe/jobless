import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { ActivityCard } from '@/components/ActivityCard';
import QuestMap from '@/components/QuestMap';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSurfaceColor } from '@/hooks/useThemeColor';
import { useActivities } from '@/lib/store';

export default function MapsScreen() {
  const { activities, isJoined, joinedIds } = useActivities();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const surface = useSurfaceColor();

  const selected = useMemo(
    () => activities.find((a) => a.id === selectedId) ?? null,
    [activities, selectedId],
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.mapWrap}>
        <QuestMap
          activities={activities}
          selectedId={selectedId}
          onSelect={setSelectedId}
          joinedIds={joinedIds}
        />
        <View style={styles.mapLabel}>
          <ThemedText style={styles.mapLabelText}>
            {activities.length} quests near NYC · tap a pin to preview
          </ThemedText>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {selected && (
          <View style={styles.selected}>
            <ThemedText type="subtitle">Selected</ThemedText>
            <ActivityCard
              activity={selected}
              joined={isJoined(selected.id)}
              onPress={() =>
                router.push({ pathname: '/navigation/[activity]', params: { activity: selected.id } })
              }
            />
          </View>
        )}
        <ThemedText type="subtitle">All quests on the map</ThemedText>
        {activities.map((a) => (
          <Pressable key={a.id} onPress={() => setSelectedId(a.id)}>
            <View
              style={[styles.row, { backgroundColor: surface }, selectedId === a.id && styles.rowSelected]}>
              <ThemedText style={styles.rowTitle}>{a.title}</ThemedText>
              <ThemedText style={styles.rowMeta}>
                {a.place} · {a.neighborhood}
              </ThemedText>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapWrap: {
    height: '46%',
    position: 'relative',
  },
  mapLabel: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  mapLabelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  list: {
    padding: 20,
    paddingBottom: 120,
    gap: 12,
  },
  selected: {
    gap: 12,
  },
  row: {
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  rowSelected: {
    borderColor: '#FF4D2E',
    borderWidth: 2,
    padding: 13,
  },
  rowTitle: {
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: -0.2,
  },
  rowMeta: {
    fontSize: 13,
    opacity: 0.7,
    marginTop: 2,
  },
});
