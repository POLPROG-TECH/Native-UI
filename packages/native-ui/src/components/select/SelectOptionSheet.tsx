import { Text } from 'react-native';
import { useTheme } from '../../theme';
import { BottomSheet } from '../BottomSheet';
import { Button } from '../Button';
import type { SelectProps } from './types';
import { SelectOptionList } from './SelectOptionList';
import { selectStyles } from './selectStyles';
import type { SelectState } from './useSelectState';

/** Reads the title, options and captions straight from the Select props. */
type SelectOptionSheetProps<T extends string> = Pick<
  SelectProps<T>,
  'label' | 'options' | 'cancelLabel' | 'closeAccessibilityLabel'
> & {
  state: Pick<SelectState<T>, 'isOpen' | 'resolvedValue' | 'select' | 'close'>;
  testID?: string;
};

/**
 * The option list in a `BottomSheet`, so it shares the sheet's handle, drag
 * and escape-gesture dismissal, keyboard avoidance, safe area, width cap and
 * theming. Cancel closes without notifying `onChange`.
 */
export function SelectOptionSheet<T extends string>(props: SelectOptionSheetProps<T>) {
  const { state, label } = props;
  const theme = useTheme();
  const radius = theme.components.select.sheetRadius;

  return (
    <BottomSheet
      visible={state.isOpen}
      onClose={state.close}
      closeAccessibilityLabel={props.closeAccessibilityLabel}
      style={{ borderTopLeftRadius: radius, borderTopRightRadius: radius }}
      testID={props.testID}
    >
      {label && <SheetTitle title={label} />}
      <BottomSheet.Body style={selectStyles.flushBody}>
        <SelectOptionList
          options={props.options}
          selectedValue={state.resolvedValue}
          onSelect={state.select}
        />
      </BottomSheet.Body>
      <SheetCancelFooter label={props.cancelLabel ?? theme.labels.cancel} onPress={state.close} />
    </BottomSheet>
  );
}

/** Full-width secondary action, laid out like any other sheet footer. */
function SheetCancelFooter({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <BottomSheet.Footer layout="stacked">
      <Button title={label} variant="secondary" onPress={onPress} fullWidth />
    </BottomSheet.Footer>
  );
}

function SheetTitle({ title }: { title: string }) {
  const theme = useTheme();

  return (
    <BottomSheet.Header>
      <Text
        style={[theme.typography.h3, { color: theme.colors.textPrimary }]}
        accessibilityRole="header"
      >
        {title}
      </Text>
    </BottomSheet.Header>
  );
}
