import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { ActivityCard } from '@/components/ActivityCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSurfaceColor } from '@/hooks/useThemeColor';
import { useActivities } from '@/lib/store';
import { CATEGORIES, type ActivityCategory } from '@/models/Activity';

export default function ExploreScreen() {
  const { activities, isJoined } = useActivities();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ActivityCategory | 'All'>('All');
  const surface = useSurfaceColor();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return activities.filter((a) => {
      if (category !== 'All' && a.category !== category) return false;
      if (!q) return true;
      const haystack = [a.title, a.description, a.place, a.neighborhood, a.host.name, ...a.tags]
        .join(' ')
        .toLowerCase();
      return q.split(/\s+/).every((word) => haystack.includes(word));
    });
  }, [activities, query, category]);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ThemedText type="title">Explore</ThemedText>
        <ThemedText style={styles.subtitle}>
          Search quests by name, place, host, or vibe.
        </ThemedText>

        <TextInput
          style={styles.search}
          value={query}
          onChangeText={setQuery}
          placeholder="Search volleyball, coffee, hiking…"
          placeholderTextColor="#999"
          returnKeyType="search"
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
          {(['All', ...CATEGORIES] as const).map((c) => (
            <Pressable
              key={c}
              onPress={() => setCategory(c)}
              style={[styles.chip, { backgroundColor: surface }, category === c && styles.chipActive]}>
              <ThemedText style={[styles.chipText, category === c && styles.chipTextActive]}>
                {c}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.results}>
          <ThemedText style={styles.count}>
            {results.length} quest{results.length === 1 ? '' : 's'}
          </ThemedText>
          {results.map((a) => (
            <ActivityCard
              key={a.id}
              activity={a}
              joined={isJoined(a.id)}
              onPress={() =>
                router.push({ pathname: '/navigation/[activity]', params: { activity: a.id } })
              }
            />
          ))}
          {results.length === 0 && (
            <ThemedText style={styles.empty}>
              No quests match that. Try a different search, or start the quest yourself.
            </ThemedText>
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
  subtitle: {
    marginTop: 6,
    marginBottom: 16,
    opacity: 0.8,
  },
  search: {
    backgroundColor: '#F2F2F7',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 16,
    marginBottom: 14,
  },
  chips: {
    flexDirection: 'row',
    marginBottom: 8,
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
  results: {
    gap: 12,
    marginTop: 8,
  },
  count: {
    fontSize: 13,
    fontWeight: '700',
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  empty: {
    opacity: 0.7,
    marginTop: 8,
  },
});
