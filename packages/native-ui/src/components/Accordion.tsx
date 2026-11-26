import type React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import type { IconSlot } from '../primitives/iconSlot';
import { useTheme } from '../theme';
import type { Theme } from '../theme/types';
import type { HapticsInterface } from '../utils/haptics';
import { AccordionHeader } from './accordion/AccordionHeader';
import { useAccordionState } from './accordion/useAccordionState';

export interface AccordionProps {
  title: string;
  /** Secondary line under the title; also read as the accessibility hint. */
  subtitle?: string;
  children: React.ReactNode;
  /** Controlled open state. Omit it to let the item manage its own. */
  expanded?: boolean;
  /** Initial state of an uncontrolled item. @default false */
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** @default false */
  disabled?: boolean;
  icon?: IconSlot;
  /** Line under the item, for stacking several items. @default true */
  divider?: boolean;
  /** Haptic played on toggle, or `false`. @default 'light' */
  haptic?: keyof HapticsInterface | false;
  style?: StyleProp<ViewStyle>;
  /** Test ID of the root; the header receives `{testID}-header`, the content `{testID}-content`. */
  testID?: string;
}

function dividerStyle(theme: Theme): ViewStyle {
  return {
    borderBottomWidth: theme.components.accordion.borderWidth,
    borderBottomColor: theme.colors.divider,
  };
}

interface AccordionContentProps {
  children: React.ReactNode;
  testID: string | undefined;
}

function AccordionContent({ children, testID }: AccordionContentProps) {
  const tokens = useTheme().components.accordion;

  return (
    <View
      testID={testID}
      style={{
        paddingHorizontal: tokens.paddingHorizontal,
        paddingBottom: tokens.contentPaddingBottom,
      }}
    >
      {children}
    </View>
  );
}

/**
 * One collapsible section: a header button that shows or hides its content.
 * Stack several to build an accordion; each item is independent, so the app
 * decides whether opening one closes the others (use `expanded`). The content
 * is not mounted while collapsed. Dimensions come from
 * `theme.components.accordion`.
 *
 * @example
 * ```tsx
 * <Accordion title="Shipping" subtitle="2 to 4 business days">
 *   <Text>Orders placed before noon ship the same day.</Text>
 * </Accordion>
 * ```
 */
export function Accordion(props: AccordionProps) {
  const { disabled = false, divider = true, haptic = 'light', testID } = props;
  const theme = useTheme();
  const { isExpanded, toggle } = useAccordionState({
    expanded: props.expanded,
    defaultExpanded: props.defaultExpanded ?? false,
    haptic,
    onExpandedChange: props.onExpandedChange,
  });

  return (
    <View testID={testID} style={[divider && dividerStyle(theme), props.style]}>
      <AccordionHeader
        title={props.title}
        subtitle={props.subtitle}
        icon={props.icon}
        expanded={isExpanded}
        disabled={disabled}
        onToggle={toggle}
        testID={testID ? `${testID}-header` : undefined}
      />
      {isExpanded ? (
        <AccordionContent testID={testID ? `${testID}-content` : undefined}>
          {props.children}
        </AccordionContent>
      ) : null}
    </View>
  );
}
