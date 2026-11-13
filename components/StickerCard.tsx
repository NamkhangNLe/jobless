import { StyleSheet, View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type StickerCardProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  /** Slight rotation for the sticker look, e.g. -1 or 1. */
  tilt?: number;
};

/** A card with a hard ink border and offset shadow, like a stuck-on label. */
export function StickerCard({ style, lightColor, darkColor, tilt = 0, ...otherProps }: StickerCardProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'card');
  const borderColor = useThemeColor({}, 'border');
  const shadowColor = useThemeColor({ light: '#17150F', dark: '#000000' }, 'border');

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor,
          borderColor,
          shadowColor,
          transform: [{ rotate: `${tilt}deg` }],
        },
        style,
      ]}
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: 14,
    padding: 16,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
});
