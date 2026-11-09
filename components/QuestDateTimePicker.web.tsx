import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { formatTime12h, parseTime12h } from '@/lib/activityUtils';

function to24h(time12: string): string {
  const p = parseTime12h(time12);
  if (!p) return '';
  return `${String(p.hour24).padStart(2, '0')}:${String(p.minute).padStart(2, '0')}`;
}

function from24h(time24: string): string | null {
  const m = /^(\d{2}):(\d{2})$/.exec(time24);
  if (!m) return null;
  return formatTime12h(Number(m[1]), Number(m[2]));
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#F2F2F7',
  border: 'none',
  borderRadius: 12,
  padding: '13px 14px',
  fontSize: 16,
  fontFamily: 'inherit',
  color: '#191919',
  boxSizing: 'border-box',
};

/**
 * Web date/time pickers: real native HTML inputs (calendar + clock),
 * not free text. The create form stores ISO date + 12-hour display time.
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
  return (
    <View style={styles.row}>
      <View style={styles.half}>
        <ThemedText style={styles.label}>Date</ThemedText>
        <input
          type="date"
          aria-label="Quest date"
          value={date}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onDateChange(e.target.value)}
          style={inputStyle}
        />
      </View>
      <View style={styles.half}>
        <ThemedText style={styles.label}>Time</ThemedText>
        <input
          type="time"
          aria-label="Quest time"
          value={to24h(time)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const next = from24h(e.target.value);
            if (next) onTimeChange(next);
          }}
          style={inputStyle}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
  },
  label: {
    fontWeight: '700',
    fontSize: 14,
    marginTop: 12,
    marginBottom: 6,
  },
});
