/*
 * Layout and content host components of the jsdom react-native mock. Each
 * maps to the closest HTML element so Testing Library queries work.
 */
const React = require('react');
const { flattenAndTranslate } = require('./styles');
const { domProps, stateAria } = require('./accessibility');

const View = React.forwardRef(function View(
  {
    style,
    children,
    accessibilityRole,
    accessibilityState,
    accessibilityLabel,
    accessibilityLiveRegion,
    accessibilityElementsHidden: _aeh,
    importantForAccessibility: _ifa,
    accessible: _acc,
    pointerEvents: _pe,
    onStartShouldSetResponder: _ossr,
    onLayout: _onL,
    ...props
  },
  ref,
) {
  return React.createElement(
    'div',
    {
      ref,
      style: flattenAndTranslate(style),
      role: accessibilityRole,
      'aria-label': accessibilityLabel,
      ...stateAria(accessibilityState),
      'aria-live': accessibilityLiveRegion,
      ...domProps(props),
    },
    children,
  );
});

const Text = React.forwardRef(function Text(
  {
    style,
    children,
    accessibilityRole,
    accessibilityLabel,
    accessibilityLiveRegion,
    numberOfLines: _numberOfLines,
    ellipsizeMode: _ellipsizeMode,
    accessibilityElementsHidden: _aeh,
    importantForAccessibility: _ifa,
    ...props
  },
  ref,
) {
  return React.createElement(
    'span',
    {
      ref,
      style: flattenAndTranslate(style),
      role: accessibilityRole,
      'aria-label': accessibilityLabel,
      'aria-live': accessibilityLiveRegion,
      ...domProps(props),
    },
    children,
  );
});

const Image = React.forwardRef(function Image(
  { source, style, accessibilityLabel, ...props },
  ref,
) {
  const src = typeof source === 'object' && source !== null ? source.uri : undefined;

  return React.createElement('img', {
    ref,
    src,
    alt: accessibilityLabel,
    'aria-label': accessibilityLabel,
    style: flattenAndTranslate(style),
    ...domProps(props),
  });
});

/** Plain styled container, shared by ScrollView and KeyboardAvoidingView. */
function createContainer(displayName) {
  const Container = React.forwardRef(function Container(
    { children, style, behavior: _b, ...props },
    ref,
  ) {
    return React.createElement(
      'div',
      { ref, style: flattenAndTranslate(style), ...domProps(props) },
      children,
    );
  });
  Container.displayName = displayName;

  return Container;
}

const ScrollView = createContainer('ScrollView');
const KeyboardAvoidingView = createContainer('KeyboardAvoidingView');

const ActivityIndicator = React.forwardRef(function ActivityIndicator(
  { color: _color, size: _size, ...props },
  ref,
) {
  return React.createElement('div', {
    ref,
    role: 'progressbar',
    'data-testid': 'activity-indicator',
    ...domProps(props),
  });
});

const Animated = {
  View,
  Text,
  createAnimatedComponent: (c) => c,
  Value: class {
    constructor(val) {
      this._value = val;
    }
  },
  timing: jest.fn(),
  spring: jest.fn(),
};

module.exports = {
  View,
  Text,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Animated,
};
