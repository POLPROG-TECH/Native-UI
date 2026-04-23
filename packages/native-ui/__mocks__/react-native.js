// Minimal react-native mock for unit testing in jsdom environment
const React = require('react');

const Platform = {
  OS: 'ios',
  select: (obj) => obj.ios ?? obj.default ?? {},
};

const StyleSheet = {
  create: (styles) => styles,
  hairlineWidth: 0.5,
  flatten: (style) => {
    if (Array.isArray(style)) {
      return Object.assign({}, ...style.filter(Boolean));
    }
    return style || {};
  },
};

/**
 * Flatten RN array styles and translate RN-specific style props
 * (paddingHorizontal, marginVertical, etc.) to CSS equivalents.
 */
function flattenAndTranslate(style) {
  let flat = {};
  if (Array.isArray(style)) {
    for (const s of style) {
      if (s) Object.assign(flat, typeof s === 'object' ? s : {});
    }
  } else if (style && typeof style === 'object') {
    flat = { ...style };
  }

  // Translate RN shorthands to CSS equivalents
  if (flat.paddingHorizontal !== undefined) {
    flat.paddingLeft = flat.paddingHorizontal;
    flat.paddingRight = flat.paddingHorizontal;
    delete flat.paddingHorizontal;
  }
  if (flat.paddingVertical !== undefined) {
    flat.paddingTop = flat.paddingVertical;
    flat.paddingBottom = flat.paddingVertical;
    delete flat.paddingVertical;
  }
  if (flat.marginHorizontal !== undefined) {
    flat.marginLeft = flat.marginHorizontal;
    flat.marginRight = flat.marginHorizontal;
    delete flat.marginHorizontal;
  }
  if (flat.marginVertical !== undefined) {
    flat.marginTop = flat.marginVertical;
    flat.marginBottom = flat.marginVertical;
    delete flat.marginVertical;
  }

  return flat;
}

// Map RN components to HTML elements for jsdom rendering
const View = React.forwardRef(function View({ style, children, accessibilityRole, accessibilityState, accessibilityLabel, accessibilityLiveRegion, accessibilityElementsHidden: _aeh, importantForAccessibility: _ifa, accessible: _acc, pointerEvents: _pe, onStartShouldSetResponder: _ossr, onLayout: _onL, ...props }, ref) {
  return React.createElement('div', {
    ref,
    style: flattenAndTranslate(style),
    role: accessibilityRole,
    'aria-label': accessibilityLabel,
    'aria-disabled': accessibilityState?.disabled,
    'aria-checked': accessibilityState?.checked,
    'aria-selected': accessibilityState?.selected,
    'aria-live': accessibilityLiveRegion,
    ...props,
  }, children);
});

const Text = React.forwardRef(function Text({ style, children, accessibilityRole, accessibilityLabel, numberOfLines: _numberOfLines, ellipsizeMode: _ellipsizeMode, accessibilityElementsHidden: _aeh, importantForAccessibility: _ifa, ...props }, ref) {
  return React.createElement('span', {
    ref,
    style: flattenAndTranslate(style),
    role: accessibilityRole,
    'aria-label': accessibilityLabel,
    ...props,
  }, children);
});

const TextInput = React.forwardRef(function TextInput({ style, onChangeText, editable, accessibilityLabel, ...props }, ref) {
  return React.createElement('input', {
    ref,
    style: flattenAndTranslate(style),
    'aria-label': accessibilityLabel,
    disabled: editable === false,
    onChange: onChangeText ? (e) => onChangeText(e.target.value) : undefined,
    ...props,
  });
});

const TouchableOpacity = React.forwardRef(function TouchableOpacity({ children, style, onPress, disabled, accessibilityRole, accessibilityState, accessibilityLabel, ...props }, ref) {
  return React.createElement('div', {
    ref,
    style: flattenAndTranslate(style),
    onClick: disabled ? undefined : onPress,
    role: accessibilityRole,
    'aria-label': accessibilityLabel,
    'aria-disabled': disabled || accessibilityState?.disabled,
    'aria-selected': accessibilityState?.selected,
    'aria-checked': accessibilityState?.checked,
    ...props,
  }, children);
});

