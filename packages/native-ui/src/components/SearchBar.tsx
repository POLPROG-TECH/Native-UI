import type React from 'react';
import { useMemo } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { useSearchBarState } from './searchBar/useSearchBarState';
import { SearchClearButton, SearchInput } from './searchBar/searchBarParts';
import {
  buildSearchInputStyle,
  buildSearchSlotStyles,
  searchBarStyles,
} from './searchBar/searchBarStyles';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  /** Debounce delay in ms. @default theme.components.searchBar.debounceMs (300) */
  debounceMs?: number;
  accessibilityLabel?: string;
  /**
   * Accessible name of the built-in clear button.
   * @default labels.clearSearch from `NativeUIConfig.labels`
   */
  clearAccessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  /** Test ID of the root; the input receives `{testID}-input`, the clear button `{testID}-clear`. */
  testID?: string;
  /**
   * Render prop for a leading element (e.g. search icon) placed inside the bar.
   * Takes priority over any default leading content.
   * @example
   * ```tsx
   * <SearchBar renderLeft={() => <SearchIcon />} value={q} onChangeText={setQ} />
   * ```
   */
  renderLeft?: () => React.ReactNode;
  /**
   * Render prop for a trailing element (e.g. filter button) placed at the end of the bar.
   * When provided, the built-in clear button is still rendered but this element appears after it.
   * @example
   * ```tsx
   * <SearchBar renderRight={() => <FilterButton />} value={q} onChangeText={setQ} />
   * ```
   */
  renderRight?: () => React.ReactNode;
}

/**
 * Search input with built-in debounce and clear button.
 *
 * Accepts `renderLeft` and `renderRight` render props for custom leading/trailing elements.
 *
 * @example
 * ```tsx
 * <SearchBar value={q} onChangeText={setQ} placeholder="Search..." />
 * <SearchBar
 *   value={q}
 *   onChangeText={setQ}
 *   renderLeft={() => <SearchIcon />}
 *   renderRight={() => <FilterButton />}
 * />
 * ```
 */
export function SearchBar(props: SearchBarProps) {
  const { renderLeft, renderRight, style, testID } = props;
  const search = useSearchBarState(props.value, props.onChangeText, props.debounceMs);
  const { inputStyle, slotStyles } = useSearchBarStyles(Boolean(renderLeft), Boolean(renderRight));
  const childTestID = (suffix: string) => (testID ? `${testID}-${suffix}` : undefined);

  return (
    <View testID={testID} style={[searchBarStyles.container, style]}>
      {renderLeft && <View style={slotStyles.left}>{renderLeft()}</View>}
      <SearchInput
        inputRef={search.inputRef}
        value={search.localValue}
        onChangeText={search.handleChangeText}
        style={inputStyle}
        placeholder={props.placeholder}
        accessibilityLabel={props.accessibilityLabel}
        testID={childTestID('input')}
      />
      {search.localValue.length > 0 && (
        <SearchClearButton
          style={slotStyles.clear}
          onPress={search.handleClear}
          accessibilityLabel={props.clearAccessibilityLabel}
          testID={childTestID('clear')}
        />
      )}
      {renderRight && <View style={slotStyles.right}>{renderRight()}</View>}
    </View>
  );
}

/** Theme- and slot-dependent styles, recomputed only when either changes. */
function useSearchBarStyles(hasLeft: boolean, hasRight: boolean) {
  const theme = useTheme();

  return useMemo(
    () => ({
      inputStyle: buildSearchInputStyle(theme, hasLeft, hasRight),
      slotStyles: buildSearchSlotStyles(theme, hasRight),
    }),
    [theme, hasLeft, hasRight],
  );
}
