const React = require('react');

const createAnimatedComponent = (component) => component;

/*
 * `Animated.View` / `Animated.Text` render through the react-native mock so
 * they share its style flattening, ARIA translation and testID handling.
 * Layout-animation props have no jsdom meaning and are dropped.
 */
const makePassthrough = (componentName) =>
  React.forwardRef(function AnimatedPassthrough(
    { entering: _entering, exiting: _exiting, layout: _layout, ...rest },
    ref,
  ) {
    const RN = require('react-native');

    return React.createElement(RN[componentName], { ...rest, ref });
  });

const AnimatedView = makePassthrough('View');
const AnimatedText = makePassthrough('Text');

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
  /*
   * Like the real hook, the shared value keeps its identity across renders,
   * so writes made from gesture or effect callbacks survive a re-render.
   */
  useSharedValue: jest.fn((init) => React.useRef({ value: init }).current),
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
