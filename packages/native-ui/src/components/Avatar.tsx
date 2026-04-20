import { StyleSheet, View, Text, Image, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { getContrastText } from '../tokens/colors';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  /** Image URI */
  source?: { uri: string } | number;
  /** Initials to display when no image is available (1-2 characters) */
  initials?: string;
  /**
   * Full display name used to derive initials automatically when `initials`
   * is not supplied. Takes the first character of the first two words.
   */
  name?: string;
  /** Background color for initials avatar (defaults to primary) */
  color?: string;
  size?: AvatarSize;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

const SIZE_MAP = { sm: 28, md: 36, lg: 48, xl: 64 } as const;
const FONT_MAP = { sm: 11, md: 14, lg: 18, xl: 24 } as const;

/**
 * Circular avatar showing an image or initials.
 */
export function Avatar({
  source,
  initials,
  name,
  color,
  size = 'md',
  style,
  accessibilityLabel,
}: AvatarProps) {
  const theme = useTheme();
  const dim = SIZE_MAP[size];
  const fontSize = FONT_MAP[size];
  const bg = color ?? theme.colors.primary;

  const containerStyle: ViewStyle = {
    width: dim,
    height: dim,
    borderRadius: dim / 2,
    backgroundColor: bg,
    overflow: 'hidden',
  };

  if (source) {
    return (
      <View style={[containerStyle, style]}>
        <Image
          source={source}
          style={styles.image}
          accessibilityLabel={accessibilityLabel ?? 'Avatar'}
        />
      </View>
    );
  }

  const textColor = getContrastText(bg);
  const derivedFromName = name
    ? name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w.charAt(0))
        .join('')
    : undefined;
  const displayInitials = (initials ?? derivedFromName ?? '?').slice(0, 2).toUpperCase();

  return (
    <View
      style={[containerStyle, styles.initialsContainer, style]}
      accessibilityLabel={accessibilityLabel ?? displayInitials}
    >
      <Text
        style={{
          color: textColor,
          fontSize,
          fontWeight: '600',
          lineHeight: dim,
        }}
      >
        {displayInitials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  initialsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
