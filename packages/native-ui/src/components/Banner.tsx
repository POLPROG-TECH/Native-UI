import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import type { IconSlot } from '../primitives/iconSlot';
import { useTheme } from '../theme';
import {
  BannerActionButton,
  BannerDismiss,
  BannerIcon,
  type BannerAction,
} from './banner/BannerParts';
import {
  BANNER_VARIANTS,
  buildBannerStyle,
  buildMessageStyle,
  buildTitleStyle,
  styles,
  type BannerVariant,
} from './banner/bannerStyles';

export { BANNER_VARIANTS } from './banner/bannerStyles';
export type { BannerVariant } from './banner/bannerStyles';
export type { BannerAction } from './banner/BannerParts';

export interface BannerProps {
  message: string;
  title?: string;
  /** @default 'info' */
  variant?: BannerVariant;
  /** Replaces the variant glyph; `false` hides the icon. */
  icon?: IconSlot | false;
  /** One text action under the message (e.g. "Retry"). */
  action?: BannerAction;
  /** Shows a close button and is called when it is pressed. */
  onDismiss?: () => void;
  /**
   * Accessible name of the close button.
   * @default labels.dismiss from `NativeUIConfig.labels`
   */
  dismissAccessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  /** Test ID of the root; the close button receives `{testID}-dismiss`. */
  testID?: string;
}

/**
 * Title and message as one accessibility element with the alert role. The
 * group stops there on purpose: wrapping the whole banner would hide the
 * action and the close button from VoiceOver.
 */
function BannerText({ title, message }: Pick<BannerProps, 'title' | 'message'>) {
  const theme = useTheme();

  return (
    <View
      accessible
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      accessibilityLabel={title ? `${title}. ${message}` : message}
    >
      {title ? <Text style={buildTitleStyle(theme)}>{title}</Text> : null}
      <Text style={buildMessageStyle(theme, Boolean(title))}>{message}</Text>
    </View>
  );
}

/**
 * Inline message that stays in the layout until the app removes it: a status,
 * a warning or an error that belongs to the screen, unlike a Toast, which
 * floats and leaves on its own. Announced as an alert. Dimensions come from
 * `theme.components.banner`.
 *
 * @example
 * ```tsx
 * <Banner
 *   variant="warning"
 *   title="Offline"
 *   message="Changes will sync when you are back online."
 *   action={{ label: 'Retry', onPress: retry }}
 *   onDismiss={hide}
 * />
 * ```
 */
export function Banner(props: BannerProps) {
  const { message, title, variant = BANNER_VARIANTS.info, onDismiss } = props;
  const theme = useTheme();

  return (
    <View testID={props.testID} style={buildBannerStyle(theme, variant, props.style)}>
      <BannerIcon icon={props.icon} variant={variant} />
      <View style={styles.body}>
        <BannerText title={title} message={message} />
        {props.action ? <BannerActionButton {...props.action} /> : null}
      </View>
      {onDismiss ? (
        <BannerDismiss
          onDismiss={onDismiss}
          accessibilityLabel={props.dismissAccessibilityLabel ?? theme.labels.dismiss}
          testID={props.testID ? `${props.testID}-dismiss` : undefined}
        />
      ) : null}
    </View>
  );
}
