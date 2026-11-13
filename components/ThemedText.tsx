import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'display' | 'kicker' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'display' ? styles.display : undefined,
        type === 'kicker' ? styles.kicker : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 30,
    lineHeight: 34,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  display: {
    fontSize: 44,
    lineHeight: 46,
    letterSpacing: -1,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  kicker: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    fontFamily: 'SpaceMono',
  },
  subtitle: {
    fontSize: 20,
    lineHeight: 26,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    fontFamily: 'SpaceMono',
    textDecorationLine: 'underline',
  },
});
