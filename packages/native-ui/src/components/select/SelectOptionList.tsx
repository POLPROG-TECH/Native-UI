import { useCallback } from 'react';
import { FlatList, View, useWindowDimensions } from 'react-native';
import { useTheme } from '../../theme';
import type { SelectOption } from './types';
import { SelectRow, useSelectRowAppearance } from './SelectRow';
import { selectStyles } from './selectStyles';

interface SelectOptionListProps<T extends string> {
  options: SelectOption<T>[];
  selectedValue: T | null;
  onSelect: (value: T) => void;
}

/**
 * The memoized `SelectRow` is not generic and reports a plain `string`; this
 * maps it back to the option it came from, so no cast to `T` is needed.
 */
function useOptionLookup<T extends string>(
  options: SelectOption<T>[],
  onSelect: (value: T) => void,
): (value: string) => void {
  return useCallback(
    (rowValue: string) => {
      const option = options.find((o) => o.value === rowValue);

      if (option) {
        onSelect(option.value);
      }
    },
    [options, onSelect],
  );
}

function useOptionRenderer<T extends string>({
  options,
  selectedValue,
  onSelect,
}: SelectOptionListProps<T>) {
  const appearance = useSelectRowAppearance();
  const handleRowSelect = useOptionLookup(options, onSelect);

  return useCallback(
    ({ item }: { item: SelectOption<T> }) => (
      <SelectRow
        label={item.label}
        icon={item.icon}
        value={item.value}
        isSelected={item.value === selectedValue}
        onSelect={handleRowSelect}
        appearance={appearance}
      />
    ),
    [appearance, selectedValue, handleRowSelect],
  );
}

/**
 * Hairline between options, inset to the row padding so it lines up with the
 * labels. Decorative, so screen readers skip it.
 */
function OptionSeparator() {
  const theme = useTheme();

  return (
    <View
      importantForAccessibility="no"
      accessibilityElementsHidden
      style={[
        selectStyles.separator,
        {
          backgroundColor: theme.colors.divider,
          marginHorizontal: theme.components.select.optionPaddingHorizontal,
        },
      ]}
    />
  );
}

/** Scrollable radiogroup of options, capped to a share of the window height. */
export function SelectOptionList<T extends string>(props: SelectOptionListProps<T>) {
  const tokens = useTheme().components.select;
  const { height: windowHeight } = useWindowDimensions();
  const renderOption = useOptionRenderer(props);

  return (
    <FlatList
      data={props.options}
      keyExtractor={(item) => item.value}
      style={{ maxHeight: windowHeight * tokens.listMaxHeightRatio }}
      accessibilityRole="radiogroup"
      renderItem={renderOption}
      ItemSeparatorComponent={OptionSeparator}
    />
  );
}
