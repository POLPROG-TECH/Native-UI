import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusRing } from '../../hooks/useFocusRing';
import { renderIconSlot, type IconSlot } from '../../primitives/iconSlot';
import { SystemIcon } from '../../primitives/SystemIcon';
import { useTheme } from '../../theme';
import type { Theme } from '../../theme/types';
import { accessibilityStateProps } from '../../utils/accessibilityStateProps';

export interface AccordionHeaderProps {
  title: string;
  subtitle: string | undefined;
  icon: IconSlot | undefined;
  expanded: boolean;
  disabled: boolean;
  onToggle: () => void;
  testID: string | undefined;
}

function AccordionTitles({ title, subtitle }: Pick<AccordionHeaderProps, 'title' | 'subtitle'>) {
  const theme = useTheme();
  const tokens = theme.components.accordion;

  return (
    <View style={styles.titles}>
      <Text style={[theme.typography[tokens.titleVariant], { color: theme.colors.textPrimary }]}>
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={[theme.typography[tokens.subtitleVariant], { color: theme.colors.textSecondary }]}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

function headerStyle(theme: Theme, disabled: boolean) {
  const tokens = theme.components.accordion;

  return [
    styles.header,
    {
      gap: tokens.gap,
      minHeight: tokens.headerMinHeight,
      paddingVertical: tokens.headerPaddingVertical,
      paddingHorizontal: tokens.paddingHorizontal,
    },
    disabled && { opacity: theme.opacity.disabled },
  ];
}

export function AccordionHeader(props: AccordionHeaderProps) {
  const { expanded, disabled } = props;
  const theme = useTheme();
  const { focusProps, focusRingStyle } = useFocusRing();
  const iconColor = theme.colors.textSecondary;

  return (
    <Pressable
      testID={props.testID}
      onPress={props.onToggle}
      {...focusProps}
      disabled={disabled}
      accessibilityLabel={props.title}
      accessibilityHint={props.subtitle}
      {...accessibilityStateProps('button', { expanded, disabled })}
      style={[headerStyle(theme, disabled), focusRingStyle]}
    >
      {renderIconSlot(props.icon, { color: iconColor, size: theme.iconSize.md })}
      <AccordionTitles title={props.title} subtitle={props.subtitle} />
      <SystemIcon
        name={expanded ? 'chevronUp' : 'chevronDown'}
        color={iconColor}
        size={theme.components.accordion.chevronSize}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titles: {
    flex: 1,
  },
});
