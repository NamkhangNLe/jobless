import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import { StickerCard } from '@/components/StickerCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { QUESTS, type Quest } from '@/constants/quests';
import { listSavedQuests, removeQuest, type SavedQuest } from '@/lib/savedQuests';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function QuestBoardScreen() {
  const muted = useThemeColor({}, 'textMuted');
  const border = useThemeColor({}, 'border');
  const [saved, setSaved] = React.useState<SavedQuest[]>([]);

  // Reload every time the board gains focus, so a just-saved quest shows up.
  useFocusEffect(
    React.useCallback(() => {
      let active = true;
      listSavedQuests()
        .then((quests) => {
          if (active) setSaved(quests);
        })
        .catch(() => {
          if (active) setSaved([]);
        });
      return () => {
        active = false;
      };
    }, [])
  );

  return (
    <ThemedView style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <ThemedText type="kicker" style={{ color: muted }}>
            The board · {QUESTS.length} starter quests
          </ThemedText>
          <ThemedText type="display">Quest Board</ThemedText>
          <ThemedText style={[styles.lede, { color: muted }]}>
            The five quests baked into this build. Subscriptions and friends
            sync are still on the roadmap, so everything here lives on this
            device. Tap a card to set a destination.
          </ThemedText>
        </View>

        {saved.length > 0 ? (
          <View style={styles.savedSection}>
            <ThemedText type="kicker" style={{ color: muted }}>
              My quests · saved on this device
            </ThemedText>
            {saved.map((quest) => (
              <SavedQuestRow
                key={quest.id}
                quest={quest}
                onRemove={async () => {
                  await removeQuest(quest.id);
                  setSaved((current) => current.filter((q) => q.id !== quest.id));
                }}
              />
            ))}
          </View>
        ) : null}

        <ThemedText type="kicker" style={{ color: muted }}>
          Starter quests
        </ThemedText>
        {QUESTS.map((quest, i) => (
          <QuestCard key={quest.name} quest={quest} tilt={i % 2 === 0 ? -0.75 : 0.75} />
        ))}
        <View style={[styles.footerRule, { borderColor: border }]} />
        <ThemedText type="kicker" style={[styles.footerNote, { color: muted }]}>
          Demo build · no one is notified · nothing leaves this device
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

function SavedQuestRow({ quest, onRemove }: { quest: SavedQuest; onRemove: () => void }) {
  const muted = useThemeColor({}, 'textMuted');
  const border = useThemeColor({}, 'border');
  const match = QUESTS.find((q) => q.name === quest.name);
  const when = new Date(quest.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  return (
    <StickerCard style={styles.savedCard}>
      <View style={styles.savedTop}>
        <View style={styles.savedTitleRow}>
          {match ? (
            <View style={[styles.dot, { backgroundColor: match.accent, borderColor: border }]} />
          ) : null}
          <ThemedText type="subtitle">{quest.name}</ThemedText>
        </View>
        <Pressable accessibilityRole="button" onPress={onRemove} hitSlop={8}>
          <ThemedText type="kicker" style={{ color: muted }}>
            Remove
          </ThemedText>
        </Pressable>
      </View>
      <ThemedText style={{ color: muted }}>
        {quest.destination.trim() ? quest.destination : 'Decide on the way'} · {when}
      </ThemedText>
    </StickerCard>
  );
}

function QuestCard({ quest, tilt }: { quest: Quest; tilt: number }) {
  const muted = useThemeColor({}, 'textMuted');
  const border = useThemeColor({}, 'border');

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() =>
        router.push({
          pathname: '/navigation/[activity]',
          params: { activity: quest.name },
        })
      }
      style={({ pressed }) => [pressed && styles.pressed]}>
      <StickerCard tilt={tilt} style={styles.card}>
        <View style={styles.cardTop}>
          <View style={[styles.indexChip, { backgroundColor: quest.accent, borderColor: border }]}>
            <ThemedText type="kicker" style={styles.chipText}>
              {quest.index}
            </ThemedText>
          </View>
          <ThemedText type="kicker" style={{ color: muted }}>
            Open →
          </ThemedText>
        </View>
        <ThemedText type="title">{quest.name}</ThemedText>
        <ThemedText style={{ color: muted }}>{quest.blurb}</ThemedText>
      </StickerCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
    width: '100%',
    maxWidth: 620,
  },
  content: {
    padding: 20,
    paddingTop: 72,
    paddingBottom: 120,
    gap: 20,
  },
  header: {
    gap: 12,
    marginBottom: 4,
  },
  lede: {
    fontSize: 16,
    lineHeight: 24,
  },
  savedSection: {
    gap: 12,
  },
  savedCard: {
    gap: 8,
  },
  savedTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savedTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  pressed: {
    opacity: 0.85,
  },
  card: {
    gap: 10,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  indexChip: {
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  chipText: {
    color: '#17150F',
  },
  footerRule: {
    borderTopWidth: 2,
    borderStyle: 'dashed',
    opacity: 0.4,
  },
  footerNote: {
    textAlign: 'center',
  },
});