const Pressable = React.forwardRef(function Pressable({ children, style, onPress, onPressIn, onPressOut, accessibilityRole, accessibilityState, accessibilityLabel, disabled, ...props }, ref) {
  return React.createElement('div', {
    ref,
    style: typeof style === 'function' ? style({ pressed: false }) : flattenAndTranslate(style),
    onClick: disabled ? undefined : onPress,
    onMouseDown: disabled ? undefined : onPressIn,
    onMouseUp: disabled ? undefined : onPressOut,
    role: accessibilityRole || 'button',
    'aria-label': accessibilityLabel,
    'aria-disabled': disabled || accessibilityState?.disabled,
    'aria-selected': accessibilityState?.selected,
    'aria-checked': accessibilityState?.checked,
    ...props,
  }, children);
});

const ActivityIndicator = React.forwardRef(function ActivityIndicator({ color, size, ...props }, ref) {
  return React.createElement('div', { ref, role: 'progressbar', 'data-testid': 'activity-indicator', ...props });
});

const SwitchComponent = React.forwardRef(function Switch({ value, onValueChange, disabled, ...props }, ref) {
  return React.createElement('input', {
    ref,
    type: 'checkbox',
    role: 'switch',
    checked: value,
    disabled,
    onChange: !disabled && onValueChange ? () => onValueChange(!value) : undefined,
    ...props,
  });
});

const Animated = {
  View,
  Text,
  createAnimatedComponent: (c) => c,
  Value: class {
    constructor(val) { this._value = val; }
  },
  timing: jest.fn(),
  spring: jest.fn(),
};

const Image = React.forwardRef(function Image({ source, style, accessibilityLabel, ...props }, ref) {
  const src = typeof source === 'object' && source !== null ? source.uri : undefined;
  return React.createElement('img', {
    ref,
    src,
    alt: accessibilityLabel,
    'aria-label': accessibilityLabel,
    style: flattenAndTranslate(style),
    ...props,
  });
});

const Modal = function Modal({ visible, children, onRequestClose, transparent: _t, animationType: _a, ...props }) {
  if (!visible) return null;
  return React.createElement('div', {
    role: 'dialog',
    'data-onrequestclose': onRequestClose ? 'true' : undefined,
    ...props,
  }, children);
};

const KeyboardAvoidingView = React.forwardRef(function KeyboardAvoidingView({ children, style, behavior: _b, ...props }, ref) {
  return React.createElement('div', {
    ref,
    style: flattenAndTranslate(style),
    ...props,
  }, children);
});

const Alert = {
  alert: jest.fn(),
  prompt: jest.fn(),
};

const FlatList = React.forwardRef(function FlatList(
  { data, renderItem, keyExtractor, ListHeaderComponent, ListFooterComponent, accessibilityRole, style, ...props },
  ref,
) {
  const items = Array.isArray(data) ? data : [];
  return React.createElement(
    'div',
    {
      ref,
      role: accessibilityRole,
      style: flattenAndTranslate(style),
      ...props,
    },
    ListHeaderComponent && React.createElement(
      typeof ListHeaderComponent === 'function' ? ListHeaderComponent : 'div',
      null,
    ),
    items.map((item, index) => {
      const key = keyExtractor ? keyExtractor(item, index) : String(index);
      return React.createElement(React.Fragment, { key }, renderItem({ item, index }));
    }),
    ListFooterComponent && React.createElement(
      typeof ListFooterComponent === 'function' ? ListFooterComponent : 'div',
      null,
    ),
  );
});

const ScrollView = React.forwardRef(function ScrollView({ children, style, ...props }, ref) {
  return React.createElement('div', {
    ref,
    style: flattenAndTranslate(style),
    ...props,
  }, children);
});

const useWindowDimensions = () => ({ width: 375, height: 812, scale: 2, fontScale: 1 });

const Dimensions = {
  get: (_which) => ({ width: 375, height: 812, scale: 2, fontScale: 1 }),
  addEventListener: () => ({ remove: () => {} }),
};

const useColorScheme = () => 'light';

module.exports = {
  Platform,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Animated,
  Switch: SwitchComponent,
  Image,
  Modal,
  KeyboardAvoidingView,
  Alert,
  FlatList,
  ScrollView,
  Dimensions,
  useWindowDimensions,
  useColorScheme,
};
