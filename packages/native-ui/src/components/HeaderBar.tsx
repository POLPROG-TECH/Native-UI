import React from 'react';
import { View, StyleSheet, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import type { HeaderTitleAlign } from '../tokens/components';
import { HeaderBackSlot, HeaderSlotPlaceholder, HeaderTitle } from './headerBar/HeaderBarParts';

export type { HeaderTitleAlign };

export interface HeaderBarProps {
  /** Title shown between the back button and the right slot. */
  title?: string;
  /**
   * Render prop for a custom title node (e.g. a brand wordmark/logo).
   * When provided, takes precedence over `title`. The `title` string remains
   * available for fallback accessibility purposes.
   *
   * @example
   * ```tsx
   * <HeaderBar renderTitle={() => <BrandWordmark fontSize={22} />} />
   * ```
   */
  renderTitle?: () => React.ReactNode;
  /**
   * Back-button handler. The back button is only rendered if this is
   * provided. Omit it on root screens to render just a right-aligned
   * header without any left action.
   */
  onBack?: () => void;
  /** Accessibility label for the back button. @default labels.goBack */
  backAccessibilityLabel?: string;
  /** Test ID for the back button. */
  backTestID?: string;
  /**
   * Custom icon for the back button. Receives theme-aware `color` + `size`
   * so callers can stay consistent. Defaults to a left chevron.
   */
  renderBackIcon?: (props: { size: number; color: string }) => React.ReactNode;
  /** Extra styles for the back button (e.g. a bordered "card" look). */
  backButtonStyle?: StyleProp<ViewStyle>;
  /** Optional node rendered on the right side (e.g. a share `IconButton`). */
  right?: React.ReactNode;
  /**
   * When `true`, reserves the right-slot width even when `right` is not
   * provided. Keeps a centered title visually centered. Defaults to `true`
   * for centered titles and `false` for left-aligned ones.
   */
  symmetric?: boolean;
  /**
   * Visual density.
   * - `regular` (default) - `components.headerBar.regularTitleVariant`.
   * - `large`             - `components.headerBar.largeTitleVariant`, for
   *                         hero/landing screens.
   * @default 'regular'
   */
  variant?: 'regular' | 'large';
  /**
   * Title alignment. `left` gives the compact "back button + left title"
   * layout common in content apps.
   * @default theme.components.headerBar.titleAlign ('center')
   */
  titleAlign?: HeaderTitleAlign;
  /** Extra styles for the title text. */
  titleStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * Screen header: round back `IconButton` on the left, title, optional right
 * slot. Framework-agnostic - wire up navigation in the consumer. Dimensions
 * come from `theme.components.headerBar`.
 *
 * Use `renderTitle` to drop in a custom node (e.g. a brand wordmark) in place
 * of the plain-text title.
 */
export function HeaderBar(props: HeaderBarProps) {
  const { right, variant = 'regular' } = props;
  const tokens = useTheme().components.headerBar;
  const align = props.titleAlign ?? tokens.titleAlign;
  const reserveSides = props.symmetric ?? align === 'center';
  const placeholder = reserveSides ? <HeaderSlotPlaceholder /> : null;

  return (
    <View
      testID={props.testID}
      style={[styles.container, { marginBottom: tokens.marginBottom }, props.style]}
    >
      <HeaderBackSlot
        onBack={props.onBack}
        accessibilityLabel={props.backAccessibilityLabel}
        testID={props.backTestID}
        renderIcon={props.renderBackIcon}
        style={props.backButtonStyle}
        reserveSpace={reserveSides}
      />
      <HeaderTitle
        title={props.title}
        renderTitle={props.renderTitle}
        variant={variant}
        align={align}
        titleStyle={props.titleStyle}
      />
      {right !== undefined ? right : placeholder}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
