import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';

import { QuestButton } from '@/components/QuestButton';
import { StickerCard } from '@/components/StickerCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { listSavedQuests, type SavedQuest } from '@/lib/savedQuests';
import { QUESTS } from '@/constants/quests';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function QuestScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [saved, setSaved] = React.useState<SavedQuest | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [readFailed, setReadFailed] = React.useState(false);
  useFocusEffect(React.useCallback(() => {
    let active = true;
    setLoading(true);
    setSaved(null);
    setReadFailed(false);
    listSavedQuests().then(quests => {
      if (active) setSaved(quests.find(q => q.id === id) ?? null);
    }).catch(() => {
      if (active) setReadFailed(true);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [id]));
  const match = QUESTS.find((q) => q.name === saved?.name);

  const muted = useThemeColor({}, 'textMuted');
  const border = useThemeColor({}, 'border');
  const signal = useThemeColor({}, 'signal');

  return (
    <ThemedView style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <ThemedText type="kicker" style={{ color: muted }}>
            {loading ? 'Checking this device' : saved ? 'Quest saved' : 'No saved quest'}
          </ThemedText>
          <ThemedText type="display">{saved ? 'Vamanos!' : 'Your quest'}</ThemedText>
        </View>

        <StickerCard tilt={1} style={styles.summary}>
          <Row label="Quest" value={saved?.name || 'No saved quest found'} border={border} muted={muted} accent={match?.accent} />
          <Row
            label="Destination"
            value={saved ? saved.destination.trim() || 'Decide on the way' : '-'}
            border={border}
            muted={muted}
          />
          <Row label="Status" value={loading ? 'Checking storage...' : saved ? 'Saved on this device' : readFailed ? 'Storage unavailable' : 'Not saved'} border={border} muted={muted} last />
        </StickerCard>

        <ThemedText style={[styles.note, { color: muted }]}>
          {saved
            ? 'This quest is stored locally - no one has been notified. Friend and subscription sync are still on the roadmap.'
            : readFailed
              ? 'Could not read this device storage. We cannot confirm a save.'
              : 'No saved quest matches this link on this device. Choose a quest from the board to save a plan.'}
        </ThemedText>

        <QuestButton
          label="Back to the quest board"
          backgroundColor={signal}
          onPress={() => router.push('/explore')}
        />
      </ScrollView>
    </ThemedView>
  );
}

function Row({
  label,
  value,
  border,
  muted,
  accent,
  last,
}: {
  label: string;
  value: string;
  border: string;
  muted: string;
  accent?: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.row, !last && { borderBottomWidth: 1, borderStyle: 'dashed', borderBottomColor: border }]}>
      <ThemedText type="kicker" style={{ color: muted }}>
        {label}
      </ThemedText>
      <View style={styles.rowValue}>
        {accent ? <View style={[styles.dot, { backgroundColor: accent, borderColor: border }]} /> : null}
        <ThemedText type="defaultSemiBold">{value}</ThemedText>
      </View>
    </View>
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
    paddingTop: 96,
    paddingBottom: 48,
    gap: 24,
  },
  header: {
    gap: 12,
  },
  summary: {
    gap: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  rowValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  note: {
    fontSize: 15,
    lineHeight: 22,
  },
});
