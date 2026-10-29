import { Pressable, Text } from 'react-native';
import { useTheme } from '../../theme';
import { SystemIcon } from '../../primitives/SystemIcon';
import { buildSelectTriggerStyle } from './selectStyles';
import type { SelectState } from './useSelectState';
import { useSelectFocusRing } from './useSelectFocusRing';

interface SelectTriggerButtonProps {
  state: Pick<SelectState<string>, 'selectedOption' | 'isOpen' | 'open'>;
  /** Field label; the trigger's accessible name, falling back to the placeholder. */
  label?: string;
  /** @default labels.selectPlaceholder */
  placeholder?: string;
  error?: string;
  disabled: boolean;
}

/** The field-styled button that shows the current choice and opens the sheet. */
export function SelectTriggerButton(props: SelectTriggerButtonProps) {
  const { state, error, disabled } = props;
  const theme = useTheme();
  const placeholder = props.placeholder ?? theme.labels.selectPlaceholder;
  const selectedLabel = state.selectedOption?.label;
  const hasSelection = state.selectedOption !== undefined;
  const textColor = hasSelection ? theme.colors.textPrimary : theme.colors.textTertiary;
  const { focusProps, focusRingStyle } = useSelectFocusRing('outside');

  return (
    <Pressable
      onPress={state.open}
      {...focusProps}
      style={[buildSelectTriggerStyle(theme, Boolean(error), disabled), focusRingStyle]}
      accessibilityRole="button"
      accessibilityLabel={props.label ?? placeholder}
      accessibilityValue={hasSelection ? { text: selectedLabel } : undefined}
      accessibilityState={{ disabled, expanded: state.isOpen }}
    >
      <Text style={[theme.typography.body, { color: textColor, flex: 1 }]} numberOfLines={1}>
        {selectedLabel ?? placeholder}
      </Text>
      <SystemIcon
        name="chevronDown"
        size={theme.components.select.chevronSize}
        color={theme.colors.textTertiary}
      />
    </Pressable>
  );
}
