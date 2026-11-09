import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { CategoryChip } from '@/components/ActivityCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSurfaceColor } from '@/hooks/useThemeColor';
import { formatDate, useActivities } from '@/lib/store';
import { avatarColorFor } from '@/lib/activityUtils';
import { isFull, spotsLeft } from '@/models/Activity';

export default function ActivityDetailScreen() {
  const { activity: id } = useLocalSearchParams<{ activity: string }>();
  const { activities, isJoined, join, leave, deleteActivity } = useActivities();
  const surface = useSurfaceColor();

  const activity = activities.find((a) => a.id === id);

  if (!activity) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">Quest not found</ThemedText>
        <ThemedText style={styles.sub}>This quest may have been removed.</ThemedText>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ThemedText style={styles.backButtonText}>Go back</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  const joined = isJoined(activity.id);
  const full = isFull(activity, joined);
  const left = spotsLeft(activity, joined);
  const going = [...activity.attendees, ...(joined ? ['You'] : [])];

  const handleDelete = () => {
    Alert.alert('Delete this quest?', `"${activity.title}" will be removed from your board.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteActivity(activity.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <CategoryChip category={activity.category} />
        <ThemedText type="title" style={styles.title}>
          {activity.title}
        </ThemedText>

        <View style={[styles.infoCard, { backgroundColor: surface }]}>
          <View style={styles.infoRow}>
            <ThemedText type="caption" style={styles.infoLabel}>
              WHEN
            </ThemedText>
            <ThemedText style={styles.infoValue}>
              {formatDate(activity.date)} · {activity.time}
            </ThemedText>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <ThemedText type="caption" style={styles.infoLabel}>
              WHERE
            </ThemedText>
            <ThemedText style={styles.infoValue}>
              {activity.place} · {activity.neighborhood}
            </ThemedText>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <ThemedText type="caption" style={styles.infoLabel}>
              HOST
            </ThemedText>
            <ThemedText style={styles.infoValue}>{activity.host.name}</ThemedText>
          </View>
        </View>

        <ThemedText style={styles.description}>{activity.description}</ThemedText>

        <View style={[styles.spotsCard, { backgroundColor: surface }]}>
          <View style={styles.spotsHeader}>
            <ThemedText type="subtitle">
              {activity.attendees.length + (joined ? 1 : 0)}/{activity.spotsTotal} in the crew
            </ThemedText>
            <ThemedText style={styles.spotsNote}>
              {joined
                ? 'You are in'
                : full
                  ? 'This quest is full'
                  : `${left} spot${left === 1 ? '' : 's'} left`}
            </ThemedText>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.round(
                    ((activity.attendees.length + (joined ? 1 : 0)) / activity.spotsTotal) * 100,
                  )}%`,
                },
              ]}
            />
          </View>
          <ThemedText style={styles.crewNote}>
            Listed crew is a sample for now. Your join is saved on this device only —
            nobody else can see it until accounts arrive.
          </ThemedText>
        </View>

        <ThemedText type="subtitle">Who&apos;s in the crew</ThemedText>
        {going.length === 0 ? (
          <ThemedText style={styles.sub}>Nobody yet. Be the first.</ThemedText>
        ) : (
          going.map((name) => (
            <View key={name} style={styles.personRow}>
              <View style={[styles.personAvatar, { backgroundColor: avatarColorFor(name) }]}>
                <ThemedText style={styles.personInitials}>
                  {name.slice(0, 2).toUpperCase()}
                </ThemedText>
              </View>
              <ThemedText>{name}</ThemedText>
            </View>
          ))
        )}

        {activity.tags.length > 0 && (
          <View style={styles.tags}>
            {activity.tags.map((t) => (
              <View key={t} style={styles.tag}>
                <ThemedText style={styles.tagText}>#{t}</ThemedText>
              </View>
            ))}
          </View>
        )}

        {joined ? (
          <Pressable style={[styles.joinButton, styles.leaveButton]} onPress={() => leave(activity.id)}>
            <ThemedText style={styles.joinButtonText}>Leave quest</ThemedText>
          </Pressable>
        ) : (
          <Pressable
            style={[styles.joinButton, full && styles.disabledButton]}
            disabled={full}
            onPress={() => join(activity.id)}>
            <ThemedText style={styles.joinButtonText}>
              {full ? 'Quest is full' : "I'm in — join quest"}
            </ThemedText>
          </Pressable>
        )}

        <Pressable style={[styles.backButton, { backgroundColor: surface }]} onPress={() => router.back()}>
          <ThemedText style={styles.backButtonText}>Back to quests</ThemedText>
        </Pressable>

        {activity.createdByMe && (
          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <ThemedText style={styles.deleteButtonText}>Delete this quest</ThemedText>
          </Pressable>
        )}
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
    gap: 10,
  },
  title: {
    marginTop: 4,
  },
  infoCard: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
  },
  infoLabel: {
    width: 52,
    opacity: 0.5,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    flexShrink: 1,
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#0000000D',
    marginVertical: 10,
  },
  sub: {
    opacity: 0.7,
  },
  description: {
    fontSize: 16,
    lineHeight: 25,
    marginVertical: 8,
  },
  spotsCard: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  spotsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 8,
  },
  spotsNote: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F7A3A',
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EDEDED',
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF4D2E',
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  personAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#191919',
    alignItems: 'center',
    justifyContent: 'center',
  },
  personInitials: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 8,
  },
  tag: {
    backgroundColor: '#F2F2F7',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#191919',
  },
  joinButton: {
    backgroundColor: '#FF4D2E',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#FF4D2E',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  leaveButton: {
    backgroundColor: '#8E8E93',
    shadowColor: '#000',
    shadowOpacity: 0.1,
  },
  disabledButton: {
    backgroundColor: '#C7C7CC',
    shadowOpacity: 0,
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  backButton: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    fontWeight: '600',
    fontSize: 15,
  },
  crewNote: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.6,
    marginTop: 12,
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: '#E8B4AC',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    fontWeight: '600',
    fontSize: 15,
    color: '#b3271e',
  },
});
