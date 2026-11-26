import { Pressable, Text } from 'react-native';
import { useFocusRing } from '../../hooks/useFocusRing';
import { renderIconSlot, type IconSlot } from '../../primitives/iconSlot';
import { SystemIcon } from '../../primitives/SystemIcon';
import { useTheme } from '../../theme';
import { bannerGlyph, bannerInk, buildActionLabelStyle, styles } from './bannerStyles';
import type { BannerVariant } from './bannerStyles';

export interface BannerAction {
  label: string;
  onPress: () => void;
  testID?: string;
}

interface BannerIconProps {
  /** Consumer icon; `false` removes the icon, `undefined` draws the variant glyph. */
  icon: IconSlot | false | undefined;
  variant: BannerVariant;
}

export function BannerIcon({ icon, variant }: BannerIconProps) {
  const theme = useTheme();
  const color = bannerInk(theme, variant);
  const size = theme.components.banner.iconSize;

  if (icon === false) {
    return null;
  }

  if (icon !== undefined) {
    return renderIconSlot(icon, { color, size });
  }

  return <SystemIcon name={bannerGlyph(variant)} color={color} size={size} />;
}

export function BannerActionButton({ label, onPress, testID }: BannerAction) {
  const theme = useTheme();
  const { focusProps, focusRingStyle } = useFocusRing();

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      {...focusProps}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={theme.components.banner.dismissHitSlop}
      style={[
        styles.action,
        { marginTop: theme.components.banner.actionMarginTop },
        focusRingStyle,
      ]}
    >
      <Text style={buildActionLabelStyle(theme)}>{label}</Text>
    </Pressable>
  );
}

interface BannerDismissProps {
  onDismiss: () => void;
  accessibilityLabel: string;
  testID?: string;
}

/** Close button; the hit slop grows the small glyph to a comfortable target. */
export function BannerDismiss({ onDismiss, accessibilityLabel, testID }: BannerDismissProps) {
  const theme = useTheme();
  const tokens = theme.components.banner;
  const { focusProps, focusRingStyle } = useFocusRing();

  return (
    <Pressable
      testID={testID}
      onPress={onDismiss}
      {...focusProps}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={tokens.dismissHitSlop}
      style={focusRingStyle}
    >
      <SystemIcon name="close" color={theme.colors.textSecondary} size={tokens.dismissIconSize} />
    </Pressable>
  );
}
