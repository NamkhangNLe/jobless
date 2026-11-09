import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { LocationPicker } from '@/components/LocationPicker';
import { QuestDateTimePicker } from '@/components/QuestDateTimePicker';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSurfaceColor } from '@/hooks/useThemeColor';
import { useActivities, type NewActivityInput } from '@/lib/store';
import { isValidIsoDate, isValidTime12h, parseActivityDateTime } from '@/lib/activityUtils';
import { CATEGORIES, type ActivityCategory } from '@/models/Activity';

const SPOTS: Record<string, { lat: number; lng: number }> = {
  'Central Park': { lat: 40.7812, lng: -73.9665 },
  'Midtown': { lat: 40.7549, lng: -73.984 },
  'Williamsburg': { lat: 40.7081, lng: -73.9571 },
  'Greenwich Village': { lat: 40.7336, lng: -74.0027 },
  'Astoria': { lat: 40.772, lng: -73.9301 },
  'Flatiron': { lat: 40.7411, lng: -73.9897 },
  'Union Square': { lat: 40.7359, lng: -73.9911 },
  'DUMBO': { lat: 40.7033, lng: -73.992 },
  'Gowanus': { lat: 40.6736, lng: -73.9917 },
  'Upper East Side': { lat: 40.7736, lng: -73.9566 },
};

function defaultDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().slice(0, 10);
}

export default function CreateActivityScreen() {
  const { createActivity } = useActivities();
  const surface = useSurfaceColor();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('Social');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(defaultDate());
  const [time, setTime] = useState('6:30 PM');
  const [place, setPlace] = useState('');
  const [neighborhood, setNeighborhood] = useState('Williamsburg');
  // The pin starts at the neighborhood's center; tapping the map moves it
  // to the exact meeting spot. Coordinates are never fabricated from the
  // neighborhood name alone.
  const [coords, setCoords] = useState(SPOTS['Williamsburg']);
  const [spots, setSpots] = useState('8');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');

  const handleCreate = () => {
    if (!title.trim()) {
      setError('Give your quest a title.');
      return;
    }
    if (!isValidIsoDate(date)) {
      setError('Pick a real date, YYYY-MM-DD.');
      return;
    }
    if (!isValidTime12h(time)) {
      setError('Pick a time like 6:30 PM.');
      return;
    }
    const when = parseActivityDateTime(date, time.trim());
    if (!when || when.getTime() < Date.now() - 60 * 1000) {
      setError('That time is in the past. Pick a future date and time.');
      return;
    }
    if (!place.trim()) {
      setError('Add a place so people know where to meet.');
      return;
    }
    const spotsTotal = parseInt(spots, 10);
    if (Number.isNaN(spotsTotal) || spotsTotal < 2) {
      setError('Spots should be a number, at least 2.');
      return;
    }
    const input: NewActivityInput = {
      title: title.trim(),
      category,
      description: description.trim() || 'Come hang out. Details to follow.',
      date,
      time: time.trim(),
      place: place.trim(),
      neighborhood,
      latitude: coords.lat,
      longitude: coords.lng,
      spotsTotal,
      tags: tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    };
    const created = createActivity(input);
    router.replace({ pathname: '/navigation/[activity]', params: { activity: created.id } });
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ThemedText type="title">Start a quest</ThemedText>
        <ThemedText style={styles.sub}>
          Post a quest to your board. It lives on this device for now — sharing it
          with real people needs accounts, coming next.
        </ThemedText>

        <ThemedText style={styles.label}>Title</ThemedText>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Pickup Volleyball at Central Park"
          placeholderTextColor="#999"
        />

        <ThemedText style={styles.label}>Category</ThemedText>
        <View style={styles.chipWrap}>
          {CATEGORIES.map((c) => (
            <Pressable
              key={c}
              onPress={() => setCategory(c)}
              style={[styles.chip, { backgroundColor: surface }, category === c && styles.chipActive]}>
              <ThemedText style={[styles.chipText, category === c && styles.chipTextActive]}>
                {c}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        <ThemedText style={styles.label}>Description</ThemedText>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={description}
          onChangeText={setDescription}
          placeholder="What are we doing, what should people bring?"
          placeholderTextColor="#999"
          multiline
          numberOfLines={3}
        />

        <QuestDateTimePicker
          date={date}
          time={time}
          onDateChange={setDate}
          onTimeChange={setTime}
        />

        <ThemedText style={styles.label}>Place</ThemedText>
        <TextInput
          style={styles.input}
          value={place}
          onChangeText={setPlace}
          placeholder="e.g. Central Park Great Lawn"
          placeholderTextColor="#999"
        />

        <ThemedText style={styles.label}>Neighborhood</ThemedText>
        <View style={styles.chipWrap}>
          {Object.keys(SPOTS).map((n) => (
            <Pressable
              key={n}
              onPress={() => {
                setNeighborhood(n);
                setCoords(SPOTS[n]);
              }}
              style={[styles.chip, { backgroundColor: surface }, neighborhood === n && styles.chipActive]}>
              <ThemedText style={[styles.chipText, neighborhood === n && styles.chipTextActive]}>
                {n}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        <ThemedText style={styles.label}>Exact spot</ThemedText>
        <LocationPicker
          latitude={coords.lat}
          longitude={coords.lng}
          onChange={(latitude, longitude) => setCoords({ lat: latitude, lng: longitude })}
        />

        <View style={styles.row}>
          <View style={styles.half}>
            <ThemedText style={styles.label}>Spots</ThemedText>
            <TextInput
              style={styles.input}
              value={spots}
              onChangeText={setSpots}
              placeholder="8"
              placeholderTextColor="#999"
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.half}>
            <ThemedText style={styles.label}>Tags (comma separated)</ThemedText>
            <TextInput
              style={styles.input}
              value={tags}
              onChangeText={setTags}
              placeholder="volleyball, outdoors"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {error !== '' && <ThemedText style={styles.error}>{error}</ThemedText>}

        <Pressable style={styles.createButton} onPress={handleCreate}>
          <ThemedText style={styles.createButtonText}>Post quest</ThemedText>
        </Pressable>
        <Pressable style={[styles.cancelButton, { backgroundColor: surface }]} onPress={() => router.back()}>
          <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
        </Pressable>
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
    gap: 4,
  },
  sub: {
    opacity: 0.8,
    marginBottom: 12,
  },
  label: {
    fontWeight: '700',
    fontSize: 14,
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
  },
  multiline: {
    minHeight: 84,
    textAlignVertical: 'top',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
  },
  error: {
    color: '#b3271e',
    fontWeight: '600',
    marginTop: 12,
  },
  createButton: {
    backgroundColor: '#FF4D2E',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
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
  cancelButton: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    fontWeight: '600',
    fontSize: 15,
  },
});
