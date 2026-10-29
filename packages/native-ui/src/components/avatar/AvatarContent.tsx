import { Image, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import { getContrastText } from '../../tokens/colors';

/** Shared frame of both avatar kinds: a `dim`-sized circle filled with `background`. */
interface AvatarFrameProps {
  dim: number;
  background: string;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  testID?: string;
}

function circleStyle(dim: number, background: string): ViewStyle {
  return {
    width: dim,
    height: dim,
    borderRadius: dim / 2,
    backgroundColor: background,
    overflow: 'hidden',
  };
}

interface AvatarImageProps extends AvatarFrameProps {
  source: { uri: string } | number;
}

export function AvatarImage({
  source,
  dim,
  background,
  style,
  accessibilityLabel,
  testID,
}: AvatarImageProps) {
  const theme = useTheme();

  return (
    <View testID={testID} style={[circleStyle(dim, background), style]}>
      <Image
        source={source}
        style={styles.image}
        accessibilityLabel={accessibilityLabel ?? theme.labels.avatar}
      />
    </View>
  );
}

interface AvatarInitialsProps extends AvatarFrameProps {
  initials: string;
  fontSize: number;
}

/** Initials centered on the fill, in whichever text color contrasts with it. */
export function AvatarInitials({
  initials,
  fontSize,
  dim,
  background,
  style,
  accessibilityLabel,
  testID,
}: AvatarInitialsProps) {
  const { colors } = useTheme();
  /* The default accent fill has a designed ink; custom fills get the best one. */
  const ink = background === colors.primary ? colors.onPrimary : getContrastText(background);

  return (
    <View
      testID={testID}
      style={[circleStyle(dim, background), styles.initialsContainer, style]}
      accessibilityLabel={accessibilityLabel ?? initials}
    >
      <Text style={{ color: ink, fontSize, fontWeight: '600', lineHeight: dim }}>{initials}</Text>
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
