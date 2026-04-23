const React = require('react');

const createAnimatedComponent = (component) => component;

// Lightweight passthrough used for `Animated.View` / `Animated.Text`. Renders
// a plain DOM element so children and props flow through to jsdom assertions.
// Also translates common RN accessibility props to their ARIA equivalents so
// tests can query with `getByRole` / `getByLabelText` consistently with the
// rest of the react-native mock.
const makePassthrough = (elementType) =>
  function AnimatedPassthrough({
    children,
    accessibilityLabel,
    accessibilityRole,
    accessibilityElementsHidden: _aeh,
    ...rest
  }) {
    return React.createElement(
      elementType,
      {
        ...rest,
        role: accessibilityRole,
        'aria-label': accessibilityLabel,
      },
      children,
    );
  };

const AnimatedView = makePassthrough('div');
const AnimatedText = makePassthrough('span');

const makeAnimationBuilder = () => {
  const builder = {};
  builder.duration = jest.fn(() => builder);
  builder.delay = jest.fn(() => builder);
  builder.springify = jest.fn(() => builder);
  builder.damping = jest.fn(() => builder);
  builder.build = jest.fn(() => builder);
  return builder;
};

module.exports = {
  useSharedValue: jest.fn((init) => ({ value: init })),
  useAnimatedStyle: jest.fn(() => ({})),
  withTiming: jest.fn((val) => val),
  withSpring: jest.fn((val) => val),
  withRepeat: jest.fn((val) => val),
  withSequence: jest.fn((val) => val),
  withDelay: jest.fn((_, val) => val),
  runOnJS: jest.fn((fn) => fn),
  Easing: {
    bezier: jest.fn(),
    ease: jest.fn(),
    linear: jest.fn(),
    inOut: jest.fn((fn) => fn),
    in: jest.fn((fn) => fn),
    out: jest.fn((fn) => fn),
  },
  FadeIn: makeAnimationBuilder(),
  FadeOut: makeAnimationBuilder(),
  FadeInDown: makeAnimationBuilder(),
  FadeOutDown: makeAnimationBuilder(),
  FadeInUp: makeAnimationBuilder(),
  FadeOutUp: makeAnimationBuilder(),
  SlideInDown: makeAnimationBuilder(),
  SlideOutDown: makeAnimationBuilder(),
  SlideInUp: makeAnimationBuilder(),
  SlideOutUp: makeAnimationBuilder(),
  View: AnimatedView,
  Text: AnimatedText,
  default: {
    createAnimatedComponent,
    View: AnimatedView,
    Text: AnimatedText,
  },
  createAnimatedComponent,
};
