import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

export type QuestButtonProps = {
  label: string;
  onPress: () => void;
  backgroundColor?: string;
};

/** Primary action: solid fill, hard border, presses down onto its own shadow. */
export function QuestButton({ label, onPress, backgroundColor }: QuestButtonProps) {
  const border = useThemeColor({}, 'border');
  const tint = useThemeColor({}, 'tint');

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: backgroundColor ?? tint,
          borderColor: border,
          shadowColor: border,
        },
        pressed && styles.pressed,
      ]}>
      <ThemedText type="kicker" style={styles.label}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  pressed: {
    transform: [{ translateX: 4 }, { translateY: 4 }],
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  label: {
    color: '#17150F',
    fontSize: 14,
  },
});
