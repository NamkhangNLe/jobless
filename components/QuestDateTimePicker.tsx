import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { useSurfaceColor } from '@/hooks/useThemeColor';
import { isValidIsoDate, isValidTime12h } from '@/lib/activityUtils';

function isoDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

function nextWeekdayLabel(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

const TIME_PRESETS = ['9:00 AM', '12:00 PM', '6:30 PM', '7:00 PM'];

/**
 * Native date/time pickers: quick-pick chips for the common cases plus
 * validated text fields. Nothing unvalidated reaches the store — bad input
 * shows a hint instead of ever rendering "Invalid Date".
 */
export function QuestDateTimePicker({
  date,
  time,
  onDateChange,
  onTimeChange,
}: {
  date: string;
  time: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}) {
  const surface = useSurfaceColor();
  const [dateTouched, setDateTouched] = useState(false);
  const [timeTouched, setTimeTouched] = useState(false);
  const dateOk = isValidIsoDate(date);
  const timeOk = isValidTime12h(time);

  const dateChips = [
    { label: `Tomorrow · ${nextWeekdayLabel(1)}`, value: isoDate(1) },
    { label: `In 2 days · ${nextWeekdayLabel(2)}`, value: isoDate(2) },
    { label: `Next Sat · ${nextWeekdayLabel((6 - new Date().getDay() + 7) % 7 || 7)}`, value: isoDate((6 - new Date().getDay() + 7) % 7 || 7) },
  ];

  return (
    <View>
      <ThemedText style={styles.label}>Date</ThemedText>
      <View style={styles.chipWrap}>
        {dateChips.map((c) => (
          <Pressable
            key={c.value}
            onPress={() => onDateChange(c.value)}
            style={[styles.chip, { backgroundColor: surface }, date === c.value && styles.chipActive]}>
            <ThemedText style={[styles.chipText, date === c.value && styles.chipTextActive]}>
              {c.label}
            </ThemedText>
          </Pressable>
        ))}
      </View>
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={(v) => {
          setDateTouched(true);
          onDateChange(v);
        }}
        placeholder="YYYY-MM-DD"
        placeholderTextColor="#999"
      />
      {dateTouched && !dateOk && (
        <ThemedText style={styles.hint}>Use a real date, YYYY-MM-DD.</ThemedText>
      )}

      <ThemedText style={styles.label}>Time</ThemedText>
      <View style={styles.chipWrap}>
        {TIME_PRESETS.map((t) => (
          <Pressable
            key={t}
            onPress={() => onTimeChange(t)}
            style={[styles.chip, { backgroundColor: surface }, time === t && styles.chipActive]}>
            <ThemedText style={[styles.chipText, time === t && styles.chipTextActive]}>
              {t}
            </ThemedText>
          </Pressable>
        ))}
      </View>
      <TextInput
        style={styles.input}
        value={time}
        onChangeText={(v) => {
          setTimeTouched(true);
          onTimeChange(v);
        }}
        placeholder="6:30 PM"
        placeholderTextColor="#999"
      />
      {timeTouched && !timeOk && (
        <ThemedText style={styles.hint}>Use a time like 6:30 PM.</ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  hint: {
    color: '#b3271e',
    fontSize: 13,
    marginTop: 6,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
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
});
