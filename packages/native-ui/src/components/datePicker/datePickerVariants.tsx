import { Platform, View } from 'react-native';
import { useTheme } from '../../theme';
import { getNativePicker, type NativePickerComponent } from './datePickerNative';
import { ClearButton, TriggerRow, type TriggerRowProps } from './DatePickerTrigger';
import { buildCompactRowStyle, datePickerStyles } from './datePickerStyles';
import type { DatePickerModel } from './useDatePickerModel';

interface VariantProps {
  model: DatePickerModel;
  Picker: NativePickerComponent;
}

/** Trigger props that do not depend on the variant. */
function sharedTriggerProps(model: DatePickerModel) {
  return {
    icon: model.icon,
    borderColor: model.borderColor,
    disabled: model.disabled,
    label: model.label,
    onPress: model.handlers.open,
    testID: model.triggerTestID,
  } satisfies Partial<TriggerRowProps>;
}

/** iOS with a value (or no placeholder): the native compact picker inline in the field. */
function IOSCompactPicker({ model, Picker }: VariantProps) {
  const theme = useTheme();

  return (
    <View
      testID={model.triggerTestID}
      style={buildCompactRowStyle(theme, model.borderColor)}
      pointerEvents={model.disabled ? 'none' : 'auto'}
    >
      {model.icon}
      <Picker
        value={model.view.date}
        mode={model.mode}
        display="compact"
        locale={model.locale}
        {...model.constraints}
        onChange={model.handlers.nativeChange}
        themeVariant={model.themeVariant}
        style={[datePickerStyles.fill, { height: theme.components.datePicker.compactPickerHeight }]}
      />
      {model.clear && <ClearButton {...model.clear} />}
    </View>
  );
}

/**
 * iOS with an empty value and a placeholder: the compact picker cannot show a
 * placeholder, so a trigger shows it and opens the picker on press.
 */
function IOSPlaceholderPicker({ model, Picker }: VariantProps) {
  return (
    <>
      <TriggerRow
        {...sharedTriggerProps(model)}
        text={model.view.placeholderText}
        isPlaceholder
        clearButton={null}
      />
      {model.isPickerVisible && (
        <Picker
          value={model.view.date}
          mode={model.mode}
          display="default"
          locale={model.locale}
          {...model.constraints}
          onChange={model.handlers.placeholderChange}
          themeVariant={model.themeVariant}
        />
      )}
    </>
  );
}

/**
 * Android, or any platform without the optional native picker: a trigger that
 * opens the Android dialog. Without the picker it is a read-only display.
 */
function FallbackPicker({
  model,
  Picker,
}: {
  model: DatePickerModel;
  Picker: NativePickerComponent | null;
}) {
  return (
    <>
      <TriggerRow
        {...sharedTriggerProps(model)}
        text={model.view.displayText}
        isPlaceholder={model.view.showPlaceholder}
        clearButton={model.clear && <ClearButton {...model.clear} />}
      />
      {Picker && model.isPickerVisible && (
        <Picker
          value={model.dialogValue}
          mode={model.dialogMode}
          display="default"
          {...model.constraints}
          onChange={model.handlers.androidChange}
        />
      )}
    </>
  );
}

/** Picks the rendering strategy for the platform, picker availability and value. */
export function DatePickerControl({ model }: { model: DatePickerModel }) {
  const NativePicker = getNativePicker();

  if (!NativePicker || Platform.OS !== 'ios') {
    return <FallbackPicker model={model} Picker={NativePicker} />;
  }

  if (model.view.showPlaceholder) {
    return <IOSPlaceholderPicker model={model} Picker={NativePicker} />;
  }

  return <IOSCompactPicker model={model} Picker={NativePicker} />;
}
