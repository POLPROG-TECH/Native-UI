/*
 * Interactive host components of the jsdom react-native mock. Press handlers
 * map to mouse events and `disabled` suppresses them, as in RN.
 */
const React = require('react');
const { flattenAndTranslate } = require('./styles');
const { domProps, stateAria, isHiddenFromAccessibility } = require('./accessibility');

const TextInput = React.forwardRef(function TextInput(
  {
    style,
    onChangeText,
    editable,
    accessibilityLabel,
    accessibilityState,
    placeholderTextColor: _ptc,
    textAlignVertical: _tav,
    multiline: _ml,
    ...props
  },
  ref,
) {
  return React.createElement('input', {
    ref,
    style: flattenAndTranslate(style),
    'aria-label': accessibilityLabel,
    'aria-disabled': accessibilityState?.disabled,
    disabled: editable === false,
    onChange: onChangeText ? (e) => onChangeText(e.target.value) : undefined,
    ...domProps(props),
  });
});

const TouchableOpacity = React.forwardRef(function TouchableOpacity(
  {
    children,
    style,
    onPress,
    disabled,
    accessibilityRole,
    accessibilityState,
    accessibilityLabel,
    ...props
  },
  ref,
) {
  return React.createElement(
    'div',
    {
      ref,
      style: flattenAndTranslate(style),
      onClick: disabled ? undefined : onPress,
      role: accessibilityRole,
      'aria-label': accessibilityLabel,
      ...stateAria(accessibilityState, disabled),
      ...domProps(props),
    },
    children,
  );
});

const Pressable = React.forwardRef(function Pressable(
  {
    children,
    style,
    onPress,
    onPressIn,
    onPressOut,
    accessibilityRole,
    accessibilityState,
    accessibilityLabel,
    disabled,
    ...props
  },
  ref,
) {
  return React.createElement(
    'div',
    {
      ref,
      style: typeof style === 'function' ? style({ pressed: false }) : flattenAndTranslate(style),
      onClick: disabled ? undefined : onPress,
      onMouseDown: disabled ? undefined : onPressIn,
      onMouseUp: disabled ? undefined : onPressOut,
      role: accessibilityRole || 'button',
      'aria-label': accessibilityLabel,
      ...stateAria(accessibilityState, disabled),
      ...domProps(props),
    },
    children,
  );
});

const Switch = React.forwardRef(function Switch(
  {
    value,
    onValueChange,
    disabled,
    accessibilityRole,
    accessibilityState,
    accessibilityLabel,
    accessibilityElementsHidden,
    importantForAccessibility,
    accessible,
    trackColor: _trackColor,
    thumbColor: _thumbColor,
    ios_backgroundColor: _iosBg,
    style: _style,
    ...props
  },
  ref,
) {
  const hidden = isHiddenFromAccessibility({
    accessible,
    accessibilityElementsHidden,
    importantForAccessibility,
  });

  return React.createElement('input', {
    ref,
    type: 'checkbox',
    role: hidden ? undefined : accessibilityRole || 'switch',
    'aria-hidden': hidden ? true : undefined,
    'aria-label': accessibilityLabel,
    'aria-checked': accessibilityState?.checked,
    'aria-disabled': accessibilityState?.disabled,
    checked: value,
    disabled,
    onChange: !disabled && onValueChange ? () => onValueChange(!value) : undefined,
    ...domProps(props),
  });
});

module.exports = { TextInput, TouchableOpacity, Pressable, Switch };
