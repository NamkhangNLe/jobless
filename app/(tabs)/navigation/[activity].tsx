import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { QuestButton } from '@/components/QuestButton';
import { StickerCard } from '@/components/StickerCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { QUESTS } from '@/constants/quests';
import { saveQuest } from '@/lib/savedQuests';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function ActivityScreen() {
  const { activity } = useLocalSearchParams<{ activity: string }>();
  const quest = QUESTS.find((q) => q.name === activity);
  const [destination, setDestination] = React.useState('');
  const [saveError, setSaveError] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const muted = useThemeColor({}, 'textMuted');
  const border = useThemeColor({}, 'border');
  const text = useThemeColor({}, 'text');
  const card = useThemeColor({}, 'card');

  const startQuest = async () => {
    if (saving) return;
    setSaving(true);
    setSaveError(false);
    const name = quest?.name ?? String(activity ?? '');
    try {
      await saveQuest(name, destination);
      router.push({
        pathname: '/quest',
        params: { quest: name, destination },
      });
    } catch {
      // Storage failed: stay here and say so, rather than claim a save.
      setSaveError(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ThemedView style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <ThemedText type="kicker" style={{ color: muted }}>
            Quest {quest?.index ?? '--'} · detail
          </ThemedText>
          <ThemedText type="display">{activity} quest</ThemedText>
          {quest ? (
            <ThemedText style={[styles.lede, { color: muted }]}>{quest.blurb}</ThemedText>
          ) : null}
        </View>

        <StickerCard tilt={-0.5} style={styles.form}>
          <ThemedText type="kicker" style={{ color: muted }}>
            Where to?
          </ThemedText>
          <TextInput
            style={[styles.input, { borderColor: border, color: text, backgroundColor: card }]}
            onChangeText={setDestination}
            value={destination}
            placeholder="Name the spot or the plan"
            placeholderTextColor={muted}
            returnKeyType="go"
            onSubmitEditing={startQuest}
          />
          <QuestButton
            label={saving ? 'Saving...' : 'Vamanos!'}
            backgroundColor={quest?.accent}
            onPress={startQuest}
          />
          {saveError ? (
            <ThemedText style={[styles.error, { color: muted }]}>
              Could not save on this device - storage is unavailable. Nothing
              was saved, and no one was notified.
            </ThemedText>
          ) : null}
        </StickerCard>

        <View style={[styles.rule, { borderColor: border }]} />
        <ThemedText type="kicker" style={{ color: muted }}>
          Saved on this device only
        </ThemedText>
      </ScrollView>
    </ThemedView>
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
    gap: 24,
  },
  header: {
    gap: 12,
  },
  lede: {
    fontSize: 16,
    lineHeight: 24,
  },
  form: {
    gap: 16,
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    borderStyle: 'dashed',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'SpaceMono',
  },
  error: {
    fontSize: 14,
    lineHeight: 20,
  },
  rule: {
    borderTopWidth: 2,
    borderStyle: 'dashed',
    opacity: 0.4,
  },
});
