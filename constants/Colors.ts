/**
 * Jobless palette — warm paper background, near-black ink, and one confident
 * coral accent. Restrained on purpose: the accent is for actions only,
 * selection states use ink. (iPhone / Instagram-grade restraint.)
 */

const tintColorLight = '#FF4D2E';
const tintColorDark = '#FF7A59';

export const Colors = {
  light: {
    text: '#191919',
    background: '#FAF8F5',
    surface: '#FFFFFF',
    tint: tintColorLight,
    icon: '#6E6E73',
    tabIconDefault: '#8E8E93',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#F5F5F7',
    background: '#101010',
    surface: '#1C1C1E',
    tint: tintColorDark,
    icon: '#98989D',
    tabIconDefault: '#98989D',
    tabIconSelected: tintColorDark,
  },
};

/** Card surface — a step above the page background. */
export const Surface = {
  light: '#FFFFFF',
  dark: '#1C1C1E',
} as const;

/** Primary action color. */
export const Accent = {
  light: '#FF4D2E',
  dark: '#FF7A59',
} as const;

/** Secondary label color (iOS secondary label). */
export const SecondaryText = {
  light: '#6E6E73',
  dark: '#98989D',
} as const;

/** iOS-style grouped input background. */
export const InputBackground = {
  light: '#F2F2F7',
  dark: '#2C2C2E',
} as const;
