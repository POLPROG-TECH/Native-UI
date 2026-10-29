import type { StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { AvatarImage, AvatarInitials } from './avatar/AvatarContent';
import { resolveInitials } from './avatar/initials';

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
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  testID?: string;
}

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
  testID,
}: AvatarProps) {
  const theme = useTheme();
  const { size: dim, fontSize } = theme.components.avatar[size];
  const background = color ?? theme.colors.primary;
  const frame = { dim, background, style, accessibilityLabel, testID };

  if (source) {
    return <AvatarImage source={source} {...frame} />;
  }

  return (
    <AvatarInitials initials={resolveInitials(initials, name)} fontSize={fontSize} {...frame} />
  );
}
