import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { useSurfaceColor } from '@/hooks/useThemeColor';
import { formatDate } from '@/lib/store';
import { avatarColorFor } from '@/lib/activityUtils';
import { isFull, spotsLeft, type Activity } from '@/models/Activity';

/** Muted, cohesive category colors — distinct enough to scan, never garish. */
const CATEGORY_COLORS: Record<Activity['category'], string> = {
  Sports: '#2E7D9A',
  Outdoors: '#3D8B4F',
  Food: '#C96A2B',
  Study: '#5B5BD6',
  Social: '#D6336C',
  Creative: '#7D5BA6',
  Fitness: '#00897B',
  Tech: '#2563EB',
};

export function CategoryChip({ category }: { category: Activity['category'] }) {
  const color = CATEGORY_COLORS[category];
  return (
    <View style={[styles.chip, { backgroundColor: `${color}14` }]}>
      <ThemedText style={[styles.chipText, { color }]}>{category}</ThemedText>
    </View>
  );
}

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <View style={[styles.avatar, { backgroundColor: color }]}>
      <ThemedText style={styles.avatarText}>{initials}</ThemedText>
    </View>
  );
}

export function ActivityCard({
  activity,
  joined,
  onPress,
}: {
  activity: Activity;
  joined: boolean;
  onPress: () => void;
}) {
  const surface = useSurfaceColor();
  // Joining consumes a spot: the count and the "Full" state must reflect it.
  const full = isFull(activity, joined);
  const left = spotsLeft(activity, joined);
  const going = activity.attendees.length + (joined ? 1 : 0);
  // Avatars are colored per person (hashed from name), not per category —
  // the crew reads as people, not as color-coded topics.
  const hostColor = avatarColorFor(activity.host.name);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.94 : 1 }]}>
      <View style={[styles.card, { backgroundColor: surface }]}>
        <View style={styles.topRow}>
          <CategoryChip category={activity.category} />
          <ThemedText type="caption" style={styles.date}>
            {formatDate(activity.date).toUpperCase()} · {activity.time.toUpperCase()}
          </ThemedText>
        </View>

        <ThemedText style={styles.title}>{activity.title}</ThemedText>
        <ThemedText numberOfLines={2} style={styles.description}>
          {activity.description}
        </ThemedText>

        <View style={styles.divider} />

        <View style={styles.bottomRow}>
          <View style={styles.host}>
            <Avatar initials={activity.host.initials} color={hostColor} />
            <View style={styles.hostText}>
              <ThemedText style={styles.place} numberOfLines={1}>
                {activity.place}
              </ThemedText>
              <ThemedText style={styles.hostName} numberOfLines={1}>
                Hosted by {activity.host.name} · {going}/{activity.spotsTotal} in the crew
              </ThemedText>
            </View>
          </View>
          <View
            style={[
              styles.pill,
              joined ? styles.pillJoined : full ? styles.pillFull : styles.pillOpen,
            ]}>
            <ThemedText
              style={[
                styles.pillText,
                joined ? { color: '#fff' } : full ? { color: '#6E6E73' } : { color: '#1F7A3A' },
              ]}>
              {joined ? 'Joined' : full ? 'Full' : `${left} left`}
            </ThemedText>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  date: {
    opacity: 0.55,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 23,
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.75,
  },
  divider: {
    height: 1,
    backgroundColor: '#00000010',
    marginVertical: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  host: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
  },
  hostText: {
    flexShrink: 1,
    gap: 1,
  },
  place: {
    fontSize: 14,
    fontWeight: '600',
  },
  hostName: {
    fontSize: 13,
    opacity: 0.6,
  },
  pill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexShrink: 0,
  },
  pillOpen: {
    backgroundColor: '#E6F4EA',
  },
  pillJoined: {
    backgroundColor: '#FF4D2E',
  },
  pillFull: {
    backgroundColor: '#EDEDED',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
