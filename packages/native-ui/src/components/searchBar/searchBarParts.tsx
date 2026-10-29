import type React from 'react';
import {
  TextInput,
  TouchableOpacity,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useFocusRing } from '../../hooks/useFocusRing';
import { useTheme } from '../../theme';
import { SystemIcon } from '../../primitives/SystemIcon';

type TextInputRef = React.ComponentRef<typeof TextInput>;

interface SearchInputProps {
  inputRef: React.RefObject<TextInputRef | null>;
  value: string;
  onChangeText: (text: string) => void;
  style: StyleProp<TextStyle>;
  placeholder?: string;
  /** Falls back to `placeholder`, which describes what the field searches. */
  accessibilityLabel?: string;
  testID?: string;
}

export function SearchInput({ inputRef, accessibilityLabel, ...props }: SearchInputProps) {
  const theme = useTheme();

  return (
    <TextInput
      ref={inputRef}
      testID={props.testID}
      style={props.style}
      placeholder={props.placeholder}
      placeholderTextColor={theme.colors.textTertiary}
      value={props.value}
      onChangeText={props.onChangeText}
      returnKeyType="search"
      accessibilityLabel={accessibilityLabel ?? props.placeholder}
    />
  );
}

interface SearchClearButtonProps {
  style: ViewStyle[];
  onPress: () => void;
  /** @default labels.clearSearch */
  accessibilityLabel?: string;
  /** The icon receives `{testID}-icon`. */
  testID?: string;
}

export function SearchClearButton({
  style,
  onPress,
  accessibilityLabel,
  testID,
}: SearchClearButtonProps) {
  const theme = useTheme();
  const tokens = theme.components.searchBar;
  const slop = tokens.clearHitSlop;
  const { focusProps, focusRingStyle } = useFocusRing();

  return (
    <TouchableOpacity
      testID={testID}
      style={[...style, focusRingStyle]}
      onPress={onPress}
      {...focusProps}
      hitSlop={{ top: slop, bottom: slop, left: slop, right: slop }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? theme.labels.clearSearch}
    >
      <SystemIcon
        name="close"
        size={tokens.clearIconSize}
        color={theme.colors.textTertiary}
        testID={testID ? `${testID}-icon` : undefined}
      />
    </TouchableOpacity>
  );
}
