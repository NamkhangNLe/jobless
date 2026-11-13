import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { StickerCard } from '@/components/StickerCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { QuestButton } from '@/components/QuestButton';
import { QUESTS } from '@/constants/quests';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function HomeScreen() {
  const muted = useThemeColor({}, 'textMuted');
  const border = useThemeColor({}, 'border');
  const signal = useThemeColor({}, 'signal');

  return (
    <ThemedView style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <ThemedText type="kicker" style={{ color: muted }}>
            Jobless · Side-quest social club
          </ThemedText>
          <ThemedText type="display">Do nothing{'\n'}alone.</ThemedText>
          <ThemedText style={[styles.lede, { color: muted }]}>
            A field guide for finding people to do the small stuff with:
            the games, the errands, the wandering, the late-night snacks.
          </ThemedText>
          <View style={[styles.demoBadge, { borderColor: border }]}>
            <ThemedText type="kicker" style={{ color: muted }}>
              Demo build · local data only
            </ThemedText>
          </View>
        </View>

        <StickerCard tilt={-1} style={styles.fieldNote}>
          <ThemedText type="kicker" style={{ color: muted }}>
            Field note · origin
          </ThemedText>
          <ThemedText style={styles.fieldNoteBody}>
            Last semester I met one of my closest friends Pau, and the issue
            we had was running out of people to do side quests with.
          </ThemedText>
          <View style={[styles.noteRule, { backgroundColor: border }]} />
          <ThemedText type="kicker" style={{ color: muted }}>
            Nº 001 · recorded on campus
          </ThemedText>
        </StickerCard>

        <View style={styles.steps}>
          <Step
            index="00"
            title="Zero jobs required"
            body="Unemployed in spirit only. The only requirement is showing up."
          />
          <Step
            index="01"
            title="One-stop quest board"
            body="The plan: connect you with like-minded people looking for the
            same side quests - a study buddy, a workout partner, a collaborator."
          />
          <Step
            index="02"
            title="Pick a quest, go"
            body="When you're ready, open the board and get your life started."
          />
        </View>

        <View style={styles.chipRow}>
          {QUESTS.map((q, i) => (
            <View
              key={q.name}
              style={[
                styles.chip,
                {
                  backgroundColor: q.accent,
                  borderColor: border,
                  transform: [{ rotate: `${i % 2 === 0 ? -2 : 2}deg` }],
                },
              ]}>
              <ThemedText type="kicker" style={styles.chipText}>
                {q.name}
              </ThemedText>
            </View>
          ))}
        </View>

        <QuestButton
          label="Open the quest board"
          backgroundColor={signal}
          onPress={() => router.push('/explore')}
        />
      </ScrollView>
    </ThemedView>
  );
}

function Step({ index, title, body }: { index: string; title: string; body: string }) {
  const border = useThemeColor({}, 'border');
  const muted = useThemeColor({}, 'textMuted');
  return (
    <View style={[styles.step, { borderBottomColor: border }]}>
      <ThemedText type="kicker" style={[styles.stepIndex, { color: muted, borderColor: border }]}>
        {index}
      </ThemedText>
      <View style={styles.stepText}>
        <ThemedText type="subtitle">{title}</ThemedText>
        <ThemedText style={{ color: muted }}>{body}</ThemedText>
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
    paddingTop: 72,
    paddingBottom: 120,
    gap: 24,
  },
  hero: {
    gap: 14,
  },
  lede: {
    fontSize: 17,
    lineHeight: 26,
  },
  fieldNote: {
    gap: 10,
  },
  fieldNoteBody: {
    fontSize: 17,
    lineHeight: 26,
  },
  noteRule: {
    height: 2,
    opacity: 0.25,
  },
  steps: {
    gap: 4,
  },
  step: {
    flexDirection: 'row',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
  },
  stepIndex: {
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    height: 30,
    overflow: 'hidden',
  },
  stepText: {
    flex: 1,
    gap: 4,
  },
  demoBadge: {
    alignSelf: 'flex-start',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 2,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: {
    color: '#17150F',
  },
});
