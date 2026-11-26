import type React from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import type { Theme } from '../theme/types';
import type { HapticsInterface } from '../utils/haptics';
import { useSegmentSelection } from './segmentedControl/useSegmentSelection';
import { TabButton, type TabItem } from './tabs/TabButton';

export type { TabItem } from './tabs/TabButton';

export interface TabsProps<T extends string> {
  tabs: ReadonlyArray<TabItem<T>>;
  value: T;
  onChange: (value: T) => void;
  /**
   * Tabs keep their natural width and the row scrolls horizontally. Use it
   * when the labels do not fit side by side.
   * @default false (equal-width tabs)
   */
  scrollable?: boolean;
  /** Disables every tab. @default false */
  disabled?: boolean;
  /** Haptic played on change, or `false`. @default 'light' */
  haptic?: keyof HapticsInterface | false;
  /** Accessible name of the tab list (e.g. "Order status"). */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * Row of tabs with a line under the selected one, for switching between
 * views of the same screen. It only renders the tab row: the app shows the
 * content that matches `value`. For two to four short, equally important
 * options inside a form, use `SegmentedControl` instead. Dimensions and
 * colors come from `theme.components.tabs`.
 *
 * @example
 * ```tsx
 * <Tabs
 *   accessibilityLabel="Orders"
 *   tabs={[
 *     { value: 'open', label: 'Open' },
 *     { value: 'done', label: 'Completed' },
 *   ]}
 *   value={tab}
 *   onChange={setTab}
 * />
 * ```
 */
export function Tabs<T extends string>(props: TabsProps<T>) {
  const { tabs, value, scrollable = false, disabled = false, haptic = 'light' } = props;
  const theme = useTheme();
  const select = useSegmentSelection(value, haptic, props.onChange);
  const buttons = tabs.map((tab) => (
    <TabButton
      key={tab.value}
      tab={tab}
      selected={tab.value === value}
      disabled={disabled || tab.disabled === true}
      stretch={!scrollable}
      onSelect={select}
    />
  ));

  return (
    <View
      testID={props.testID}
      accessibilityRole="tablist"
      accessibilityLabel={props.accessibilityLabel}
      style={[styles.row, rowBorder(theme), props.style]}
    >
      {scrollable ? <ScrollableRow>{buttons}</ScrollableRow> : buttons}
    </View>
  );
}

function rowBorder(theme: Theme): ViewStyle {
  return {
    borderBottomWidth: theme.components.tabs.borderWidth,
    borderBottomColor: theme.colors.divider,
  };
}

function ScrollableRow({ children }: { children: React.ReactNode }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});
