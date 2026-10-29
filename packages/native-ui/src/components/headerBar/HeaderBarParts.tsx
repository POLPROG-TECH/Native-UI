import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SystemIcon } from '../../primitives/SystemIcon';
import { useTheme } from '../../theme';
import type { HeaderTitleAlign } from '../../tokens/components';
import { IconButton } from '../IconButton';

/** Empty box the size of the back button, keeping a centered title centered. */
export function HeaderSlotPlaceholder() {
  const { backButtonSize } = useTheme().components.headerBar;

  return <View style={{ width: backButtonSize, height: backButtonSize }} />;
}

export interface HeaderBackSlotProps {
  onBack?: () => void;
  accessibilityLabel?: string;
  testID?: string;
  renderIcon?: (props: { size: number; color: string }) => React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Render a placeholder when there is no back button. */
  reserveSpace: boolean;
}

/** Left slot: the back button, a balancing placeholder, or nothing. */
export function HeaderBackSlot(props: HeaderBackSlotProps) {
  const { onBack, renderIcon, testID } = props;
  const theme = useTheme();
  const { backIconSize } = theme.components.headerBar;
  const color = theme.colors.textPrimary;

  if (!onBack) {
    return props.reserveSpace ? <HeaderSlotPlaceholder /> : null;
  }

  return (
    <IconButton
      icon={
        renderIcon ? (
          renderIcon({ size: backIconSize, color })
        ) : (
          <SystemIcon name="chevronLeft" size={backIconSize} color={color} />
        )
      }
      onPress={onBack}
      accessibilityLabel={props.accessibilityLabel ?? theme.labels.goBack}
      size="md"
      style={props.style}
      {...(testID ? { testID } : {})}
    />
  );
}

export interface HeaderTitleProps {
  title?: string;
  renderTitle?: () => React.ReactNode;
  variant: 'regular' | 'large';
  align: HeaderTitleAlign;
  titleStyle?: StyleProp<TextStyle>;
}

interface CustomHeaderTitleProps {
  render: () => React.ReactNode;
  accessibilityLabel?: string;
  layout: TextStyle;
  align: HeaderTitleAlign;
}

function CustomHeaderTitle({ render, accessibilityLabel, layout, align }: CustomHeaderTitleProps) {
  return (
    <View
      style={[styles.title, layout, align === 'left' && styles.leftAligned]}
      accessibilityRole="header"
      accessibilityLabel={accessibilityLabel}
    >
      {render()}
    </View>
  );
}

interface TextHeaderTitleProps {
  title: string;
  variant: 'regular' | 'large';
  layout: TextStyle;
  titleStyle?: StyleProp<TextStyle>;
}

function TextHeaderTitle({ title, variant, layout, titleStyle }: TextHeaderTitleProps) {
  const theme = useTheme();
  const tokens = theme.components.headerBar;
  const typographyVariant =
    variant === 'large' ? tokens.largeTitleVariant : tokens.regularTitleVariant;

  return (
    <Text
      numberOfLines={1}
      style={[
        theme.typography[typographyVariant],
        styles.title,
        layout,
        { color: theme.colors.textPrimary },
        titleStyle,
      ]}
      accessibilityRole="header"
    >
      {title}
    </Text>
  );
}

/**
 * Title slot. A custom `renderTitle` node keeps `title` as its accessible
 * name; with neither, a flexible spacer keeps the side slots in place.
 */
export function HeaderTitle({ title, renderTitle, variant, align, titleStyle }: HeaderTitleProps) {
  const { titleGap } = useTheme().components.headerBar;
  const layout: TextStyle = { textAlign: align, marginHorizontal: titleGap };

  if (renderTitle) {
    return (
      <CustomHeaderTitle
        render={renderTitle}
        accessibilityLabel={title}
        layout={layout}
        align={align}
      />
    );
  }

  if (!title) {
    return <View style={styles.title} />;
  }

  return (
    <TextHeaderTitle title={title} variant={variant} layout={layout} titleStyle={titleStyle} />
  );
}

const styles = StyleSheet.create({
  title: {
    flex: 1,
  },
  leftAligned: {
    alignItems: 'flex-start',
  },
});
